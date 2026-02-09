import http from 'http'
import url from 'url'

const listStudent = [
  {
    id: 1,
    fullName: "Jackie",
    age: 5,
    class: "5A"
  },
  {
    id: 2,
    fullName: "Juli MTP",
    age: 56,
    class: "5A"
  },
  {
    id: 3,
    fullName: "Denis",
    age: 55,
    class: "5B"
  },
]

//Tạo server

const app = http.createServer(
  (request, response) => {
    const urlPath = request.url;
    console.log('🚀 ~ urlPath:', urlPath)
    const method = request.method;
    console.log('🚀 ~ method:', method)

    if (urlPath === '/users') {
      response.end(JSON.stringify(listStudent));
    }
    else if (urlPath === '/users/old') {
      const oldList = listStudent.filter(item => item.age > 50);
      response.end(JSON.stringify(oldList))
    }

    // api lấy thông tin học sinh
    if (urlPath.includes('/students')) {

      //Lấy danh sách học sinh
      if (method === 'GET') {
        response.end(JSON.stringify(listStudent))
      }

      //Thêm mới học sinh
      else if (method === 'POST') {
        //Lấy dữ liệu từ URL
        const praseUrl = url.parse(request.url, true);
        console.log('🚀 ~ praseUrl:', praseUrl)
        const data = praseUrl.query;
        console.log('🚀 ~ data:', data)

        const newStudent = {
          id: data.id,
          fullName: data.fullName,
          class: data.class,
          age: data.age,
        }
        console.log('🚀 ~ newStudent:', newStudent)
        listStudent.push(newStudent);
        response.end(JSON.stringify(newStudent));
      }
    }


  }
);

//Khởi tạo cổng để server chạy trên đó

app.listen(9000, () => {
  console.log('Server is running in 9000!')
})