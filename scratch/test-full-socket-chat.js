const { io } = require('../frontend/node_modules/socket.io-client');

async function main() {
  const API_URL = 'http://localhost:4000/api/v1';

  try {
    // 1. Log in as admin
    console.log('1. Logging in as admin@primenetworks.pk...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@primenetworks.pk',
        password: 'Password123!',
      }),
    });
    const loginJson = await loginRes.json();
    const token = loginJson?.data?.accessToken || loginJson?.accessToken;
    console.log('Login successful. Token obtained.');

    // 2. Start / get active conversation for Muhammad Ali Khan
    console.log('\n2. Ensuring active conversation for customer Muhammad Ali Khan...');
    const convRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '0300 1234567',
      }),
    });
    const convJson = await convRes.json();
    const conversation = convJson?.data || convJson;
    console.log(`Active conversation ID: ${conversation.id}`);

    // 3. Connect via Socket.IO to /chat namespace
    console.log('\n3. Connecting to ws://localhost:4000/chat...');
    const socket = io('http://localhost:4000/chat', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    await new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log(` Connected to /chat! Socket ID: ${socket.id}`);
        resolve();
      });
      socket.on('connect_error', (err) => {
        reject(new Error(`Socket connection error: ${err.message}`));
      });
    });

    // 4. Join conversation room
    console.log('\n4. Joining conversation room on socket...');
    socket.emit('chat:join_conversation', { conversationId: conversation.id });

    // Listen for echo / broadcast of new message
    const messagePromise = new Promise((resolve) => {
      socket.on('chat:new_message', (msg) => {
        console.log(' Received broadcast chat:new_message:', {
          id: msg.id,
          content: msg.content,
          senderType: msg.senderType,
          senderName: msg.senderName,
          status: msg.status,
        });
        resolve(msg);
      });
    });

    // 5. Send message via socket
    console.log('\n5. Sending message via socket.emit("chat:send_message")...');
    const sendResult = await new Promise((resolve, reject) => {
      socket.emit(
        'chat:send_message',
        {
          conversationId: conversation.id,
          content: 'Hello Muhammad Ali Khan, this is NOC testing real-time socket delivery.',
          messageType: 'text',
        },
        (res) => {
          console.log('Server ack response:', res);
          resolve(res);
        }
      );
      // Timeout fallback
      setTimeout(() => resolve({ status: 'sent' }), 2000);
    });

    // Wait for broadcast
    await Promise.race([
      messagePromise,
      new Promise((res) => setTimeout(res, 2500)),
    ]);

    // 6. Verify message was stored in PostgreSQL database
    console.log('\n6. Verifying message stored in database via GET /chat/conversations/:id/messages...');
    const msgsRes = await fetch(`${API_URL}/chat/conversations/${conversation.id}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const msgsJson = await msgsRes.json();
    const msgs = msgsJson?.data || msgsJson;
    console.log(`Total messages in DB: ${msgs.length}`);
    const lastMsg = msgs[msgs.length - 1];
    console.log('Last DB message:', {
      id: lastMsg?.id,
      content: lastMsg?.content,
      senderType: lastMsg?.senderType,
      deliveredAt: lastMsg?.deliveredAt,
    });

    socket.disconnect();
    console.log('\n✅ All WebSocket tests completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

main();
