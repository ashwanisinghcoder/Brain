import mongoose from "mongoose";
import { Types } from "mongoose";
const { ObjectId } = Types;
const { Schema  } = mongoose;

const UserSchema = new Schema({
    username : String,
    password: String
})

const contentSchema = new Schema({
    link: String,
    type: String,
    userId:{type: Types.ObjectId, ref: "User"},
    tags: [{type: Types.ObjectId, ref: "tags"}],
})
const tagSchema = new Schema({
    title : String
})
const LinkSchema = new Schema({
    hash: String,
    userId:{type: mongoose.Types.ObjectId, ref: "User" , unique: true},
})
export const usermodel = mongoose.model('User', UserSchema);
export const contentmodel = mongoose.model("content" , contentSchema);
export const tagsmodel = mongoose.model("tags" , tagSchema);
export const linkSchemamodel = mongoose.model("links", LinkSchema);


