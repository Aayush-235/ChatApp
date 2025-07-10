// entry point of our backend server
import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import useRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

// create express app and HTTP server
const app = express()
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" } // all the frntd >> connect >> this server
})

//Stroe online users
export const userSocketMap = {} // {userId = socketId}

//Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    //emit online uses to al connectes clietns
    io.emit("getOnlineUsers", Object.keys(userSocketMap));// one type of list in that we know which user is online by his userID >> store>> userSocketMp

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})

// Middleware setup
app.use(express.json({ limit: "4mb" }))
app.use(cors()) // allow all the URL to connect with backend

app.use("/api/status", (req, res) => {
    res.send('Server is live!!!')
})

// Router setup
app.use("/api/auth", useRouter)
app.use("/api/messages", messageRouter)


//Connect to MongoDB
await connectDB()

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log("Server is running on port :", PORT)
})
