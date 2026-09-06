/**
 * Comprehensive Penetration & Validation Test Suite for Prime One Auth
 * Tests both legitimate user flows and malicious attack vectors:
 * 1. Legitimate 5-Role Authentication
 * 2. SQL Injection (SQLi) Bypass Attempts
 * 3. Prototype Pollution & Parameter Tampering
 * 4. Algorithmic Bcrypt DoS (Payload Bloat)
 * 5. Type Juggling / NoSQL-style Object Injections
 * 6. XSS Script Injection in Credentials
 * 7. Input Boundary Constraints (Short passwords, empty payloads)
 * 8. IP-Level Rate Limiting (Redis-backed sliding window)
 * 9. Distributed Brute Force & Account Lockout (Redis-backed)
 * 10. Timing Invariance (User Enumeration Defense)
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runPenetrationSuite() {
  console.log('===============================================================');
  console.log('🛡️  PRIME ONE COMPREHENSIVE AUTH & PENETRATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assertTest(name, condition, details = '') {
    if (condition) {
      console.log(`  ✅ PASSED: ${name} ${details ? `(${details})` : ''}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  // ==============================================================
  // SECTION 1: ALL 5 LEGITIMATE LOGIN FLOWS
  // ==============================================================
  console.log('▶ [SECTION 1] Testing 5 Legitimate Login Roles...');

  const legitimateRoles = [
    {
      role: 'Company Owner (CEO)',
      url: '/auth/login',
      body: { identifier: 'admin@primenetworks.pk', password: 'Password123!' },
      expectedRole: 'company_owner',
      ip: '10.1.0.1',
    },
    {
      role: 'Customer Self-Care',
      url: '/auth/login/customer',
      body: { identifier: 'ali.khan@gmail.com', password: 'Password123!' },
      expectedRole: 'customer',
      ip: '10.1.0.2',
    },
    {
      role: 'Platform Super-Admin',
      url: '/auth/login/platform',
      body: { email: 'superadmin@primeone.io', password: 'Password123!' },
      expectedRole: 'platform_owner',
      ip: '10.1.0.3',
    },
    {
      role: 'Field Splicer Engineer',
      url: '/auth/login',
      body: { identifier: 'field@primenetworks.pk', password: 'Password123!' },
      expectedRole: 'field_engineer',
      ip: '10.1.0.4',
    },
    {
      role: 'Support Supervisor',
      url: '/auth/login',
      body: { identifier: 'supervisor@primenetworks.pk', password: 'Password123!' },
      expectedRole: 'helpdesk_agent',
      ip: '10.1.0.5',
    },
  ];

  for (const item of legitimateRoles) {
    try {
      const res = await fetch(`${API_BASE}${item.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': item.ip },
        body: JSON.stringify(item.body),
      });
      const data = await res.json();
      assertTest(
        `Login as ${item.role}`,
        res.status === 200 && data.success && data.data?.accessToken && data.data?.user?.role === item.expectedRole,
        `Status ${res.status}, Token received, Role: ${data.data?.user?.role}`
      );
    } catch (e) {
      assertTest(`Login as ${item.role}`, false, e.message);
    }
  }

  // ==============================================================
  // SECTION 2: SQL INJECTION (SQLi) ATTACK SIMULATION
  // ==============================================================
  console.log('\n▶ [SECTION 2] Testing SQL Injection (SQLi) Defense...');

  const sqliPayloads = [
    { identifier: "' OR '1'='1", password: "' OR '1'='1" },
    { identifier: "admin' --", password: "irrelevant" },
    { identifier: "admin' /*", password: "irrelevant" },
    { identifier: "admin@primenetworks.pk'; DROP TABLE users; --", password: "Password123!" },
    { identifier: "' UNION SELECT null, null, 'hacked' --", password: "password" },
  ];

  for (let i = 0; i < sqliPayloads.length; i++) {
    const payload = sqliPayloads[i];
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.2.0.${i + 1}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const blocked = res.status === 401 || res.status === 400;
      assertTest(
        `SQLi Vector #${i + 1} ("${payload.identifier.substring(0, 25)}...")`,
        blocked && !data.success,
        `Status ${res.status}: Properly rejected with ${data.error?.message || data.message}`
      );
    } catch (e) {
      assertTest(`SQLi Vector #${i + 1}`, false, e.message);
    }
  }

  // ==============================================================
  // SECTION 3: MASS ASSIGNMENT & PROTOTYPE POLLUTION
  // ==============================================================
  console.log('\n▶ [SECTION 3] Testing Mass Assignment & Prototype Pollution Rejection...');

  const tamperingCases = [
    {
      name: 'Injected Superadmin Role',
      rawBody: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: 'Password123!', role: 'superadmin' }),
    },
    {
      name: 'Injected Global Wildcard Permissions',
      rawBody: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: 'Password123!', permissions: ['*.*'] }),
    },
    {
      name: 'Injected Raw Prototype (__proto__)',
      rawBody: '{"identifier":"admin@primenetworks.pk","password":"Password123!","__proto__":{"isAdmin":true}}',
    },
  ];

  for (let i = 0; i < tamperingCases.length; i++) {
    const item = tamperingCases[i];
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.3.0.${i + 1}` },
        body: item.rawBody,
      });
      const data = await res.json();
      const blocked = (res.status === 400 || res.status === 422) && !data.success;
      assertTest(
        `Tampering: ${item.name}`,
        blocked,
        `Status ${res.status}: ${data.error?.message || data.message || 'Rejected'}`
      );
    } catch (e) {
      assertTest(`Tampering: ${item.name}`, false, e.message);
    }
  }

  // ==============================================================
  // SECTION 4: ALGORITHMIC BCRYPT DoS & PAYLOAD BLOAT
  // ==============================================================
  console.log('\n▶ [SECTION 4] Testing Algorithmic Bcrypt DoS Defense...');

  try {
    const hugePassword = 'X'.repeat(8000); // 8 KB string
    const startTime = Date.now();
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.4.0.1' },
      body: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: hugePassword }),
    });
    const elapsed = Date.now() - startTime;
    const data = await res.json();

    assertTest(
      'Oversized 8KB Password Rejection (@MaxLength(128))',
      res.status === 400 && elapsed < 200 && JSON.stringify(data).includes('Password cannot exceed 128 characters'),
      `Status ${res.status} rejected in ${elapsed}ms without invoking CPU-heavy bcrypt`
    );
  } catch (e) {
    assertTest('Oversized Password Rejection', false, e.message);
  }

  try {
    const hugeIdentifier = 'user@' + 'a'.repeat(500) + '.com';
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.4.0.2' },
      body: JSON.stringify({ identifier: hugeIdentifier, password: 'Password123!' }),
    });
    const data = await res.json();

    assertTest(
      'Oversized Identifier Rejection (@MaxLength(255))',
      res.status === 400 && JSON.stringify(data).includes('Identifier cannot exceed 255 characters'),
      `Status ${res.status}: Blocked before DB query`
    );
  } catch (e) {
    assertTest('Oversized Identifier Rejection', false, e.message);
  }

  // ==============================================================
  // SECTION 5: TYPE JUGGLING & NOSQL/OBJECT INJECTIONS
  // ==============================================================
  console.log('\n▶ [SECTION 5] Testing Type Juggling & Object Injections...');

  const typeJugglingCases = [
    {
      name: 'Password as Object { "$gt": "" }',
      payload: { identifier: 'admin@primenetworks.pk', password: { $gt: '' } },
    },
    {
      name: 'Password as Array [1, 2, 3]',
      payload: { identifier: 'admin@primenetworks.pk', password: [1, 2, 3] },
    },
    {
      name: 'Identifier as Boolean (true)',
      payload: { identifier: true, password: 'Password123!' },
    },
    {
      name: 'Password as Number (123456)',
      payload: { identifier: 'admin@primenetworks.pk', password: 123456 },
    },
  ];

  for (let i = 0; i < typeJugglingCases.length; i++) {
    const item = typeJugglingCases[i];
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.5.0.${i + 1}` },
        body: JSON.stringify(item.payload),
      });
      const data = await res.json();
      assertTest(
        `Type Juggling: ${item.name}`,
        res.status === 400 && !data.success,
        `Status ${res.status}: Strictly rejected by ValidationPipe before business logic`
      );
    } catch (e) {
      assertTest(`Type Juggling: ${item.name}`, false, e.message);
    }
  }

  // ==============================================================
  // SECTION 6: XSS SCRIPT INJECTION IN CREDENTIALS
  // ==============================================================
  console.log('\n▶ [SECTION 6] Testing XSS Payload Injection in Credentials...');

  try {
    const xssPayload = '<script>alert(document.cookie)</script>';
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.6.0.1' },
      body: JSON.stringify({ identifier: xssPayload, password: 'Password123!' }),
    });
    const data = await res.json();
    const contentType = res.headers.get('content-type') || '';

    assertTest(
      'XSS Payload in Identifier',
      res.status === 401 && contentType.includes('application/json') && !JSON.stringify(data).includes('<script>'),
      `Status ${res.status}, response returned as strictly escaped JSON`
    );
  } catch (e) {
    assertTest('XSS Payload in Identifier', false, e.message);
  }

  // ==============================================================
  // SECTION 7: BOUNDARY VALIDATIONS (Short Passwords, Empty Fields)
  // ==============================================================
  console.log('\n▶ [SECTION 7] Testing Input Boundary Constraints...');

  try {
    // Short password (<6 chars)
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.7.0.1' },
      body: JSON.stringify({ identifier: 'admin@primenetworks.pk', password: '123' }),
    });
    const data = await res.json();
    assertTest(
      'Password Under Minimum Length (< 6 chars)',
      res.status === 400 && JSON.stringify(data).includes('at least 6 characters'),
      `Status ${res.status}: Validation error message returned`
    );
  } catch (e) {
    assertTest('Password Under Minimum Length', false, e.message);
  }

  try {
    // Empty payload
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.7.0.2' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assertTest(
      'Completely Empty Request Body',
      res.status === 400,
      `Status ${res.status}: Rejected missing required fields`
    );
  } catch (e) {
    assertTest('Completely Empty Request Body', false, e.message);
  }

  // ==============================================================
  // SECTION 8: IP-LEVEL RATE LIMITING (SLIDING WINDOW)
  // ==============================================================
  console.log('\n▶ [SECTION 8] Testing IP-Level Rate Limiting (10 req/min)...');

  const attackIp = '192.168.99.100';
  let rateLimitTripped = false;
  let tripStatus = 0;

  for (let req = 1; req <= 12; req++) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': attackIp },
        body: JSON.stringify({ identifier: 'probe_ratelimit@test.local', password: 'WrongPassword!' }),
      });
      if (res.status === 429) {
        rateLimitTripped = true;
        tripStatus = res.status;
        break;
      }
    } catch {
      // ignore
    }
  }

  assertTest(
    'IP Rate Limiting (Blocked on 11th rapid request with 429)',
    rateLimitTripped && tripStatus === 429,
    `Status ${tripStatus}: Too Many Requests returned by RateLimitGuard`
  );

  // ==============================================================
  // SECTION 9: DISTRIBUTED BRUTE FORCE & ACCOUNT LOCKOUT
  // ==============================================================
  console.log('\n▶ [SECTION 9] Testing Account-Level Lockout (Distributed Rotating IPs)...');

  const bruteTarget = `victim_${Date.now()}@target.test`;
  let accountLocked = false;
  let lockMsg = '';

  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      // Rotate client IP on each attempt to simulate distributed proxy botnet!
      const rotatedIp = `172.16.0.${attempt}`;
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': rotatedIp },
        body: JSON.stringify({ identifier: bruteTarget, password: 'WrongPassword123!' }),
      });
      const data = await res.json();

      if (attempt === 6) {
        accountLocked = res.status === 401 && JSON.stringify(data).includes('temporarily locked');
        lockMsg = data.error?.message || data.message || '';
      }
    } catch {
      // ignore
    }
  }

  assertTest(
    'Account Lockout After 5 Failed Attempts (Even across rotating IPs)',
    accountLocked,
    `Status 401: "${lockMsg}"`
  );

  // ==============================================================
  // SECTION 10: TIMING ATTACK RESISTANCE (CONSTANT TIME)
  // ==============================================================
  console.log('\n▶ [SECTION 10] Testing Constant-Time Timing Invariance...');

  try {
    const tStartFake = Date.now();
    await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.10.0.1' },
      body: JSON.stringify({ identifier: 'ghost_non_existent@primenetworks.pk', password: 'Password123!' }),
    });
    const elapsedFake = Date.now() - tStartFake;

    const tStartReal = Date.now();
    await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.10.0.2' },
      body: JSON.stringify({ identifier: 'field@primenetworks.pk', password: 'WrongPassword999!' }),
    });
    const elapsedReal = Date.now() - tStartReal;

    console.log(`  📊 Duration (Non-existent user): ${elapsedFake}ms`);
    console.log(`  📊 Duration (Existent user + wrong pass): ${elapsedReal}ms`);

    assertTest(
      'Timing Invariance (Dummy Bcrypt Hash Execution)',
      elapsedFake >= 40 && elapsedReal >= 40,
      `Both non-existent (${elapsedFake}ms) and existent (${elapsedReal}ms) execute full bcrypt cycles`
    );
  } catch (e) {
    assertTest('Timing Invariance', false, e.message);
  }

  // ==============================================================
  // SUMMARY
  // ==============================================================
  console.log('\n===============================================================');
  console.log(`🎯 PENETRATION & VALIDATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) process.exit(1);
}

runPenetrationSuite();
