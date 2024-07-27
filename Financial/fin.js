document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.content input');
    const nextButton = document.getElementById('next-button');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            // Check if all inputs are filled
            let allFilled = true;
            inputs.forEach(inp => {
                if (!inp.value) {
                    allFilled = false;
                }
            });

            // Enable or disable the button based on filled state
            if (allFilled) {
                nextButton.disabled = false;
                nextButton.style.opacity = '1';
                nextButton.style.cursor = 'pointer';
            } else {
                nextButton.disabled = true;
                nextButton.style.opacity = '0.5';
                nextButton.style.cursor = 'not-allowed';
            }

            // Add filled class if input is filled
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });

        // Reset border color on focus
        input.addEventListener('focus', function () {
            input.style.border = '1px solid black';
            input.style.borderRadius = '3px';
        });

        // Reset border radius on blur if input is filled
        input.addEventListener('blur', function () {
            if (input.value) {
                input.style.borderRadius = '6px';
                input.style.border = '2px solid grey';
            } else {
                input.style.border = '1px solid black';
            }
        });

        // Handle select field color change and font-weight
        if (input.tagName.toLowerCase() === 'select') {
            input.addEventListener('change', function () {
                if (input.value) {
                    input.style.color = 'black'; // Change selected option color to black
                    input.style.fontWeight = '600'; // Change font-weight to 600
                    input.style.border = '2px solid grey'; // Add 2px gray border
                    input.classList.add('filled');
                } else {
                    input.style.color = 'grey'; // Keep placeholder text grey
                    input.style.fontWeight = 'normal'; // Reset font-weight
                    input.style.border = '1px solid black'; // Reset border
                    input.classList.remove('filled');
                }
            });
        }

        // Handle date input color change
        if (input.type === 'date') {
            input.addEventListener('change', function () {
                if (input.value) {
                    input.style.color = 'black'; // Change date input text color to black
                    input.classList.add('filled');
                } else {
                    input.style.color = 'grey'; // Keep placeholder text grey
                    input.classList.remove('filled');
                }
            });
        }
    });
    function getSelectedCheckboxes() {
        const selected = [];
        const checkboxes = document.querySelectorAll('input[name="luxury-item"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });
        return selected;
    }
    nextButton.addEventListener('click', async function () {
        const income = document.getElementById("Income").value;
        const selectedItems = getSelectedCheckboxes();
        let data = {};
        const email = localStorage.getItem("userEmail");
        data["email"] = email
        data["AnnualIncome"] = income;
        data["LuxuryAssets"] = selectedItems; 
        console.log(data);
        
        let score = 0;
        if (income > 1000000) {
            score = 10;
          } else if (income > 500000) {
            score = 8;
          } else if (income > 250000) {
            score = 5;
          } else {
            score = 2;
          }
          const luxuryAssetsValues = {
            "Real Estate": 5,
            "Cars": 3,
            "Yachts": 7,
            "Jewellery": 2
          };
          let assetScore = 0;
          selectedItems.forEach(asset => {
            assetScore += luxuryAssetsValues[asset] || 0;
          });

        try {
            const response = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
    
            if (response.ok) {
                const scoreData = {};
                scoreData["email"] = email;
                scoreData["IncomeScore"] = score;
                scoreData["LuxuryAssestsScore"] = assetScore;
                try {
                    const response1 = await fetch('https://regnum-backend-bice.vercel.app/update-score', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(scoreData),
                    });
            
                    if (response1.ok) {
                        
                      alert("submitted!");
                      window.location.href = '../Reference details/index.html';
                    } else {
                      const errorData = await response1.json();
                      console.error('Error updating user information:', errorData);
                    }
                  } catch (error) {
                    console.error('Error updating user information:', error);
                  }
            } else {
              const errorData = await response.json();
              console.error('Error updating user information:', errorData);
            }
          } catch (error) {
            console.error('Error updating user information:', error);
          }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const checked = this.checked;
            const label = this.parentElement;
            const svgUnchecked = label.querySelector('.unchecked');
            const svgChecked = label.querySelector('.checked');

            if (checked) {
                svgUnchecked.style.display = 'none';
                svgChecked.style.display = 'inline';
                label.style.color = 'black';
            } else {
                svgUnchecked.style.display = 'inline';
                svgChecked.style.display = 'none';
                label.style.color = ''; // Reset to default color
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const incomeInput = document.getElementById('Income');
    const luxuryItems = document.querySelectorAll('input[name="luxury-item"]');
    const nextButton = document.getElementById('next-button');

    function checkInputs() {
        const incomeFilled = incomeInput.value.trim() !== '';
        const anyLuxurySelected = Array.from(luxuryItems).some(item => item.checked);

        const allFilled = incomeFilled && anyLuxurySelected;
        nextButton.disabled = !allFilled;
        nextButton.style.opacity = allFilled ? '1' : '0.5';
        nextButton.style.cursor = allFilled ? 'pointer' : 'not-allowed';
    }

    incomeInput.addEventListener('input', checkInputs);

    luxuryItems.forEach(item => {
        item.addEventListener('change', checkInputs);
    });

    checkInputs(); // Initial check
});
