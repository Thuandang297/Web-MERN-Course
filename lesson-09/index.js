import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import express from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import multer from 'multer'
import AccountModel from "./src/models/accounts.js"
import AuthorModel from "./src/models/author.js"
import CustomerModel from "./src/models/customers.js"
import EmployeeModel from "./src/models/employees.js"
import ManagerModel from "./src/models/managers.js"
import PropertiesModel from "./src/models/properties.js"
import DepositModel from "./src/models/depositOder.js"
import userRouter from "./src/router/userRouter.js"
import propertyRouter from "./src/router/propertyRouter.js"
import depositOrderRouter from "./src/router/depositOrderRouter.js"

const app = express()
app.use(express.json())

// Khởi tạo tùy chọn lưu trữ memoryStorage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


cloudinary.config({
    cloud_name: 'thuandang',
    api_key: '923999412237653',
    api_secret: 'o8_ZJQh4Ui3mjINLTStyREPGUxc'
});


mongoose.connect('mongodb+srv://trello-database:Thuan%40627@trello-cluster.cdzlw.mongodb.net/?appName=trello-cluster')

app.post('/authors', async (req, res) => {
    const newAuthors = { ...req.body }
    const createdAuthor = await AuthorModel.create(newAuthors);
    res.send({ data: createdAuthor, message: 'Success' })
})

app.get('/authors', async (req, res) => {
    const listAuthors = await AuthorModel.find({})
    res.status(200).send({ message: "OK", data: listAuthors })
})



//Excercise Practice

app.post('/account', async (req, res) => {

    const { email, password, role } = req.body

    const salt = bcrypt.genSaltSync(5)
    const hashPassword = bcrypt.hashSync(password, salt);

    const newAccount = {
        email: email,
        password: hashPassword,
        isActive: true,
        role: role
    }

    const createdAccount = await AccountModel.create(newAccount);
    return res.status(201).send({ data: createdAccount, message: 'Account created!' })
})


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        //Find account by email
        const account = await AccountModel.findOne({ email: email })

        if (!account) {
            throw new Error('Can not find account info')
        }

        //Compare password

        if (!bcrypt.compareSync(password, account.password)) {
            throw new Error('Wrong password!')
        }

        //Check accout active

        if (!account.isActive) {
            throw new Error('Account is not active!')
        }

        //Gen token for user
        const token = jwt.sign({
            id: account._id,
            role: account.role
        },
            'test-token-2026',
            { expiresIn: '1d' }

        )

        res.send({data:token, message:"Login success!"})

    } catch (error) {
        res.status(403).send({ data: null, message: error.message, isSuccess: false })
    }

})

//Practice upload file
app.post('/upload', upload.single('file'), (req, res) => {
  // Truy cập dữ liệu tệp từ req.file
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Không có tệp được tải lên.' });
  }

  // Trả về phản hồi với thông tin về tệp đã tải lên
  res.json({ message: 'Tệp được tải lên thành công.', data: file });
});
//Upload with cloudinary


cloudinary.config({
    cloud_name: 'thuandang',
    api_key: '923999412237653',
    api_secret: 'o8_ZJQh4Ui3mjINLTStyREPGUxc'
});


app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'Không có tệp được tải lên.' });
    }
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    console.log("🚀 ~ dataUrl:", dataUrl)
    const fileName = file.originalname.split('.')[0];
    console.log("🚀 ~ fileName:", fileName)

    cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: 'auto',
        // có thể thêm field folder nếu như muốn tổ chức
    }, (err, result) => {
        console.log("🚀 ~ result:", result)
        if (result) {
            console.log('url',result.secure_url);
            // lấy secure_url từ đây để lưu vào database.
        }
    });
    res.json({ message: 'Tệp được tải lên thành công.', data: file });
});


//Lesson-11: Pagination

// API Routers
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/deposit-orders', depositOrderRouter);

app.listen(8080, () => {
    console.log("App is running")
})