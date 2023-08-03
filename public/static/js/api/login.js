const onLoad = async()=>{
    let token = localStorage.getItem("token");
    if(token){
        let response = await fetch("/auth/validate",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":token
            }            
        });
        response = await response.json();
        if(response.verify){
            window.location.replace("../profile/"+response.ERP_ID);
        }else{
            localStorage.removeItem("token");
            window.location.reload();
        }
    }
}
var switchForm = ()=>{
    if($("#switchBtn").text()=="Forget password"){
        $("#loginform").css("display","none");
        $("#forgetform").css("display","block");
        $("#switchBtn").text("Back to Login");
    }else{
        $("#loginform").css("display", "block");
        $("#forgetform").css("display", "none");
        $("#switchBtn").text("Forget password");
    }
}
var loginform = document.getElementById("loginform");
loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    var formData = new FormData(loginform);
    //convert formData to json
    var jsonData = {};
    for (var [key, value] of formData.entries()) {
        jsonData[key] = value;
    }
    let response = await fetch(loginform.action, {
        method: loginform.method,
        headers:{
            "Content-type":"application/json",
        },
        body: JSON.stringify(jsonData),
    });
    response = await response.json();
    console.log(response.status);
    if (response.status == 200) {
        localStorage.setItem("token",response.token);
        window.location.href = "/";
    } else if(response.status==403){
        $("#loginResponse").text("Your Account is not verified yet!!");
        $("#loginResponse").css("color","rgb(148 151 0)");
        $("#loginResponse").css("background-color","rgb(245 255 162)");
        $("#loginResponse").css("display","block");
    }else{
        $("#loginResponse").text("Invalid Credential!!");
        $("#loginResponse").css("color","rgb(177, 5, 5)");
        $("#loginResponse").css("background-color","rgb(255, 223, 223)");
        $("#loginResponse").css("display","block");
    }
});

var forgetForm = document.getElementById("forgetform");
forgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    var jsonData = {}
    for (var [key, value] of (new FormData(forgetForm)).entries()) {
        jsonData[key] = value;
    }
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let response = await fetch(forgetForm.action, {
      method: forgetForm.method,
      body: JSON.stringify(jsonData),
      headers:headers
    });
  
    response = await response.json();
    if (response.status == 200) {
        $("#forgetResponse").text("Reset password Email sent Succesfully")
        $("#forgetResponse").css("color","rgb(5, 117, 5)");
        $("#forgetResponse").css("background-color","rgb(223, 255, 223)");
        $("#forgetResponse").css("display","block");
    } else {
        $("#forgetResponse").text("Email not sent");
        $("#forgetResponse").css("color","rgb(177, 5, 5)");
        $("#forgetResponse").css("background-color","rgb(255, 223, 223)");
        $("#forgetResponse").css("display","block");
    }
})