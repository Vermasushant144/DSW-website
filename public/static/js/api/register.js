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
        $("#response").text("Verification email sent to your email");
        $("#response").css("color", "rgb(5, 117, 5)");
        $("#response").css("background-color", "rgb(223, 255, 223)");
    } else {
        $("#response").text("Unable to register");
        $("#response").css("color", "rgb(177, 5, 5)");
        $("#response").css("background-color", "rgb(255, 223, 223)");
    }
    $("#response").css("display", "block");
});