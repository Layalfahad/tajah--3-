const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tajah.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// ── Promisified helpers ─────────────────────────────────────────────────────
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// ── Schema initialization ───────────────────────────────────────────────────
async function initSchema() {
    await dbRun(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('player','club','admin')),
        name TEXT,
        name_en TEXT,
        email TEXT,
        phone TEXT,
        city TEXT,
        sport TEXT,
        position TEXT,
        age INTEGER,
        university TEXT,
        bio TEXT,
        weight REAL,
        height REAL,
        seasons INTEGER,
        avatar TEXT,
        profile_pic TEXT,
        overall_rating REAL,
        points_per_game REAL,
        assists_per_game REAL,
        rebounds_per_game REAL,
        speed REAL,
        preferences TEXT,
        club_initial TEXT,
        club_color TEXT,
        level TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        club_id INTEGER,
        title TEXT,
        description TEXT,
        sport TEXT,
        position TEXT,
        city TEXT,
        salary TEXT,
        duration TEXT,
        benefits TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(club_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        opportunity_id INTEGER,
        player_id INTEGER,
        club_name TEXT,
        club_city TEXT,
        sport TEXT,
        position TEXT,
        applied_date TEXT,
        status TEXT DEFAULT 'pending',
        has_offer INTEGER DEFAULT 0,
        offer_position TEXT,
        offer_salary TEXT,
        offer_start_date TEXT,
        offer_duration TEXT,
        offer_benefits TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(opportunity_id) REFERENCES opportunities(id),
        FOREIGN KEY(player_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS negotiations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER,
        player_id INTEGER,
        club_id INTEGER,
        offer_salary TEXT,
        counter_salary TEXT,
        counter_note TEXT,
        status TEXT DEFAULT 'pending',
        from_athlete INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(application_id) REFERENCES applications(id),
        FOREIGN KEY(player_id) REFERENCES users(id),
        FOREIGN KEY(club_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS communities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        sport TEXT,
        description TEXT,
        member_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS forum_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        community_id INTEGER,
        user_id INTEGER,
        content TEXT,
        is_anonymous INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(community_id) REFERENCES communities(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS forum_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        content TEXT,
        is_anonymous INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(post_id) REFERENCES forum_posts(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        message TEXT,
        type TEXT,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS newsletter (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_name TEXT NOT NULL,
    skill_type TEXT DEFAULT 'custom',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT DEFAULT 'fa-medal',
        grantor TEXT,
        year TEXT,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
}

// ── Seed data ───────────────────────────────────────────────────────────────
async function seedDatabase() {
    const existing = await dbGet('SELECT COUNT(*) as count FROM users');
    if (existing && existing.count > 0) {
        console.log('Database already seeded, skipping.');
        return;
    }

    console.log('Seeding database with initial data...');

    // ── Users (Players) ────────────────────────────────────────────────────
    await dbRun(`INSERT INTO users (username, password, role, name, name_en, sport, position, age, university, city, seasons, avatar, bio, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['sara', 'demo123', 'player', 'سارة سعد', 'Sara Saad', 'كرة السلة', 'مهاجمة', 21, 'جامعة أم القرى', 'مكة المكرمة', 3, 'س', 'لاعبة كرة سلة شغوفة، تتميز بالسرعة والدقة في التسديد.', 91, 18.4, 5.1, 4.7, 9.2, 168]);

    await dbRun(`INSERT INTO users (username, password, role, name, sport, position, age, university, city, level, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['alya', 'demo123', 'player', 'علياء فارس', 'كرة السلة', 'حارسة مرمى', 20, 'جامعة الملك عبد العزيز', 'جدة', 'متقدمة', 78, 1.2, 4.2, 6.8, 8.1, 172]);

    await dbRun(`INSERT INTO users (username, password, role, name, sport, position, age, university, city, level, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['noura', 'demo123', 'player', 'نورة الحربي', 'كرة السلة', 'وسط', 23, 'جامعة الأميرة نورة', 'الرياض', 'مبتدئة', 74, 12.7, 7.3, 5.2, 8.4, 165]);

    await dbRun(`INSERT INTO users (username, password, role, name, sport, position, age, university, city, level, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['reem', 'demo123', 'player', 'ريم العتيبي', 'كرة السلة', 'حارسة مرمى', 20, 'جامعة الملك سعود', 'الرياض', 'متوسطة', 68, 2.1, 3.8, 7.5, 7.9, 174]);

    await dbRun(`INSERT INTO users (username, password, role, name, sport, position, age, university, city, level, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['hind', 'demo123', 'player', 'هند المطيري', 'كرة السلة', 'مهاجمة', 22, 'جامعة الإمام', 'الرياض', 'متقدمة', 85, 15.9, 4.4, 3.9, 8.8, 170]);

    await dbRun(`INSERT INTO users (username, password, role, name, sport, position, age, university, city, level, overall_rating, points_per_game, assists_per_game, rebounds_per_game, speed, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['lina', 'demo123', 'player', 'لينا الزهراني', 'كرة السلة', 'وسط', 19, 'جامعة طيبة', 'المدينة المنورة', 'مبتدئة', 65, 9.3, 6.1, 4.1, 8.0, 163]);

    // ── Users (Clubs) ──────────────────────────────────────────────────────
    await dbRun(`INSERT INTO users (username, password, role, name, city, club_initial, club_color) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['alahli', 'demo123', 'club', 'نادي الأهلي', 'جدة', 'أ', 'from-[#1E3A5F] to-[#2d5490]']);

    await dbRun(`INSERT INTO users (username, password, role, name, city, club_initial, club_color) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['alhilal', 'demo123', 'club', 'نادي الهلال', 'الرياض', 'ه', 'from-[#1a56db] to-[#3b82f6]']);

    await dbRun(`INSERT INTO users (username, password, role, name, city, club_initial, club_color) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['alittihad', 'demo123', 'club', 'نادي الاتحاد', 'جدة', 'ا', 'from-[#1E1E1D] to-[#3d3d3b]']);

    await dbRun(`INSERT INTO users (username, password, role, name, city, club_initial, club_color) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['alnassr', 'demo123', 'club', 'نادي النصر', 'الرياض', 'ن', 'from-[#b45309] to-[#d97706]']);

    // ── Opportunities ──────────────────────────────────────────────────────
    await dbRun(`INSERT INTO opportunities (club_id, title, description, sport, position, city, salary, duration, benefits, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [7, 'لاعبة أساسية – كرة السلة', 'يبحث نادي الأهلي عن لاعبة كرة سلة موهوبة للانضمام للفريق الأول', 'كرة السلة', 'مهاجمة', 'جدة', '5,000 ريال سعودي / شهرياً', 'موسم كامل (10 أشهر)', 'تأمين طبي كامل، مكافآت أداء، مواصلات مدفوعة', 'open']);

    await dbRun(`INSERT INTO opportunities (club_id, title, description, sport, position, city, salary, duration, benefits, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [8, 'لاعبة كرة سلة', 'نادي الهلال يفتح باب التسجيل للاعبات كرة السلة', 'كرة السلة', 'مهاجمة', 'الرياض', '4,500 ريال سعودي / شهرياً', 'موسم كامل', 'تأمين طبي، بدل سكن', 'open']);

    await dbRun(`INSERT INTO opportunities (club_id, title, description, sport, position, city, salary, duration, benefits, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [10, 'حارسة مرمى', 'نادي النصر يبحث عن حارسة مرمى محترفة', 'كرة السلة', 'حارسة مرمى', 'الرياض', '4,000 ريال سعودي / شهرياً', '6 أشهر', 'تأمين طبي', 'open']);

    // ── Applications ───────────────────────────────────────────────────────
    await dbRun(`INSERT INTO applications (opportunity_id, player_id, club_name, club_city, sport, position, applied_date, status, has_offer, offer_position, offer_salary, offer_start_date, offer_duration, offer_benefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, 1, 'نادي الأهلي', 'جدة', 'كرة السلة', 'مهاجمة', '٢٠٢٦/٠٣/١٥', 'accepted', 1, 'لاعبة أساسية – كرة السلة', '5,000 ريال سعودي / شهرياً', '1 سبتمبر 2026', 'موسم كامل (10 أشهر)', 'تأمين طبي كامل، مكافآت أداء، مواصلات مدفوعة']);

    await dbRun(`INSERT INTO applications (opportunity_id, player_id, club_name, club_city, sport, position, applied_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [2, 1, 'نادي الهلال', 'الرياض', 'كرة السلة', 'مهاجمة', '٢٠٢٦/٠٢/٢٨', 'pending']);

    await dbRun(`INSERT INTO applications (opportunity_id, player_id, club_name, club_city, sport, position, applied_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [null, 1, 'نادي الاتحاد', 'جدة', 'كرة السلة', 'مهاجمة', '٢٠٢٦/٠٢/١٠', 'rejected']);

    await dbRun(`INSERT INTO applications (opportunity_id, player_id, club_name, club_city, sport, position, applied_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [3, 1, 'نادي النصر', 'الرياض', 'كرة السلة', 'مهاجمة', '٢٠٢٦/٠٣/٠٥', 'pending']);

    console.log('Database seeded successfully!');
}

// ── Seed diverse opportunities ──────────────────────────────────────────────
async function seedDiverseOpportunities() {
    // Check if we already have additional opportunities
    const oppCount = await dbGet('SELECT COUNT(*) as count FROM opportunities');
    if (oppCount && oppCount.count >= 10) return; // already have enough

    console.log('Seeding diverse opportunities...');

    const sports = [
        'كرة قدم', 'كرة سلة', 'سباحة', 'ألعاب قوى', 'تنس', 'الريشة الطائرة', 'كرة طائرة', 'كرة اليد', 
        'كرة قدم صالات', 'غطس', 'كرة ماء', 'تنس طاولة', 'إسكواش', 'جري', 'رمي', 'قفز', 'جمباز', 
        'كاراتيه', 'جودو', 'تايكواندو', 'مصارعة', 'ملاكمة', 'فنون قتالية مختلطة', 'فروسية', 
        'ركوب الدراجات', 'سباقات', 'تجديف', 'كانو', 'رفع أثقال', 'كروس فيت', 'بادل', 'غولف', 
        'بولينج', 'رماية', 'شطرنج'
    ];

    const citiesByRegion = {
        'المنطقة الوسطى': ['الرياض', 'الخرج', 'الدرعية', 'المجمعة', 'الدوادمي', 'وادي الدواسر'],
        'المنطقة الغربية': ['جدة', 'مكة المكرمة', 'المدينة المنورة', 'الطائف', 'ينبع', 'رابغ'],
        'المنطقة الشرقية': ['الدمام', 'الخبر', 'الظهران', 'الجبيل', 'الأحساء', 'القطيف', 'حفر الباطن'],
        'المنطقة الجنوبية': ['أبها', 'خميس مشيط', 'بيشة', 'نجران', 'جيزان', 'الباحة'],
        'المنطقة الشمالية': ['تبوك', 'حائل', 'عرعر', 'سكاكا', 'القريات']
    };
    const allCities = Object.values(citiesByRegion).flat();

    const titles = [
        'تجربة أداء احترافية',
        'معسكر تطوير المهارات',
        'البطولة المفتوحة للمواهب',
        'تصفيات النخبة الإقليمية',
        'برنامج استقطاب المواهب النسائية'
    ];

    const positions = [
        'لاعب هجوم',
        'لاعب دفاع',
        'لاعب وسط / صانع لعب',
        'متعدد المراكز',
        'فردي / حرة'
    ];

    const durations = [
        '6 أشهر',
        'موسم كامل (10 أشهر)',
        '3 أشهر مكثفة',
        'برنامج سنوي متكامل'
    ];

    const benefits = [
        'تأمين طبي كامل، مواصلات مدفوعة، مكافآت فوز',
        'سكن مؤمن، رعاية رياضية شاملة، بدل تدريب',
        'برنامج تدريبي دولي، شهادة معتمدة، تجهيزات متكاملة',
        'دعم أكاديمي، إشراف طبي متخصص، فرصة الاحتراف الخارجي'
    ];

    // Seed one opportunity for each sport, rotating through cities, clubs, positions, titles
    const opps = [];
    
    // 1. Seed at least one for each of the 35 sports to guarantee coverage
    sports.forEach((sport, index) => {
        const city = allCities[index % allCities.length];
        const clubId = [7, 8, 9, 10][index % 4];
        const title = `${titles[index % titles.length]} - ${sport}`;
        const pos = positions[index % positions.length];
        const dur = durations[index % durations.length];
        const ben = benefits[index % benefits.length];
        const sal = `${3500 + (index * 250) % 5500} ريال / شهرياً`;
        const desc = `يعلن النادي عن فتح باب التسجيل لفرصة "${sport}" في مدينة ${city}. نبحث عن مواهب نسائية واعدة للانضمام للبرنامج الرياضي الاحترافي والاستعداد للبطولات المحلية والإقليمية.`;
        
        opps.push({
            club_id: clubId,
            title: title,
            description: desc,
            sport: sport,
            position: pos,
            city: city,
            salary: sal,
            duration: dur,
            benefits: ben,
            status: 'open'
        });
    });

    // 2. Seed some duplicate opportunities for popular sports (Football, Basketball, Tennis, Swimming, Padel, Judo, Golf)
    // to have multiple choices in different regions/cities
    const popular = ['كرة قدم', 'كرة سلة', 'سباحة', 'تنس', 'بادل', 'جودو', 'غولف'];
    popular.forEach((sport, index) => {
        // use a different offset for variety
        const cityIndex = (index + 12) % allCities.length;
        const city = allCities[cityIndex];
        const clubId = [7, 8, 9, 10][(index + 2) % 4];
        const title = `معسكر النخبة المطور - ${sport}`;
        const pos = 'متقدم / محترف';
        const dur = 'موسم كامل';
        const ben = 'عقد احترافي، راتب أساسي مرتفع، تأمين طبي فئة A';
        const sal = '8,500 ريال / شهرياً';
        const desc = `معسكر تطويري متقدم وفرصة توقيع عقد رسمي لرياضة ${sport} في ${city}. للفتيات ذوات الخبرة والرغبة في الاحتراف الرياضي التنافسي.`;

        opps.push({
            club_id: clubId,
            title: title,
            description: desc,
            sport: sport,
            position: pos,
            city: city,
            salary: sal,
            duration: dur,
            benefits: ben,
            status: 'open'
        });
    });

    for (const o of opps) {
        await dbRun(
            'INSERT INTO opportunities (club_id, title, description, sport, position, city, salary, duration, benefits, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [o.club_id, o.title, o.description, o.sport, o.position, o.city, o.salary, o.duration, o.benefits, o.status]
        );
    }
    console.log('Seeded ' + opps.length + ' highly diverse opportunities across ' + sports.length + ' sports and ' + allCities.length + ' cities!');
}

// ── Initialize ──────────────────────────────────────────────────────────────
async function initialize() {
    try {
        await initSchema();

        // Seed 22 sports communities if communities table is empty or missing communities
        const commCount = await dbGet('SELECT COUNT(*) as count FROM communities');
        if (!commCount || commCount.count < 22) {
            console.log('Seeding 22 sports communities...');
            await dbRun('DELETE FROM communities');
            await dbRun('DELETE FROM forum_posts');
            await dbRun('DELETE FROM forum_replies');
            const sportsSeed = [
                { slug: "football", name: "مجتمع كرة القدم", description: "مجتمع احترافي للمواهب الكروية وتحسين الأداء التنافسي.", members: 1240 },
                { slug: "basketball", name: "مجتمع كرة السلة", description: "مجتمع لتطوير المهارات الفردية وفهم التكتيك الجماعي.", members: 890 },
                { slug: "volleyball", name: "مجتمع الكرة الطائرة", description: "تطوير استقبال الإرسال والهجوم السريع داخل الملعب.", members: 674 },
                { slug: "tennis", name: "مجتمع التنس", description: "مساحة لتطوير أساليب اللعب الفردي والتحكم بالإيقاع على الملعب.", members: 612 },
                { slug: "padel", name: "مجتمع البادل", description: "مجتمع سريع النمو للمنافسات الزوجية والتكتيكات الحديثة على ملعب البادل.", members: 756 },
                { slug: "badminton", name: "مجتمع ريشة الطائرة", description: "رفع سرعة الاستجابة وتحسين الضربات الذكية في ريشة الطائرة.", members: 498 },
                { slug: "swimming", name: "مجتمع السباحة", description: "مجتمع متقدم لبناء اللياقة المائية وتحسين التكنيك.", members: 820 },
                { slug: "running", name: "مجتمع الجري", description: "خطط موجهة للعداءات لتحسين السرعة والتحمل.", members: 544 },
                { slug: "cycling", name: "مجتمع ركوب الدراجات", description: "مجتمع لعاشقات الدراجات والتدريب الخارجي.", members: 465 },
                { slug: "gymnastics", name: "مجتمع الجمباز", description: "تطوير المرونة والقوة والتوازن عبر تمارين الجمباز الإيقاعي.", members: 380 },
                { slug: "archery", name: "مجتمع الرماية", description: "مجتمع لصقل مهارة التركيز والدقة في رياضة الرماية.", members: 312 },
                { slug: "equestrian", name: "مجتمع الفروسية", description: "تعلّم فنون الفروسية وبناء علاقة احترام مع الخيل.", members: 276 },
                { slug: "taekwondo", name: "مجتمع التايكواندو", description: "تطوير الانضباط والقوة الجسدية عبر فنون التايكواندو.", members: 394 },
                { slug: "yoga", name: "مجتمع اليوغا", description: "مجتمع للتوازن الجسدي والنفسي عبر ممارسة اليوغا الأصيلة.", members: 623 },
                { slug: "karate", name: "مجتمع الكاراتيه", description: "تطوير الانضباط والقوة من خلال فنون الكاراتيه الأصيلة.", members: 430 },
                { slug: "handball", name: "مجتمع كرة اليد", description: "مجتمع لتطوير مهارات كرة اليد والعمل الجماعي داخل الملعب.", members: 510 },
                { slug: "tabletennis", name: "مجتمع تنس الطاولة", description: "مساحة لتطوير ردود الفعل والتحكم الدقيق في تنس الطاولة.", members: 388 },
                { slug: "skating", name: "مجتمع التزلج", description: "مجتمع لعاشقات التزلج وتطوير مهارات التوازن والحركة.", members: 295 },
                { slug: "climbing", name: "مجتمع تسلق الجبال", description: "مجتمع المغامرات الجبلية وبناء القوة والتحمل في الهواء الطلق.", members: 344 },
                { slug: "golf", name: "مجتمع الغولف", description: "مجتمع راقٍ لتطوير دقة الضربة والاستمتاع بملاعب الغولف.", members: 267 },
                { slug: "boxing", name: "مجتمع الملاكمة", description: "تطوير القوة والسرعة والانضباط من خلال رياضة الملاكمة.", members: 360 },
                { slug: "chess", name: "مجتمع الشطرنج الرياضي", description: "مجتمع لصقل مهارات التفكير الاستراتيجي عبر الشطرنج التنافسي.", members: 420 }
            ];
            for (const sp of sportsSeed) {
                await dbRun('INSERT INTO communities (name, sport, description, member_count) VALUES (?, ?, ?, ?)',
                    [sp.name, sp.slug, sp.description, sp.members]);
            }
            // Seed a few initial forum posts and replies for basketball (id: 2)
            await dbRun(`INSERT INTO forum_posts (community_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)`,
                [2, 1, 'مرحباً! هل هناك أحد يتدرب على كرة السلة في جدة؟', 0]);
            await dbRun(`INSERT INTO forum_posts (community_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)`,
                [2, 3, 'أنصح بالتدرب على التسديد من مسافات بعيدة، ساعدني كثيراً!', 1]);

            await dbRun(`INSERT INTO forum_replies (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)`,
                [1, 2, 'أهلاً سارة، أنا أتدرب في ممشى الروضة مساء كل اثنين!', 0]);
            await dbRun(`INSERT INTO forum_replies (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)`,
                [1, null, 'وأنا أيضاً أود الانضمام إليكن كـ لاعبة وسط!', 1]);
        }

        await seedDatabase();

        // Seed achievements if empty
        try {
            const existingAchievements = await dbGet('SELECT COUNT(*) as count FROM user_achievements');
            if (!existingAchievements || existingAchievements.count === 0) {
                console.log('Seeding initial achievements for user 1...');
                await dbRun(`INSERT INTO user_achievements (user_id, title, description, icon, grantor, year) VALUES (?, ?, ?, ?, ?, ?)`,
                    [1, 'بطلة المملكة للناشئات 2025', 'كرة القدم - 18 سنة', 'fa-medal', 'الاتحاد السعودي لكرة القدم', '2025']);
                await dbRun(`INSERT INTO user_achievements (user_id, title, description, icon, grantor, year) VALUES (?, ?, ?, ?, ?, ?)`,
                    [1, 'شهادة تدريب متقدم', 'برنامج تطوير المهارات الرياضية', 'fa-certificate', 'الاتحاد السعودي للرياضة', '2024']);
            }
        } catch (e) {
            console.error('Failed to seed achievements:', e);
        }

        await seedDiverseOpportunities();
    } catch (err) {
        console.error('Database initialization error:', err);
    }
}

initialize();

module.exports = { db, dbRun, dbGet, dbAll };
