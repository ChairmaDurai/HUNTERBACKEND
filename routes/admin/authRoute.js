import express from "express"
import { REGISTER , LOGIN } from "../../controllers/admin/auth.js"

const adminAuthRoutes = express.Router()

adminAuthRoutes.post("/register",  REGISTER)
adminAuthRoutes.post("/login", LOGIN)

export default adminAuthRoutes
