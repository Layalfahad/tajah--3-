(function () {
  "use strict";

  const apiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

  var LIKE_KEY = "th-communities-liked";
  var COMMENT_KEY = "th-communities-comments";
  var activeFilter = "all";
  var activeSearch = "";

  /* ══════════════════════════════════════
     البيانات الوصفية للرياضات (المظهر والأيقونات)
  ══════════════════════════════════════ */
  const sportMeta = {
    football: { name: "كرة القدم", icon: "fa-futbol", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop", activity: 96, topActivities: ["تحليل مباريات", "تمارين تكتيكية", "بطولة أسبوعية"] },
    basketball: { name: "كرة السلة", icon: "fa-basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop", activity: 95, topActivities: ["تحدي تصويب", "بناء اللعب", "دفاع المنطقة"] },
    volleyball: { name: "الكرة الطائرة", icon: "fa-volleyball", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=400&auto=format&fit=crop", activity: 92, topActivities: ["تدريبات إرسال", "تنسيق الفريق", "مباريات قصيرة"] },
    tennis: { name: "التنس", icon: "fa-circle", image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop", activity: 90, topActivities: ["جلسات إرسال", "لعب خلفي", "تحدي دقة"] },
    padel: { name: "البادل", icon: "fa-table-tennis-paddle-ball", image: "https://images.pexels.com/photos/11038290/pexels-photo-11038290.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 95, topActivities: ["مباريات تنافسية", "تطوير ضربات", "بطولات بادل"] },
    badminton: { name: "ريشة الطائرة", icon: "fa-table-tennis-paddle-ball", image: "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 82, topActivities: ["لعب سريع", "تحسين ردة الفعل", "تدريب فردي"] },
    swimming: { name: "السباحة", icon: "fa-person-swimming", image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 88, topActivities: ["سباحة حرة", "تمارين تنفس", "تدريب متقدم"] },
    running: { name: "الجري", icon: "fa-person-running", image: "https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 92, topActivities: ["تحدي الماراثون", "جري صباحي", "تحمل لياقي"] },
    cycling: { name: "ركوب الدراجات", icon: "fa-person-biking", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop", activity: 88, topActivities: ["رحلات طريق", "تحدي مسافة", "صيانة أساسية"] },
    gymnastics: { name: "الجمباز", icon: "fa-person-falling", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop", activity: 87, topActivities: ["حركات أرضية", "تحدي المرونة", "تدريب الجسم"] },
    archery: { name: "الرماية", icon: "fa-bullseye", image: "https://images.unsplash.com/photo-1511516412963-801b050c92aa?q=80&w=400&auto=format&fit=crop", activity: 85, topActivities: ["تحدي الدقة", "تقنيات التنفس", "مسابقات ودية"] },
    equestrian: { name: "الفروسية", icon: "fa-horse", image: "https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 80, topActivities: ["قفز حواجز", "ركوب الخيل", "ترويض"] },
    taekwondo: { name: "التايكواندو", icon: "fa-person-praying", image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&auto=format&fit=crop", activity: 86, topActivities: ["ضربات الرجلين", "الكتال التكتيكي", "الحزام الملون"] },
    yoga: { name: "اليوغا", icon: "fa-spa", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop", activity: 93, topActivities: ["جلسات التنفس", "تحدي التوازن", "يوغا الصباح"] },
    karate: { name: "الكاراتيه", icon: "fa-hand-fist", image: "https://images.pexels.com/photos/7045748/pexels-photo-7045748.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 87, topActivities: ["كاتا", "دفاع عن النفس", "كوميتيه"] },
    handball: { name: "كرة اليد", icon: "fa-hand", image: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?q=80&w=400&auto=format&fit=crop", activity: 90, topActivities: ["تدريبات التصويب", "تكتيك الدفاع", "مباريات تدريبية"] },
    tabletennis: { name: "تنس الطاولة", icon: "fa-table-tennis-paddle-ball", image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 84, topActivities: ["سرعة رد الفعل", "مباريات ودية", "بطولات مصغرة"] },
    skating: { name: "التزلج", icon: "fa-person-skating", image: "https://images.pexels.com/photos/2005089/pexels-photo-2005089.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 86, topActivities: ["حركات حرة", "تزلج سريع", "تحديات المهارة"] },
    climbing: { name: "تسلق الجبال", icon: "fa-mountain", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=400&auto=format&fit=crop", activity: 87, topActivities: ["تسلق مبتدئ", "تقنيات الحبل", "رحلات ميدانية"] },
    golf: { name: "الغولف", icon: "fa-golf-ball-tee", image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=400&auto=format&fit=crop", activity: 82, topActivities: ["تقنية الضربة", "دروس التوجيه", "جولات ودية"] },
    boxing: { name: "الملاكمة", icon: "fa-boxing-glove", image: "https://images.pexels.com/photos/4753928/pexels-photo-4753928.jpeg?auto=compress&cs=tinysrgb&w=400", activity: 89, topActivities: ["تمارين الكيس", "تقنيات الدفاع", "تدريب اللياقة"] },
    chess: { name: "الشطرنج الرياضي", icon: "fa-chess", image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=400&auto=format&fit=crop", activity: 85, topActivities: ["تحليل المباريات", "تحدي التفكير", "بطولة أسبوعية"] }
  };

  var sports = [];
  var ALL_ACTIVE_MEMBERS = [];

  function getSportBySlug(slug) {
    return sports.find(function (s) { return s.slug === slug; });
  }

  function getComments(slug) {
    try { return JSON.parse(localStorage.getItem(COMMENT_KEY + "-" + slug) || "[]"); }
    catch (e) { return []; }
  }

  function saveComment(slug, text) {
    var all = getComments(slug);
    var nextId = all.length ? Math.max.apply(null, all.map(function (c) { return c.id; })) + 1 : 1;
    all.push({
      id: nextId,
      text: text,
      time: "الآن",
      status: "active"
    });
    localStorage.setItem(COMMENT_KEY + "-" + slug, JSON.stringify(all));
    addPoints("comment", slug);
  }

  function likedSet() {
    try { return new Set(JSON.parse(localStorage.getItem(LIKE_KEY) || "[]")); }
    catch (e) { return new Set(); }
  }

  function saveLiked(set) {
    localStorage.setItem(LIKE_KEY, JSON.stringify(Array.from(set)));
  }

  function commentItemHTML(c) {
    var statusClass = c.status === "archived" ? "archived" : c.status === "draft" ? "draft" : "";
    var statusTag = c.status === "archived" ? ' <span class="th-comment-tag archived">مؤرشف</span>' : c.status === "draft" ? ' <span class="th-comment-tag draft">مسودة</span>' : "";

    /* زر الأرشفة / استعادة */
    var btn1 = '<button class="th-cmt-btn th-cmt-draft-btn" data-slug="' + c._slug + '" data-id="' + c.id + '" data-action="draft" title="حفظ كمسودة"><i class="fa-regular fa-file-lines"></i></button>';
    var btn2 = c.status !== "archived"
      ? '<button class="th-cmt-btn th-cmt-archive-btn" data-slug="' + c._slug + '" data-id="' + c.id + '" data-action="archive" title="أرشفة"><i class="fa-solid fa-box-archive"></i></button>'
      : '<button class="th-cmt-btn th-cmt-restore-btn" data-slug="' + c._slug + '" data-id="' + c.id + '" data-action="active" title="استعادة"><i class="fa-solid fa-rotate-right"></i></button>';
    /* زر الحذف */
    var btn3 = '<button class="th-cmt-btn th-cmt-delete-btn" data-slug="' + c._slug + '" data-id="' + c.id + '" data-action="delete" title="حذف"><i class="fa-regular fa-trash-can"></i></button>';

    return (
      '<div class="th-comment-item ' + statusClass + '" data-id="' + c.id + '">' +
      '<div class="th-comment-body">' +
      '<p class="th-comment-text">' + c.text + '</p>' +
      '<div class="th-comment-meta">' +
      '<span class="th-comment-time">' + c.time + '</span>' + statusTag +
      '</div>' +
      '</div>' +
      '<div class="th-comment-actions-wrap">' + btn1 + btn2 + btn3 + '</div>' +
      '</div>'
    );
  }

  function _initGlobalCommentHandler() {
    if (window._thCommentHandlerReady) return;
    window._thCommentHandlerReady = true;
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".th-cmt-btn[data-action]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var slug = btn.getAttribute("data-slug");
      var id = btn.getAttribute("data-id");
      var action = btn.getAttribute("data-action");
      if (!slug || !id) return;

      if (action === "delete") {
        var all = getComments(slug);
        all = all.filter(function (c) { return c.id != id; });
        localStorage.setItem(COMMENT_KEY + "-" + slug, JSON.stringify(all));
        showToast("تم الحذف");
      } else if (action === "archive") {
        var all = getComments(slug);
        all.forEach(function (c) { if (c.id == id) c.status = "archived"; });
        localStorage.setItem(COMMENT_KEY + "-" + slug, JSON.stringify(all));
        showToast("تمت الأرشفة");
      } else if (action === "draft") {
        var all = getComments(slug);
        all.forEach(function (c) { if (c.id == id) c.status = "draft"; });
        localStorage.setItem(COMMENT_KEY + "-" + slug, JSON.stringify(all));
        showToast("تم الحفظ كمسودة");
      } else if (action === "active") {
        var all = getComments(slug);
        all.forEach(function (c) { if (c.id == id) c.status = "active"; });
        localStorage.setItem(COMMENT_KEY + "-" + slug, JSON.stringify(all));
        showToast("تمت الاستعادة");
      }

      var container = btn.closest(".th-discussion-list, .th-modal-comments-list");
      if (container && container._renderSlug) {
        renderCommentsList(container._renderSlug, container);
      }
    });
  }

  function renderCommentsList(slug, container) {
    _initGlobalCommentHandler();
    container._renderSlug = slug;
    var all = getComments(slug).map(function (c) {
      return Object.assign({}, c, { _slug: slug });
    });
    container.innerHTML = all.length
      ? all.map(commentItemHTML).join("")
      : '<p class="th-modal-empty">لا توجد تعليقات بعد.</p>';
  }

  function showToast(text) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2000);
  }

  function shareCard(slug, name) {
    var url = new URL("community-details.html?sport=" + slug, window.location.href).toString();
    var shareData = {
      title: "مجتمع " + name + " — Tajah Platform",
      text: "انضمي لمجتمع " + name + " في منصة تاجة للمواهب!",
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(function () { });
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showToast("تم نسخ الرابط ✓");
        }).catch(function () { showToast("تم نسخ الرابط ✓"); });
      } else {
        showToast("تم نسخ الرابط ✓");
      }
    }
  }

  function openCommentModal(slug, name) {
    var old = document.getElementById("th-comment-modal");
    if (old) old.remove();

    var modal = document.createElement("div");
    modal.id = "th-comment-modal";
    modal.className = "th-modal-overlay";
    modal.innerHTML =
      '<div class="th-modal-box" role="dialog" aria-modal="true" aria-label="تعليقات مجتمع ' + name + '">' +
      '<div class="th-modal-header">' +
      '<h3>تعليقات مجتمع ' + name + '</h3>' +
      '<button class="th-modal-close" aria-label="إغلاق">✕</button>' +
      '</div>' +
      '<div class="th-discussion-list" id="th-modal-list"></div>' +
      '<div class="th-modal-input-row">' +
      '<input class="th-modal-input" type="text" placeholder="اكتبي تعليقك..." maxlength="200" />' +
      '<button class="th-modal-send">إرسال</button>' +
      '</div>' +
      '</div>';

    document.body.appendChild(modal);

    var list = modal.querySelector("#th-modal-list");
    var input = modal.querySelector(".th-modal-input");
    var sendBtn = modal.querySelector(".th-modal-send");

    renderCommentsList(slug, list);

    modal.querySelector(".th-modal-close").addEventListener("click", function () { modal.remove(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });

    function sendComment() {
      var text = input.value.trim();
      if (!text) return;
      saveComment(slug, text);
      input.value = "";
      renderCommentsList(slug, list);
      list.scrollTop = list.scrollHeight;
    }

    sendBtn.addEventListener("click", sendComment);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") sendComment(); });
    setTimeout(function () { input.focus(); }, 100);
  }

  function communityCardMarkup(item) {
    var JOIN_KEY = "th-joined-communities";
    var joined = new Set();
    try { joined = new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); } catch (e) { }
    var isJoined = joined.has(item.slug);
    return (
      '<article class="th-nf-card" data-slug="' + item.slug + '" style="width:100%;flex-shrink:unset;scroll-snap-align:unset">' +
      '<a class="th-nf-card-link" href="community-details.html?sport=' + item.slug + '">' +
      '<div class="th-nf-card-top">' +
      '<div class="th-nf-thumb" data-sport="' + item.slug + '" role="img" aria-label="' + item.name + '" style="overflow:hidden;padding:0;background:none;border:none;">' +
      '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />' +
      '</div>' +
      '<div class="th-nf-text">' +
      '<h2 class="th-nf-title">مجتمع ' + item.name + '</h2>' +
      '<p class="th-nf-meta"><i class="fa-solid fa-user-group"></i> ' + item.members + ' عضوة</p>' +
      '</div>' +
      '</div>' +
      '<p class="th-nf-desc">' + item.description + '</p>' +
      '</a>' +
      '<div class="th-nf-actions">' +
      '<button class="th-comm-action-btn th-comm-share-btn" data-slug="' + item.slug + '" type="button" title="مشاركة"><i class="fa-solid fa-share-nodes"></i></button>' +
      '<button class="th-nf-join-btn ' + (isJoined ? 'joined' : '') + '" data-slug="' + item.slug + '" type="button">' +
      (isJoined ? '<i class="fa-solid fa-circle-check"></i> عضوة' : '<i class="fa-solid fa-plus"></i> انضمي') +
      '</button>' +
      '</div>' +
      '</article>'
    );
  }

  function itemMatchesSearch(item, query) {
    var q = (query || "").trim();
    if (!q) return true;
    return (item.name + " " + item.description + " " + item.slug).indexOf(q) !== -1;
  }

  function filteredSports() {
    return sports.filter(function (item) {
      return (activeFilter === "all" || item.slug === activeFilter) &&
        itemMatchesSearch(item, activeSearch);
    });
  }

  function renderFilters() {
    var holder = document.getElementById("sports-filters");
    if (!holder) return;
    holder.innerHTML = '<button class="th-comm-filter-pill is-active" data-filter="all">الكل</button>' +
      sports.map(function (s) {
        return '<button class="th-comm-filter-pill" data-filter="' + s.slug + '">' + s.name + '</button>';
      }).join("");

    holder.querySelectorAll(".th-comm-filter-pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        holder.querySelectorAll(".th-comm-filter-pill").forEach(function (el) { el.classList.remove("is-active"); });
        btn.classList.add("is-active");
        activeFilter = btn.getAttribute("data-filter");
        renderCommunities();
      });
    });
  }

  function renderCommunities() {
    var grid = document.getElementById("communities-grid");
    var emptyEl = document.getElementById("communities-empty");
    if (!grid) return;

    var list = filteredSports();

    if (emptyEl) {
      emptyEl.hidden = list.length > 0;
    }

    if (list.length === 0) {
      grid.innerHTML = "";
      return;
    }

    grid.innerHTML = list.map(function (item) { return communityCardMarkup(item); }).join("");
    bindNetflixActions(grid);
  }

  function levelColor(level) {
    var map = {
      "تاجة": "badge-crown",
      "متقدمة": "badge-advanced",
      "متوسطة": "badge-mid",
      "مبتدئة": "badge-beginner"
    };
    return map[level] || "";
  }

  function renderMembersPage() {
    var holder = document.getElementById("members-list");
    if (!holder) return;

    var PAGE_SIZE = 6;
    var currentPage = 0;
    var searchQuery = "";

    function filtered() {
      var q = searchQuery.trim();
      if (!q) return ALL_ACTIVE_MEMBERS;
      return ALL_ACTIVE_MEMBERS.filter(function (m) {
        return m.n.indexOf(q) !== -1 || m.sn.indexOf(q) !== -1;
      });
    }

    function memberRowHTML(m, globalRank) {
      var medal = globalRank === 1 ? "🥇" : globalRank === 2 ? "🥈" : globalRank === 3 ? "🥉" : globalRank + ".";
      var lc = levelColor(m.l);
      return (
        '<article class="th-comm-list-item th-member-card">' +
        '<div class="th-member-rank">' + medal + '</div>' +
        '<div class="th-member-info">' +
        '<h3>' + m.n + '</h3>' +
        '<p class="th-member-sport"><i class="fa-solid ' + m.si + '"></i> ' + m.sn + '</p>' +
        '</div>' +
        '<div class="th-member-right">' +
        '<span class="th-comm-badge ' + lc + '">' + m.b + '</span>' +
        '<div class="th-member-activity">' +
        '<div class="th-activity-bar"><div class="th-activity-fill" style="width:' + m.a + '%"></div></div>' +
        '<span>' + m.a + '٪</span>' +
        '</div>' +
        '</div>' +
        '</article>'
      );
    }

    function redraw() {
      var list = filtered();
      var end = (currentPage + 1) * PAGE_SIZE;
      var slice = list.slice(0, end);

      var grid = document.getElementById("members-grid-page");
      var moreBtn = document.getElementById("members-more-btn");
      var lessBtn = document.getElementById("members-less-btn");
      var info = document.getElementById("members-page-info");
      var noRes = document.getElementById("members-page-nores");

      if (noRes) noRes.style.display = list.length === 0 ? "block" : "none";
      if (grid) grid.innerHTML = slice.map(function (m, i) { return memberRowHTML(m, i + 1); }).join("");
      if (info) info.textContent = list.length > 0 ? "عرض " + slice.length + " من أصل " + list.length + " موهبة نشطة" : "";
      if (moreBtn) moreBtn.style.display = end < list.length ? "flex" : "none";
      if (lessBtn) lessBtn.style.display = (currentPage > 0 && slice.length > PAGE_SIZE) ? "flex" : "none";
    }

    holder.innerHTML =
      '<div class="th-members-search-wrap">' +
      '<i class="fa-solid fa-magnifying-glass th-members-search-icon"></i>' +
      '<input id="members-page-search" class="th-members-search-input" type="search" placeholder="ابحثي عن موهبة أو رياضة..." autocomplete="off" />' +
      '</div>' +
      '<div class="th-members-page-info-row">' +
      '<span id="members-page-info" class="th-members-info-tag"></span>' +
      '</div>' +
      '<p id="members-page-nores" class="th-members-no-result" style="display:none">لا توجد نتائج.</p>' +
      '<div id="members-grid-page" class="th-members-page-list"></div>' +
      '<div id="members-ctrl-row" class="th-members-ctrl-row" style="margin-top:var(--sp-4)">' +
      '<button id="members-more-btn" class="th-load-more-btn" style="display:none"><i class="fa-solid fa-chevron-down"></i> عرض المزيد</button>' +
      '<button id="members-less-btn" class="th-load-less-btn" style="display:none"><i class="fa-solid fa-chevron-up"></i> عرض أقل</button>' +
      '</div>';

    redraw();

    document.getElementById("members-page-search").addEventListener("input", function () {
      searchQuery = this.value;
      currentPage = 0;
      redraw();
    });

    holder.addEventListener("click", function (e) {
      if (e.target.closest("#members-more-btn")) { currentPage++; redraw(); }
      if (e.target.closest("#members-less-btn")) { currentPage = Math.max(0, currentPage - 1); redraw(); }
    });
  }

  function renderCommunitiesListPage() {
    var holder = document.getElementById("communities-list");
    var titleEl = document.getElementById("page-title");
    var subEl = document.getElementById("page-sub");
    if (!holder) return;

    var params = new URLSearchParams(window.location.search);
    var section = params.get("section") || "all";
    var JOIN_KEY = "th-joined-communities";

    var sectionMeta = {
      my: { title: "مجتمعاتي", sub: "المجتمعات التي انضممتِ إليها." },
      active: { title: "الأكثر نشاطاً", sub: "مرتبة حسب نسبة النشاط تنازلياً." },
      popular: { title: "الأكبر عضوية", sub: "مرتبة حسب عدد الأعضاء تنازلياً." },
      discover: { title: "اكتشفي المزيد", sub: "المجتمعات التي لم تنضمي إليها بعد." },
      all: { title: "دليل كل المجتمعات", sub: "جميع المجتمعات الرياضية المتاحة في المنصة." }
    };

    var meta = sectionMeta[section] || sectionMeta.all;
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) subEl.textContent = meta.sub;

    var list;
    if (section === "my") {
      var joined = [];
      try { joined = JSON.parse(localStorage.getItem(JOIN_KEY) || "[]"); } catch (e) { }
      list = joined.map(getSportBySlug).filter(Boolean).reverse();
    } else if (section === "active") {
      list = sports.slice().sort(function (a, b) { return b.activity - a.activity; });
    } else if (section === "popular") {
      list = sports.slice().sort(function (a, b) { return b.members - a.members; });
    } else if (section === "discover") {
      var joinedSet = new Set();
      try { joinedSet = new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); } catch (e) { }
      list = sports.filter(function (s) { return !joinedSet.has(s.slug); });
    } else {
      list = sports.slice();
    }

    if (list.length === 0) {
      holder.innerHTML = '<p class="th-comm-empty" style="display:block">لا توجد مجتمعات هنا بعد.</p>';
      return;
    }

    holder.innerHTML = list.map(function (item) {
      return (
        '<a class="th-comm-list-item" href="community-details.html?sport=' + item.slug + '">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div class="th-comm-card-thumb" data-sport="' + item.slug + '" style="width:44px;height:44px;flex-shrink:0;overflow:hidden;padding:0;background:none;border:none;">' +
        '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />' +
        '</div>' +
        '<div>' +
        '<h3>مجتمع ' + item.name + '</h3>' +
        '<p>الأعضاء: ' + item.members + ' | النشاط: ' + item.activity + '٪</p>' +
        '</div>' +
        '</div>' +
        '</a>'
      );
    }).join("");
  }

  /* ══════════════════════════════════════
     GAMIFICATION SYSTEM
  ══════════════════════════════════════ */
  var POINTS_KEY = "th-gamification-points";
  var VISITED_KEY = "th-gamification-visited";

  var LEVELS = [
    { name: "مبتدئة", badge: "🌱", min: 0, max: 100, color: "badge-beginner" },
    { name: "متوسطة", badge: "🌟", min: 100, max: 300, color: "badge-mid" },
    { name: "متقدمة", badge: "⭐", min: 300, max: 600, color: "badge-advanced" },
    { name: "تاجة", badge: "🏆", min: 600, max: 1000, color: "badge-crown" }
  ];

  var POINT_ACTIONS = {
    join: { pts: 50, label: "انضمام للمجتمع" },
    like: { pts: 5, label: "إعجاب" },
    comment: { pts: 10, label: "تعليق" },
    visit: { pts: 2, label: "زيارة مجتمع" }
  };

  function getPoints() {
    try { return parseInt(localStorage.getItem(POINTS_KEY) || "0"); }
    catch (e) { return 0; }
  }

  function addPoints(action, slug) {
    var info = POINT_ACTIONS[action];
    if (!info) return;
    if (action === "visit") {
      try {
        var visited = JSON.parse(sessionStorage.getItem(VISITED_KEY) || "[]");
        if (visited.indexOf(slug) !== -1) return;
        visited.push(slug);
        sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited));
      } catch (e) { }
    }
    var current = getPoints();
    var newTotal = current + info.pts;
    localStorage.setItem(POINTS_KEY, newTotal);
    showToast("+" + info.pts + " نقطة — " + info.label + " 🎉");
    var oldLevel = getLevelByPoints(current);
    var newLevel = getLevelByPoints(newTotal);
    if (newLevel.name !== oldLevel.name) {
      setTimeout(function () {
        showToast("🎊 ترقية! وصلتِ لمستوى " + newLevel.badge + " " + newLevel.name);
      }, 1500);
    }
    return newTotal;
  }

  function getLevelByPoints(pts) {
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (pts >= LEVELS[i].min) return LEVELS[i];
    }
    return LEVELS[0];
  }

  function getNextLevel(pts) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (pts < LEVELS[i].max) return LEVELS[i];
    }
    return LEVELS[LEVELS.length - 1];
  }

  function progressPercent(pts) {
    var current = getLevelByPoints(pts);
    var range = current.max - current.min;
    var done = pts - current.min;
    return Math.min(100, Math.round((done / range) * 100));
  }

  function gamificationBarHTML(slug) {
    var pts = getPoints();
    var level = getLevelByPoints(pts);
    var next = getNextLevel(pts);
    var pct = progressPercent(pts);
    var ptsLeft = next.max - pts;
    return (
      '<div class="th-gami-bar-wrap" id="gami-bar">' +
      '<div class="th-gami-header">' +
      '<span class="th-comm-badge ' + level.color + '">' + level.badge + ' ' + level.name + '</span>' +
      '<span class="th-gami-pts">' + pts + ' نقطة</span>' +
      '</div>' +
      '<div class="th-gami-track">' +
      '<div class="th-gami-fill" style="width:' + pct + '%"></div>' +
      '</div>' +
      '<div class="th-gami-footer">' +
      '<span>تحتاجين <strong>' + ptsLeft + '</strong> نقطة للوصول لـ ' + next.badge + ' ' + next.name + '</span>' +
      '<span>' + pct + '٪</span>' +
      '</div>' +
      '<div class="th-gami-actions-hint">' +
      '<span title="انضمام">+50 انضمام</span>' +
      '<span title="تعليق">+10 تعليق</span>' +
      '<span title="إعجاب">+5 إعجاب</span>' +
      '<span title="زيارة">+2 زيارة</span>' +
      '</div>' +
      '</div>'
    );
  }

  function updateGamiBar() {
    var bar = document.getElementById("gami-bar");
    if (!bar) return;
    var pts = getPoints();
    var level = getLevelByPoints(pts);
    var next = getNextLevel(pts);
    var pct = progressPercent(pts);
    var fill = bar.querySelector(".th-gami-fill");
    var ptsEl = bar.querySelector(".th-gami-pts");
    var badge = bar.querySelector(".th-comm-badge");
    var foot = bar.querySelector(".th-gami-footer span");
    var pctEl = bar.querySelectorAll(".th-gami-footer span")[1];
    if (fill) fill.style.width = pct + "%";
    if (ptsEl) ptsEl.textContent = pts + " نقطة";
    if (badge) { badge.textContent = level.badge + " " + level.name; badge.className = "th-comm-badge " + level.color; }
    if (foot) foot.innerHTML = "تحتاجين <strong>" + (next.max - pts) + "</strong> نقطة للوصول لـ " + next.badge + " " + next.name;
    if (pctEl) pctEl.textContent = pct + "٪";
  }

  function awardVisit(slug) {
    addPoints("visit", slug);
  }

  function exclusiveContentHTML(sport) {
    return (
      '<div class="th-exclusive-wrap">' +
      gamificationBarHTML(sport.slug) +
      '</div>'
    );
  }

  function bindChallenges(holder, slug) {
    holder.addEventListener("click", function (e) {
      var btn = e.target.closest(".th-challenge-btn");
      if (!btn) return;
      if (btn.getAttribute("data-done") === "true") return;
      var pts = parseInt(btn.getAttribute("data-pts") || "0");
      btn.setAttribute("data-done", "true");
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> تم! ✓';
      btn.classList.add("done");
      btn.disabled = true;
      var current = getPoints();
      var newTotal = current + pts;
      localStorage.setItem(POINTS_KEY, newTotal);
      showToast("+" + pts + " نقطة — أتممتِ التحدي 🏅");
      var oldLevel = getLevelByPoints(current);
      var newLevel = getLevelByPoints(newTotal);
      if (newLevel.name !== oldLevel.name) {
        setTimeout(function () { showToast("🎊 ترقية! وصلتِ لمستوى " + newLevel.badge + " " + newLevel.name); }, 1500);
      }
      setTimeout(function () { updateGamiBar(); }, 200);
    });
  }

  function lastActiveText(activity) {
    if (activity >= 97) return "نشطة منذ 5 دقائق";
    if (activity >= 95) return "نشطة منذ 20 دقيقة";
    if (activity >= 92) return "نشطة منذ ساعة";
    if (activity >= 89) return "نشطة منذ 3 ساعات";
    if (activity >= 85) return "نشطة منذ أمس";
    return "نشطة منذ يومين";
  }

  /* ══════════════════════════════════════
     BLOG ENGINE — Anonymous Posts
  ══════════════════════════════════════ */
  var ANON_NAMES = ["مجهول ١", "مجهول ٢", "مجهول ٣", "مجهول ٤", "مجهول ٥", "مجهول ٦", "مجهول ٧", "مجهول ٨"];
  var ANON_COLORS = ["#B670FF", "#067647", "#0369A1", "#C2410C", "#86198F", "#7A7200", "#991B1B", "#374151"];

  function anonAvatar(index) {
    var color = ANON_COLORS[index % ANON_COLORS.length];
    return '<div class="th-blog-avatar" style="background:' + color + '22;border-color:' + color + '44;color:' + color + '">' +
      '<i class="fa-solid fa-user-secret"></i></div>';
  }

  function timeAgo(ts) {
    var diff = Date.now() - ts;
    var m = Math.floor(diff / 60000);
    if (m < 1) return "الآن";
    if (m < 60) return "منذ " + m + " دقيقة";
    var h = Math.floor(m / 60);
    if (h < 24) return "منذ " + h + " ساعة";
    return "منذ " + Math.floor(h / 24) + " يوم";
  }

  function blogPostHTML(post, postIdx) {
    var user = null;
    try { user = JSON.parse(sessionStorage.getItem("tajah_user")); } catch (e) { }
    var currentUserId = user ? user.id : null;

    var repliesHTML = (post.replies || []).map(function (r, ri) {
      var deleteReplyBtn = r.user_id === currentUserId 
        ? '<button class="th-blog-delete-reply" data-id="' + r.id + '" title="حذف الرد" style="color:#eb3333;margin-right:auto;background:none;border:none;cursor:pointer;"><i class="fa-regular fa-trash-can"></i></button>' 
        : '';
      return (
        '<div class="th-blog-reply">' +
        anonAvatar(postIdx + ri + 3) +
        '<div class="th-blog-reply-bubble" style="display:flex;flex-direction:column;width:100%;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        '<span class="th-blog-reply-name">' + ANON_NAMES[(postIdx + ri + 3) % ANON_NAMES.length] + '</span>' +
        deleteReplyBtn +
        '</div>' +
        '<p>' + r.text + '</p>' +
        '<span class="th-blog-time">' + timeAgo(r.ts) + '</span>' +
        '</div>' +
        '</div>'
      );
    }).join("");

    var deletePostBtn = post.user_id === currentUserId
      ? '<button class="th-blog-delete-post" data-id="' + post.id + '" title="حذف المنشور" style="color:#eb3333;margin-right:auto;background:none;border:none;cursor:pointer;"><i class="fa-regular fa-trash-can"></i></button>'
      : '';

    return (
      '<article class="th-blog-post" data-idx="' + postIdx + '">' +
      '<div class="th-blog-post-header" style="display:flex;align-items:center;">' +
      '<div style="display:flex;align-items:center;gap:12px;">' +
      anonAvatar(postIdx) +
      '<div class="th-blog-post-meta">' +
      '<span class="th-blog-author">' + ANON_NAMES[postIdx % ANON_NAMES.length] + '</span>' +
      '<span class="th-blog-time">' + timeAgo(post.ts) + '</span>' +
      '</div>' +
      '</div>' +
      deletePostBtn +
      '</div>' +
      '<p class="th-blog-post-text">' + post.text + '</p>' +
      '<div class="th-blog-post-actions">' +
      '<button class="th-blog-reply-toggle" data-idx="' + postIdx + '">' +
      '<i class="fa-regular fa-comment"></i> ' +
      ((post.replies || []).length > 0 ? (post.replies.length) + ' رد' : 'رد') +
      '</button>' +
      '</div>' +
      (repliesHTML ? '<div class="th-blog-replies">' + repliesHTML + '</div>' : '') +
      '<div class="th-blog-reply-compose" id="reply-compose-' + postIdx + '" style="display:none">' +
      '<input class="th-blog-reply-input" placeholder="ردّي بشكل مجهول..." maxlength="300" />' +
      '<button class="th-blog-reply-send" data-idx="' + postIdx + '"><i class="fa-solid fa-paper-plane"></i></button>' +
      '</div>' +
      '</article>'
    );
  }

  function renderBlogFeed(slug, container) {
    var sport = getSportBySlug(slug);
    if (!sport || !sport.id) {
      container.innerHTML =
        '<div class="th-blog-empty">' +
        '<i class="fa-solid fa-feather-pointed"></i>' +
        '<p>كوني أول من يبدأ نقاشاً!</p>' +
        '</div>';
      return;
    }

    fetch(`${apiBase}/api/communities/${sport.id}/posts`)
      .then(res => res.json())
      .then(posts => {
        if (posts.length === 0) {
          container.innerHTML =
            '<div class="th-blog-empty">' +
            '<i class="fa-solid fa-feather-pointed"></i>' +
            '<p>كوني أول من يبدأ نقاشاً!</p>' +
            '</div>';
          return;
        }

        container.innerHTML = posts.slice().reverse().map(function (p, i) {
          var adaptedPost = {
            id: p.id,
            user_id: p.user_id,
            text: p.content,
            ts: new Date(p.created_at).getTime(),
            replies: (p.replies || []).map(r => ({
              id: r.id,
              user_id: r.user_id,
              text: r.content,
              ts: new Date(r.created_at).getTime()
            }))
          };
          return blogPostHTML(adaptedPost, posts.length - 1 - i);
        }).join("");

        container.querySelectorAll(".th-blog-reply-toggle").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var idx = btn.getAttribute("data-idx");
            var compose = document.getElementById("reply-compose-" + idx);
            if (!compose) return;
            var isOpen = compose.style.display !== "none";
            compose.style.display = isOpen ? "none" : "flex";
            if (!isOpen) compose.querySelector("input").focus();
          });
        });

        container.querySelectorAll(".th-blog-delete-post").forEach(function (btn) {
          btn.addEventListener("click", function () {
            if (!confirm('هل أنت متأكدة من حذف هذا المنشور؟')) return;
            var id = btn.getAttribute("data-id");
            fetch(`${apiBase}/api/communities/posts/${id}`, { method: 'DELETE' })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  showToast("تم حذف المنشور");
                  renderBlogFeed(slug, container);
                } else {
                  showToast(data.error || "فشل الحذف");
                }
              }).catch(() => showToast("فشل الحذف"));
          });
        });

        container.querySelectorAll(".th-blog-delete-reply").forEach(function (btn) {
          btn.addEventListener("click", function () {
            if (!confirm('هل أنت متأكدة من حذف هذا الرد؟')) return;
            var id = btn.getAttribute("data-id");
            fetch(`${apiBase}/api/communities/replies/${id}`, { method: 'DELETE' })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  showToast("تم حذف الرد");
                  renderBlogFeed(slug, container);
                } else {
                  showToast(data.error || "فشل الحذف");
                }
              }).catch(() => showToast("فشل الحذف"));
          });
        });

        container.querySelectorAll(".th-blog-reply-send").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var idx = parseInt(btn.getAttribute("data-idx"));
            var compose = document.getElementById("reply-compose-" + idx);
            if (!compose) return;
            var input = compose.querySelector("input");
            var text = input.value.trim();
            if (!text) return;

            var targetPost = posts.slice().reverse()[posts.length - 1 - idx];
            if (!targetPost) return;

            var user = null;
            try { user = JSON.parse(sessionStorage.getItem("tajah_user")); } catch (e) { }
            var userId = user ? user.id : null;

            fetch(`${apiBase}/api/communities/posts/${targetPost.id}/replies`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                content: text,
                is_anonymous: 1
              })
            })
              .then(res => res.json())
              .then(() => {
                addPoints("comment", slug);
                input.value = "";
                renderBlogFeed(slug, container);
                showToast("تم نشر ردك بشكل مجهول ✓");
                setTimeout(updateGamiBar, 200);
              })
              .catch(err => {
                console.error("Failed to post reply:", err);
                showToast("حدث خطأ أثناء إرسال الرد");
              });
          });
        });
      })
      .catch(err => {
        console.error("Failed to load forum posts:", err);
        container.innerHTML =
          '<div class="th-blog-empty">' +
          '<i class="fa-solid fa-triangle-exclamation"></i>' +
          '<p>تعذر تحميل النقاشات من الخادم</p>' +
          '</div>';
      });
  }

  /* ══════════════════════════════════════
     صفحة تفاصيل المجتمع
  ══════════════════════════════════════ */
  function renderCommunityDetails() {
    var holder = document.getElementById("community-details");
    if (!holder) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("sport") || "basketball";
    var sport = getSportBySlug(slug) || sports[0];
    var JOIN_KEY = "th-joined-communities";
    function joinedSet() {
      try { return new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); }
      catch (e) { return new Set(); }
    }
    var isJoined = joinedSet().has(slug);

    holder.innerHTML =
      '<div class="th-detail-hero-row">' +
      '<div class="th-detail-hero-thumb" data-sport="' + sport.slug + '" style="overflow:hidden;padding:0;background:none;border:none;">' +
      '<img src="' + sport.image + '" alt="' + sport.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />' +
      '</div>' +
      '<div class="th-detail-hero-text">' +
      '<h1 class="th-detail-hero-title">مجتمع ' + sport.name + '</h1>' +
      '<p class="th-detail-hero-desc">' + sport.description + '</p>' +
      '<div class="th-detail-hero-meta">' +
      '<span class="th-meta-chip"><i class="fa-solid fa-users"></i> <strong id="members-count">' + sport.members + '</strong> عضوة</span>' +
      '<span class="th-meta-chip th-meta-active"><i class="fa-solid fa-circle th-pulse-dot"></i> ' + lastActiveText(sport.activity) + '</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<button class="th-detail-join-btn ' + (isJoined ? 'joined' : '') + '" id="join-btn" type="button">' +
      (isJoined
        ? '<i class="fa-solid fa-circle-check"></i> أنتِ عضوة في المجتمع'
        : '<i class="fa-solid fa-plus"></i> انضمي إلى المجتمع') +
      '</button>' +
      '<section id="discussion" class="th-blog-section">' +
      '<div class="th-blog-header">' +
      '<h3 class="th-blog-title">نقاشات وأسئلة</h3>' +
      '<span class="th-blog-anon-badge"><i class="fa-solid fa-user-secret"></i> مجهول الهوية</span>' +
      '</div>' +
      '<p class="th-blog-sub">هذه المساحة آمنة — لا تظهر هوية المشاركات</p>' +
      '<div class="th-blog-feed" id="blog-feed"></div>' +
      '<div class="th-blog-compose">' +
      '<div class="th-blog-compose-avatar"><i class="fa-solid fa-user-secret"></i></div>' +
      '<div class="th-blog-compose-wrap">' +
      '<textarea id="blog-input" class="th-blog-input" placeholder="اطرحي سؤالاً أو شاركي رأيك بشكل مجهول..." maxlength="400" rows="2"></textarea>' +
      '<div class="th-blog-compose-actions">' +
      '<span class="th-blog-char-count" id="blog-char">0/400</span>' +
      '<button class="th-blog-post-btn" id="blog-send"><i class="fa-solid fa-paper-plane"></i> نشر</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>';

    awardVisit(slug);

    if (isJoined) bindChallenges(holder, slug);

    var joinBtn = document.getElementById("join-btn");
    var countEl = document.getElementById("members-count");

    joinBtn.addEventListener("click", function () {
      var joined = joinedSet();
      if (joined.has(slug)) {
        joined.delete(slug);
        localStorage.setItem(JOIN_KEY, JSON.stringify(Array.from(joined)));
        joinBtn.classList.remove("joined");
        joinBtn.innerHTML = '<i class="fa-solid fa-plus"></i> انضمي إلى المجتمع';
        if (sport.id) {
          fetch(`${apiBase}/api/communities/${sport.id}/leave`, { method: 'POST' })
            .then(() => {
              sport.members = Math.max(0, sport.members - 1);
              if (countEl) countEl.textContent = sport.members;
            });
        } else {
          if (countEl) countEl.textContent = sport.members;
        }
        showToast("غادرتِ مجتمع " + sport.name);
        document.dispatchEvent(new CustomEvent("th-join-changed"));
      } else {
        joined.add(slug);
        localStorage.setItem(JOIN_KEY, JSON.stringify(Array.from(joined)));
        joinBtn.classList.add("joined");
        joinBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> أنتِ عضوة في المجتمع';
        if (sport.id) {
          fetch(`${apiBase}/api/communities/${sport.id}/join`, { method: 'POST' })
            .then(() => {
              sport.members++;
              if (countEl) countEl.textContent = sport.members;
            });
        } else {
          if (countEl) countEl.textContent = sport.members + 1;
        }
        showToast("🎉 مرحباً بكِ في مجتمع " + sport.name + "!");
        joinBtn.classList.add("pulse");
        setTimeout(function () { joinBtn.classList.remove("pulse"); }, 500);
        addPoints("join", slug);
        setTimeout(function () { updateGamiBar(); }, 100);
        document.dispatchEvent(new CustomEvent("th-join-changed"));
      }
    });

    var blogFeed = document.getElementById("blog-feed");
    var blogInput = document.getElementById("blog-input");
    var blogSend = document.getElementById("blog-send");
    var blogChar = document.getElementById("blog-char");

    if (blogFeed) renderBlogFeed(slug, blogFeed);

    if (blogInput && blogChar) {
      blogInput.addEventListener("input", function () {
        blogChar.textContent = blogInput.value.length + "/400";
      });
    }

    if (blogSend && blogInput) {
      function postBlog() {
        var text = blogInput.value.trim();
        if (!text) return;

        var user = null;
        try { user = JSON.parse(sessionStorage.getItem("tajah_user")); } catch (e) { }
        var userId = user ? user.id : null;

        fetch(`${apiBase}/api/communities/${sport.id}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            content: text,
            is_anonymous: 1
          })
        })
          .then(res => res.json())
          .then(() => {
            addPoints("comment", slug);
            blogInput.value = "";
            if (blogChar) blogChar.textContent = "0/400";
            renderBlogFeed(slug, blogFeed);
            showToast("تم النشر بشكل مجهول ✓");
            setTimeout(updateGamiBar, 200);
          })
          .catch(err => {
            console.error("Failed to submit post:", err);
            showToast("حدث خطأ أثناء نشر الموضوع");
          });
      }
      blogSend.addEventListener("click", postBlog);
      blogInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postBlog(); }
      });
    }
  }

  /* ══════════════════════════════════════
     Dashboard
  ══════════════════════════════════════ */
  function netflixCardHTML(item) {
    var JOIN_KEY = "th-joined-communities";
    var joined = new Set();
    try { joined = new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); } catch (e) { }
    var isJoined = joined.has(item.slug);
    return (
      '<article class="th-nf-card" data-slug="' + item.slug + '">' +
      '<a class="th-nf-card-link" href="community-details.html?sport=' + item.slug + '">' +
      '<div class="th-nf-card-top">' +
      '<div class="th-nf-thumb" data-sport="' + item.slug + '" style="overflow:hidden;padding:0;background:none;border:none;">' +
      '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />' +
      '</div>' +
      '<div class="th-nf-text">' +
      '<h3 class="th-nf-title">مجتمع ' + item.name + '</h3>' +
      '<p class="th-nf-meta"><i class="fa-solid fa-user-group"></i> ' + item.members + ' عضوة</p>' +
      '</div>' +
      '</div>' +
      '<p class="th-nf-desc">' + item.description + '</p>' +
      '</a>' +
      '<div class="th-nf-actions">' +
      '<button class="th-comm-action-btn th-comm-share-btn" data-slug="' + item.slug + '" type="button" title="مشاركة"><i class="fa-solid fa-share-nodes"></i></button>' +
      '<button class="th-nf-join-btn ' + (isJoined ? 'joined' : '') + '" data-slug="' + item.slug + '" type="button">' +
      (isJoined ? '<i class="fa-solid fa-circle-check"></i> عضوة' : '<i class="fa-solid fa-plus"></i> انضمي') +
      '</button>' +
      '</div>' +
      '</article>'
    );
  }

  function bindScrollButtons(scrollEl, btnStart, btnEnd) {
    var STEP = 220;

    function updateBtns() {
      var sl = Math.abs(scrollEl.scrollLeft);
      var maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
      if (btnStart) btnStart.classList.toggle("hidden", sl <= 4);
      if (btnEnd) btnEnd.classList.toggle("hidden", maxScroll <= 4 || sl >= maxScroll - 4);
    }

    if (btnStart) {
      btnStart.addEventListener("click", function () {
        scrollEl.scrollBy({ left: STEP, behavior: "smooth" });
      });
    }
    if (btnEnd) {
      btnEnd.addEventListener("click", function () {
        scrollEl.scrollBy({ left: -STEP, behavior: "smooth" });
      });
    }

    scrollEl.addEventListener("scroll", updateBtns, { passive: true });
    setTimeout(updateBtns, 50);
  }

  function renderNetflixSection(rowId, sportsList) {
    var row = document.getElementById(rowId);
    if (!row) return;
    if (!sportsList || sportsList.length === 0) {
      row.innerHTML =
        '<div class="th-netflix-empty">' +
        '<i class="fa-solid fa-magnifying-glass"></i>' +
        '<p>لا يوجد مجتمع</p>' +
        '</div>';
      return;
    }
    row.innerHTML = sportsList.map(netflixCardHTML).join("");
    bindNetflixActions(row);
  }

  function bindNetflixActions(container) {
    container.querySelectorAll(".th-comm-share-btn[data-slug]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var slug = btn.getAttribute("data-slug");
        var sport = getSportBySlug(slug);
        if (sport) shareCard(slug, sport.name);
      });
    });

    container.querySelectorAll(".th-nf-join-btn[data-slug]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var slug = btn.getAttribute("data-slug");
        var sport = getSportBySlug(slug);
        if (!sport) return;
        var JOIN_KEY = "th-joined-communities";
        var joined = new Set();
        try { joined = new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); } catch (e) { }
        if (joined.has(slug)) {
          joined.delete(slug);
          btn.classList.remove("joined");
          btn.innerHTML = '<i class="fa-solid fa-plus"></i> انضمي';
          showToast("غادرتِ مجتمع " + sport.name);
          if (sport.id) {
            fetch(`${apiBase}/api/communities/${sport.id}/leave`, { method: 'POST' })
              .then(() => { sport.members = Math.max(0, sport.members - 1); });
          }
        } else {
          joined.add(slug);
          btn.classList.add("joined");
          btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> عضوة';
          addPoints("join", slug);
          showToast("🎉 مرحباً في مجتمع " + sport.name + "!");
          if (sport.id) {
            fetch(`${apiBase}/api/communities/${sport.id}/join`, { method: 'POST' })
              .then(() => { sport.members++; });
          }
        }
        localStorage.setItem(JOIN_KEY, JSON.stringify(Array.from(joined)));
        document.dispatchEvent(new CustomEvent("th-join-changed"));
      });
    });
  }

  function renderMySection() {
    var JOIN_KEY = "th-joined-communities";
    var joined = [];
    try { joined = JSON.parse(localStorage.getItem(JOIN_KEY) || "[]"); } catch (e) { }
    var mySports = joined.map(getSportBySlug).filter(Boolean).reverse();
    var row = document.getElementById("row-my");
    if (!row) return;
    if (mySports.length === 0) {
      row.innerHTML = '<div class="th-netflix-empty"><i class="fa-regular fa-heart"></i><p>انضمي لمجتمع لتظهر هنا</p></div>';
      return;
    }
    row.innerHTML = mySports.map(netflixCardHTML).join("");
    bindNetflixActions(row);
  }

  function initDashboard() {
    var search = document.getElementById("community-search");

    renderMySection();

    var activeSports = sports.slice()
      .sort(function (a, b) { return b.activity - a.activity; })
      .slice(0, 8);
    renderNetflixSection("row-active", activeSports);

    var popularSports = sports.slice()
      .sort(function (a, b) { return b.members - a.members; })
      .slice(0, 8);
    renderNetflixSection("row-popular", popularSports);

    function renderDiscoverSection() {
      var shownSet = new Set(
        activeSports.map(function (s) { return s.slug; })
          .concat(popularSports.map(function (s) { return s.slug; }))
      );
      var discoverSports = sports.filter(function (s) { return !shownSet.has(s.slug); });
      renderNetflixSection("row-discover", discoverSports);
    }
    renderDiscoverSection();

    document.addEventListener("th-join-changed", function () {
      renderMySection();
      var activeSports2 = sports.slice().sort(function (a, b) { return b.activity - a.activity; });
      renderNetflixSection("row-active", activeSports2);
      var popularSports2 = sports.slice().sort(function (a, b) { return b.members - a.members; });
      renderNetflixSection("row-popular", popularSports2);
      renderDiscoverSection();
    });

    renderFilters();

    var filtersScroll = document.querySelector(".th-comm-filters-scroll");
    var filtersWrap = document.querySelector(".th-filters-wrapper");
    if (filtersScroll && filtersWrap) {
      filtersWrap.insertAdjacentHTML("beforeend",
        '<button class="th-row-scroll-btn scroll-start hidden" aria-label="السابق"><i class="fa-solid fa-chevron-right"></i></button>' +
        '<button class="th-row-scroll-btn scroll-end hidden" aria-label="التالي"><i class="fa-solid fa-chevron-left"></i></button>'
      );
      var btnStart = filtersWrap.querySelector(".scroll-start");
      var btnEnd = filtersWrap.querySelector(".scroll-end");
      bindScrollButtons(filtersScroll, btnStart, btnEnd);

      var oldArrow = filtersWrap.querySelector(".th-scroll-arrow");
      if (oldArrow) oldArrow.style.display = "none";
    }

    function applyFilter(filterSlug) {
      activeFilter = filterSlug;

      var baseMy = sports.filter(s => {
        var JOIN_KEY = "th-joined-communities";
        var joined = new Set();
        try { joined = new Set(JSON.parse(localStorage.getItem(JOIN_KEY) || "[]")); } catch (e) { }
        return joined.has(s.slug);
      }).reverse();

      var filteredMy = filterSlug === "all" ? baseMy : baseMy.filter(function (s) { return s.slug === filterSlug; });
      renderNetflixSection("row-my", filteredMy);

      var baseActive = sports.slice().sort(function (a, b) { return b.activity - a.activity; }).slice(0, 8);
      var filteredActive = filterSlug === "all" ? baseActive : baseActive.filter(function (s) { return s.slug === filterSlug; });
      renderNetflixSection("row-active", filteredActive);

      var basePopular = sports.slice().sort(function (a, b) { return b.members - a.members; }).slice(0, 8);
      var filteredPopular = filterSlug === "all" ? basePopular : basePopular.filter(function (s) { return s.slug === filterSlug; });
      renderNetflixSection("row-popular", filteredPopular);

      var shownSet2 = new Set(baseActive.concat(basePopular).map(function (s) { return s.slug; }));
      var baseDiscover = sports.filter(function (s) { return !shownSet2.has(s.slug); });
      var filteredDiscover = filterSlug === "all" ? baseDiscover : baseDiscover.filter(function (s) { return s.slug === filterSlug; });
      renderNetflixSection("row-discover", filteredDiscover);
    }

    var filtersHolder = document.getElementById("sports-filters");
    if (filtersHolder) {
      filtersHolder.addEventListener("click", function (e) {
        var pill = e.target.closest(".th-comm-filter-pill");
        if (!pill) return;
        filtersHolder.querySelectorAll(".th-comm-filter-pill").forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        applyFilter(pill.getAttribute("data-filter"));
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        activeSearch = search.value.trim();
        var sections = document.getElementById("netflix-sections");
        var grid = document.getElementById("communities-grid");
        var empty = document.getElementById("communities-empty");
        if (activeSearch) {
          if (sections) sections.style.display = "none";
          if (grid) grid.style.display = "grid";
          renderCommunities();
        } else {
          if (sections) sections.style.display = "block";
          if (grid) grid.style.display = "none";
          if (empty) empty.hidden = true;
          applyFilter(activeFilter);
        }
      });
    }
  }

  function init() {
    var page = document.body.getAttribute("data-page");
    if (page === "dashboard") initDashboard();
    if (page === "members") renderMembersPage();
    if (page === "all-communities") renderCommunitiesListPage();
    if (page === "community-details") renderCommunityDetails();
  }

  /* ══════════════════════════════════════
     البداية والاتصال بـ SQLite
  ══════════════════════════════════════ */
  function bootstrap() {
    Promise.all([
      fetch(`${apiBase}/api/communities`).then(res => res.json()),
      fetch(`${apiBase}/api/users?role=player`).then(res => res.json())
    ])
      .then(([dbCommunities, players]) => {
        sports = dbCommunities.map(dbc => {
          const meta = sportMeta[dbc.sport] || { icon: "fa-person-running", activity: 85, topActivities: ["تمارين لياقة"] };
          return {
            id: dbc.id,
            slug: dbc.sport,
            name: dbc.name,
            icon: meta.icon,
            image: meta.image,
            members: dbc.member_count,
            activity: meta.activity,
            topActivities: meta.topActivities,
            description: dbc.description || ""
          };
        });

        ALL_ACTIVE_MEMBERS = players.map(p => {
          const sm = sportMeta[p.sport] || { name: p.sport || "رياضة أخرى", icon: "fa-person-running" };
          const rating = p.overall_rating || 85;
          let badge = "🌱 مبتدئة";
          let lvl = "مبتدئة";
          if (rating >= 95) { badge = "🏆 تاجة"; lvl = "تاجة"; }
          else if (rating >= 90) { badge = "⭐ متقدمة"; lvl = "متقدمة"; }
          else if (rating >= 80) { badge = "🌟 متوسطة"; lvl = "متوسطة"; }

          return {
            n: p.name || p.username,
            sn: sm.name,
            si: sm.icon,
            l: lvl,
            b: badge,
            a: rating
          };
        });
        ALL_ACTIVE_MEMBERS.sort((a, b) => b.a - a.a);

        init();
      })
      .catch(err => {
        console.error("Error bootstrapping communities data from SQLite backend:", err);
        init();
      });
  }

  bootstrap();
})();
