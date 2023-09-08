var registerForm = document.getElementById("registerform");
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("loading").style.display = "flex";

    var formData = new FormData(registerForm);
    var jsonData = {};
    for (var [key, value] of formData.entries()) {
        jsonData[key] = value;
    }
    var response = await fetch(registerForm.action, {
        method: registerForm.method,
        headers:{
            "Content-type":"application/json",
        },
        body: JSON.stringify(jsonData),
    });
    response = await response.json();

    document.getElementById("loading").style.display = "none";
    if (response.status == 200) {
        alert("Verification email sent to your email");
    } else if(response.status=401){
        alert("Already have an account with this ERP_ID");
    }else {
        alert("Unable to register, Invalid data provided");
    }
});