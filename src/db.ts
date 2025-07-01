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

const LinkSchema = new Schema({
    hash : String,
    userId : {type : mongoose.Types.ObjectId , ref:'users' , required : true , unique : true},
})

export const UserModel = model("users" , UserSchema);
export const ContentModel = model("content" , ContentSchema);
export const LinkModel = model("links" , LinkSchema);