import http from 'http';
import { customers, orders } from './data.js'
const app = http.createServer((request, response) => {

    const url = request.url;
    const method = request.method;
    const id = url.split(':')[1]?.split('/')[0];
    switch (url) {
        case '/customers':
            if (method === "GET") {
                return response.end(JSON.stringify(customers))
            }
            break;
        case `/customers/:${id}/orders`:
            if (method === "GET") {
                const productsOfUser = orders.filter(item => item.customerId === id);
                return response.end(JSON.stringify(productsOfUser))
            }
            break;
        case `/customers/:${id}`:
            if (method === "GET") {
                //Xử lý tìm kiếm người dùng trong mảng dựa vào id
                const user = customers.find(item => item.id === id)
                if (!user) {
                    return response.end(JSON.stringify({ "message": "Không tồn tại người dùng" }))
                }
                return response.end(JSON.stringify(user))
            }
            break;
        default:
            break;
    }
})

app.listen(8080, () => {
    console.log("Server is running!")
})