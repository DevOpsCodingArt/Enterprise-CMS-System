import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class ChatService {
  constructor(private readonly dbService: DbService) {}

  async listConversations(companyId: string) {
    const db = this.dbService.db;
    const rows = await db
      .select({
        id: schema.conversations.id,
        companyId: schema.conversations.companyId,
        customerId: schema.conversations.customerId,
        initiatedBy: schema.conversations.initiatedBy,
        status: schema.conversations.status,
        assignedTo: schema.conversations.assignedTo,
        assignedAt: schema.conversations.assignedAt,
        priority: schema.conversations.priority,
        subject: schema.conversations.subject,
        closureReason: schema.conversations.closureReason,
        closureOutcome: schema.conversations.closureOutcome,
        lastMessageAt: schema.conversations.lastMessageAt,
        unreadCountCustomer: schema.conversations.unreadCountCustomer,
        unreadCountStaff: schema.conversations.unreadCountStaff,
        metadata: schema.conversations.metadata,
        createdAt: schema.conversations.createdAt,
        updatedAt: schema.conversations.updatedAt,
        customerName: schema.customers.fullName,
        customerCode: schema.customers.customerCode,
        customerPhone: schema.customers.phone,
        customerCnic: schema.customers.cnic,
        customerUsername: schema.customers.username,
        customerPackage: schema.customers.packageName,
        customerArea: schema.customers.area,
        customerAddress: schema.customers.address,
        customerCity: schema.customers.city,
        customerPonPort: schema.customers.oltPonPort,
        customerMac: schema.customers.macAddress,
        customerIp: schema.customers.currentIp,
        customerSignal: schema.customers.onuSignalDbm,
        customerMonthlyBilling: schema.customers.monthlyBilling,
        branchName: schema.branches.name,
        assignedUserName: schema.users.displayName,
      })
      .from(schema.conversations)
      .leftJoin(
        schema.customers,
        eq(schema.conversations.customerId, schema.customers.id),
      )
      .leftJoin(
        schema.branches,
        eq(schema.customers.branchId, schema.branches.id),
      )
      .leftJoin(
        schema.users,
        eq(schema.conversations.assignedTo, schema.users.id),
      )
      .where(eq(schema.conversations.companyId, companyId))
      .orderBy(desc(schema.conversations.lastMessageAt));

    return rows;
  }

  async getConversationById(companyId: string, conversationId: string) {
    const db = this.dbService.db;
    const [conv] = await db
      .select({
        id: schema.conversations.id,
        companyId: schema.conversations.companyId,
        customerId: schema.conversations.customerId,
        initiatedBy: schema.conversations.initiatedBy,
        status: schema.conversations.status,
        assignedTo: schema.conversations.assignedTo,
        assignedAt: schema.conversations.assignedAt,
        priority: schema.conversations.priority,
        subject: schema.conversations.subject,
        lastMessageAt: schema.conversations.lastMessageAt,
        customerName: schema.customers.fullName,
        customerCode: schema.customers.customerCode,
        customerPhone: schema.customers.phone,
        customerCnic: schema.customers.cnic,
        customerUsername: schema.customers.username,
        customerPackage: schema.customers.packageName,
        customerArea: schema.customers.area,
        customerAddress: schema.customers.address,
        customerCity: schema.customers.city,
        customerPonPort: schema.customers.oltPonPort,
        customerMac: schema.customers.macAddress,
        customerIp: schema.customers.currentIp,
        customerSignal: schema.customers.onuSignalDbm,
        customerMonthlyBilling: schema.customers.monthlyBilling,
        branchName: schema.branches.name,
      })
      .from(schema.conversations)
      .leftJoin(
        schema.customers,
        eq(schema.conversations.customerId, schema.customers.id),
      )
      .leftJoin(
        schema.branches,
        eq(schema.customers.branchId, schema.branches.id),
      )
      .where(
        and(
          eq(schema.conversations.id, conversationId),
          eq(schema.conversations.companyId, companyId),
        ),
      );

    return conv || null;
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
      .orderBy(schema.messages.createdAt);
  }

  async sendMessage(
    companyId: string,
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
      senderType?: 'customer' | 'staff' | 'system';
      senderName?: string;
    },
    senderUserId?: string,
    senderCustomerId?: string,
  ) {
    const db = this.dbService.db;
    const now = new Date();

    // Map senderType strictly to valid enum values: 'customer' | 'staff' | 'system'
    const safeSenderType =
      data.senderType === 'customer'
        ? 'customer'
        : data.senderType === 'system'
        ? 'system'
        : 'staff';

    const [msg] = await db
      .insert(schema.messages)
      .values({
        companyId,
        conversationId: data.conversationId,
        senderType: safeSenderType,
        senderUserId: senderUserId || null,
        senderCustomerId: senderCustomerId || null,
        senderName: data.senderName || (safeSenderType === 'customer' ? 'Customer' : 'NOC Support'),
        messageType: data.messageType || 'text',
        content: data.content,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        isInternalNote: Boolean(data.isInternalNote),
        status: 'delivered',
        deliveredAt: now,
      })
      .returning();

    // Update conversation last message timestamp
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

  async markMessageRead(companyId: string, conversationId: string, messageId: string) {
    const db = this.dbService.db;
    const now = new Date();

    await db
      .update(schema.messages)
      .set({
        status: 'read',
        readAt: now,
      })
      .where(
        and(
          eq(schema.messages.id, messageId),
          eq(schema.messages.conversationId, conversationId),
          eq(schema.messages.companyId, companyId),
        ),
      );

    return { success: true, readAt: now };
  }

  async createConversation(
    companyId: string,
    data: {
      customerId?: string;
      phone?: string;
      fullName?: string;
      subject?: string;
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      initialMessage?: string;
    },
    staffUserId?: string,
  ) {
    const db = this.dbService.db;
    const now = new Date();

    let targetCustomerId = data.customerId;

    // If phone number is provided, find customer by phone or auto-create lead
    if (!targetCustomerId && data.phone?.trim()) {
      const rawPhone = data.phone.trim();
      const digitsOnly = rawPhone.replace(/\D/g, '');
      const coreNumber = digitsOnly.startsWith('92')
        ? digitsOnly.slice(2)
        : digitsOnly.startsWith('0')
        ? digitsOnly.slice(1)
        : digitsOnly;

      const [existingCust] = await db
        .select({ id: schema.customers.id })
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.companyId, companyId),
            or(
              sql`regexp_replace(${schema.customers.phone}, '\\D', '', 'g') LIKE ${`%${coreNumber}%`}`,
              eq(schema.customers.phone, rawPhone),
            ),
          ),
        )
        .limit(1);

      if (existingCust) {
        targetCustomerId = existingCust.id;
      } else {
        // 2. Check company users (Staff members & Admins)
        const [existingUser] = await db
          .select({
            id: schema.users.id,
            fullName: schema.users.fullName,
            phone: schema.users.phone,
            userType: schema.users.userType,
            designation: schema.users.designation,
            department: schema.users.department,
          })
          .from(schema.users)
          .where(
            and(
              eq(schema.users.companyId, companyId),
              or(
                sql`regexp_replace(${schema.users.phone}, '\\D', '', 'g') LIKE ${`%${coreNumber}%`}`,
                eq(schema.users.phone, rawPhone),
              ),
            ),
          )
          .limit(1);

        if (existingUser) {
          const isOwner = existingUser.userType === 'company_owner';
          const formattedPhone = rawPhone.startsWith('+')
            ? rawPhone
            : `+92 ${coreNumber.slice(0, 3)} ${coreNumber.slice(3)}`;

          // Find or create customer contact entry representing this staff/admin user
          let [staffCustomer] = await db
            .select({ id: schema.customers.id })
            .from(schema.customers)
            .where(
              and(
                eq(schema.customers.companyId, companyId),
                sql`regexp_replace(${schema.customers.phone}, '\\D', '', 'g') LIKE ${`%${coreNumber}%`}`,
              ),
            )
            .limit(1);

          if (!staffCustomer) {
            const [newStaffCust] = await db
              .insert(schema.customers)
              .values({
                companyId,
                customerCode: isOwner
                  ? `ADM-${existingUser.id.slice(-4)}`
                  : `STF-${existingUser.id.slice(-4)}`,
                fullName: `${existingUser.fullName} (${isOwner ? 'Admin' : 'Staff'})`,
                phone: existingUser.phone || formattedPhone,
                status: 'active',
                packageName:
                  existingUser.designation ||
                  (isOwner ? 'Operations Director' : 'Support Staff'),
                onuSignalDbm: '0.00',
                monthlyBilling: '0.00',
                customerClass: isOwner ? 'vip' : 'corporate',
                area: existingUser.department || 'HQ Operations',
              })
              .returning();
            staffCustomer = newStaffCust;
          }
          targetCustomerId = staffCustomer.id;
        } else {
          throw new NotFoundException(
            `No registered subscriber, staff member, or admin found with mobile number: ${rawPhone}`,
          );
        }
      }
    }

    if (!targetCustomerId) {
      throw new BadRequestException('A valid customerId or mobile number is required.');
    }

    // Check if an active conversation already exists for this customer in this company
    const [existing] = await db
      .select({ id: schema.conversations.id })
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.companyId, companyId),
          eq(schema.conversations.customerId, targetCustomerId),
          eq(schema.conversations.status, 'active'),
        ),
      );

    if (existing) {
      if (data.initialMessage?.trim()) {
        await this.sendMessage(
          companyId,
          {
            conversationId: existing.id,
            content: data.initialMessage.trim(),
            senderType: 'staff',
          },
          staffUserId,
        );
      }
      return this.getConversationById(companyId, existing.id);
    }

    const [conv] = await db
      .insert(schema.conversations)
      .values({
        companyId,
        customerId: targetCustomerId,
        initiatedBy: 'staff',
        status: 'active',
        assignedTo: staffUserId || null,
        assignedAt: now,
        priority: data.priority || 'normal',
        subject: data.subject || 'Direct Chat',
        lastMessageAt: now,
        unreadCountStaff: 0,
        unreadCountCustomer: data.initialMessage?.trim() ? 1 : 0,
      })
      .returning();

    if (data.initialMessage?.trim()) {
      await this.sendMessage(
        companyId,
        {
          conversationId: conv.id,
          content: data.initialMessage.trim(),
          senderType: 'staff',
        },
        staffUserId,
      );
    }

    return this.getConversationById(companyId, conv.id);
  }
}
