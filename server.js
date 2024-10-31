const express=require("express")
const fileUpload = require("express-fileupload");
const router = require('../router/routes')

const env=require("dotenv").config()
const db=require("./config/dbConfig")
const app=express()
const port=process.env.port
app.use(express.json())

app.use(fileUpload({
    useTempFiles: true
  }));

app.use(router)
  
app.use(cors());

app.get("/",(req,res)=>{
    res.send("welcome")
})


app.listen(port,()=>{
    console.log(`app is successfully listening to port http://localhost:${port} `);
    
})

