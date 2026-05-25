/**
 * Tajah Auth & Navbar Manager
 * ----------------------------
 * - Checks login state via sessionStorage
 * - Swaps navbar between pre-login / post-login mode
 * - Protects pages that require authentication
 * - Provides toggleDropdown(), toggleDrawer(), closeAll()
 */
(function () {
  'use strict';

  // ── Apply theme instantly from localStorage ──
  var savedTheme = localStorage.getItem('tajah-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // ── Inject global dark mode overrides CSS ──
  if (!document.getElementById('global-dark-mode-css')) {
    var link = document.createElement('link');
    link.id = 'global-dark-mode-css';
    link.rel = 'stylesheet';
    // If the current path contains /pages/ or /Communities/, go up one level
    var inSubdir = window.location.pathname.toLowerCase().includes('/pages/') || window.location.pathname.toLowerCase().includes('/communities/');
    link.href = inSubdir ? '../css/dark-mode.css' : './css/dark-mode.css';
    document.head.appendChild(link);
  }

  // ── Public pages (accessible without login) ──
  var PUBLIC_PAGES = [
    'landingpag.html', 'about.html', 'contact.html', 'join.html',
    'player-login.html', 'club-login.html', 'player-register.html',
    'nafath-login.html', 'otp-verify.html', 'club-select.html', 'login-select.html',
    'create-club.html', 'create-manager.html', 'create-security.html',
    'player-basic-info.html', 'player-preferences.html',
    'privacy.html', 'terms.html', 'verification.html',
    'index.html', ''
  ];

  var inCommunities = window.location.pathname.toLowerCase().indexOf('/communities/') !== -1;
  var pathPrefix = inCommunities ? '../pages/' : '';
  var commPrefix = inCommunities ? '' : '../Communities/';

  var currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  var isPublic = PUBLIC_PAGES.indexOf(currentPage) !== -1;
  if (inCommunities) {
    isPublic = false;
  }
  var isLoggedIn = sessionStorage.getItem('tajah_logged_in') === 'true';

  // ── Redirect protected pages to login ──
  if (!isPublic && !isLoggedIn) {
    // Don't redirect if already on a public page
    window.location.href = pathPrefix + 'join.html';
    return;
  }

  // ── Build the pre-login navbar links (right side = auth buttons) ──
  var PRE_LOGIN_RIGHT = '' +
    '<div class="hidden lg:flex items-center gap-2">' +
      '<a class="inline-flex h-9 items-center justify-center rounded-tj-btn border border-tj-primary px-5 text-sm font-semibold text-tj-primary transition hover:bg-tj-primary-surface" href="' + pathPrefix + 'login-select.html">تسجيل الدخول</a>' +
      '<a class="inline-flex h-9 items-center justify-center gap-1.5 rounded-tj-btn bg-tj-primary px-5 text-sm font-semibold text-tj-text-on-primary shadow-[0_10px_24px_-6px_rgba(182,112,255,0.55)] transition hover:bg-tj-primary-hover active:bg-tj-primary-pressed" href="' + pathPrefix + 'join.html">انضمي الآن</a>' +
    '</div>';

// 1. Keep your HTML string static and clean
var PRE_LOGIN_NAV = '' +
  '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'landingPag.html">الرئيسية</a>' +
  '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'about.html">عن تاجة</a>' +
  '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'contact.html">تواصل معنا</a>' +
  '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'landingPag.html#faq">الأسئلة الشائعة</a>';

// 2. Strict function to manage active states based on URL and hash
function applyActiveNavbarStyles() {
  var currentPath = window.location.pathname;
  var currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'landingPag.html';
  var currentHash = window.location.hash;

  var links = document.querySelectorAll('.nav-link');

  links.forEach(function(link) {
    // 1. FORCE REMOVE any problematic inline background styles completely
    link.style.background = ''; 
    link.style.backgroundColor = '';

    // 2. Reset ALL buttons to default unclicked class states
    link.classList.remove('nav-link-active', 'bg-[#f6ebff]', 'text-[#b670ff]');
    link.classList.add('text-tj-text-secondary', 'bg-white');

    var href = link.getAttribute('href') || '';

    // 3. Strict active element allocation
    if (currentPage === 'landingPag.html' && currentHash === '#faq') {
      if (href.endsWith('landingPag.html#faq')) {
        link.classList.add('nav-link-active', 'bg-[#f6ebff]', 'text-[#b670ff]');
        link.classList.remove('text-tj-text-secondary', 'bg-white');
      }
    } else {
      if (href.endsWith(currentPage) && !href.includes('#faq')) {
        link.classList.add('nav-link-active', 'bg-[#f6ebff]', 'text-[#b670ff]');
        link.classList.remove('text-tj-text-secondary', 'bg-white');
      }
    }
  });
}




// 3. Listeners to run the code safely
window.addEventListener('hashchange', applyActiveNavbarStyles);

// Run after a tiny delay to ensure your HTML injection script has finished placing the DOM elements
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(applyActiveNavbarStyles, 150);
});


  // ── If NOT logged in, swap navbar to pre-login mode ──
  if (!isLoggedIn) {
    // Hide profile dropdown area and notification bell
    var profileDiv = document.getElementById('profileBtn');
    if (profileDiv) {
      var profileWrapper = profileDiv.closest('.relative');
      if (profileWrapper) profileWrapper.style.display = 'none';
    }

    // Hide notification bell (the button with aria-label الإشعارات)
    var bellBtn = document.querySelector('button[aria-label="الإشعارات"]');
    if (bellBtn) bellBtn.style.display = 'none';

    // Replace left auth area with login/register buttons
    var authArea = document.querySelector('.flex.flex-1.items-center.justify-start');
    if (authArea) {
      // Keep hamburger, replace profile stuff
      var hamburger = authArea.querySelector('.lg\\:hidden, [id="hamBtn"]');
      var hamburgerHTML = hamburger ? hamburger.outerHTML : '';
      authArea.innerHTML = PRE_LOGIN_RIGHT + hamburgerHTML;
    }

    // Replace center nav links
    var centerNav = document.querySelector('header nav.hidden.lg\\:flex');
    if (centerNav) {
      centerNav.innerHTML = PRE_LOGIN_NAV;
    }
  }

  // ── If logged in, dynamically adjust header based on role (player vs club/scout) ──
  if (isLoggedIn) {
    var user = null;
    try {
      user = JSON.parse(sessionStorage.getItem('tajah_user'));
    } catch(e) {}
    
    var isClub = user && (user.type === 'club' || user.role === 'club' || user.role === 'scout');
    var name = (user && user.name) || (isClub ? 'أحلام' : 'مرام');
    
    // Redirect player if trying to access negotiations.html
    if (currentPage === 'negotiations.html' && !isClub) {
      window.location.href = pathPrefix + 'PlayerHomepage.html';
      return;
    }

    // Set greeting name and letter in the main profile button
    var profileNameEl = document.querySelector('#profileBtn p.text-tj-text');
    if (profileNameEl) {
      profileNameEl.textContent = 'مرحباً، ' + name + '!';
    }
    
    var avatarEl = document.querySelector('#profileBtn div.rounded-full');
    if (avatarEl) {
      avatarEl.textContent = name.charAt(0);
    }
    
    // Set greeting name and letter in the dropdown
    var dropdownNameEl = document.querySelector('#dropdown p.text-sm.font-semibold.text-tj-text, #dropdown p.text-sm.font-semibold');
    if (dropdownNameEl) {
      dropdownNameEl.textContent = name;
    }
    
    var dropdownTitleEl = document.querySelector('#dropdown p.text-xs.text-tj-text-tertiary, #dropdown p.text-xs');
    if (dropdownTitleEl) {
      dropdownTitleEl.textContent = isClub ? 'مسجّل كـ نادي' : 'مسجّل كـ لاعبة';
    }

    // Set mobile drawer header greeting/avatar if drawer exists
    var drawerAvatarEl = document.querySelector('#drawer div.rounded-full, #mobile-drawer div.rounded-full');
    if (drawerAvatarEl) {
      drawerAvatarEl.textContent = name.charAt(0);
    }
    var drawerNameEl = document.querySelector('#drawer p.text-sm.font-semibold, #mobile-drawer p.text-sm.font-semibold');
    if (drawerNameEl) {
      drawerNameEl.textContent = 'مرحباً، ' + name + '!';
    }

    var centerNav = document.querySelector('header nav.hidden.lg\\:flex');
    var drawerNav = document.querySelector('#drawer nav, #mobile-drawer nav');
    var profileLink = document.querySelector('#drawer .px-4.pt-3.pb-1 a, #mobile-drawer .px-4.pt-3.pb-1 a');
    var dropdownProfileLink = document.querySelector('#dropdown a[href*="stats"], #dropdown a[href*="player_profile"], #dropdown a[href*="club"]');

    if (isClub) {
      // 1. Desktop Nav for Club/Scout
      if (centerNav) {
        centerNav.innerHTML = '' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'scoutHomepage.html">الرئيسية</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'searchScout.html">البحث</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'compare.html">مقارنة</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'judging-panel.html">طاولة التحكيم</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'contact.html">تواصل معنا</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'about.html">عن تاجة</a>';
      }

      // 2. Dropdown Profile link to club profile
      if (dropdownProfileLink) {
        dropdownProfileLink.setAttribute('href', pathPrefix + 'club-own-profile.html');
        dropdownProfileLink.innerHTML = '<svg class="w-4 h-4 text-tj-text-tertiary group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"></path></svg> ملف النادي';
      }

      // 3. Mobile Drawer profile link
      if (profileLink) {
        profileLink.setAttribute('href', pathPrefix + 'club-own-profile.html');
        var profileSpan = profileLink.querySelector('span');
        if (profileSpan) {
          profileSpan.textContent = 'ملف النادي';
        }
        var profileSvg = profileLink.querySelector('svg');
        if (profileSvg) {
          profileSvg.outerHTML = '<svg class="w-4 h-4 text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        }
      }

      // 4. Mobile Drawer navigation links
      if (drawerNav) {
        drawerNav.innerHTML = '' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'scoutHomepage.html">' +
            '<span>الرئيسية</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'searchScout.html">' +
            '<span>البحث</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'compare.html">' +
            '<span>مقارنة</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'judging-panel.html">' +
            '<span>طاولة التحكيم</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M14 2L8 8l4 4 6-6-4-4zM5 11L11 17M3 22h10M16 17v5" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'contact.html">' +
            '<span>تواصل معنا</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>';
      }
    } else {
      // 1. Desktop Nav for Player (default logged in links)
      if (centerNav) {
        centerNav.innerHTML = '' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'PlayerHomepage.html">الرئيسية</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + commPrefix + 'index.html">المجتمعات</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'Tajah-search.html">البحث</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'opportunities.html">الفرص</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'applications.html">طلباتي</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'contact.html">تواصل معنا</a>' +
          '<a class="nav-link relative px-3 py-1.5 rounded-tj-btn text-sm font-medium text-tj-text-secondary hover:bg-[#f6ebff] hover:text-[#b670ff] transition-colors whitespace-nowrap" href="' + pathPrefix + 'about.html">عن تاجة</a>';
      }

      // 2. Dropdown Profile link to player profile
      if (dropdownProfileLink) {
        dropdownProfileLink.setAttribute('href', pathPrefix + 'player_profile.html');
        dropdownProfileLink.innerHTML = '<svg class="w-4 h-4 text-tj-text-tertiary group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg> الملف الشخصي';
      }

      // 3. Mobile Drawer profile link
      if (profileLink) {
        profileLink.setAttribute('href', pathPrefix + 'player_profile.html');
        var profileSpan = profileLink.querySelector('span');
        if (profileSpan) {
          profileSpan.textContent = 'الملف الشخصي';
        }
        var profileSvg = profileLink.querySelector('svg');
        if (profileSvg) {
          profileSvg.outerHTML = '<svg class="w-4 h-4 text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
        }
      }

      // 4. Mobile Drawer navigation links
      if (drawerNav) {
        drawerNav.innerHTML = '' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'PlayerHomepage.html">' +
            '<span>الرئيسية</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + commPrefix + 'index.html">' +
            '<span>المجتمعات</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM2 19c0-2.76 2.91-5 6.5-5s6.5 2.24 6.5 5M19 8.5A3.5 3.5 0 0 0 15.5 5M22 19c0-2.76-2.91-5-6.5-5" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'Tajah-search.html">' +
            '<span>البحث</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'opportunities.html">' +
            '<span>الفرص</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-tj-primary transition-all group" href="' + pathPrefix + 'applications.html">' +
            '<span>طلباتي</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>' +
          '<a class="flex items-center justify-between rounded-tj-card border border-tj-border bg-tj-surface-card px-4 py-3.5 text-tj-text font-medium text-sm hover:border-tj-primary/30 hover:bg-tj-primary-surface hover:text-[#b670ff] transition-all group" href="' + pathPrefix + 'contact.html">' +
            '<span>تواصل معنا</span>' +
            '<svg class="w-5 h-5 text-tj-text-disabled group-hover:text-tj-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
          '</a>';
      }
    }
  }

  // ── Highlight active nav link ──
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('#')[0].split('?')[0];
    var linkPage = href.split('/').pop().toLowerCase();
    if (linkPage === currentPage) {
      link.classList.add('nav-link-active', 'text-tj-primary', 'font-semibold');
      link.classList.remove('text-tj-text-secondary', 'font-medium');
      link.style.background = '#f6ebff';
    }
  });

  // ── Dropdown toggle (profile menu) ──
  window.toggleDropdown = function () {
    var dd = document.getElementById('dropdown');
    var ch = document.getElementById('chevron');
    if (!dd) return;
    var isOpen = !dd.classList.contains('hidden');
    if (isOpen) {
      dd.classList.add('hidden');
      if (ch) ch.style.transform = 'rotate(0deg)';
    } else {
      dd.classList.remove('hidden');
      if (ch) ch.style.transform = 'rotate(180deg)';
    }
  };

  // ── Mobile drawer toggle ──
  window.toggleDrawer = function () {
    var drawer = document.getElementById('mobile-drawer') || document.getElementById('drawer');
    var overlay = document.getElementById('nav-overlay') || document.getElementById('overlay');
    if (drawer) drawer.classList.toggle('translate-x-full');
    if (drawer) drawer.classList.toggle('open');
    if (overlay) overlay.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  };

  window.closeAll = function () {
    var drawer = document.getElementById('mobile-drawer') || document.getElementById('drawer');
    var overlay = document.getElementById('nav-overlay') || document.getElementById('overlay');
    var dd = document.getElementById('dropdown');
    var ch = document.getElementById('chevron');
    if (drawer) { drawer.classList.add('translate-x-full'); drawer.classList.remove('open'); }
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (dd) dd.classList.add('hidden');
    if (ch) ch.style.transform = 'rotate(0deg)';
  };

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    var btn = document.getElementById('profileBtn');
    var dd = document.getElementById('dropdown');
    if (!btn || !dd) return;
    if (!btn.contains(e.target) && !dd.contains(e.target)) {
      dd.classList.add('hidden');
      var ch = document.getElementById('chevron');
      if (ch) ch.style.transform = 'rotate(0deg)';
    }
  });

  // Close on Escape
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeAll();
  });

  // ── Footer year ──
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Logout handler ──
  // Find logout links (the ones with تسجيل الخروج text)
  document.querySelectorAll('a').forEach(function (a) {
    if (a.textContent.trim().indexOf('تسجيل الخروج') !== -1) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        sessionStorage.removeItem('tajah_logged_in');
        sessionStorage.removeItem('tajah_user');
        window.location.href = 'landingPag.html';
      });
    }
  });

})();
