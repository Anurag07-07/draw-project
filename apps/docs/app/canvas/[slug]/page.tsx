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
  Share2,
  Hand,
  MousePointer2,
  Eraser
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

type ToolType = 'rectangle' | 'circle' | 'line' | 'pencil' | 'text' | 'select' | 'hand' | 'eraser'

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

  // Infinite Canvas State
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Selection & Moving State
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)

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

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load room data and existing drawings
  useEffect(() => {
    const loadRoomData = async () => {
      try {
        const roomResponse = await api.get(`/api/v1/room/${roomSlug}`)
        const room = roomResponse.data.room

        if (!room) {
          toast.error("Room not found")
          return
        }

        setRoomId(room.id)

        try {
          const drawingsResponse = await api.get(`/api/v1/rooms/${room.id}/drawings`)
          setElements(drawingsResponse.data.drawings || [])
        } catch (err) {
          console.log("No existing drawings")
        }

      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Please login to join the room")
          router.push(`/signin?redirect=/canvas/${roomSlug}`)
        } else {
          toast.error("Failed to load room")
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
        const token = localStorage.getItem('token');
        if (!token) return

        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`)

        ws.onopen = () => {
          setIsConnected(true)
          if (roomId) {
            ws.send(JSON.stringify({ type: 'join_room', roomId: roomId.toString() }))
          }
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)

          if (data.type === 'draw') {
            setElements(prev => {
              if (prev.some(el => el.id === data.element.id)) return prev
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

        ws.onclose = () => setIsConnected(false)
        wsRef.current = ws
      } catch (error) {
        console.error("WS Error:", error)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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

    ctx.save()
    // Apply Camera Transformations
    ctx.translate(cameraOffset.x, cameraOffset.y)
    ctx.scale(zoom, zoom)

    // Draw all elements
    elements.forEach(element => {
      drawElement(ctx, element)
    })

    // Draw current element being drawn
    if (currentElement) {
      drawElement(ctx, currentElement as DrawingElement)
    }

    // Highlight selected element
    if (selectedElement) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2 / zoom
      const padding = 4 / zoom

      const bounds = getElementBounds(selectedElement)
      if (bounds) {
        ctx.strokeRect(
          bounds.x - padding,
          bounds.y - padding,
          bounds.width + padding * 2,
          bounds.height + padding * 2
        )

        // Draw handles
        const handleSize = 8 / zoom
        ctx.fillStyle = '#3b82f6'

        // TL
        ctx.fillRect(bounds.x - padding - handleSize / 2, bounds.y - padding - handleSize / 2, handleSize, handleSize)
        // TR
        ctx.fillRect(bounds.x + bounds.width + padding - handleSize / 2, bounds.y - padding - handleSize / 2, handleSize, handleSize)
        // BL
        ctx.fillRect(bounds.x - padding - handleSize / 2, bounds.y + bounds.height + padding - handleSize / 2, handleSize, handleSize)
        // BR
        ctx.fillRect(bounds.x + bounds.width + padding - handleSize / 2, bounds.y + bounds.height + padding - handleSize / 2, handleSize, handleSize)
      }
    }

    ctx.restore()

  }, [elements, currentElement, cameraOffset, zoom, selectedElement, windowSize])

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.strokeColor
    ctx.fillStyle = element.fillColor || 'transparent'
    ctx.lineWidth = element.strokeWidth
    ctx.globalAlpha = element.opacity

    ctx.beginPath()
    if (element.type === 'rectangle' && element.width && element.height) {
      ctx.rect(element.x, element.y, element.width, element.height)
      if (element.fillColor) ctx.fill()
      ctx.stroke()
    } else if (element.type === 'circle' && element.radius) {
      ctx.arc(element.x, element.y, element.radius, 0, Math.PI * 2)
      if (element.fillColor) ctx.fill()
      ctx.stroke()
    } else if (element.type === 'line' && element.width && element.height) {
      ctx.moveTo(element.x, element.y)
      ctx.lineTo(element.x + element.width, element.y + element.height)
      ctx.stroke()
    } else if (element.type === 'pencil' && Array.isArray(element.path)) {
      element.path.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    } else if (element.type === 'text' && element.text) {
      ctx.font = '16px Inter, sans-serif'
      ctx.fillStyle = element.strokeColor
      ctx.fillText(element.text, element.x, element.y)
    }
  }

  const getElementBounds = (element: DrawingElement) => {
    if (element.type === 'rectangle' || element.type === 'line') {
      return { x: element.x, y: element.y, width: element.width || 0, height: element.height || 0 }
    } else if (element.type === 'circle') {
      return {
        x: element.x - (element.radius || 0),
        y: element.y - (element.radius || 0),
        width: (element.radius || 0) * 2,
        height: (element.radius || 0) * 2
      }
    } else if (element.type === 'pencil' && element.path) {
      const xs = element.path.map(p => p.x)
      const ys = element.path.map(p => p.y)
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      }
    } else if (element.type === 'text') {
      return { x: element.x, y: element.y - 16, width: (element.text?.length || 0) * 10, height: 20 }
    }
    return null
  }

  const isPointInElement = (x: number, y: number, element: DrawingElement) => {
    const bounds = getElementBounds(element)
    if (!bounds) return false
    return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height
  }

  const getResizeHandleAtPoint = (x: number, y: number, element: DrawingElement) => {
    const bounds = getElementBounds(element)
    if (!bounds) return null

    const padding = 4 / zoom
    const handleSize = 8 / zoom
    const threshold = handleSize

    const handles = [
      { type: 'tl', x: bounds.x - padding, y: bounds.y - padding },
      { type: 'tr', x: bounds.x + bounds.width + padding, y: bounds.y - padding },
      { type: 'bl', x: bounds.x - padding, y: bounds.y + bounds.height + padding },
      { type: 'br', x: bounds.x + bounds.width + padding, y: bounds.y + bounds.height + padding }
    ]

    return handles.find(h => Math.abs(x - h.x) < threshold && Math.abs(y - h.y) < threshold)?.type || null
  }

  const sendDrawing = (element: DrawingElement, type: 'draw' | 'update_draw' = 'draw') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type,
        roomId: roomId?.toString(),
        element
      }))
    }
  }

  // Coordinate conversion
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0, screenX: 0, screenY: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : (e as React.MouseEvent).clientY

    return {
      x: (clientX - rect.left - cameraOffset.x) / zoom,
      y: (clientY - rect.top - cameraOffset.y) / zoom,
      screenX: clientX,
      screenY: clientY
    }
  }

  // Input Handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y, screenX, screenY } = getCanvasCoordinates(e)

    if (currentTool === 'hand') {
      setIsPanning(true)
      setPanStart({ x: screenX, y: screenY })
      return
    }

    if (currentTool === 'select') {
      // Check for resize handles first
      if (selectedElement) {
        const handle = getResizeHandleAtPoint(x, y, selectedElement)
        if (handle) {
          setResizeHandle(handle)
          setIsResizing(true)
          setDragStart({ x, y })
          return
        }
      }

      const clickedElement = [...elements].reverse().find(el => isPointInElement(x, y, el))
      if (clickedElement) {
        setSelectedElement(clickedElement)
        setIsDragging(true)
        setDragStart({ x, y })
      } else {
        setSelectedElement(null)
      }
      return
    }

    if (currentTool === 'eraser') {
      const clickedElement = [...elements].reverse().find(el => isPointInElement(x, y, el))
      if (clickedElement) {
        setElements(prev => prev.filter(el => el.id !== clickedElement.id))
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'delete_draw',
            roomId: roomId?.toString(),
            elementId: clickedElement.id
          }))
        }
      }
      return
    }

    setIsDrawing(true)

    if (currentTool === 'pencil') {
      setCurrentElement({
        type: 'pencil', x, y, path: [{ x, y }], strokeColor, strokeWidth, opacity: 1
      })
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:')
      if (text) {
        const element: DrawingElement = {
          id: crypto.randomUUID(), type: 'text', x, y, text, strokeColor, strokeWidth, opacity: 1
        }
        setElements(prev => [...prev, element])
        sendDrawing(element)
      }
      setIsDrawing(false)
    } else {
      setCurrentElement({
        type: currentTool, x, y, strokeColor, fillColor: fillColor === 'transparent' ? undefined : fillColor, strokeWidth, opacity: 1
      })
    }
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y, screenX, screenY } = getCanvasCoordinates(e)

    if (isPanning) {
      const dx = screenX - panStart.x
      const dy = screenY - panStart.y
      setCameraOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }))
      setPanStart({ x: screenX, y: screenY })
      return
    }

    if (isResizing && selectedElement) {
      const dx = x - dragStart.x
      const dy = y - dragStart.y

      const updatedElement = { ...selectedElement }

      if (resizeHandle === 'br') {
        if (updatedElement.type === 'rectangle' || updatedElement.type === 'line') {
          updatedElement.width = (updatedElement.width || 0) + dx
          updatedElement.height = (updatedElement.height || 0) + dy
        } else if (updatedElement.type === 'circle') {
          updatedElement.radius = (updatedElement.radius || 0) + dx
        }
      } else if (resizeHandle === 'tl') {
        if (updatedElement.type === 'rectangle' || updatedElement.type === 'line') {
          updatedElement.x += dx
          updatedElement.y += dy
          updatedElement.width = (updatedElement.width || 0) - dx
          updatedElement.height = (updatedElement.height || 0) - dy
        }
      } else if (resizeHandle === 'tr') {
        if (updatedElement.type === 'rectangle' || updatedElement.type === 'line') {
          updatedElement.y += dy
          updatedElement.width = (updatedElement.width || 0) + dx
          updatedElement.height = (updatedElement.height || 0) - dy
        }
      } else if (resizeHandle === 'bl') {
        if (updatedElement.type === 'rectangle' || updatedElement.type === 'line') {
          updatedElement.x += dx
          updatedElement.width = (updatedElement.width || 0) - dx
          updatedElement.height = (updatedElement.height || 0) + dy
        }
      }

      setElements(prev => prev.map(el => el.id === updatedElement.id ? updatedElement : el))
      setSelectedElement(updatedElement)
      setDragStart({ x, y })
      return
    }

    if (isDragging && selectedElement) {
      const dx = x - dragStart.x
      const dy = y - dragStart.y

      const updatedElement = { ...selectedElement }
      updatedElement.x += dx
      updatedElement.y += dy

      if (updatedElement.path) {
        updatedElement.path = updatedElement.path.map(p => ({ x: p.x + dx, y: p.y + dy }))
      }

      setElements(prev => prev.map(el => el.id === updatedElement.id ? updatedElement : el))
      setSelectedElement(updatedElement)
      setDragStart({ x, y })
      return
    }

    if (!isDrawing || !currentElement) return

    if (currentTool === 'pencil' && currentElement.path) {
      setCurrentElement({ ...currentElement, path: [...currentElement.path, { x, y }] })
    } else if (currentTool === 'rectangle' || currentTool === 'line') {
      setCurrentElement({ ...currentElement, width: x - currentElement.x!, height: y - currentElement.y! })
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - currentElement.x!, 2) + Math.pow(y - currentElement.y!, 2))
      setCurrentElement({ ...currentElement, radius })
    }
  }

  const handleEnd = () => {
    if (isPanning) setIsPanning(false)

    if (isResizing && selectedElement) {
      setIsResizing(false)
      setResizeHandle(null)
      sendDrawing(selectedElement, 'update_draw')
    }

    if (isDragging && selectedElement) {
      setIsDragging(false)
      sendDrawing(selectedElement, 'update_draw')
    }

    if (isDrawing && currentElement && currentTool !== 'text') {
      const element = currentElement as DrawingElement
      element.id = crypto.randomUUID()
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
    { type: 'select' as ToolType, icon: MousePointer2, label: 'Select' },
    { type: 'hand' as ToolType, icon: Hand, label: 'Pan' },
    { type: 'pencil' as ToolType, icon: Pencil, label: 'Pencil' },
    { type: 'rectangle' as ToolType, icon: Square, label: 'Rectangle' },
    { type: 'circle' as ToolType, icon: Circle, label: 'Circle' },
    { type: 'line' as ToolType, icon: Minus, label: 'Line' },
    { type: 'text' as ToolType, icon: Type, label: 'Text' },
    { type: 'eraser' as ToolType, icon: Eraser, label: 'Eraser' }
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
    <div className="relative h-screen w-full bg-neutral-950 text-white overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium">{roomSlug}</h1>
          <div className="flex gap-4 text-xs text-neutral-400">
            <span className={isConnected ? 'text-emerald-400' : 'text-red-400'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
            <span>{userCount} online</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(window.location.href)
              toast.success("Link copied to clipboard!")
            }
          }} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => setChatOpen(true)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors" title="Chat">
            <MessageSquare className="w-5 h-5" />
          </button>
          <div className="w-px h-10 bg-white/10 mx-2" />
          <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 bg-white/5 rounded">-</button>
          <span className="p-2 text-sm flex items-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="p-2 bg-white/5 rounded">+</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-24 left-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-xl space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setCurrentTool(tool.type)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${currentTool === tool.type ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-neutral-400'}`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
        <div className="h-px bg-white/10 my-2" />
        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className="absolute inset-0 cursor-crosshair touch-none"
      />

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