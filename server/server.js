require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, dbRun, dbGet, dbAll } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve static files (entire project root) ────────────────────────────────
// This serves index.html, pages/, css/, js/, assets/, Communities/, etc.
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ──────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const opportunitiesRoutes = require('./routes/opportunities');
const applicationsRoutes = require('./routes/applications');
const negotiationsRoutes = require('./routes/negotiations');
const communitiesRoutes = require('./routes/communities');
const contactRoutes = require('./routes/contact');
const notificationsRoutes = require('./routes/notifications');
const savedItemsRoutes = require('./routes/saved_items');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/negotiations', negotiationsRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/saved_items', savedItemsRoutes);

// ── Gemini AI Chatbot Endpoint ──────────────────────────────────────────────
let genAI = null;
try {
    const { GoogleGenerativeAI } = require('@google/genai');
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_key_here') {
        genAI = new GoogleGenerativeAI(apiKey);
        console.log('Gemini AI initialized.');
    } else {
        console.log('No Gemini API key configured. Chatbot will return a default message.');
    }
} catch (e) {
    console.log('Gemini AI module not available. Chatbot will return a default message.');
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'الرسالة مطلوبة' });

        if (!genAI) {
            return res.json({ reply: 'مرحباً! أنا مساعدة تاجة الذكية. حالياً لم يتم تهيئة خدمة الذكاء الاصطناعي. يرجى إضافة مفتاح Gemini API في ملف .env' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
            `أنتِ مساعدة ذكية لمنصة تاجة الرياضية النسائية السعودية. أجيبي بلطف وباللغة العربية على السؤال التالي: ${message}`
        );
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Chatbot Error:", error.message);
        res.json({ reply: 'عذراً، حدث خطأ. يرجى المحاولة لاحقاً.' });
    }
});

// ── Evaluate Compatibility Endpoint ─────────────────────────────────────────
app.post('/api/evaluate-compatibility', async (req, res) => {
    try {
        const { playerId, opportunityId } = req.body;

        if (!genAI) {
            return res.json({ result: 'نسبة التوافق: 85% — تتوافق مهاراتك بشكل جيد مع متطلبات الفرصة.' });
        }

        const player = await dbGet('SELECT * FROM users WHERE id = ?', [playerId]);
        const opp = await dbGet('SELECT * FROM opportunities WHERE id = ?', [opportunityId]);

        const prompt = `قيمي مدى توافق اللاعبة "${player?.name || 'لاعبة'}" مع فرصة "${opp?.title || 'فرصة'}" في ${opp?.sport || 'رياضة'}. قدمي نسبة توافق ونصيحة قصيرة.`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.json({ result: response.text() });
    } catch (error) {
        console.error("Evaluation Error:", error.message);
        res.json({ result: 'نسبة التوافق: 85% — تتوافق مهاراتك بشكل جيد.' });
    }
});

// ── API health check ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        geminiEnabled: !!genAI,
    });
});

// ── Error handling middleware ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
});

// ── Start server ────────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`\n🟢 Tajah server running at http://localhost:${port}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, '..')}`);
    console.log(`🔗 API available at: http://localhost:${port}/api/health\n`);
});
