import {Response} from "./helpers.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import path from "path"
import multer from "multer"
import {AdminAuth} from "../models/authSchema.js"
dotenv.config()

const {JSONWEBSECRET} = process.env

export const adminAuthMiddleware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next()
    }
    if (!req.header("Authorization")) {
        return res
            .status(401)
            .json(Response.error("Authorization token required"))
    }
    const token = req.header("Authorization").replace("Bearer ", "")
    let decoded = null
    try {
        decoded = jwt.verify(token, JSONWEBSECRET)
        const findAdmin = await AdminAuth.findById(decoded._id).select(
            "-password"
        )
        if (!findAdmin) {
            return res
                .status(401)
                .json(Response.error("Invalid token for admin"))
        }
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json(Response.error("Invalid token"))
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {    
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    },
})

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/svg+xml"
        ) {
            Promise.resolve(callback(null, true))
        } else {
            Promise.reject(callback(null, false))
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 9,
    },
})
