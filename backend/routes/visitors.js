const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get visitors
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const result = await db.query(
                `SELECT v.*, w.warden_name 
                 FROM visitor v
                 LEFT JOIN warden w ON v.warden_id = w.warden_id
                 WHERE v.student_id = $1 
                 ORDER BY v.visitor_date DESC`, 
                [req.user.id]
            );
            res.json(result.rows);
        } else if (req.user.role === 'warden') {
            const result = await db.query(
                `SELECT v.*, s.name as student_name, w.warden_name 
                 FROM visitor v
                 JOIN student s ON v.student_id = s.student_id
                 LEFT JOIN warden w ON v.warden_id = w.warden_id
                 ORDER BY v.visitor_date DESC`
            );
            res.json(result.rows);
        }
    } catch (err) {
        console.error('GET /visitors error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Student applies for a visitor
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { visitor_date, visitor_name, visitor_email } = req.body;
        
        const result = await db.query(
            `INSERT INTO visitor (student_id, visitor_date, visitor_name, visitor_email)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.id, visitor_date, visitor_name, visitor_email]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /visitors error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Warden updates visitor status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'warden') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Declined'
        
        const result = await db.query(
            `UPDATE visitor 
            SET status = $1, warden_id = $2
            WHERE visitor_id = $3 RETURNING *`,
            [status, req.user.id, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Visitor request not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PATCH /visitors/:id/status error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

module.exports = router;
