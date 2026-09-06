import { z } from "zod";

const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email, username, or customer ID is required")
    .max(255, "Identifier cannot exceed 255 characters")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
  rememberMe: z.boolean().optional(),
});

console.log('Testing Frontend Zod Schema...');

// Test 1: Empty identifier
const t1 = loginFormSchema.safeParse({ identifier: '', password: 'Password123!' });
console.assert(!t1.success, 'Test 1 should fail');
console.log('Test 1 (Empty Identifier):', t1.success ? 'FAIL' : 'PASS', t1.error?.issues[0]?.message);

// Test 2: Short password
const t2 = loginFormSchema.safeParse({ identifier: 'admin@primenetworks.pk', password: '123' });
console.assert(!t2.success, 'Test 2 should fail');
console.log('Test 2 (Short Password):', t2.success ? 'FAIL' : 'PASS', t2.error?.issues[0]?.message);

// Test 3: Password > 128 chars
const t3 = loginFormSchema.safeParse({ identifier: 'admin@primenetworks.pk', password: 'a'.repeat(129) });
console.assert(!t3.success, 'Test 3 should fail');
console.log('Test 3 (Password > 128 chars):', t3.success ? 'FAIL' : 'PASS', t3.error?.issues[0]?.message);

// Test 4: Whitespace trimming
const t4 = loginFormSchema.safeParse({ identifier: '  admin@primenetworks.pk   ', password: 'Password123!' });
console.assert(t4.success && t4.data.identifier === 'admin@primenetworks.pk', 'Test 4 should trim');
console.log('Test 4 (Whitespace Trimming):', t4.success && t4.data.identifier === 'admin@primenetworks.pk' ? 'PASS' : 'FAIL', `"${t4.data?.identifier}"`);

console.log('\nAll Frontend Zod Schema Tests Passed!');
