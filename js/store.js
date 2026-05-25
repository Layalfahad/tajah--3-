/**
 * Tajah – Reactive Session Store
 * ────────────────────────────────
 * A thin sessionStorage wrapper that gives every page a shared, mutable
 * state that persists across page navigations within the same demo session.
 *
 * Usage (in any HTML page — after loading mockData.js and store.js):
 *
 *   TajahStore.get('applications')           → returns the array
 *   TajahStore.set('applications', newArr)   → replaces and saves
 *   TajahStore.update('applications', fn)    → fn receives current value, returns new value
 *   TajahStore.reset()                       → wipes state, re-seeds from mockData
 *
 * IMPORTANT: Load mockData.js BEFORE store.js in every <script> block.
 */

const TajahStore = (() => {
  const STORAGE_KEY = 'tajah_state_v1';

  // ── Internal helpers ──────────────────────────────────────────────────────

  function _load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[TajahStore] Failed to parse state:', e);
      return null;
    }
  }

  function _save(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[TajahStore] Failed to save state:', e);
    }
  }

  // Deep clone the seed data so mutations never affect TAJAH_INITIAL
  function _seed() {
    return JSON.parse(JSON.stringify(TAJAH_INITIAL));
  }

  // ── Public API ────────────────────────────────────────────────────────────

  return {

    /**
     * Must be called once at the top of each page's <script>.
     * Seeds from mockData.js if sessionStorage is empty.
     * Safe to call multiple times — won't overwrite existing state.
     */
    init() {
      if (!_load()) {
        _save(_seed());
        console.info('[TajahStore] State seeded from mockData.js');
      }
    },

    /**
     * Get a top-level key, or the entire state if no key given.
     * Returns a copy — you cannot mutate state by modifying the return value.
     */
    get(key) {
      const state = _load();
      if (!state) { this.init(); return this.get(key); }
      return key !== undefined ? state[key] : state;
    },

    /**
     * Replace a top-level key entirely.
     * TajahStore.set('applications', updatedArr)
     */
    set(key, value) {
      const state = _load() || _seed();
      state[key] = value;
      _save(state);
    },

    /**
     * Apply a transformation function to a key.
     * The function receives the current value and returns the new value.
     *
     * Example:
     *   TajahStore.update('applications', apps =>
     *     apps.map(a => a.id === 3 ? { ...a, status: 'rejected' } : a)
     *   );
     */
    update(key, fn) {
      const state = _load() || _seed();
      state[key] = fn(state[key]);
      _save(state);
    },

    /**
     * Wipe all state and re-seed from mockData.js.
     * Useful for a "reset demo" button or the start of a new demo run.
     */
    reset() {
      sessionStorage.removeItem(STORAGE_KEY);
      _save(_seed());
      console.info('[TajahStore] State reset to initial seed.');
    },

    // ── Convenience methods (domain-specific helpers) ──────────────────────

    /** Get a single candidate by ID */
    getCandidate(id) {
      return (this.get('candidates') || []).find(c => c.id === id) || null;
    },

    /** Get a single application by ID */
    getApplication(id) {
      return (this.get('applications') || []).find(a => a.id === id) || null;
    },

    /** Mark a candidate as reviewed and record the decision */
    recordDecision(candidateId, decision) {
      // Mark reviewed
      this.update('candidates', list =>
        list.map(c => c.id === candidateId ? { ...c, reviewed: true } : c)
      );
      // Save decision
      this.update('decisions', d => ({ ...d, [candidateId]: decision }));
    },

    /** Update an application's status */
    updateApplicationStatus(id, status, extra = {}) {
      this.update('applications', list =>
        list.map(a => a.id === id ? { ...a, status, ...extra } : a)
      );
    },

    /** Add candidate to shortlist for comparison (max 3) */
    addToShortlist(candidateId) {
      this.update('shortlist', list => {
        if (list.includes(candidateId)) return list;
        return [...list, candidateId].slice(-3); // keep max 3
      });
    },

    removeFromShortlist(candidateId) {
      this.update('shortlist', list => list.filter(id => id !== candidateId));
    },

    /** Compute application counts by status — used by athlete-requests.html */
    getApplicationCounts() {
      const apps = this.get('applications') || [];
      return {
        total:    apps.length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        pending:  apps.filter(a => a.status === 'pending').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
      };
    },

    /** Sync candidates from database (role = player) */
    async syncCandidatesWithDB() {
      try {
        const API = typeof window.API !== 'undefined' ? window.API : 'http://localhost:3000';
        const res = await fetch(`${API}/api/users`);
        if (!res.ok) return false;
        const dbUsers = await res.json();
        const players = dbUsers.filter(u => u.role === 'player').map((u, i) => ({
          id: u.id,
          name: u.name || u.username,
          age: u.age || 20,
          position: u.position || 'حارسة مرمى',
          level: u.level || 'مبتدئة',
          university: u.university || '',
          city: u.city || 'الرياض',
          reviewed: false,
          hasPhoto: false,
          stats: {
            overallRating: u.overall_rating || (85 - (i % 10)),
            pointsPerGame: u.points_per_game || 10,
            speed: u.speed || 80,
            reboundsPerGame: u.rebounds_per_game || 5,
            assistsPerGame: u.assists_per_game || 5,
            height: u.height || 165,
            weight: 60
          }
        }));
        if (players.length > 0) {
          // Preserve existing reviewed/decision state if we want, or just overwrite
          // To be safe, just overwrite
          this.set('candidates', players);
          return true;
        }
        return false;
      } catch (e) {
        console.warn('[TajahStore] Failed to sync candidates with DB:', e);
        return false;
      }
    },
  };
})();
