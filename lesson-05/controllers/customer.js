import CustomerModel from '../models/customers.js'

const customerController = {
    create: async (req, res) => {
        try {
            const { name, email, age } = req.body
            const createdCustomer = await CustomerModel.create({ name, email, age });
            return res.status(201).send({ message: "Create customer successfully!", data: createdCustomer, success: true })
        } catch (error) {
            res.status(403).send({ message: "Create customer fail!", data: null, success: false })
        }
    },
    getAll: async (req, res) => {
        //Viết logic lấy dữ liệu của CustomerModel ở đây
        try {
            const customers = await CustomerModel.find({});
            return res.status(200).send({
                message: 'Get customers successfully!',
                data: customers,
                success: true,
            })
        } catch (error) {
            //Xử lý lỗi
            return res.status(403).send({
                message: error.message,
                data: null,
                success: false,
            })
        }
    },
    getOne: async (req, res) => {
        try {
            const id = req.params.id;
            const customer = await CustomerModel.findById(id);
            return res.status(200).send({ message: "OK", success: true, data: customer })
        } catch (error) {
            return res.status(403).send({
                message: error.message,
                data: null,
                success: false,
            })
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, age } = req.body;

            const updatedCustomer = await CustomerModel.findByIdAndUpdate(id,
                {
                    $set: {
                        name: name,
                        email: email,
                        age: age,
                    }

                },
                { new: true })
            return res.status(201).send({ message: "Updated!", data: updatedCustomer, success: true })

        } catch (error) {
            return res.status(403).send({
                message: error.message,
                data: null,
                success: false,
            })
        }
    },
    delete: async (req, res) => {
        const id = req.params.id;
        const deletedCustomer =await CustomerModel.findOneAndDelete({_id:id});
        return res.status(201).send({ message: "Deleted!", data: deletedCustomer, success: true })
    }
}

export default customerController;
