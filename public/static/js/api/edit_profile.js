var logout = async()=>{
    localStorage.clear();
    window.location.href = "/auth/login"
}
var editProfileForm = document.getElementById("editProfileForm");
editProfileForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const formData = new FormData(editProfileForm);
    let avatar = formData.get("avatar");
    formData.delete('avatar');
    formData.append('ERP_ID', window.user.ERP_ID);
    formData.append('avatar', avatar);

    let response = await fetch(editProfileForm.action, {
        method: "POST",
        headers: {
            "authorization": localStorage.getItem("token")
        },
        body: formData
    });

    const result = await response.json();
    if(result.status=="ok"){
        window.location.reload();
    }else{
        alert(response.status)
    }
});