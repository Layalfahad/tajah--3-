const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// POST /api/negotiations — create a new offer/negotiation
router.post('/', async (req, res) => {
    try {
        const { application_id, player_id, club_id, offer_salary, from_athlete } = req.body;
        const result = await dbRun(
            'INSERT INTO negotiations (application_id, player_id, club_id, offer_salary, from_athlete, status) VALUES (?, ?, ?, ?, ?, ?)',
            [application_id, player_id, club_id, offer_salary || '', from_athlete ? 1 : 0, 'pending']
        );
        res.status(201).json({ id: result.lastID, message: 'تم إرسال العرض' });
    } catch (err) {
        console.error('Create negotiation error:', err);
        res.status(500).json({ error: 'حدث خطأ في إنشاء المفاوضة' });
    }
});

// GET /api/negotiations — list negotiations, optionally by player or club
router.get('/', async (req, res) => {
    try {
        const { player_id, club_id } = req.query;
        let sql = 'SELECT n.*, u_p.name as player_name, u_c.name as club_name FROM negotiations n LEFT JOIN users u_p ON n.player_id = u_p.id LEFT JOIN users u_c ON n.club_id = u_c.id WHERE 1=1';
        const params = [];
        if (player_id) { sql += ' AND n.player_id = ?'; params.push(player_id); }
        if (club_id) { sql += ' AND n.club_id = ?'; params.push(club_id); }
        sql += ' ORDER BY n.created_at DESC';
        const negotiations = await dbAll(sql, params);
        res.json(negotiations);
    } catch (err) {
        console.error('Get negotiations error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب المفاوضات' });
    }
});

// PUT /api/negotiations/:id — accept, reject, or counter-offer
router.put('/:id', async (req, res) => {
    try {
        const { status, counter_salary, counter_note } = req.body;
        if (!status) return res.status(400).json({ error: 'الحالة مطلوبة' });
        await dbRun(
            'UPDATE negotiations SET status = ?, counter_salary = COALESCE(?, counter_salary), counter_note = COALESCE(?, counter_note) WHERE id = ?',
            [status, counter_salary, counter_note, req.params.id]
        );
        res.json({ message: 'تم تحديث المفاوضة' });
    } catch (err) {
        console.error('Update negotiation error:', err);
        res.status(500).json({ error: 'حدث خطأ في تحديث المفاوضة' });
    }
});

module.exports = router;
