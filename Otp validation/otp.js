let otp = "";
document.addEventListener('DOMContentLoaded', function () {
    const otpInputs = [
        document.getElementById('otp1'),
        document.getElementById('otp2'),
        document.getElementById('otp3'),
        document.getElementById('otp4'),
        document.getElementById('otp5')
    ];
    const nextButton = document.getElementById('next-button');
    const email = localStorage.getItem('userEmail');

    document.getElementById("message").innerHTML = `Sent to <span style="font-weight: bold; color: green;">${email}</span>`;

    nextButton.addEventListener('click', async function () {
        if (!nextButton.disabled) {
            console.log(otp);

            // Send OTP verification request to the backend
            try {
                const response = await fetch('https://regnum-backend-bice.vercel.app/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, otp }),
                });

                if (response.ok) {
                    showSuccessMessage();

                    // Create an entry in the database after OTP verification
                    const createUserEntryResponse = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });

                    if (createUserEntryResponse.ok) {
                        window.location.href = '../Gender/index.html'; // Redirect to next page
                    } else {
                        const errorData = await createUserEntryResponse.json();
                        showErrorMessage('Failed to create user entry.');
                    }
                } else {
                    const errorData = await response.json();
                    showErrorMessage(errorData.message || 'Failed to verify OTP. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorMessage('Failed to verify OTP. Please try again later.');
            }
        }
    });

    const inputsContainer = document.getElementById("inputs");
    const inputs = inputsContainer.querySelectorAll(".enter");
    let userManuallySelected = false;

    // Focus on the first input when the inputs div is clicked and the user hasn't manually selected any input
    inputsContainer.addEventListener('click', () => {
        if (!userManuallySelected && inputs.length > 0) {
            inputs[0].focus();
        }
    });

    inputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            const val = input.value;

            if (isNaN(val)) {
                input.value = "";
                return;
            }

            otp = otp.slice(0, index) + val + otp.slice(index + 1);

            if (val !== "") {
                const next = input.nextElementSibling;
                if (next) {
                    next.focus();
                }
            }
        });

        input.addEventListener("keyup", function (e) {
            if (e.key.toLowerCase() === "backspace" || e.key.toLowerCase() === "delete") {
                otp = otp.slice(0, index) + otp.slice(index + 1);
                input.value = "";
                const prev = input.previousElementSibling;
                if (prev) {
                    prev.focus();
                }
            }
        });

        // Set the flag to true if the user manually selects any input
        input.addEventListener('focus', () => {
            userManuallySelected = true;
        });
    });
});

function showErrorMessage(message) {
    const errorDiv = document.getElementById('error');
    const inp = document.getElementById('harshit');
    errorDiv.style.display = 'flex'; // Make sure the error div is visible
    inp.style.border = '3px solid red';
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'flex';
    errorMessage.style.color = 'red';
    errorMessage.textContent = message;
}

function showSuccessMessage() {
    const errorDiv = document.getElementById('error');
    const successMessage = document.getElementById('error-message');
    const inp = document.getElementById('harshit');
    const err = document.getElementById('err');
    errorDiv.style.display = 'flex'; // Make sure the error div is visible
    err.style.display = 'none';
    inp.style.border = '3px solid green';
    successMessage.innerHTML = '<img src="./Heart2.png" alt="Heart Icon" width="14" height="14"/> Email is Successfully verified';
    successMessage.style.color = 'green';
}
