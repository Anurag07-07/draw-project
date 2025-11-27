'use client'

import React, { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Square,
  Circle,
  Minus,
  Pencil,
  Type,
  Trash2,
  Download,
  Users,
  MessageSquare,
  Send,
  X,
  Palette,
  Loader2,
  Share2
} from "lucide-react"
import { Toaster, toast } from "sonner"
import api from "../../api"
import { HTTP_BACKEND, WS_BACKEND } from "../../config"

// Types
interface DrawingElement {
  id: string
  type: 'rectangle' | 'circle' | 'line' | 'pencil' | 'text'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  path?: { x: number; y: number }[]
  text?: string
  strokeColor: string
  fillColor?: string
  strokeWidth: number
  opacity: number
}

interface ChatMessage {
  id: number
  message: string
  userId: string
  roomId: number
  user?: {
    username: string
  }
}

type ToolType = 'rectangle' | 'circle' | 'line' | 'pencil' | 'text' | 'select'

export default function CanvasPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const roomSlug = resolvedParams.slug
  const router = useRouter()

  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [currentTool, setCurrentTool] = useState<ToolType>('pencil')
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentElement, setCurrentElement] = useState<Partial<DrawingElement> | null>(null)
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [fillColor, setFillColor] = useState('#transparent')
  const [strokeWidth, setStrokeWidth] = useState(2)

  // WebSocket state
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState<number | null>(null)

  // Chat state
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // User count
  const [userCount, setUserCount] = useState(1)

  // Load room data and existing drawings
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        console.log("Loading room:", roomSlug)

        // Get room info
        const roomResponse = await api.get(`/api/v1/room/${roomSlug}`)

        console.log("Room response:", roomResponse.data)
        const room = roomResponse.data.room

        if (!room) {
          toast.error("Room not found")
          return
        }

        setRoomId(room.id)

        // Load existing drawings
        try {
          const drawingsResponse = await api.get(`/api/v1/rooms/${room.id}/drawings`)
          setElements(drawingsResponse.data.drawings || [])
        } catch (err) {
          console.log("No existing drawings or endpoint not available yet")
        }

      } catch (error: any) {
        console.error("Error loading room:", error)
        console.error("Error response:", error.response)

        if (error.response?.status === 401) {
          toast.error("Please login to join the room")
          router.push(`/signin?redirect=/canvas/${roomSlug}`)
        } else if (error.response?.status === 404) {
          toast.error("Room not found")
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else if (error.code === 'ERR_NETWORK' || !error.response) {
          toast.error("Backend server not running. Please start it on port 3000")
        } else {
          toast.error(error.response?.data?.message || "Failed to load room")
        }
      }
    }

    loadRoomData()
  }, [roomSlug, router])

  // Initialize WebSocket connection
  useEffect(() => {
    if (!roomId) return

    const connectWebSocket = async () => {
      try {
        // Use existing token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          toast.error("Authentication failed")
          return
        }

        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)

        ws.onopen = () => {
          console.log("WebSocket connected")
          setIsConnected(true)
          if (roomId) {
            ws.send(JSON.stringify({ type: 'join_room', roomId: roomId.toString() }))
          }
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)

          if (data.type === 'draw') {
            setElements(prev => {
              if (prev.some(el => el.id === data.element.id)) {
                return prev
              }
              return [...prev, data.element]
            })
          } else if (data.type === 'update_draw') {
            setElements(prev =>
              prev.map(el => el.id === data.element.id ? data.element : el)
            )
          } else if (data.type === 'delete_draw') {
            setElements(prev => prev.filter(el => el.id !== data.elementId))
          } else if (data.type === 'clear_canvas') {
            setElements([])
          } else if (data.type === 'chat') {
            setMessages(prev => [...prev, data])
          }
        }

        ws.onclose = () => {
          console.log("WebSocket disconnected")
          setIsConnected(false)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          toast.error("Connection error")
        }

        wsRef.current = ws
      } catch (error) {
        console.error("Failed to get token or connect WS:", error)
        toast.error("Failed to connect to drawing server")
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        if (roomId) {
          wsRef.current.send(JSON.stringify({ type: 'leave_room', roomId: roomId.toString() }))
        }
        wsRef.current.close()
      }
    }
  }, [roomId])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all elements
    elements.forEach(element => {
      ctx.strokeStyle = element.strokeColor
      ctx.fillStyle = element.fillColor || 'transparent'
      ctx.lineWidth = element.strokeWidth
      ctx.globalAlpha = element.opacity

      if (element.type === 'rectangle' && element.width && element.height) {
        ctx.beginPath()
        ctx.rect(element.x, element.y, element.width, element.height)
        if (element.fillColor) ctx.fill()
        ctx.stroke()
      } else if (element.type === 'circle' && element.radius) {
        ctx.beginPath()
        ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2)
        if (element.fillColor) ctx.fill()
        ctx.stroke()
      } else if (element.type === 'line' && element.width && element.height) {
        ctx.beginPath()
        ctx.moveTo(element.x, element.y)
        ctx.lineTo(element.x + element.width, element.y + element.height)
        ctx.stroke()
      } else if (element.type === 'pencil' && Array.isArray(element.path) && element.path.length > 0) {
        ctx.beginPath()
        element.path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      } else if (element.type === 'text' && element.text) {
        ctx.font = '16px Inter, sans-serif'
        ctx.fillStyle = element.strokeColor
        ctx.fillText(element.text, element.x, element.y)
      }
    })

    // Draw current element being drawn
    if (currentElement) {
      const element = currentElement
      ctx.strokeStyle = element.strokeColor || strokeColor
      ctx.fillStyle = element.fillColor || 'transparent'
      ctx.lineWidth = element.strokeWidth || strokeWidth
      ctx.globalAlpha = element.opacity || 1

      if (element.type === 'rectangle' && element.width && element.height) {
        ctx.beginPath()
        ctx.rect(element.x!, element.y!, element.width, element.height)
        if (element.fillColor) ctx.fill()
        ctx.stroke()
      } else if (element.type === 'circle' && element.radius) {
        ctx.beginPath()
        ctx.arc(element.x!, element.y!, element.radius, 0, Math.PI * 2)
        if (element.fillColor) ctx.fill()
        ctx.stroke()
      } else if (element.type === 'line' && element.width && element.height) {
        ctx.beginPath()
        ctx.moveTo(element.x!, element.y!)
        ctx.lineTo(element.x! + element.width, element.y! + element.height)
        ctx.stroke()
      } else if (element.type === 'pencil' && element.path) {
        ctx.beginPath()
        element.path.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      }
    }

    ctx.globalAlpha = 1
  }, [elements, currentElement, strokeColor, strokeWidth])

  const sendDrawing = (element: DrawingElement) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'draw',
        roomId: roomId?.toString(),
        element
      }))
    }
  }

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'select') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)

    if (currentTool === 'pencil') {
      setCurrentElement({
        type: 'pencil',
        x,
        y,
        path: [{ x, y }],
        strokeColor,
        fillColor: undefined,
        strokeWidth,
        opacity: 1
      })
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        const element: DrawingElement = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
          type: 'text',
          x,
          y,
          text,
          strokeColor,
          fillColor: undefined,
          strokeWidth,
          opacity: 1
        }
        setElements(prev => [...prev, element])
        sendDrawing(element)
      }
      setIsDrawing(false)
    } else {
      setCurrentElement({
        type: currentTool,
        x,
        y,
        strokeColor,
        fillColor: fillColor === 'transparent' ? undefined : fillColor,
        strokeWidth,
        opacity: 1
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === 'pencil' && currentElement.path) {
      setCurrentElement({
        ...currentElement,
        path: [...currentElement.path, { x, y }]
      })
    } else if (currentTool === 'rectangle') {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x!,
        height: y - currentElement.y!
      })
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(x - currentElement.x!, 2) + Math.pow(y - currentElement.y!, 2)
      )
      setCurrentElement({
        ...currentElement,
        radius
      })
    } else if (currentTool === 'line') {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x!,
        height: y - currentElement.y!
      })
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentElement && currentTool !== 'text') {
      const element = currentElement as DrawingElement
      element.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36)

      setElements(prev => [...prev, element])
      sendDrawing(element)
    }
    setIsDrawing(false)
    setCurrentElement(null)
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      roomId: roomId?.toString(),
      message: messageInput
    }))

    setMessageInput('')
  }

  const clearCanvas = () => {
    if (window.confirm('Clear all drawings?')) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'clear_canvas',
          roomId: roomId?.toString()
        }))
      }
    }
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${roomSlug}-drawing.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const tools = [
    { type: 'pencil' as ToolType, icon: Pencil, label: 'Pencil' },
    { type: 'rectangle' as ToolType, icon: Square, label: 'Rectangle' },
    { type: 'circle' as ToolType, icon: Circle, label: 'Circle' },
    { type: 'line' as ToolType, icon: Minus, label: 'Line' },
    { type: 'text' as ToolType, icon: Type, label: 'Text' }
  ]

  // Show loading if room not loaded
  if (!roomId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-medium">{roomSlug}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{userCount} online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="relative p-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {messages.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {messages.length}
                </div>
              )}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard")
              }}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={downloadCanvas}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-24 left-6 z-10 bg-black/50 backdrop-blur-md border border-white/10 p-3 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setCurrentTool(tool.type)}
            className={`w-12 h-12 flex items-center justify-center transition-all ${currentTool === tool.type
              ? 'bg-white text-black'
              : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}

        <div className="border-t border-white/10 pt-2 mt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neutral-500" />
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                title="Stroke color"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-white/20 rounded" />
              <input
                type="color"
                value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                title="Fill color"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Width</label>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <canvas
          ref={canvasRef}
          width={1600}
          height={900}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border border-white/20 bg-white cursor-crosshair shadow-2xl"
        />
      </div>

      {/* Chat Panel */}
      {chatOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          className="fixed top-0 right-0 w-96 h-[100dvh] bg-black/90 backdrop-blur-md border-l border-white/10 z-20 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-medium">Chat</h2>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-neutral-500 mt-10">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-neutral-400 mb-1">
                    {msg.user?.username || 'User'}
                  </p>
                  <p className="text-white">{msg.message}</p>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}