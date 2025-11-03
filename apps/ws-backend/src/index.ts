import {WebSocketServer} from 'ws'
import jwt from 'jsonwebtoken'
const wss = new WebSocketServer({port:8080})

interface JwtPayload{
  _id:string
}

function checkUser(token:string){
  const decoded = jwt.verify(token,process.env.JWT_SECRET as unknown as string) as JwtPayload  

  if (typeof decoded !== 'string') {
    return null
  }

  if (!decoded) {
    return null
  }

  console.log(token);
  

  // return decoded._id

}

wss.on('connection',(socket,request)=>{
  // const url = request.url
  // if (!url) {
  //   throw new Error(`Url is Not Defined`)
  // }

  // const searchparams = new URLSearchParams(url.split("?")[1])
  // const token = searchparams.get('token') || ""
  // const present = checkUser(token)
  console.log("Connection");
  
})