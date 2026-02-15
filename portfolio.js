const typewriterText = document.querySelector(".typewriter-text");
const titles = ["Frontend Developer", "React Developer", "Web Designer", "Full Stack Developer", "AI Developer"];
let currentIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentTitle = titles[currentIndex];
  const visibleText = currentTitle.substring(0, charIndex);
  typewriterText.textContent = visibleText;

  if (!isDeleting && charIndex < currentTitle.length) {
    charIndex++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      currentIndex = (currentIndex + 1) % titles.length;
    }
    setTimeout(typeEffect, 1000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  initCircularText();
});


// Modal control
const readMoreBtn = document.getElementById("readMoreBtn");
const modal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

if (readMoreBtn && modal) {
  readMoreBtn.onclick = function () {
    modal.style.display = "block";
  };
}

if (closeModal && modal) {
  closeModal.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Toggle menu open/close on hamburger click
if (menuIcon && navbar) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
  };
}

// Close menu when any navbar link is clicked (optional UX)
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    if (navbar) navbar.classList.remove('active');
    if (menuIcon) menuIcon.classList.remove('bx-x');
  });
});



document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal && modal.style.display === "block") {
    modal.style.display = "none";
  }
});

document.querySelectorAll('.navbar a').forEach(link => {
  link.onclick = () => {
    if (navbar) navbar.classList.remove('active');
    if (menuIcon) menuIcon.classList.remove('bx-x');
  };
});

// Flip Fade Text Animation
function initFlipFadeText() {
  const words = ["Extracurricular Activities", "Additional Activities", "Beyond Academics", "Co-Curricular Activities"];
  const container = document.getElementById('flip-fade-text');
  let currentIndex = 0;
  const intervalTime = 2500;
  const letterDuration = 0.6; // seconds
  const staggerDelay = 0.1; // seconds
  const exitStaggerDelay = 0.05; // seconds

  if (!container) return;

  function showWord(word) {
    container.innerHTML = ''; // Clear previous word
    const letters = word.split('');

    // Create letters
    letters.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'flip-letter';
      if (char === ' ') {
        span.style.width = '0.3em'; // Handle spaces
      }
      container.appendChild(span);

      // Trigger enter animation
      setTimeout(() => {
        span.classList.add('animate');
      }, i * staggerDelay * 1000);
    });

    // Trigger exit animation
    setTimeout(() => {
      const spans = container.querySelectorAll('.flip-letter');
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.classList.remove('animate');
          span.classList.add('exit');
        }, i * exitStaggerDelay * 1000);
      });
    }, intervalTime);
  }

  function loop() {
    showWord(words[currentIndex]);
    currentIndex = (currentIndex + 1) % words.length;
  }

  // Start loop
  loop();
  // Calculate total time for one word cycle: enter stagger + wait + exit stagger? 
  // The previous implementation used a fixed interval. Let's try to match the react logic.
  // React logic: setInterval(updateIndex, interval) where interval = 2500.
  // So every 2500ms it switches.

  // However, my animation logic above sets a timeout for exit inside showWord.
  // If I just call loop every 2500ms + some buffer, it might work.
  // Let's adjust:
  // 1. Enter animation takes: (word.length * stagger) + duration
  // 2. We want to hold it for a bit.
  // 3. Exit animation takes: (word.length * exitStagger) + duration

  // Let's verify the user's React code:
  // interval = 2500ms. 
  // letters enter. 
  // AnimatePresence mode="wait" means it waits for exit to finish before entering new one?
  // The user code has <AnimatePresence mode="wait">. So yes.

  // So:
  // 1. Enter Current Word.
  // 2. Wait.
  // 3. Exit Current Word.
  // 4. Enter Next Word.

  // My manual implementation:
  // It's easier to chain them promises or nested timeouts.

  // Let's rewrite loop to be recursive with calculated delays.
}

// Overwriting the previous initFlipFadeText to be robust manual recursion
function initFlipFadeTextRobust() {
  const words = ["Extracurricular Activities", "Additional Activities", "Beyond Academics", "Co-Curricular Activities"];
  const container = document.getElementById('flip-fade-text');
  let currentIndex = 0;
  const letterDuration = 600; // ms
  const staggerDelay = 100; // ms
  const exitStaggerDelay = 50; // ms
  const holdTime = 1500; // Time to stay visible

  if (!container) return;

  function animateWord() {
    const word = words[currentIndex];
    container.innerHTML = '';
    const letters = word.split('');
    const spanElements = [];

    // Create DOM
    letters.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'flip-letter';
      if (char === ' ') span.style.width = '0.3em';
      container.appendChild(span);
      spanElements.push(span);
    });

    // ENTER
    spanElements.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add('animate');
      }, i * staggerDelay);
    });

    const totalEnterTime = (letters.length * staggerDelay) + letterDuration;

    // EXIT
    setTimeout(() => {
      spanElements.forEach((span, i) => {
        setTimeout(() => {
          span.classList.remove('animate');
          span.classList.add('exit');
        }, i * exitStaggerDelay);
      });

      const totalExitTime = (letters.length * exitStaggerDelay) + (letterDuration * 0.67);

      // NEXT LOOP
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        animateWord();
      }, totalExitTime);

    }, totalEnterTime + holdTime);
  }

  animateWord();
}

// Circular Text for Avatars
function initCircularText() {
  const avatarNames = document.querySelectorAll('.avatar-name');
  avatarNames.forEach(nameElement => {
    const text = nameElement.innerText;
    nameElement.innerHTML = '';
    nameElement.style.setProperty('--total-chars', text.length);

    const radius = 85; // Distance from center
    const totalAngle = 60; // Total arc length in degrees
    const startAngle = -(totalAngle / 2);
    const anglePerChar = totalAngle / (text.length - 1 || 1);

    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      const rotateAngle = startAngle + (index * anglePerChar);

      span.style.transform = `rotate(${rotateAngle}deg) translateY(-${radius}px)`;
      span.style.position = 'absolute';
      span.style.left = '50%';
      span.style.top = '50%';
      span.style.transformOrigin = 'center center'; // We translate upwards, so origin can be center
      // Actually, better approach for clean arc:
      // Rotate the span, then translate outward.

      nameElement.appendChild(span);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  initCircularText();
  initFlipFadeTextRobust();
});
