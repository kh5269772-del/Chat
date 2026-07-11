
let inputSend = document.getElementById("inputSend")
let button = document.getElementById("button")
let tosection = document.querySelector(".tosection")
let hi_neme = document.getElementById('hi_neme')
let chatBody = document.querySelector(".chatBody")
let connectEmoji = document.querySelector('.connectEmoji')
let number = 0
let tmp = false
hi_neme.textContent = "hi " +  JSON.parse(localStorage.getItem("name"))
button.addEventListener("click", sendorder)
inputSend.addEventListener("keydown", (event) => {
    console.log(event)
    if (event.key == "Enter") {
        sendorder()

    }
})

function sendorder() {
    if (inputSend.value == ''||tmp) {
        return;
    }
    sendusermessage(inputSend.value.trim())
    inputSend.value = ''
     bottom()
     button.classList.add("opacity")


}

function sendusermessage(value) {
    tmp = true
    let section = document.createElement("section")
    section.className = 'message_user';
    section.innerHTML = value;
    tosection.appendChild(section)
    reqmessage(value)
}

let connectapi = async (value) => {
    const api = await fetch("http://localhost:3000/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: `${value}`
        })
    })

        .then((data) =>
            data.json() 
            
       )
     
        .then((data) =>{
              tmp = false
            console.log(data)
            let davalue = data.message.content
            reqmessage(davalue) 

        }
        )
        .catch((error) => console.log(error))
        .finally(()=>{
            button.classList.remove("opacity")
        })

}


function reqmessage(value) {
    if (tmp) {
        number++
        let section = document.createElement("section")
        section.className = 'message_ai';
        section.id = number;
        section.innerHTML = loding();
        tosection.appendChild(section)
        connectapi(value)
    } else {
      
        document.getElementById(number).innerHTML = value.trim()



    }
}

function loding() {
    return `

    <svg style="height: 30px; margin: 0;
    padding: 0; " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#2094F3" stroke="#2094F3" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#2094F3" stroke="#2094F3" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#2094F3" stroke="#2094F3" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
    
        `
}

function bottom(){
    chatBody.scrollTo({
        top:chatBody.scrollHeight,
        behavior:"smooth"
    })
}
let emo = false
connectEmoji.style.display = 'none'
function emojis(){
    emo = !emo
    if(emo){
        let options = {
        onEmojiSelect:(emoji)=>{
            inputSend.value+= emoji.native
            connectEmoji.style.display = 'none'
        }
    }
    let picker = new EmojiMart.Picker(options)
    connectEmoji.appendChild(picker)
    connectEmoji.style.display = "none"?"block":"none"
    }else{
        connectEmoji.style.display = "none"
        connectEmoji.innerHTML = ''
        
    }
}