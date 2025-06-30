import mongoose from 'mongoose'

// Connect to MongoDB (Functions)

export const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', ()=>console.log('Database Connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.error(error)
    }
}