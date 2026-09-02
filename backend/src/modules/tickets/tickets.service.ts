import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  eq,
  and,
  or,
  ilike,
  count,
  desc,
  asc,
  lt,
  notInArray,
  type SQL,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';
import { RedisService } from '../../core/redis/redis.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ResolveTicketDto } from './dto/resolve-ticket.dto';
import { CloseTicketDto } from './dto/close-ticket.dto';
import { AddTicketActivityDto } from './dto/add-activity.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1. List Trouble Tickets (Paginated + Multi-Index Search + Filters + SLA Calculation)
   */
  async listTickets(companyId: string, query: TicketQueryDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const assignedUser = alias(schema.users, 'assigned_user');
    const createdByUser = alias(schema.users, 'created_by_user');
    const resolvedByUser = alias(schema.users, 'resolved_by_user');

    const conditions: (SQL<unknown> | undefined)[] = [
      eq(schema.tickets.companyId, companyId),
    ];

    if (query.search) {
      const q = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(schema.tickets.ticketNumber, q),
          ilike(schema.tickets.title, q),
          ilike(schema.tickets.description, q),
          ilike(schema.tickets.areaAffected, q),
          ilike(schema.tickets.oltPonPort, q),
          ilike(schema.customers.fullName, q),
          ilike(schema.customers.phone, q),
          ilike(schema.customers.customerCode, q),
          ilike(schema.customers.username, q),
        ),
      );
    }

    if (
      query.ticketScope &&
      [
        'subscriber',
        'main_line',
        'backbone',
        'pon_network',
        'node_outage',
      ].includes(query.ticketScope)
    ) {
      conditions.push(
        eq(
          schema.tickets.ticketScope,
          query.ticketScope as
            | 'subscriber'
            | 'main_line'
            | 'backbone'
            | 'pon_network'
            | 'node_outage',
        ),
      );
    }

    if (
      query.status &&
      [
        'open',
        'assigned',
        'in_progress',
        'pending_field',
        'resolved',
        'closed',
        'cancelled',
      ].includes(query.status)
    ) {
      conditions.push(
        eq(
          schema.tickets.status,
          query.status as
            | 'open'
            | 'assigned'
            | 'in_progress'
            | 'pending_field'
            | 'resolved'
            | 'closed'
            | 'cancelled',
        ),
      );
    }

    if (
      query.priority &&
      ['low', 'normal', 'high', 'urgent'].includes(query.priority)
    ) {
      conditions.push(
        eq(
          schema.tickets.priority,
          query.priority as 'low' | 'normal' | 'high' | 'urgent',
        ),
      );
    }

    if (
      query.category &&
      [
        'fiber_break',
        'main_line_break',
        'backbone_cut',
        'two_way_issue',
        'pon_shifting',
        'macro_bend',
        'rogue_onu_isolation',
        'splitter_fault',
        'joint_closure_damage',
        'onu_failure',
        'router_config',
        'wire_damage',
        'slow_speed',
        'new_installation',
        'relocation',
        'olt_card_failure',
        'core_switch_fault',
        'power_outage',
        'billing_inquiry',
        'recharge_verification',
        'other',
      ].includes(query.category)
    ) {
      conditions.push(
        eq(
          schema.tickets.category,
          query.category as (typeof schema.ticketCategoryEnum.enumValues)[number],
        ),
      );
    }

    if (query.branchId) {
      conditions.push(eq(schema.tickets.branchId, query.branchId));
    }

    if (query.customerId) {
      conditions.push(eq(schema.tickets.customerId, query.customerId));
    }

    if (query.assignedTo) {
      conditions.push(eq(schema.tickets.assignedTo, query.assignedTo));
    }

    if (query.assignedDepartment) {
      conditions.push(
        eq(schema.tickets.assignedDepartment, query.assignedDepartment),
      );
    }

    if (query.isOverdue) {
      conditions.push(
        and(
          lt(schema.tickets.ettr, new Date()),
          notInArray(schema.tickets.status, [
            'resolved',
            'closed',
            'cancelled',
          ]),
        ),
      );
    }

    const filteredConditions = conditions.filter(Boolean);
    const whereClause = and(...filteredConditions);

    // Count Total
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.tickets)
      .leftJoin(
        schema.customers,
        eq(schema.tickets.customerId, schema.customers.id),
      )
      .where(whereClause);

    // Sorting
    const sortAsc = query.sortOrder?.toLowerCase() === 'asc';
    let sortDirection = sortAsc
      ? asc(schema.tickets.createdAt)
      : desc(schema.tickets.createdAt);

    if (query.sortBy === 'ticketNumber') {
      sortDirection = sortAsc
        ? asc(schema.tickets.ticketNumber)
        : desc(schema.tickets.ticketNumber);
    } else if (query.sortBy === 'priority') {
      sortDirection = sortAsc
        ? asc(schema.tickets.priority)
        : desc(schema.tickets.priority);
    } else if (query.sortBy === 'status') {
      sortDirection = sortAsc
        ? asc(schema.tickets.status)
        : desc(schema.tickets.status);
    } else if (query.sortBy === 'ettr') {
      sortDirection = sortAsc
        ? asc(schema.tickets.ettr)
        : desc(schema.tickets.ettr);
    }

    const rawTickets = await db
      .select({
        id: schema.tickets.id,
        companyId: schema.tickets.companyId,
        ticketNumber: schema.tickets.ticketNumber,
        ticketScope: schema.tickets.ticketScope,
        customerId: schema.tickets.customerId,
        customerName: schema.customers.fullName,
        customerCode: schema.customers.customerCode,
        customerPhone: schema.customers.phone,
        customerAddress: schema.customers.address,
        customerOnuSignalDbm: schema.customers.onuSignalDbm,
        customerPppoeStatus: schema.customers.pppoeStatus,
        customerUsername: schema.customers.username,
        conversationId: schema.tickets.conversationId,
        branchId: schema.tickets.branchId,
        branchName: schema.branches.name,
        branchCode: schema.branches.code,
        category: schema.tickets.category,
        priority: schema.tickets.priority,
        status: schema.tickets.status,
        title: schema.tickets.title,
        description: schema.tickets.description,
        assignedDepartment: schema.tickets.assignedDepartment,
        assignedTo: schema.tickets.assignedTo,
        assignedUserName: assignedUser.fullName,
        assignedUserEmail: assignedUser.email,
        createdBy: schema.tickets.createdBy,
        createdByName: createdByUser.fullName,
        areaAffected: schema.tickets.areaAffected,
        affectedSubscribersCount: schema.tickets.affectedSubscribersCount,
        oltPonPort: schema.tickets.oltPonPort,
        sourcePonPort: schema.tickets.sourcePonPort,
        destinationPonPort: schema.tickets.destinationPonPort,
        splitterId: schema.tickets.splitterId,
        coreCountAffected: schema.tickets.coreCountAffected,
        cableType: schema.tickets.cableType,
        otdrBreakDistanceMeters: schema.tickets.otdrBreakDistanceMeters,
        opticalFaultType: schema.tickets.opticalFaultType,
        ettr: schema.tickets.ettr,
        resolvedAt: schema.tickets.resolvedAt,
        resolvedBy: schema.tickets.resolvedBy,
        resolvedByName: resolvedByUser.fullName,
        resolutionOutcome: schema.tickets.resolutionOutcome,
        resolutionNotes: schema.tickets.resolutionNotes,
        materialUsed: schema.tickets.materialUsed,
        latitude: schema.tickets.latitude,
        longitude: schema.tickets.longitude,
        attachments: schema.tickets.attachments,
        createdAt: schema.tickets.createdAt,
        updatedAt: schema.tickets.updatedAt,
      })
      .from(schema.tickets)
      .leftJoin(
        schema.customers,
        eq(schema.tickets.customerId, schema.customers.id),
      )
      .leftJoin(
        schema.branches,
        eq(schema.tickets.branchId, schema.branches.id),
      )
      .leftJoin(assignedUser, eq(schema.tickets.assignedTo, assignedUser.id))
      .leftJoin(createdByUser, eq(schema.tickets.createdBy, createdByUser.id))
      .leftJoin(
        resolvedByUser,
        eq(schema.tickets.resolvedBy, resolvedByUser.id),
      )
      .where(whereClause)
      .orderBy(sortDirection)
      .limit(limit)
      .offset(offset);

    const now = Date.now();
    const items = rawTickets.map((t) => {
      let isOverdue = false;
      let remainingMinutes = 0;

      if (t.ettr) {
        const ettrTime = new Date(t.ettr).getTime();
        const diffMs = ettrTime - now;
        remainingMinutes = Math.round(diffMs / 60000);
        isOverdue =
          diffMs < 0 && !['resolved', 'closed', 'cancelled'].includes(t.status);
      }

      return {
        ...t,
        isOverdue,
        remainingMinutes,
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 2. Get Single Ticket Details with Activity Timeline
   */
  async getTicketById(companyId: string, ticketId: string) {
    const db = this.dbService.db;

    const assignedUser = alias(schema.users, 'assigned_user');
    const createdByUser = alias(schema.users, 'created_by_user');
    const resolvedByUser = alias(schema.users, 'resolved_by_user');

    const [ticket] = await db
      .select({
        id: schema.tickets.id,
        companyId: schema.tickets.companyId,
        ticketNumber: schema.tickets.ticketNumber,
        ticketScope: schema.tickets.ticketScope,
        customerId: schema.tickets.customerId,
        customerName: schema.customers.fullName,
        customerCode: schema.customers.customerCode,
        customerPhone: schema.customers.phone,
        customerAddress: schema.customers.address,
        customerOnuSignalDbm: schema.customers.onuSignalDbm,
        customerPppoeStatus: schema.customers.pppoeStatus,
        customerUsername: schema.customers.username,
        conversationId: schema.tickets.conversationId,
        branchId: schema.tickets.branchId,
        branchName: schema.branches.name,
        branchCode: schema.branches.code,
        category: schema.tickets.category,
        priority: schema.tickets.priority,
        status: schema.tickets.status,
        title: schema.tickets.title,
        description: schema.tickets.description,
        assignedDepartment: schema.tickets.assignedDepartment,
        assignedTo: schema.tickets.assignedTo,
        assignedUserName: assignedUser.fullName,
        assignedUserEmail: assignedUser.email,
        createdBy: schema.tickets.createdBy,
        createdByName: createdByUser.fullName,
        areaAffected: schema.tickets.areaAffected,
        affectedSubscribersCount: schema.tickets.affectedSubscribersCount,
        oltPonPort: schema.tickets.oltPonPort,
        sourcePonPort: schema.tickets.sourcePonPort,
        destinationPonPort: schema.tickets.destinationPonPort,
        splitterId: schema.tickets.splitterId,
        coreCountAffected: schema.tickets.coreCountAffected,
        cableType: schema.tickets.cableType,
        otdrBreakDistanceMeters: schema.tickets.otdrBreakDistanceMeters,
        opticalFaultType: schema.tickets.opticalFaultType,
        ettr: schema.tickets.ettr,
        resolvedAt: schema.tickets.resolvedAt,
        resolvedBy: schema.tickets.resolvedBy,
        resolvedByName: resolvedByUser.fullName,
        resolutionOutcome: schema.tickets.resolutionOutcome,
        resolutionNotes: schema.tickets.resolutionNotes,
        materialUsed: schema.tickets.materialUsed,
        latitude: schema.tickets.latitude,
        longitude: schema.tickets.longitude,
        attachments: schema.tickets.attachments,
        createdAt: schema.tickets.createdAt,
        updatedAt: schema.tickets.updatedAt,
      })
      .from(schema.tickets)
      .leftJoin(
        schema.customers,
        eq(schema.tickets.customerId, schema.customers.id),
      )
      .leftJoin(
        schema.branches,
        eq(schema.tickets.branchId, schema.branches.id),
      )
      .leftJoin(assignedUser, eq(schema.tickets.assignedTo, assignedUser.id))
      .leftJoin(createdByUser, eq(schema.tickets.createdBy, createdByUser.id))
      .leftJoin(
        resolvedByUser,
        eq(schema.tickets.resolvedBy, resolvedByUser.id),
      )
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      )
      .limit(1);

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    // Fetch Activity Timeline
    const activities = await this.getTicketActivities(companyId, ticketId);

    return {
      ...ticket,
      activities,
    };
  }

  /**
   * 3. Create Trouble Ticket with Industry Standard Auto-Numbering
   */
  async createTicket(
    companyId: string,
    dto: CreateTicketDto,
    creatorId?: string,
  ) {
    const db = this.dbService.db;

    // Generate Telecom Industry Standard Incident Code: INC-YYMMDD-XXXX
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `INC-${yy}${mm}${dd}`;

    const [{ todayCount }] = await db
      .select({ todayCount: count() })
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          ilike(schema.tickets.ticketNumber, `${datePrefix}%`),
        ),
      );

    const seq = String(todayCount + 1).padStart(4, '0');
    const ticketNumber = `${datePrefix}-${seq}`;

    // Calculate ETTR based on priority or custom hours
    let ettrHours = dto.ettrHours;
    if (!ettrHours) {
      if (dto.priority === 'urgent') ettrHours = 2;
      else if (dto.priority === 'high') ettrHours = 4;
      else if (dto.priority === 'normal') ettrHours = 8;
      else ettrHours = 24;
    }
    const ettr = new Date(Date.now() + ettrHours * 3600 * 1000);

    const [newTicket] = await db
      .insert(schema.tickets)
      .values({
        companyId,
        ticketNumber,
        ticketScope: dto.ticketScope || 'subscriber',
        customerId: dto.customerId || null,
        branchId: dto.branchId || null,
        conversationId: dto.conversationId || null,
        category: dto.category,
        priority: dto.priority,
        status: 'open',
        title: dto.title.trim(),
        description: dto.description.trim(),
        assignedDepartment: dto.assignedDepartment || 'field_operations',
        assignedTo: dto.assignedTo || null,
        createdBy: creatorId || null,
        areaAffected: dto.areaAffected || null,
        affectedSubscribersCount: dto.affectedSubscribersCount || 0,
        oltPonPort: dto.oltPonPort || null,
        sourcePonPort: dto.sourcePonPort || null,
        destinationPonPort: dto.destinationPonPort || null,
        splitterId: dto.splitterId || null,
        coreCountAffected: dto.coreCountAffected || null,
        cableType: dto.cableType || null,
        otdrBreakDistanceMeters: dto.otdrBreakDistanceMeters || null,
        opticalFaultType: dto.opticalFaultType || null,
        ettr,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        attachments: dto.attachments || [],
      })
      .returning();

    // Insert Initial Activity Log
    await db.insert(schema.ticketActivities).values({
      ticketId: newTicket.id,
      companyId,
      userId: creatorId || null,
      activityType: 'created',
      comment: `Incident [${ticketNumber}] registered under scope "${newTicket.ticketScope}". Target SLA ETTR set to ${ettrHours} hours.`,
    });

    this.logger.log(
      `🎫 [Ticket Created] ${ticketNumber} (${newTicket.title}) in tenant ${companyId}`,
    );
    return this.getTicketById(companyId, newTicket.id);
  }

  /**
   * 4. Update Trouble Ticket
   */
  async updateTicket(
    companyId: string,
    ticketId: string,
    dto: UpdateTicketDto,
    updaterId?: string,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const updateData: Partial<typeof schema.tickets.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.title) updateData.title = dto.title.trim();
    if (dto.description) updateData.description = dto.description.trim();
    if (dto.category) updateData.category = dto.category;
    if (dto.priority) updateData.priority = dto.priority;
    if (dto.status) updateData.status = dto.status;

    if (dto.assignedDepartment)
      updateData.assignedDepartment = dto.assignedDepartment;
    if (dto.assignedTo !== undefined) updateData.assignedTo = dto.assignedTo;
    if (dto.areaAffected !== undefined)
      updateData.areaAffected = dto.areaAffected;
    if (dto.affectedSubscribersCount !== undefined)
      updateData.affectedSubscribersCount = dto.affectedSubscribersCount;
    if (dto.oltPonPort !== undefined) updateData.oltPonPort = dto.oltPonPort;
    if (dto.sourcePonPort !== undefined)
      updateData.sourcePonPort = dto.sourcePonPort;
    if (dto.destinationPonPort !== undefined)
      updateData.destinationPonPort = dto.destinationPonPort;
    if (dto.splitterId !== undefined) updateData.splitterId = dto.splitterId;
    if (dto.coreCountAffected !== undefined)
      updateData.coreCountAffected = dto.coreCountAffected;
    if (dto.cableType !== undefined) updateData.cableType = dto.cableType;
    if (dto.otdrBreakDistanceMeters !== undefined)
      updateData.otdrBreakDistanceMeters = dto.otdrBreakDistanceMeters;
    if (dto.opticalFaultType !== undefined)
      updateData.opticalFaultType = dto.opticalFaultType;
    if (dto.ettr) updateData.ettr = new Date(dto.ettr);
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.attachments) updateData.attachments = dto.attachments;

    await db
      .update(schema.tickets)
      .set(updateData)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      );

    // Record Status / Priority Change Activity
    if (dto.status && dto.status !== existing.status) {
      await db.insert(schema.ticketActivities).values({
        ticketId,
        companyId,
        userId: updaterId || null,
        activityType: 'status_changed',
        comment: `Ticket status transitioned from "${existing.status}" to "${dto.status}".`,
        oldValues: { status: existing.status },
        newValues: { status: dto.status },
      });
    }

    if (dto.priority && dto.priority !== existing.priority) {
      await db.insert(schema.ticketActivities).values({
        ticketId,
        companyId,
        userId: updaterId || null,
        activityType: 'priority_changed',
        comment: `Ticket priority escalated from "${existing.priority}" to "${dto.priority}".`,
        oldValues: { priority: existing.priority },
        newValues: { priority: dto.priority },
      });
    }

    return this.getTicketById(companyId, ticketId);
  }

  /**
   * 5. Dispatch & Assign Ticket to Field Engineer
   */
  async assignTicket(
    companyId: string,
    ticketId: string,
    dto: AssignTicketDto,
    assignerId?: string,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const [technician] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, dto.assignedTo))
      .limit(1);

    const newStatus = existing.status === 'open' ? 'assigned' : existing.status;

    await db
      .update(schema.tickets)
      .set({
        assignedTo: dto.assignedTo,
        assignedDepartment:
          dto.assignedDepartment || existing.assignedDepartment,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(schema.tickets.id, ticketId));

    await db.insert(schema.ticketActivities).values({
      ticketId,
      companyId,
      userId: assignerId || null,
      activityType: 'reassigned',
      comment:
        dto.reason ||
        `Dispatched to technician ${technician ? technician.fullName : dto.assignedTo}`,
      oldValues: { assignedTo: existing.assignedTo, status: existing.status },
      newValues: { assignedTo: dto.assignedTo, status: newStatus },
    });

    this.logger.log(
      `🚗 [Ticket Dispatched] ${existing.ticketNumber} assigned to ${technician ? technician.fullName : dto.assignedTo}`,
    );
    return this.getTicketById(companyId, ticketId);
  }

  /**
   * 6. Resolve Trouble Ticket with Materials & Outcome
   */
  async resolveTicket(
    companyId: string,
    ticketId: string,
    dto: ResolveTicketDto,
    resolverId?: string,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    await db
      .update(schema.tickets)
      .set({
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: resolverId || null,
        resolutionOutcome: dto.resolutionOutcome.trim(),
        resolutionNotes: dto.resolutionNotes.trim(),
        materialUsed: dto.materialUsed || existing.materialUsed,
        attachments: dto.attachments || existing.attachments,
        updatedAt: new Date(),
      })
      .where(eq(schema.tickets.id, ticketId));

    await db.insert(schema.ticketActivities).values({
      ticketId,
      companyId,
      userId: resolverId || null,
      activityType: 'resolved',
      comment: `Resolution: ${dto.resolutionOutcome}. Notes: ${dto.resolutionNotes}`,
      newValues: {
        status: 'resolved',
        materialUsed: dto.materialUsed,
      },
    });

    this.logger.log(
      `✅ [Ticket Resolved] ${existing.ticketNumber} marked resolved`,
    );
    return this.getTicketById(companyId, ticketId);
  }

  /**
   * 7. Close Verified Trouble Ticket
   */
  async closeTicket(
    companyId: string,
    ticketId: string,
    dto: CloseTicketDto,
    closerId?: string,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    await db
      .update(schema.tickets)
      .set({
        status: 'closed',
        updatedAt: new Date(),
      })
      .where(eq(schema.tickets.id, ticketId));

    await db.insert(schema.ticketActivities).values({
      ticketId,
      companyId,
      userId: closerId || null,
      activityType: 'closed',
      comment:
        dto.closingNotes ||
        `Ticket closed and customer satisfaction confirmed (Rating: ${dto.feedbackRating || 5}/5).`,
    });

    return this.getTicketById(companyId, ticketId);
  }

  /**
   * 8. Delete Trouble Ticket
   */
  async deleteTicket(companyId: string, ticketId: string) {
    const db = this.dbService.db;

    await db
      .delete(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.id, ticketId),
        ),
      );

    return { message: `Incident ticket ${ticketId} deleted successfully` };
  }

  /**
   * 9. Get Ticket Activity Timeline
   */
  async getTicketActivities(companyId: string, ticketId: string) {
    const db = this.dbService.db;

    return db
      .select({
        id: schema.ticketActivities.id,
        ticketId: schema.ticketActivities.ticketId,
        activityType: schema.ticketActivities.activityType,
        comment: schema.ticketActivities.comment,
        oldValues: schema.ticketActivities.oldValues,
        newValues: schema.ticketActivities.newValues,
        userId: schema.ticketActivities.userId,
        userName: schema.users.fullName,
        userDisplayName: schema.users.displayName,
        userAvatarUrl: schema.users.avatarUrl,
        userDepartment: schema.users.department,
        createdAt: schema.ticketActivities.createdAt,
      })
      .from(schema.ticketActivities)
      .leftJoin(
        schema.users,
        eq(schema.ticketActivities.userId, schema.users.id),
      )
      .where(
        and(
          eq(schema.ticketActivities.companyId, companyId),
          eq(schema.ticketActivities.ticketId, ticketId),
        ),
      )
      .orderBy(asc(schema.ticketActivities.createdAt));
  }

  /**
   * 10. Add Custom Activity Note / OTDR Trace Result
   */
  async addTicketActivity(
    companyId: string,
    ticketId: string,
    dto: AddTicketActivityDto,
    authorId?: string,
  ) {
    const db = this.dbService.db;

    const [activity] = await db
      .insert(schema.ticketActivities)
      .values({
        ticketId,
        companyId,
        userId: authorId || null,
        activityType: dto.activityType || 'internal_note',
        comment: dto.comment.trim(),
      })
      .returning();

    return activity;
  }
}
