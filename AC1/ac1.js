document.addEventListener("DOMContentLoaded", () => {
    const codeElement = document.getElementById('code');

    // Function to fetch the code from the API
    const fetchCode = async () => {
        try {
            const response = await fetch('https://regnum-backend-bice.vercel.app/generate-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail")
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            console.log(data);
            
            // Assuming the API returns an object with a property `code`
            codeElement.textContent = data.code;
        } catch (error) {
            console.error('Error fetching the code:', error);
        }
    };

    // Call the function to fetch the code
    fetchCode();

    // Share functionality
    document.querySelector('.button1').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                text: `Here's your referral code: ${codeElement.textContent}`,
            }).then(() => {
                console.log('Text shared successfully!');
            }).catch((error) => {
                console.log('Error sharing text:', error);
            });
        } else {
            console.log('Web Share API not supported.');
        }
    });

    // Copy code functionality
    document.querySelector('.button2').addEventListener('click', () => {
        const code = codeElement.textContent;
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                console.log('Code copied to clipboard!');
                const copy = document.getElementById('copy');
                copy.style.display = 'block';
            }).catch((error) => {
                console.error('Error copying code:', error);
            });
        } else {
            console.log('No code to copy.');
        }
    });
});
