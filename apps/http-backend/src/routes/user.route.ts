import { Router } from "express";
import { getChat, getRooms, Logout, roomCreation, SignIn, SignUp, getDrawings, getRoomBySlug, getToken } from "../controllers/user.controller.js";
import { authToken } from "../middleware/auth.js";

const userrouter:Router = Router()

userrouter.post('/signup',SignUp)
userrouter.post('/signin',SignIn)
userrouter.post('/create-room',authToken,roomCreation)
userrouter.get('/chats/:id',authToken,getChat)
userrouter.post('/logout',authToken,Logout)
userrouter.get('/rooms',authToken,getRooms)
userrouter.get('/rooms/:id/drawings', authToken, getDrawings)
userrouter.get('/room/:slug', authToken, getRoomBySlug)
userrouter.get('/token', authToken, getToken)

export default userrouter