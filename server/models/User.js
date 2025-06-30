import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String, // reason that we store the image as URL
        default:""
    },
    bio:{
        type:String
    }
    
},{timestamps:true})

// timestamps automatically adds two fields in our MongoDB documents: createdAt - when our document first created,  updatedAt - document was last updated


const User = mongoose.model("User", userSchema);  // Crete model

export default User