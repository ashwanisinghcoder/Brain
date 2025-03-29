"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSchemamodel = exports.tagsmodel = exports.contentmodel = exports.usermodel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const { ObjectId } = mongoose_2.Types;
const { Schema } = mongoose_1.default;
const UserSchema = new Schema({
    username: String,
    password: String
});
const contentSchema = new Schema({
    link: String,
    type: String,
    userId: { type: mongoose_2.Types.ObjectId, ref: "User" },
    tags: [{ type: mongoose_2.Types.ObjectId, ref: "tags" }],
});
const tagSchema = new Schema({
    title: String
});
const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", unique: true },
});
exports.usermodel = mongoose_1.default.model('User', UserSchema);
exports.contentmodel = mongoose_1.default.model("content", contentSchema);
exports.tagsmodel = mongoose_1.default.model("tags", tagSchema);
exports.linkSchemamodel = mongoose_1.default.model("links", LinkSchema);
