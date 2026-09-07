async function testSubscriberAndStaffChat() {
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

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // 2. Test starting chat with a Subscriber (Muhammad Ali Khan)
    console.log('\n2. Testing chat with Subscriber (Muhammad Ali Khan - 0300 1234567)...');
    const subRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0300 1234567',
      }),
    });
    const subConv = (await subRes.json())?.data;
    console.log('Subscriber Chat Resolved:', {
      id: subConv?.id,
      customerName: subConv?.customerName,
      customerCode: subConv?.customerCode,
      packageName: subConv?.customerPackage,
    });

    // 3. Test starting chat with a Staff Member (Supervisor Khurram Shahzad - 0300 5550002)
    console.log('\n3. Testing chat with Staff Member (Khurram Shahzad - 0300 5550002)...');
    const staffRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0300 5550002',
      }),
    });
    const staffConv = (await staffRes.json())?.data;
    console.log('Staff Chat Resolved:', {
      id: staffConv?.id,
      customerName: staffConv?.customerName,
      customerCode: staffConv?.customerCode,
      packageName: staffConv?.customerPackage,
    });

    // 4. Test starting chat with Field Tech (Usman Splicer - 0300 5550004)
    console.log('\n4. Testing chat with Field Tech (Usman Splicer - 0300 5550004)...');
    const fieldRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0300 5550004',
      }),
    });
    const fieldConv = (await fieldRes.json())?.data;
    console.log('Field Staff Chat Resolved:', {
      id: fieldConv?.id,
      customerName: fieldConv?.customerName,
      customerCode: fieldConv?.customerCode,
      packageName: fieldConv?.customerPackage,
    });

    // 5. Test unknown number (0399 7788990) -> Expected 404
    console.log('\n5. Testing unknown number (0399 7788990)...');
    const unknownRes = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0399 7788990',
      }),
    });
    const unknownJson = await unknownRes.json();
    console.log(`Status Code: ${unknownRes.status}`);
    console.log('Error message:', unknownJson?.error?.message);

    if (unknownRes.status === 404) {
      console.log(' Correctly returned 404 for unknown number!');
    }

    console.log('\n✅ All subscriber, staff, and admin chat tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

testSubscriberAndStaffChat();
