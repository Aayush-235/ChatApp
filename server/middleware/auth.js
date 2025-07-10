// Middleware to protect route
// short ma >> get the user details from jwt token

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const fetchUser = async (req, res, next) => {
    try {

        // const token = req.header("auth-token")
        const token = req.header("auth-token")

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Please authenticate using a valid token"
            })
        }

        req.user=user // access user >> route handler

        next()

    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}