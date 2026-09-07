const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function updatePhones() {
  await sql`UPDATE users SET phone = '+92 300 5550001' WHERE email = 'admin@primenetworks.pk'`;
  await sql`UPDATE users SET phone = '+92 300 5550002' WHERE email = 'supervisor@primenetworks.pk'`;
  await sql`UPDATE users SET phone = '+92 300 5550003' WHERE email = 'agent@primenetworks.pk'`;
  await sql`UPDATE users SET phone = '+92 300 5550004' WHERE email = 'field@primenetworks.pk'`;

  const updated = await sql`SELECT id, email, full_name, phone, designation, user_type FROM users`;
  console.log('UPDATED USERS WITH PHONES:', updated);
  await sql.end();
}

updatePhones().catch((err) => {
  console.error(err);
  process.exit(1);
});
