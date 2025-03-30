import jwt from "jsonwebtoken"
import { Request , Response , NextFunction } from "express";
const jwtSecret = "ashwanisingh"
export const userMiddlware  = async (req : Request , res : Response , next : NextFunction)=>{
    const header = req.headers.authorization;   
    console.log(header)
    if(!header){
        res.status(401).json({
            message : "no token found"
        })
        return
    }
    const decoded =await jwt.verify(header as string , jwtSecret)
    if(decoded){
        // @ts-ignore
        req.userId = decoded.id
    }
    next()
}