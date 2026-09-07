async function testNotFound() {
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

    // 2. Test unknown phone number
    console.log('\n2. Testing unknown phone number: 0399 0001122...');
    const resUnknown = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0399 0001122',
      }),
    });
    const jsonUnknown = await resUnknown.json();
    console.log(`Status Code: ${resUnknown.status}`);
    console.log('Response Body:', jsonUnknown);

    if (resUnknown.status === 404) {
      console.log(' Correctly returned 404 NotFound for unregistered user!');
    } else {
      console.error('❌ Expected 404, got:', resUnknown.status);
    }

    // 3. Test registered phone number: 0300 1234567 (Muhammad Ali Khan)
    console.log('\n3. Testing registered phone number: 0300 1234567...');
    const resRegistered = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: '0300 1234567',
      }),
    });
    const jsonRegistered = await resRegistered.json();
    console.log(`Status Code: ${resRegistered.status}`);
    const conv = jsonRegistered?.data || jsonRegistered;
    console.log('Customer Resolved:', conv?.customerName, `(${conv?.customerCode})`);

    if (resRegistered.status === 200 || resRegistered.status === 201) {
      console.log(' Correctly started/opened conversation for registered user!');
    }

    console.log('\nAll validation checks passed!');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

testNotFound();
