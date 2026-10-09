// api/sepay-webhook.js
const DB_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1213fb8012ebd';

const INITIAL_MEMBERS = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: ""
}));

function removeVietnameseTones(str) {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function matchMember(content) {
  if (!content) return null;
  const clean = removeVietnameseTones(content.toLowerCase());

  for (const m of INITIAL_MEMBERS) {
    const stt = String(m.id).padStart(2, '0');
    const hasSttMatch = clean.includes('2k6') && (clean.includes(stt) || clean.includes(' ' + m.id + ' ') || clean.includes(' ' + m.id + '.'));
    
    let hasNameMatch = false;
    if (m.name) {
      const nameParts = removeVietnameseTones(m.name.toLowerCase()).split(' ');
      const lastName = nameParts[nameParts.length - 1];
      const fullName = removeVietnameseTones(m.name.toLowerCase());
      hasNameMatch = clean.includes(fullName) || (clean.includes('2k6') && clean.includes(lastName));
    }

    if (hasSttMatch || hasNameMatch) {
      return m.id;
    }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    console.log('SePay Webhook Received:', JSON.stringify(body));

    const content = body.content || body.transaction_content || body.description || '';
    const amount = Number(body.transferAmount || body.amount_in || body.amount || 0);

    const matchedId = matchMember(content);

    if (matchedId && (amount === 0 || amount >= 99000)) {
      // Đọc DB hiện tại
      const BASE_PAID_IDS = [];
      let paidIds = [...BASE_PAID_IDS];
      try {
        const getRes = await fetch(DB_URL);
        if (getRes.ok) {
          const dbData = await getRes.json();
          if (dbData && dbData.data && Array.isArray(dbData.data.paidIds)) {
            paidIds = Array.from(new Set([...BASE_PAID_IDS, ...dbData.data.paidIds.map(Number)]));
          }
        }
      } catch (e) {
        console.warn('DB read error:', e);
      }

      // Thêm thành viên vừa chuyển
      if (!paidIds.includes(matchedId)) {
        paidIds.push(matchedId);
        // Lưu lại DB
        await fetch(DB_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'gioitre-2k6-paid',
            data: { paidIds }
          })
        });
        console.log(`Successfully marked member ${matchedId} as paid!`);
      }
    }

    // SePay yêu cầu trả về status 200 JSON
    return res.status(200).json({
      success: true,
      matchedMemberId: matchedId || null
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).json({ success: true, error: err.message });
  }
}
