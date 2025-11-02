import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {Request,Response} from 'express'
import {prisma} from '@repo/db/db'
import {UserSignupValidation,UserSigninValidation,UserChatValidation} from '@repo/common/common'
import dotenv from 'dotenv'
dotenv.config()

export const SignUp = async (req: Request, res: Response) => {
  // Validate incoming data
  const checkValidation = UserSignupValidation.safeParse(req.body);

  if (!checkValidation.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: checkValidation.error.message,
    });
  }

  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in database
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Send success response
    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};


export const SignIn = async (req: Request, res: Response) => {
  // Validate input data
  const checkValidation = UserSigninValidation.safeParse(req.body);
  if (!checkValidation.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: checkValidation.error.message,
    });
  }

  try {
    const { username, password } = req.body;

    // Check if user exists
    const check = await prisma.user.findFirst({
      where: { username },
    });

    if (!check) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //  Compare password
    const match = await bcrypt.compare(password, check.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //  Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { _id: check.id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //  Send token in HTTP-only cookie (more secure)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("SignIn error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};


export const roomCreation = async(req:Request,res:Response)=>{
  
  try {
    
  } catch (error) {
    
  }
}