import {Schema , model} from 'mongoose'

const authSchema = new Schema({
    username : {
        type : String,
        unique : [true, 'Username is unique'],
        required : [true , "Username is required"],
        min : [ 5 , "Min 5 Characters Required"],
        max : [30, "Max 30 Characters Allowed"]
    },
    email : {
        type : String,
        unique : [true, 'Username is unique'],
        required : [true , "Username is required"],
    },
    password : {
        type : String,
        required : [true , "Username is required"],
        min : [ 5 , "Min 5 Characters Required"],
        max : [30, "Max 30 Characters Allowed"]
    },
})


export const AdminAuth = model('adminAuth', authSchema) 