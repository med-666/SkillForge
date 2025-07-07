document.addEventListener('DOMContentLoaded', function() {
  // Settings navigation
  const settingsLinks = document.querySelectorAll('.settings-menu a');
  const settingsSections = document.querySelectorAll('.settings-section');
  
  // Load saved settings from localStorage
  function loadSettings() {
    const savedProfile = JSON.parse(localStorage.getItem('profileSettings')) || {};
    const savedNotifications = JSON.parse(localStorage.getItem('notificationSettings')) || {};
    
    if (savedProfile) {
      document.getElementById('name').value = savedProfile.name || '';
      document.getElementById('email').value = savedProfile.email || '';
      document.getElementById('bio').value = savedProfile.bio || '';
    }
    
    if (savedNotifications) {
      document.querySelectorAll('#notificationForm input[type="checkbox"]').forEach(checkbox => {
        const settingName = checkbox.closest('.toggle-item').querySelector('h4').textContent.trim();
        checkbox.checked = savedNotifications[settingName] || false;
      });
    }
  }
  
  // Save settings to localStorage
  function saveProfileSettings() {
    const profileSettings = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      bio: document.getElementById('bio').value
    };
    localStorage.setItem('profileSettings', JSON.stringify(profileSettings));
  }
  
  function saveNotificationSettings() {
    const notificationSettings = {};
    document.querySelectorAll('#notificationForm input[type="checkbox"]').forEach(checkbox => {
      const settingName = checkbox.closest('.toggle-item').querySelector('h4').textContent.trim();
      notificationSettings[settingName] = checkbox.checked;
    });
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }
  
  // Initialize settings
  loadSettings();
  
  // Navigation handling
  settingsLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links and sections
      settingsLinks.forEach(l => l.classList.remove('active'));
      settingsSections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Show corresponding section
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
  
  // Form submissions
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show saving state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span> Saving...';
      submitBtn.disabled = true;
      
      // Save profile settings
      saveProfileSettings();
      
      // Simulate save delay
      setTimeout(() => {
        submitBtn.textContent = 'Saved!';
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 1500);
      }, 1000);
    });
  }
  
  const notificationForm = document.getElementById('notificationForm');
  if (notificationForm) {
    notificationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show saving state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner"></span> Saving...';
      submitBtn.disabled = true;
      
      // Save notification settings
      saveNotificationSettings();
      
      // Simulate save delay
      setTimeout(() => {
        submitBtn.textContent = 'Saved!';
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 1500);
      }, 1000);
    });
  }
  
  // Avatar upload simulation
  const avatarUploadBtn = document.querySelector('.avatar-section .btn-outline');
  if (avatarUploadBtn) {
    avatarUploadBtn.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = event => {
            const avatarPreview = document.querySelector('.avatar-preview');
            avatarPreview.innerHTML = '';
            avatarPreview.style.backgroundImage = `url(${event.target.result})`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    });
  }
});