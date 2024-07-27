document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const sexualitySelect = document.getElementById('sex');
    const partnerReferralInput = document.querySelector('input[type="text"]');
    const nextBtn = document.getElementById('nextButton');

    function checkFormValidity() {
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        const isSexualitySelected = sexualitySelect.value !== '';
        nextBtn.disabled = !(isGenderSelected && isSexualitySelected);
    }

    genderInputs.forEach(input => {
        input.addEventListener('change', checkFormValidity);
    });

    sexualitySelect.addEventListener('change', function () {
        checkFormValidity();
        // Update styles when a value is selected
        if (sexualitySelect.value !== '') {
            sexualitySelect.classList.add('selected');
        } else {
            sexualitySelect.classList.remove('selected');
        }
    });

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
                    input.style.fontWeight = 'bold';
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
    partnerReferralInput.style.color = 'black';
});
