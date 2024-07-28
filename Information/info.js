document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input');
  const select = document.getElementById('gender');
  const nextButton = document.getElementById('nextButton');
  const dobInput = document.getElementById('dob');
  const emError = document.getElementById('em-error');
  const phoneInput = document.querySelector("#phone");
  const errorMsg = document.querySelector("#em-error2");
  const errorText = document.querySelector("#error-message1");

  function updateButtonState() {
      let allFilled = true;
      inputs.forEach(inp => {
          if (!inp.value) {
              allFilled = false;
          }
      });

      if (!select.value) {
          allFilled = false;
      }

      if (!allFilled) {
          nextButton.disabled = true;
          nextButton.style.opacity = '0.5';
          nextButton.style.cursor = 'not-allowed';
      } else {
          nextButton.disabled = false;
          nextButton.style.opacity = '1';
          nextButton.style.cursor = 'pointer';
      }
  }

  function isValidAge(dob) {
      const [day, month, year] = dob.split('/');
      const birthDate = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }

      if (age < 21) {
          emError.style.display = 'flex';
          dobInput.style.border = '3px solid red';
          return false;
      } else {
          emError.style.display = 'none';
          dobInput.style.border = ''; // Reset to default style
          return true;
      }
  }

  var iti = window.intlTelInput(phoneInput, {
      initialCountry: "auto",
      geoIpLookup: function (success, failure) {
          fetch('https://ipinfo.io?token=<YOUR_TOKEN>', { headers: { 'Accept': 'application/json' } })
              .then(function (response) { return response.json(); })
              .then(function (json) { success(json.country); })
              .catch(function () { success('us'); });
      },
      utilsScript: "../phone-number-validation-master/build/js/utils.js",
  });

  var reset = function () {
      errorMsg.style.display = "none";
      phoneInput.classList.remove("error");
  };

  phoneInput.addEventListener('blur', function () {
      reset();
      if (phoneInput.value.trim()) {
          if (!iti.isValidNumber()) {
              phoneInput.classList.add("error");
              errorMsg.style.display = "block";
              phoneInput.style.border = '3px solid red';
          }
      }
  });

  phoneInput.addEventListener('change', reset);
  phoneInput.addEventListener('keyup', reset);

  nextButton.addEventListener('click', async function () {
      const dob = dobInput.value;

      if (!isValidAge(dob)) {
          return;
      }

      if (phoneInput.value.trim() && !iti.isValidNumber()) {
          phoneInput.classList.add("error");
          errorMsg.style.display = "block";
          return;
      }

      if (!nextButton.disabled) {
          let data = {};
          data["email"] = localStorage.getItem("userEmail");
          data["FullName"] = document.getElementById("name").value;
          data["DateOfBirth"] = dob;
          data["City"] = document.getElementById("city").value;
          data["PhoneNumber"] = iti.getNumber();
          data["CountryCode"] = iti.getSelectedCountryData().dialCode;

          try {
              const response = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
              });

              if (response.ok) {
                  alert("submitted!");
                  window.location.href = '../Financial/index.html';
              } else {
                  const errorData = await response.json();
                  console.error('Error updating user information:', errorData);
              }
          } catch (error) {
              console.error('Error updating user information:', error);
          }
      }
  });

  inputs.forEach(input => {
      input.addEventListener('input', function () {
          updateButtonState();

          if (input.value) {
              input.classList.add('filled');
          } else {
              input.classList.remove('filled');
          }
      });

      input.addEventListener('focus', function () {
          input.style.border = '1px solid black';
          input.style.borderRadius = '3px';
      });

      input.addEventListener('blur', function () {
          if (input.value) {
              input.style.borderRadius = '6px';
          }
      });
  });

  select.addEventListener('change', updateButtonState);

  dobInput.addEventListener('focus', function () {
      emError.style.display = 'none';
      dobInput.style.border = ''; // Reset border style when focusing on input again
  });

  // Initialize datepicker
  $('#dob').datepicker({
      dateFormat: 'dd/mm/yy',
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:+0", // Set range of years
      onSelect: function(dateText) {
          $(this).val(dateText);
          updateButtonState();
      }
  });

  updateButtonState();
});

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input');
  const nextButton = document.getElementById('nextButton');
  const select = document.getElementById('gender');

  function updateButtonState() {
      let allFilled = true;
      inputs.forEach(inp => {
          if (!inp.value.trim()) {
              allFilled = false;
          }
      });

      if (select && !select.value.trim()) {
          allFilled = false;
      }

      nextButton.disabled = !allFilled;
      nextButton.style.opacity = allFilled ? '1' : '0.5';
      nextButton.style.cursor = allFilled ? 'pointer' : 'not-allowed';
  }

  inputs.forEach(input => {
      input.addEventListener('input', updateButtonState);
  });

  if (select) {
      select.addEventListener('change', updateButtonState);
  }

  // Initial check to set the button state
  updateButtonState();
});


  // Open datepicker when the calendar icon is clicked
  