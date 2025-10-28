import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
})
import express from 'express'
import fs from "fs";
import path from "path";
import expenseRouter from './routes/expense.route.js'
import productRouter from './routes/product.route.js'
import userRouter from './routes/user.route.js' 
import { authMiddleware } from './middleware/auth.middleware.js'
import { errorHandler, notFound } from './errors/error.js'
import cors from "cors"
import connectDb from './config/db.js'
import authRouter from './routes/auth.route.js'
import aiRouter from './routes/ai.route.js'
import profileRoutes from "./routes/profile.route.js"
//to start app
const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    "https://expensetracker0011.netlify.app"
}))

// it will parse your json
app.use(express.json({limit:"10mb"}))
app.use("/api",authRouter)
//midddleware
app.use(authMiddleware)

// these are routes



// ✅ Create uploads directory if missing
// const uploadPath = path.join(process.cwd(), "public", "uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
//   console.log("📂 Created uploads folder at:", uploadPath);
// }

// ✅ Serve static files (for accessing uploaded avatars)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api",aiRouter)
app.use("/user", profileRoutes)
app.use("/api",expenseRouter)
app.use("/api",productRouter)
app.use("/api",userRouter)

//error handle
app.use(notFound)
app.use(errorHandler)

// root handle
app.get("/",(req,resp)=>
{
    console.log("this is root url")
    resp.json({message:"this is root url"})
}
)

//server start
app.listen(8010,()=>
{
    console.log("server is running on port 8010")
})
