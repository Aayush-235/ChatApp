import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext)

    // Function to get all users in siderbar

    const getUser = async () => {
        try {
            const { data } = await axios.get("/api/message/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessage);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }


    // Function to get all messages for selected user
    const getMessages = async (userId) =>{
        try {
            const {data} = await axios.get(`/api/message/${userId}`)

            if(data.success){
                setMessage(data.messages)    
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }


    const value = {

    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}