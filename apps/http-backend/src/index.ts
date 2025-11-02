import e from "express";
import cors from 'cors'
import userrouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
const app = e()


app.use(e.json())
app.use(cors())
app.use(cookieParser())

app.use('/api/v1',userrouter)

const PORT = 3000

app.listen(PORT,()=>{
  console.log(`Server Run at Port ${PORT}`);
})