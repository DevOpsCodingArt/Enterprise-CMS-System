const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function main() {
  const users = await sql`SELECT id, email, full_name, phone, user_type, department, designation FROM users`;
  console.log('USERS IN DB:', users);
  await sql.end();
}

main();
