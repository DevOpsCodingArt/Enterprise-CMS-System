const { io } = require('../frontend/node_modules/socket.io-client');

async function testSocket() {
  const API_URL = 'http://localhost:4000/api/v1';

  // 1. Login to get valid JWT token
  console.log('1. Logging in as admin@primenetworks.pk...');
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@primenetworks.pk',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData?.data?.accessToken || loginData?.accessToken;
  console.log('Got token:', token ? token.slice(0, 20) + '...' : 'NONE');

  // 2. Connect to Socket.IO /chat namespace
  console.log('\n2. Connecting to ws://localhost:4000/chat...');
  const socket = io('http://localhost:4000/chat', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log(' Socket connected successfully! Socket ID:', socket.id);

    // Test sending message
    console.log('\n3. Testing chat:send_message via socket...');
    socket.emit(
      'chat:send_message',
      {
        conversationId: 'non-existent-test-id',
        content: 'Hello via socket test',
        messageType: 'text',
      },
      (res) => {
        console.log('Ack response:', res);
        socket.disconnect();
        process.exit(0);
      }
    );

    setTimeout(() => {
      console.log('Finished waiting. Disconnecting...');
      socket.disconnect();
      process.exit(0);
    }, 2000);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
    process.exit(1);
  });
}

testSocket().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
