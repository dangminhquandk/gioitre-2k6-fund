// api/members.js
const DB_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1213fb8012ebd';

// Danh sách ID mẫu đã xác nhận
const BASE_PAID_IDS = [];

const INITIAL_MEMBERS = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  name: "",
  status: "Chưa đóng"
}));

// Bộ nhớ đệm module-level bảo toàn giữa các lần gọi
let memoryPaidIds = new Set(BASE_PAID_IDS);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Luôn bắt đầu từ tập hợp đã xác nhận
  const currentPaid = new Set([...BASE_PAID_IDS, ...memoryPaidIds]);
  let debug = {};

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const getRes = await fetch(DB_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    });
    clearTimeout(timeout);

    debug.status = getRes.status;
    if (getRes.ok) {
      const dbData = await getRes.json();
      debug.data = dbData;
      if (dbData && dbData.data && Array.isArray(dbData.data.paidIds)) {
        dbData.data.paidIds.forEach(id => {
          const num = Number(id);
          currentPaid.add(num);
          memoryPaidIds.add(num);
        });
      }
    } else {
      debug.error = await getRes.text();
    }
  } catch (e) {
    debug.catch = e.message;
  }

  const members = INITIAL_MEMBERS.map(m => ({
    ...m,
    status: currentPaid.has(m.id) ? 'Đã đóng' : 'Chưa đóng'
  }));

  const total = members.length;
  const paid = members.filter(m => m.status === 'Đã đóng').length;
  const unpaid = total - paid;
  const collected = paid * 99000;
  const target = total * 99000;
  const percent = ((paid / total) * 100).toFixed(1);

  return res.status(200).json({
    success: true,
    serverTime: new Date().toISOString(),
    debug,
    bank: {
      bin: '970422',
      code: 'MB',
      name: 'MBBank',
      accountNo: '0123456789',
      accountName: 'CHỦ TÀI KHOẢN',
      amount: 99000
    },
    stats: {
      total,
      paid,
      unpaid,
      collected,
      target,
      percent: Number(percent)
    },
    members
  });
}
