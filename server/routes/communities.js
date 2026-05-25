const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET /api/communities
router.get('/', async (req, res) => {
    try {
        const communities = await dbAll('SELECT * FROM communities ORDER BY member_count DESC');
        res.json(communities);
    } catch (err) {
        console.error('Get communities error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب المجتمعات' });
    }
});

// GET /api/communities/by-sport/:sport
router.get('/by-sport/:sport', async (req, res) => {
    try {
        const community = await dbGet('SELECT * FROM communities WHERE sport = ?', [req.params.sport]);
        if (!community) {
            return res.status(404).json({ error: 'المجتمع غير موجود' });
        }
        res.json(community);
    } catch (err) {
        console.error('Get community by sport error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب تفاصيل المجتمع' });
    }
});

// POST /api/communities/:id/join
router.post('/:id/join', async (req, res) => {
    try {
        await dbRun('UPDATE communities SET member_count = member_count + 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'تم الانضمام للمجتمع بنجاح' });
    } catch (err) {
        console.error('Join community error:', err);
        res.status(500).json({ error: 'حدث خطأ أثناء الانضمام للمجتمع' });
    }
});

// POST /api/communities/:id/leave
router.post('/:id/leave', async (req, res) => {
    try {
        await dbRun('UPDATE communities SET member_count = CASE WHEN member_count > 0 THEN member_count - 1 ELSE 0 END WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'تم مغادرة المجتمع بنجاح' });
    } catch (err) {
        console.error('Leave community error:', err);
        res.status(500).json({ error: 'حدث خطأ أثناء مغادرة المجتمع' });
    }
});

// POST /api/communities
router.post('/', async (req, res) => {
    try {
        const { name, sport, description } = req.body;
        if (!name) return res.status(400).json({ error: 'اسم المجتمع مطلوب' });
        const result = await dbRun(
            'INSERT INTO communities (name, sport, description) VALUES (?, ?, ?)',
            [name, sport || '', description || '']
        );
        res.status(201).json({ id: result.lastID, message: 'تم إنشاء المجتمع' });
    } catch (err) {
        console.error('Create community error:', err);
        res.status(500).json({ error: 'حدث خطأ' });
    }
});

// GET /api/communities/:id/posts
router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await dbAll(
            'SELECT fp.*, u.name as author_name FROM forum_posts fp LEFT JOIN users u ON fp.user_id = u.id WHERE fp.community_id = ? ORDER BY fp.created_at DESC',
            [req.params.id]
        );
        
        if (posts.length > 0) {
            const postIds = posts.map(p => p.id);
            const placeholders = postIds.map(() => '?').join(',');
            
            const replies = await dbAll(
                `SELECT fr.*, u.name as author_name FROM forum_replies fr LEFT JOIN users u ON fr.user_id = u.id WHERE fr.post_id IN (${placeholders}) ORDER BY fr.created_at ASC`,
                postIds
            );
            
            posts.forEach(post => {
                post.replies = replies.filter(r => r.post_id === post.id);
            });
        } else {
            posts.forEach(post => {
                post.replies = [];
            });
        }
        
        res.json(posts);
    } catch (err) {
        console.error('Get posts error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب المنشورات' });
    }
});

// POST /api/communities/:id/posts
router.post('/:id/posts', async (req, res) => {
    try {
        const { user_id, content, is_anonymous } = req.body;
        if (!content) return res.status(400).json({ error: 'المحتوى مطلوب' });
        const result = await dbRun(
            'INSERT INTO forum_posts (community_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)',
            [req.params.id, user_id || null, content, is_anonymous ? 1 : 0]
        );
        res.status(201).json({ id: result.lastID, message: 'تم نشر المنشور' });
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ error: 'حدث خطأ' });
    }
});

// POST /api/communities/posts/:postId/replies
router.post('/posts/:postId/replies', async (req, res) => {
    try {
        const { user_id, content, is_anonymous } = req.body;
        if (!content) return res.status(400).json({ error: 'محتوى الرد مطلوب' });
        const result = await dbRun(
            'INSERT INTO forum_replies (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)',
            [req.params.postId, user_id || null, content, is_anonymous ? 1 : 0]
        );
        res.status(201).json({ id: result.lastID, message: 'تمت إضافة الرد بنجاح' });
    } catch (err) {
        console.error('Create reply error:', err);
        res.status(500).json({ error: 'حدث خطأ في إضافة الرد' });
    }
});

// DELETE /api/communities/posts/:postId
router.delete('/posts/:postId', async (req, res) => {
    try {
        await dbRun('DELETE FROM forum_replies WHERE post_id = ?', [req.params.postId]);
        const result = await dbRun('DELETE FROM forum_posts WHERE id = ?', [req.params.postId]);
        if (result.changes === 0) return res.status(404).json({ error: 'المنشور غير موجود' });
        res.json({ success: true, message: 'تم حذف المنشور بنجاح' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف المنشور' });
    }
});

// DELETE /api/communities/replies/:replyId
router.delete('/replies/:replyId', async (req, res) => {
    try {
        const result = await dbRun('DELETE FROM forum_replies WHERE id = ?', [req.params.replyId]);
        if (result.changes === 0) return res.status(404).json({ error: 'الرد غير موجود' });
        res.json({ success: true, message: 'تم حذف الرد بنجاح' });
    } catch (err) {
        console.error('Delete reply error:', err);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الرد' });
    }
});

module.exports = router;
