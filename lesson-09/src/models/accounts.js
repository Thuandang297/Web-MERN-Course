import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    email: String,
    password: String,
    isActive: Boolean,
    role: {
        type: String,
        enum: ['CUSTOMER', 'MANAGER', 'EMPLOYEE'],
        default: 'CUSTOMER',
    },
})

const AccountModel = mongoose.model('Account', accountSchema);

export default AccountModel;