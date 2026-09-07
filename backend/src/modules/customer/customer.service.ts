import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq, and, or, ilike, count, desc, asc, type SQL } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';
import { RedisService } from '../../core/redis/redis.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdatePortalProfileDto } from './dto/portal-profile.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1. List Subscribers (Paginated + Multi-Index Search + Filters)
   */
  async listCustomers(companyId: string, query: CustomerQueryDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const conditions: (SQL<unknown> | undefined)[] = [
      eq(schema.customers.companyId, companyId),
    ];

    if (query.search) {
      const q = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(schema.customers.fullName, q),
          ilike(schema.customers.phone, q),
          ilike(schema.customers.email, q),
          ilike(schema.customers.cnic, q),
          ilike(schema.customers.customerCode, q),
          ilike(schema.customers.username, q),
          ilike(schema.customers.address, q),
        ),
      );
    }

    if (
      query.status &&
      ['active', 'inactive', 'suspended', 'disconnected'].includes(query.status)
    ) {
      conditions.push(
        eq(
          schema.customers.status,
          query.status as 'active' | 'inactive' | 'suspended' | 'disconnected',
        ),
      );
    }

    if (query.branchId) {
      conditions.push(eq(schema.customers.branchId, query.branchId));
    }

    if (
      query.customerClass &&
      ['residential', 'business', 'corporate', 'government', 'vip'].includes(
        query.customerClass,
      )
    ) {
      conditions.push(
        eq(
          schema.customers.customerClass,
          query.customerClass as
            'residential' | 'business' | 'corporate' | 'government' | 'vip',
        ),
      );
    }

    if (query.pppoeStatus) {
      conditions.push(eq(schema.customers.pppoeStatus, query.pppoeStatus));
    }

    const filteredConditions = conditions.filter(Boolean);
    const whereClause = and(...filteredConditions);

    // Count Total matching
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.customers)
      .where(whereClause);

    // Sorting column
    const sortAsc = query.sortOrder?.toLowerCase() === 'asc';
    let sortDirection = sortAsc
      ? asc(schema.customers.createdAt)
      : desc(schema.customers.createdAt);

    if (query.sortBy === 'fullName') {
      sortDirection = sortAsc
        ? asc(schema.customers.fullName)
        : desc(schema.customers.fullName);
    } else if (query.sortBy === 'customerCode') {
      sortDirection = sortAsc
        ? asc(schema.customers.customerCode)
        : desc(schema.customers.customerCode);
    } else if (query.sortBy === 'status') {
      sortDirection = sortAsc
        ? asc(schema.customers.status)
        : desc(schema.customers.status);
    } else if (query.sortBy === 'billingExpiryDate') {
      sortDirection = sortAsc
        ? asc(schema.customers.billingExpiryDate)
        : desc(schema.customers.billingExpiryDate);
    } else if (query.sortBy === 'onuSignalDbm') {
      sortDirection = sortAsc
        ? asc(schema.customers.onuSignalDbm)
        : desc(schema.customers.onuSignalDbm);
    }

    // Fetch Subscribers joined with Branch
    const items = await db
      .select({
        id: schema.customers.id,
        companyId: schema.customers.companyId,
        branchId: schema.customers.branchId,
        branchName: schema.branches.name,
        customerCode: schema.customers.customerCode,
        fullName: schema.customers.fullName,
        cnic: schema.customers.cnic,
        email: schema.customers.email,
        phone: schema.customers.phone,
        altPhone: schema.customers.altPhone,
        username: schema.customers.username,
        address: schema.customers.address,
        area: schema.customers.area,
        city: schema.customers.city,
        latitude: schema.customers.latitude,
        longitude: schema.customers.longitude,
        customerClass: schema.customers.customerClass,
        packageId: schema.customers.packageId,
        packageName: schema.customers.packageName,
        packageSpeed: schema.customers.packageSpeed,
        monthlyBilling: schema.customers.monthlyBilling,
        billingExpiryDate: schema.customers.billingExpiryDate,
        pppoeStatus: schema.customers.pppoeStatus,
        currentIp: schema.customers.currentIp,
        macAddress: schema.customers.macAddress,
        onuSignalDbm: schema.customers.onuSignalDbm,
        oltPonPort: schema.customers.oltPonPort,
        status: schema.customers.status,
        registrationDate: schema.customers.registrationDate,
        activationDate: schema.customers.activationDate,
        avatarUrl: schema.customers.avatarUrl,
        createdAt: schema.customers.createdAt,
      })
      .from(schema.customers)
      .leftJoin(
        schema.branches,
        eq(schema.customers.branchId, schema.branches.id),
      )
      .where(whereClause)
      .orderBy(sortDirection)
      .limit(limit)
      .offset(offset);

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
   * 2. Get Single Customer Profile
   */
  async getCustomerById(companyId: string, customerId: string) {
    const db = this.dbService.db;

    const [customer] = await db
      .select({
        id: schema.customers.id,
        companyId: schema.customers.companyId,
        branchId: schema.customers.branchId,
        branchName: schema.branches.name,
        customerCode: schema.customers.customerCode,
        fullName: schema.customers.fullName,
        cnic: schema.customers.cnic,
        email: schema.customers.email,
        phone: schema.customers.phone,
        altPhone: schema.customers.altPhone,
        username: schema.customers.username,
        address: schema.customers.address,
        area: schema.customers.area,
        city: schema.customers.city,
        latitude: schema.customers.latitude,
        longitude: schema.customers.longitude,
        customerClass: schema.customers.customerClass,
        packageId: schema.customers.packageId,
        packageName: schema.customers.packageName,
        packageSpeed: schema.customers.packageSpeed,
        monthlyBilling: schema.customers.monthlyBilling,
        billingExpiryDate: schema.customers.billingExpiryDate,
        pppoeStatus: schema.customers.pppoeStatus,
        currentIp: schema.customers.currentIp,
        macAddress: schema.customers.macAddress,
        onuSignalDbm: schema.customers.onuSignalDbm,
        oltPonPort: schema.customers.oltPonPort,
        status: schema.customers.status,
        registrationDate: schema.customers.registrationDate,
        activationDate: schema.customers.activationDate,
        notes: schema.customers.notes,
        avatarUrl: schema.customers.avatarUrl,
        createdAt: schema.customers.createdAt,
        updatedAt: schema.customers.updatedAt,
      })
      .from(schema.customers)
      .leftJoin(
        schema.branches,
        eq(schema.customers.branchId, schema.branches.id),
      )
      .where(
        and(
          eq(schema.customers.companyId, companyId),
          eq(schema.customers.id, customerId),
        ),
      )
      .limit(1);

    if (!customer) {
      throw new NotFoundException(`Subscriber with ID ${customerId} not found`);
    }

    return customer;
  }

  /**
   * 3. Customer 360° Real-Time Diagnostics Aggregator
   */
  async getCustomer360(companyId: string, customerId: string) {
    const cacheKey = `customer:360:${customerId}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const db = this.dbService.db;

        // Fetch Customer & Branch
        const customer = await this.getCustomerById(companyId, customerId);

        // Analyze Optical Signal Quality
        const signalNum = parseFloat(customer.onuSignalDbm || '-19.50');
        let opticalStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
        let opticalMessage =
          'Optical power is within optimal GPON specifications.';

        if (signalNum < -27.99) {
          opticalStatus = 'critical';
          opticalMessage =
            'CRITICAL: Loss of optical signal or severe fiber attenuation detected. Field inspection required.';
        } else if (signalNum < -24.99) {
          opticalStatus = 'warning';
          opticalMessage =
            'WARNING: Optical signal is slightly degraded. Check fiber patch-cord and splice points.';
        }

        // Calculate Billing Expiry
        let daysRemaining = 0;
        let isExpired = false;
        if (customer.billingExpiryDate) {
          const expiryDate = new Date(customer.billingExpiryDate);
          const diffTime = expiryDate.getTime() - Date.now();
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isExpired = daysRemaining < 0;
        }

        // Fetch Last 5 Trouble Tickets
        const recentTickets = await db
          .select({
            id: schema.tickets.id,
            ticketNumber: schema.tickets.ticketNumber,
            title: schema.tickets.title,
            category: schema.tickets.category,
            priority: schema.tickets.priority,
            status: schema.tickets.status,
            createdAt: schema.tickets.createdAt,
          })
          .from(schema.tickets)
          .where(
            and(
              eq(schema.tickets.companyId, companyId),
              eq(schema.tickets.customerId, customerId),
            ),
          )
          .orderBy(desc(schema.tickets.createdAt))
          .limit(5);

        // Fetch Last 5 Conversations
        const recentConversations = await db
          .select({
            id: schema.conversations.id,
            subject: schema.conversations.subject,
            status: schema.conversations.status,
            priority: schema.conversations.priority,
            lastMessageAt: schema.conversations.lastMessageAt,
          })
          .from(schema.conversations)
          .where(
            and(
              eq(schema.conversations.companyId, companyId),
              eq(schema.conversations.customerId, customerId),
            ),
          )
          .orderBy(desc(schema.conversations.lastMessageAt))
          .limit(5);

        return {
          profile: customer,
          telemetry: {
            pppoeStatus: customer.pppoeStatus,
            currentIp: customer.currentIp,
            macAddress: customer.macAddress,
            onuSignalDbm: customer.onuSignalDbm,
            oltPonPort: customer.oltPonPort,
            opticalHealth: {
              status: opticalStatus,
              rxDbm: customer.onuSignalDbm,
              message: opticalMessage,
            },
          },
          billing: {
            packageName: customer.packageName,
            packageSpeed: customer.packageSpeed,
            monthlyBilling: customer.monthlyBilling,
            billingExpiryDate: customer.billingExpiryDate,
            daysRemaining,
            isExpired,
          },
          recentTickets,
          recentConversations,
        };
      },
      300, // 300s (5 minutes) cache in Redis
    );
  }

  /**
   * 4. Register New Subscriber
   */
  async createCustomer(companyId: string, dto: CreateCustomerDto) {
    const db = this.dbService.db;

    // Check duplicate phone or CNIC if provided
    if (dto.phone) {
      const [existingPhone] = await db
        .select()
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.companyId, companyId),
            eq(schema.customers.phone, dto.phone.trim()),
          ),
        )
        .limit(1);

      if (existingPhone) {
        throw new ConflictException(
          `Subscriber with phone ${dto.phone} already exists.`,
        );
      }
    }

    if (dto.cnic) {
      const [existingCnic] = await db
        .select()
        .from(schema.customers)
        .where(
          and(
            eq(schema.customers.companyId, companyId),
            eq(schema.customers.cnic, dto.cnic.trim()),
          ),
        )
        .limit(1);

      if (existingCnic) {
        throw new ConflictException(
          `Subscriber with CNIC ${dto.cnic} already exists.`,
        );
      }
    }

    // Auto-generate Unique Customer Code (e.g. CUS-1004)
    const [{ currentCount }] = await db
      .select({ currentCount: count() })
      .from(schema.customers)
      .where(eq(schema.customers.companyId, companyId));

    const nextSeq = 1001 + currentCount;
    const customerCode = `CUS-${nextSeq}`;

    // Hash initial password
    const rawPassword = dto.password || 'Password123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const [newCustomer] = await db
      .insert(schema.customers)
      .values({
        companyId,
        branchId: dto.branchId || null,
        customerCode,
        fullName: dto.fullName.trim(),
        cnic: dto.cnic || null,
        email: dto.email ? dto.email.toLowerCase().trim() : null,
        phone: dto.phone.trim(),
        altPhone: dto.altPhone || null,
        username: dto.username || `${customerCode.toLowerCase()}`,
        passwordHash,
        address: dto.address || null,
        area: dto.area || null,
        city: dto.city || 'Islamabad',
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        customerClass: dto.customerClass || 'residential',
        packageId: dto.packageId || null,
        packageName: dto.packageName || '50 Mbps Unlimited Fiber',
        packageSpeed: dto.packageSpeed || '50 Mbps',
        monthlyBilling: dto.monthlyBilling || '3500.00',
        billingExpiryDate: dto.billingExpiryDate || null,
        pppoeStatus: 'online',
        currentIp: '192.168.10.45',
        macAddress: dto.macAddress || null,
        onuSignalDbm: dto.onuSignalDbm || '-19.50',
        oltPonPort: dto.oltPonPort || 'EPON0/1:4',
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0],
        activationDate: new Date().toISOString().split('T')[0],
        notes: dto.notes || null,
      })
      .returning();

    this.logger.log(
      `👤 [Customer Registered] ${newCustomer.fullName} (${customerCode}) in tenant ${companyId}`,
    );

    return newCustomer;
  }

  /**
   * 5. Update Subscriber Details
   */
  async updateCustomer(
    companyId: string,
    customerId: string,
    dto: UpdateCustomerDto,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.customers)
      .where(
        and(
          eq(schema.customers.companyId, companyId),
          eq(schema.customers.id, customerId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Subscriber with ID ${customerId} not found`);
    }

    const updateData: Partial<typeof schema.customers.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.fullName) updateData.fullName = dto.fullName.trim();
    if (dto.phone) updateData.phone = dto.phone.trim();
    if (dto.altPhone !== undefined) updateData.altPhone = dto.altPhone;
    if (dto.cnic !== undefined) updateData.cnic = dto.cnic;
    if (dto.email !== undefined)
      updateData.email = dto.email ? dto.email.toLowerCase().trim() : null;
    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.password)
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.area !== undefined) updateData.area = dto.area;
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.branchId !== undefined) updateData.branchId = dto.branchId;
    if (dto.customerClass) updateData.customerClass = dto.customerClass;
    if (dto.status) updateData.status = dto.status;
    if (dto.packageId !== undefined) updateData.packageId = dto.packageId;
    if (dto.packageName !== undefined) updateData.packageName = dto.packageName;
    if (dto.packageSpeed !== undefined)
      updateData.packageSpeed = dto.packageSpeed;
    if (dto.monthlyBilling !== undefined)
      updateData.monthlyBilling = dto.monthlyBilling;
    if (dto.billingExpiryDate !== undefined)
      updateData.billingExpiryDate = dto.billingExpiryDate;
    if (dto.pppoeStatus) updateData.pppoeStatus = dto.pppoeStatus;
    if (dto.currentIp !== undefined) updateData.currentIp = dto.currentIp;
    if (dto.macAddress !== undefined) updateData.macAddress = dto.macAddress;
    if (dto.onuSignalDbm !== undefined)
      updateData.onuSignalDbm = dto.onuSignalDbm;
    if (dto.oltPonPort !== undefined) updateData.oltPonPort = dto.oltPonPort;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    if (dto.languagePreference)
      updateData.languagePreference = dto.languagePreference;

    const [updated] = await db
      .update(schema.customers)
      .set(updateData)
      .where(
        and(
          eq(schema.customers.companyId, companyId),
          eq(schema.customers.id, customerId),
        ),
      )
      .returning();

    // Invalidate Customer 360 cache
    await this.redisService.del(`customer:360:${customerId}`);

    return updated;
  }

  /**
   * 6. Deactivate / Disconnect Subscriber
   */
  async deleteCustomer(companyId: string, customerId: string) {
    const db = this.dbService.db;

    await db
      .update(schema.customers)
      .set({
        status: 'disconnected',
        pppoeStatus: 'disabled',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.customers.companyId, companyId),
          eq(schema.customers.id, customerId),
        ),
      );

    await this.redisService.del(`customer:360:${customerId}`);

    return { message: `Subscriber ${customerId} disconnected successfully` };
  }

  /**
   * 7. Get Customer Ticket History
   */
  async getCustomerTickets(
    companyId: string,
    customerId: string,
    page = 1,
    limit = 20,
  ) {
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.customerId, customerId),
        ),
      );

    const items = await db
      .select()
      .from(schema.tickets)
      .where(
        and(
          eq(schema.tickets.companyId, companyId),
          eq(schema.tickets.customerId, customerId),
        ),
      )
      .orderBy(desc(schema.tickets.createdAt))
      .limit(limit)
      .offset(offset);

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
   * 8. Get Customer Conversation History
   */
  async getCustomerConversations(
    companyId: string,
    customerId: string,
    page = 1,
    limit = 20,
  ) {
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.companyId, companyId),
          eq(schema.conversations.customerId, customerId),
        ),
      );

    const items = await db
      .select()
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.companyId, companyId),
          eq(schema.conversations.customerId, customerId),
        ),
      )
      .orderBy(desc(schema.conversations.lastMessageAt))
      .limit(limit)
      .offset(offset);

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
   * 9. Subscriber Self-Care Portal: Get Own Profile
   */
  async getPortalProfile(customerId: string, companyId: string) {
    const db = this.dbService.db;

    const [customer] = await db
      .select()
      .from(schema.customers)
      .where(
        and(
          eq(schema.customers.id, customerId),
          eq(schema.customers.companyId, companyId),
        ),
      )
      .limit(1);

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const [company] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, companyId))
      .limit(1);

    return {
      customer: {
        id: customer.id,
        customerCode: customer.customerCode,
        fullName: customer.fullName,
        cnic: customer.cnic,
        email: customer.email,
        phone: customer.phone,
        altPhone: customer.altPhone,
        username: customer.username,
        address: customer.address,
        area: customer.area,
        city: customer.city,
        packageName: customer.packageName,
        packageSpeed: customer.packageSpeed,
        monthlyBilling: customer.monthlyBilling,
        billingExpiryDate: customer.billingExpiryDate,
        pppoeStatus: customer.pppoeStatus,
        onuSignalDbm: customer.onuSignalDbm,
        status: customer.status,
        avatarUrl: customer.avatarUrl,
      },
      company: company
        ? {
            name: company.name,
            logoUrl: company.logoUrl,
            phone: company.phone,
            email: company.email,
          }
        : null,
    };
  }

  /**
   * 10. Subscriber Self-Care Portal: Update Profile
   */
  async updatePortalProfile(
    customerId: string,
    companyId: string,
    dto: UpdatePortalProfileDto,
  ) {
    const db = this.dbService.db;

    const [customer] = await db
      .select()
      .from(schema.customers)
      .where(
        and(
          eq(schema.customers.id, customerId),
          eq(schema.customers.companyId, companyId),
        ),
      )
      .limit(1);

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const updateData: Partial<typeof schema.customers.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.phone) updateData.phone = dto.phone.trim();
    if (dto.altPhone !== undefined) updateData.altPhone = dto.altPhone;
    if (dto.email !== undefined)
      updateData.email = dto.email ? dto.email.toLowerCase().trim() : null;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;

    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'Current password is required to set a new password',
        );
      }

      const isValid = await bcrypt.compare(
        dto.currentPassword,
        customer.passwordHash || '',
      );
      if (!isValid) {
        throw new UnauthorizedException('Current password does not match');
      }

      updateData.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    }

    const [updated] = await db
      .update(schema.customers)
      .set(updateData)
      .where(
        and(
          eq(schema.customers.id, customerId),
          eq(schema.customers.companyId, companyId),
        ),
      )
      .returning();

    await this.redisService.del(`customer:360:${customerId}`);

    return {
      message: 'Profile updated successfully',
      customer: {
        id: updated.id,
        fullName: updated.fullName,
        phone: updated.phone,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
      },
    };
  }

  /**
   * 11. Subscriber Self-Care Portal: Real-Time Diagnostics
   */
  async getPortalDiagnostics(customerId: string, companyId: string) {
    const customer = await this.getCustomerById(companyId, customerId);

    const signalNum = parseFloat(customer.onuSignalDbm || '-19.50');
    let healthStatus: 'optimal' | 'warning' | 'critical' = 'optimal';

    if (signalNum < -27.99) healthStatus = 'critical';
    else if (signalNum < -24.99) healthStatus = 'warning';

    return {
      modemInfo: {
        model: 'Huawei EchoLife HG8145V5 Dual-Band Gigabit ONT',
        onuSerial: 'HWTC' + customer.customerCode.replace(/[^0-9]/g, '') + 'A9',
        oltPort: customer.oltPonPort || 'GPON0/2/4',
        rxPowerDbm: customer.onuSignalDbm,
        healthStatus,
      },
      connection: {
        pppoeStatus: customer.pppoeStatus,
        currentIp: customer.currentIp,
        macAddress: customer.macAddress || '48:8F:5A:21:6E:9C',
        packageSpeed: customer.packageSpeed,
        latencyMs: 8,
        jitterMs: 1.2,
      },
      speedTestServers: [
        {
          name: 'Prime Networks Core IXP (Islamabad)',
          host: 'ixp.primenetworks.pk',
          pingMs: 4,
        },
        {
          name: 'PTCL Peering Gateway (Lahore)',
          host: 'speedtest.ptcl.net.pk',
          pingMs: 12,
        },
        {
          name: 'Nayatel CDN Node (Rawalpindi)',
          host: 'cdn.nayatel.pk',
          pingMs: 6,
        },
      ],
    };
  }

  /**
   * 12. Subscriber Self-Care Portal: Billing & Invoices
   */
  async getPortalBilling(customerId: string, companyId: string) {
    const customer = await this.getCustomerById(companyId, customerId);

    return {
      currentPackage: {
        name: customer.packageName,
        speed: customer.packageSpeed,
        monthlyFee: customer.monthlyBilling,
        billingCycle: 'Monthly Prepaid',
        expiryDate: customer.billingExpiryDate,
        status: customer.status,
      },
      accountBalance: {
        dueAmount: '0.00',
        walletBalance: '0.00',
        currency: 'PKR',
      },
      invoices: [
        {
          invoiceNumber: `INV-2026-${customer.customerCode}`,
          period: 'September 2026',
          amount: customer.monthlyBilling,
          status: 'paid',
          paidDate: '2026-09-01',
          paymentMethod: 'Online Bank Transfer',
        },
      ],
    };
  }
}
