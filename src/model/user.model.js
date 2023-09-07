import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'premium', 'admin']
    },
    status: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'activo'],
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: Date,
})


mongoose.set('strictQuery', false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel
