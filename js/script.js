"use strict";

const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(tab) {
  tabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  panels.forEach((panel) => {
    const isMatch = panel.id === tab.getAttribute("aria-controls");
    panel.hidden = !isMatch;
    panel.classList.toggle("active", isMatch);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));

  tab.addEventListener("keydown", (event) => {
    const { key } = event;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = tabs.length - 1;
    }

    tabs[nextIndex].focus();
    activateTab(tabs[nextIndex]);
  });
});

const favoritesTabButtons = Array.from(document.querySelectorAll("[data-fav-tab]"));
const favoritesPanels = Array.from(document.querySelectorAll("[data-fav-panel]"));

function activateFavoritesTab(tabName) {
  favoritesTabButtons.forEach((button) => {
    const isActive = button.getAttribute("data-fav-tab") === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  favoritesPanels.forEach((panel) => {
    const isActive = panel.getAttribute("data-fav-panel") === tabName;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

favoritesTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateFavoritesTab(button.getAttribute("data-fav-tab"));
  });
});

if (favoritesTabButtons.length && favoritesPanels.length) {
  activateFavoritesTab("opportunities");
}

const healthModal = document.querySelector("[data-health-modal]");
const healthOpenButton = document.querySelector("[data-open-health-upload]");
const healthCloseTriggers = Array.from(document.querySelectorAll("[data-health-modal-close]"));
const healthBrowseButton = document.querySelector("[data-health-browse]");
const healthFileInput = document.querySelector("#health-upload-input");
const healthFileRow = document.querySelector("[data-health-file-row]");
const healthFileName = document.querySelector("[data-health-file-name]");
const healthRemoveButton = document.querySelector("[data-health-remove]");
const skillModal = document.querySelector("[data-skill-modal]");
const skillOpenButton = document.querySelector("[data-open-skill-modal]");
const skillCloseTriggers = Array.from(document.querySelectorAll("[data-skill-modal-close]"));
const skillForm = document.querySelector("[data-skill-form]");
const skillInput = document.querySelector("[data-skill-input]");
const skillsTagsContainer = document.querySelector(".skills-tags");

function syncBodyScrollLock() {
  const isHealthOpen = healthModal && !healthModal.hidden;
  const isSkillOpen = skillModal && !skillModal.hidden;
  document.body.style.overflow = isHealthOpen || isSkillOpen ? "hidden" : "";
}

function openHealthModal() {
  if (!healthModal) return;
  healthModal.hidden = false;
  syncBodyScrollLock();
}

function closeHealthModal() {
  if (!healthModal) return;
  healthModal.hidden = true;
  syncBodyScrollLock();
}

function openSkillModal() {
  if (!skillModal) return;
  skillModal.hidden = false;
  syncBodyScrollLock();
  if (skillInput) {
    requestAnimationFrame(() => {
      skillInput.focus();
    });
  }
}

function closeSkillModal() {
  if (!skillModal) return;
  skillModal.hidden = true;
  syncBodyScrollLock();
}

if (healthOpenButton) {
  healthOpenButton.addEventListener("click", openHealthModal);
}

healthCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeHealthModal);
});

if (skillOpenButton) {
  skillOpenButton.addEventListener("click", openSkillModal);
}

skillCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeSkillModal);
});

if (healthBrowseButton && healthFileInput) {
  healthBrowseButton.addEventListener("click", () => {
    healthFileInput.click();
  });
}

if (healthFileInput && healthFileRow && healthFileName) {
  healthFileInput.addEventListener("change", () => {
    const file = healthFileInput.files && healthFileInput.files[0];
    if (!file) {
      healthFileRow.hidden = true;
      return;
    }
    healthFileName.textContent = file.name;
    healthFileRow.hidden = false;
  });
}

if (healthRemoveButton && healthFileInput && healthFileRow) {
  healthRemoveButton.addEventListener("click", () => {
    healthFileInput.value = "";
    healthFileRow.hidden = true;
  });
}

if (skillForm && skillInput) {
  skillForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newSkill = skillInput.value.trim();
    if (!newSkill) {
      skillInput.focus();
      return;
    }

    if (skillsTagsContainer) {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = newSkill;
      skillsTagsContainer.prepend(chip);
    }

    skillInput.value = "";
    closeSkillModal();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (skillModal && !skillModal.hidden) {
    closeSkillModal();
    return;
  }
  if (healthModal && !healthModal.hidden) {
    closeHealthModal();
  }
});

