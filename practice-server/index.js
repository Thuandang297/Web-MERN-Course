import axios from 'axios';
import express from 'express';
const app = express();

app.listen(8080, () => {
    console.log('Server is running!');
});

app.get('', (req, res) => {
    res.send({ message: "ok" })
})

//Practice homework
//1. Viết API để lấy toàn bộ danh sách khách hàng.

app.get('/customers', async (req, res) => {
    // Gọi service của json-server
    const response = await axios('http://localhost:3000/customers');
    console.log("🚀 ~ response:", response)

    return res.status(200).send({ data: response.data, message: "Success" })
})

//2. Lấy thông tin chi tiết của một khách hàng

app.get('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await axios(`http://localhost:3000/customers/${id}`)
        if (!customer) {
            throw Error('Customer not found')
        }
        return res.status(200).send({ data: customer.data, message: "Success" })
    } catch (error) {
        res.status(500).send({ data: null, message: error.message })
    }

})