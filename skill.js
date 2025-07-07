document.addEventListener('DOMContentLoaded', function() {
  // ===== MOBILE MENU TOGGLE =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
  }

  // ===== CHART DATA =====
  const chartData = {
    week: {
      consistency: [65, 59, 80, 81, 56, 55, 40],
      distribution: [30, 25, 20, 15, 10],
      timeSpent: [12, 19, 3, 5, 2],
      completion: [75, 25],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    month: {
      consistency: [28, 48, 40, 19, 86, 27, 90, 45, 60, 30, 70, 55],
      distribution: [25, 20, 18, 22, 15],
      timeSpent: [45, 30, 10, 10, 5],
      completion: [82, 18],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    year: {
      consistency: Array(12).fill(0).map((_, i) => 30 + Math.floor(Math.random() * 60)),
      distribution: [35, 20, 15, 20, 10],
      timeSpent: [200, 150, 80, 70, 50],
      completion: [88, 12],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    all: {
      consistency: Array(52).fill(0).map((_, i) => 40 + Math.floor(Math.random() * 50)),
      distribution: [40, 20, 15, 15, 10],
      timeSpent: [500, 300, 150, 100, 50],
      completion: [90, 10],
      labels: ['Year 1', 'Year 2', 'Year 3']
    }
  };

  // ===== FILTER BUTTONS =====
  const filterButtons = document.querySelectorAll('.filter-btn');
  let currentFilter = 'week';

  function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Update UI
    filterButtons.forEach(btn => {
      const isActive = btn.textContent.toLowerCase().replace(' ', '') === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
    
    // Update charts
    updateCharts(filter);
  }

  // ===== CHART FUNCTIONS =====
  function updateCharts(filter) {
    const data = chartData[filter];
    const placeholders = document.querySelectorAll('.chart-placeholder');
    
    placeholders.forEach((placeholder, index) => {
      // Show loading state
      placeholder.innerHTML = `
        <div class="chart-loading">
          <div class="chart-spinner"></div>
          <p>Loading chart data...</p>
        </div>
      `;
      
      // Simulate data loading
      setTimeout(() => {
        let chartContent = '';
        
        switch(index) {
          case 0: // Consistency chart
            chartContent = createBarChart(data.consistency, data.labels);
            break;
          case 1: // Distribution chart
            chartContent = createPieChart(data.distribution);
            break;
          case 2: // Time spent chart
            chartContent = createHorizontalBarChart(data.timeSpent);
            break;
          case 3: // Completion chart
            chartContent = createDonutChart(data.completion[0]);
            break;
        }
        
        placeholder.innerHTML = chartContent;
        animateChartElements(placeholder);
      }, 800);
    });
  }

  function createBarChart(data, labels) {
    const maxValue = Math.max(...data);
    return `
      <div class="chart-bar-container">
        ${data.map((value, i) => `
          <div class="chart-bar-wrapper" aria-label="${labels[i]}: ${value}%">
            <div class="chart-bar" 
                 style="height: ${(value / maxValue) * 100}%" 
                 data-value="${value}"></div>
            <span class="chart-label">${labels[i]}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function createPieChart(data) {
    const total = data.reduce((sum, val) => sum + val, 0);
    const percentages = data.map(val => Math.round((val / total) * 100));
    
    return `
      <div class="chart-pie-container">
        <div class="chart-pie" style="${generatePieStyle(percentages)}"></div>
        <div class="chart-legend">
          ${['Technology', 'Music', 'Sports', 'Languages', 'Other'].map((label, i) => `
            <div class="legend-item">
              <span class="legend-color" style="background-color: ${getChartColor(i)}"></span>
              <span>${label} (${percentages[i]}%)</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function generatePieStyle(percentages) {
    let accumulated = 0;
    let styles = [];
    
    percentages.forEach((percent, i) => {
      styles.push(`${getChartColor(i)} ${accumulated}% ${accumulated + percent}%`);
      accumulated += percent;
    });
    
    return `background: conic-gradient(${styles.join(', ')});`;
  }

  function createHorizontalBarChart(data) {
    const maxValue = Math.max(...data);
    return `
      <div class="chart-horizontal">
        ${data.map((value, i) => `
          <div class="chart-horizontal-item">
            <span class="chart-label">${['Technology', 'Music', 'Sports', 'Languages', 'Other'][i]}</span>
            <div class="chart-bar-horizontal-wrapper">
              <div class="chart-bar-horizontal" 
                   style="width: ${(value / maxValue) * 100}%" 
                   data-value="${value} hrs"></div>
              <span class="chart-value">${value} hrs</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function createDonutChart(value) {
    return `
      <div class="chart-donut-container">
        <div class="chart-donut" style="--value: ${value}">
          <span class="donut-value">${value}%</span>
        </div>
        <div class="donut-label">Goal Completion</div>
      </div>
    `;
  }

  function animateChartElements(container) {
    const animatedElements = container.querySelectorAll('.chart-bar, .chart-bar-horizontal');
    animatedElements.forEach((el, i) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease, width 0.8s ease, height 0.8s ease';
        el.style.opacity = '1';
      }, i * 100);
    });
  }

  function getChartColor(index) {
    const colors = [
      'var(--accent)',
      'var(--highlight)',
      '#7546E880',
      '#C8B3F680',
      '#2D1C7F80'
    ];
    return colors[index % colors.length];
  }

  // ===== SKILL BARS ANIMATION =====
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.bar-fill');
    skillBars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }

  // ===== INITIALIZATION =====
  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.textContent.toLowerCase().replace(' ', '');
        setActiveFilter(filter);
      });
      
      // Keyboard support
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const filter = this.textContent.toLowerCase().replace(' ', '');
          setActiveFilter(filter);
        }
      });
    });
  }

  // Initialize with default data
  setActiveFilter(currentFilter);

  // Animate skill bars when in view
  const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        skillBarsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const comparisonSection = document.querySelector('.comparison-section');
  if (comparisonSection) skillBarsObserver.observe(comparisonSection);

  // Update current year in footer
  const yearElement = document.querySelector('.current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});