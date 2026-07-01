/* =====================================================
   AGRISPHERE AI — IRRIGATION PAGE JAVASCRIPT
   =====================================================
   IMPORTANT: No real sensors or AI model are connected
   yet. All values used here are DUMMY PLACEHOLDER DATA,
   just to demonstrate the interface and flow.

   Sections:
   1. Placeholder Irrigation Data
   2. Animate the Water Gauge (circular conic-gradient)
   3. Animate the Soil Moisture Progress Bar
   4. Apply Suggestion Button
   ===================================================== */


/* -----------------------------------------------------
   1. PLACEHOLDER IRRIGATION DATA
   In a real version of this page, this object would come
   from a sensor/API call. For now we hardcode a believable
   value representing "how much water the field needs".
------------------------------------------------------ */
const irrigationData = {
  waterNeedPercent: 68, // drives the circular Water Gauge
  soilMoisturePercent: 42, // drives the Soil Moisture progress bar
};


/* -----------------------------------------------------
   2. ANIMATE THE WATER GAUGE
   The gauge is a circle styled with a CSS conic-gradient
   (set inline in irrigation.html). To "animate" it filling
   up, we gradually increase the gradient's angle from 0deg
   to its target value using setInterval, and update the
   percentage label at the same time.
------------------------------------------------------ */
function animateWaterGauge(targetPercent) {
  const gauge = document.getElementById('waterGauge');
  const gaugeValueLabel = document.getElementById('waterGaugeValue');

  if (!gauge || !gaugeValueLabel) return;

  let currentPercent = 0;

  const gaugeInterval = setInterval(() => {
    currentPercent++;

    // Convert percentage (0-100) into degrees (0-360) for the conic-gradient
    const degrees = (currentPercent / 100) * 360;
    gauge.style.background = `conic-gradient(var(--color-accent) ${degrees}deg, rgba(255,255,255,0.08) ${degrees}deg)`;
    gaugeValueLabel.textContent = currentPercent + '%';

    if (currentPercent >= targetPercent) {
      clearInterval(gaugeInterval);
    }
  }, 15); // small delay between each 1% step, for a smooth fill animation
}

// Run the gauge animation once the page loads
animateWaterGauge(irrigationData.waterNeedPercent);


/* -----------------------------------------------------
   3. ANIMATE THE SOIL MOISTURE PROGRESS BAR
   Same pattern used across the rest of the dashboard:
   read the "data-fill" attribute and animate the bar's
   width to that value shortly after the page loads.
------------------------------------------------------ */
function animateMoistureBar() {
  const bar = document.getElementById('soilMoistureBar');
  if (!bar) return;

  const fillPercent = bar.getAttribute('data-fill');

  setTimeout(() => {
    bar.style.width = fillPercent + '%';
  }, 200);
}

animateMoistureBar();


/* -----------------------------------------------------
   4. APPLY SUGGESTION BUTTON
   Clicking this button simulates accepting the AI's
   irrigation recommendation. Since there's no backend yet,
   we simply give the user visual feedback by disabling the
   button and changing its label — a real version would send
   this action to a server/irrigation controller.
------------------------------------------------------ */
const applyBtn = document.getElementById('applyRecommendationBtn');

if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    applyBtn.textContent = '✅ Suggestion Applied';
    applyBtn.disabled = true;
    applyBtn.style.opacity = '0.7';
    applyBtn.style.cursor = 'default';
  });
}
