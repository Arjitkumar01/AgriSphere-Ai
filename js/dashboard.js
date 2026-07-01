/* =====================================================
   AGRISPHERE AI — DASHBOARD JAVASCRIPT
   =====================================================
   Sections:
   1. Mobile Sidebar Toggle
   2. Animated Progress Bars (Crop Health / Water Level)
   3. Analytics Charts (Chart.js)
   ===================================================== */


/* -----------------------------------------------------
   1. MOBILE SIDEBAR TOGGLE
   On mobile, the sidebar is hidden off-screen by default
   (see .sidebar in dashboard.css). Clicking the hamburger
   button slides it in, and clicking the dark overlay
   (or a sidebar link) slides it back out.
------------------------------------------------------ */
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Small helper function so we don't repeat the same two lines everywhere
function openSidebar() {
  sidebar.classList.add('sidebar--open');
  sidebarOverlay.classList.add('sidebar-overlay--visible');
}

function closeSidebar() {
  sidebar.classList.remove('sidebar--open');
  sidebarOverlay.classList.remove('sidebar-overlay--visible');
}

sidebarToggle.addEventListener('click', () => {
  // If it's already open, close it — otherwise open it
  if (sidebar.classList.contains('sidebar--open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

// Tapping the dark overlay closes the sidebar (common mobile pattern)
sidebarOverlay.addEventListener('click', closeSidebar);

// Closing the sidebar automatically after clicking a navigation link
// keeps the experience smooth when jumping between pages on mobile
document.querySelectorAll('.sidebar__link').forEach((link) => {
  link.addEventListener('click', closeSidebar);
});


/* -----------------------------------------------------
   2. ANIMATED PROGRESS BARS
   Same pattern used on the landing page: each bar has a
   "data-fill" attribute, and we animate its width once
   the page has loaded (no need to wait for scroll here,
   since these cards are visible immediately on load).
------------------------------------------------------ */
function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-bar__fill');

  bars.forEach((bar) => {
    const fillPercent = bar.getAttribute('data-fill');
    // A tiny delay lets the browser paint the 0% state first,
    // so the width transition (defined in CSS) actually plays
    setTimeout(() => {
      bar.style.width = fillPercent + '%';
    }, 200);
  });
}

animateProgressBars();


/* -----------------------------------------------------
   3. ANALYTICS CHARTS (Chart.js)
   Two charts are created here:
   - healthChart: a line chart showing crop health over 7 days
   - waterChart: a bar chart showing water usage per field

   Chart.js reads its colors from plain JS values, so we
   define a small color palette here that matches our CSS
   variables (Chart.js cannot read CSS variables directly).
------------------------------------------------------ */

// Colors matching our CSS palette (kept in sync with style.css :root)
const chartColors = {
  accent: '#81C784',
  secondary: '#43A047',
  gridLine: 'rgba(255, 255, 255, 0.08)',
  textSoft: '#B9D8C4',
};

// Shared options used by both charts, so the look stays consistent
const sharedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // we only have one dataset per chart, so no legend needed
  },
  scales: {
    x: {
      ticks: { color: chartColors.textSoft, font: { family: 'Poppins', size: 11 } },
      grid: { color: chartColors.gridLine },
    },
    y: {
      ticks: { color: chartColors.textSoft, font: { family: 'Poppins', size: 11 } },
      grid: { color: chartColors.gridLine },
    },
  },
};

// --- Chart 1: Crop Health Trend (Line Chart) ---
const healthChartCtx = document.getElementById('healthChart');

if (healthChartCtx) {
  new Chart(healthChartCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Crop Health %',
          data: [82, 85, 84, 88, 90, 89, 91],
          borderColor: chartColors.accent,
          backgroundColor: 'rgba(129, 199, 132, 0.15)',
          tension: 0.4, // makes the line curved instead of straight segments
          fill: true,
          pointBackgroundColor: chartColors.accent,
          pointRadius: 4,
        },
      ],
    },
    options: sharedChartOptions,
  });
}

// --- Chart 2: Water Usage by Field (Bar Chart) ---
const waterChartCtx = document.getElementById('waterChart');

if (waterChartCtx) {
  new Chart(waterChartCtx, {
    type: 'bar',
    data: {
      labels: ['Field A', 'Field B', 'Field C', 'Field D'],
      datasets: [
        {
          label: 'Liters Used',
          data: [1200, 1800, 950, 1400],
          backgroundColor: chartColors.secondary,
          borderRadius: 8, // rounded bar tops, matches our rounded-corner design language
          maxBarThickness: 48,
        },
      ],
    },
    options: sharedChartOptions,
  });
}
