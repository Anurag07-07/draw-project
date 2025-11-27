import e from "express";
import cors from 'cors'
import userrouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()
const app = e()


app.use(e.json())


app.use(cors({
  origin:[
    // "http://localhost:3001",
    "https://draw-project-7.onrender.com",
    // "https://draw-project-8.onrender.com","https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app"
    ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

app.use(cookieParser())

app.use('/api/v1',userrouter)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server Run at Port ${PORT}`);
})