// node 다운 ,node안에 npm있음
// npm init
// npm install express --save
// npm run start , json의 script부분으로 파일 실행 or node index.js
const express = require('express') // npm으로 다운받은거 불러오기
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://junki:1234@node1.pqdw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 앱이 실행되면 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
