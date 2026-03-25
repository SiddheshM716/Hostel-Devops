const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get leaves
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const result = await db.query(
                `SELECT l.*, w.warden_name 
                 FROM leave_application l
                 LEFT JOIN warden w ON l.warden_id = w.warden_id
                 WHERE l.student_id = $1 
                 ORDER BY l.applied_at DESC`, 
                [req.user.id]
            );
            res.json(result.rows);
        } else if (req.user.role === 'warden') {
            const result = await db.query(
                `SELECT l.*, s.name as student_name, w.warden_name 
                 FROM leave_application l
                 JOIN student s ON l.student_id = s.student_id
                 LEFT JOIN warden w ON l.warden_id = w.warden_id
                 ORDER BY l.applied_at DESC`
            );
            res.json(result.rows);
        }
    } catch (err) {
        console.error('GET /leaves error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Student applies for a leave
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { start_date, end_date, reason } = req.body;
        
        const result = await db.query(
            `INSERT INTO leave_application (student_id, start_date, end_date, reason)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.id, start_date, end_date, reason]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /leaves error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Warden updates leave status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'warden') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Declined'
        
        const result = await db.query(
            `UPDATE leave_application 
            SET status = $1, warden_id = $2
            WHERE leave_id = $3 RETURNING *`,
            [status, req.user.id, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PATCH /leaves/:id/status error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

module.exports = router;
