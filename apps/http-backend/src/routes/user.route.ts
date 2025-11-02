import { Router } from "express";
import { SignIn, SignUp } from "../controllers/user.controller.js";

const userrouter:Router = Router()

userrouter.post('/signup',SignUp)
userrouter.post('/signin',SignIn)

export default userrouter