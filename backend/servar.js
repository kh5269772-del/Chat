 
const express = require("express")
const app = express()
const cors = require("cors")
const mysql = require("mysql")
const path = require("path")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const { resolveAny } = require("dns")
app.use(express.json())
app.use(cors())
app.use(cookie())







const upla = path.join(__dirname, "uploads")
const publicimg = path.join(__dirname, "public")
app.use(express.static(upla))
app.use(express.static(publicimg))


require("dotenv").config()
const HOST = process.env.HOST
const NAME = process.env.NAME
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const CHARSET = process.env.CHARSET
const DATABASECHAT = process.env.DATABASECHAT

const db = mysql.createConnection({
    host: HOST,
    user: NAME,
    password: PASSWORD,
    database: DATABASE,
    charset: CHARSET,
})

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("mysql connect...")
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)

        const urlfile = Date.now() + "_" + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + "-" + urlfile + ext)
    }

})
const upload = multer({ storage: storage })
// const upload = multer({dest:"uploads/"})

app.post("/index", upload.single("avatar"), (req, res) => {

    const { firstName, lastName, email, password } = req.body;
    const img = req.file ? "http://localhost:3000/" + req.file.filename : null;

    db.query("SELECT email FROM user WHERE email =?", [email], async (error, results) => {
        if (error) {
            console.log(error)
            return res.json({
                message: error
            })
        }
        if (results.length > 0) {
            return res.json({
                message: "email found"
            })
        } else {

            const passwordHash = await bcrypt.hash(password, 8)
            db.query("INSERT INTO user SET ?", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: passwordHash,
                image: img
            }, (error, results) => {
                if (error) {
                    console.log(error)
                    return res.json({
                        message: error
                    })
                } else {
                    console.log(results)
                    const insertId = results.insertId
                    const token = jwt.sign(
                        { id: insertId },
                        process.env.JWT_SELECT || "select-default-key",
                        { expiresIn: "1d" }
                    )

                    const cookies = {
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: false
                    }
                    res.cookie('jwt', token, cookies)
                    console.log(req.body)

                    res.json({
                        name: req.body.lastName,
                        avatar: img,
                        token: token
                    })


                }
            })
        }
    })
});

const requireAuth = (req, res, next) => {
    const reqheaders = req.headers["authdata"]
    if (!reqheaders) {
        return res.status(401).json({ message: "no token" })
    }
    const token = reqheaders.split(" ")[1]
    jwt.verify(
        token,
        process.env.JWT_SELECT || "select-default-key",
        (error, data) => {
            if (error) {
                return res.status(403).json({ message: "error token" })
            }
            req.userId = data.id
            next()
        }
    )

}

app.get("/profile-data", requireAuth, (req, res) => {
    const userId = req.userId;
http://127.0.0.1:5500/chatAi.html
    db.query("SELECT id,firstName,lastName,email,image FROM user WHERE id=?", [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "error tok" })
        }
        if (results.length > 0) {
            res.json({ user: results[0] })
        } else {
            res.status(404).json({ message: "user not found" })
        }
    })
})



app.post("/login", (req, res) => {

    const { email, password } = req.body;
    db.query("SELECT * FROM user WHERE email=?", [email], async (error, results) => {
        if (error) {
               res.json({ message: "no login" })
            return console.log(error)
         

        }
        if (results.length === 0) {
              res.json({ message: "no login" })
            return console.log("no login")
          
        }
        const user = results[0]

        const isMatch = bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.json({ message: "no login" })
            return console.log("no login")
            
        }

        const insertId = user.id

        const token = jwt.sign(
            { id: insertId },
            process.env.JWT_SELECT || 'select-default-key',
            { expiresIn: "1d" }
        )

        const cookies = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1E3),
            httpOnly: true,
            secure: false
        }

        res.cookie("jwt", token, cookies)

        res.json({
            name: user.firstName,
            avatar: user.img,
            token: token,
            email: user.email
        })


    })
})


