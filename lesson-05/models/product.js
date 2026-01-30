import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:String,
    price: Number,
    quanlity:Number,
})

const productModal = new mongoose.model('product', productSchema);

export default productModal;