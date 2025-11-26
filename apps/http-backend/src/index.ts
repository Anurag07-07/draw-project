import e from "express";
import cors from 'cors'
import userrouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()
const app = e()


app.use(e.json())

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      "http://localhost:3001",
      "https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app",
      // Add any other Vercel preview/production URLs
      "https://draw-project-docs.vercel.app", // In case you have a production domain
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list or matches Vercel preview pattern
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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