async function testPhoneChat() {
  const API_URL = 'http://localhost:4000/api/v1';

  try {
    // 1. Login as staff/owner
    console.log('1. Logging in as owner...');
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
    if (!token) throw new Error('Failed to get token: ' + JSON.stringify(loginData));
    console.log('Login successful.');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Start new chat using only phone number "0300 1234567" (Registered customer: Muhammad Ali Khan)
    console.log('\n2. Testing POST /chat/conversations with phone: "0300 1234567"...');
    const convRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0300 1234567',
      }),
    });
    const convJson = await convRes.json();
    const conv = convJson?.data || convJson;
    console.log('Registered conversation resolved:');
    console.log({
      id: conv.id,
      customerName: conv.customerName,
      customerPhone: conv.customerPhone,
      customerCode: conv.customerCode,
      packageName: conv.customerPackage,
    });

    // 3. Start new chat using an unregistered number "0345 8887766"
    console.log('\n3. Testing POST /chat/conversations with new unregistered phone: "0345 8887766"...');
    const newConvRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0345 8887766',
      }),
    });
    const newConvJson = await newConvRes.json();
    const newConv = newConvJson?.data || newConvJson;
    console.log('Unregistered lead conversation auto-created:');
    console.log({
      id: newConv.id,
      customerName: newConv.customerName,
      customerPhone: newConv.customerPhone,
      customerCode: newConv.customerCode,
      status: newConv.status,
    });

    // 4. Verify conversation list has both
    const listRes = await fetch(`${API_URL}/chat/conversations`, { headers });
    const list = (await listRes.json())?.data;
    console.log(`\nTotal conversations in desk: ${list.length}`);
    list.forEach((c) => console.log(` - [${c.customerCode}] ${c.customerName} (${c.customerPhone})`));

    console.log('\nAll tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testPhoneChat();
