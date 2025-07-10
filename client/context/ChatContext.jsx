import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext)



    // Function to get all users in siderbar

    const getUser = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessage);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }




    // Function to get all messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`)

            if (data.success) {
                setMessages(data.messages)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }



    // Function to send message for slected usr

    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);

            if (data.success) {
                setMessages((preMessages) => [...(preMessages || []), data.newMessage])
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // Function to subscribe to new message for selectd uer

    const subscribeToNewMessage = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((preMessages) => [...(preMessages || []), newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else {
                setUnseenMessages((prevUnseenMessage) => ({
                    ...prevUnseenMessage,
                    [newMessage.senderId]: prevUnseenMessage[newMessage.senderId] ? prevUnseenMessage[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }


    // Function to unsubscribe from new message
    // usefull when user change the selected user / component unmounts

    const unsubscribeFromNewMessage = () => {
        if (socket) {
            socket.off("newMessage");
        }
    }

    useEffect(()=>{
        subscribeToNewMessage();
        return ()=>{unsubscribeFromNewMessage();}
    },[socket, selectedUser]) // when socket or selectedUser changes tyre aa fari thi run kare

    const value = {
        messages,
        setMessages,
        users,
        selectedUser,
        setSelectedUser,
        getUser,
        getMessages,
        sendMessages,
        unseenMessages,
        setUnseenMessages,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}