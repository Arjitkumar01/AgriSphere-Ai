/* =========================================================
   AgriSphere AI — profile.js
   Farmer Profile page logic
   - Populates scan history table from dummy data
   - Language / Notification save buttons → toast feedback
   - Security action buttons → modal-style alerts (dummy)
   - Avatar edit button → file-picker UI (dummy, no upload)
   - Logout button → redirect to index.html
   No backend or real API — all data is placeholder only.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     SECTION 1 — ELEMENT REFERENCES
  ============================================================ */
  const scanHistoryBody  = document.getElementById('scanHistoryBody');
  const profileToast     = document.getElementById('profileToast');
  const saveLangBtn      = document.getElementById('saveLangBtn');
  const saveNotifBtn     = document.getElementById('saveNotifBtn');
  const logoutBtn        = document.getElementById('logoutBtn');
  const avatarEditBtn    = document.getElementById('avatarEditBtn');
  const changePwdBtn     = document.getElementById('changePwdBtn');
  const enable2FABtn     = document.getElementById('enable2FABtn');
  const viewSessionsBtn  = document.getElementById('viewSessionsBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');


  /* ============================================================
     SECTION 2 — DUMMY SCAN HISTORY DATA
     Represents previous disease-detection scans run by the farmer.
     Fields: date, crop, finding, status (healthy | warning | critical)
  ============================================================ */
  const scanHistory = [
    { date: '28 Jun 2025', crop: 'Wheat',  finding: 'No disease detected',         status: 'healthy'  },
    { date: '21 Jun 2025', crop: 'Onion',  finding: 'Mild Thrips infestation',     status: 'warning'  },
    { date: '15 Jun 2025', crop: 'Grapes', finding: 'Downy Mildew (early stage)',  status: 'critical' },
    { date: '07 Jun 2025', crop: 'Wheat',  finding: 'No disease detected',         status: 'healthy'  },
    { date: '30 May 2025', crop: 'Onion',  finding: 'Purple Blotch (mild)',        status: 'warning'  },
    { date: '20 May 2025', crop: 'Grapes', finding: 'No disease detected',         status: 'healthy'  },
    { date: '10 May 2025', crop: 'Wheat',  finding: 'Yellow Rust (leaf sample)',   status: 'critical' },
  ];

  /* Map status values to badge CSS class names */
  const badgeClass = {
    healthy  : 'scan-badge--healthy',
    warning  : 'scan-badge--warning',
    critical : 'scan-badge--critical',
  };

  /* Map status values to human-readable labels */
  const badgeLabel = {
    healthy  : '✅ Healthy',
    warning  : '⚠️ Warning',
    critical : '🔴 Critical',
  };

  /* Build scan history table rows from dummy data */
  function renderScanHistory() {
    scanHistoryBody.innerHTML = '';

    scanHistory.forEach((scan, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${scan.date}</td>
        <td>${scan.crop}</td>
        <td>${scan.finding}</td>
        <td>
          <span class="scan-badge ${badgeClass[scan.status]}">
            ${badgeLabel[scan.status]}
          </span>
        </td>
      `;
      scanHistoryBody.appendChild(tr);
    });
  }

  renderScanHistory();


  /* ============================================================
     SECTION 3 — TOAST NOTIFICATION HELPER
     Shows a brief success/info message at the bottom-right corner.
     Automatically hides after 2.8 seconds.
  ============================================================ */
  function showToast(message) {
    profileToast.textContent = message;
    profileToast.classList.add('profile-toast--visible');

    setTimeout(() => {
      profileToast.classList.remove('profile-toast--visible');
    }, 2800);
  }


  /* ============================================================
     SECTION 4 — LANGUAGE SETTINGS SAVE
     Reads the three dropdowns and shows a confirmation toast.
     No real persistence — dummy confirmation only.
  ============================================================ */
  saveLangBtn.addEventListener('click', () => {
    const lang  = document.getElementById('langSelect').value;
    const units = document.getElementById('unitsSelect').value;
    showToast(`✅ Preferences saved — Language: ${lang.toUpperCase()}, Units: ${units}`);
  });


  /* ============================================================
     SECTION 5 — NOTIFICATION SETTINGS SAVE
     Reads toggle states and summarises how many are active.
  ============================================================ */
  saveNotifBtn.addEventListener('click', () => {
    const toggleIds = ['notifWeather', 'notifDisease', 'notifMarket', 'notifIrrigation', 'notifWeekly'];
    const activeCount = toggleIds.filter(id => document.getElementById(id).checked).length;
    showToast(`🔔 Notification settings saved — ${activeCount} alert(s) active`);
  });


  /* ============================================================
     SECTION 6 — SECURITY ACTION BUTTONS
     All are dummy — no real backend calls are made.
     Each button shows an appropriate alert or toast for demo purposes.
  ============================================================ */

  /* Change Password — dummy alert */
  changePwdBtn.addEventListener('click', () => {
    showToast('🔑 Password change email sent to ramesh@agrisphere.in');
  });

  /* Enable 2FA — dummy confirmation */
  enable2FABtn.addEventListener('click', () => {
    showToast('📱 Two-Factor Authentication setup link sent via SMS');
    enable2FABtn.textContent = 'Pending…';
    enable2FABtn.disabled = true;
    setTimeout(() => {
      enable2FABtn.textContent = 'Enable';
      enable2FABtn.disabled = false;
    }, 3000);
  });

  /* View Active Sessions — dummy info */
  viewSessionsBtn.addEventListener('click', () => {
    alert(
      '📱 Active Sessions:\n\n' +
      '1. Android App — Nashik, MH  (Current)\n' +
      '2. Chrome Browser — Mumbai, MH  (2 days ago)\n\n' +
      'Sign out individual sessions from account settings.'
    );
  });

  /* Delete Account — confirmation guard (dummy) */
  deleteAccountBtn.addEventListener('click', () => {
    const confirmed = confirm(
      '⚠️ Are you sure you want to delete your account?\n\n' +
      'All your farm data, scans and settings will be permanently removed.\n' +
      'This action cannot be undone.'
    );
    if (confirmed) {
      showToast('❌ Account deletion request submitted (demo only — no data removed)');
    }
  });


  /* ============================================================
     SECTION 7 — AVATAR EDIT BUTTON
     Opens a native file picker (dummy UI — no real upload).
     On file selection, previews the chosen image in the avatar element.
  ============================================================ */
  avatarEditBtn.addEventListener('click', () => {
    /* Create a hidden file input and trigger it */
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      /* Preview the selected image using a local object URL */
      const objectUrl = URL.createObjectURL(file);
      document.getElementById('profileAvatar').src = objectUrl;
      showToast('📸 Profile photo updated (preview only)');
    });

    fileInput.click();
  });


  /* ============================================================
     SECTION 8 — LOGOUT BUTTON
     Redirects to the landing page (index.html).
  ============================================================ */
  logoutBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to logout from AgriSphere AI?');
    if (confirmed) {
      window.location.href = 'index.html';
    }
  });

});
