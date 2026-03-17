const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all students with their latest room assignment
router.get('/', auth, async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT ON (s.student_id)
                s.student_id, 
                s.name, 
                s.email, 
                s.contact_number, 
                r.room_no as room_number
            FROM student s
            LEFT JOIN room_allocation ra ON s.student_id = ra.student_id
            LEFT JOIN room r ON ra.room_id = r.room_id
            ORDER BY s.student_id, ra.allocation_date DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /students error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
