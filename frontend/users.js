


let name_my = document.getElementById("name_my")
let container = document.querySelector(".container")
let logout_my = document.getElementById("logout_my")
let image_my = document.getElementById("image_my")
let onfocase = document.getElementById("onfocase")


let hineme = document.getElementById("hi_neme")


let idm = null
let idu = null


let emailtok = null
let lodeprofile = async () => {
    let token = JSON.parse(localStorage.getItem("jwt"))
    try {

        let api = await fetch("http://localhost:3000/profile-data", {
            method: "GET",
            headers: {
                authdata: `Bearer ${token}`
            }
        })

        if (api.status === 403 || api.status === 404) {
            console.log(`startd on port ${api.status}`)
            window.location.href = "index.html"
            return;
        }
        let data = await api.json()

        container.style.display = 'block'

        name_my.textContent = data.user.firstName
        localStorage.setItem("name", JSON.stringify(data.user.firstName))
        image_my.src = data.user.image
        if (data.user.image == null) {
            image_my.style.display = 'none'
            let de = document.createElement("div")
            de.className = 'avaterI'
            de.textContent = data.user.firstName[0]
            let name_img_my = document.querySelector('.inmg')
            name_img_my.appendChild(de)
        }
        emailtok = data.user.email
        idm = data.user.id
        localStorage.setItem("idm", JSON.stringify(data.user.id))






    }
    catch (error) {
        console.log(error)
    }
}
lodeprofile()







let users_list = document.querySelector(".users_list")
let filter = []
let filterUnread = [];

const showlest = async () => {

    try {
        const apilest = await fetch("http://localhost:3000/users-lest", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        const datalest = await apilest.json()

        filter = datalest.users.filter((element) => {
            return element = !element.email.includes(emailtok)
        })
        console.log(filter)


        socketjs()
        // newMessage()

    }
    catch (error) {
        console.log(error)
    }
}


showlest()

function updateUsersUI(socket) {
    let lest = ''
    let local = socket
    for (let i = 0; i < filter.length; i++) {
        let currentUserId = String(filter[i].id)
        let isonline = local.includes(currentUserId)
        let userUnreadData = filterUnread.unreadCount.find(item => item.sender_id == filter[i].id);
        console.log(userUnreadData)
        let unreadCountNumber = (userUnreadData && userUnreadData.unread_count > 0) ? userUnreadData.unread_count : '';
        

        // item => item.sender_id === 
        console.log(isonline)

        lest +=
            `
            <a  onclick="snendId(${filter[i].id})" href="chat.html"  class="link_you">
                <div class="content">
                    <div class="user_mane_img">
                       <div class="inmg">
                        <img src=${filter[i].image || "./image/user-profile-icon-line-style-vector-50642245.avif"} alt="">
                         </div>
                      ${unreadCountNumber ? `<p class="notice">${unreadCountNumber}</p>` : ''}
                        <div class="data_you">
                            <div class="data_my">
                                <span>${filter[i].firstName}</span>
                                <p>${isonline ? "active now" : "offline"}</p>
                            </div>
                        </div>
                    </div>
                  
                    <i  id="${isonline ? "online" : 'ofline'}" class="fas fa-circle"></i>
                </div>
            </a>
        
            `

    }
    // console.log(lest)
    users_list.innerHTML = lest

}


logout_my.onclick = function () {
    localStorage.removeItem("jwt")
    localStorage.removeItem("name")

    window.location.href = "index.html"
}


function snendId(id) {
    localStorage.setItem("idu", JSON.stringify(id))


}

let listOnlunesup = []

const socket = io("http://localhost:3000")
let socketjs = async (newMe) => {
    socket.emit("join", idm)
    socket.on("onlineUser", (listUsOnline) => {

        console.log(listUsOnline)
        updateUsersUI(listUsOnline)
        listOnlunes = listUsOnline

    })

}


const unread = async () => {
    let sender = JSON.parse(localStorage.getItem("idm"))
    if(!sender)return;

    try {
        const rend = await fetch(`http://localhost:3000/chat-unread-count?id=${sender}`)
        const data_unread = await rend.json()

        filterUnread = data_unread
        console.log(filterUnread)
        updateUsersUI(listOnlunesup)

    } catch (error) {
        console.log(error)
    }

}
unread()
socket.on("receive_live_message", (data) => {
    unread()
})





// const newMessage = async () => {

//     socket.on("newMessage", (data) => {
//         let stor = JSON.parse(localStorage.getItem('idu'))

//         if (stor == data.sender_id) {
//             console.log('no message')
//         } else {
//             console.log(data.sender_id)
//             console.log('new message ' + data.message + data.sender_id)
//         }


//     })
// }
























































const searchUser = document.getElementById("search")

searchUser.addEventListener("keyup", function () {

    const link_you = document.querySelectorAll(".link_you")
    link_you.forEach((element) => {
        const name = element.querySelector('span').innerHTML
        const span = name.includes(searchUser.value)
        if (span) {
            element.style.display = "block"
        } else {
            element.style.display = "none"
        }
    })
})







