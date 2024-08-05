document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.content input, .content select');
    const nextButton = document.getElementById('next-button');
    const howHeardSelect = document.getElementById('how-heard');
    const referencesInput = document.getElementById('references');
    const referenceNameInput = document.getElementById('reference-name');
    const referencePhoneInput = document.getElementById('reference-phone');
    const popup = document.getElementById('overlay');
    const backgroundOverlay = document.getElementById('bgol');
    const closePopupButton = document.getElementById('closePopup');
    const error = document.getElementById('em-error2');

    let popupDisplayed = false;

    function checkInputs() {
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);

        input.addEventListener('focus', function () {
            input.style.border = '1px solid black';
            input.style.borderRadius = '3px';
        });

        input.addEventListener('blur', function () {
            if (input.value) {
                input.style.borderRadius = '6px';
                input.style.border = '2px solid grey';
            } else {
                input.style.border = '1px solid black';
            }
        });

        if (input.tagName.toLowerCase() === 'select') {
            input.addEventListener('change', function () {
                if (input.value) {
                    input.style.color = 'black';
                    input.style.fontWeight = '600';
                    input.style.border = '2px solid grey';
                    input.classList.add('filled');
                } else {
                    input.style.color = 'grey';
                    input.style.fontWeight = 'normal';
                    input.style.border = '1px solid black';
                    input.classList.remove('filled');
                }
            });
        }

        if (input.type === 'date') {
            input.addEventListener('change', function () {
                if (input.value) {
                    input.style.color = 'black';
                    input.classList.add('filled');
                } else {
                    input.style.color = 'grey';
                    input.classList.remove('filled');
                }
            });
        }
    });

    // Hide error message when user starts typing in "How did you hear about Regnum?" input
    howHeardSelect.addEventListener('input', function () {
        error.style.display = 'none';
        howHeardSelect.style.border = ''; // Reset the border if it's filled
        howHeardSelect.classList.remove('shake'); // Remove shake class on input
    });

    nextButton.addEventListener('click', function () {
        if (popupDisplayed) {
            window.location.href = '../Social Engagement/index.html';
            return;
        }

        // Check if "How did you hear about Regnum?" field is filled
        if (!howHeardSelect.value) {
            howHeardSelect.style.border = '2px solid red';
            error.style.display = 'flex';
            howHeardSelect.classList.add('shake'); // Add shake class to input
            // Remove shake class after animation completes
            setTimeout(() => {
                howHeardSelect.classList.remove('shake');
            }, 500);
            return; // Prevent form submission if "How did you hear about Regnum?" is empty
        } else {
            howHeardSelect.style.border = ''; // Reset the border if it's filled
            error.style.display = 'none';
        }

        // Check if any other inputs are empty
        if (!howHeardSelect.value || !referencesInput.value || !referenceNameInput.value || !referencePhoneInput.value) {
            if (!popupDisplayed) {
                backgroundOverlay.style.display = 'flex';
                popup.style.display = 'flex';
                popupDisplayed = true;
            } else {
                // Submit the form and change the page
                submitFormAndRedirect();
            }
            return; // Prevent form submission if other fields are not valid
        }

        submitFormAndRedirect();
    });

    function submitFormAndRedirect() {
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

        fetch('https://regnum-backend-bice.vercel.app/update-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(response => {
            if (response.ok) {
                return fetch('https://regnum-backend-bice.vercel.app/update-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scoreData),
                });
            } else {
                return response.json().then(errorData => {
                    console.error('Error updating user information:', errorData);
                });
            }
        }).then(response1 => {
            if (response1.ok) {
                window.location.href = '../Social Engagement/index.html';
            } else {
                return response1.json().then(errorData => {
                    console.error('Error updating score:', errorData);
                });
            }
        }).catch(error => {
            console.error('Error updating user information:', error);
        });
    }

    closePopupButton.addEventListener('click', function () {
        backgroundOverlay.style.display = 'none';
        popup.style.display = 'none';
    });
});
