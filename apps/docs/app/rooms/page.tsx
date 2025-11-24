'use client'

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Clock,
  ArrowRight,
  Loader2,
  Calendar,
  Sparkles,
  Grid3x3,
  Search
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { Toaster, toast } from "sonner"

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
    <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
  </div>
)

// Room Card Component
const RoomCard = ({
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative p-8 border border-white/10 bg-neutral-950/30 hover:bg-neutral-900/50 hover:border-white/20 transition-all duration-500 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-medium text-white mb-2 group-hover:text-neutral-100 transition-colors">
              {room.slug}
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {formatDate(room.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-400">{Math.floor(Math.random() * 10) + 1} collaborators</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-400">{getTimeAgo(room.updatedAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/canvas/${room.slug}`}>
          <button className="w-full group/btn flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold tracking-wide uppercase hover:bg-neutral-100 transition-all duration-300">
            <span>Open Room</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room =>
    room.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              <Grid3x3 className="w-3 h-3" />
              All Rooms
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-4 text-white leading-[1.1]">
                  Your Rooms
                </h1>
                <p className="text-lg text-neutral-400 max-w-2xl font-light leading-relaxed">
                  Select a room to continue collaborating with your team
                </p>
              </div>

              <Link href="/dashboard">
                <button className="px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Create New Room
                  </span>
                </button>
              </Link>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative max-w-md"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-neutral-950/50 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-neutral-500 mb-4" />
              <p className="text-neutral-500 text-sm font-light">Loading your rooms...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-32 border border-white/10 bg-neutral-950/30"
            >
              <div className="p-6 rounded-full bg-white/5 mb-6">
                <Grid3x3 className="w-12 h-12 text-neutral-600" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">
                {searchQuery ? "No rooms found" : "No rooms yet"}
              </h3>
              <p className="text-neutral-500 text-sm font-light mb-8 max-w-md text-center">
                {searchQuery
                  ? `No rooms match "${searchQuery}". Try a different search term.`
                  : "Create your first room to start collaborating with your team"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard">
                  <button className="px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide uppercase hover:bg-neutral-100 transition-colors">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create Your First Room
                    </span>
                  </button>
                </Link>
              )}
            </motion.div>
          ) : (
            /* Rooms Grid */
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between mb-6"
              >
                <p className="text-sm text-neutral-500 font-light">
                  Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room, idx) => (
                  <RoomCard key={room.id} room={room} index={idx} />
                ))}
              </div>
            </>
          )}

          {/* Footer CTA */}
          {!isLoading && filteredRooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-20 text-center"
            >
              <div className="inline-block p-12 border border-white/10 bg-neutral-950/30 backdrop-blur-sm">
                <h2 className="text-3xl font-light text-white mb-4 tracking-tight">
                  Need another space?
                </h2>
                <p className="text-neutral-400 mb-8 max-w-md mx-auto font-light">
                  Create a new room for your next project or collaboration
                </p>
                <Link href="/dashboard">
                  <button className="group px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create New Room
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  )
}