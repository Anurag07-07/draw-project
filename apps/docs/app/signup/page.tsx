'use client'

import axios, { AxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

interface IUser{
  username:string,
  password:string
}

export default function Signup(){  
  const [user,setUser] = useState<IUser>({
    username:"",
    password:""
  })

  const router = useRouter()

  function ChangeHandler(e:ChangeEvent<HTMLInputElement>){
    const {name,value} = e.target
    setUser({...user,[name]:value})
  }

  async function SubmitHandler(e:FormEvent<HTMLFormElement>){
    e.preventDefault()
    try {
    const response = await axios.post(`http://localhost:3000/api/v1/signup`,
      user,{
      withCredentials:true
    })
    
    if (response.data || response) {
      router.push('/signin')
    }else{
      console.log(`Signup failed`);
    }
    } catch (error) {
      console.log((error as AxiosError).message);
      console.error(error);
    }
  }
  return <div>
    <div>Edunax Signup Page</div>
    <form onSubmit={SubmitHandler}>
    <div>
      <label htmlFor="username">Username</label>
      <input placeholder="Enter the username..." value={user.username} id="username" name="username" onChange={ChangeHandler} type="text" />
    </div>
     <div>
      <label htmlFor="password">Password</label>
      <input placeholder="Enter the password..." value={user.password} id="password" name="password" onChange={ChangeHandler} type="password" />
    </div>
    <div>
    <button type="submit">
      Signup
    </button>
    <div>
      Already have account ? <Link href={'/signin'}>Signin</Link>
    </div>
    </div>
    </form>
  </div>
}