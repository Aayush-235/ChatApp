import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext()

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// is the way you access environment variables in Vite JS

axios.defaults.baseURL = backendUrl; // base URL for axios requests

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // Check is user is authenticated and if so, set the user data and connect to the socket server

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // login function to authenticate user and socket connection

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)

            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData)
                axios.defaults.headers.common['auth-token'] = data.token
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }


    // logout function to clear user data and disconnect socket
    const logout = async () =>{
        localStorage.removeItem("token")
        setToken(null);
        setAuthUser(null)
        setOnlineUsers([]);
        axios.defaults.headers.common['auth-token'] = null
        toast.success("Logout successfully");
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }

    // Update profile function to update user data

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }

        } catch (error) {
            toast.error(error.message);
        }
    }


    // Connect socket function to handle server connection and online users update

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocketConnection = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })

        newSocketConnection.connect();
        setSocket(newSocketConnection);

        newSocketConnection.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['auth-token'] = token;
            // Set authtoken in all future axios htpp requests >> joint a default header name of 'auth-token' and value is token
            checkAuth();
        }
    }, [])

    const value = {
        axios,
        authUser,
        socket,
        onlineUsers,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// axios is better than fetch 