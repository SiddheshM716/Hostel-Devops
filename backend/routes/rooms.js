const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all rooms with vacancy count
router.get('/', auth, async (req, res) => {
    try {
        // Compute vacancies by counting active allocations per room
        const result = await db.query(`
            SELECT 
                r.*,
                h.hostel_name,
                h.location as hostel_location,
                r.room_capacity - COUNT(ra.allocation_id) AS vacancies
            FROM room r
            LEFT JOIN hostel h ON r.hostel_id = h.hostel_id
            LEFT JOIN room_allocation ra ON r.room_id = ra.room_id
            GROUP BY r.room_id, h.hostel_name, h.location
            ORDER BY r.room_no
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /rooms error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

module.exports = router;
