import {app} from "./app.js";
import dbConnect from "./db/index.js";
import dotenv from "dotenv"

dbConnect().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app running at ${process.env.PORT}`);
    })
}).catch((error )=>{
    console.log("db connection failed ",error);
})