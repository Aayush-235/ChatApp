// Get all user except logged in user (short ma tamari sivay na badha)

import Message from "../models/Message.js";
import User from "../models/User.js";

export const getUsersForSidebar = async () => {
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
                { senderId: selectedId, receiverId: myId },
                { senderId: myId, receiverId: selectedId }
            ]
        })  // fetch all msg btw sdr and rcr

        await messages.updateMany({
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



