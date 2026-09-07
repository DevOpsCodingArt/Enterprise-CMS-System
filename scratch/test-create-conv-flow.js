const axios = require('../frontend/node_modules/axios');

async function testFlow() {
  const API_URL = 'http://localhost:4000/api/v1';

  // 1. Log in
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@primenetworks.pk',
      password: 'Password123!',
    }),
  });
  const token = (await loginRes.json())?.data?.accessToken;

  // 2. Simulate apiClient with validateStatus
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  async function createConversation(payload) {
    const res = await client.post('/chat/conversations', payload, {
      validateStatus: (status) => status < 500,
    });
    if (res.status >= 400 || res.data?.success === false) {
      const errorMsg =
        res.data?.error?.message ||
        res.data?.message ||
        'No registered subscriber found with this mobile number.';
      return { error: errorMsg, notFound: res.status === 404 };
    }
    return res.data?.data || res.data;
  }

  // Test with unregistered number
  console.log('Testing unregistered number 0345 9991122:');
  const resUnregistered = await createConversation({ phone: '0345 9991122' });
  console.log('Result for unregistered:', resUnregistered);
  console.log('Has error:', Boolean(resUnregistered?.error));
  console.log('Is notFound:', resUnregistered?.notFound === true);

  // Test with registered number
  console.log('\nTesting registered number 0300 1234567:');
  const resRegistered = await createConversation({ phone: '0300 1234567' });
  console.log('Result for registered:', {
    id: resRegistered?.id,
    customerName: resRegistered?.customerName,
    customerCode: resRegistered?.customerCode,
  });

  console.log('\nAll checks succeeded!');
}

testFlow().catch(console.error);
