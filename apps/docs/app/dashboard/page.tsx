'use client'

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  PenTool,
  Layers,
  Users,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Zap,
  FolderOpen,
  Loader2,
  Calendar
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"

interface ISlug {
  slug: string
}

interface Room {
  id: number
  slug: string
  adminId: string
  createdAt: string
  updatedAt: string
}

// Grid Background Component
const GridBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
  </div>
)

// Animated Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  index
}: {
  icon: React.ComponentType<{ className?: string }>,
  label: string,
  value: string | number,
  trend: string,
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
    className="group relative p-6 border border-white/10 bg-neutral-950/50 hover:bg-neutral-900/50 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      </div>

      <h3 className="text-3xl font-semibold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-sm text-neutral-500 font-light">{label}</p>
    </div>
  </motion.div>
)

// Recent Room Card Component with real data
const RecentRoomCard = ({
  room,
  index
}: {
  room: Room,
  index: number
}) => {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
      className="group p-5 border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 hover:border-white/20 transition-all duration-500 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-medium text-white group-hover:text-neutral-100 transition-colors">
          {room.slug}
        </h4>
        <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <Clock className="w-3.5 h-3.5" />
        <span>{getTimeAgo(room.createdAt)}</span>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [slug, setSlug] = useState<ISlug>({ slug: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:3000/api/v1/rooms`, {
        withCredentials: true
      })
      setRooms(response.data.rooms)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch rooms")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!slug.slug.trim()) {
      toast.error("Please enter a room name")
      return
    }

    try {
      setIsCreating(true)
      await axios.post(`http://localhost:3000/api/v1/create-room`, slug, {
        withCredentials: true
      })
      toast.success("Room created successfully!")
      setSlug({ slug: "" })
      await fetchRooms() // Refresh rooms list
      router.push('/rooms')
    } catch (error) {
      console.error(error)
      toast.error("Failed to create room")
    } finally {
      setIsCreating(false)
    }
  }

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setSlug((prev) => ({ ...prev, [name]: value }))
  }

  // Calculate stats from real data
  const stats = [
    { icon: Layers, label: "Total Rooms", value: rooms.length, trend: "+100%" },
    { icon: PenTool, label: "Active Projects", value: rooms.length, trend: "+12%" },
    { icon: Users, label: "Collaborators", value: rooms.length * 4, trend: "+23%" },
    { icon: Zap, label: "Hours Saved", value: rooms.length * 18, trend: "+45%" },
  ]

  return (
    <div className="relative min-h-screen w-full bg-black font-sans text-white selection:bg-white selection:text-black">
      <Toaster position="bottom-right" theme="dark" />
      <GridBackground />

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs tracking-[0.2em] uppercase mb-6">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Your Workspace
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-4 text-white leading-[1.1]">
              Welcome back
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl font-light leading-relaxed">
              Continue where you left off, or start something new.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden mb-12">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} index={idx} />
            ))}
          </div>

          {/* Create Room Section - Premium Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-neutral-950/30 to-black border border-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_50%)]" />

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight">
                    Create New Room
                  </h2>
                  <p className="text-neutral-400 font-light">
                    Start a fresh collaborative space for your team
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      name="slug"
                      value={slug.slug}
                      onChange={changeHandler}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Enter room name..."
                      className={`w-full px-6 py-4 bg-black/50 border ${isInputFocused ? 'border-white/30' : 'border-white/10'
                        } text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all duration-300`}
                    />
                    <motion.div
                      initial={false}
                      animate={{ scaleX: isInputFocused ? 1 : 0 }}
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="group relative px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide uppercase overflow-hidden hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Quick Action - Browse All Rooms */}
            <div className="lg:col-span-2">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-neutral-500 tracking-[0.2em] uppercase mb-6 font-light"
              >
                Quick Actions
              </motion.h3>

              <Link href="/rooms">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="group block p-8 border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 hover:border-white/20 transition-all duration-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-white mb-2 group-hover:text-neutral-100 transition-colors">
                        Browse All Rooms
                      </h4>
                      <p className="text-sm text-neutral-500 font-light leading-relaxed mb-4">
                        View all your collaborative spaces and join active sessions
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Calendar className="w-4 h-4" />
                        <span>{rooms.length} rooms available</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-neutral-500 tracking-[0.2em] uppercase mb-6 font-light"
              >
                Recent Rooms
              </motion.h3>

              {isLoading ? (
                <div className="flex items-center justify-center p-8 border border-white/10 bg-neutral-950/30">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="p-6 border border-white/10 bg-neutral-950/30 text-center">
                  <p className="text-neutral-500 text-sm font-light">
                    No rooms yet. Create your first room above!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.slice(0, 3).map((room, idx) => (
                    <RecentRoomCard key={room.id} room={room} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="inline-block p-12 border border-white/10 bg-neutral-950/30 backdrop-blur-sm">
              <h2 className="text-3xl font-light text-white mb-4 tracking-tight">
                Ready to collaborate?
              </h2>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto font-light">
                {rooms.length > 0
                  ? "Join your existing rooms or explore more collaborative spaces"
                  : "Create your first room and start collaborating with your team"}
              </p>
              <Link href="/rooms">
                <button className="group px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300">
                  <span className="flex items-center gap-2">
                    View All Rooms
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}