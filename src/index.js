import mongoose from "mongoose";
import {DB_NAME} from './constant.js'
import connectDB from "./db/index.js";
import dotenv from 'dotenv'
// import { app } from "./app.js";

dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{
      app.on("errror",(error)=>{
        console.log("ERR",error )
        throw error
    })
    app.listen(process.env.PORT || 800,()=>{
        console.log(`Server is running `)
    })
})
.catch((err)=>{
    console.log("Mongo db connection failed!!! ", err)
})

