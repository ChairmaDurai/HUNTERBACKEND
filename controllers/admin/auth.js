import {AdminAuth} from "../../models/authSchema.js"
import {Response, validationError} from "../../utils/helpers.js"
import Joi from "joi"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

const {JSONWEBSECRET} = process.env

const schema = Joi.object({
    username: Joi.required("Username is required"),
    email: Joi.string().email().required("Email is required"),
    password: Joi.string().required("Password is required"),
})

const REGISTER = async (req, res) => {
    try {
        const {error, value} = schema.validate(req.body)
        const {username, email, password: reqPassword} = value

        if (error) {
            const validate = validationError(error.details)
            return res
                .status(404)
                .json(Response.error(validate, "Validation Error"))
        }
        const [usernameExists, emailExists] = await Promise.all([
            AdminAuth.findOne({
                username,
            }).exec(),
            AdminAuth.findOne({
                email,
            }).exec(),
        ])
        if (emailExists) {
            return res.status(400).json(Response.error("Email Exists"))
        } else if (usernameExists) {
            return res.status(400).json(Response.error("Username Exists"))
        } else {
            const salt = bcrypt.genSaltSync(10)

            const hashPassword = bcrypt.hashSync(reqPassword, salt)
            const adminSave = new AdminAuth({
                ...value,
                password: hashPassword,
            })
            const {_doc} = await adminSave.save()
            const {password, ...data} = await _doc
            return res.status(200).json(Response.success(data))
        }
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

const LOGIN = async (req, res) => {
    try {
        const {email, password: reqPassword} = req.body
        const admin = await AdminAuth.findOne({
            email,
        })
        const {_doc} = admin

        if (!admin) {
            return res.status(400).json(Response.error("Wrong Credentials"))
        }
        const comparePassword = bcrypt.compareSync(reqPassword, _doc.password)
        if (!comparePassword) {
            return res.status(400).json(Response.error("Wrong Credentials"))
        }
        const {password, ...data} = _doc
        const token = jwt.sign(data, JSONWEBSECRET, {expiresIn: 60 * 60})
        return res.status(200).json(Response.success({data, token}))
    } catch (error) {
        console.log(error, "sss")
        return res.status(500).json(Response.error(error))
    }
}

export {REGISTER, LOGIN}
