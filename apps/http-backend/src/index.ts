import e from "express";
import cors from 'cors'
import userrouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()
const app = e()


app.use(e.json())
app.use(cors(
  {
    origin:["http://localhost:3001"],
    credentials:true
  }
))
app.use(cookieParser())

app.use('/api/v1',userrouter)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server Run at Port ${PORT}`);
})