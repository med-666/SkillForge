document.addEventListener('DOMContentLoaded', function() {
  // ===== MOBILE NAVIGATION =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links li');
  
  function toggleMobileMenu() {
    if (!hamburger || !navLinks) return;
    
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    hamburger.innerHTML = isExpanded ? '☰' : '✕';
    
    if (!isExpanded) {
      navItems.forEach((item, index) => {
        item.style.animation = `navItemFade 0.5s ease forwards ${index / 7 + 0.3}s`;
      });
    } else {
      navItems.forEach(item => {
        item.style.animation = '';
      });
    }
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }

  // Close mobile menu after click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ===== NAVBAR SCROLL EFFECT =====
  function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(handleScroll, 10));
  handleScroll(); // Initialize on load

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      
      if (target) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // ===== TOOLTIP FUNCTIONALITY =====
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    let tooltipElement;
    
    const showTooltip = (e) => {
      const tooltipText = tooltip.getAttribute('data-tooltip');
      if (!tooltipText) return;
      
      tooltipElement = document.createElement('div');
      tooltipElement.className = 'tooltip';
      tooltipElement.textContent = tooltipText;
      document.body.appendChild(tooltipElement);
      
      const rect = tooltip.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      tooltipElement.style.left = `${rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2}px`;
      tooltipElement.style.top = `${rect.top + scrollTop - tooltipElement.offsetHeight - 10}px`;
    };
    
    const hideTooltip = () => {
      if (tooltipElement) {
        tooltipElement.remove();
        tooltipElement = null;
      }
    };
    
    tooltip.addEventListener('mouseenter', showTooltip);
    tooltip.addEventListener('mouseleave', hideTooltip);
    tooltip.addEventListener('focus', showTooltip);
    tooltip.addEventListener('blur', hideTooltip);
  });

  // Initialize other common functionality
  updateYear();
  document.body.classList.add('loaded');
});

// ===== UTILITY FUNCTIONS =====
function updateYear() {
  const yearElements = document.querySelectorAll('.current-year');
  if (!yearElements.length) return;
  
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

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

// ===== PERFORMANCE OBSERVER =====
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('[Performance]', entry.name, entry.duration.toFixed(2), 'ms');
    }
  });
  observer.observe({ entryTypes: ['measure', 'longtask'] });
}

// ===== LOADING STATE MANAGEMENT =====
function setLoadingState(element, isLoading) {
  if (!element) return;
  
  if (isLoading) {
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
  } else {
    element.classList.remove('loading');
    element.removeAttribute('aria-busy');
  }
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    updateYear,
    setLoadingState
  };
}

