const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Helper to normalize status for the database (capitalize words)
const normalizeStatusForDB = (status) => {
    if (!status) return 'Pending';
    const s = status.toLowerCase();
    if (s === 'pending') return 'Pending';
    if (s === 'in progress' || s === 'in_progress') return 'In Progress';
    if (s === 'resolved') return 'Resolved';
    return 'Pending';
};

// Get complaints with role-based filtering and detailed room info
router.get('/', auth, async (req, res) => {
    try {
        const { id, role } = req.user;
        let query, params = [];

        if (role === 'warden') {
            query = `
                SELECT 
                    c.complaint_id, 
                    c.student_id,
                    c.description, 
                    c.complaint_type, 
                    LOWER(c.complaint_status) as complaint_status, 
                    c.updated_at,
                    c.assigned_to,
                    s.name as student_name,
                    r.room_no,
                    r.room_type,
                    r.hostel_id
                FROM complaint c
                JOIN student s ON c.student_id = s.student_id
                LEFT JOIN lateral (
                    SELECT ra.room_id FROM room_allocation ra 
                    WHERE ra.student_id = s.student_id 
                    ORDER BY ra.allocation_date DESC LIMIT 1
                ) latest_ra ON true
                LEFT JOIN room r ON latest_ra.room_id = r.room_id
                ORDER BY c.updated_at DESC
            `;
        } else {
            query = `
                SELECT 
                    c.complaint_id, 
                    c.student_id,
                    c.description, 
                    c.complaint_type, 
                    LOWER(c.complaint_status) as complaint_status, 
                    c.updated_at,
                    c.assigned_to,
                    s.name as student_name
                FROM complaint c
                JOIN student s ON c.student_id = s.student_id
                WHERE c.student_id = $1
                ORDER BY c.updated_at DESC
            `;
            params = [id];
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /complaints error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a complaint
router.post('/', auth, async (req, res) => {
    const { description, complaint_type } = req.body;
    try {
        const student_id = req.user.id;
        const newComplaint = await db.query(
            "INSERT INTO complaint (student_id, description, complaint_type, complaint_status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
            [student_id, description, complaint_type]
        );
        res.json(newComplaint.rows[0]);
    } catch (err) {
        console.error('POST /complaints error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update complaint status and optionally assign worker
router.patch('/:id/status', auth, async (req, res) => {
    const { status, assigned_to } = req.body;
    const dbStatus = normalizeStatusForDB(status);
    try {
        let query, params;
        if (assigned_to !== undefined) {
             query = 'UPDATE complaint SET complaint_status = $1, assigned_to = $2, updated_at = CURRENT_TIMESTAMP WHERE complaint_id = $3 RETURNING *';
             params = [dbStatus, assigned_to, req.params.id];
        } else {
             query = 'UPDATE complaint SET complaint_status = $1, updated_at = CURRENT_TIMESTAMP WHERE complaint_id = $2 RETURNING *';
             params = [dbStatus, req.params.id];
        }
        
        const updated = await db.query(query, params);
        res.json(updated.rows[0]);
    } catch (err) {
        console.error('PATCH /complaints status error:', err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

module.exports = router;
