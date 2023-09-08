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
                        <div id='notification-btn'>
                            <button onclick=showMessages()><i class='fa fa-bell'></i></button>
                            <div></div>
                        </div>
                        <a id="profile" href='/profile/${response.ERP_ID}'>${response.Name}</a>`
                )
                let isUnread = await fetch("/unread-notification",{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                });
                isUnread = await isUnread.json();
                if(isUnread.status){
                    $("#notification-btn div").css("display","block");
                }
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

const clubList = async()=>{
    
}

const searchClubs = async(value)=>{
    let response = await fetch(`/club/searchClubs?clubName=${value}`)
    response = await response.json();
    let container = $("#suggestionClubs").html("");
    $("#suggestionClubs").css("height","300px");
    for(let i=0;i<response.clubs.length;i++){
        container.html(
            container.html()+`<a href="/club/${response.clubs[i].name}" style="display: flex;">
                <img src="${response.clubs[i].icon}" width="50px" height="50px" alt="clubIcon">
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
    $("#event-popup-img").attr("src",event.icon);
    $("#event-popup-name").text(event.Name);
    $("#event-popup-clubName").text(event.clubName);
    let dateString = event.Date.split("-");
    $("#event-popup-date").text(dateString[2]+"-"+dateString[1]+"-"+dateString[0]);
    $("#event-popup-detail").text(event.Desc)
    $("#popup-screen").css("display","block");
    if($(window).width()>420){
        $("#event-popup").css("display","flex");
    }else{
        $("#event-popup").css("display","block");
    }
}
const removeEventPopup = ()=>{
    $("#popup-screen").css("display","none");
    $("#event-popup").css("display","none");
}
const showMessages = async()=>{
    let response = await fetch("/notification",{
        headers:{
            "authorization":localStorage.getItem("token")
        }
    });
    response= await response.json();
    // get user ID
    if(response.status==200){
        let {notifications} = response;
        let {ERP_ID} = response;
        let innerHtml = '';
        for(let i=0;i<notifications.length;i++){
            let date = notifications[i].date.split("-");
            let shortDetail = '';
            let j=0;
            while(j<notifications[i].detail.length && j<25){
                shortDetail+=notifications[i].detail[j];
                j++;
            }
            let readed = notifications[i].readed.includes(ERP_ID);
            innerHtml+=`<button class='message ${(readed)?'readed':'unreaded'}' onclick='expandMessage(${i},${readed},${JSON.stringify(notifications[i]._id)})'>
                <div class='message-desc'>
                    <h3>${notifications[i].title}</h3>
                    <p class='half-text'>${shortDetail}...</p>
                    <p class='full-text'>${notifications[i].detail}</p>
                </div>
                <div class='message-date'>
                    ${date[2]}-${date[1]}-${date[0]}
                </div>
            </button>`
        }
        $("#popup-screen").css("display","block");
        $("#messages-list").html(innerHtml);
        $("#messages-container").css("display","block");
    }else{
        window.location.replace("/auth/login");
    }
}
const expandMessage = async(index,readed,id)=>{
    if($(".half-text").eq(index).css("display")=="block"){
        $(".half-text").eq(index).css("display","none");
        $(".full-text").eq(index).css("display" , "block");
    }else{
        $(".half-text").eq(index).css("display","block");
        $(".full-text").eq(index).css("display" , "none");
    }
    if(!readed){
        
        let response = await fetch("/notification-readed",{
            headers:{
                "Content-Type":"application/json",
                "authorization":localStorage.getItem("token")
            },
            method:"PUT",
            body:JSON.stringify({
                notifyID:`${id}`
            })
        });
        response = await response.json();
        if(response.status){
            $(".message").eq(index).removeClass("unreaded").addClass("readed");
        }
    }
}
const removeMessages = async()=>{
    $("#messages-container").css("display","none");
    $("#popup-screen").css("display","none");
    let isUnread = await fetch("/unread-notification",{
        headers:{
            "Authorization":localStorage.getItem("token")
        }
    });
    isUnread = await isUnread.json();
    if(isUnread.status){
        $("#notification-btn div").css("display","block");
    }else{
        $("#notification-btn div").css("display","none");
    }
}
$("#search-btn-icon").hover(
    ()=>{
        if($(window).width()>422){
            $("#search").css("width","400px");
            $("#search-input").css("padding","5px");
            $("#search").focus();
        }else{
            $("#search").css("width","100%");
            $("#search-input").css("padding","10px");
            $("#search").focus();
        }
    }
)
$("#nav1-links").hover(()=>{},()=>{
    if($("#search").css("width")!=0){
        $("#suggestionClubs").html("");
        $("#search").css("width","0px");
        $("#suggestionClubs").css("height","0px");
        $("#search-input").css("padding","0px");
    }
})