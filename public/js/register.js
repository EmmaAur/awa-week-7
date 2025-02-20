
const initializeRegister = () => {
    const registerForm = document.getElementById("registerForm")

    registerForm.addEventListener("submit", async function(event) {
        // Prevent the submission from reloading the page
        event.preventDefault()

        const formData = {
            "email": event.target.email.value,
            "password": event.target.password.value
        }
        console.log(formData)
        try {
            const registerData = await fetch("http://localhost:3000/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Explicitly set the header
                },
                body: JSON.stringify(formData)
            })
            if (!registerData.ok) {
                throw new Error("Register failed.")
            }
            const resJson = await registerData.json()
            window.location.href = "/login.html"
        } catch(error) {
            console.log("Error occurred: " + error)
        } finally {
            registerForm.reset()
        }
    })
}


initializeRegister()