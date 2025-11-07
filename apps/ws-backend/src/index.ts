import {WebSocketServer} from 'ws'
import jwt from 'jsonwebtoken'
const wss = new WebSocketServer({port:8080})
import dotenv from 'dotenv'
import { string } from 'zod'
dotenv.config()

interface JwtPayload{
  _id:string
}

function checkUser(token:string):string | null{
  const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as string | jwt.JwtPayload
  if (typeof decoded === 'string' || !decoded) {
    return null
  }

  const payload = decoded as JwtPayload
  return payload._id
}


wss.on('connection',(socket,request)=>{
  const url = request.url
  if (!url) {
    throw new Error(`Url is Not Defined`)
  }

  const searchparams = new URLSearchParams(url.split("?")[1])
  const token = searchparams.get('token') || ""
  const userId = checkUser(token)

  if (!userId) {
    socket.close()
  }

  socket.on('message',(data)=>{
    socket.send('pong') 
  })
})