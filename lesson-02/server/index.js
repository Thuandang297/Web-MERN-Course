import express from 'express';
const app = express();
import { customers, orders, products } from './data.js';
import { v4 as uuidv4 } from 'uuid';
app.use(express.json());
app.listen(8080, () => {
    console.log('Server is running!');
});

// 1.Viết API để lấy toàn bộ danh sách khách hàng

app.get('/customers', (req, res) => {
    return res.status(200).send({ message: "Success!", data: customers })
})

//2. Lấy thông tin chi tiết của 1 khách hàng
app.get('/customers/:id', (req, res) => {
    // Lấy Id khách hàng mà người dùng truyền vào
    const cusId = req.params.id;
    const cusData = customers.find(item => item.id === cusId);
    if (!cusData) return res.status(500).send({ message: "Get customer fail!", data: null })
    return res.status(200).send({ message: "Get customer successfully!", data: cusData })
})

// 3. Lấy thông tin đơn hàng dựa trên id khách hàng
app.get('/customers/:cusId/orders', (req, res) => {
    const customerId = req.params.cusId;
    const customerOrders = orders.filter(item => item.customerId === customerId);
    if (!customerOrders) return res.status(500).send({ message: "Get orders fail!", data: null })
    return res.status(200).send({ message: "Get orders successfully!", data: customerOrders })
})

// 4.Lấy thông tin các đơn hàng với tổng giá trị trên 10 triệu
app.get('/orders/highvalue', (req, res) => {
    const hightValOrds = orders.filter(item => item.totalPrice > 10000000);
    return res.status(200).send({ message: "Get high value's orders success!", data: hightValOrds })
})

//5. Lọc danh sách sản phẩm theo khoảng giá
app.get('/products', (req, res) => {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    if (!minPrice || !maxPrice) {
        return res.status(200).send({ message: "Get product success!", data: products })
    }
    const productData = products.filter(product => (product.price <= maxPrice && product.price >= minPrice))
    return res.status(200).send({ message: "Get product success!", data: productData })
});

//6.Thêm mới khách hàng
app.post('/customers', (req, res) => {
    const { name, email, age } = req.body;
    //validate email
    if (!email) return res.status(404).send({ message: 'Email is empty!' })
    const isExistEmail = customers.some(cus => cus.email === email);

    if (isExistEmail) {
        return res.status(404).send({ message: 'Email was used for another account!' })
    }

    const id = uuidv4();
    const newUser = { id, name, age, email }
    customers.push(newUser)
    return res.status(201).send({ message: 'Create user successfully', status: 200, data: newUser })
})

//7. Tạo mới đơn hàng
app.post('/orders', (req, res) => {
    const { orderId, customerId, productId, quantity } = req.body;
    //validate quality of product is can't provide for order
    const product = products.find(product => product.id === productId);
    const qualityProduct = product?.quantity;
    if (quantity > qualityProduct) {
        return res.status(500).send({ message: 'The product is not enough for this order', data: null, status: 500 })
    }

    //Caculate totalPrice of this order
    const totalPrice = product.price * quantity;

    const newOrder = {
        id:orderId,
        customerId: customerId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice
    }

    orders.push(newOrder);

    return res.status(201).send({message:"Create a new order successfully", status:201})
})