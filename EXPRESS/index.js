require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration for credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'zenithdata',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || 5432,
});

// Add process-level error logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '2h'; // Adjust as needed

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });

// Health check
app.get('/', (req, res) => {
  res.send('Express backend is running.');
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  console.log('--- LOGIN ENDPOINT HIT ---');
  console.log('Request body:', req.body);
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log('DB result:', result.rows);
    const user = result.rows[0];
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    console.log('Password match:', match);
    if (!match) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.username === 'admin' ? 'admin' : 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Set HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 });
    res.json({ id: user.id, username: user.username, email: user.email, chat_context: user.chat_context, role: user.username === 'admin' ? 'admin' : 'user' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (id, username, email, password_hash) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id, username, email',
      [username, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Protect user data endpoints
app.get('/api/users/:id', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, chat_context, public_chat_header, public_chat_subheader FROM users WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a user's chat_context (admin can update any, user can update their own)
app.put('/api/users/:id/chat-context', authenticateJWT, async (req, res) => {
  try {
    const { chat_context, public_chat_header, public_chat_subheader } = req.body;
    // Only allow if admin or the user is updating their own context
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own context.' });
    }
    await pool.query(
      'UPDATE users SET chat_context = $1, public_chat_header = $2, public_chat_subheader = $3, updated_at = now() WHERE id = $4',
      [chat_context, public_chat_header, public_chat_subheader, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chat context' });
  }
});

// Logout endpoint to clear JWT cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  res.json({ success: true });
});

// Endpoint to get CSRF token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Middleware to verify JWT
function authenticateJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admins only' });
  next();
}

// Add CSRF protection to state-changing routes
app.use('/api', (req, res, next) => {
  // Only protect state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Admin: Get all users
app.get('/api/users', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get or update admin chat context
app.get('/api/admin/context', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    // Find the admin user (by username or role)
    const result = await pool.query('SELECT chat_context FROM users WHERE username = $1', ['admin']);
    if (!result.rows.length) return res.status(404).json({ error: 'Admin user not found' });
    res.json({ chat_context: result.rows[0].chat_context || '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin context' });
  }
});

app.put('/api/admin/context', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    console.log('--- /api/admin/context PUT called ---');
    console.log('req.user:', req.user);
    const { chat_context } = req.body;
    await pool.query('UPDATE users SET chat_context = $1, updated_at = now() WHERE username = $2', [chat_context, 'admin']);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update admin context:', err);
    res.status(500).json({ error: 'Failed to update admin context' });
  }
});

// Public endpoint to get admin chat context (no auth required)
app.get('/api/public/admin-context', async (req, res) => {
  try {
    const result = await pool.query('SELECT chat_context FROM users WHERE username = $1', ['admin']);
    if (!result.rows.length) return res.status(404).json({ error: 'Admin user not found' });
    res.json({ chat_context: result.rows[0].chat_context || '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin context' });
  }
});

// Public endpoint to get user chat context by username (no auth required)
app.get('/api/public/user-context/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await pool.query('SELECT chat_context, public_chat_header, public_chat_subheader FROM users WHERE username = $1', [username]);
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({
      chat_context: result.rows[0].chat_context || '',
      public_chat_header: result.rows[0].public_chat_header || '',
      public_chat_subheader: result.rows[0].public_chat_subheader || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user context' });
  }
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
