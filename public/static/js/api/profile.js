var onLoad = async()=>{
    let token = localStorage.getItem("token");
    if(token){
        let response = await fetch('/profile/'+window.user.ERP_ID+"/isOwner",{
            headers:{
                "Authorization":token
            }
        });
        if(response){
            let innerHtml = await response.text();
            $("#editable").html(innerHtml);
        }
    }
    //setUp edit form
    $("#name").attr("value", window.user.name);
    $("#ERP_ID").attr("value",window.user.ERP_ID);
    $("#branch").attr("value" , window.user.branch);
    $("#year").attr("value" , window.user.year);
    $("#gender").attr("value" ,window.user.gender);
    $("#contactNo").attr("value" ,window.user.contactNo);
    $("#whatsapp").attr("value",window.user.medialink.whatsapp.split("/").pop());
    $("#linkedIn").attr("value" ,window.user.medialink.linkedin);
}

var editProfileToggle = async()=>{
    let editForm = document.getElementById("editProfileForm");
    if(editForm.style.display=="none"){
        editForm.style.display = "block";
    }else{
        editForm.style.display = "none";
    }
}
