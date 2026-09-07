import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { TenantGuard } from '../../core/guards/tenant.guard';
import { TenantId } from '../../core/decorators/tenant-id.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../core/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async listConversations(@TenantId() companyId: string) {
    return this.chatService.listConversations(companyId);
  }

  @Post('conversations')
  async createConversation(
    @TenantId() companyId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    body: {
      customerId?: string;
      phone?: string;
      fullName?: string;
      subject?: string;
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      initialMessage?: string;
    },
  ) {
    return this.chatService.createConversation(companyId, body, user.id);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @TenantId() companyId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.getMessages(companyId, conversationId);
  }

  @Post('messages')
  async sendMessage(
    @TenantId() companyId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: any,
  ) {
    return this.chatService.sendMessage(companyId, body, user.id);
  }
}
