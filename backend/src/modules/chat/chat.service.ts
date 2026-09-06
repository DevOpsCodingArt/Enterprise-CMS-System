import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class ChatService {
  constructor(private readonly dbService: DbService) {}

  async listConversations(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.conversations)
      .where(eq(schema.conversations.companyId, companyId))
      .orderBy(desc(schema.conversations.lastMessageAt));
  }

  async getMessages(companyId: string, conversationId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.conversationId, conversationId),
          eq(schema.messages.companyId, companyId),
        ),
      )
      .orderBy(schema.messages.deliveredAt);
  }

  async sendMessage(companyId: string, data: any, senderUserId?: string) {
    const db = this.dbService.db;
    const now = new Date();

    const [msg] = await db
      .insert(schema.messages)
      .values({
        companyId,
        conversationId: data.conversationId,
        senderType: data.senderType || 'agent',
        senderUserId: senderUserId || null,
        senderName: data.senderName || 'Staff Agent',
        messageType: data.messageType || 'text',
        content: data.content,
        isInternalNote: Boolean(data.isInternalNote),
        status: 'sent',
        deliveredAt: now,
      })
      .returning();

    // Update conversation last message timestamp & snippet
    await db
      .update(schema.conversations)
      .set({
        lastMessageAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(schema.conversations.id, data.conversationId),
          eq(schema.conversations.companyId, companyId),
        ),
      );

    return msg;
  }
}
