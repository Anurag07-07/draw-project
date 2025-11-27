'use client'

import Link from "next/link"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, FormEvent, useState, Suspense } from "react"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { motion } from "framer-motion"
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import { HTTP_BACKEND } from "../config"

interface IUser {
  username: string,
  password: string
}

function SigninContent() {
  const [user, setUser] = useState<IUser>({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  async function SubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${HTTP_BACKEND}/api/v1/signin`, user, {
        withCredentials: true
      })

      if (response.data || response) {
        console.log('✅ Sign in response:', response.data);
        console.log('🔑 Token received:', response.data.token);

        toast.success(`Welcome back!`)

        // Store token in both cookies and localStorage for redundancy
        Cookies.set("token", response.data.token, { expires: 7 });
        console.log('🍪 Token stored in cookies');

        localStorage.setItem('token', response.data.token);
        console.log('💾 Token stored in localStorage');

        // Verify it was stored
        const storedToken = localStorage.getItem('token');
        console.log('✔️ Token verification:', storedToken ? 'exists in localStorage' : 'NOT in localStorage');

        if (redirect) {
          router.push(redirect)
        } else {
          router.push('/')
        }
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-neutral-950 to-black relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-500/30 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-purple-600/30 to-pink-500/30 blur-[100px]"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-4 sm:mx-0 relative z-10"
      >
        {/* Card with Enhanced Glassmorphism */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[1.75rem] opacity-20 blur-xl group-hover:opacity-30 transition duration-1000" />

          <div className="relative bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/50">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 sm:mb-10 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 mb-6 shadow-xl shadow-blue-500/30"
              >
                <Sparkles className="text-white w-7 h-7" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-3 tracking-tight leading-tight">
                Welcome Back
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base">
                Sign in to continue to your workspace
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={SubmitHandler} className="space-y-5">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
              >
                <label htmlFor="username" className="block text-sm font-medium text-neutral-300 ml-0.5">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-400 transition-all duration-300">
                    <Mail size={20} strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    placeholder="username"
                    value={user.username}
                    name="username"
                    id="username"
                    required
                    onChange={ChangeHandler}
                    className="w-full bg-neutral-950/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 focus:bg-neutral-950/80 transition-all duration-300 hover:border-white/20"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300 ml-0.5">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-400 transition-all duration-300">
                    <Lock size={20} strokeWidth={2} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={user.password}
                    name="password"
                    id="password"
                    required
                    onChange={ChangeHandler}
                    className="w-full bg-neutral-950/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 focus:bg-neutral-950/80 transition-all duration-300 hover:border-white/20"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="relative w-full mt-6 group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center justify-center gap-2 px-6 py-4 text-white font-semibold rounded-xl">
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} strokeWidth={2.5} />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} strokeWidth={2.5} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>

                {!loading && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 shadow-lg shadow-blue-500/50" />
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-white/5 text-center"
            >
              <p className="text-sm text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4 decoration-2"
                >
                  Create account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Signin() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>}>
      <SigninContent />
    </Suspense>
  )
}
