document.addEventListener('DOMContentLoaded', function () {
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const sexualitySelect = document.getElementById('sex');
    const personInput = document.getElementById('person');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const nextBtn = document.getElementById('nextButton');
    const referralCodeInput = document.querySelector('.code'); // Assuming this is the input for the referral code

    function checkFormValidity() {
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        const isSexualitySelected = sexualitySelect.value !== '';
        const isPersonSelected = personInput.value.trim() !== '';
        const isReferralCodeRequired = personInput.value === 'Partner 2';
        const isReferralCodeFilled = referralCodeInput.value.trim() !== '';

        const isFormValid = isGenderSelected && isSexualitySelected && isPersonSelected && 
                            (!isReferralCodeRequired || (isReferralCodeRequired && isReferralCodeFilled));

        nextBtn.disabled = !isFormValid;

        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    function toggleReferralCode() {
        if (personInput.value === 'Partner 2') {
            referralCodeInput.style.display = 'flex';
        } else {
            referralCodeInput.style.display = 'none';
        }
        checkFormValidity(); // Re-check form validity whenever referral code input is toggled
    }

    genderInputs.forEach(input => {
        input.addEventListener('change', checkFormValidity);
    });


    

    sexualitySelect.addEventListener('change', function () {
        checkFormValidity();
        // Update styles when a value is selected
        if (sexualitySelect.value !== '') {
            sexualitySelect.classList.add('selected');
            sexualitySelect.style.fontWeight = '400'
        } else {
            sexualitySelect.classList.remove('selected');
        }
    });

    personInput.addEventListener('change', function () {
        checkFormValidity();
        toggleReferralCode();
    });

    referralCodeInput.addEventListener('input', checkFormValidity);

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
                label.style.color = '';
            }
        });
    });

    // Adding border styling from the provided JavaScript
    const inputs = document.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            input.style.border = '2px solid grey';
            input.style.borderRadius = '6px';
        });

        input.addEventListener('blur', function () {
            if (input.value) {
                input.style.borderRadius = '6px';
            } else {
                input.style.border = '1px solid black';
                input.style.fontWeight = 'normal';
                input.style.color = 'grey';
            }
        });

        if (input.tagName.toLowerCase() === 'input') {
            input.addEventListener('input', function () {
                if (input.value) {
                    input.style.fontWeight = '400';
                    input.style.color = 'black';
                } else {
                    input.style.fontWeight = 'normal';
                    input.style.color = 'grey';
                }
            });
        }
    });

    // Initial styles for select and input elements
    sexualitySelect.style.color = 'black';
    personInput.style.color = 'black';

    nextBtn.addEventListener('click', async function () {
        if (!nextBtn.disabled) {
            const personSelect = document.getElementById('person');
            localStorage.setItem('selectedPartner', personSelect.value);
            if (personSelect.value === 'Partner 2') {
                const code = referralCodeInput.value;
                try {
                    const response = await fetch('https://regnum-backend-bice.vercel.app/check-code', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            code,
                            email2: localStorage.getItem("userEmail")
                        })
                    });
            
                    // Check if response is OK
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error: ${errorData.error || 'Unknown error occurred'}`);
                    }
            
                    const responseData = await response.json();
                    if (responseData.ok) {
                        window.location.href = '../Information/index.html';
                    } else {
                        console.error('Invalid code or email mismatch');
                        // Handle invalid code scenario here (e.g., show an error message to the user)
                    }
            
                } catch (error) {
                    console.error('Error fetching the code:', error);
                    // Optionally show an error message to the user
                }
            }
            else{
                window.location.href = '../Information/index.html';
                
            }            
            
        }
    });

    // Initially hide the referral code input
    // referralCodeInput.style.display = 'none';
});
