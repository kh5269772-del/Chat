


let input_text = document.getElementById('input_text')
let input_img = document.getElementById('input_img')
let send = document.getElementById('send')
let myMessage = document.querySelector(".myMessage")
let message_Y = document.querySelector(".message_Y")
let eye_img = document.getElementById("eye_img")
let avatar_img = document.getElementById("avatar_img")
let name_us = document.getElementById("name_us")
let youMessage = document.querySelector(".youMessage")
let tosection = document.querySelector(".tosection")
let chatBody = document.querySelector(".chatBody")
let connectEmoji = document.querySelector('.connectEmoji')

let idm = JSON.parse(localStorage.getItem("idm"))
let idu = JSON.parse(localStorage.getItem("idu"))

let messagefile = null
let spm = ''

let socket = io("http://localhost:3000")

input_text.addEventListener("keydown", (event) => {
    console.log(event)
    if (event.key == 'Enter') {
        sendmessage()
        bottom()

    }
})

send.addEventListener("click", () => {
    sendmessage()
    bottom()

})


let emo = false
function emojis() {
    emo = !emo
    if (emo) {

        const options = {
            onEmojiSelect: (emoji) => {
                input_text.value += emoji.native
                connectEmoji.style.display = 'none'

            }
        }

        let picar = new EmojiMart.Picker(options)
        connectEmoji.appendChild(picar)
        connectEmoji.style.display = "none" ? "block" : "none"

    } else {
        connectEmoji.style.display = 'none'
        connectEmoji.innerHTML = ''

    }
}


let sendmessage = async () => {

    if (input_text.value == '' && messagefile == null) {
        return;
    }


    let message = input_text.value.trim()
    let formdata = new FormData()

    formdata.append("message", message)
    formdata.append("messagefile", messagefile)
    formdata.append("idm", idm)
    formdata.append("idu", idu)
    messagefile = null
    input_text.value = ''


    try {
        let respons = await fetch("http://localhost:3000/chat-users", {
            method: "POST",
            body: formdata
        })

        let data = await respons.json()
        console.log(data)
        ava()
        if (data) {
            socket.emit('live_ping_message',data)
        }

    }
    catch (error) {
        console.log(error)
    }

}





let ava = async () => {

    try {
         bottom()
        let api = await fetch(`http://localhost:3000/avatar-user?idm=${idm}&idu=${idu}`)
        let res = await api.json()
        console.log(res)
        avatar_img.src = res.datauser.image || "./image/user-profile-icon-line-style-vector-50642245.avif";
        name_us.textContent = res.datauser.firstName
        showdata(res.results, res.datauser.image || "./image/user-profile-icon-line-style-vector-50642245.avif")



    } catch (error) {
        console.log(error)
    }
}



ava()

socket.on("receive_live_message", (data) => {
    // showdata(data, "./image/user-profile-icon-line-style-vector-50642245.avif")
    console.log(data)
    ava()
   
    
})


function showdata(data, img) {

    tosection.innerHTML = ''

    data.forEach(element => {

        let wrapper = document.createElement("section")
        let span = document.createElement("span")
        let modelElement = null

        if (element.file) {
            let ext = element.file.split('.')[1].toLowerCase()
            if (["jpeg", "jpg", "png"].includes(ext)) {
                modelElement = document.createElement("img")
                modelElement.src = element.file
                modelElement.className = 'filell'
            } else if (ext == "mp4") {

                modelElement = document.createElement("div")
                modelElement.innerHTML = `<video src="${element.file}" class ='filell' controls></video>`
                modelElement.className = 'filell'
            }
        }


        if (element.sender_id == idm) {
            wrapper.className = "myMessage"
            wrapper.textContent = element.message
            //   let now = element.created_at
            // let utcdata= new Date(now)
            // let  locatime  = utcdata.toLocaleTimeString()
            // console.log(locatime)
            // span.textContent = locatime
            if (modelElement) wrapper.appendChild(modelElement);
            wrapper.appendChild(span)



        } else {
            wrapper.className = 'youMessage'

            let imageus = document.createElement("img")
            imageus.src = img
            imageus.className = 'imgav'

            let section = document.createElement("section")
            section.className = "message_Y"
            section.textContent = element.message

            wrapper.appendChild(imageus)
            wrapper.appendChild(section)
            let now = element.created_at
            let utcdata = new Date(now)
            let locatime = utcdata.toLocaleTimeString()
            span.textContent = locatime
            span.className = 'spantime'
            if (modelElement) wrapper.appendChild(modelElement);
            section.appendChild(span)

        }

        tosection.appendChild(wrapper)


    });
}

input_img.addEventListener("change", (e) => {
    let file = e.target.files[0]
    if (file) {

        messagefile = file

    }
})




function bottom() {
    setTimeout(() => {
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior: "auto"
        })
    }, 100);

}



let socketjs = async () => {
    socket.emit("join", idm)
    socket.on("onlineUser", (listUsOnline) => {

        console.log(listUsOnline)

    })

}
socketjs()


// let sendMessages = async (data)=>{
//     socket.emit("sendMessage",data||null)
// }



