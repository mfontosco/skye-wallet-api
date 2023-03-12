import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB } from './config/db.js'
import UserRoute from './routes/user.js'
import TransactionRoute from './routes/transaction.js'


const app = express()

app.use(express.json({limit:"50mb"}))
app.use(
    express.urlencoded({ extended: true })
);
// app.use(urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(cors())

 app.use("/api/v1/users",UserRoute)
 app.use("/api/v1/transaction",TransactionRoute)

app.get("/",(req,res)=>{
    res.send("welcome to my skye-wallet api")
})



const start = async(port)=>{
    try{
        const conn = await connectDB()
        app.listen(port,(err)=>{
            if(err){
                throw err
            }
            console.log(`server is running on port ${port}`)
        })
        console.log(`database is connected to ${conn.connection.host}`)
    }catch(err){
        console.log(err)
    }
   
}

const port = process.env.PORT || 4000;
start(port)

