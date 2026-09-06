/**
 * Automated Zero-Trust Security Verification: Next.js Edge Token Forgery & Cryptographic HMAC Verification
 * 
 * Verifies that:
 * 1. An attacker cannot access /company/desk with a fake JWT signature (.fake_sig) -> 307 Redirect to / + cookie purged
 * 2. An attacker cannot access /platform with a tampered role payload (elevating from staff to super_admin) -> 307 Redirect to /
 * 3. An expired token is rejected at the Edge -> 307 Redirect to /
 * 4. Legitimate credentials authenticate properly and gain access -> 200 OK
 * 5. Next.js responses include enterprise HTTP security headers (X-Frame-Options, X-Content-Type-Options, CSP, HSTS)
 * 6. Fastify API responses include enterprise HTTP security headers
 */

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:4000/api/v1';

async function runEdgeSecurityVerification() {
  console.log('\n============================================================');
  console.log('🛡️  PRIME ONE ENTERPRISE ZERO-TRUST EDGE VERIFICATION SUITE');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
    }
  }

  // TEST 1: Unauthenticated request to /company/desk
  try {
    const res = await fetch(`${FRONTEND_URL}/company/desk`, { redirect: 'manual' });
    const loc = res.headers.get('location');
    assert(
      res.status === 307 && loc && loc.includes('redirect'),
      'Test 1: Unauthenticated request to /company/desk redirected to /',
      `Status: ${res.status}, Location: ${loc}`
    );
  } catch (err) {
    assert(false, 'Test 1: Unauthenticated request', err.message);
  }

  // TEST 2: Forged HMAC signature attack on /company/desk
  try {
    const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYiLCJyb2xlIjoiY29tcGFueV9vd25lciIsImV4cCI6MTk5OTk5OTk5OX0.completely_fabricated_signature';
    const res = await fetch(`${FRONTEND_URL}/company/desk`, {
      headers: { Cookie: `prime_access_token=${fakeToken}` },
      redirect: 'manual'
    });
    const loc = res.headers.get('location');
    const setCookie = res.headers.get('set-cookie') || '';
    assert(
      res.status === 307 && loc && loc.includes('redirect') && setCookie.includes('prime_access_token=;'),
      'Test 2: Forged HMAC signature rejected at Edge, cookie purged, redirected to /',
      `Status: ${res.status}, Location: ${loc}, Set-Cookie: ${setCookie}`
    );
  } catch (err) {
    assert(false, 'Test 2: Forged HMAC signature attack', err.message);
  }

  // TEST 3: Tampered role elevation attack on /platform (Privilege Escalation)
  try {
    // 3a. Obtain genuine staff token from backend
    const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const genuineToken = loginData?.data?.accessToken;

    if (!genuineToken) {
      assert(false, 'Test 3: Obtain genuine token for tampering', 'Failed to get valid token');
    } else {
      // 3b. Tamper payload to escalate role to super_admin while preserving original signature
      const [h, p, s] = genuineToken.split('.');
      const payload = JSON.parse(atob(p));
      payload.role = 'super_admin';
      payload.userType = 'platform_owner';
      const tamperedP = btoa(JSON.stringify(payload)).replace(/=/g, '');
      const tamperedToken = `${h}.${tamperedP}.${s}`;

      const res = await fetch(`${FRONTEND_URL}/platform`, {
        headers: { Cookie: `prime_access_token=${tamperedToken}` },
        redirect: 'manual'
      });
      const loc = res.headers.get('location');
      assert(
        res.status === 307 && loc && loc.includes('redirect'),
        'Test 3: Tampered payload with privilege escalation blocked at Edge',
        `Status: ${res.status}, Location: ${loc}`
      );
    }
  } catch (err) {
    assert(false, 'Test 3: Tampered payload attack', err.message);
  }

  // TEST 4: Expired token rejection
  try {
    const expiredPayload = btoa(JSON.stringify({
      sub: 'expired-user',
      role: 'company_owner',
      exp: Math.floor(Date.now() / 1000) - 3600
    })).replace(/=/g, '');
    const expiredToken = `eyJhbGciOiJIUzI1NiJ9.${expiredPayload}.signature`;

    const res = await fetch(`${FRONTEND_URL}/company/desk`, {
      headers: { Cookie: `prime_access_token=${expiredToken}` },
      redirect: 'manual'
    });
    assert(
      res.status === 307,
      'Test 4: Expired token rejected at Edge with redirect',
      `Status: ${res.status}`
    );
  } catch (err) {
    assert(false, 'Test 4: Expired token rejection', err.message);
  }

  // TEST 5: Legitimate login & authorized access
  try {
    const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: 'Password123!' })
    });
    const loginData = await loginRes.json();
    const validToken = loginData?.data?.accessToken;

    const res = await fetch(`${FRONTEND_URL}/company/desk`, {
      headers: { Cookie: `prime_access_token=${validToken}` },
      redirect: 'manual'
    });
    assert(
      res.status === 200,
      'Test 5: Valid backend-authenticated session allowed access to /company/desk',
      `Status: ${res.status}`
    );
  } catch (err) {
    assert(false, 'Test 5: Legitimate authentication access', err.message);
  }

  // TEST 6: Enterprise Security Headers on Next.js responses
  try {
    const res = await fetch(`${FRONTEND_URL}/`);
    const xFrame = res.headers.get('x-frame-options');
    const xContent = res.headers.get('x-content-type-options');
    const csp = res.headers.get('content-security-policy');
    const hsts = res.headers.get('strict-transport-security');

    assert(
      xFrame === 'DENY' && xContent === 'nosniff' && !!csp && !!hsts,
      'Test 6: Next.js delivers X-Frame-Options (DENY), X-Content-Type-Options (nosniff), CSP, and HSTS',
      `X-Frame: ${xFrame}, X-Content: ${xContent}, CSP: ${!!csp}, HSTS: ${!!hsts}`
    );
  } catch (err) {
    assert(false, 'Test 6: Next.js Security Headers', err.message);
  }

  // TEST 7: Enterprise Security Headers on NestJS Fastify API responses
  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`);
    const xFrame = res.headers.get('x-frame-options');
    const xContent = res.headers.get('x-content-type-options');
    const hsts = res.headers.get('strict-transport-security');

    assert(
      xFrame === 'DENY' && xContent === 'nosniff' && !!hsts,
      'Test 7: Fastify API delivers X-Frame-Options (DENY), X-Content-Type-Options (nosniff), and HSTS',
      `X-Frame: ${xFrame}, X-Content: ${xContent}, HSTS: ${!!hsts}`
    );
  } catch (err) {
    assert(false, 'Test 7: Fastify Security Headers', err.message);
  }

  console.log('\n------------------------------------------------------------');
  console.log(`📊 RESULTS: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('------------------------------------------------------------\n');

  if (passedTests === totalTests) {
    console.log('🔒 ALL ZERO-TRUST SECURITY CHECKS VERIFIED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME SECURITY CHECKS FAILED!\n');
    process.exit(1);
  }
}

runEdgeSecurityVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
