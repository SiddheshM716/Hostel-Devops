const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get payments — students see only their own, wardens see all
router.get('/', auth, async (req, res) => {
    try {
        const { id, role } = req.user;
        let query, params = [];

        if (role === 'warden') {
            query = `
                SELECT p.*, s.name as student_name
                FROM payment p
                JOIN student s ON p.student_id = s.student_id
                ORDER BY p.payment_date DESC
            `;
        } else {
            query = `
                SELECT p.*, s.name as student_name
                FROM payment p
                JOIN student s ON p.student_id = s.student_id
                WHERE p.student_id = $1
                ORDER BY p.payment_date DESC
            `;
            params = [id];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /payments error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Create payment
router.post('/', auth, async (req, res) => {
    const { amount, payment_mode, payment_date } = req.body;
    const student_id = req.user.id;
    try {
        const newPayment = await db.query(
            "INSERT INTO payment (student_id, amount, payment_mode, payment_date) VALUES ($1, $2, $3, $4) RETURNING *",
            [student_id, amount, payment_mode, payment_date]
        );
        res.json(newPayment.rows[0]);
    } catch (err) {
        console.error('POST /payments error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

module.exports = router;
