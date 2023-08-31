var registerForm = document.getElementById("registerform");
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    var formData = new FormData(registerForm);

    var response = await fetch(registerForm.action, {
        method: registerForm.method,
        body: formData
    });
    response = await response.json();

    if (response.status == 200) {
        alert("Verification email sent to your email");
    } else {
        alert("Unable to register");
    }
    $("#response").css("display", "block");
});