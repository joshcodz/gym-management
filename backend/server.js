const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Josh@1234',
  database: process.env.DB_NAME || 'gym_plus',
  waitForConnections: true,
  connectionLimit: 10,
});

// ─── AUTH ────────────────────────────────────────────────────────────────────

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM ADMIN_USER WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    res.json({ success: true, user: { id: user.admin_id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

app.get('/dashboard', async (req, res) => {
  try {
    const [[{ totalMembers }]] = await pool.query('SELECT COUNT(*) as totalMembers FROM MEMBER');
    const [[{ activeMembers }]] = await pool.query("SELECT COUNT(*) as activeMembers FROM MEMBERSHIP WHERE status = 'Active'");
    const [[{ todayCheckins }]] = await pool.query('SELECT COUNT(*) as todayCheckins FROM ATTENDANCE WHERE date = CURDATE()');
    const [[{ monthlyRevenue }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) as monthlyRevenue FROM PAYMENT WHERE status='Paid' AND MONTH(payment_date)=MONTH(CURDATE()) AND YEAR(payment_date)=YEAR(CURDATE())"
    );
    const [[{ activeCount }]] = await pool.query("SELECT COUNT(*) as activeCount FROM MEMBERSHIP WHERE status='Active'");
    const [[{ expiredCount }]] = await pool.query("SELECT COUNT(*) as expiredCount FROM MEMBERSHIP WHERE status='Expired'");
    const [[{ pendingCount }]] = await pool.query("SELECT COUNT(*) as pendingCount FROM MEMBERSHIP WHERE status='Pending'");

    const [recentMembers] = await pool.query(`
      SELECT m.member_id, m.first_name, m.last_name, ms.membership_type, m.join_date
      FROM MEMBER m
      LEFT JOIN MEMBERSHIP ms ON m.member_id = ms.member_id
      ORDER BY m.created_at DESC LIMIT 5
    `);

    res.json({
      stats: { totalMembers, activeMembers, todayCheckins, monthlyRevenue },
      membershipStatus: { active: activeCount, expired: expiredCount, pending: pendingCount },
      recentMembers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MEMBERS ─────────────────────────────────────────────────────────────────

app.get('/members', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.member_id, m.first_name, m.last_name, m.phone, m.email, m.gender, m.address, m.join_date,
             ms.membership_type as plan, ms.status
      FROM MEMBER m
      LEFT JOIN MEMBERSHIP ms ON m.member_id = ms.member_id
      ORDER BY m.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/add-member', async (req, res) => {
  try {
    const { first_name, last_name, phone, email, gender, address } = req.body;
    // Generate member ID
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM MEMBER');
    const member_id = `MBR${1001 + count}`;
    await pool.query(
      'INSERT INTO MEMBER (member_id, first_name, last_name, phone, email, gender, address, join_date) VALUES (?,?,?,?,?,?,?,CURDATE())',
      [member_id, first_name, last_name, phone, email, gender, address]
    );
    res.json({ success: true, member_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/update-member/:id', async (req, res) => {
  try {
    const { first_name, last_name, phone, email, gender, address } = req.body;
    await pool.query(
      'UPDATE MEMBER SET first_name=?, last_name=?, phone=?, email=?, gender=?, address=? WHERE member_id=?',
      [first_name, last_name, phone, email, gender, address, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/delete-member/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM MEMBER WHERE member_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MEMBERSHIPS ─────────────────────────────────────────────────────────────

app.get('/memberships', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ms.*, CONCAT(m.first_name,' ',m.last_name) as member_name
      FROM MEMBERSHIP ms
      LEFT JOIN MEMBER m ON ms.member_id = m.member_id
      ORDER BY ms.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/add-membership', async (req, res) => {
  try {
    const { member_id, membership_type, start_date, end_date, validity, amount } = req.body;
    // Update old membership to expired
    await pool.query("UPDATE MEMBERSHIP SET status='Expired' WHERE member_id=? AND status='Active'", [member_id]);
    await pool.query(
      'INSERT INTO MEMBERSHIP (member_id, membership_type, start_date, end_date, validity, amount, status) VALUES (?,?,?,?,?,?,?)',
      [member_id, membership_type, start_date, end_date, validity, amount, 'Active']
    );
    // Also add payment record
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM PAYMENT');
    const payment_id = `PAY${1001 + count}`;
    const [memberRows] = await pool.query('SELECT CONCAT(first_name," ",last_name) as name FROM MEMBER WHERE member_id=?', [member_id]);
    const member_name = memberRows[0]?.name || '';
    await pool.query(
      'INSERT INTO PAYMENT (payment_id, member_id, member_name, plan, amount, payment_date, status, method) VALUES (?,?,?,?,?,CURDATE(),?,?)',
      [payment_id, member_id, member_name, membership_type, amount, 'Paid', 'Cash']
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/update-membership/:id', async (req, res) => {
  try {
    const { membership_type, start_date, end_date, validity, amount, status } = req.body;
    await pool.query(
      'UPDATE MEMBERSHIP SET membership_type=?, start_date=?, end_date=?, validity=?, amount=?, status=? WHERE membership_id=?',
      [membership_type, start_date, end_date, validity, amount, status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/delete-membership/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM MEMBERSHIP WHERE membership_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TRAINERS ────────────────────────────────────────────────────────────────

app.get('/trainers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM TRAINER ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/add-trainer', async (req, res) => {
  try {
    const { name, specialization, phone, email, experience } = req.body;
    await pool.query(
      'INSERT INTO TRAINER (name, specialization, phone, email, experience) VALUES (?,?,?,?,?)',
      [name, specialization, phone, email, experience || 0]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/update-trainer/:id', async (req, res) => {
  try {
    const { name, specialization, phone, email, experience, status } = req.body;
    await pool.query(
      'UPDATE TRAINER SET name=?, specialization=?, phone=?, email=?, experience=?, status=? WHERE trainer_id=?',
      [name, specialization, phone, email, experience, status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/delete-trainer/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM TRAINER WHERE trainer_id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ATTENDANCE / BIOMETRIC ──────────────────────────────────────────────────

app.get('/attendance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, CONCAT(m.first_name,' ',m.last_name) as member_name
      FROM ATTENDANCE a
      LEFT JOIN MEMBER m ON a.member_id = m.member_id
      ORDER BY a.entry_time DESC LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/member-lookup/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT member_id, first_name, last_name, phone, email FROM MEMBER WHERE member_id=?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/entry', async (req, res) => {
  try {
    const { member_id } = req.body;
    // Check if already has open entry today
    const [existing] = await pool.query(
      'SELECT id FROM ATTENDANCE WHERE member_id=? AND date=CURDATE() AND exit_time IS NULL',
      [member_id]
    );
    if (existing.length > 0) return res.status(400).json({ error: 'Member already checked in today' });
    await pool.query(
      'INSERT INTO ATTENDANCE (member_id, entry_time, date) VALUES (?, NOW(), CURDATE())',
      [member_id]
    );
    res.json({ success: true, message: 'Entry marked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/exit', async (req, res) => {
  try {
    const { member_id } = req.body;
    const [rows] = await pool.query(
      'SELECT id FROM ATTENDANCE WHERE member_id=? AND date=CURDATE() AND exit_time IS NULL',
      [member_id]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'No active entry found for today' });
    await pool.query('UPDATE ATTENDANCE SET exit_time=NOW() WHERE id=?', [rows[0].id]);
    res.json({ success: true, message: 'Exit marked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

app.get('/payments', async (req, res) => {
  try {
    const [payments] = await pool.query('SELECT * FROM PAYMENT ORDER BY created_at DESC');
    const [[{ total }]] = await pool.query("SELECT COALESCE(SUM(amount),0) as total FROM PAYMENT WHERE status='Paid'");
    const [[{ monthly }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) as monthly FROM PAYMENT WHERE status='Paid' AND MONTH(payment_date)=MONTH(CURDATE()) AND YEAR(payment_date)=YEAR(CURDATE())"
    );
    const [[{ pending }]] = await pool.query("SELECT COALESCE(SUM(amount),0) as pending FROM PAYMENT WHERE status='Pending'");
    const [[{ pendingCount }]] = await pool.query("SELECT COUNT(*) as pendingCount FROM PAYMENT WHERE status='Pending'");
    res.json({ payments, summary: { total, monthly, pending, pendingCount } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/add-payment', async (req, res) => {
  try {
    const { member_id, member_name, plan, amount, status, method } = req.body;
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM PAYMENT');
    const payment_id = `PAY${1001 + count}`;
    await pool.query(
      'INSERT INTO PAYMENT (payment_id, member_id, member_name, plan, amount, payment_date, status, method) VALUES (?,?,?,?,?,CURDATE(),?,?)',
      [payment_id, member_id, member_name, plan, amount, status, method]
    );
    res.json({ success: true, payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🏋️  Gym Plus API running on http://localhost:${PORT}`));
