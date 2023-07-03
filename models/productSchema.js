import mongoose, {Schema, model} from "mongoose"

const productSchema = new Schema(
    {
        product_name: {
            type: String,
            unique: true,
            required: [true, "Product name is required"],
        },
        slug: {
            type: String,
            unique: true,
            required: [true, "Slug is required"],
        },
        product_images: [
            {
                id: Schema.Types.ObjectId,
                data: Buffer,
                contentType: String,
            },
        ],
        category_id : {
           type : Schema.Types.ObjectId,
           ref : 'Category',
           required : [true , "Category id is required"] 
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

export const Product = model("Product", productSchema)
