import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import {
  DEMO_PLATFORM_OWNER,
  DEMO_COMPANY,
  DEMO_BRANCHES,
  DEMO_PERMISSION_CATEGORIES,
  DEMO_PERMISSIONS_LIST,
  DEFAULT_PERMISSION_GROUPS,
  DEMO_STAFF_USERS,
  DEMO_CUSTOMERS,
  DEMO_QUICK_REPLIES,
  DEMO_CONVERSATION,
  DEMO_TICKETS,
  INITIAL_PACKAGES,
  INITIAL_DEPARTMENTS,
  INITIAL_LEADS,
  INITIAL_SHIFTS,
  INITIAL_ATTENDANCE,
  INITIAL_WORK_ORDERS,
  INITIAL_SLA_RULES,
} from './seeds';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://primeone_user:securepassword123@localhost:5433/primeone';

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Starting Prime One Enterprise Database Seeding...');

  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Seed Platform Owner (Super Admin)
    console.log('1. Seeding Platform Owner from dummy presets...');
    const [platformOwner] = await db
      .insert(schema.platformOwners)
      .values({
        ...DEMO_PLATFORM_OWNER,
        passwordHash,
      })
      .onConflictDoNothing()
      .returning();

    const ownerId = platformOwner?.id;

    // 2. Seed Initial ISP Tenant (Prime Networks)
    console.log('2. Seeding ISP Company from dummy presets...');
    const [company] = await db
      .insert(schema.companies)
      .values({
        ...DEMO_COMPANY,
        createdBy: ownerId,
      })
      .onConflictDoNothing()
      .returning();

    const companyId = company?.id;

    if (!companyId) {
      console.log('ℹ️ Company already exists. Fetching existing company...');
      const [existingCompany] = await db
        .select()
        .from(schema.companies)
        .where(eq(schema.companies.slug, DEMO_COMPANY.slug));
      if (!existingCompany) {
        throw new Error('Failed to resolve company ID');
      }
      return await runTenantSeed(existingCompany.id, passwordHash);
    }

    await runTenantSeed(companyId, passwordHash);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ Seeding failed:', msg);
  } finally {
    await client.end();
  }
}

