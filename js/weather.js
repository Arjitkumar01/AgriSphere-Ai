/* =====================================================
   AGRISPHERE AI — WEATHER PAGE JAVASCRIPT
   =====================================================
   IMPORTANT: No real weather API is connected yet. All
   values used here are PLACEHOLDER DATA, just to show
   how the page will look and behave once live data is
   wired in.

   Sections:
   1. Placeholder Weather Data
   2. Animate the "Today" Detail Progress Bars
   3. Build the 7-Day Forecast Cards
   ===================================================== */


/* -----------------------------------------------------
   1. PLACEHOLDER WEATHER DATA
   In a real version of this page, this object/array would
   come from a weather API call (e.g. fetch('/api/weather')).
   For now we hardcode realistic-looking dummy values.
------------------------------------------------------ */

// One week of forecast data — each entry represents one day
const weeklyForecast = [
  { day: 'Mon', date: '24 Jun', icon: '☀️', high: 32, low: 24, rain: 10 },
  { day: 'Tue', date: '25 Jun', icon: '⛅', high: 30, low: 23, rain: 20 },
  { day: 'Wed', date: '26 Jun', icon: '🌧️', high: 27, low: 22, rain: 70 },
  { day: 'Thu', date: '27 Jun', icon: '🌧️', high: 26, low: 21, rain: 80 },
  { day: 'Fri', date: '28 Jun', icon: '⛅', high: 29, low: 22, rain: 30 },
  { day: 'Sat', date: '29 Jun', icon: '☀️', high: 31, low: 23, rain: 5 },
  { day: 'Sun', date: '30 Jun', icon: '⛅', high: 28, low: 22, rain: 40 },
];


/* -----------------------------------------------------
   2. ANIMATE THE "TODAY" DETAIL PROGRESS BARS
   Humidity, Rain Probability, and UV Index each have a
   progress bar with a "data-fill" attribute (set directly
   in weather.html). We animate them to their target width
   once the page has finished loading.
------------------------------------------------------ */
function animateWeatherBars() {
  const bars = document.querySelectorAll('.progress-bar__fill');

  bars.forEach((bar) => {
    const fillPercent = bar.getAttribute('data-fill');
    // Small delay so the browser paints the 0% state first,
    // letting the CSS width transition actually play
    setTimeout(() => {
      bar.style.width = fillPercent + '%';
    }, 200);
  });
}

animateWeatherBars();


/* -----------------------------------------------------
   3. BUILD THE 7-DAY FORECAST CARDS
   We generate one small card per day in "weeklyForecast"
   and insert them into the #forecastRow container. Using
   JS to build these (instead of writing 7 near-identical
   blocks in HTML) keeps the markup easy to update later.
------------------------------------------------------ */
function buildForecastCards() {
  const forecastRow = document.getElementById('forecastRow');
  if (!forecastRow) return;

  weeklyForecast.forEach((dayData, index) => {
    // Each card reuses the same visual language as overview-card,
    // styled inline here purely for sizing (fixed width so all 7
    // cards line up evenly in the scrollable row).
    const card = document.createElement('article');
    card.className = 'overview-card glass';
    card.style.flex = '0 0 130px'; // fixed width, doesn't shrink/grow
    card.style.textAlign = 'center';

    // Highlight today's card (last item, since 30 Jun = today) so it
    // stands out from the rest of the week at a glance
    const isToday = index === weeklyForecast.length - 1;
    if (isToday) {
      card.style.borderColor = 'var(--color-accent)';
    }

    card.innerHTML = `
      <p class="overview-card__label" style="font-weight: 600; color: var(--color-text);">
        ${isToday ? 'Today' : dayData.day}
      </p>
      <p class="overview-card__label" style="margin-bottom: 0.5rem;">${dayData.date}</p>
      <div style="font-size: 1.8rem;">${dayData.icon}</div>
      <p style="margin: 0.5rem 0 0.2rem; font-weight: 600;">
        ${dayData.high}° <span style="color: var(--color-text-soft); font-weight: 400;">/ ${dayData.low}°</span>
      </p>
      <p class="overview-card__label">💧 ${dayData.rain}%</p>
    `;

    forecastRow.appendChild(card);
  });
}

buildForecastCards();
