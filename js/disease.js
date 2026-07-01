/* =====================================================
   AGRISPHERE AI — DISEASE DETECTION JAVASCRIPT
   =====================================================
   IMPORTANT: No backend/AI is connected yet. All results
   shown here are DUMMY PLACEHOLDER DATA, used only to
   demonstrate the user interface and flow.

   Sections:
   1. Element References
   2. Drag & Drop Upload + Image Preview
   3. Spinner Animation (pure JS, no extra CSS file needed)
   4. Analyze Button -> Loading -> Dummy Result
   5. Add New Scan to History
   ===================================================== */


/* -----------------------------------------------------
   1. ELEMENT REFERENCES
   Grabbing every element we'll need to read from or update.
------------------------------------------------------ */
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

const previewWrap = document.getElementById('previewWrap');
const imagePreview = document.getElementById('imagePreview');
const fileNameLabel = document.getElementById('fileName');

const loadingCard = document.getElementById('loadingCard');
const resultCard = document.getElementById('resultCard');
const spinner = document.getElementById('spinner');

const scanHistoryList = document.getElementById('scanHistoryList');

// Keeps track of whether a file has actually been selected yet
let selectedFile = null;


/* -----------------------------------------------------
   2. DRAG & DROP UPLOAD + IMAGE PREVIEW
------------------------------------------------------ */

// Clicking the drop zone OR the "Choose Image" button opens the file picker
dropZone.addEventListener('click', () => fileInput.click());
uploadBtn.addEventListener('click', () => fileInput.click());

// When a file is chosen through the picker, show its preview
fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files[0]) {
    handleSelectedFile(fileInput.files[0]);
  }
});

// Highlight the drop zone while a file is being dragged over it
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault(); // required to allow dropping
  dropZone.style.borderColor = 'var(--color-accent)';
  dropZone.style.background = 'rgba(129, 199, 132, 0.08)';
});

// Remove the highlight when the file is dragged back out
dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '';
  dropZone.style.background = '';
});

// Handle the actual drop
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.style.borderColor = '';
  dropZone.style.background = '';

  if (event.dataTransfer.files && event.dataTransfer.files[0]) {
    handleSelectedFile(event.dataTransfer.files[0]);
  }
});

// Reusable function: takes a File object and displays it as a preview
function handleSelectedFile(file) {
  // Only accept image files
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (JPG or PNG).');
    return;
  }

  selectedFile = file;

  // FileReader lets us read the image and turn it into a viewable URL
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    fileNameLabel.textContent = file.name;
    previewWrap.style.display = 'block';

    // Now that an image is selected, the Analyze button becomes usable
    analyzeBtn.disabled = false;

    // Hide any previous result so the user re-analyzes the new image
    resultCard.style.display = 'none';
  };
  reader.readAsDataURL(file);
}


/* -----------------------------------------------------
   3. SPINNER ANIMATION
   We build a simple rotating-circle spinner entirely in
   JavaScript (continuously rotating a CSS transform),
   so we don't need to add a new stylesheet just for one
   @keyframes rule. The spinner element itself is styled
   with a couple of inline properties set once below.
------------------------------------------------------ */
spinner.style.width = '46px';
spinner.style.height = '46px';
spinner.style.margin = '0 auto';
spinner.style.borderRadius = '50%';
spinner.style.border = '4px solid rgba(255,255,255,0.08)';
spinner.style.borderTopColor = 'var(--color-accent)';

let spinnerAngle = 0;
let spinnerFrameId = null;

function startSpinner() {
  function rotateFrame() {
    spinnerAngle = (spinnerAngle + 6) % 360; // increase rotation each frame
    spinner.style.transform = `rotate(${spinnerAngle}deg)`;
    spinnerFrameId = requestAnimationFrame(rotateFrame);
  }
  rotateFrame();
}

function stopSpinner() {
  if (spinnerFrameId) {
    cancelAnimationFrame(spinnerFrameId);
    spinnerFrameId = null;
  }
}


/* -----------------------------------------------------
   4. ANALYZE BUTTON -> LOADING -> DUMMY RESULT
   Clicking "Analyze Crop" simulates an AI request:
   it shows the loading card for a couple of seconds,
   then reveals the result card filled with dummy data.
------------------------------------------------------ */

