const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET /api/users — list all users (optionally filter by role)
router.get('/', async (req, res) => {
    try {
        const { role } = req.query;
        let sql = 'SELECT id, username, role, name, name_en, email, city, sport, position, age, university, bio, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height, level, avatar, club_initial, club_color, created_at FROM users';
        const params = [];
        if (role) {
            sql += ' WHERE role = ?';
            params.push(role);
        }
        const users = await dbAll(sql, params);
        
        const userIds = users.map(u => u.id);
        if (userIds.length > 0) {
            const skills = await dbAll(`SELECT user_id, skill_name FROM user_skills WHERE user_id IN (${userIds.map(()=>'?').join(',')})`, userIds);
            const skillsByUserId = {};
            skills.forEach(s => {
                if (!skillsByUserId[s.user_id]) skillsByUserId[s.user_id] = [];
                skillsByUserId[s.user_id].push(s.skill_name);
            });
            users.forEach(u => {
                u.skills = skillsByUserId[u.id] || [];
            });
        }
        
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب المستخدمين' });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await dbGet(
            'SELECT id, username, role, name, name_en, email, city, sport, position, age, university, bio, weight, seasons, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height, level, avatar, club_initial, club_color, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });
        const skills = await dbAll('SELECT skill_name FROM user_skills WHERE user_id = ?', [req.params.id]);
        user.skills = skills.map(s => s.skill_name);
        res.json(user);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'حدث خطأ' });
    }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const { name, email, phone, city, sport, position, bio, weight, height, age } = req.body;
        await dbRun(
            'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), city = COALESCE(?, city), sport = COALESCE(?, sport), position = COALESCE(?, position), bio = COALESCE(?, bio), weight = COALESCE(?, weight), height = COALESCE(?, height), age = COALESCE(?, age) WHERE id = ?',
            [name, email, phone, city, sport, position, bio, weight, height, age, req.params.id]
        );
        res.json({ message: 'تم تحديث الملف الشخصي بنجاح' });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'حدث خطأ في التحديث' });
    }
});

// POST /api/users/:id/skills
router.post('/:id/skills', async (req, res) => {
    try {
        const { skills } = req.body;
        if (!Array.isArray(skills)) {
            return res.status(400).json({ error: 'skills يجب أن يكون مصفوفة' });
        }
        
        await dbRun('DELETE FROM user_skills WHERE user_id = ?', [req.params.id]);
        
        for (const skill of skills) {
            if (skill && skill.trim()) {
                await dbRun('INSERT INTO user_skills (user_id, skill_name) VALUES (?, ?)', [req.params.id, skill.trim()]);
            }
        }
        
        res.json({ message: 'تم حفظ المهارات بنجاح', skills });
    } catch (err) {
        console.error('Update skills error:', err);
        res.status(500).json({ error: 'حدث خطأ في تحديث المهارات' });
    }
});

// GET /api/users/:id/achievements
router.get('/:id/achievements', async (req, res) => {
    try {
        const achievements = await dbAll(
            'SELECT id, user_id, title, description, icon, grantor, year, file_path, created_at FROM user_achievements WHERE user_id = ? ORDER BY id DESC',
            [req.params.id]
        );
        res.json(achievements);
    } catch (err) {
        console.error('Get achievements error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب الإنجازات' });
    }
});

// POST /api/users/:id/achievements
router.post('/:id/achievements', async (req, res) => {
    try {
        const { title, description, icon, grantor, year, file_data, file_name } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'عنوان الإنجاز مطلوب' });
        }

        let filePath = null;
        if (file_data) {
            const fs = require('fs');
            const path = require('path');
            
            // Ensure parent directory exists in tajah/uploads/achievements
            const dir = path.join(__dirname, '..', '..', 'uploads', 'achievements');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // Parse the base64 string
            const matches = file_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let base64Content = file_data;
            if (matches && matches.length === 3) {
                base64Content = matches[2];
            }
            
            const buffer = Buffer.from(base64Content, 'base64');
            const fileNameToSave = `${Date.now()}_${file_name || 'certificate.pdf'}`;
            const absolutePath = path.join(dir, fileNameToSave);
            fs.writeFileSync(absolutePath, buffer);
            filePath = `/uploads/achievements/${fileNameToSave}`;
        }

        const result = await dbRun(
            'INSERT INTO user_achievements (user_id, title, description, icon, grantor, year, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.id, title, description, icon || 'fa-medal', grantor, year, filePath]
        );

        res.status(201).json({
            id: result.lastID,
            user_id: Number(req.params.id),
            title,
            description,
            icon: icon || 'fa-medal',
            grantor,
            year,
            file_path: filePath
        });
    } catch (err) {
        console.error('Create achievement error:', err);
        res.status(500).json({ error: 'حدث خطأ في إضافة الإنجاز' });
    }
});

module.exports = router;
