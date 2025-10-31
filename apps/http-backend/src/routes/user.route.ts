import { Router } from "express";
import { SignUp } from "../controllers/user.controller.js";

const userrouter:Router = Router()

userrouter.post('/signup',SignUp)

export default userrouter