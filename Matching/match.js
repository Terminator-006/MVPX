document.addEventListener('DOMContentLoaded', function () {
    const multiselects = document.querySelectorAll('.multiselect');
    const fields = document.querySelectorAll('.select-field');
    const nextButton = document.getElementById('next-button');
    let currentOpenDropdown = null;

    multiselects.forEach(multiselect => {
        const input = multiselect.querySelector('.select-field');
        const dropdown = multiselect.querySelector('.dropdown-content');
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        const dropdownIcon = multiselect.querySelector('.dropdown-icon');

        input.addEventListener('click', function (event) {
            event.stopPropagation();
            if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
                currentOpenDropdown.classList.remove('show');
            }
            dropdown.classList.toggle('show');
            currentOpenDropdown = dropdown.classList.contains('show') ? dropdown : null;
        });

        dropdownIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
                currentOpenDropdown.classList.remove('show');
            }
            dropdown.classList.toggle('show');
            currentOpenDropdown = dropdown.classList.contains('show') ? dropdown : null;
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                updateInputValue(input, dropdown);
            });
        });

        dropdown.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    });

    fields.forEach(field => {
        field.addEventListener('input', checkAllFilled);
        field.addEventListener('focus', function () {
            field.style.border = '3px solid black';
        });
        field.addEventListener('blur', function () {
            if (field.value) {
                field.style.border = '2px solid grey';
            } else {
                field.style.border = '1px solid black';
            }
        });
    });

    function updateInputValue(input, dropdown) {
        const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        const selectedValues = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        input.value = selectedValues.join(', ');

        if (input.value) {
            input.style.color = 'black'; // Change font color to black
            input.style.fontWeight = '600'; // Set font weight to 600
            input.style.border = '2px solid grey'; // Set border to 2px solid grey
        } else {
            input.style.color = 'grey'; // Change font color to grey
            input.style.fontWeight = 'normal'; // Set font weight to normal
            input.style.border = '1px solid black'; // Reset border to original style if empty
        }

        checkAllFilled();
    }

    function checkAllFilled() {
        let allFilled = true;

        fields.forEach(field => {
            if (!field.value) {
                allFilled = false;
            }
        });

        nextButton.disabled = !allFilled;
    }

    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-content.show');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        currentOpenDropdown = null;
    }

    document.addEventListener('click', function () {
        closeAllDropdowns();
    });

    nextButton.addEventListener('click', function () {
        const form = document.getElementById('preferences-form');
        const userEmail = localStorage.getItem('userEmail');

        // Collect all form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Include checked checkbox values
        const activities = [];
        const ageRange = [];
        const frequency = [];
        const communicationMode = [];
        const meetingPlace = [];

        document.querySelectorAll('#TravelPreference ~ .dropdown-content input[type="checkbox"]:checked').forEach((checkbox) => {
            activities.push(checkbox.value);
        });

        document.querySelectorAll('#CulturePreference ~ .dropdown-content input[type="checkbox"]:checked').forEach((checkbox) => {
            ageRange.push(checkbox.value);
        });

        document.querySelectorAll('#DiningPreference ~ .dropdown-content input[type="checkbox"]:checked').forEach((checkbox) => {
            frequency.push(checkbox.value);
        });

        document.querySelectorAll('#Hobbies ~ .dropdown-content input[type="checkbox"]:checked').forEach((checkbox) => {
            communicationMode.push(checkbox.value);
        });

        document.querySelectorAll('#FitnessPreference ~ .dropdown-content input[type="checkbox"]:checked').forEach((checkbox) => {
            meetingPlace.push(checkbox.value);
        });

        data.activities = activities;
        data.ageRange = ageRange;
        data.frequency = frequency;
        data.communicationMode = communicationMode;
        data.meetingPlace = meetingPlace;

        // Add userEmail to the payload
        data.email = userEmail;

        console.log(data);
        fetch('https://regnum-backend-bice.vercel.app/update-matching', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert("Success");
            console.log('Success:', data);
            window.location.href = '../agreement/index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    checkAllFilled(); // Initial check to enable/disable button on page load
});
