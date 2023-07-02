const onLoad = async () => {
    let token = localStorage.getItem("token");
    if (token) {
        let response = await fetch("/auth/validate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });
        response = await response.json();
        if (response.verify) {
                $('#pvtComponent1').html(
                    `
                        <div id="notification">
                            <a href='/nofitication'><i class='fa fa-bell'></i></a>
                            <div></div>
                        </div>
                        <a id="profile" href='/profile/${response.ERP_ID}'>${response.Name}</a>`
                )
        } else {
            localStorage.removeItem("token");
            window.location.reload();
        }
    } else {
        $('#pvtComponent1').html(
            `
                <a href="../auth/login">Login</a>
                <a href="../auth/register">SignUp</a>
            `);
    }
}

const searchClubs = async(value)=>{
    let response = await fetch(`/club/searchClubs?clubName=${value}`)
    response = await response.json();
    let container = $("#suggestionClubs").html("");
    for(let i=0;i<response.clubs.length;i++){
        container.html(
            container.html()+`<a href="/club/${response.clubs[i].name}" style="display: flex;">
                <img src="${window.SERVER_DIR+response.clubs[i].icon}" width="50px" height="50px" alt="clubIcon">
                <h3>${response.clubs[i].name}</h3>
            </a>`
        );
    }
}
$("#search-input").on("blur",()=>{
    if(!$("#suggestionClubs").is(":hover")){
        $("#suggestionClubs").html("");
    }
});

const eventpop = (event)=>{
    console.log("got called");
    $("#event-popup-img").attr("src",window.SERVER_DIR+event.icon);
    $("#event-popup-name").text(event.Name);
    $("#event-popup-clubName").text(event.clubName);
    let dateString = event.Date.split("-");
    $("#event-popup-date").text(dateString[2]+"-"+dateString[1]+"-"+dateString[0]);
    $("#event-popup-detail").text(event.Desc)
    $("#event-popup").css("display","flex");
}
const removeEventPopup = ()=>{
    $("#event-popup").css("display","none");
}