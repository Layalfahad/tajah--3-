const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET /api/applications — optionally filter by player_id or status
router.get('/', async (req, res) => {
    try {
        const { player_id, status } = req.query;
        let sql = 'SELECT * FROM applications WHERE 1=1';
        const params = [];
        if (player_id) { sql += ' AND player_id = ?'; params.push(player_id); }
        if (status) { sql += ' AND status = ?'; params.push(status); }
        sql += ' ORDER BY created_at DESC';
        const apps = await dbAll(sql, params);
        res.json(apps);
    } catch (err) {
        console.error('Get applications error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب الطلبات' });
    }
});

// POST /api/applications
router.post('/', async (req, res) => {
    try {
        const {
            opportunity_id,
            player_id,
            club_name,
            club_city,
            sport,
            position,
            has_offer,
            offer_position,
            offer_salary,
            offer_start_date,
            offer_duration,
            offer_benefits
        } = req.body;

        if (!player_id) {
            return res.status(400).json({ error: 'معرف اللاعبة مطلوب' });
        }
        const today = new Date().toLocaleDateString('ar-EG');
        const result = await dbRun(
            `INSERT INTO applications (
                opportunity_id, player_id, club_name, club_city, sport, position, applied_date, status,
                has_offer, offer_position, offer_salary, offer_start_date, offer_duration, offer_benefits
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                opportunity_id,
                player_id,
                club_name || '',
                club_city || '',
                sport || '',
                position || '',
                today,
                'pending',
                has_offer || 0,
                offer_position || null,
                offer_salary || null,
                offer_start_date || null,
                offer_duration || null,
                offer_benefits || null
            ]
        );
        res.status(201).json({ id: result.lastID, message: 'تم تقديم الطلب بنجاح' });
    } catch (err) {
        console.error('Create application error:', err);
        res.status(500).json({ error: 'حدث خطأ في تقديم الطلب' });
    }
});

// PUT /api/applications/:id — update status (accept/reject/pending)
router.put('/:id', async (req, res) => {
    try {
        const { status, has_offer, offer_position, offer_salary, offer_start_date, offer_duration, offer_benefits } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'الحالة مطلوبة' });
        }
        await dbRun(
            'UPDATE applications SET status = ?, has_offer = COALESCE(?, has_offer), offer_position = COALESCE(?, offer_position), offer_salary = COALESCE(?, offer_salary), offer_start_date = COALESCE(?, offer_start_date), offer_duration = COALESCE(?, offer_duration), offer_benefits = COALESCE(?, offer_benefits) WHERE id = ?',
            [status, has_offer, offer_position, offer_salary, offer_start_date, offer_duration, offer_benefits, req.params.id]
        );
        res.json({ message: 'تم تحديث حالة الطلب' });
    } catch (err) {
        console.error('Update application error:', err);
        res.status(500).json({ error: 'حدث خطأ في تحديث الطلب' });
    }
});

module.exports = router;
