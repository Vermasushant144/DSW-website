var resetForm = document.getElementById("resetform");
resetForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    var jsonData = {};
    for(var [key,value] of (new FormData(resetForm)).entries()){
        jsonData[key] = value;
    }
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let response = await fetch(resetForm.action, {
        method: resetForm.method,
        headers: headers,
        body: JSON.stringify(jsonData)
    });
    response = await response.json();
    if(response.status==200){
        $("#response").text("Password Reset Successfully");
        $("#response").css("color","rgb(5, 117, 5)");
        $("#response").css("background-color","rgb(223, 255, 223)");
    }else{
        $("#response").text("Password Reset failed");
        $("#response").css("color","rgb(117, 5, 5)");
        $("#response").css("background-color","rgb(255, 223, 223)");
    }
    $("#response").css("display","block");
});