async function runTenantSeed(companyId: string, passwordHash: string) {
  // 3. Seed Branches
  console.log('3. Seeding Branches from dummy presets...');
  const branchMap = new Map<string, string>();

  for (const b of DEMO_BRANCHES) {
    const [insertedBranch] = await db
      .insert(schema.branches)
      .values({
        ...b,
        companyId,
      })
      .onConflictDoNothing()
      .returning();

    if (insertedBranch) {
      branchMap.set(b.code, insertedBranch.id);
    }
  }

  if (branchMap.size === 0) {
    const existingBranches = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.companyId, companyId));
    for (const eb of existingBranches) {
      branchMap.set(eb.code, eb.id);
    }
  }

  const defaultBranchId =
    branchMap.get('ISB-01') || Array.from(branchMap.values())[0];

  // 4. Seed Permission Categories & Permissions
  console.log('4. Seeding Granular RBAC Permissions from dummy presets...');
  const catMap = new Map<string, string>();
  for (const cat of DEMO_PERMISSION_CATEGORIES) {
    const [insertedCat] = await db
      .insert(schema.permissionCategories)
      .values({
        companyId,
        name: cat.name,
        slug: cat.slug,
        displayOrder: cat.order,
      })
      .onConflictDoNothing()
      .returning();

    if (insertedCat) {
      catMap.set(cat.slug, insertedCat.id);
    }
  }

  if (catMap.size === 0) {
    const existingCats = await db
      .select()
      .from(schema.permissionCategories)
      .where(eq(schema.permissionCategories.companyId, companyId));
    for (const ec of existingCats) {
      catMap.set(ec.slug, ec.id);
    }
  }

  const permMap = new Map<string, string>();
  for (const p of DEMO_PERMISSIONS_LIST) {
    const categoryId = catMap.get(p.cat);
    if (categoryId) {
      const [insertedPerm] = await db
        .insert(schema.permissions)
        .values({
          categoryId,
          name: p.name,
          slug: p.slug,
          isSystem: true,
        })
        .onConflictDoNothing()
        .returning();

      if (insertedPerm) {
        permMap.set(p.slug, insertedPerm.id);
      }
    }
  }

  if (permMap.size === 0) {
    const existingPerms = await db.select().from(schema.permissions);
    for (const ep of existingPerms) {
      permMap.set(ep.slug, ep.id);
    }
  }

  // 5. Seed Permission Groups from dummy presets
  console.log('5. Seeding Permission Groups from dummy presets...');
  const groupMap = new Map<string, string>();

  for (const group of DEFAULT_PERMISSION_GROUPS) {
    const [insertedGroup] = await db
      .insert(schema.permissionGroups)
      .values({
        companyId,
        name: group.name,
        description: group.description,
        isDefault: group.isDefault,
      })
      .onConflictDoNothing()
      .returning();

    if (insertedGroup) {
      groupMap.set(group.name, insertedGroup.id);
    }
  }

  if (groupMap.size === 0) {
    const existingGroups = await db
      .select()
      .from(schema.permissionGroups)
      .where(eq(schema.permissionGroups.companyId, companyId));
    for (const eg of existingGroups) {
      groupMap.set(eg.name, eg.id);
    }
  }

  const adminGroupId = Array.from(groupMap.values())[0];

  // Attach all permissions to Admin Group
  for (const permId of permMap.values()) {
    await db
      .insert(schema.permissionGroupPermissions)
      .values({
        permissionGroupId: adminGroupId,
        permissionId: permId,
        granted: true,
      })
      .onConflictDoNothing();
  }

  // 6. Seed Staff Accounts from dummy presets
  console.log('6. Seeding Staff Accounts from dummy presets...');
  const userMap = new Map<string, string>();

  for (const u of DEMO_STAFF_USERS) {
    const branchId = branchMap.get(u.branchCode) || defaultBranchId;
    const [insertedUser] = await db
      .insert(schema.users)
      .values({
        companyId,
        branchId,
        email: u.email,
        username: u.username,
        fullName: u.fullName,
        displayName: u.displayName,
        userType: u.userType,
        department: u.department,
        designation: u.designation,
        passwordHash,
        isActive: u.isActive,
        isOnline: u.isOnline,
      })
      .onConflictDoNothing()
      .returning();

    if (insertedUser) {
      userMap.set(u.key, insertedUser.id);
      userMap.set(u.username, insertedUser.id);

      // Attach to admin group
      await db
        .insert(schema.userPermissionGroups)
        .values({
          userId: insertedUser.id,
          permissionGroupId: adminGroupId,
        })
        .onConflictDoNothing();
    }
  }

  if (userMap.size === 0) {
    const existingUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.companyId, companyId));
    for (const eu of existingUsers) {
      userMap.set(eu.username, eu.id);
      if (!userMap.has('agent')) userMap.set('agent', eu.id);
    }
  }

  // 7. Seed ISP Customers from dummy presets
  console.log('7. Seeding ISP Customers from dummy presets...');
  const customerMap = new Map<string, string>();

  for (const c of DEMO_CUSTOMERS) {
    const branchId = branchMap.get(c.branchCode) || defaultBranchId;
    const [insertedCust] = await db
      .insert(schema.customers)
      .values({
        companyId,
        branchId,
        customerCode: c.customerCode,
        fullName: c.fullName,
        cnic: c.cnic,
        email: c.email,
        phone: c.phone,
        username: c.username,
        passwordHash,
        address: c.address,
        area: c.area,
        city: c.city,
        latitude: c.latitude,
        longitude: c.longitude,
        customerClass: c.customerClass,
        packageName: c.packageName,
        packageSpeed: c.packageSpeed,
        monthlyBilling: c.monthlyBilling,
        pppoeStatus: c.pppoeStatus,
        currentIp: c.currentIp,
        macAddress: c.macAddress,
        onuSignalDbm: c.onuSignalDbm,
        oltPonPort: c.oltPonPort,
        status: c.status,
      })
      .onConflictDoNothing()
      .returning();

    if (insertedCust) {
      customerMap.set(c.customerCode, insertedCust.id);
    }
  }

  if (customerMap.size === 0) {
    const existingCusts = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.companyId, companyId));
    for (const ec of existingCusts) {
      customerMap.set(ec.customerCode, ec.id);
    }
  }

  // 8. Seed Quick Replies from dummy presets
  console.log('8. Seeding Quick Replies from dummy presets...');
  const agentUserId = userMap.get('agent') || Array.from(userMap.values())[0];

  for (const qr of DEMO_QUICK_REPLIES) {
    await db
      .insert(schema.quickReplies)
      .values({
        companyId,
        title: qr.title,
        shortcut: qr.shortcut,
        content: qr.content,
        category: qr.category,
        createdBy: agentUserId,
      })
      .onConflictDoNothing();
  }

  // 9. Seed Demo Live Chat Conversation from dummy presets
  console.log('9. Seeding Demo Chat from dummy presets...');
  const chatCustomerId =
    customerMap.get(DEMO_CONVERSATION.customerCode) ||
    Array.from(customerMap.values())[0];

  if (chatCustomerId && agentUserId) {
    const [conv1] = await db
      .insert(schema.conversations)
      .values({
        companyId,
        customerId: chatCustomerId,
        initiatedBy: DEMO_CONVERSATION.initiatedBy,
        status: DEMO_CONVERSATION.status,
        assignedTo: agentUserId,
        assignedAt: new Date(),
        priority: DEMO_CONVERSATION.priority,
        subject: DEMO_CONVERSATION.subject,
        lastMessageAt: new Date(),
        unreadCountStaff: 0,
        unreadCountCustomer: 0,
      })
      .onConflictDoNothing()
      .returning();

    if (conv1) {
      for (const msg of DEMO_CONVERSATION.messages) {
        await db.insert(schema.messages).values({
          conversationId: conv1.id,
          companyId,
          senderType: msg.senderType,
          senderCustomerId:
            msg.senderType === 'customer' ? chatCustomerId : null,
          senderUserId: msg.senderType === 'staff' ? agentUserId : null,
          senderName: msg.senderName,
          messageType: msg.messageType,
          isInternalNote: msg.isInternalNote ?? false,
          content: msg.content,
          status: msg.status,
        });
      }
    }
  }

  // 10. Seed Demo Trouble Ticket from dummy presets
  console.log('10. Seeding Demo Tickets from dummy presets...');
  for (const tkt of DEMO_TICKETS) {
    const tktCustomerId = tkt.customerCode
      ? customerMap.get(tkt.customerCode)
      : null;
    const tktBranchId = branchMap.get(tkt.branchCode) || defaultBranchId;
    const assignedUserId = userMap.get(tkt.assignedUsername) || agentUserId;

    if (tktBranchId) {
      const [insertedTicket] = await db
        .insert(schema.tickets)
        .values({
          companyId,
          ticketNumber: tkt.ticketNumber,
          ticketScope: tkt.ticketScope || 'subscriber',
          customerId: tktCustomerId || null,
          branchId: tktBranchId,
          category: tkt.category,
          priority: tkt.priority,
          status: tkt.status,
          title: tkt.title,
          description: tkt.description,
          assignedDepartment: tkt.assignedDepartment,
          assignedTo: assignedUserId,
          createdBy: agentUserId,
          areaAffected: tkt.areaAffected || null,
          affectedSubscribersCount: tkt.affectedSubscribersCount || 0,
          oltPonPort: tkt.oltPonPort || null,
          sourcePonPort: tkt.sourcePonPort || null,
          destinationPonPort: tkt.destinationPonPort || null,
          splitterId: tkt.splitterId || null,
          coreCountAffected: tkt.coreCountAffected || null,
          cableType: tkt.cableType || null,
          otdrBreakDistanceMeters: tkt.otdrBreakDistanceMeters || null,
          opticalFaultType: tkt.opticalFaultType || null,
          ettr: new Date(Date.now() + 3 * 3600 * 1000),
          materialUsed: tkt.materialUsed,
          latitude: tkt.latitude,
          longitude: tkt.longitude,
        })
        .onConflictDoNothing()
        .returning();

      if (insertedTicket) {
        for (const act of tkt.activities) {
          await db.insert(schema.ticketActivities).values({
            ticketId: insertedTicket.id,
            companyId,
            userId: assignedUserId,
            activityType: act.activityType,
            comment: act.comment,
            oldValues: act.oldValues || null,
            newValues: act.newValues || null,
          });
        }
      }
    }
  }

  // 11. Seed Tariff Packages
  console.log('11. Seeding Tariff Packages...');
  for (const pkg of INITIAL_PACKAGES) {
    await db
      .insert(schema.packages)
      .values({
        ...pkg,
        companyId,
      })
      .onConflictDoNothing();
  }

  // 12. Seed Departments
  console.log('12. Seeding Departments...');
  for (const dept of INITIAL_DEPARTMENTS) {
    await db
      .insert(schema.departments)
      .values({
        ...dept,
        companyId,
      })
      .onConflictDoNothing();
  }

  // 13. Seed Connection Leads
  console.log('13. Seeding Connection Leads (CRM)...');
  for (const lead of INITIAL_LEADS) {
    await db
      .insert(schema.connectionLeads)
      .values({
        ...lead,
        companyId,
        branchId: defaultBranchId,
      })
      .onConflictDoNothing();
  }

  // 14. Seed Shift Rosters
  console.log('14. Seeding Shift Rosters...');
  for (const shift of INITIAL_SHIFTS) {
    await db
      .insert(schema.shiftRosters)
      .values({
        ...shift,
        companyId,
      })
      .onConflictDoNothing();
  }

  // 15. Seed Attendance Logs
  console.log('15. Seeding Attendance Logs...');
  for (const att of INITIAL_ATTENDANCE) {
    await db
      .insert(schema.attendanceLogs)
      .values({
        ...att,
        companyId,
      })
      .onConflictDoNothing();
  }

  // 16. Seed Work Orders
  console.log('16. Seeding Work Orders...');
  for (const wo of INITIAL_WORK_ORDERS) {
    await db
      .insert(schema.workOrderTasks)
      .values({
        ...wo,
        companyId,
      })
      .onConflictDoNothing();
  }

  // 17. Seed SLA Rules
  console.log('17. Seeding SLA Rules...');
  for (const sla of INITIAL_SLA_RULES) {
    await db
      .insert(schema.slaRules)
      .values({
        ...sla,
        companyId,
      })
      .onConflictDoNothing();
  }

  console.log('✅ Prime One Database Seeding Completed Successfully!');
}

void seed();
