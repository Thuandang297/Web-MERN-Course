import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    quanlity:Number,
})

const productModel = mongoose.model('products', productSchema);

export default productModel;