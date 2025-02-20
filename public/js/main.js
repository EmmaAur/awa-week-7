
const logoutButton = document.getElementById("logout")

logoutButton.addEventListener("click", async function() {

    localStorage.removeItem("token")
    window.location.href = "login.html"

})
