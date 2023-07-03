import express from "express"
import {
    GETLIST,
    GETBYID,
    ADDNEW,
    UPDATE,
    DELETE,
    REMOVE,
} from "../../controllers/admin/category.js"
import {adminAuthMiddleware, upload} from "../../utils/middleware.js"

const adminCategoryRoutes = express.Router()

adminCategoryRoutes.get("/", adminAuthMiddleware, GETLIST)
adminCategoryRoutes.get("/:slug", adminAuthMiddleware, GETBYID)
adminCategoryRoutes.post(
    "/",
    adminAuthMiddleware,
    upload.single("category_logo"),
    ADDNEW
)
adminCategoryRoutes.patch("/:categoryId", adminAuthMiddleware, UPDATE)
adminCategoryRoutes.patch("/delete/:categoryId", adminAuthMiddleware, DELETE)
adminCategoryRoutes.delete("/:categoryId", adminAuthMiddleware, REMOVE)

export default adminCategoryRoutes
