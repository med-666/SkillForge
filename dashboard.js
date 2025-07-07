document.addEventListener('DOMContentLoaded', function() {
  // ===== ACTIVITY TRACKING =====
  const activityItems = document.querySelectorAll('.activity-item');
  const activityStorageKey = 'skillforge-read-activities';
  
  // Get read items from localStorage
  let readActivities = JSON.parse(localStorage.getItem(activityStorageKey)) || [];

  // Initialize activity items
  function initializeActivities() {
    activityItems.forEach(item => {
      const activityId = item.dataset.activityId || generateActivityId(item);
      item.dataset.activityId = activityId;
      
      if (readActivities.includes(activityId)) {
        item.classList.add('read');
      }
      
      // Add click handler
      item.addEventListener('click', function() {
        markActivityAsRead(activityId, item);
      });
      
      // Keyboard support
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          markActivityAsRead(activityId, item);
        }
      });
      
      // Make items focusable
      item.setAttribute('tabindex', '0');
    });
  }

  // Generate unique ID for activity if none exists
  function generateActivityId(item) {
    const content = item.textContent.trim();
    return 'activity-' + hashCode(content);
  }

  // Simple hash function for generating IDs
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // Mark activity as read
  function markActivityAsRead(id, element) {
    if (!readActivities.includes(id)) {
      readActivities.push(id);
      localStorage.setItem(activityStorageKey, JSON.stringify(readActivities));
    }
    element.classList.add('read');
    
    // Optional: Send to analytics
    trackActivityEngagement(id);
  }

  // Analytics tracking
  function trackActivityEngagement(activityId) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'activity_engagement', {
        'event_category': 'engagement',
        'event_label': activityId
      });
    }
    console.log('Activity engaged:', activityId);
  }

  // Initialize activity tracking
  if (activityItems.length) {
    initializeActivities();
  }

  // ===== PROGRESS BARS ANIMATION =====
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 100);
    });
  }

  // Animate on scroll
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars();
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-card').forEach(card => {
    if (card) progressObserver.observe(card);
  });

  // ===== STATS COUNTER ANIMATION =====
  function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
      const targetText = stat.textContent;
      const isNumber = !isNaN(parseFloat(targetText));
      
      if (isNumber) {
        animateNumber(stat, parseFloat(targetText));
      } else if (targetText.includes('days') || targetText.includes('hrs')) {
        animateText(stat, targetText);
      }
    });
  }

  function animateNumber(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  function animateText(element, targetText) {
    let currentText = '';
    const letters = targetText.split('');
    let i = 0;
    
    const timer = setInterval(() => {
      if (i >= letters.length) {
        clearInterval(timer);
        return;
      }
      currentText += letters[i];
      element.textContent = currentText;
      i++;
    }, 100);
  }

  // Initialize stats animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-overview');
  if (statsSection) statsObserver.observe(statsSection);

  // ===== SKILL CARD INTERACTIONS =====
  document.querySelectorAll('.skill-card').forEach(card => {
    if (!card) return;
    
    card.addEventListener('click', function(e) {
      // Don't redirect if clicking on a button or link
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
      
      const detailLink = this.querySelector('.btn');
      if (detailLink) {
        detailLink.click();
      }
    });
  });

  // ===== RESIZE HANDLER =====
  function handleResize() {
    // Recalculate any layout-dependent elements
    animateProgressBars();
  }

  const debouncedResize = debounce(handleResize, 250);
  window.addEventListener('resize', debouncedResize);

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