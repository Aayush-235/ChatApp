// Get all user except logged in user (short ma tamari sivay na badha)

import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id

        // login user sivay na badha user ne fetch karva (sidebar ma)
        const filterUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // Count number of unseen messages 

        const unseenMessage = {}

        const promise = filterUsers.map(async (user) => {
            const messageCount = await Message.find({ //return an arary
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if (messageCount.length > 0) {
                unseenMessage[user._id] = messageCount.length
            }
        })

        await Promise.all(promise) // still not run the code, when all the user unseenmessage counting completee

        return res.json({
            success: true,
            users: filterUsers,
            unseenMessage: unseenMessage
        })

    } catch (error) {
        console.log(error.message)

        res.json({
            success: true,
            message: error.message
        })
    }


}


// Get all message for selected user

export const getAllMessage = async (req, res) => {
    try {

        const { id: selectedUserId } = req.params; // sender id
        const myId = req.user._id // logged userid

        const messages = await Message.find({
            $or: [
                { senderId: selectedUserId, receiverId: myId },
                { senderId: myId, receiverId: selectedUserId }
            ]
        })  // fetch all msg btw sdr and rcr

        await Message.updateMany({
            senderId: selectedUserId,
            receiverId: myId
        }, {
            seen: true
        })


        return res.json({
            success: true,
            messages: messages
        })


    } catch (error) {
        console.log(error.message)
        res.json({
            success: true,
            message: error.message
        })
    }
}

// API to mark message as seen using "message id"

export const markMessageAsSeen = async (req, res) => {
    try {

        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true })

        return res.json({
            success: true,
            message: "Message marked as seen"
        })


    } catch (error) {
        console.log(error.message)
        res.json({
            success: true,
            message: error.message
        })
    }
}


// Send message to selected user

export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageURL;

        if (image) {
            const upload = await cloudinary.uploader.upload(image)
            imageURL = upload.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageURL
        })

        //Emit the new msg to the rcvr socket

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        } // use of give benefit >> rcvr can see msg instanly

        return res.json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success: true,
            message: error.message
        })
    }
}
