import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { RedisService } from '../../core/redis/redis.service';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      email: string;
      role: string;
      companyId: string | null;
      branchId: string | null;
      permissions: string[];
      userType: 'platform_owner' | 'user' | 'customer';
    };
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '') ||
        (client.handshake.query?.token as string);

      if (!token) {
        this.logger.warn(
          `Client connection rejected: Missing token (socket ${client.id})`,
        );
        client.disconnect();
        return;
      }

      const secret =
        this.configService.get<string>('jwt.accessSecret') ||
        process.env.JWT_ACCESS_SECRET ||
        'prime_one_access_secret_key_2026_super_secure_entropy_string';

      const payload = this.jwtService.verify(token, { secret });
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        companyId: payload.companyId || null,
        branchId: payload.branchId || null,
        permissions: payload.permissions || [],
        userType: payload.userType,
      };

      const user = client.data.user;
      this.logger.log(
        `Socket connected: ${user.email} (${user.userType}/${user.role}) [id: ${client.id}]`,
      );

      // Auto-join user room
      client.join(`user:${user.id}`);

      // Auto-join company room
      if (user.companyId) {
        client.join(`company:${user.companyId}`);

        // If staff agent or platform owner, join agents queue room
        if (user.userType !== 'customer') {
          client.join(`company:${user.companyId}:agents`);
        }

        // Persist presence into Redis for instant visibility
        await this.redisService.addToSet(
          `presence:company:${user.companyId}`,
          user.id,
        );
        await this.redisService.set(
          `presence:user:${user.id}`,
          JSON.stringify({
            userId: user.id,
            email: user.email,
            userType: user.userType,
            role: user.role,
            socketId: client.id,
            status: 'online',
            connectedAt: new Date().toISOString(),
          }),
          86400, // 24h
        );

        // Broadcast presence
        this.server.to(`company:${user.companyId}`).emit('presence:update', {
          userId: user.id,
          userEmail: user.email,
          userType: user.userType,
          isOnline: true,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      this.logger.warn(`Socket auth failed (socket ${client.id}): ${err.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const user = client.data?.user;
    if (user && user.companyId) {
      this.logger.log(`Socket disconnected: ${user.email} [id: ${client.id}]`);

      // Update Redis presence
      await this.redisService.removeFromSet(
        `presence:company:${user.companyId}`,
        user.id,
      );
      await this.redisService.set(
        `presence:user:${user.id}`,
        JSON.stringify({
          userId: user.id,
          email: user.email,
          userType: user.userType,
          role: user.role,
          status: 'offline',
          lastSeen: new Date().toISOString(),
        }),
        86400,
      );

      this.server.to(`company:${user.companyId}`).emit('presence:update', {
        userId: user.id,
        userEmail: user.email,
        userType: user.userType,
        isOnline: false,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('chat:join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!data?.conversationId) return;
    const room = `conversation:${data.conversationId}`;
    client.join(room);
    this.logger.log(
      `User ${client.data.user?.email || client.id} joined room ${room}`,
    );
    return { status: 'joined', conversationId: data.conversationId };
  }

  @SubscribeMessage('chat:leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!data?.conversationId) return;
    const room = `conversation:${data.conversationId}`;
    client.leave(room);
    return { status: 'left', conversationId: data.conversationId };
  }

  @SubscribeMessage('chat:send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      messageType?:
        | 'text'
        | 'image'
        | 'voice'
        | 'video'
        | 'document'
        | 'system'
        | 'ticket_created'
        | 'payment_proof';
      isInternalNote?: boolean;
      fileUrl?: string;
      fileName?: string;
    },
  ) {
    const user = client.data.user;
    if (!user || !user.companyId) {
      return { error: 'Unauthorized' };
    }

    const senderType = user.userType === 'customer' ? 'customer' : 'staff';
    const senderName =
      user.userType === 'customer'
        ? user.email.split('@')[0]
        : `Support Agent (${user.email.split('@')[0]})`;

    const message = await this.chatService.sendMessage(
      user.companyId,
      {
        conversationId: data.conversationId,
        content: data.content,
        messageType: data.messageType || 'text',
        isInternalNote: Boolean(data.isInternalNote),
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        senderType,
        senderName,
      },
      senderType === 'staff' ? user.id : undefined,
      senderType === 'customer' ? user.id : undefined,
    );

    const room = `conversation:${data.conversationId}`;

    if (data.isInternalNote) {
      // Internal notes are only broadcast to company agents
      this.server
        .to(`company:${user.companyId}:agents`)
        .emit('chat:new_message', message);
    } else {
      // Broadcast to both parties in the conversation room
      this.server.to(room).emit('chat:new_message', message);

      // Also notify company agents inbox about latest message
      this.server
        .to(`company:${user.companyId}:agents`)
        .emit('conversation:updated', {
          conversationId: data.conversationId,
          lastMessage: data.content,
          lastMessageAt: message.createdAt,
        });
    }

    return { status: 'delivered', message };
  }

  @SubscribeMessage('chat:typing_start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user;
    if (!user || !data?.conversationId) return;

    client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
      conversationId: data.conversationId,
      userId: user.id,
      userName: user.email.split('@')[0],
      isTyping: true,
    });
  }

  @SubscribeMessage('chat:typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    const user = client.data.user;
    if (!user || !data?.conversationId) return;

    client.to(`conversation:${data.conversationId}`).emit('chat:typing', {
      conversationId: data.conversationId,
      userId: user.id,
      userName: user.email.split('@')[0],
      isTyping: false,
    });
  }

  @SubscribeMessage('chat:mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; messageId: string },
  ) {
    const user = client.data.user;
    if (!user || !user.companyId) return;

    await this.chatService.markMessageRead(
      user.companyId,
      data.conversationId,
      data.messageId,
    );

    this.server
      .to(`conversation:${data.conversationId}`)
      .emit('chat:message_read', {
        conversationId: data.conversationId,
        messageId: data.messageId,
        readAt: new Date().toISOString(),
      });

    return { status: 'read', messageId: data.messageId };
  }

  @SubscribeMessage('noc:trigger_telemetry_alert')
  handleTelemetryAlert(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    alert: {
      oltHostname?: string;
      ponPort?: string;
      fatBox?: string;
      dropDbm?: number;
      severity?: 'warning' | 'critical' | 'info';
      message?: string;
      customerCode?: string;
    },
  ) {
    const user = client.data.user;
    if (!user || !user.companyId) return;

    const payload = {
      id: `alert-${Date.now()}`,
      oltHostname: alert.oltHostname || 'ISB-F10-OLT-01',
      ponPort: alert.ponPort || 'EPON0/1:4',
      fatBox: alert.fatBox || 'FAT-F10-12',
      dropDbm: alert.dropDbm ?? -28.4,
      severity: alert.severity || 'warning',
      message:
        alert.message ||
        'Optical Rx power attenuation crossed -27 dBm threshold on FAT-F10-12.',
      customerCode: alert.customerCode || 'CUS-1003',
      timestamp: new Date().toISOString(),
    };

    this.server
      .to(`company:${user.companyId}:agents`)
      .emit('noc:telemetry_alert', payload);

    return { status: 'broadcasted', payload };
  }
}
