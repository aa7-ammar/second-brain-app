    import jwt from "jsonwebtoken";
    import { NextFunction , Request , Response } from "express";

    import {config } from ".././config.js";


   

    export const authMiddleware = (req : Request, res : Response , next : NextFunction) => {
        const token = req.headers["authorization"];
        const decoded = jwt.verify(token as string , config.JWT_SECRET) ;
        if(decoded){
            //@ts-ignore
            req.userId = decoded.id ;
            next();
        }
        else{
            res.status(403).json({
                message : "You are not logged in"
            })
        }



    }
