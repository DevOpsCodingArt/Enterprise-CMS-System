const axios = require('../frontend/node_modules/axios');

async function test() {
  // 1. Login as staff admin
  const loginRes = await axios.post('http://localhost:4000/api/v1/auth/login', {
    email: 'admin@primenetworks.pk',
    password: 'password123',
  });
  const token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
  console.log('1. Logged in successfully.');

  // 2. Fetch customers to pick one
  const custRes = await axios.get('http://localhost:4000/api/v1/customers', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const customers = custRes.data?.data?.items || custRes.data?.data || [];
  console.log(`2. Retrieved ${customers.length} customers.`);
  const targetCustomer = customers[0];
  console.log(`   Target Customer: ${targetCustomer.fullName} (${targetCustomer.id})`);

  // 3. Call POST /api/v1/chat/conversations
  const createRes = await axios.post(
    'http://localhost:4000/api/v1/chat/conversations',
    {
      customerId: targetCustomer.id,
      subject: 'NOC Optical Health Check',
      priority: 'high',
      initialMessage: 'Assalam-o-Alaikum! NOC is running an automated optical power check on your port.',
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log('3. POST /chat/conversations result:');
  console.log(JSON.stringify(createRes.data, null, 2));

  // 4. Verify conversation is listed
  const listRes = await axios.get('http://localhost:4000/api/v1/chat/conversations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`4. Total conversations now: ${listRes.data?.data?.length}`);

  // 5. Verify message was created
  const newConvId = createRes.data?.data?.id || createRes.data?.id;
  const msgsRes = await axios.get(`http://localhost:4000/api/v1/chat/conversations/${newConvId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`5. Messages in conversation: ${msgsRes.data?.data?.length}`);
  console.log(`   Latest message: "${msgsRes.data?.data?.[0]?.content}"`);

  // Clean up: delete test conversation so desk stays clean
  const postgres = require('../backend/node_modules/postgres');
  const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');
  await sql`DELETE FROM messages WHERE conversation_id = ${newConvId}`;
  await sql`DELETE FROM conversations WHERE id = ${newConvId}`;
  await sql.end();
  console.log('6. Cleaned up test conversation successfully.');
}

test().catch((err) => {
  console.error('Test Failed:', err.response?.data || err.message);
  process.exit(1);
});
