document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('next-button');
    const howHeardSelect = document.getElementById('how-heard');
    const checklistInputs = document.querySelectorAll('.checklist input');
    const luxuryItems = document.querySelectorAll('input[name="luxury-item"]');

    function checkAllInputsFilled() {
        let allFilled = true;

        checklistInputs.forEach(inp => {
            if (!inp.value && inp.type !== 'checkbox') {
                allFilled = false;
            }
        });

        const incomeFilled = howHeardSelect.value.trim() !== '';
        const anyLuxurySelected = Array.from(luxuryItems).some(item => item.checked);

        if (allFilled && incomeFilled && anyLuxurySelected) {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        } else {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
        }
    }

    checklistInputs.forEach(input => {
        input.addEventListener('input', function() {
            checkAllInputsFilled();
            input.classList.toggle('filled', input.value);
        });

        input.addEventListener('change', function() {
            checkAllInputsFilled();
            input.classList.toggle('filled', input.value);
        });

        input.addEventListener('focus', function () {
            input.style.border = '1px solid black';
            input.style.borderRadius = '3px';
        });

        input.addEventListener('blur', function () {
            input.style.border = input.value ? '2px solid grey' : '1px solid black';
            input.style.borderRadius = input.value ? '6px' : '3px';
        });

        if (input.tagName.toLowerCase() === 'select') {
            input.addEventListener('change', function () {
                if (input.value) {
                    input.style.color = 'black';
                    input.style.fontWeight = '600';
                    input.style.border = '2px solid grey';
                } else {
                    input.style.color = 'grey';
                    input.style.fontWeight = 'normal';
                    input.style.border = '1px solid black';
                }
                input.classList.toggle('filled', input.value);
            });
        }

        if (input.type === 'date') {
            input.addEventListener('change', function () {
                input.style.color = input.value ? 'black' : 'grey';
                input.classList.toggle('filled', input.value);
            });
        }
    });

    function getSelectedCheckboxes() {
        return Array.from(document.querySelectorAll('input[name="luxury-item"]:checked')).map(checkbox => checkbox.value);
    }

    nextButton.addEventListener('click', async function () {
        const income = howHeardSelect.value;
        const selectedItems = getSelectedCheckboxes();
        const email = localStorage.getItem("userEmail");

        const data = {
            email,
            AnnualIncome: income,
            LuxuryAssets: selectedItems
        };

        let score = 0;
        if (income === "50 M+ USD") score = 10;
        else if (income === "5-50 M USD") score = 8;
        else if (income === "1-5 M USD") score = 5;
        else score = 2;

        const luxuryAssetsValues = {
            "Real Estate": 5,
            "Luxury Cars": 3,
            "⁠Yachts or Private Boats": 7,
            "⁠Private Jets or Aircraft": 8,
            "⁠Art Collections or Antiques": 3,
            "⁠Jewelry or Rare Collectibles": 3
        };

        let assetScore = selectedItems.reduce((sum, asset) => sum + (luxuryAssetsValues[asset] || 0), 0);

        try {
            const response = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const scoreData = {
                    email,
                    IncomeScore: score,
                    LuxuryAssestsScore: assetScore
                };

                const response1 = await fetch('https://regnum-backend-bice.vercel.app/update-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scoreData),
                });

                if (response1.ok) {
                    alert("submitted!");
                    window.location.href = '../Reference details/index.html';
                } else {
                    console.error('Error updating user information:', await response1.json());
                }
            } else {
                console.error('Error updating user information:', await response.json());
            }
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const label = this.parentElement;
            const svgUnchecked = label.querySelector('.unchecked');
            const svgChecked = label.querySelector('.checked');

            svgUnchecked.style.display = this.checked ? 'none' : 'inline';
            svgChecked.style.display = this.checked ? 'inline' : 'none';
            label.style.color = this.checked ? 'black' : '';

            checkAllInputsFilled();
        });
    });

    howHeardSelect.addEventListener('change', checkAllInputsFilled);

    checkAllInputsFilled();
});
