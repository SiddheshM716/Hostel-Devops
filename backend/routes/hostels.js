const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all hostels
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM hostel');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
