const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function check() {
  const cols = await sql`SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'conversations' ORDER BY ordinal_position`;
  console.log('CONVERSATIONS COLUMNS:', cols);
  await sql.end();
}

check();
