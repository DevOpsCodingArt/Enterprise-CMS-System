const postgres = require('../backend/node_modules/postgres');
const sql = postgres('postgresql://primeone_user:securepassword123@localhost:5433/primeone');

async function sync() {
  const companyId = '8add3cc7-429b-4361-ab6f-29aa31e20196';
  const staffUserId = '9678000b-41ff-4a51-8a30-98c3f133d723';

  // 1. Update conversation 7d1570d2-6fa3-4828-918f-9a2b32b30d45 to belong to Usman Tariq
  const usmanCustId = '3aba4943-3350-4220-9ee9-9f9499dbea44';
  await sql`
    UPDATE conversations 
    SET customer_id = ${usmanCustId},
        subject = 'Severe optical attenuation & packet loss (-27.8 dBm)',
        priority = 'urgent',
        last_message_at = NOW() - INTERVAL '15 minutes',
        updated_at = NOW()
    WHERE id = '7d1570d2-6fa3-4828-918f-9a2b32b30d45'
  `;

  // Update messages of conversation 7d1570d2 to reflect Usman Tariq
  await sql`
    UPDATE messages
    SET sender_name = 'Usman Tariq',
        content = 'Hello NOC team, my fiber LOS red light is blinking intermittently and speed tests are failing.'
    WHERE conversation_id = '7d1570d2-6fa3-4828-918f-9a2b32b30d45'
      AND sender_type = 'customer'
      AND content LIKE '%dropping significantly%'
  `;

  // 2. Check if Fatima Corporate Services already has a conversation
  const fatimaCustId = '98d380b8-9ef9-4831-9769-3c296da05ca5';
  const existingFatima = await sql`
    SELECT id FROM conversations WHERE customer_id = ${fatimaCustId}
  `;

  if (existingFatima.length === 0) {
    const [newConv] = await sql`
      INSERT INTO conversations (
        company_id, customer_id, initiated_by, status, assigned_to,
        assigned_at, priority, subject, last_message_at, unread_count_staff,
        unread_count_customer, created_at, updated_at
      ) VALUES (
        ${companyId}, ${fatimaCustId}, 'customer', 'active', ${staffUserId},
        NOW() - INTERVAL '2 hours', 'normal', 'CIR Bandwidth Upgrade & Billing Query',
        NOW() - INTERVAL '40 minutes', 1, 0, NOW() - INTERVAL '2 hours', NOW()
      )
      RETURNING id
    `;

    // Add initial messages for Fatima Corporate
    await sql`
      INSERT INTO messages (
        company_id, conversation_id, sender_type, sender_customer_id, sender_name,
        content, is_internal_note, message_type, status, created_at
      ) VALUES 
      (
        ${companyId}, ${newConv.id}, 'customer', ${fatimaCustId}, 'Fatima Corporate Services Ltd',
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
        ${companyId}, ${newConv.id}, 'staff', ${staffUserId}, 'Tariq Mehmood',
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
        ${companyId}, ${newConv.id}, 'customer', ${fatimaCustId}, 'Fatima Corporate Services Ltd',
        'Understood. Please confirm if there will be any downtime during port reconfiguration on GPON0/2:1.',
        false, 'text', 'delivered', NOW() - INTERVAL '40 minutes'
      )
    `;
    console.log('Created conversation for Fatima Corporate Services:', newConv.id);
  }

  console.log('Conversations synchronized with real customers.');
  await sql.end();
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
