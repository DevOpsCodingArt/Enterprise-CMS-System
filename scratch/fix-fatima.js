const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function fixFatima() {
  const companyId = '8add3cc7-429b-4361-ab6f-29aa31e20196';
  const staffUserId = '9678000b-41ff-4a51-8a30-98c3f133d723';
  const fatimaCustId = '98d380b8-9ef9-4831-9769-3c296da05ca5';

  const [fatimaConv] = await sql`
    SELECT id FROM conversations WHERE customer_id = ${fatimaCustId}
  `;

  if (fatimaConv) {
    const existingMsgs = await sql`SELECT count(*)::int as cnt FROM messages WHERE conversation_id = ${fatimaConv.id}`;
    if (existingMsgs[0].cnt === 0) {
      await sql`
        INSERT INTO messages (
          company_id, conversation_id, sender_type, sender_customer_id, sender_name,
          content, is_internal_note, message_type, status, created_at
        ) VALUES 
        (
          ${companyId}, ${fatimaConv.id}, 'customer', ${fatimaCustId}, 'Fatima Corporate Services Ltd',
          'Assalam-o-Alaikum, we need to upgrade our Blue Area office connection from 100 Mbps to 200 Mbps CIR.',
          false, 'text', 'read', NOW() - INTERVAL '1 hour'
        )
      `;

      await sql`
        INSERT INTO messages (
          company_id, conversation_id, sender_type, sender_user_id, sender_name,
          content, is_internal_note, message_type, status, created_at
        ) VALUES 
        (
          ${companyId}, ${fatimaConv.id}, 'staff', ${staffUserId}, 'Tariq Mehmood',
          'Walaikum Assalam. Our enterprise account manager has prepared the SLA addendum for your 200 Mbps package.',
          false, 'text', 'read', NOW() - INTERVAL '50 minutes'
        )
      `;

      await sql`
        INSERT INTO messages (
          company_id, conversation_id, sender_type, sender_customer_id, sender_name,
          content, is_internal_note, message_type, status, created_at
        ) VALUES 
        (
          ${companyId}, ${fatimaConv.id}, 'customer', ${fatimaCustId}, 'Fatima Corporate Services Ltd',
          'Understood. Please confirm if there will be any downtime during port reconfiguration on GPON0/2:1.',
          false, 'text', 'delivered', NOW() - INTERVAL '40 minutes'
        )
      `;
      console.log('Inserted messages for Fatima Corporate Services successfully.');
    }
  }

  // Also clean up messages for Usman Tariq to ensure they reflect his name and issue
  const [usmanConv] = await sql`
    SELECT id FROM conversations WHERE customer_id = '3aba4943-3350-4220-9ee9-9f9499dbea44'
  `;
  if (usmanConv) {
    await sql`
      UPDATE messages
      SET content = 'Hello Usman! Checking your optical attenuation on EPON0/3:2 now. Signal is indeed degraded at -27.8 dBm.'
      WHERE conversation_id = ${usmanConv.id}
        AND sender_type = 'staff'
        AND content LIKE 'Hello Muhammad Ali%'
    `;
    await sql`
      UPDATE messages
      SET content = 'NOC TR-069 shows optical RX attenuation beyond -27 dBm. Field technician dispatched to check optical drop cable.'
      WHERE conversation_id = ${usmanConv.id}
        AND is_internal_note = true
    `;
    await sql`
      UPDATE messages
      SET sender_name = 'Usman Tariq'
      WHERE conversation_id = ${usmanConv.id}
        AND sender_type = 'customer'
    `;
    console.log('Updated messages for Usman Tariq successfully.');
  }

  await sql.end();
}

fixFatima().catch(err => {
  console.error(err);
  process.exit(1);
});
