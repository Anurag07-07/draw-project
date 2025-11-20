'use client'

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"

import Cookies from 'js-cookie'

interface IUser{
  username:string,
  password:string
}

export default function Signin(){

  const [user,setUser] = useState<IUser>({
    username:"",
    password:""
  })

  const router = useRouter()

  const ChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
      const {name,value} = e.target
      setUser({...user,[name]:value})
  }

   async function SubmitHandler(e:FormEvent<HTMLFormElement>){
     e.preventDefault()
     try {
      const response = await axios.post(`http://localhost:3000/api/v1/signin`,user,{
        withCredentials:true
      })
      
      if (response.data || response) {
        toast.success(`User signin succesfully`)
        Cookies.set("token", response.data.token, { expires: 7 });
        router.push('/')
      }else{
        console.log(`Data not recieved`);
        
      }
     } catch (error) {
      console.error(error);
      console.log((error as Error).message);
      console.log((error as Error).stack);
     }
   }

  return <div>
    <div>Edunax Signin Page</div>
    <form onSubmit={SubmitHandler}>
      <div>
        <label htmlFor="username">Email</label>
        <input type="text" placeholder="Enter the username..." value={user.username} name="username" id="username" onChange={ChangeHandler} />
      </div>
      <div>
        <label htmlFor="password">Email</label>
        <input type="password" placeholder="Enter the password..." value={user.password} name="password" id="password" onChange={ChangeHandler} />
      </div>
      <div>
        <button type="submit">Signin</button>
        <div>
          Don&apos;t have account ? <Link href={'/signup'}>Signup</Link>
        </div>
      </div>
    </form>
  </div>
}
