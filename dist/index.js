"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { Schema } = mongoose_1.default;
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const userMiddleweare_1 = require("./userMiddleweare");
const utils_1 = require("./utils");
const JWT_SECRETE = "ashwanisingh";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    await db_1.usermodel.create({
        username: username,
        password: password
    });
    res.status(200).json({
        message: "user signup success"
    });
});
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await db_1.usermodel.findOne({ username: username, password: password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, JWT_SECRETE);
        res.status(200).json({
            message: "user signin success",
            token: token
        });
    }
    else {
        res.status(400).json({
            message: "username or password is incorrect"
        });
    }
});
app.post("/api/v1/content", userMiddleweare_1.userMiddlware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await db_1.contentmodel.create({
        link: link,
        type: type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.status(200).json({
        message: "content created successfully"
    });
});
app.get("/api/v1/content", userMiddleweare_1.userMiddlware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.contentmodel.find({ userId: userId }).populate("userId", "username");
    res.status(200).json({
        message: "content fetched successfully",
        content: content
    });
});
app.delete("/api/v1/content/:id", userMiddleweare_1.userMiddlware, async (req, res) => {
    const id = req.params.id;
    await db_1.contentmodel.deleteOne({ _id: id
        //@ts-ignore
        ,
        userId: req.userId
    });
    res.status(200).json({
        message: "content deleted successfully"
    });
});
app.post("/api/v1/brain/share", userMiddleweare_1.userMiddlware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await db_1.linkSchemamodel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_1.linkSchemamodel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.status(200).json({
            hash: hash
        });
    }
    else {
        await db_1.linkSchemamodel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.linkSchemamodel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: " Sorry incorrect input"
        });
        return;
    }
    const content = await db_1.contentmodel.find({
        userId: link.userId
    });
    const user = await db_1.usermodel.findOne({
        _id: link.userId
    });
    res.status(200).json({
        message: "brain fetched successfully",
        content: content,
        user: user
    });
    if (!user) {
        res.status(411).json({
            message: "Sorry user not found error should ideally not happen"
        });
        return;
    }
});
function main() {
    mongoose_1.default.connect("mongodb+srv://ashwanisingh:elVZUtternK9kiNa@cluster0.vk9uv.mongodb.net/SecondBrain2");
    app.listen(3000, () => {
        console.log("listening on port : " + "3000");
    });
}
main();
