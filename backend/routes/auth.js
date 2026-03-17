const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

// Note: since students and wardens don't have passwords in the schema, we'll store passwords in a separate auth table or just use an auth table conceptually.
// Actually, the original schema has an `auth_id UUID`. Supabase handles passwords. 
// We should either add a `password_hash` column to student/warden or create a new `auth_users` table.
// To keep it simple, we'll create a simple auth table in postgres conceptually or just alter the tables on the fly.
// Let's modify the schema slightly in our routes: we'll check if a password_hash column exists; if not, add it.

// Mock setup for now
const getRoleQuery = (role) => {
    return role === 'student' ? 'student' : 'warden';
};

// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, name, role, contact_number, gender, date_of_birth } = req.body;
    try {
        const table = getRoleQuery(role);

        // Check if user exists
        const userCheck = await db.query(`SELECT * FROM ${table} WHERE ${role === 'student' ? 'email' : 'warden_email'} = $1`, [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        let newUser;
        if (role === 'student') {
            newUser = await db.query(
                'INSERT INTO student (name, email, contact_number, gender, date_of_birth, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, email, contact_number, gender, date_of_birth, password_hash]
            );
        } else {
            newUser = await db.query(
                'INSERT INTO warden (warden_name, warden_email, warden_number, password) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, email, contact_number, password_hash]
            );
        }

        const idField = role === 'student' ? 'student_id' : 'warden_id';
        // Attach role to the returned user object so frontend can use it
        const userRow = { ...newUser.rows[0], role };
        const payload = {
            user: { id: newUser.rows[0][idField], role }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) { console.error(err); return res.status(500).json({ error: 'Token error' }); }
            res.json({ token, user: userRow });
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const table = getRoleQuery(role);
        const emailField = role === 'student' ? 'email' : 'warden_email';

        const user = await db.query(`SELECT * FROM ${table} WHERE ${emailField} = $1`, [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const idField = role === 'student' ? 'student_id' : 'warden_id';
        // Attach role to the returned user object so frontend can use it
        const userRow = { ...user.rows[0], role };
        const payload = {
            user: { id: user.rows[0][idField], role }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) { console.error(err); return res.status(500).json({ error: 'Token error' }); }
            res.json({ token, user: userRow });
        });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

// Get User Profile
router.get('/me', auth, async (req, res) => {
    try {
        const { id, role } = req.user;
        const table = getRoleQuery(role);
        const idField = role === 'student' ? 'student_id' : 'warden_id';

        const user = await db.query(`SELECT * FROM ${table} WHERE ${idField} = $1`, [id]);
        if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json({ user: { ...user.rows[0], role }, role });
    } catch (err) {
        console.error('Auth/me error:', err);
        res.status(500).json({ error: err.message || 'Server error' });
    }
});

module.exports = router;
