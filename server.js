const express=require("express")
const fileUpload = require("express-fileupload");

const env=require("dotenv").config()
const db=require("./config/dbConfig")
const app=express()
const port=process.env.port
app.use(express.json())

app.use(fileUpload({
    useTempFiles: true
  }));
  
app.use(cors());

app.get("/",(req,res)=>{
    res.send("welcome")
})


app.listen(1234,()=>{
    console.log(`app is successfully listening to port http://localhost ${port} `);
    
})

