const initializeLogin = () => {
    const loginForm = document.getElementById("loginForm")

    loginForm.addEventListener("submit", async function(event) {
        // Prevent the submission from reloading the page
        event.preventDefault()

        const formData = {
            "email": event.target.email.value,
            "password": event.target.password.value
        }
        console.log(formData)
        try {
            const loginData = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Explicitly set the header
                },
                body: JSON.stringify(formData)
            })
            if (!loginData.ok) {
                throw new Error("login failed.")
            }
            const resJson = await loginData.json()
            console.log(resJson)
            if(resJson.token) {
                localStorage.setItem("token", resJson.token)
                if (loginData.status != 200) {
                    window.location.href = "/login.html"
                } else {
                    window.location.href = "/"
                }
            }
        } catch(error) {
            console.log("Error occurred: " + error)
        } finally {
            loginForm.reset()
        }
    })
}


initializeLogin()
