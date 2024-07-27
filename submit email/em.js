document.addEventListener('DOMContentLoaded', function () {
  const emailInput = document.getElementById('email');
  const nextButton = document.getElementById('next-button');
  const errorMessage = document.getElementById('error-message');
  const errorIcon = document.querySelector('.danger-triangle');
  let timeoutId = null;

  emailInput.addEventListener('input', function () {
    clearTimeout(timeoutId);
    const email = emailInput.value.trim(); // Trim whitespace from input

    if (email === '') {
      resetValidation();
      return;
    }

    emailInput.classList.add('typing'); // Add typing class when input is not empty
    emailInput.classList.remove('error'); // Remove error class when typing
    hideErrorMessage(); // Hide error message and reset styles when typing starts again

    timeoutId = setTimeout(function () {
      validateEmail(email);
    }, 1000);
  });

  function validateEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showErrorMessage('Please enter a valid email address');
      emailInput.classList.add('error');
      emailInput.classList.remove('typing'); // Remove typing class if there is an error
      emailInput.classList.remove('focused'); // Remove focused class if there is an error
    } else {
      hideErrorMessage();
      emailInput.classList.remove('error');
      if (emailInput.classList.contains('focused')) {
        emailInput.style.border = '3px solid black'; // Set default border on focus if not in error state
      }
    }

    updateButtonState();
  }

  function resetValidation() {
    hideErrorMessage();
    emailInput.classList.remove('error');
    updateButtonState();
  }

  function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorIcon.style.display = 'block';
    emailInput.style.border = '3px solid red'; // Ensure border remains red
  }

  function hideErrorMessage() {
    errorMessage.style.display = 'none';
    errorIcon.style.display = 'none';
    if (!emailInput.classList.contains('focused')) {
      emailInput.style.border = '2px solid grey'; // Reset border color if not focused
    } else {
      emailInput.style.border = '3px solid black'; // Set default border on focus if not in error state
    }
  }

  function updateButtonState() {
    if (emailInput.classList.contains('error') || emailInput.value.trim() === '') {
      nextButton.disabled = true;
      nextButton.style.opacity = '0.5'; // Set opacity to 0.5
      nextButton.style.cursor = 'not-allowed'; // Set cursor to not-allowed
    } else {
      nextButton.disabled = false;
      nextButton.style.opacity = '1'; // Set opacity to 1
      nextButton.style.cursor = 'pointer'; // Set cursor to pointer
    }
  }

  nextButton.addEventListener('click', async function () {
    if (!nextButton.disabled) {
      const email = emailInput.value.trim();
      
      // Save email to local storage
      localStorage.setItem('userEmail', email);

      // Send OTP request to the backend
      console.log(email);
      const response = await fetch('https://regnum-backend-bice.vercel.app/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        // Redirect to OTP verification page
        window.location.href = '../Otp validation/index.html';
      } else {
        showErrorMessage('Error sending OTP. Please try again.');
      }
    }
  });

  // Focus Event Handler
  emailInput.addEventListener('focus', function () {
    emailInput.classList.add('focused');
    if (!emailInput.classList.contains('error')) {
      emailInput.style.border = '3px solid black'; // Set default border on focus
    }
  });

  // Blur Event Handler
  emailInput.addEventListener('blur', function () {
    emailInput.classList.remove('focused');
    if (!emailInput.classList.contains('error')) {
      emailInput.style.border = '2px solid grey'; // Reset border color to grey on blur
    }
    if (emailInput.value.trim() === '') {
      emailInput.style.border = '1px solid black'; // Reset border to grey if input is empty
    }
    emailInput.style.borderRadius = '6px';
  });
});
