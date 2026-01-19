import axios from 'axios';
import express from 'express';
const app = express();

app.use(express.json());
app.listen(8080, () => {
    console.log('Server is running!');
});

app.get('/users', (req, res) => {
    fetch('http://localhost:3000/users').then((rs) => {
        return rs.json()
    }).then((data) => {
        res.send({
            message: 'Hello MindX-er',
            data
        });
    });
});

app.get('/post', async (req, res)=>{
    const postData = await axios.get('http://localhost:3000/posts');
    res.status(200).send({data:postData.data, message:"ok"})
})

app.post('/post', async (req, res)=>{
    const body = req.body;
    const postData = await axios.post('http://localhost:3000/posts', body);
    res.status(200).send({data:postData.data, message:"ok"})
})

