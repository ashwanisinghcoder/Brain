"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddlware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = "ashwanisingh";
const userMiddlware = async (req, res, next) => {
    const header = req.headers.authorization;
    console.log(header);
    if (!header) {
        res.status(401).json({
            message: "no token found"
        });
        return;
    }
    const decoded = await jsonwebtoken_1.default.verify(header, jwtSecret);
    if (decoded) {
        // @ts-ignore
        req.userId = decoded.id;
    }
    next();
};
exports.userMiddlware = userMiddlware;
