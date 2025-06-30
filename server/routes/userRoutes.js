import express from 'express'
import { login, signup, updateProfile, checkAuth } from '../controllers/userController.js'
import { fetchUser } from '../middleware/auth.js'

const useRouter = express.Router()

useRouter.post("/signup", signup)
useRouter.post("/login", login)
useRouter.put("/update-profile", fetchUser, updateProfile)
useRouter.get("/check", fetchUser, checkAuth)

// here we can also use 'express-validator'

export default useRouter