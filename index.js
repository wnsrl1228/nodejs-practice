// node 다운 ,node안에 npm있음
// npm init
// npm install express --save
// npm run start , json의 script부분으로 파일 실행 or node index.js
const express = require('express') // npm으로 다운받은거 불러오기
const app = express()
const port = 5000

const config = require('./config/key');
const cookieParser = require('cookie-parser');
const {auth} =require('./middleware/auth')
const { User } = require("./models/Users")

app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected ...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req, res) => {
    //회원 가입

    const user = new User(req.body)


    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true,
        })
    })
  })

app.post('/api/users/login',(req,res) => {
  
  //요청된 이메일이 db에 있는지 확인
  User.findOne({email: req.body.email }, (err,user) => {
    if(!user){
      return res.json({
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가 없다."
      })
    }

    //요청된 이메일이 있다면 비번이 맞는지 확인
    user.comparePassword(req.body.password , (err,isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess:false,message:"비번틀림"})


      // 비밀번호까지 맞으면 토큰생성
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err)

        // 토큰을 저장한다 어디에? 쿠키, 로컬저장소
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess:true,userId:user._id})  
      })

    })
  })
})

app.get("/api/users/auth", auth,(req,res) => {

  //여기까지 미드웨어를 통과해 왔다는 얘기는 권환 통과
  res.json(200).json({
    _id:req.user._id,
    isAdmin:req.user.role===0?false:true,
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image
  })
})


app.get('/api/users/logout',auth,(req,res)=>{

  User.findOneAndUpdate({_id: req.user._id},
    {token:""}
    , (err,user) => {
      if (err) return res.json({success:false,err});
      return res.status(200).send({
        success:true
      })
    })
})

// 앱이 실행되면 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
