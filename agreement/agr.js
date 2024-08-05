document.addEventListener('DOMContentLoaded', function () {
    const multiselects = document.querySelectorAll('.multiselect');
    const fields = document.querySelectorAll('.select-field');
    const nextButton = document.getElementById('next-button');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let currentOpenDropdown = null;

    multiselects.forEach(multiselect => {
        const input = multiselect.querySelector('.select-field');
        const dropdown = multiselect.querySelector('.dropdown-content');
        const dropdownCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]');
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

        dropdownCheckboxes.forEach(checkbox => {
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
    });

    function updateInputValue(input, dropdown) {
        const checkedBoxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        const selectedValues = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        input.value = selectedValues.join(', ');

        checkAllFilled();
    }

    function checkAllFilled() {
        let allFilled = true;

        fields.forEach(field => {
            if (!field.value) {
                allFilled = false;
            }
        });

        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
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

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const checked = this.checked;
            const label = this.parentElement;
            const svgUnchecked = label.querySelector('.unchecked');
            const svgChecked = label.querySelector('.checked');
            const link = label.querySelector('a');

            if (checked) {
                svgUnchecked.style.display = 'none';
                svgChecked.style.display = 'inline';
                label.style.color = 'black';
                link.style.color = 'black';
            } else {
                svgUnchecked.style.display = 'inline';
                svgChecked.style.display = 'none';
                label.style.color = ''; // Reset to default color
                link.style.color = 'grey'; // Reset to grey
            }

            checkAllFilled();
        });
    });

    nextButton.addEventListener('click', async function () {
        const email = localStorage.getItem('userEmail');
        const partner = localStorage.getItem('selectedPartner');
        console.log(partner);
        // alert("hi")
        // console.log(email);
        // try {
        //     const response = await fetch('https://regnum-backend-bice.vercel.app/get-score', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email })
        //     });

        //     if (response.ok) {
        //         const scoreData = await response.json();
        //         if (scoreData.score >= 50) {
        //             alert("Success!");
        //             window.location.href = '../Accepted/index.html';
        //         } else {
        //             alert("Success!");
        //             window.location.href = '../Rejected/index.html';
        //         }
        //     } else {
        //         alert("Error");
        //     }
        // } catch (error) {
        //     console.error('Error:', error);
        //     alert("Error");
        // }

        if(partner=="Partner 1"){
            window.location.href = '../AC1/index.html';
        }
        else{
            window.location.href = '../AC2/index.html';
        }
    });

    checkAllFilled(); // Initial check to enable/disable button on page load
});
