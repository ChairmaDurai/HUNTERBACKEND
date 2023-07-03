import express from "express"
import {
    GETLIST,
    GETBYID,
    ADDNEW,
    UPDATE,
    DELETE,
    REMOVE,
} from "../../controllers/admin/product.js"
import {adminAuthMiddleware, upload} from "../../utils/middleware.js"

const adminProductRoutes = express.Router()

adminProductRoutes.get("/", adminAuthMiddleware, GETLIST)
adminProductRoutes.get("/:slug", adminAuthMiddleware, GETBYID)
adminProductRoutes.post(
    "/",
    adminAuthMiddleware,
    upload.any(),
    ADDNEW
)
adminProductRoutes.patch("/:productId", adminAuthMiddleware, UPDATE)
adminProductRoutes.patch("/delete/:productId", adminAuthMiddleware, DELETE)
adminProductRoutes.delete("/:productId", adminAuthMiddleware, REMOVE)

export default adminProductRoutes
