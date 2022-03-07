// node 다운 ,node안에 npm있음
// npm init
// npm install express --save
// npm run start , json의 script부분으로 파일 실행 or node index.js
const express = require('express') // npm으로 다운받은거 불러오기
const app = express()
const port = 5000

const config = require('./config/key');

const { User } = require("./models/Users")

app.use(express.urlencoded({extended: true}));
app.use(express.json()) 


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
    //회원 가입

    const user = new User(req.body)

    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
  })

// 앱이 실행되면 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
