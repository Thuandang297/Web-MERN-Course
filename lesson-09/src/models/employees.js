import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    department: String,
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manager"
    },
})

const EmployeeModel = mongoose.model('Employees', EmployeeSchema);

export default EmployeeModel;