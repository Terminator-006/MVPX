let otp = "";
document.addEventListener('DOMContentLoaded', function () {
    const otpInput1 = document.getElementById('otp1');
    const otpInput2 = document.getElementById('otp2');
    const otpInput3 = document.getElementById('otp3');
    const otpInput4 = document.getElementById('otp4');
    const otpInput5 = document.getElementById('otp5');
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
                    
                    // Change input borders to green
                

                    // Create an entry in the database after OTP verification
                    const createUserEntryResponse = await fetch('https://regnum-backend-bice.vercel.app/update-details', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });

                    if (createUserEntryResponse.ok) {
                        window.location.href = '../Information/index.html'; // Redirect to next page
                    } else {
                        const errorData = await createUserEntryResponse.json();
                        showErrorMessage();
                    }
                } else {
                    const errorData = await response.json();
                    showErrorMessage(errorData.error || 'Error verifying OTP. Please try again.');
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

    inputs.forEach((input) => {
        input.addEventListener("input", function (e) {
            const target = e.target;
            const val = target.value;

            if (isNaN(val)) {
                target.value = "";
                return;
            }

            otp += val;
            target.value = '*';

            if (val !== "") {
                const next = target.nextElementSibling;
                if (next) {
                    next.focus();
                }
            }
        });

        input.addEventListener("keyup", function (e) {
            const target = e.target;
            const key = e.key.toLowerCase();

            if (key === "backspace" || key === "delete") {
                const index = Array.from(inputs).indexOf(target);
                otp = otp.slice(0, index) + otp.slice(index + 1);
                target.value = "";
                const prev = target.previousElementSibling;
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

function showErrorMessage() {
    console.log('hi');
    const errorDiv = document.getElementById('error');
    const inp = document.getElementById('harshit');
    errorDiv.style.display = 'flex'; // Make sure the error div is visible
    inp.style.border ='3px solid red';

}

function showSuccessMessage(){
    console.log('hi');
    const errorDiv = document.getElementById('error');
    const success = document.getElementById('error-message');
    const inp = document.getElementById('harshit');
    errorDiv.style.display = 'flex'; // Make sure the error div is visible
    inp.style.border ='3px solid green';
    success.innerText ='OTP verified succesfully';

}
