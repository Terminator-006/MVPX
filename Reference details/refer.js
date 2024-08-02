// Select all input and select elements
const howHeardSelect = document.getElementById('how-heard');
const referencesInput = document.getElementById('references');
const referenceNameInput = document.getElementById('reference-name');
const referencePhoneInput = document.getElementById('reference-phone');
const nextButton = document.getElementById('next-button');
const popup = document.getElementById('overlay');
const closePopupButton = document.getElementById('closePopup');
const backpopup = document.getElementById('bgol');
const errorDiv = document.getElementById('em-error2');

let popupDisplayed = false; // Track whether the popup has been displayed

// Function to check if all fields are valid
function checkAllFieldsValid() {
    return howHeardSelect.value !== '' &&
           referencesInput.value !== '' &&
           referenceNameInput.value !== '' &&
           referencePhoneInput.value !== '';
}

// Event listeners for input and select fields
howHeardSelect.addEventListener('input', () => {
    if (howHeardSelect.value !== '') {
        errorDiv.style.display = 'none';
        howHeardSelect.style.border = '';
    }
});

function addShakeEffect() {
    howHeardSelect.classList.add('shake');
}


document.addEventListener('DOMContentLoaded', function () {
    nextButton.addEventListener('click', async function (event) {
        // Check if "How did you hear about Regnum?" field is filled
        if (howHeardSelect.value === '') {
            event.preventDefault();
            addShakeEffect();

            // Display error message and highlight the "How did you hear about Regnum?" field
            errorDiv.style.display = 'flex';
            howHeardSelect.style.border = '3px solid red';
            return; // Prevent form submission if "How did you hear about Regnum?" field is not filled
        }

        // If the "How did you hear about Regnum?" field is filled but other fields are not valid
        if (!checkAllFieldsValid()) {
            event.preventDefault();

            if (!popupDisplayed) {
                // Display the popup
                popup.style.display = 'flex';
                backpopup.style.display = 'block'; // Show the background overlay
                popupDisplayed = true; // Mark that the popup has been displayed
                return; // Prevent form submission if fields are not valid
            }
        }

        const data = {
            email: localStorage.getItem("userEmail"),
            Reference: referencesInput.value,
            NameOfReference: referenceNameInput.value,
            PhoneNoOfReference: referencePhoneInput.value
        };

        let score = 0;
        if (referenceNameInput.value !== "") {
            score += 10;
        } else {
            score += 5;
        }

        const scoreData = {
            email: localStorage.getItem("userEmail"),
            ReferenceScore: score
        };

        try {
            const response = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                try {
                    const response1 = await fetch('https://regnum-backend-bice.vercel.app/update-score', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(scoreData),
                    });

                    if (response1.ok) {
                        alert("Submitted successfully!");
                        window.location.href = '../Social Engagement/index.html';
                    } else {
                        const errorData = await response1.json();
                        console.error('Error updating score:', errorData);
                    }
                } catch (error) {
                    console.error('Error updating score:', error);
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

closePopupButton.addEventListener('click', function () {
    popup.style.display = 'none';
    backpopup.style.display = 'none'; // Hide the background overlay
});
