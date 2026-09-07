const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function purgeChats() {
  console.log('Purging all dummy messages and conversations from database...');
  await sql`DELETE FROM messages`;
  console.log('✓ All messages purged.');
  await sql`DELETE FROM conversations`;
  console.log('✓ All conversations purged.');
  
  const convCount = await sql`SELECT count(*)::int as cnt FROM conversations`;
  const msgCount = await sql`SELECT count(*)::int as cnt FROM messages`;
  console.log(`Remaining conversations in DB: ${convCount[0].cnt}`);
  console.log(`Remaining messages in DB: ${msgCount[0].cnt}`);

  await sql.end();
}

purgeChats().catch(err => {
  console.error(err);
  process.exit(1);
});
