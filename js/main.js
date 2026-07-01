/* =====================================================
   AGRISPHERE AI — MAIN JAVASCRIPT (Landing Page)
   =====================================================
   This file is organized into clear sections:
   1. Mobile Navbar Toggle
   2. Navbar Background on Scroll
   3. Scroll Reveal Animation (fade in + slide up)
   4. Animated Statistics (count up numbers)
   5. Animated Progress Bars (Why Us section)
   ===================================================== */


/* -----------------------------------------------------
   1. MOBILE NAVBAR TOGGLE
   Clicking the hamburger button shows/hides the mobile menu.
------------------------------------------------------ */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  // Toggle the class that shows/hides the mobile menu
  navMobile.classList.toggle('navbar__mobile--open');
});

// Close the mobile menu automatically when a link inside it is clicked
// (so the menu doesn't stay open after navigating to a section)
navMobile.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('navbar__mobile--open');
  });
});


/* -----------------------------------------------------
   2. NAVBAR BACKGROUND ON SCROLL
   Adds a slightly stronger shadow/background once the user
   has scrolled down, so the navbar feels more "solid".
------------------------------------------------------ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});


/* -----------------------------------------------------
   3. SCROLL REVEAL ANIMATION
   We use the Intersection Observer API to detect when an
   element with the class "reveal" enters the viewport.
   When it does, we add "reveal--visible", which triggers
   the fade-in + slide-up CSS transition defined in style.css.
------------------------------------------------------ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        // Stop observing once revealed — no need to keep checking it
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15, // trigger when 15% of the element is visible
  }
);

revealElements.forEach((el) => revealObserver.observe(el));


/* -----------------------------------------------------
   4. ANIMATED STATISTICS (Count Up)
   Each .stat__number element has a "data-target" attribute
   with its final value (e.g. data-target="50000").
   When the stats section scrolls into view, we animate the
   displayed number from 0 up to that target.
------------------------------------------------------ */
const statNumbers = document.querySelectorAll('.stat__number');

// Reusable function: animates a single number element from 0 to target
function animateCountUp(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 1500; // total animation time in milliseconds
  const frameRate = 30; // how many times we update per second
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    // Progress goes from 0 to 1 across the animation
    const progress = frame / totalFrames;
    const currentValue = Math.round(target * progress);

    element.textContent = currentValue.toLocaleString(); // adds commas (e.g. 50,000)

    if (frame >= totalFrames) {
      element.textContent = target.toLocaleString(); // make sure it ends exactly on target
      clearInterval(counter);
    }
  }, 1000 / frameRate);
}

// Only run the count-up once, when the stats section first appears on screen
const statsSection = document.querySelector('.stats');
let statsAnimated = false; // flag so we don't replay the animation every scroll

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statNumbers.forEach((num) => animateCountUp(num));
        statsAnimated = true;
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}


/* -----------------------------------------------------
   5. ANIMATED PROGRESS BARS (Why Us section)
   Each .progress-bar__fill has a "data-fill" attribute
   (e.g. data-fill="72") representing its target width in %.
   We animate the width once the panel scrolls into view.
------------------------------------------------------ */
const progressBars = document.querySelectorAll('.progress-bar__fill');
const whyUsPanel = document.querySelector('.glass-panel');
let progressAnimated = false;

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !progressAnimated) {
        progressBars.forEach((bar) => {
          const fillPercent = bar.getAttribute('data-fill');
          bar.style.width = fillPercent + '%';
        });
        progressAnimated = true;
        progressObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

if (whyUsPanel) {
  progressObserver.observe(whyUsPanel);
}
