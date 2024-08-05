document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.content input, .content select');
    const nextButton = document.getElementById('next-button');
    const instagramIdInput = document.querySelector('input[placeholder="Instagram Id*"]');
    const popup = document.getElementById('overlay');
    const backgroundOverlay = document.getElementById('bgol');
    const closePopupButton = document.getElementById('closePopup');
    const error = document.getElementById('em-error');

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

    // Hide error message when user starts typing in Instagram ID input
    instagramIdInput.addEventListener('input', function () {
        error.style.display = 'none';
        instagramIdInput.style.border = ''; // Reset the border if it's filled
        instagramIdInput.classList.remove('shake'); // Remove shake class on input
    });

    let popupDisplayed = false;
    nextButton.addEventListener('click', function () {
        const degreeSelect = document.querySelector('select:nth-of-type(1)').value;
        const almaMaterInput = document.querySelector('input:nth-of-type(1)').value;
        const membershipSelect = document.querySelector('select:nth-of-type(2)').value;
        const registrationNumberInput = document.querySelector('input:nth-of-type(2)').value;
        const exoticPlaceInput = document.querySelector('input:nth-of-type(3)').value;
        const visaNumberInput = document.querySelector('input:nth-of-type(4)').value;
        const email = localStorage.getItem("userEmail");

        // Check if Instagram ID input is empty and set border color to red if it is
        if (!instagramIdInput.value) {
            instagramIdInput.style.border = '2px solid red';
            error.style.display = 'flex';
            instagramIdInput.classList.add('shake'); // Add shake class to input
            // Remove shake class after animation completes
            setTimeout(() => {
                instagramIdInput.classList.remove('shake');
            }, 500);
            return; // Prevent form submission if Instagram ID is empty
        } else {
            instagramIdInput.style.border = ''; // Reset the border if it's filled
            error.style.display = 'none';
        }

        // Check if any other inputs are empty
        if (!degreeSelect || !almaMaterInput || !membershipSelect || !registrationNumberInput || !exoticPlaceInput || !visaNumberInput) {
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
        const degreeSelect = document.querySelector('select:nth-of-type(1)').value;
        const almaMaterInput = document.querySelector('input:nth-of-type(1)').value;
        const membershipSelect = document.querySelector('select:nth-of-type(2)').value;
        const registrationNumberInput = document.querySelector('input:nth-of-type(2)').value;
        const exoticPlaceInput = document.querySelector('input:nth-of-type(3)').value;
        const visaNumberInput = document.querySelector('input:nth-of-type(4)').value;
        const email = localStorage.getItem("userEmail");

        const data = {
            email: email,
            Degree: degreeSelect,
            AlmaMater: almaMaterInput,
            MemberShip: membershipSelect,
            RegNumber: registrationNumberInput,
            InstaId: instagramIdInput.value,
            ExoticPlace: exoticPlaceInput,
            VisaNumber: visaNumberInput
        };

        console.log(data);

        // Calculate scores
        let DegreeScore = 0;
        switch (degreeSelect) {
            case "PhD": DegreeScore += 10; break;
            case "Master's": DegreeScore += 8; break;
            case "Bachelor's": DegreeScore += 5; break;
            case "Associate": DegreeScore += 3; break;
            default: DegreeScore += 0;
        }

        let ClubScore = 0;
        switch (membershipSelect) {
            case "Country Club": ClubScore += 5; break;
            case "Yacht Club": ClubScore += 7; break;
            case "Golf Club": ClubScore += 3; break;
            default: ClubScore += 0;
        }

        let ExoticScore = 0;
        if (exoticPlaceInput !== '') {
            ExoticScore += 10;
        } else {
            ExoticScore += 5;
        }

        const scoreData = {
            email: email,
            ClubScore: ClubScore,
            DegreeScore: DegreeScore,
            ExoticScore: ExoticScore
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
                // alert("Submitted successfully!");
                window.location.href = '../Personal preferences/index.html';
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
