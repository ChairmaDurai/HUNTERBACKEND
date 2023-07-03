import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import bodyParser  from "body-parser"
import { MongoDBConnect } from "./utils/lib.js"
import adminCategoryRoutes from "./routes/admin/categoryRoute.js"
import adminAuthRoutes from "./routes/admin/authRoute.js"
import adminProductRoutes from "./routes/admin/productRoute.js"

dotenv.config()
const api = express()

api.use(express.json())
api.use(express.urlencoded({ extended: false}));
api.use(cors())
api.use(morgan("dev"))
const { PORT} = process.env


api.use('/api/admin/auth', adminAuthRoutes)
api.use('/api/admin/category', adminCategoryRoutes)
api.use('/api/admin/product', adminProductRoutes)

api.listen(PORT, () => {
    console.log("Server Started", PORT)
    MongoDBConnect()
})
