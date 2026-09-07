const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function main() {
  await sql`DELETE FROM messages`;
  await sql`DELETE FROM conversations`;
  await sql`DELETE FROM customers WHERE customer_code NOT IN ('CUS-1001', 'CUS-1002', 'CUS-1003')`;
  console.log('Database reset to clean base customers (CUS-1001, CUS-1002, CUS-1003).');
  await sql.end();
}

main();
