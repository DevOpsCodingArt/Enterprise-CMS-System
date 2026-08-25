import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://primeone_user:securepassword123@localhost:5432/primeone';

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Starting Prime One Enterprise Database Seeding...');

  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Seed Platform Owner (Super Admin)
    console.log('1. Seeding Platform Owner...');
    const [platformOwner] = await db
      .insert(schema.platformOwners)
      .values({
        email: 'superadmin@primeone.io',
        name: 'Prime One Super Admin',
        passwordHash,
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    const ownerId = platformOwner?.id;

    // 2. Seed Initial ISP Tenant (Prime Networks)
    console.log('2. Seeding ISP Company (Prime Networks)...');
    const [company] = await db
      .insert(schema.companies)
      .values({
        name: 'Prime Networks',
        slug: 'prime-networks',
        logoUrl: '/logos/prime-networks.png',
        primaryColor: '#0ea5e9', // Sky Blue
        secondaryColor: '#0284c7',
        address: 'Tower A, Blue Area, Islamabad, Pakistan',
        phone: '+92 51 111 774 631',
        email: 'info@primenetworks.pk',
        website: 'https://primenetworks.pk',
        apiKey: 'pk_live_primenet_a98f7e6d5c4b3a21',
        apiSecret: 'sk_live_primenet_sec_998877665544332211',
        subscriptionPlan: 'enterprise_isp',
        maxUsers: 150,
        maxBranches: 20,
        isActive: true,
        timezone: 'Asia/Karachi',
        defaultLanguage: 'en',
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
        .where(eq(schema.companies.slug, 'prime-networks'));
      if (!existingCompany) {
        throw new Error('Failed to resolve company ID');
      }
      return runTenantSeed(existingCompany.id, passwordHash);
    }

    await runTenantSeed(companyId, passwordHash);
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await client.end();
  }
}

async function runTenantSeed(companyId: string, passwordHash: string) {
  // 3. Seed Branches
  console.log('3. Seeding Branches...');
  const [branchIsb] = await db
    .insert(schema.branches)
    .values({
      companyId,
      name: 'Islamabad Head Office',
      code: 'ISB-01',
      address: 'Plot 12, Executive Heights, Blue Area, Islamabad',
      phone: '+92 51 2800100',
      email: 'isb@primenetworks.pk',
      latitude: '33.7182',
      longitude: '73.0605',
    })
    .returning();

  const [branchRwp] = await db
    .insert(schema.branches)
    .values({
      companyId,
      name: 'Rawalpindi Branch',
      code: 'RWP-01',
      address: 'Bank Road, Saddar, Rawalpindi',
      phone: '+92 51 5560100',
      email: 'rwp@primenetworks.pk',
      latitude: '33.5989',
      longitude: '73.0538',
    })
    .returning();

  const [branchLhr] = await db
    .insert(schema.branches)
    .values({
      companyId,
      name: 'Lahore Central Branch',
      code: 'LHR-01',
      address: 'Main Boulevard, Gulberg III, Lahore',
      phone: '+92 42 3570010',
      email: 'lhr@primenetworks.pk',
      latitude: '31.5204',
      longitude: '74.3587',
    })
    .returning();

  // 4. Seed Permission Categories & Permissions
  console.log('4. Seeding Granular RBAC Permissions...');
  const categoriesData = [
    { name: 'Live Chat Management', slug: 'chat', order: 1 },
    { name: 'Trouble Tickets & Complaints', slug: 'ticket', order: 2 },
    { name: 'Customer 360 & CRM', slug: 'customer', order: 3 },
    { name: 'User & Staff Management', slug: 'user', order: 4 },
    { name: 'Branch Operations', slug: 'branch', order: 5 },
    { name: 'Network & Hardware Diagnostics', slug: 'network', order: 6 },
    { name: 'Reports & Analytics', slug: 'reports', order: 7 },
    { name: 'Company Settings & Branding', slug: 'settings', order: 8 },
  ];

  const catMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const [insertedCat] = await db
      .insert(schema.permissionCategories)
      .values({
        companyId,
        name: cat.name,
        slug: cat.slug,
        displayOrder: cat.order,
      })
      .returning();
    catMap.set(cat.slug, insertedCat.id);
  }

  const permissionsList = [
    // Chat
    { cat: 'chat', slug: 'chat.view', name: 'View Live Chats' },
    { cat: 'chat', slug: 'chat.send', name: 'Send Chat Messages' },
    { cat: 'chat', slug: 'chat.assign', name: 'Assign Chat Conversations' },
    { cat: 'chat', slug: 'chat.transfer', name: 'Transfer Chat to Agent/Dept' },
    { cat: 'chat', slug: 'chat.close', name: 'Close Chat with Outcome' },
    { cat: 'chat', slug: 'chat.view_internal_notes', name: 'View Private Staff Notes' },
    { cat: 'chat', slug: 'chat.add_internal_note', name: 'Add Private Staff Notes' },
    { cat: 'chat', slug: 'chat.manage_quick_replies', name: 'Manage Canned Quick Replies' },
    // Tickets
    { cat: 'ticket', slug: 'ticket.view', name: 'View Trouble Tickets' },
    { cat: 'ticket', slug: 'ticket.create', name: 'Create Complaints & Work Orders' },
    { cat: 'ticket', slug: 'ticket.assign', name: 'Dispatch & Assign Engineers' },
    { cat: 'ticket', slug: 'ticket.update_status', name: 'Update Ticket Status & Notes' },
    { cat: 'ticket', slug: 'ticket.resolve', name: 'Resolve Ticket with Evidence' },
    { cat: 'ticket', slug: 'ticket.close', name: 'Close & Verify Tickets' },
    // Customer
    { cat: 'customer', slug: 'customer.view', name: 'View Customer Directory' },
    { cat: 'customer', slug: 'customer.view_360', name: 'View Customer 360° Diagnostics' },
    { cat: 'customer', slug: 'customer.create', name: 'Register New Customers' },
    { cat: 'customer', slug: 'customer.edit', name: 'Edit Customer Information' },
    // User / Staff
    { cat: 'user', slug: 'user.view', name: 'View Staff Directory' },
    { cat: 'user', slug: 'user.create', name: 'Create Staff Users' },
    { cat: 'user', slug: 'user.edit', name: 'Edit Staff Details' },
    { cat: 'user', slug: 'user.manage_permissions', name: 'Manage RBAC Permissions' },
    // Branch
    { cat: 'branch', slug: 'branch.view', name: 'View Branches' },
    { cat: 'branch', slug: 'branch.manage', name: 'Create & Edit Branches' },
    // Network
    { cat: 'network', slug: 'network.diagnostics', name: 'View MikroTik & OLT Signal Diagnostics' },
    { cat: 'network', slug: 'network.reboot_onu', name: 'Remote Reboot ONU / PPPoE Reset' },
    // Reports
    { cat: 'reports', slug: 'reports.view_chat', name: 'View Helpdesk Chat Analytics' },
    { cat: 'reports', slug: 'reports.view_tickets', name: 'View Ticket SLA & Outage Reports' },
    // Settings
    { cat: 'settings', slug: 'settings.branding', name: 'Update Company Branding & Colors' },
    { cat: 'settings', slug: 'settings.working_hours', name: 'Configure Working Hours' },
  ];

  const permMap = new Map<string, string>();
  for (const p of permissionsList) {
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
        .returning();
      permMap.set(p.slug, insertedPerm.id);
    }
  }

  // 5. Seed Permission Groups
  console.log('5. Seeding Permission Groups...');
  const [adminGroup] = await db
    .insert(schema.permissionGroups)
    .values({
      companyId,
      name: 'Company Owner / Admin',
      description: 'Full administrative access across all modules',
      isDefault: false,
    })
    .returning();

  const [supervisorGroup] = await db
    .insert(schema.permissionGroups)
    .values({
      companyId,
      name: 'Support Supervisor',
      description: 'Monitors chats, escalates tickets, views analytics',
      isDefault: false,
    })
    .returning();

  const [helpdeskGroup] = await db
    .insert(schema.permissionGroups)
    .values({
      companyId,
      name: 'Helpdesk Agent (CSR)',
      description: 'Handles incoming live chats, creates tickets, views customer 360',
      isDefault: true,
    })
    .returning();

  const [fieldGroup] = await db
    .insert(schema.permissionGroups)
    .values({
      companyId,
      name: 'Field Engineer',
      description: 'Resolves assigned trouble tickets and records material usage',
      isDefault: false,
    })
    .returning();

  // Attach all permissions to Admin Group
  for (const permId of permMap.values()) {
    await db.insert(schema.permissionGroupPermissions).values({
      permissionGroupId: adminGroup.id,
      permissionId: permId,
      granted: true,
    });
  }

  // 6. Seed Staff Accounts
  console.log('6. Seeding Staff Accounts...');
  const [adminUser] = await db
    .insert(schema.users)
    .values({
      companyId,
      branchId: branchIsb.id,
      email: 'admin@primenetworks.pk',
      username: 'admin',
      fullName: 'Tariq Mehmood',
      displayName: 'Tariq (Admin)',
      userType: 'company_owner',
      department: 'management',
      designation: 'CEO / Operations Director',
      passwordHash,
      isActive: true,
      isOnline: true,
    })
    .returning();

  const [supervisorUser] = await db
    .insert(schema.users)
    .values({
      companyId,
      branchId: branchIsb.id,
      email: 'supervisor@primenetworks.pk',
      username: 'supervisor',
      fullName: 'Khurram Shahzad',
      displayName: 'Khurram (Supervisor)',
      userType: 'staff',
      department: 'helpdesk',
      designation: 'Support Operations Supervisor',
      passwordHash,
      isActive: true,
      isOnline: true,
    })
    .returning();

  const [agentUser] = await db
    .insert(schema.users)
    .values({
      companyId,
      branchId: branchIsb.id,
      email: 'agent@primenetworks.pk',
      username: 'agent.ali',
      fullName: 'Ali Raza',
      displayName: 'Agent Ali',
      userType: 'staff',
      department: 'helpdesk',
      designation: 'Helpdesk Senior CSR',
      passwordHash,
      isActive: true,
      isOnline: true,
    })
    .returning();

  const [fieldUser] = await db
    .insert(schema.users)
    .values({
      companyId,
      branchId: branchRwp.id,
      email: 'field@primenetworks.pk',
      username: 'field.usman',
      fullName: 'Usman Splicer',
      displayName: 'Usman (Field Tech)',
      userType: 'staff',
      department: 'field_operations',
      designation: 'Senior Fiber Splicer',
      passwordHash,
      isActive: true,
      isOnline: false,
    })
    .returning();

  // Link users to permission groups
  await db.insert(schema.userPermissionGroups).values([
    { userId: adminUser.id, permissionGroupId: adminGroup.id },
    { userId: supervisorUser.id, permissionGroupId: supervisorGroup.id },
    { userId: agentUser.id, permissionGroupId: helpdeskGroup.id },
    { userId: fieldUser.id, permissionGroupId: fieldGroup.id },
  ]);

  // 7. Seed ISP Customers
  console.log('7. Seeding ISP Customers with Telemetry...');
  const [custAli] = await db
    .insert(schema.customers)
    .values({
      companyId,
      branchId: branchIsb.id,
      customerCode: 'CUS-1001',
      fullName: 'Muhammad Ali Khan',
      cnic: '61101-1234567-1',
      email: 'ali.khan@gmail.com',
      phone: '+92 300 1234567',
      username: 'ali.fiber50',
      passwordHash,
      address: 'House 45, Street 12, F-10/2, Islamabad',
      area: 'F-10/2',
      city: 'Islamabad',
      latitude: '33.6934',
      longitude: '73.0112',
      customerClass: 'residential',
      packageName: '50 Mbps Fiber Unlimited',
      packageSpeed: '50 Mbps',
      monthlyBilling: '3500.00',
      pppoeStatus: 'online',
      currentIp: '192.168.10.45',
      macAddress: 'BC:A9:93:4F:11:A2',
      onuSignalDbm: '-19.50',
      oltPonPort: 'EPON0/1:4',
      status: 'active',
    })
    .returning();

  const [custFatima] = await db
    .insert(schema.customers)
    .values({
      companyId,
      branchId: branchIsb.id,
      customerCode: 'CUS-1002',
      fullName: 'Fatima Corporate Services Ltd',
      cnic: '37405-9876543-2',
      email: 'info@fatimacorp.pk',
      phone: '+92 333 9876543',
      username: 'fatima.corp100',
      passwordHash,
      address: 'Office 402, Evacuee Trust Complex, Blue Area, Islamabad',
      area: 'Blue Area',
      city: 'Islamabad',
      latitude: '33.7214',
      longitude: '73.0782',
      customerClass: 'corporate',
      packageName: '100 Mbps Dedicated Symmetrical Fiber',
      packageSpeed: '100 Mbps',
      monthlyBilling: '18500.00',
      pppoeStatus: 'online',
      currentIp: '192.168.10.82',
      macAddress: '48:8F:5A:21:6E:9C',
      onuSignalDbm: '-18.20',
      oltPonPort: 'GPON0/2:1',
      status: 'active',
    })
    .returning();

  const [custUsman] = await db
    .insert(schema.customers)
    .values({
      companyId,
      branchId: branchRwp.id,
      customerCode: 'CUS-1003',
      fullName: 'Usman Tariq',
      cnic: '37405-1122334-9',
      email: 'usman.t@yahoo.com',
      phone: '+92 321 5566778',
      username: 'usman.home30',
      passwordHash,
      address: 'Flat 3, Al-Madina Arcade, Saddar, Rawalpindi',
      area: 'Saddar',
      city: 'Rawalpindi',
      latitude: '33.5992',
      longitude: '73.0545',
      customerClass: 'residential',
      packageName: '30 Mbps Fiber Starter',
      packageSpeed: '30 Mbps',
      monthlyBilling: '2500.00',
      pppoeStatus: 'offline',
      currentIp: '0.0.0.0',
      macAddress: 'E8:94:F6:12:34:56',
      onuSignalDbm: '-27.80', // Warning Weak Signal
      oltPonPort: 'EPON0/3:2',
      status: 'active',
    })
    .returning();

  // 8. Seed Canned Quick Replies
  console.log('8. Seeding Quick Replies...');
  await db.insert(schema.quickReplies).values([
    {
      companyId,
      title: 'Standard Greeting',
      shortcut: '/welcome',
      content: 'Hello! Thank you for contacting Prime Networks Customer Support. My name is Ali. How may I assist you with your internet connection today?',
      category: 'General',
      createdBy: agentUser.id,
    },
    {
      companyId,
      title: 'Reboot Router Guidance',
      shortcut: '/restart',
      content: 'Please turn off your fiber optical router/ONU from the main power switch, wait for 30 seconds, and turn it back on. Check if the PON and Internet lights turn solid green.',
      category: 'Troubleshooting',
      createdBy: agentUser.id,
    },
    {
      companyId,
      title: 'Speed Test Request',
      shortcut: '/speedtest',
      content: 'Could you please connect your PC/Laptop directly via Ethernet LAN cable and run a test at https://speedtest.net, then share a screenshot of the results here?',
      category: 'Technical',
      createdBy: agentUser.id,
    },
    {
      companyId,
      title: 'Payment Verification Received',
      shortcut: '/billing',
      content: 'Thank you for uploading the payment screenshot. We have sent it to our Billing Department for verification. Your account recharge will be posted within 15 minutes.',
      category: 'Billing',
      createdBy: agentUser.id,
    },
    {
      companyId,
      title: 'Issue Resolution Farewell',
      shortcut: '/farewell',
      content: 'We are glad your connection has been resolved! Please rate our service. Thank you for choosing Prime Networks. Have a wonderful day!',
      category: 'General',
      createdBy: agentUser.id,
    },
  ]);

  // 9. Seed Sample Live Chat Conversations & Messages
  console.log('9. Seeding Demo Conversations & Messages...');
  const [conv1] = await db
    .insert(schema.conversations)
    .values({
      companyId,
      customerId: custAli.id,
      initiatedBy: 'customer',
      status: 'active',
      assignedTo: agentUser.id,
      assignedAt: new Date(),
      priority: 'high',
      subject: 'Internet speed drop in evening hours',
      lastMessageAt: new Date(),
      unreadCountStaff: 0,
      unreadCountCustomer: 0,
    })
    .returning();

  await db.insert(schema.messages).values([
    {
      conversationId: conv1.id,
      companyId,
      senderType: 'customer',
      senderCustomerId: custAli.id,
      senderName: 'Muhammad Ali Khan',
      messageType: 'text',
      content: 'Hello, my internet speed is dropping significantly every evening around 8 PM. Can you check my connection?',
      status: 'read',
    },
    {
      conversationId: conv1.id,
      companyId,
      senderType: 'staff',
      senderUserId: agentUser.id,
      senderName: 'Agent Ali',
      messageType: 'text',
      content: 'Hello Muhammad Ali! Let me check your optical signal power and MikroTik live session right now.',
      status: 'read',
    },
    {
      conversationId: conv1.id,
      companyId,
      senderType: 'staff',
      senderUserId: agentUser.id,
      senderName: 'Agent Ali',
      messageType: 'text',
      isInternalNote: true,
      content: 'Checked SmartOLT: Signal is optimal (-19.5 dBm). MikroTik interface shows high latency on F-10 core switch.',
      status: 'read',
    },
    {
      conversationId: conv1.id,
      companyId,
      senderType: 'customer',
      senderCustomerId: custAli.id,
      senderName: 'Muhammad Ali Khan',
      messageType: 'text',
      content: 'Thank you. I have attached the speed test screenshot as well.',
      status: 'read',
    },
  ]);

  // 10. Seed Sample Trouble Ticket
  console.log('10. Seeding Trouble Ticket...');
  const [tkt1] = await db
    .insert(schema.tickets)
    .values({
      companyId,
      ticketNumber: 'TKT-2026-0001',
      customerId: custUsman.id,
      branchId: branchRwp.id,
      category: 'fiber_break',
      priority: 'urgent',
      status: 'in_progress',
      title: 'Red LOS Light - Total Optical Signal Loss in Saddar RWP',
      description: 'Customer reports sudden internet disconnection. Optical signal degraded to -27.8 dBm (LOS blinking red). Drop cable suspected to be damaged near street pole #14.',
      assignedDepartment: 'field_operations',
      assignedTo: fieldUser.id,
      createdBy: agentUser.id,
      ettr: new Date(Date.now() + 3 * 3600 * 1000), // 3 hours from now
      materialUsed: '150m 1-Core Drop Cable, 2x SC Fast Connectors',
      latitude: '33.5992',
      longitude: '73.0545',
    })
    .returning();

  await db.insert(schema.ticketActivities).values([
    {
      ticketId: tkt1.id,
      companyId,
      userId: agentUser.id,
      activityType: 'created',
      comment: 'Trouble Ticket generated from customer inquiry. Dispatched to Rawalpindi Field Team.',
    },
    {
      ticketId: tkt1.id,
      companyId,
      userId: fieldUser.id,
      activityType: 'status_changed',
      comment: 'Engineer reached Saddar site. Located cable damage near street 4.',
      oldValues: { status: 'open' },
      newValues: { status: 'in_progress' },
    },
  ]);

  console.log('✅ Prime One Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('🔑 Seed Credentials for Testing:');
  console.log('   Platform Super Admin: superadmin@primeone.io | Password123!');
  console.log('   Company Admin:        admin@primenetworks.pk | Password123!');
  console.log('   Helpdesk Supervisor:  supervisor@primenetworks.pk | Password123!');
  console.log('   Helpdesk CSR Agent:   agent@primenetworks.pk | Password123!');
  console.log('   Field Technician:     field@primenetworks.pk | Password123!');
  console.log('----------------------------------------------------');
}

seed();
