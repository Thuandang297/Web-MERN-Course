import express from "express"
import AuthorModel from "./src/models/author.js"
import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import AccountModel from "./src/models/accounts.js"
import jwt  from "jsonwebtoken"

const app = express()
app.use(express.json())

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


app.listen(8080, () => {
    console.log("App is running")
})