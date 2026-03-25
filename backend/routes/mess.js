const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get weekly mess menu
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM mess_menu ORDER BY day_of_week
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /mess error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Warden updates a menu item
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'warden') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { id } = req.params;
        const { veg_item, non_veg_item, timing } = req.body;
        
        const result = await db.query(
            `UPDATE mess_menu 
            SET veg_item = $1, non_veg_item = $2, timing = $3, updated_at = CURRENT_TIMESTAMP
            WHERE menu_id = $4 RETURNING *`,
            [veg_item, non_veg_item, timing, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PATCH /mess/:id error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

// Warden adds a new menu item
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'warden') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { day_of_week, meal_type, veg_item, non_veg_item, timing } = req.body;
        
        const result = await db.query(
            `INSERT INTO mess_menu (day_of_week, meal_type, veg_item, non_veg_item, timing)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [day_of_week, meal_type, veg_item, non_veg_item, timing]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /mess error:', err);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

module.exports = router;
