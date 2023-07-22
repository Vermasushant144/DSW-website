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
