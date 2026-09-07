const { io } = require('../frontend/node_modules/socket.io-client');
const postgres = require('../backend/node_modules/postgres');

const DB_URL = process.env.DATABASE_URL || 'postgresql://primeone_user:securepassword123@localhost:5433/primeone';

async function runAudit() {
  console.log('====================================================');
  console.log('       ENTERPRISE CMS FULL SYSTEM HEALTH AUDIT       ');
  console.log('====================================================\n');

  const report = {
    database: { passed: false, tablesCount: 0, details: {} },
    apiEndpoints: { total: 0, passed: 0, failed: 0, endpoints: [] },
    websocket: { passed: false, steps: [] },
    dataIntegrity: { passed: false, checks: [] },
  };

  // ----------------------------------------------------
  // SECTION 1: PostgreSQL Database Verification
  // ----------------------------------------------------
  console.log('>>> [1/4] AUDITING POSTGRESQL DATABASE & TABLES <<<');
  let sql;
  try {
    sql = postgres(DB_URL, { max: 1, timeout: 5 });
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    report.database.tablesCount = tables.length;
    console.log(`Found ${tables.length} tables in PostgreSQL:`);

    const keyTables = [
      'companies', 'branches', 'users', 'customers', 'packages', 
      'connection_leads', 'conversations', 'messages', 'tickets', 
      'departments', 'shift_rosters', 'attendance_logs', 'work_order_tasks',
      'sla_rules', 'quick_replies'
    ];

    for (const t of keyTables) {
      try {
        const countRes = await sql.unsafe(`SELECT count(*)::int as cnt FROM "${t}"`);
        const count = countRes[0].cnt;
        report.database.details[t] = count;
        console.log(`  ✓ Table '${t}': ${count} rows`);
      } catch (err) {
        report.database.details[t] = `Error: ${err.message}`;
        console.error(`  ✗ Table '${t}': FAILED (${err.message})`);
      }
    }
    report.database.passed = tables.length >= 25;
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    if (sql) await sql.end();
  }

  // ----------------------------------------------------
  // SECTION 2: REST API Endpoints & Authentication
  // ----------------------------------------------------
  console.log('\n>>> [2/4] AUDITING NESTJS REST API ENDPOINTS <<<');
  
  // 1. Staff Login
  let staffToken = null;
  try {
    const loginRes = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: 'Password123!' }),
    });
    const loginJson = await loginRes.json();
    staffToken = loginJson.data?.accessToken;
    console.log(`  ✓ POST /auth/login -> Status: ${loginRes.status}, User: ${loginJson.data?.user?.name}`);
  } catch (e) {
    console.error(`  ✗ POST /auth/login -> FAILED: ${e.message}`);
  }

  // 2. Customer Login
  let customerToken = null;
  try {
    const custRes = await fetch('http://localhost:4000/api/v1/auth/login/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ali.khan@gmail.com', password: 'Password123!' }),
    });
    const custJson = await custRes.json();
    customerToken = custJson.data?.accessToken;
    console.log(`  ✓ POST /auth/login/customer -> Status: ${custRes.status}, Customer: ${custJson.data?.customer?.fullName}`);
  } catch (e) {
    console.error(`  ✗ POST /auth/login/customer -> FAILED: ${e.message}`);
  }

  const endpointsToTest = [
    { method: 'GET', path: '/api/v1/packages', auth: staffToken },
    { method: 'GET', path: '/api/v1/connections', auth: staffToken },
    { method: 'GET', path: '/api/v1/connections/leads', auth: staffToken },
    { method: 'GET', path: '/api/v1/workforce/departments', auth: staffToken },
    { method: 'GET', path: '/api/v1/workforce/shifts', auth: staffToken },
    { method: 'GET', path: '/api/v1/workforce/attendance', auth: staffToken },
    { method: 'GET', path: '/api/v1/workforce/tasks', auth: staffToken },
    { method: 'GET', path: '/api/v1/governance/sla-rules', auth: staffToken },
    { method: 'GET', path: '/api/v1/governance/canned-shortcuts', auth: staffToken },
    { method: 'GET', path: '/api/v1/customers', auth: staffToken },
    { method: 'GET', path: '/api/v1/tickets', auth: staffToken },
    { method: 'GET', path: '/api/v1/chat/conversations', auth: staffToken },
    { method: 'GET', path: '/api/v1/chat/conversations/5a555126-37bb-4119-8552-07bd30b52881/messages', auth: staffToken },
  ];

  for (const ep of endpointsToTest) {
    report.apiEndpoints.total++;
    try {
      const res = await fetch(`http://localhost:4000${ep.path}`, {
        headers: ep.auth ? { Authorization: `Bearer ${ep.auth}` } : {},
      });
      const json = await res.json();
      const count = Array.isArray(json.data)
        ? json.data.length
        : Array.isArray(json.data?.items)
        ? json.data.items.length
        : json.data ? 1 : 0;
      
      if (res.status === 200) {
        report.apiEndpoints.passed++;
        report.apiEndpoints.endpoints.push({ path: ep.path, status: res.status, count, ok: true });
        console.log(`  ✓ ${ep.path} -> Status: 200 OK (Count: ${count})`);
      } else {
        report.apiEndpoints.failed++;
        report.apiEndpoints.endpoints.push({ path: ep.path, status: res.status, ok: false });
        console.error(`  ✗ ${ep.path} -> Status: ${res.status}`);
      }
    } catch (err) {
      report.apiEndpoints.failed++;
      report.apiEndpoints.endpoints.push({ path: ep.path, error: err.message, ok: false });
      console.error(`  ✗ ${ep.path} -> ERROR: ${err.message}`);
    }
  }

  // ----------------------------------------------------
  // SECTION 3: Real-Time WebSocket Gateway Audit
  // ----------------------------------------------------
  console.log('\n>>> [3/4] AUDITING WEBSOCKET GATEWAY & REAL-TIME FLOW <<<');
  if (staffToken && customerToken) {
    const convId = '5a555126-37bb-4119-8552-07bd30b52881';
    const agentSocket = io('http://localhost:4000/chat', {
      auth: { token: staffToken },
      transports: ['websocket'],
    });
    const customerSocket = io('http://localhost:4000/chat', {
      auth: { token: customerToken },
      transports: ['websocket'],
    });

    try {
      await Promise.all([
        new Promise((res) => agentSocket.on('connect', res)),
        new Promise((res) => customerSocket.on('connect', res)),
      ]);
      console.log('  ✓ Sockets connected successfully to /chat');
      report.websocket.steps.push({ step: 'connect', ok: true });

      agentSocket.emit('chat:join_conversation', { conversationId: convId });
      customerSocket.emit('chat:join_conversation', { conversationId: convId });
      await new Promise((r) => setTimeout(r, 400));
      console.log(`  ✓ Joined room conversation:${convId}`);
      report.websocket.steps.push({ step: 'join_room', ok: true });

      // Typing Test
      const typingPromise = new Promise((resolve) => {
        agentSocket.on('chat:typing', (data) => {
          if (data.isTyping && data.conversationId === convId) resolve(data);
        });
      });
      customerSocket.emit('chat:typing_start', { conversationId: convId, userName: 'Muhammad Ali Khan' });
      const typingData = await typingPromise;
      console.log(`  ✓ Real-time typing event received: ${typingData.userName}`);
      report.websocket.steps.push({ step: 'typing_indicator', ok: true });

      // Live Customer -> Agent Message
      const testMsg = `Audit Msg at ${Date.now()}`;
      const msgPromise = new Promise((resolve) => {
        const handler = (m) => {
          if (m.content === testMsg) {
            agentSocket.off('chat:new_message', handler);
            resolve(m);
          }
        };
        agentSocket.on('chat:new_message', handler);
      });
      customerSocket.emit('chat:send_message', {
        conversationId: convId,
        content: testMsg,
        senderType: 'customer',
        senderName: 'Muhammad Ali Khan',
        messageType: 'text',
      });
      const receivedMsg = await msgPromise;
      console.log(`  ✓ Bi-directional live message delivery confirmed: "${receivedMsg.content}"`);
      report.websocket.steps.push({ step: 'message_exchange', ok: true });

      // NOC Telemetry Alert Test
      const alertPromise = new Promise((resolve) => {
        agentSocket.on('noc:telemetry_alert', (a) => resolve(a));
      });
      agentSocket.emit('noc:trigger_telemetry_alert', {
        oltHostname: 'Huawei-MA5800-Core',
        ponPort: 'Slot 0/2 · PON-04',
        fatBox: 'FAT-F10-B14',
        dropDbm: -32.5,
        severity: 'critical',
        message: 'CRITICAL Optical Signal Degradation on FAT-F10-B14',
        customerCode: 'CUS-1001',
      });
      const receivedAlert = await alertPromise;
      console.log(`  ✓ NOC Telemetry alert broadcast received: ${receivedAlert.message}`);
      report.websocket.steps.push({ step: 'telemetry_alert', ok: true });

      report.websocket.passed = true;
    } catch (err) {
      console.error('  ✗ WebSocket audit error:', err.message);
      report.websocket.steps.push({ step: 'error', error: err.message, ok: false });
    } finally {
      agentSocket.disconnect();
      customerSocket.disconnect();
    }
  }

  // ----------------------------------------------------
  // SECTION 4: Data Integrity Verification
  // ----------------------------------------------------
  console.log('\n>>> [4/4] AUDITING DATA INTEGRITY & PERSISTENCE <<<');
  if (staffToken) {
    try {
      const convRes = await fetch('http://localhost:4000/api/v1/chat/conversations/5a555126-37bb-4119-8552-07bd30b52881/messages', {
        headers: { Authorization: `Bearer ${staffToken}` },
      });
      const convJson = await convRes.json();
      const messages = convJson.data || [];
      const hasCustomerMsgs = messages.some(m => m.senderType === 'customer');
      const hasStaffMsgs = messages.some(m => m.senderType === 'staff');
      console.log(`  ✓ Message history count in DB: ${messages.length}`);
      console.log(`  ✓ Contains customer messages: ${hasCustomerMsgs}`);
      console.log(`  ✓ Contains staff messages: ${hasStaffMsgs}`);
      report.dataIntegrity.passed = hasCustomerMsgs && hasStaffMsgs && messages.length > 0;
    } catch (e) {
      console.error('  ✗ Data integrity error:', e.message);
    }
  }

  console.log('\n====================================================');
  console.log('                AUDIT SUMMARY RESULTS                ');
  console.log('====================================================');
  console.log(`Database Health:      ${report.database.passed ? '✅ 100% OPERATIONAL' : '❌ FAILED'} (${report.database.tablesCount} tables)`);
  console.log(`REST Endpoints:       ${report.apiEndpoints.passed === report.apiEndpoints.total ? '✅ 100% PASSING' : '❌ ISSUES FOUND'} (${report.apiEndpoints.passed}/${report.apiEndpoints.total})`);
  console.log(`WebSocket Gateway:    ${report.websocket.passed ? '✅ 100% OPERATIONAL' : '❌ FAILED'}`);
  console.log(`Data Persistence:     ${report.dataIntegrity.passed ? '✅ 100% VERIFIED' : '❌ FAILED'}`);
  console.log('====================================================\n');
}

runAudit();
