document.addEventListener('DOMContentLoaded', function () {
    const email = localStorage.getItem("userEmail");
    console.log(email);
    document.getElementById("message").innerHTML = `Your Email-${email}`;
})