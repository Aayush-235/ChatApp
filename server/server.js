// entry point of our backend server

import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'

// create express app and HTTP server

const app = express()
const server = http.createServer(app)

// Middleware setup

app.use(express.json({limit: "4mb"}))
app.use(cors()) // allow all the URL to connect with backend

app.use("/api/status", (req, res)=>{
    res.send('Server is live!!!')
})

//Connect to MongoDB

await connectDB() 

const PORT = process.env.PORT || 5000

server.listen(PORT, ()=>{
    console.log("Server is running on port :",PORT)

})