import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

interface JwtPayload{
  _id:string
}

export const authToken = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    //Find the token
     const token = req.cookies?.token
     //Check The Token
     const check = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload
     
     if (!check) {
      return res.status(403).json({
        message:`Invalid Token`
      })
     }
    
     req.userId = check._id
     next()
  } catch (error) {
    return res.status(500).json({
      message:`Token is Not Valid`
    })
  }
}