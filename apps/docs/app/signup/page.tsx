'use client'

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Github,
  Mail
} from "lucide-react"
import axios, { AxiosError } from "axios"
import { Toaster, toast } from "sonner"
import { useRouter } from "next/navigation"
import { HTTP_BACKEND } from "../config"

// --- Components ---

// 1. Password Strength Meter Component
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const getStrength = (pass: string) => {
    let score = 0
    if (!pass) return 0
    if (pass.length > 6) score += 1
    if (pass.length > 10) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }

  const score = getStrength(password)

  return (
    <div className="w-full space-y-2 mt-3">
      <div className="flex justify-between text-xs text-neutral-400">
        <span>Password strength</span>
        <span className={`font-medium ${score <= 2 ? 'text-red-400' : score <= 4 ? 'text-yellow-400' : 'text-green-400'
          }`}>
          {score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong'}
        </span>
      </div>
      <div className="flex gap-1 h-1.5 w-full">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full rounded-full flex-1 transition-all duration-500 ${score >= level
              ? score <= 2 ? 'bg-red-500' : score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
              : 'bg-neutral-800'
              }`}
          />
        ))}
      </div>
    </div>
  )
}

// 2. Main Signup Component
export default function Signup() {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const router = useRouter()

  // Handle mouse move for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    setMousePosition({ x: clientX - left, y: clientY - top })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password is too short");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/api/v1/signup`,
        formData,
        { withCredentials: true }
      );

      // If signup done successfully
      setIsSuccess(true);
      toast.success(response.data.message || "Account created successfully!");

      // Redirect after success
      setTimeout(() => router.push("/signin"), 2000);

    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans selection:bg-purple-500/30"
      onMouseMove={handleMouseMove}
    >
      <Toaster position="top-center" theme="dark" richColors />

      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- Main Card Container --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        {/* Spotlight Effect Border */}
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-50 blur-sm transition duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168,85,247,0.4), transparent 40%)`
          }}
        />

        <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

          <AnimatePresence mode="wait">
            {isSuccess ? (
              // --- Success View ---
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2 ring-1 ring-green-500/50">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Aboard!</h2>
                  <p className="text-neutral-400">Your account has been created successfully. Redirecting you to the dashboard...</p>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-1 bg-green-500 rounded-full w-full max-w-[200px]"
                />
              </motion.div>
            ) : (
              // --- Form View ---
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="p-8 sm:p-10"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 mb-6 shadow-lg shadow-purple-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Create Account
                  </h1>
                  <p className="text-neutral-400 text-sm">
                    Enter your details to unlock full access
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Username Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-neutral-500 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all duration-200 hover:border-neutral-700"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-purple-400 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-12 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all duration-200 hover:border-neutral-700"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {/* Password Strength Meter */}
                    <AnimatePresence>
                      {formData.password.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <PasswordStrengthMeter password={formData.password} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden group py-4 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    {/* Button Hover Shine */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </form>

                {/* Footer Link */}
                <p className="mt-8 text-center text-sm text-neutral-500">
                  Already have an account?{" "}
                  <a href="/signin" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                    Sign in
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}