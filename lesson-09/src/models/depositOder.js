import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
    depositAmount: Number,
    date: Date,
    status: {
        type:String,
        enum:['PAID','PENDING','CANCELLED']
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Properties"
    }
})

const DepositModel = mongoose.model('DepositOrders', depositSchema);

export default DepositModel;