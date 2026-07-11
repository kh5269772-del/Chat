
let form_login = document.getElementById("form_login")

form_login.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value.trim()
    // let formData = new FormData()
    // formData.append( email, email )
    // formData.append( password ,password )

    try{
        let api = await fetch("http://localhost:3000/login",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
               "email": email ,
               "password":password 
            })
        })

        const data = await api.json()
        const token = data.token
        if(token){
            localStorage.setItem("jwt",JSON.stringify(token))
                console.log(data)
            window.location.href = 'users.html'
           
        
        }else{
            console.log("error login")
        }



    }
    catch(error){
        console.log(error)
    }
})















































const iEye = document.querySelector("#iEye")
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



