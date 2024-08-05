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
                    // Add any required data for the POST request here
                    email : localStorage.getItem("userEmail")
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
});
