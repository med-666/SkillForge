document.addEventListener('DOMContentLoaded', function() {
  // ===== FORM ELEMENTS =====
  const addSkillForm = document.getElementById('addSkillForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const skillNameInput = document.getElementById('skillName');
  const skillCategorySelect = document.getElementById('skillCategory');
  const goalDescriptionInput = document.getElementById('goalDescription');
  const goalDaysInput = document.getElementById('goalDays');

  // ===== VALIDATION STATE =====
  const validationRules = {
    skillName: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    skillCategory: {
      required: true
    },
    goalDescription: {
      required: true,
      minLength: 10,
      maxLength: 200
    },
    goalDays: {
      required: true,
      min: 1,
      max: 365
    }
  };

  // ===== FORM VALIDATION =====
  function validateField(field, rules) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    // Clear previous errors
    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';

    // Required validation
    if (rules.required && !value) {
      showError(field, 'This field is required');
      return false;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      showError(field, `Minimum ${rules.minLength} characters required`);
      return false;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      showError(field, `Maximum ${rules.maxLength} characters allowed`);
      return false;
    }

    // Numeric validation
    if (field.type === 'number') {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        showError(field, 'Please enter a valid number');
        return false;
      }
      if (rules.min && numValue < rules.min) {
        showError(field, `Minimum value is ${rules.min}`);
        return false;
      }
      if (rules.max && numValue > rules.max) {
        showError(field, `Maximum value is ${rules.max}`);
        return false;
      }
    }

    return true;
  }

  function showError(field, message) {
    field.classList.add('error');
    
    // Create or update error message element
    let errorElement = document.getElementById(`${field.id}-error`);
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${field.id}-error`;
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
  }

  // ===== REAL-TIME VALIDATION =====
  function setupRealTimeValidation() {
    [skillNameInput, skillCategorySelect, goalDescriptionInput, goalDaysInput].forEach(field => {
      if (!field) return;
      
      field.addEventListener('blur', () => {
        const fieldName = field.id.replace('skill', '').replace('goal', '').toLowerCase();
        validateField(field, validationRules[fieldName]);
      });
      
      // Clear error on focus
      field.addEventListener('focus', () => {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) errorElement.textContent = '';
      });
    });
  }

  // ===== FORM SUBMISSION =====
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    isValid &= validateField(skillNameInput, validationRules.skillName);
    isValid &= validateField(skillCategorySelect, validationRules.skillCategory);
    isValid &= validateField(goalDescriptionInput, validationRules.goalDescription);
    isValid &= validateField(goalDaysInput, validationRules.goalDays);
    
    if (!isValid) {
      // Focus on first invalid field
      const firstError = document.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }
    
    // Prepare form data
    const formData = {
      skillName: skillNameInput.value.trim(),
      skillCategory: skillCategorySelect.value,
      dailyTime: document.getElementById('dailyTime').value,
      difficulty: document.getElementById('difficulty').value,
      goalDescription: goalDescriptionInput.value.trim(),
      goalDays: goalDaysInput.value
    };
    
    // Set loading state
    const submitBtn = addSkillForm.querySelector('button[type="submit"]');
    setLoadingState(submitBtn, true);
    
    try {
      // Simulate API call
      const response = await mockApiCall(formData);
      
      // Show success message
      showToast('Skill created successfully!', 'success');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } catch (error) {
      showToast('Error creating skill. Please try again.', 'error');
      console.error('Form submission error:', error);
    } finally {
      setLoadingState(submitBtn, false);
    }
  }

  // ===== MOCK API CALL =====
  function mockApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be an actual API call
        console.log('Form data submitted:', data);
        resolve({ status: 'success', data });
      }, 1000);
    });
  }

  // ===== TOAST NOTIFICATIONS =====
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Hide after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // ===== LOADING STATE =====
  function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
      element.classList.add('loading');
      element.disabled = true;
      element.innerHTML = '<span class="spinner"></span> Processing...';
    } else {
      element.classList.remove('loading');
      element.disabled = false;
      element.textContent = 'Create Skill';
    }
  }

  // ===== CANCEL BUTTON =====
  function handleCancel() {
    if (formHasChanges()) {
      if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        window.location.href = 'dashboard.html';
      }
    } else {
      window.location.href = 'dashboard.html';
    }
  }

  function formHasChanges() {
    return (
      skillNameInput.value.trim() !== '' ||
      skillCategorySelect.value !== '' ||
      goalDescriptionInput.value.trim() !== '' ||
      goalDaysInput.value !== '30'
    );
  }

  // ===== EVENT LISTENERS =====
  if (addSkillForm) {
    addSkillForm.addEventListener('submit', handleFormSubmit);
    setupRealTimeValidation();
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', handleCancel);
    cancelBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCancel();
      }
    });
  }

  // ===== INITIAL FOCUS =====
  if (skillNameInput) {
    skillNameInput.focus();
  }
});