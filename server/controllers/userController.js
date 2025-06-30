// Signup a new user

import { generateToken } from "../lib/utils"
import User from "../models/User"
import bcrypt from 'bcryptjs'


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
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        res.json({
            success:true,
            userData:newUser,
            message:"User created successfully",
            token
        })  

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}


