import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()


const {MONGO_URI} = process.env

export async function MongoDBConnect() {
    try {
       await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB Connected")
    } catch (error) {
        console.log(error)
        return Promise.reject("DB Error")
    }
}