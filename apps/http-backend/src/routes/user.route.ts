import { Router } from "express";
import { getChat, getRooms, Logout, roomCreation, SignIn, SignUp, getDrawings, getRoomBySlug, getToken } from "../controllers/user.controller.js";
import { authToken } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const userrouter:Router = Router()

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many requests from this IP, please try again after 15 minutes"
})

userrouter.post('/signup',appLimiter,SignUp)
userrouter.post('/signin',appLimiter,SignIn)
userrouter.post('/create-room',authToken,roomCreation)
userrouter.get('/chats/:id',authToken,getChat)
userrouter.post('/logout',authToken,Logout)
userrouter.get('/rooms',authToken,getRooms)
userrouter.get('/rooms/:id/drawings', authToken, getDrawings)
userrouter.get('/room/:slug', authToken, getRoomBySlug)
userrouter.get('/token', authToken, getToken)

export default userrouter