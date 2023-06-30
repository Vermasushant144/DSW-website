// const onLoad = async () => {
//     let token = localStorage.getItem("token");
//     if (token) {
//         let response = await fetch("/auth/validate", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "authorization": token
//             }
//         });
//         response = await response.json();
//         console.log(response);
//         if (response.verify) {
//             $("#profile").css("visibility" ,"visible");
//             $("#auth").css("visibility","hidden");
//             $("#profile").text(response.Name);
//             $("#profile").attr("href",`/profile/${response.ERP_ID}`)
//         } else {
//             localStorage.removeItem("token");
//             window.location.reload();
//         }
//     } else {
//         $("#profile").css("visibility","hidden");
//         $("#auth").css("visibility","visible");
//     }
// }
/* <div id="auth">
            <a id="login-link" href="../auth/login">Login</a>
            <a id="signUp-link" href="../auth/register">SignUp</a>
          </div>
            <a id="profile"></a> */

var onLoad = async (name) => {
    let res = await fetch("/club/getMembers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
            name: name
        })
    })
    res = await JSON.parse(await res.text());
    console.log(res);
    if (res.status == "ok") {
        document.getElementById("clubMemberList").innerHTML = '';
        let members = res.members;
        $("#totalMembers").text(members.length);
        for (let i = 0; i < members.length; i++) {
            document.getElementById("clubMemberList").innerHTML +=
                `
                    <div class="child">
                        <img src="${members[i].avatar}">
                        <div class="inner">
                            <a href='../profile/${members[i].ERP_ID}'><h1>${members[i].name}</h1></a>
                        </div>
                        <div class="inn">${members[i].position}</div>
                    </div>
                    `
        }
    }
}
