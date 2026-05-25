/**
 * Tajah – Shared Mock Data (Seed State)
 * ─────────────────────────────────────
 * This file defines the INITIAL data for the entire prototype.
 * It is consumed by store.js to seed sessionStorage on first load.
 * Do NOT mutate these objects directly — all mutations go through TajahStore.
 */

const TAJAH_INITIAL = {

  // ── Which user is active ──────────────────────────────────────────────────
  // Set by index.html when the user picks a role
  activeRole: null, // 'athlete' | 'club'

  // ── Athlete profile (سارة سعد) ────────────────────────────────────────────
  athlete: {
    id: 'sara',
    name: 'سارة سعد',
    nameEn: 'Sara Saad',
    sport: 'كرة السلة',
    position: 'مهاجمة',
    age: 21,
    university: 'جامعة أم القرى',
    city: 'مكة المكرمة',
    seasons: 3,
    avatar: 'س',
    bio: 'لاعبة كرة سلة شغوفة، تتميز بالسرعة والدقة في التسديد. تسعى للاحتراف في دوري كرة السلة السعودي للسيدات.',
    stats: {
      pointsPerGame: 18.4,
      assistsPerGame: 5.1,
      reboundsPerGame: 4.7,
      speed: 9.2,         // out of 10
      height: 168,        // cm
      overallRating: 91,  // out of 100
    }
  },

  // ── Athlete's sent applications (طلباتي) ──────────────────────────────────
  applications: [
    {
      id: 1,
      club: 'نادي الأهلي',
      city: 'جدة',
      sport: 'كرة السلة',
      position: 'مهاجمة',
      appliedDate: '٢٠٢٦/٠٣/١٥',
      status: 'accepted',   // 'pending' | 'accepted' | 'rejected'
      hasOffer: true,
      clubInitial: 'أ',
      clubColor: 'from-[#1E3A5F] to-[#2d5490]',
      offer: {
        position: 'لاعبة أساسية – كرة السلة',
        salary: '5,000 ريال سعودي / شهرياً',
        startDate: '1 سبتمبر 2026',
        duration: 'موسم كامل (10 أشهر)',
        benefits: 'تأمين طبي كامل، مكافآت أداء، مواصلات مدفوعة',
      }
    },
    {
      id: 2,
      club: 'نادي الهلال',
      city: 'الرياض',
      sport: 'كرة السلة',
      position: 'مهاجمة',
      appliedDate: '٢٠٢٦/٠٢/٢٨',
      status: 'pending',
      hasOffer: false,
      clubInitial: 'ه',
      clubColor: 'from-[#1a56db] to-[#3b82f6]',
      offer: null,
    },
    {
      id: 3,
      club: 'نادي الاتحاد',
      city: 'جدة',
      sport: 'كرة السلة',
      position: 'مهاجمة',
      appliedDate: '٢٠٢٦/٠٢/١٠',
      status: 'rejected',
      hasOffer: false,
      clubInitial: 'ا',
      clubColor: 'from-[#1E1E1D] to-[#3d3d3b]',
      offer: null,
    },
    {
      id: 4,
      club: 'نادي النصر',
      city: 'الرياض',
      sport: 'كرة السلة',
      position: 'مهاجمة',
      appliedDate: '٢٠٢٦/٠٣/٠٥',
      status: 'pending',
      hasOffer: false,
      clubInitial: 'ن',
      clubColor: 'from-[#b45309] to-[#d97706]',
      offer: null,
    },
  ],

  // ── Club: Candidates being judged (judging-panel + compare) ───────────────
  candidates: [
    {
      id: 1,
      name: 'علياء فارس',
      age: 20,
      position: 'حارسة مرمى',
      level: 'متقدمة',
      university: 'جامعة الملك عبد العزيز',
      city: 'جدة',
      reviewed: true,
      hasPhoto: false,
      stats: {
        pointsPerGame: 1.2,
        assistsPerGame: 4.2,
        reboundsPerGame: 6.8,
        speed: 8.1,
        height: 172,
        overallRating: 78,
      }
    },
    {
      id: 2,
      name: 'سارة سعد',
      age: 21,
      position: 'مهاجمة',
      level: 'متقدمة',
      university: 'جامعة أم القرى',
      city: 'مكة المكرمة',
      reviewed: false,
      hasPhoto: true,
      stats: {
        pointsPerGame: 18.4,
        assistsPerGame: 5.1,
        reboundsPerGame: 4.7,
        speed: 9.2,
        height: 168,
        overallRating: 91,
      }
    },
    {
      id: 3,
      name: 'نورة الحربي',
      age: 23,
      position: 'وسط',
      level: 'مبتدئة',
      university: 'جامعة الأميرة نورة',
      city: 'الرياض',
      reviewed: false,
      hasPhoto: true,
      stats: {
        pointsPerGame: 12.7,
        assistsPerGame: 7.3,
        reboundsPerGame: 5.2,
        speed: 8.4,
        height: 165,
        overallRating: 74,
      }
    },
    {
      id: 4,
      name: 'ريم العتيبي',
      age: 20,
      position: 'حارسة مرمى',
      level: 'متوسطة',
      university: 'جامعة الملك سعود',
      city: 'الرياض',
      reviewed: false,
      hasPhoto: true,
      stats: {
        pointsPerGame: 2.1,
        assistsPerGame: 3.8,
        reboundsPerGame: 7.5,
        speed: 7.9,
        height: 174,
        overallRating: 68,
      }
    },
    {
      id: 5,
      name: 'هند المطيري',
      age: 22,
      position: 'مهاجمة',
      level: 'متقدمة',
      university: 'جامعة الإمام',
      city: 'الرياض',
      reviewed: false,
      hasPhoto: false,
      stats: {
        pointsPerGame: 15.9,
        assistsPerGame: 4.4,
        reboundsPerGame: 3.9,
        speed: 8.8,
        height: 170,
        overallRating: 85,
      }
    },
    {
      id: 6,
      name: 'لينا الزهراني',
      age: 19,
      position: 'وسط',
      level: 'مبتدئة',
      university: 'جامعة طيبة',
      city: 'المدينة المنورة',
      reviewed: false,
      hasPhoto: true,
      stats: {
        pointsPerGame: 9.3,
        assistsPerGame: 6.1,
        reboundsPerGame: 4.1,
        speed: 8.0,
        height: 163,
        overallRating: 65,
      }
    },
  ],

  // ── Club: Judging panel members ───────────────────────────────────────────
  panelMembers: [
    { id: 0, name: 'أنت',            role: 'مشرف (Admin)',   status: 'reviewing' },
    { id: 1, name: 'محكم #1',    role: 'المدربة الرئيسية', status: 'reviewing' },
    { id: 2, name: 'محكم #2',     role: 'مدير الأكاديمية',  status: 'done'      },
    { id: 3, name: 'محكم #3',  role: 'محكمة خارجية',     status: 'reviewing' },
    { id: 4, name: 'محكم #4',    role: 'مسؤولة اللياقة',   status: 'done'      },
  ],

  // ── Club: Pre-simulated votes (محكم #3 و #5 already voted) ───────────────
  preSimulatedVotes: {
    judge2: { 1: 'reject', 2: 'accept', 3: 'reject', 4: 'reject', 5: 'reject', 6: 'reject' },
    judge4: { 1: 'reject', 2: 'accept', 3: 'accept', 4: 'reject', 5: 'reject', 6: 'accept' },
  },

  // ── Club: User's own decisions (filled as they judge) ─────────────────────
  // { candidateId: 'accept' | 'reject' }
  decisions: {},

  // ── Star ratings per session ──────────────────────────────────────────────
  // { criterionKey: 1-5 }
  ratings: {},

  // ── Which candidate the club selected to negotiate with ───────────────────
  selectedCandidateId: null,

  // ── Which candidates are shortlisted for comparison ───────────────────────
  // Array of candidate IDs (max 3)
  shortlist: [],

  // ── Active offer being negotiated ────────────────────────────────────────
  currentOffer: {
    athleteId: 2,
    athleteName: 'سارة سعد',
    clubName: 'نادي الأهلي',
    position: 'لاعبة أساسية – كرة السلة',
    salary: '5,000',
    salaryCurrency: 'ريال سعودي / شهرياً',
    startDate: '1 سبتمبر 2026',
    duration: 'موسم كامل (10 أشهر)',
    benefits: 'تأمين طبي كامل، مكافآت أداء، مواصلات مدفوعة',
    status: 'pending',  // 'pending' | 'countered' | 'accepted' | 'rejected'
    counterSalary: null,
    counterNote: '',
    fromAthlete: false,
  },

  // ── OTP (Wizard of Oz — any 6-digit code is valid for demo) ──────────────
  otpCode: '147258',  // the "displayed" sent code — not actually validated strictly

  // ── Contract state ────────────────────────────────────────────────────────
  contractSigned: false,
  contractSignedAt: null,

  // ── Negotiation flow step tracking ────────────────────────────────────────
  // Tracks which step of the athlete acceptance flow the user is on
  acceptanceStep: null, // null | 'otp' | 'terms' | 'verification' | 'contract'
};
