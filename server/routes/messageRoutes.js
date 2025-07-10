import express from 'express'
import { fetchUser } from '../middleware/auth.js'
import { getAllMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get("/users", fetchUser, getUsersForSidebar)
messageRouter.get("/:id", fetchUser, getAllMessage)
messageRouter.put("/mark/:id", fetchUser, markMessageAsSeen)
messageRouter.post("/send/:id", fetchUser, sendMessage)

// here we can also use 'express-validator'

export default messageRouter