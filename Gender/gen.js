document.addEventListener('DOMContentLoaded', function () {
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const sexualitySelect = document.getElementById('sex');
    const personInput = document.getElementById('person');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const nextBtn = document.getElementById('nextButton');

    function checkFormValidity() {
        const isGenderSelected = Array.from(genderInputs).some(input => input.checked);
        const isSexualitySelected = sexualitySelect.value !== '';
        const isPersonSelected = personInput.value.trim() !== '';

        nextBtn.disabled = !(isGenderSelected && isSexualitySelected && isPersonSelected);

        if (nextBtn.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
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

    personInput.addEventListener('input', function () {
        checkFormValidity();
        if (personInput.value.trim() !== '') {
            personInput.style.color = 'black';
            personInput.style.fontWeight = 'bold';
        } else {
            personInput.style.color = 'grey';
            personInput.style.fontWeight = 'normal';
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
                    input.style.fontWeight = '600';
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

    nextBtn.addEventListener('click', function () {
        if (!nextBtn.disabled) {
            window.location.href = '../submit email/index.html';
        }
    });
});
