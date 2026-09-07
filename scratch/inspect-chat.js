const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function inspect() {
  const custs = await sql`SELECT id, full_name, phone, alt_phone, customer_code FROM customers`;
  console.log('CUSTOMERS PHONES:', custs);
  await sql.end();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
