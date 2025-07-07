document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  if(loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if(!email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      // Show loading state
      const submitBtn = loginForm.querySelector('.login-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Signing in...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});