const uploadBtn = document.querySelector(".legacy-upload-btn-not-used");
const fileInput = document.getElementById("achievement-upload");

if (uploadBtn && fileInput) {
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    if (!files.length) return;
    console.log("تم رفع ملفات:", files);
  });
}



// ── Level Stepper Toggle Logic ──
const levelTag = document.querySelector('[data-level-tag]');
const levelCard = document.querySelector('[data-level-card]');
if (levelTag && levelCard) {
  levelTag.addEventListener('click', () => {
    const isExpanded = levelTag.getAttribute('aria-expanded') === 'true';
    levelTag.setAttribute('aria-expanded', !isExpanded);
    levelCard.hidden = isExpanded;
    levelCard.setAttribute('aria-hidden', isExpanded);
  });
}

// ── Completion Checklist Toggle Logic ──
const completionTrigger = document.querySelector('[data-completion-trigger]');
const completionPanel = document.querySelector('[data-completion-panel]');
if (completionTrigger && completionPanel) {
  completionTrigger.addEventListener('click', () => {
    const isExpanded = completionTrigger.getAttribute('aria-expanded') === 'true';
    completionTrigger.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
      completionTrigger.setAttribute('aria-expanded', 'true');
      completionPanel.style.maxHeight = completionPanel.scrollHeight + 'px';
    } else {
      completionTrigger.setAttribute('aria-expanded', 'false');
      completionPanel.style.maxHeight = '0px';
    }
  });
}

// ── Upload Video Modal Logic ──
const uploadModal = document.querySelector('[data-upload-modal]');
const openUploadModalBtn = document.querySelector('[data-open-upload-modal]');
const closeUploadModalTriggers = document.querySelectorAll('[data-upload-modal-close]');
const uploadTabs = document.querySelectorAll('[data-upload-tab]');
const uploadPanels = document.querySelectorAll('[data-upload-panel]');
const uploadSubmitBtn = document.querySelector('[data-upload-submit]');

function openUploadModal() {
  if (uploadModal) {
    uploadModal.hidden = false;
    document.body.style.overflow = "hidden";
  }
}

function closeUploadModal() {
  if (uploadModal) {
    uploadModal.hidden = true;
    document.body.style.overflow = "";
  }
}

if (openUploadModalBtn) {
  openUploadModalBtn.addEventListener('click', openUploadModal);
}

closeUploadModalTriggers.forEach(trigger => {
  trigger.addEventListener('click', closeUploadModal);
});

uploadTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    uploadTabs.forEach(t => t.classList.toggle('active', t === tab));
    const targetPanel = tab.getAttribute('data-upload-tab');
    uploadPanels.forEach(panel => {
      const isMatch = panel.getAttribute('data-upload-panel') === targetPanel;
      panel.hidden = !isMatch;
    });
  });
});

// Dropzone & File chosen
const videoFileInput = document.querySelector('[data-video-file-input]');
const dropzoneInner = document.querySelector('[data-dropzone-inner]');
const fileChosen = document.querySelector('[data-file-chosen]');
const chosenName = document.querySelector('[data-chosen-name]');
const removeFileBtn = document.querySelector('[data-remove-file]');

if (videoFileInput && dropzoneInner && fileChosen && chosenName) {
  videoFileInput.addEventListener('change', () => {
    const file = videoFileInput.files[0];
    if (file) {
      chosenName.textContent = file.name;
      fileChosen.hidden = false;
      dropzoneInner.hidden = true;
    }
  });

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      videoFileInput.value = '';
      fileChosen.hidden = true;
      dropzoneInner.hidden = false;
    });
  }
}

if (uploadSubmitBtn) {
  uploadSubmitBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.upload-modal-tab.active');
    const isLinkTab = activeTab && activeTab.getAttribute('data-upload-tab') === 'link';
    
    if (isLinkTab) {
      const linkInput = document.getElementById('video-link');
      const titleInput = document.getElementById('video-link-title');
      if (!linkInput || !titleInput || !linkInput.value || !titleInput.value) {
        alert('الرجاء تعبئة الحقول المطلوبة');
        return;
      }
      alert('تم إضافة الفيديو بنجاح! 🎉');
    } else {
      const titleInput = document.getElementById('video-title');
      if (!videoFileInput || !videoFileInput.files[0] || !titleInput || !titleInput.value) {
        alert('الرجاء اختيار ملف وتعبئة عنوان الفيديو');
        return;
      }
      alert('تم رفع الفيديو بنجاح! 🎉');
    }
    closeUploadModal();
  });
}
