
$("#btn-logout").click(async function () {

    let refreshToken = window.localStorage.getItem("refreshToken") || "Oauth2";
    let respone = await fetch("/accounts/logout", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });
    if (respone.status == 200) {
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("accsessToken");
    }
    window.location.replace("/");
})