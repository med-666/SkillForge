document.addEventListener('DOMContentLoaded', function() {
  // Time filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const chartData = {
    week: {
      consistency: [65, 59, 80, 81, 56, 55, 40],
      distribution: [30, 25, 20, 15, 10],
      timeSpent: [12, 19, 3, 5, 2],
      completion: [75, 25]
    },
    month: {
      consistency: [28, 48, 40, 19, 86, 27, 90, 45, 60, 30, 70, 55],
      distribution: [25, 20, 18, 22, 15],
      timeSpent: [45, 30, 10, 10, 5],
      completion: [82, 18]
    },
    year: {
      consistency: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
      distribution: [35, 20, 15, 20, 10],
      timeSpent: [200, 150, 80, 70, 50],
      completion: [88, 12]
    },
    all: {
      consistency: Array(52).fill(0).map(() => Math.floor(Math.random() * 100)),
      distribution: [40, 20, 15, 15, 10],
      timeSpent: [500, 300, 150, 100, 50],
      completion: [90, 10]
    }
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      
      // Get filter value
      const filter = this.textContent.toLowerCase().replace(' ', '');
      updateCharts(filter);
    });
  });

  function updateCharts(filter) {
    const placeholders = document.querySelectorAll('.chart-placeholder');
    const chartTitles = [
      'Daily Practice Consistency',
      'Skill Progress Distribution',
      'Time Spent by Category',
      'Completion Rate'
    ];
    
    placeholders.forEach((placeholder, index) => {
      placeholder.innerHTML = `
        <div class="chart-loading">
          <div class="chart-spinner"></div>
          <p>Loading ${chartTitles[index]} data...</p>
        </div>
      `;
      
      setTimeout(() => {
        try {
          const data = chartData[filter];
          let chartContent = '';
          
          switch(index) {
            case 0: // Bar chart
              chartContent = `<div class="chart-bar-container">
                ${data.consistency.map((val, i) => `
                  <div class="chart-bar-wrapper">
                    <div class="chart-bar" style="height: ${val}%" 
                      aria-label="Day ${i+1}: ${val}%" 
                      role="img"></div>
                    <div class="chart-label">${['S','M','T','W','T','F','S'][i]}</div>
                  </div>
                `).join('')}
              </div>`;
              break;
              
            case 1: // Pie chart
              const values = data.distribution;
              chartContent = `<div class="chart-pie-container">
                <div class="chart-pie" 
                  style="--value-1: ${values[0]}; --value-2: ${values[1]}; --value-3: ${values[2]}"
                  aria-label="Skill distribution: ${values.join(', ')}" 
                  role="img"></div>
                <div class="chart-legend">
                  ${values.map((val, i) => `
                    <div class="legend-item">
                      <div class="legend-color" style="background-color: ${getLegendColor(i)}"></div>
                      <span>Skill ${i+1}: ${val}%</span>
                    </div>
                  `).join('')}
                </div>
              </div>`;
              break;
              
            case 2: // Horizontal bar chart
              chartContent = `<div class="chart-horizontal">
                ${data.timeSpent.map((val, i) => `
                  <div class="chart-horizontal-item">
                    <div class="chart-bar-horizontal-wrapper">
                      <div class="chart-bar-horizontal" 
                        style="width: ${val/10}%" 
                        aria-label="Category ${i+1}: ${val} hours" 
                        role="img"></div>
                      <div class="chart-value">${val}h</div>
                    </div>
                  </div>
                `).join('')}
              </div>`;
              break;
              
            case 3: // Donut chart
              chartContent = `<div class="chart-donut-container">
                <div class="chart-donut" style="--value: ${data.completion[0]}">
                  <div class="donut-value">${data.completion[0]}%</div>
                </div>
                <div class="donut-label">Tasks Completed</div>
              </div>`;
              break;
          }
          
          placeholder.innerHTML = chartContent;
        } catch (error) {
          console.error('Error generating chart:', error);
          placeholder.innerHTML = `<p class="error">Error loading chart data</p>`;
        }
      }, 800);
    });
  }

  function getLegendColor(index) {
    const colors = [
      'var(--accent)',
      'var(--highlight)',
      '#7546E8',
      '#C8B3F6',
      '#A58BDB'
    ];
    return colors[index % colors.length];
  }

  // Initialize with default data
  updateCharts('week');

  // Animate skill bars when they come into view
  const animateBars = function() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('aria-valuenow') + '%';
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bar-fill').forEach(bar => {
      observer.observe(bar);
    });
  };

  // Run animations on load and when scrolled
  window.addEventListener('load', animateBars);
  window.addEventListener('scroll', animateBars);
});