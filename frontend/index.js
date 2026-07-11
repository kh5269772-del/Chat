

const iEye = document.querySelector("#iEyeslash")
const password = document.getElementById("password")

let pass = true

iEye.addEventListener("click", function () {
    if (pass) {
        password.type = 'text'
        iEye.classList = 'fas fa-eye'
        pass = false
    } else {
        password.type = 'password'
        iEye.classList = 'fas fa-eye-slash'
        pass = true
    }
})

let inputImg = null



const register = document.getElementById("register")

register.addEventListener("submit", async (e) => {
    e.preventDefault()
    const firstName = document.getElementById("firstName").value.trim()
    const lastName = document.getElementById("lastName").value.trim()
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value.trim()


  

    let pasch = password.length
    if (pasch < 8 || email.length < 10 ||
        firstName.length < 2 ||
        !/[1-9]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[!@#$%^&*]/.test(password)

    ) {
        return alert("weak password")
    }
    const formData = new FormData()


    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)
    formData.append("password", password)


    datano(firstName, lastName, email, password)

    formData.append("avatar", inputImg)

    try {

        let api = await fetch("http://localhost:3000/index", {
            method: "POST",
            body: formData
        })

        let data = await api.json()
        let token = data.token
        if (token) {
            console.log(data)
            localStorage.setItem("jwt", JSON.stringify(token))
            localStorage.setItem("name", JSON.stringify(data.firstName))
            alert("create acount")
            window.location.href = "users.html"
        } else if (data.message == "email found") {
            alert("email found")
        }

    } catch (error) {
        console.log(error)
    }

})


const fileImg = document.getElementById("image")
fileImg.addEventListener("change", (e) => {
    tatgitImg(e)
})

function tatgitImg(e) {
    let file = e.target.files[0]
    if (file) {
        inputImg = file
    }

}

function datano(fistName, lastName, email, password) {
    fistName = ''
    lastName = ''
    email = ''
    password = ''

}



