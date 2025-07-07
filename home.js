document.addEventListener('DOMContentLoaded', function() {
  // ===== TESTIMONIALS SLIDER =====
  const testimonials = [
    {
      quote: "SkillForge helped me master JavaScript in 3 months through daily exercises!",
      name: "Alex Johnson",
      role: "Fullstack Developer",
      emoji: "👨‍💻"
    },
    {
      quote: "I went from beginner to fluent in Spanish in 6 months with SkillForge.",
      name: "Sophie Williams",
      role: "Teacher",
      emoji: "🇪🇸"
    },
    {
      quote: "My guitar skills improved dramatically thanks to the progress tracking.",
      name: "Thomas Lee",
      role: "Musician",
      emoji: "🎸"
    }
  ];

  const testimonialElement = document.querySelector('.testimonial-card');
  if (!testimonialElement) return;

  let currentTestimonial = 0;
  let rotationInterval;
  let isPaused = false;

  // Create navigation dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'testimonial-dots';
  testimonials.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.setAttribute('aria-label', `View testimonial ${index + 1}`);
    dot.addEventListener('click', () => showTestimonial(index));
    dotsContainer.appendChild(dot);
  });
  testimonialElement.parentNode.appendChild(dotsContainer);

  function showTestimonial(index) {
    currentTestimonial = (index + testimonials.length) % testimonials.length;
    const testimonial = testimonials[currentTestimonial];
    
    testimonialElement.innerHTML = `
      <p>"${testimonial.quote}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${testimonial.emoji}</div>
        <div class="author-info">
          <h4>${testimonial.name}</h4>
          <p>${testimonial.role}</p>
        </div>
      </div>
    `;
    
    // Update active dot
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentTestimonial);
    });
  }

  function rotateTestimonial() {
    if (!isPaused) {
      showTestimonial(currentTestimonial + 1);
    }
  }

  function startRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
    rotationInterval = setInterval(rotateTestimonial, 5000);
  }

  // Pause on hover/focus
  testimonialElement.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  
  testimonialElement.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  testimonialElement.addEventListener('focusin', () => {
    isPaused = true;
  });

  testimonialElement.addEventListener('focusout', () => {
    isPaused = false;
  });

  // Touch events for mobile
  testimonialElement.addEventListener('touchstart', () => {
    isPaused = true;
    clearInterval(rotationInterval);
  });

  testimonialElement.addEventListener('touchend', () => {
    isPaused = false;
    startRotation();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showTestimonial(currentTestimonial - 1);
      resetRotation();
    } else if (e.key === 'ArrowRight') {
      showTestimonial(currentTestimonial + 1);
      resetRotation();
    }
  });

  function resetRotation() {
    clearInterval(rotationInterval);
    startRotation();
  }

  // Initialize
  showTestimonial(0);
  startRotation();

  // ===== SCROLL REVEAL ANIMATIONS =====
  const scrollReveal = debounce(function() {
    const revealElements = document.querySelectorAll('.card, .section-title');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    revealElements.forEach(element => {
      if (!element) return;
      
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('revealed');
      }
    });
  }, 100);

  // Intersection Observer for more performant scroll detection
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.card, .section-title').forEach(el => {
      if (el) observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', scrollReveal);
    window.addEventListener('load', scrollReveal);
  }

  // ===== DEBOUNCE HELPER =====
  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
});