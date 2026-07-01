/* =====================================================
   AGRISPHERE AI — SOIL ANALYSIS JAVASCRIPT
   =====================================================
   IMPORTANT: No real AI/soil-science model is connected
   yet. The "analysis" below uses simple placeholder rules
   based on the entered numbers, just to demonstrate the
   user interface and flow with realistic-looking results.

   Sections:
   1. Element References
   2. Spinner Animation (pure JS, same pattern as disease.js)
   3. Form Submit -> Loading -> Dummy Result Logic
   4. Dummy Soil Analysis Calculation
   ===================================================== */


/* -----------------------------------------------------
   1. ELEMENT REFERENCES
------------------------------------------------------ */
const soilForm = document.getElementById('soilForm');
const soilLoadingCard = document.getElementById('soilLoadingCard');
const soilSpinner = document.getElementById('soilSpinner');
const soilResultSection = document.getElementById('soilResultSection');

const nitrogenInput = document.getElementById('nitrogenInput');
const phosphorusInput = document.getElementById('phosphorusInput');
const potassiumInput = document.getElementById('potassiumInput');
const phInput = document.getElementById('phInput');
const organicMatterInput = document.getElementById('organicMatterInput');


/* -----------------------------------------------------
   2. SPINNER ANIMATION
   Same approach as disease.js: a small circle is rotated
   continuously with requestAnimationFrame, so we don't
   need to add any new CSS file just for one animation.
------------------------------------------------------ */
soilSpinner.style.width = '46px';
soilSpinner.style.height = '46px';
soilSpinner.style.margin = '0 auto';
soilSpinner.style.borderRadius = '50%';
soilSpinner.style.border = '4px solid rgba(255,255,255,0.08)';
soilSpinner.style.borderTopColor = 'var(--color-accent)';

let soilSpinnerAngle = 0;
let soilSpinnerFrameId = null;

function startSoilSpinner() {
  function rotateFrame() {
    soilSpinnerAngle = (soilSpinnerAngle + 6) % 360;
    soilSpinner.style.transform = `rotate(${soilSpinnerAngle}deg)`;
    soilSpinnerFrameId = requestAnimationFrame(rotateFrame);
  }
  rotateFrame();
}

function stopSoilSpinner() {
  if (soilSpinnerFrameId) {
    cancelAnimationFrame(soilSpinnerFrameId);
    soilSpinnerFrameId = null;
  }
}


/* -----------------------------------------------------
   3. FORM SUBMIT -> LOADING -> DUMMY RESULT LOGIC
   When the farmer submits the soil form, we simulate an
   AI request: show the loading card briefly, then reveal
   the result section filled in using simple placeholder
   logic based on the entered values.
------------------------------------------------------ */
soilForm.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading on submit

  // Step 1: hide any previous result and show the loading card
  soilResultSection.style.display = 'none';
  soilLoadingCard.style.display = 'flex';
  startSoilSpinner();

  // Step 2: simulate AI processing time (DUMMY — no real AI call yet)
  setTimeout(() => {
    stopSoilSpinner();
    soilLoadingCard.style.display = 'none';

    // Read the farmer's entered values
    const soilData = {
      nitrogen: parseFloat(nitrogenInput.value) || 0,
      phosphorus: parseFloat(phosphorusInput.value) || 0,
      potassium: parseFloat(potassiumInput.value) || 0,
      ph: parseFloat(phInput.value) || 0,
      organicMatter: parseFloat(organicMatterInput.value) || 0,
    };

    const result = calculateDummySoilAnalysis(soilData);
    displaySoilResult(result);
  }, 2000); // 2 second fake "analysis" delay
});


