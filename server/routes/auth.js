const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, name, email, phone, city, sport, age, weight } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور والدور مطلوبين' });
        }
        const existing = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
        if (existing) {
            return res.status(409).json({ error: 'اسم المستخدم مستخدم بالفعل' });
        }
        const result = await dbRun(
            'INSERT INTO users (username, password, role, name, email, phone, city, sport, age, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [username, password, role, name || '', email || '', phone || '', city || '', sport || '', age || null, weight || null]
        );
        res.status(201).json({ id: result.lastID, message: 'تم إنشاء الحساب بنجاح' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'حدث خطأ في التسجيل' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'اسم المستخدم وكلمة المرور مطلوبين' });
        }
        const user = await dbGet('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (!user) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }
        const { password: _, ...safeUser } = user;
        res.json({ user: safeUser, message: 'تم تسجيل الدخول بنجاح' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'حدث خطأ في تسجيل الدخول' });
    }
});

module.exports = router;
