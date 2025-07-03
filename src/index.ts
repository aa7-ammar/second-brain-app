import express from "express";
import {Request , Response} from "express";

import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { config  } from "./config";

import { authMiddleware } from "./Middleware/auth-middleware";
import { random } from "./utils";
import cors from "cors";



const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup" , async (req , res) => {
    //zod validation 
    const username = req.body.username;
    const password = req.body.password;

    //hash the password
    try{
        await UserModel.create({
            username : username , 
            password : password
        });

        res.json({
            message : "User signed up !"
        });
    }
    catch(e){
        res.status(411).json({
            messgae : "username already taken"
        })
    }

})

app.post("/api/v1/signin" , async (req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({
        username : username,
        password : password
    })

    if(user){
        const token = jwt.sign({
            id : user._id
        } , config.JWT_SECRET);

        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            message : "Incorrect Credentials"
        })
    }
})




app.post("/api/v1/content" , authMiddleware ,async (req : Request<{},{},{link:string , type:string}> , res : Response) => {
    // const token = req.headers.token;
    // const response = jwt.verify(token , JWT_SECRET);
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        title : req.body.title,
        //@ts-ignore
        userId : req.userId,
        tags : []
    })

    res.json({
        message : "Content added !"
    })


})

app.get("/api/v1/content" ,authMiddleware, async (req , res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId : userId
    }).populate('userId' , 'username');
    if(content.length != 0){
        res.json({
            content
        }
        )
    }else{
        res.json({
            message : "No content from this user"
        })
    }


})

app.delete("/api/v1/content" ,authMiddleware , async (req , res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId : req.userId
    });
    res.json({
        messgae : "Deleted"
    })

    
})

app.post("/api/v1/brain/share" ,authMiddleware,  async(req , res) =>{
    const share = req.body.share;
    const hash = random(10);
    if(share){
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            usedId : req.userId
        })
        if(existingLink){
            res.json({
                hash : existingLink.hash
            }
            )
            return;
        }
        await LinkModel.create({
            //@ts-ignore
            userId : req.userId,
            hash : hash
        })
        res.json({
            message : `/share/${hash}`
        })
    }else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId : req.userId
        })
        res.json({
            message : "Deleted Sharable Link"
        })
    }

    
});

app.get("/api/v1/brain/:shareLink" , async(req,res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash

    })

    if(!link){
        res.status(411).json({
            message : "Sorry Incorrect Input"
        })
        return;

    }
    const content = await ContentModel.find({
        userId : link.userId
    })

    const user = await UserModel.findOne({
        _id : link.userId
    })

    if(!user){
        res.status(411).json({
            message : "User not found , error should not have happened "
        })
        return;
    }

    res.json({
        username : user?.username,
        content : content
    })

    
})

app.listen(3000);



