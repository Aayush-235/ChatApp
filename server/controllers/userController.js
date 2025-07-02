// Signup a new user

import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try { 
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                success: false,
                message: "Account with this email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        res.json({
            success: true,
            userData: newUser,
            message: "User created successfully",
            token
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}



//Controller to login a user

export const login = async (req, res) => {

    const { email, password } = req.body

    try {
        const userData = await User.findOne({ email })

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = generateToken(userData._id)

        res.json({
            success: true,
            userData: userData,
            message: "Login successfully",
            token
        })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}



// Controller to check if user is authenticated..

export const checkAuth = async (req, res) =>{
    res.json({
        success:true,
        user:req.user
    })
}


// Controller to update userProfile detailes..

export const updateProfile = async (req, res) =>{
    try {
        const {fullName, bio, profilePic} = req.body

        const userId = req.user._id  // get user id from middleware (fetchUser)
        
        let updateProfile;

        if(!profilePic){
            updateProfile = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:"true"})
        }
        else{
            // here in profiel pic we get the base64 string of image from client side
            const uploadPhoto = await cloudinary.uploader.upload(profilePic)

            updateProfile = await User.findByIdAndUpdate(userId, {bio, fullName, profilePic : uploadPhoto.secure_url}, {new:"true"})
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updateProfile
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


