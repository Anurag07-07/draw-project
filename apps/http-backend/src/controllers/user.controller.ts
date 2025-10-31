import {Request,Response} from 'express'
import {prisma} from '@repo/db/db'
export const SignUp = async(req:Request,res:Response)=>{
  const {username,password} = req.body
  try {
    console.log(`1`);

    await prisma.user.create({
      data:{
        username:username,
        password:password
      }
    })
    
    console.log(`2`);
    return res.json({
      message:`Signup Success`
    })
  } catch (error) {
    return res.status(500).json({
      message:`Internal Server Error`,
      error:error
    })
  }
}