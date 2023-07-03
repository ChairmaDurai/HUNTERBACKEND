import {Schema, model} from "mongoose"

const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            unique: true,
            required: [true, "Category name is required"],
        },
        slug: {
            type: String,
            unique: true,
            required: [true, "Slug is required"],
        },
        product_list: {
            type: Array,
            default: [],
        },
        category_logo: {
            data: Buffer,
            contentType: String,
        },
        description: {
            type: String,
            default: null,
        },
        status: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export const Category = model("Category", categorySchema)
