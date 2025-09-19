import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
      type:String,
      required:true,
      unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:""
    },
    profilePhotoType: {
        type: String,
        enum: ["avatar", "custom"],
        default: "avatar"
    },
    gender:{
        type:String,
        enum:["male", "female"],
        required:true
    }
}, {timestamps:true});
export const User = mongoose.model("User", userModel);