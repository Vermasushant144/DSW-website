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
/* <div id="auth">
            <a id="login-link" href="../auth/login">Login</a>
            <a id="signUp-link" href="../auth/register">SignUp</a>
          </div>
            <a id="profile"></a> */

// var onLoad = async (name) => {
//     let res = await fetch("/club/getMembers", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         mode: "cors",
//         body: JSON.stringify({
//             name: name
//         })
//     })
//     res = await JSON.parse(await res.text());
//     console.log(res);
//     if (res.status == "ok") {
//         document.getElementById("clubMemberList").innerHTML = '';
//         let members = res.members;
//         $("#totalMembers").text(members.length);
//         for (let i = 0; i < members.length; i++) {
//             document.getElementById("clubMemberList").innerHTML +=
//                 `
//                     <div class="child">
//                         <img src="${members[i].avatar}">
//                         <div class="inner">
//                             <a href='../profile/${members[i].ERP_ID}'><h1>${members[i].name}</h1></a>
//                         </div>
//                         <div class="inn">${members[i].position}</div>
//                     </div>
//                     `
//         }
//     }
// }
