import express from "express"
import AuthorModel from "./src/models/author.js"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import AccountModel from "./src/models/accounts.js"
import jwt  from "jsonwebtoken"
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const app = express()
app.use(express.json())

// Khởi tạo tùy chọn lưu trữ memoryStorage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


cloudinary.config({
    cloud_name: 'dxo324ch0',
    api_key: '392236692491454',
    api_secret: 'qYDv0H5lDyR81eueVbGoSsKGOHQ'
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

app.listen(8080, () => {
    console.log("App is running")
})