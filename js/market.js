/* =====================================================
   AGRISPHERE AI — MARKET DASHBOARD JAVASCRIPT
   =====================================================
   IMPORTANT: No real market/mandi API is connected yet.
   All prices, markets, and news below are PLACEHOLDER
   DATA, used only to demonstrate the interface and flow.

   Sections:
   1. Placeholder Data (Prices, Markets, News)
   2. Build Crop Price Cards
   3. Build Nearby Markets List
   4. Build Market News List
   5. Price Trend Chart (Chart.js)
   ===================================================== */


/* -----------------------------------------------------
   1. PLACEHOLDER DATA
   In a real version of this page, all of this would come
   from a live mandi-price API. For now we hardcode
   realistic-looking dummy values.
------------------------------------------------------ */

// Current price + change for each crop. "change" is the percentage
// moved since yesterday (positive = price went up, negative = down).
const cropPrices = [
  { name: 'Rice', icon: '🌾', price: 2150, unit: 'quintal', change: 3.2 },
  { name: 'Wheat', icon: '🌿', price: 2080, unit: 'quintal', change: -1.5 },
  { name: 'Tomato', icon: '🍅', price: 1800, unit: 'quintal', change: 6.8 },
  { name: 'Potato', icon: '🥔', price: 1200, unit: 'quintal', change: -2.1 },
  { name: 'Onion', icon: '🧅', price: 1650, unit: 'quintal', change: 4.4 },
];

// 7-day price history for each crop, used by the Price Trend Graph.
// Keys match the <option value="..."> attributes in the dropdown.
const priceHistory = {
  rice: [2020, 2055, 2090, 2070, 2110, 2130, 2150],
  wheat: [2150, 2130, 2120, 2100, 2090, 2085, 2080],
  tomato: [1500, 1550, 1620, 1700, 1750, 1780, 1800],
  potato: [1260, 1245, 1230, 1220, 1210, 1205, 1200],
  onion: [1500, 1530, 1560, 1580, 1610, 1630, 1650],
};

// Nearby mandis (markets) the farmer could sell at
const nearbyMarkets = [
  { name: 'Patna Mandi', distance: '4.2 km', icon: '🏪', status: 'Open' },
  { name: 'Danapur Market', distance: '7.8 km', icon: '🏪', status: 'Open' },
  { name: 'Phulwari Sharif Mandi', distance: '11.5 km', icon: '🏪', status: 'Closed' },
  { name: 'Bihta Market', distance: '15.1 km', icon: '🏪', status: 'Open' },
];

// Recent market-related news headlines
const marketNews = [
  { icon: '📈', text: 'Tomato prices surge 7% amid supply shortage in eastern states.', time: '2 hours ago' },
  { icon: '🌾', text: 'Government announces increased MSP for wheat ahead of next season.', time: '6 hours ago' },
  { icon: '🚚', text: 'Improved transport links expected to reduce onion price volatility.', time: 'Yesterday' },
  { icon: '📉', text: 'Potato prices dip slightly as new harvest reaches major mandis.', time: '2 days ago' },
];


/* -----------------------------------------------------
   2. BUILD CROP PRICE CARDS
   One card per crop, generated from the "cropPrices" array
   above and inserted into #priceCardsGrid. Each card reuses
   the existing .overview-card look, with a Price Change
   Indicator (▲/▼ + %) styled using the same tag classes
   already defined in style.css/dashboard.css.
------------------------------------------------------ */
function buildPriceCards() {
  const grid = document.getElementById('priceCardsGrid');
  if (!grid) return;

  cropPrices.forEach((crop) => {
    const isUp = crop.change >= 0;

    // Reuse the existing "good"/"danger" tag colors to represent
    // price going up (good for the farmer) or down
    const tagClass = isUp ? 'overview-card__tag--good' : 'overview-card__tag--danger';
    const arrow = isUp ? '▲' : '▼';

    const card = document.createElement('article');
    card.className = 'overview-card glass';

    card.innerHTML = `
      <div class="overview-card__top">
        <span class="overview-card__icon">${crop.icon}</span>
        <span class="overview-card__tag ${tagClass}">${arrow} ${Math.abs(crop.change)}%</span>
      </div>
      <h3 class="overview-card__value">₹${crop.price.toLocaleString()}</h3>
      <p class="overview-card__label">${crop.name} · per ${crop.unit}</p>
    `;

    grid.appendChild(card);
  });
}

buildPriceCards();


/* -----------------------------------------------------
   3. BUILD NEARBY MARKETS LIST
   Generated from the "nearbyMarkets" array and inserted
   into #nearbyMarketsList, reusing the same .activity-item
   structure used for "Recent Activity" on the dashboard.
------------------------------------------------------ */
function buildNearbyMarkets() {
  const list = document.getElementById('nearbyMarketsList');
  if (!list) return;

  nearbyMarkets.forEach((market) => {
    const isOpen = market.status === 'Open';

    const item = document.createElement('li');
    item.className = 'activity-item';

    item.innerHTML = `
      <span class="activity-item__icon">${market.icon}</span>
      <div>
        <p>${market.name} — <strong>${market.distance}</strong></p>
        <span class="activity-item__time" style="color: ${isOpen ? 'var(--color-accent)' : 'var(--color-danger)'};">
          ${market.status} now
        </span>
      </div>
    `;

    list.appendChild(item);
  });
}

buildNearbyMarkets();


/* -----------------------------------------------------
   4. BUILD MARKET NEWS LIST
   Generated from the "marketNews" array and inserted into
   #marketNewsList, same .activity-item structure as above.
------------------------------------------------------ */
function buildMarketNews() {
  const list = document.getElementById('marketNewsList');
  if (!list) return;

  marketNews.forEach((news) => {
    const item = document.createElement('li');
    item.className = 'activity-item';

    item.innerHTML = `
      <span class="activity-item__icon">${news.icon}</span>
      <div>
        <p>${news.text}</p>
        <span class="activity-item__time">${news.time}</span>
      </div>
    `;

    list.appendChild(item);
  });
}

buildMarketNews();


/* -----------------------------------------------------
   5. PRICE TREND CHART (Chart.js)
   A line chart showing the past 7 days of prices for
   whichever crop is selected in the dropdown. Re-draws
   itself whenever the farmer picks a different crop.
------------------------------------------------------ */

// Colors matching our CSS palette (Chart.js can't read CSS variables directly)
const chartColors = {
  accent: '#81C784',
  gridLine: 'rgba(255, 255, 255, 0.08)',
  textSoft: '#B9D8C4',
};

let priceTrendChart = null; // holds the current Chart.js instance so we can destroy/redraw it

function renderPriceTrendChart(cropKey) {
  const canvas = document.getElementById('priceTrendChart');
  if (!canvas) return;

  const data = priceHistory[cropKey];
  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];

  // If a chart already exists, destroy it first — Chart.js can't draw
  // a new chart on a canvas that already has one without this step
  if (priceTrendChart) {
    priceTrendChart.destroy();
  }

  priceTrendChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Price (₹ per quintal)',
          data: data,
          borderColor: chartColors.accent,
          backgroundColor: 'rgba(129, 199, 132, 0.15)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: chartColors.accent,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
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
    },
  });
}

// Draw the chart for "Rice" by default when the page first loads
renderPriceTrendChart('rice');

// Redraw the chart whenever the farmer selects a different crop
const trendCropSelect = document.getElementById('trendCropSelect');
if (trendCropSelect) {
  trendCropSelect.addEventListener('change', () => {
    renderPriceTrendChart(trendCropSelect.value);
  });
}
