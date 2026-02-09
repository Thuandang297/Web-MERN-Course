import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema({
    address: String,
    price:Number,
    area:Number,
    status:{
        type:String,
        enum:["SOLD", "ONSALE","DISCONTINUED"]
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employees"
    } 
})

const PropertiesModel =  mongoose.model('Properties',propertiesSchema);

export default PropertiesModel;