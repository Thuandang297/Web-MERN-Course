1.Khởi tạo dự án: npm init

2.Install expressjs : npm i express

3.Tạo file index.js và khởi tạo server
import express from 'express';
const app = express();

app.listen(8080, () => {
    console.log('Server is running!');
});

4.Cài đặt Json-server(cài 1 lần trong máy): npm install -g json-server

5.Cài concurrently:npm i concurrently --save-dev

6.Cài nodemon : npm i nodemon --save-dev

7.Setting script trong package.json để chạy json-server và node:
"dev":"concurrently \"nodemon index.js\" \"json-server --watch db.json\""