// A small set of placeholder diagnoses so the demo feels dynamic.
// Replace this with a real API call once the AI backend is connected.
const dummyDiagnoses = [
  {
    name: 'Leaf Blight',
    summary: 'Detected with high confidence. Early-stage treatment is recommended.',
    confidence: 94,
    severity: 'Moderate',
    severityPercent: 55,
    recovery: '7–10 Days',
    treatment: 'Apply a copper-based fungicide spray every 7 days for 3 weeks. Remove and discard visibly infected leaves to prevent the disease from spreading to healthy parts of the plant.',
    fertilizer: 'NPK 19:19:19, applied at 2g per liter of water, to strengthen the plant\'s natural resistance while it recovers.',
  },
  {
    name: 'Powdery Mildew',
    summary: 'Detected on upper leaf surfaces. Treat promptly to limit spread.',
    confidence: 88,
    severity: 'Mild',
    severityPercent: 30,
    recovery: '5–7 Days',
    treatment: 'Spray a diluted neem oil solution every 5 days. Improve air circulation around plants by spacing them slightly further apart.',
    fertilizer: 'Potassium-rich fertilizer (NPK 13:0:45) to improve the plant\'s cell wall strength.',
  },
  {
    name: 'Healthy',
    summary: 'No signs of disease detected. Your crop looks great!',
    confidence: 97,
    severity: 'None',
    severityPercent: 5,
    recovery: 'Not applicable',
    treatment: 'No treatment needed. Continue your current watering and fertilizing routine.',
    fertilizer: 'Maintain current balanced fertilizer schedule (NPK 19:19:19).',
  },
];

analyzeBtn.addEventListener('click', () => {
  if (!selectedFile) return; // safety check — button should already be disabled without a file

  // Step 1: hide upload result (if any) and show the loading card
  resultCard.style.display = 'none';
  loadingCard.style.display = 'flex';
  startSpinner();

  // Disable the analyze button while "processing" to prevent double clicks
  analyzeBtn.disabled = true;

  // Step 2: simulate AI processing time with a timeout (DUMMY — no real AI call)
  setTimeout(() => {
    stopSpinner();
    loadingCard.style.display = 'none';

    // Pick a random dummy diagnosis so each scan feels slightly different
    const diagnosis = dummyDiagnoses[Math.floor(Math.random() * dummyDiagnoses.length)];

    displayResult(diagnosis);
    addToScanHistory(diagnosis);

    analyzeBtn.disabled = false;
  }, 2200); // 2.2 second fake "analysis" delay
});

// Fills the result card with the chosen dummy diagnosis and reveals it
function displayResult(diagnosis) {
  document.getElementById('resultDiseaseName').textContent = diagnosis.name;
  document.getElementById('resultSummary').textContent = diagnosis.summary;

  document.getElementById('confidenceValue').textContent = diagnosis.confidence + '%';
  document.getElementById('severityValue').textContent = diagnosis.severity;
  document.getElementById('severityTag').textContent = diagnosis.severity;
  document.getElementById('recoveryValue').textContent = diagnosis.recovery;
  document.getElementById('treatmentText').textContent = diagnosis.treatment;
  document.getElementById('fertilizerText').textContent = diagnosis.fertilizer;

  // Update the two progress bars (confidence + severity)
  const confidenceBar = document.getElementById('confidenceBar');
  const severityBar = document.getElementById('severityBar');

  confidenceBar.setAttribute('data-fill', diagnosis.confidence);
  severityBar.setAttribute('data-fill', diagnosis.severityPercent);

  // Reset width to 0 first so the fill animation (defined in style.css) replays
  confidenceBar.style.width = '0%';
  severityBar.style.width = '0%';

  setTimeout(() => {
    confidenceBar.style.width = diagnosis.confidence + '%';
    severityBar.style.width = diagnosis.severityPercent + '%';
  }, 100);

  resultCard.style.display = 'block';
}


/* -----------------------------------------------------
   5. ADD NEW SCAN TO HISTORY
   Inserts a new entry at the top of the Scan History list
   every time a (dummy) analysis completes, so the page
   feels alive without needing a real database yet.
------------------------------------------------------ */
function addToScanHistory(diagnosis) {
  const isHealthy = diagnosis.name === 'Healthy';

  const listItem = document.createElement('li');
  listItem.className = 'activity-item';

  listItem.innerHTML = `
    <span class="activity-item__icon">${isHealthy ? '🌿' : '⚠️'}</span>
    <div>
      <p>New Scan — <strong>${diagnosis.name}</strong> (${diagnosis.confidence}% confidence)</p>
      <span class="activity-item__time">Just now</span>
    </div>
  `;

  // Add the new entry to the very top of the history list
  scanHistoryList.insertBefore(listItem, scanHistoryList.firstChild);
}
