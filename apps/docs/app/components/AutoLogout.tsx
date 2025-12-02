'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { HTTP_BACKEND } from '../config'
import Cookies from 'js-cookie'

const INACTIVITY_LIMIT = 25 * 60 * 1000 // 25 minutes

export default function AutoLogout() {
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const logoutUser = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token')

      // Clear cookies
      Cookies.remove('token')

      // Call backend logout
      await axios.post(`${HTTP_BACKEND}/api/v1/logout`, {}, {
        withCredentials: true
      })

      toast.error("Session expired due to inactivity")
      router.push('/signin')
    } catch (error) {
      console.error("Logout error:", error)
      router.push('/signin')
    }
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Only set timer if user is logged in (has token)
    const token = localStorage.getItem('token') || Cookies.get('token')
    if (token) {
      timerRef.current = setTimeout(logoutUser, INACTIVITY_LIMIT)
    }
  }

  useEffect(() => {
    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']

    // Initial setup
    resetTimer()

    // Add event listeners
    const handleActivity = () => {
      resetTimer()
    }

    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [])

  return null
}
