import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    address:String,
    accountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account"
    } 
})

const CustomerModel =  mongoose.model('Customer',customerSchema);

export default CustomerModel;