import {Category} from "../../models/categorySchema.js"
import Joi from "joi"
import fs from "fs"
import {Response, generateSlug, validationError} from "../../utils/helpers.js"
import { Product } from "../../models/productSchema.js"

const schema = Joi.object({
    product_name: Joi.string().required("Product Name is required"),
    product_images: Joi.array(),
    category_id: Joi.any().required("Please select Category"),
    description: Joi.string(),
    status: Joi.boolean().required(),
})

const GETLIST = async (req, res, err) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ""
        const skip = parseInt(page - 1) * parseInt(limit)

        const filters = {
            category_name: {$regex: search, $options: "i"},
            deletedAt: false,
        }

        const [data, totalDoc] = await Promise.all([
            Category.aggregate([
                {
                    $match: {
                        ...filters,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: parseInt(limit),
                },
                {
                    $project: {
                        label: "$category_name",
                        value: "$slug",
                        status: 1,
                        category_logo: "$category_logo.data",
                    },
                },
            ]).exec(),
            Category.countDocuments(filters).exec(),
        ])
        const total = Math.ceil(totalDoc / limit)
        return res
            .status(200)
            .json(Response.pagination(data, page, limit, total))
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

const GETBYID = async (req, res, err) => {
    try {
        const slug = req.params.slug
        const data = await Product.findOne({
            slug,
        }).populate('Category')
        if (!data)
            return res.status(404).json(Response.error("Category not found"))
        return res.status(200).json(Response.success(data))
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

const ADDNEW = async (req, res, err) => {
    try {
        const {error, value} = schema.validate(req.body, {
            abortEarly: false,
        })

        //Validations
        if (error) {
            const validate = validationError(error.details)
            return res
                .status(400)
                .json(Response.error(validate, "Validation Error"))
        }
        const {product_name} = value

        const dataExists = await Product.findOne({
            product_name,
        })

        if (dataExists) {
            return res
                .status(400)
                .json(Response.error("Product Already Exists"))
        }
        const categorySaved = new Product({
            ...value,
            // category_logo: {
            //     data: fs.readFileSync("uploads/" + req.file.filename),
            //     contentType: req.file.mimetype,
            // },
            slug: generateSlug(product_name),
        })

        const { _doc : {product_images , ...data} } = await categorySaved.save()
        return res.status(200).json(Response.success(data))
    } catch (error) {
        console.log(error, "asasa")
        return res.status(500).json(Response.error(error))
    }
}

const UPDATE = async (req, res, err) => {
    try {
        const {categoryId} = req.params
        const {
            category_name,
            product_list,
            category_logo,
            description,
            status,
        } = req.body

        const data = await Category.findOneAndUpdate(
            {
                _id: categoryId,
                deletedAt: false,
            },
            {
                $set: {
                    category_name,
                    product_list,
                    category_logo,
                    description,
                    status,
                    slug: generateSlug(category_name),
                },
            },
            {
                new: true,
            }
        )

        if (!data) {
            return res.status(404).json(Response.error("Category Not Found"))
        }

        return res.status(200).json(Response.success(data))
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

const DELETE = async (req, res, err) => {
    try {
        const {categoryId} = req.params
        const findCategory = await Category.findOneAndUpdate(
            {
                _id: categoryId,
                deletedAt: false,
            },
            {
                $set: {
                    deletedAt: true,
                },
            },
            {
                new: true,
            }
        ).exec()
        if (!findCategory) {
            return res.status(404).json(Response.error("Category not found"))
        }
        return res
            .status(200)
            .json(Response.success("", "Deleted Successfully"))
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

const REMOVE = async (req, res, err) => {
    try {
        const {categoryId} = req.params
        const findCategory = Category.findByIdAndDelete({
            _id: categoryId,
            deletedAt: false,
        }).exec()
        if (!findCategory) {
            return res.status(404).json(Response.error("Category not found"))
        }
    } catch (error) {
        return res.status(500).json(Response.error(error))
    }
}

export {GETLIST, GETBYID, ADDNEW, UPDATE, DELETE, REMOVE}
