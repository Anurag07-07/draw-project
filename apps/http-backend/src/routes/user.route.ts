import { Router } from "express";
import { roomCreation, SignIn, SignUp } from "../controllers/user.controller.js";
import { authToken } from "../middleware/auth.js";

const userrouter:Router = Router()

userrouter.post('/signup',SignUp)
userrouter.post('/signin',SignIn)
userrouter.post('/create-room',authToken,roomCreation)

export default userrouter