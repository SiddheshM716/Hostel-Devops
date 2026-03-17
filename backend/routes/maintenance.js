const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all maintenance requests with detailed info
router.get('/', auth, async (req, res) => {
    try {
        const query = `
            SELECT 
                m.maintenance_id as task_id, 
                r.room_no as room_number, 
                m.issue as description, 
                LOWER(m.status) as status, 
                m.created_at,
                s.name as student_name
            FROM maintenance m
            JOIN student s ON m.student_id = s.student_id
            JOIN room r ON m.room_id = r.room_id
            ORDER BY m.maintenance_id DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /maintenance error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Create maintenance request
router.post('/', auth, async (req, res) => {
    const { room_id, issue } = req.body;
    try {
        const student_id = req.user.id;
        const newReq = await db.query(
            "INSERT INTO maintenance (student_id, room_id, issue, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
            [student_id, room_id, issue]
        );
        res.json(newReq.rows[0]);
    } catch (err) {
        console.error('POST /maintenance error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Update maintenance status
router.patch('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const updated = await db.query(
            'UPDATE maintenance SET status = $1 WHERE maintenance_id = $2 RETURNING *',
            [status.toLowerCase(), req.params.id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('PATCH /maintenance status error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
