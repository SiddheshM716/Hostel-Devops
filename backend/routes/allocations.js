const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all room allocations
router.get('/', auth, async (req, res) => {
    try {
        const query = `
            SELECT ra.*, s.name as student_name, r.room_no 
            FROM room_allocation ra
            JOIN student s ON ra.student_id = s.student_id
            JOIN room r ON ra.room_id = r.room_id
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create allocation
router.post('/', auth, async (req, res) => {
    const { student_id, room_id, lease_end_date } = req.body;
    try {
        const newAlloc = await db.query(
            "INSERT INTO room_allocation (student_id, room_id, lease_end_date) VALUES ($1, $2, $3) RETURNING *",
            [student_id, room_id, lease_end_date]
        );
        res.json(newAlloc.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
