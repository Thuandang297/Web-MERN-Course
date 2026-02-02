import bcrypt from 'bcrypt'
import CustomerModel from '../models/customers.js';

const customerController = {
    create: async (req, res) => {
        //lấy thông tin người dùng truyền vào trong requestBody
        const { email, name, password, age } = req.body;

        //Sinh ra chuỗi ngẫu nhiên gồm 5 ký tự
        const salt = bcrypt.genSaltSync(5)

        //Mã hóa mật khẩu bằng salt
        const hashPassword = bcrypt.hashSync(password, salt);

        const newCustomer = {
            email: email,
            name: name,
            password: hashPassword,
            age: age,
            salt: salt,
        }
        console.log("🚀 ~ newCustomer:", newCustomer)

        const createdCustomer = await CustomerModel.create(newCustomer);
        if (createdCustomer) {
            res.status(201).send({ data: createdCustomer, success: true, message: 'created successfully!' })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            //Tìm kiếm người dùng theo email
            const customer = await CustomerModel.findOne({ email: email })
            if (!customer) throw new Error('Customer is not exits!')

            //Mã hóa mật khẩu và người dùng nhập lúc login
            const hashPasswordLogin = bcrypt.hashSync(password, customer.salt);

            //Kiểm tra xem mật khẩu này có giống với mật khẩu đã lưu trong db hay không

            if (hashPasswordLogin === customer.password) {
                return res.status(200).send({ message: "Login success!", success: true })
            }
            return res.status(400).send({ message: "Login false!", success: false })
        } catch (error) {
            res.status(403).send({ message: error.message, success: false })
        }

    }
}

export default customerController;