app.get("/users-lest", (req, res) => {

    db.query("SELECT id,firstName,lastName,image,email  FROM user", (error, results) => {
        if (error) {
            return res.json({ message: "error", users: [] })
        }
        if (results.length == 0) {
            return res.status(500).json({ message: "no user" })
        }
        let users = results.map((user) => {
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                email: user.email,
            }
        })

        res.status(200).json({ users: users })


    })

})


let KEY = process.env.KEY;
app.post("/chat-ai", async (req, res) => {

    let user = req.body.message;

    try {
        let respons = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KEY}`,
                "HTTP-Referer": "http://locahost:3000",
                "X-OpenRouter-Title": "<YOUR_SITE_NAME>",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "poolside/laguna-m.1:free",
                "messages": [
                    {
                        "role": "user",
                        "content": `${user}`
                    }
                ]
            })
        });

        let data = await respons.json()

        let mm = data.choices[0].message
        res.status(200).json({ message: mm })




    } catch (error) {
        console.error("Catch Error:", error);
        res.status(500).json({ message: error.message });
    }
});








const dbm = mysql.createConnection({
    host: HOST,
    user: NAME,
    password: PASSWORD,
    database: DATABASECHAT,
    charset: CHARSET
})

dbm.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("mysql message connect...")
    }
})






const storagemess = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "public/")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const urlup = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + "-" + urlup + ext)
    }
})

const upmessage = multer({ storage: storagemess })



app.post("/chat-users", upmessage.single("messagefile"), (req, res) => {

    const message = req.body.message
    const sender_id = req.body.idm
    const receiver_id =req.body.idu
    const file = req.file ? "http://localhost:3000/" + req.file.filename : null

    dbm.query("INSERT INTO messages SET ?", {
        sender_id: sender_id,
        receiver_id: receiver_id,
        message: message,
        file: file,
        is_read:0
    }, (error, results) => {
        if (error) {
            console.log(error)
            return res.json({ error: error })
        
        }
        console.log(results)

        res.json({
            message: message,
            sender_id: sender_id,
            receiver_id: receiver_id,
            file: file

        })
    })



})




app.get("/avatar-user", (req, res) => {
 
    let idm = req.query.idm;
    let idu = req.query.idu


    db.query("SELECT firstName,image FROM user WHERE id =?", [idu], (error, data) => {
        if (error) {
            console.log(error)
            return res.json({ error: error })
            
        }


        dbm.query("UPDATE messages SET is_read = 1 WHERE sender_id =? AND receiver_id =?",[idu,idm],(error,senser)=>{
            if(error){
                return console.log(error)
            }
            

        dbm.query("SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=? ) ORDER BY ID ASC", [idm, idu, idu, idm], (error, results) => {
            if (error) {
                    console.log(error)
                return es.json({ error: error })
            
            }
            res.json({
                datauser: data[0]||null,
                results: results
            })
        })
        })

    })


})


app.get("/chat-unread-count",(req,res)=>{
    const receiver_id = req.query.id;
    dbm.query("SELECT sender_id, COUNT(*) AS unread_count FROM messages WHERE receiver_id =? AND is_read = 0 GROUP BY sender_id",[receiver_id],(error,results)=>{
        if(error){
            return console.log(error)
        }
        res.json({unreadCount:results})
    })
})



let onlineUsers =[]

const http = require("http");
const {Server} = require("socket.io")
const server = http.createServer(app)
const io = new Server(server,{
    cors:{origin:"*"}
})



io.on("connection",(socket)=>{
    socket.on("join",(userId)=>{ 
        onlineUsers[userId] = socket.id
          io.emit("onlineUser", Object.keys(onlineUsers))
          console.log(Object.keys(onlineUsers))
    })

    socket.on("live_ping_message",(data)=>{
       let recaversock = onlineUsers[data.receiver_id]
       if(recaversock){
        io.to(recaversock).emit('receive_live_message',data)
       }
    })

    socket.on("disconnect",()=>{
        for(let userId in onlineUsers){
            if(onlineUsers[userId] === socket.id){
                delete onlineUsers[userId]
                break;
            }
        }
        io.emit("onlineUser",Object.keys(onlineUsers))
    })
   
})







server.listen(3000, () => {
    console.log(" started on port 3000");

})
