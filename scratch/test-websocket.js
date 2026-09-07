const { io } = require('../frontend/node_modules/socket.io-client');
const http = require('http');

async function login(path, identifier, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ identifier, password });
    const req = http.request(
      {
        hostname: 'localhost',
        port: 4000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed.data?.accessToken || parsed.accessToken);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTest() {
  console.log('--- Step 1: Logging in Agent & Customer ---');
  const agentToken = await login('/api/v1/auth/login', 'admin@primenetworks.pk', 'Password123!');
  const customerToken = await login('/api/v1/auth/login/customer', 'ali.khan@gmail.com', 'Password123!');

  console.log('Agent Token received:', Boolean(agentToken));
  console.log('Customer Token received:', Boolean(customerToken));

  const convId = '5a555126-37bb-4119-8552-07bd30b52881';

  console.log('--- Step 2: Connecting Sockets to /chat namespace ---');
  const agentSocket = io('http://localhost:4000/chat', {
    auth: { token: agentToken },
    transports: ['websocket'],
  });

  const customerSocket = io('http://localhost:4000/chat', {
    auth: { token: customerToken },
    transports: ['websocket'],
  });

  await Promise.all([
    new Promise((resolve) => agentSocket.on('connect', resolve)),
    new Promise((resolve) => customerSocket.on('connect', resolve)),
  ]);

  console.log('Agent socket connected:', agentSocket.id);
  console.log('Customer socket connected:', customerSocket.id);

  console.log('--- Step 3: Joining Conversation Room ---');
  agentSocket.emit('chat:join_conversation', { conversationId: convId });
  customerSocket.emit('chat:join_conversation', { conversationId: convId });

  await new Promise((r) => setTimeout(r, 500));

  console.log('--- Step 4: Testing Real-time Typing Event ---');
  const typingPromise = new Promise((resolve) => {
    agentSocket.on('chat:typing', (data) => {
      console.log('Agent received typing indicator:', data);
      if (data.isTyping && data.conversationId === convId) {
        resolve(data);
      }
    });
  });

  customerSocket.emit('chat:typing_start', {
    conversationId: convId,
    userName: 'Muhammad Ali Khan',
  });

  const typingResult = await typingPromise;
  console.log('Typing test PASSED:', typingResult.userName);

  console.log('--- Step 5: Testing Customer -> Agent Live Message ---');
  const customerTestText = `Live Customer Ping at ${Date.now()}`;
  const agentMsgPromise = new Promise((resolve) => {
    const handler = (msg) => {
      console.log('Agent received message from socket:', msg.content);
      if (msg.content === customerTestText) {
        agentSocket.off('chat:new_message', handler);
        resolve(msg);
      }
    };
    agentSocket.on('chat:new_message', handler);
  });

  customerSocket.emit('chat:send_message', {
    conversationId: convId,
    content: customerTestText,
    senderType: 'customer',
    senderName: 'Muhammad Ali Khan',
    messageType: 'text',
  });

  const agentReceivedMsg = await agentMsgPromise;
  console.log('Customer -> Agent delivery PASSED');

  console.log('--- Step 6: Testing Agent -> Customer Live Message ---');
  const agentTestText = `NOC Dispatcher Response at ${Date.now()}`;
  const customerMsgPromise = new Promise((resolve) => {
    const handler = (msg) => {
      console.log('Customer received message from socket:', msg.content);
      if (msg.content === agentTestText) {
        customerSocket.off('chat:new_message', handler);
        resolve(msg);
      }
    };
    customerSocket.on('chat:new_message', handler);
  });

  agentSocket.emit('chat:send_message', {
    conversationId: convId,
    content: agentTestText,
    senderType: 'staff',
    senderName: 'Tariq Mehmood (Company Owner)',
    messageType: 'text',
  });

  const customerReceivedMsg = await customerMsgPromise;
  console.log('Agent -> Customer delivery PASSED');

  console.log('--- Step 7: Testing NOC Telemetry Alert Broadcasting ---');
  const alertPromise = new Promise((resolve) => {
    agentSocket.on('noc:telemetry_alert', (alert) => {
      console.log('Received NOC Telemetry Alert:', alert.message);
      resolve(alert);
    });
  });

  agentSocket.emit('noc:trigger_telemetry_alert', {
    oltHostname: 'Huawei-MA5800-Core',
    ponPort: 'Slot 0/2 · PON-04',
    fatBox: 'FAT-F10-B14',
    dropDbm: -31.8,
    severity: 'critical',
    message: 'CRITICAL Optical Signal Degradation: Power -31.8 dBm on Port PON-04',
    customerCode: 'CUS-1001',
  });

  const alertResult = await alertPromise;
  console.log('NOC Telemetry broadcast PASSED:', alertResult.severity);

  agentSocket.disconnect();
  customerSocket.disconnect();

  console.log('All WebSocket Tests PASSED with 100% Success!');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('Test FAILED:', err);
  process.exit(1);
});
