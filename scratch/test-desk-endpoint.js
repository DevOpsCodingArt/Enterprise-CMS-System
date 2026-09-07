const axios = require('../frontend/node_modules/axios');

async function testDeskEndpoint() {
  // 1. Login as company owner / support lead
  const loginRes = await axios.post('http://localhost:4000/api/v1/auth/login', {
    email: 'admin@primenetworks.pk',
    password: 'password123'
  });

  const token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
  console.log('Logged in successfully, token received.');

  // 2. Fetch conversations
  const convsRes = await axios.get('http://localhost:4000/api/v1/chat/conversations', {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('CONVERSATIONS LOADED FROM /api/v1/chat/conversations:');
  console.log(JSON.stringify(convsRes.data, null, 2));

  // 3. Fetch canned shortcuts
  const cannedRes = await axios.get('http://localhost:4000/api/v1/governance/canned-shortcuts', {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log('\nCANNED SHORTCUTS COUNT:', cannedRes.data?.data?.length || cannedRes.data?.length);

  // 4. Fetch all conversation messages
  for (const c of convsRes.data?.data || []) {
    const msgsRes = await axios.get(`http://localhost:4000/api/v1/chat/conversations/${c.id}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`\nMessages for ${c.customerName} (${c.subject}): Count = ${msgsRes.data?.data?.length}`);
    msgsRes.data?.data?.forEach((m) => {
      console.log(`  [${m.senderType}] ${m.senderName}: "${m.content.slice(0, 55)}..."`);
    });
  }
}

testDeskEndpoint().catch(err => {
  console.error('Error:', err.response?.data || err.message);
  process.exit(1);
});
