import mongoose , { model , Schema} from "mongoose";
import {config} from "./config";


mongoose.connect(config.MONGO_URL); 

const UserSchema = new Schema({
    username : {type : String , unique : true},
    password : String
})

const ContentSchema = new Schema({
    title : String,
    link : String,
    tags: [{type : mongoose.Types.ObjectId , ref: 'Tag'}],
    userId: {type : mongoose.Types.ObjectId , ref: 'users' , required : true}
})

export const UserModel = model("users" , UserSchema);
export const ContentModel = model("content" , ContentSchema);