document.addEventListener('DOMContentLoaded', function () {
    const multiselects = document.querySelectorAll('.multiselect');
    const nextButton = document.getElementById('submit-button');
    
    let currentOpenDropdown = null;
    let popupShown = false; // Flag to track if popup has been shown

    // Initialize dropdowns and their event handlers
    multiselects.forEach(multiselect => {
        const input = multiselect.querySelector('.select-field');
        const dropdown = multiselect.querySelector('.dropdown-content');
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        const dropdownIcon = multiselect.querySelector('.dropdown-icon');

        input.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from bubbling up to the document
            toggleDropdown(dropdown);
        });

        dropdownIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from bubbling up to the document
            toggleDropdown(dropdown);
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                updateInputValue(input, dropdown);
                checkAllFieldsFilled(); // Check if all fields are filled whenever a checkbox is toggled
            });
        });

        dropdown.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from bubbling up to the document
        });
    });

    function toggleDropdown(dropdown) {
        if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
            currentOpenDropdown.classList.remove('show');
        }
        dropdown.classList.toggle('show');
        currentOpenDropdown = dropdown.classList.contains('show') ? dropdown : null;
    }

    function updateInputValue(input, dropdown) {
        const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        const selectedValues = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        input.value = selectedValues.join(', ');

        // Update input field styles
        if (input.value) {
            input.style.color = 'black'; // Change font color to black
            input.style.fontWeight = '600'; // Set font weight to 600
            input.style.border = '2px solid grey'; // Set border to 2px solid grey
        } else {
            input.style.color = 'grey'; // Change font color to grey
            input.style.fontWeight = 'normal'; // Set font weight to normal
            input.style.border = '1px solid black'; // Reset border to original style if empty
        }
    }

    function checkAllFieldsFilled() {
        const allInputs = document.querySelectorAll('.select-field');
        let allFieldsFilled = true;

        allInputs.forEach(input => {
            if (!input.value) {
                allFieldsFilled = false;
                input.style.color = 'grey'; // Set font color to grey if not filled
                input.style.fontWeight = 'normal'; // Set font weight to normal if not filled
            } else {
                input.style.color = 'black'; // Set font color to black if filled
                input.style.fontWeight = '600'; // Set font weight to 600 if filled
            }
        });

        // Enable or disable the button based on whether all fields are filled
        nextButton.disabled = !allFieldsFilled;
    }

    nextButton.addEventListener('click', async function (e) {
        e.preventDefault(); // Prevent default form submission

        if (nextButton.disabled) {
            // If the button is disabled, do nothing
            return;
        }

        const data = {};

        multiselects.forEach(multiselect => {
            const category = multiselect.querySelector('.select-field').id;
            const checkboxes = multiselect.querySelectorAll('.checkbox input[type="checkbox"]');
            const selectedValues = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);

            data[category] = selectedValues;
        });
        data["email"] = localStorage.getItem("userEmail");

        try {
            const response = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Submitted successfully!");
                window.location.href = '../photo/index.html';
            } else {
                const errorData = await response.json();
                console.error('Error updating user information:', errorData);
            }
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    });

    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-content.show');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        currentOpenDropdown = null;
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (event) {
        closeAllDropdowns();
    });

    // Initial check to enable/disable button
    checkAllFieldsFilled();
});