/* -----------------------------------------------------
   4. DUMMY SOIL ANALYSIS CALCULATION
   This is a PLACEHOLDER scoring system, not real agronomy.
   It just turns the entered numbers into a believable score,
   status, crop suggestion, fertilizer tip, and yield estimate
   so the interface has something realistic to display.
   Replace this entire function with a real API call once
   the AI backend is connected.
------------------------------------------------------ */
function calculateDummySoilAnalysis(data) {
  // --- Soil Health Score (0–100) ---
  // Very simplified placeholder formula: rewards balanced N-P-K,
  // a near-neutral pH (close to 6.5), and higher organic matter.
  const npkScore = Math.min(100, (data.nitrogen / 300) * 40 + (data.phosphorus / 30) * 30 + (data.potassium / 200) * 30);
  const phScore = 100 - Math.abs(data.ph - 6.5) * 20; // closer to 6.5 = better
  const organicScore = Math.min(100, data.organicMatter * 20);

  let healthScore = Math.round((npkScore * 0.5) + (phScore * 0.3) + (organicScore * 0.2));
  healthScore = Math.max(0, Math.min(100, healthScore)); // clamp between 0–100

  // --- Soil Status Indicator (based on the health score) ---
  let status, statusTagClass, statusIcon;
  if (healthScore >= 75) {
    status = 'Good';
    statusTagClass = 'overview-card__tag--good';
    statusIcon = '🟢';
  } else if (healthScore >= 50) {
    status = 'Moderate';
    statusTagClass = 'overview-card__tag--warning';
    statusIcon = '🟡';
  } else {
    status = 'Poor';
    statusTagClass = 'overview-card__tag--danger';
    statusIcon = '🔴';
  }

  // --- Recommended Crop (simple placeholder logic based on pH) ---
  let recommendedCrop;
  if (data.ph < 6) {
    recommendedCrop = 'Your soil is slightly acidic — <strong>Potato</strong> or <strong>Tea</strong> would do well here, alongside lime treatment to raise pH over time.';
  } else if (data.ph > 7.5) {
    recommendedCrop = 'Your soil is slightly alkaline — <strong>Barley</strong> or <strong>Cotton</strong> are good matches, alongside gypsum treatment to lower pH over time.';
  } else {
    recommendedCrop = 'Based on the nutrient balance and pH level, <strong>Wheat</strong> is the best-suited crop for this soil this season, with a secondary option of Mustard for rotation.';
  }

  // --- Recommended Fertilizer (placeholder logic based on N level) ---
  let recommendedFertilizer;
  if (data.nitrogen < 200) {
    recommendedFertilizer = 'Nitrogen levels are on the lower side. Apply Urea at 100 kg/ha alongside NPK 20:10:10 at 150 kg/ha to boost early growth.';
  } else {
    recommendedFertilizer = 'Apply NPK 20:10:10 at 150 kg/ha, split across two doses — at sowing and 30 days after. Adding 2 tonnes/ha of compost will further improve organic matter over time.';
  }

  // --- Expected Yield (simple placeholder scaling with health score) ---
  const expectedYield = (2.5 + (healthScore / 100) * 3).toFixed(1); // roughly 2.5–5.5 t/ha range

  return {
    healthScore,
    status,
    statusTagClass,
    statusIcon,
    recommendedCrop,
    recommendedFertilizer,
    expectedYield: expectedYield + ' t/ha',
  };
}

// Fills the result section with the calculated dummy values and reveals it
function displaySoilResult(result) {
  // Top summary banner
  document.getElementById('soilStatusTitle').textContent = `${result.status} Soil Condition`;
  document.getElementById('soilStatusSummary').textContent =
    result.status === 'Good'
      ? 'Your soil is well-balanced and ready for the recommended crop below.'
      : result.status === 'Moderate'
      ? 'Your soil is usable but could benefit from the fertilizer plan below.'
      : 'Your soil needs attention before planting — follow the recommendations below.';

  // Health Score
  document.getElementById('healthScoreValue').textContent = result.healthScore;
  const healthScoreBar = document.getElementById('healthScoreBar');
  healthScoreBar.setAttribute('data-fill', result.healthScore);
  healthScoreBar.style.width = '0%';

  // Status indicator card
  const statusTag = document.getElementById('soilStatusTag');
  statusTag.textContent = result.status;
  statusTag.className = 'overview-card__tag ' + result.statusTagClass;
  document.getElementById('soilStatusValue').textContent = result.status;

  // Expected yield
  document.getElementById('expectedYieldValue').textContent = result.expectedYield;

  // Recommended crop + fertilizer (using innerHTML since we bold crop names above)
  document.getElementById('recommendedCropText').innerHTML = result.recommendedCrop;
  document.getElementById('recommendedFertilizerText').textContent = result.recommendedFertilizer;

  // Reveal the result section, then animate the health score bar shortly after
  soilResultSection.style.display = 'block';
  setTimeout(() => {
    healthScoreBar.style.width = result.healthScore + '%';
  }, 100);
}
