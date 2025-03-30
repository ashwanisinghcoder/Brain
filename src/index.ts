import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
const { Schema  } = mongoose;
import cors from "cors"
import { usermodel, contentmodel, tagsmodel, linkSchemamodel } from "./db"
import { userMiddlware } from "./userMiddleweare"
import { random } from "./utils"
import { JWT_SECRETE } from "./config"
const app = express();
app.use(express.json())
app.use(cors());
app.post("/api/v1/signup", async(req: Request ,res: Response) => {
    const { username , password } = req.body;
    await usermodel.create({
        username : username,
        password : password
    })
    res.status(200).json({
        message: "user signup success"
    })
})
app.post("/api/v1/signin", async(req: Request ,res: Response) => {
    const { username , password } = req.body;
    const user = await usermodel.findOne({username : username, password : password})
    if(user){
        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRETE)
        res.status(200).json({
            message: "user signin success",
            token : token
        })
    }else{
        res.status(400).json({
            message: "username or password is incorrect"
        })
    }
})

app.post("/api/v1/content", userMiddlware, async (req: Request, res: Response) => {  // Create a new content
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    await contentmodel.create({
        link: link,
        type: type,
        title: title,
        // @ts-ignore
        userId: req.userId,
    })

    res.status(200).json({
        message: "content created successfully",
    })
})  
app.get("/api/v1/content",userMiddlware , async(req: Request ,res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await contentmodel.find({userId : userId}).populate("userId" ,"username")
    res.status(200).json({
        message : "content fetched successfully",
        content : content
    })
})  
app.delete("/api/v1/content/:id",userMiddlware , async(req: Request ,res: Response) => {
    const id = req.params.id;
    await contentmodel.deleteOne({_id : id
    //@ts-ignore
    ,userId : req.userId
    })
    res.status(200).json({
        message : "content deleted successfully"
    })
})
app.post("/api/v1/brain/share",userMiddlware , async(req: Request ,res: Response) => {
    const share = req.body.share;
    if(share){
        const existingLink = await linkSchemamodel.findOne({ //@ts-ignore
            userId : req.userId
        })
        if(existingLink){
            res.json({
                hash : existingLink.hash
            })
            return;
        }                                                const hash = random(10)
        await linkSchemamodel.create({
            //@ts-ignore
            userId : req.userId,
            hash : hash
        })
        res.status(200).json({
            hash : hash
        })
    }else{
        await  linkSchemamodel.deleteOne({
            //@ts-ignore
            userId : req.userId
        })
    }
})
app.get("/api/v1/brain/:shareLink", async(req: Request ,res: Response) => {
    const hash = req.params.shareLink;
    const link = await linkSchemamodel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message: " Sorry incorrect input"
        })
        return; 
    }
    const content = await contentmodel.find({
        userId: link.userId
    })

    const user = await usermodel.findOne({
        _id : link.userId
    })
    res.status(200).json({
        message : "brain fetched successfully",
        content : content,
        user : user
    })
    if(!user){
        res.status(411).json({
            message : "Sorry user not found error should ideally not happen"
        })
        return;
    }
})

function main(){
    mongoose.connect("mongodb+srv://ashwanisingh:elVZUtternK9kiNa@cluster0.vk9uv.mongodb.net/SecondBrain2")
    app.listen(3000,()=>{
        console.log("listening on port : " + "3000")
    })
}
main()
