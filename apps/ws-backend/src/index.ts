import { prisma } from '@repo/db/db';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WebSocket from 'ws';
dotenv.config();

interface JwtPayload {
  _id: string;
}

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded !== 'object' || !decoded) return null;

    const payload = decoded as JwtPayload;
    return payload._id;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async (socket, request) => {
  try {
    const url = request.url;
    if (!url) throw new Error(`URL is not defined`);

    const searchparams = new URLSearchParams(url.split("?")[1]);
    const token = searchparams.get("token") || "";
    const userId = checkUser(token);

    if (!userId) {
      socket.close();
      return;
    }

    // store connected user
    users.push({
      userId,
      rooms: [],
      ws: socket
    });

    console.log(`User connected: ${userId}`);

    // HANDLE INCOMING MESSAGES ---------------------------------
    socket.on("message", async (data) => {
      try {
        let parseData;
        try {
          parseData = JSON.parse(data.toString());
        } catch (err) {
          console.error("Invalid JSON:", err);
          return;
        }

        const user = users.find(u => u.ws === socket);
        if (!user) return;

        // JOIN ROOM -------------------------------------------
        if (parseData.type === "join_room") {
          try {
            user.rooms.push(parseData.roomId);
          } catch (err) {
            console.error("Error joining room:", err);
          }
        }

        // LEAVE ROOM -------------------------------------------
        if (parseData.type === "leave_room") {
          try {
            user.rooms = user.rooms.filter(r => r !== parseData.roomId);
          } catch (err) {
            console.error("Error leaving room:", err);
          }
        }

        // CHAT -------------------------------------------------
        if (parseData.type === "chat") {
          const roomId = parseData.roomId;
          const message = parseData.message;

          // Send to all in same room
          users.forEach((u) => {
            try {
              if (u.rooms.includes(roomId)) {
                u.ws.send(JSON.stringify({
                  type: "chat",
                  message,
                  roomId
                }));
              }
            } catch (sendErr) {
              console.error("Error sending WS message:", sendErr);
            }
          });

          // Store chat in DB
          try {
            await prisma.chat.create({
              data: {
                roomId: roomId,
                userId: userId,
                message: message
              }
            });
          } catch (dbErr) {
            console.error("DB Chat save error:", dbErr);
          }
        }

        // DRAW -------------------------------------------------
        if (parseData.type === "draw") {
          const { roomId, element } = parseData;

          try {
            // Save drawing element to database
            const savedElement = await prisma.drawingElement.create({
              data: {
                id: element.id,
                roomId: parseInt(roomId),
                userId: userId,
                type: element.type,
                x: element.x,
                y: element.y,
                width: element.width,
                height: element.height,
                radius: element.radius,
                path: element.path ? JSON.stringify(element.path) : null,
                text: element.text,
                strokeColor: element.strokeColor || "#000000",
                fillColor: element.fillColor,
                strokeWidth: element.strokeWidth || 2,
                opacity: element.opacity || 1
              }
            });

            // Broadcast to all users in the room
            users.forEach((u) => {
              try {
                if (u.rooms.includes(roomId)) {
                  u.ws.send(JSON.stringify({
                    type: "draw",
                    element: {
                      ...savedElement,
                      path: savedElement.path ? JSON.parse(savedElement.path) : null
                    },
                    roomId
                  }));
                }
              } catch (sendErr) {
                console.error("Error broadcasting draw:", sendErr);
              }
            });
          } catch (dbErr) {
            console.error("DB Draw save error:", dbErr);
          }
        }

        // UPDATE DRAWING ELEMENT ---------------------------------
        if (parseData.type === "update_draw") {
          const { roomId, elementId, updates } = parseData;

          try {
            const updatedElement = await prisma.drawingElement.update({
              where: { id: elementId },
              data: {
                ...updates,
                path: updates.path ? JSON.stringify(updates.path) : undefined
              }
            });

            // Broadcast update to all users in the room
            users.forEach((u) => {
              try {
                if (u.rooms.includes(roomId)) {
                  u.ws.send(JSON.stringify({
                    type: "update_draw",
                    element: {
                      ...updatedElement,
                      path: updatedElement.path ? JSON.parse(updatedElement.path) : null
                    },
                    roomId
                  }));
                }
              } catch (sendErr) {
                console.error("Error broadcasting update:", sendErr);
              }
            });
          } catch (dbErr) {
            console.error("DB Update error:", dbErr);
          }
        }

        // DELETE DRAWING ELEMENT ---------------------------------
        if (parseData.type === "delete_draw") {
          const { roomId, elementId } = parseData;

          try {
            await prisma.drawingElement.delete({
              where: { id: elementId }
            });

            // Broadcast deletion to all users in the room
            users.forEach((u) => {
              try {
                if (u.rooms.includes(roomId)) {
                  u.ws.send(JSON.stringify({
                    type: "delete_draw",
                    elementId,
                    roomId
                  }));
                }
              } catch (sendErr) {
                console.error("Error broadcasting delete:", sendErr);
              }
            });
          } catch (dbErr) {
            console.error("DB Delete error:", dbErr);
          }
        }

        // CLEAR ALL DRAWINGS -------------------------------------
        if (parseData.type === "clear_canvas") {
          const { roomId } = parseData;

          try {
            await prisma.drawingElement.deleteMany({
              where: { roomId: parseInt(roomId) }
            });

            // Broadcast clear to all users in the room
            users.forEach((u) => {
              try {
                if (u.rooms.includes(roomId)) {
                  u.ws.send(JSON.stringify({
                    type: "clear_canvas",
                    roomId
                  }));
                }
              } catch (sendErr) {
                console.error("Error broadcasting clear:", sendErr);
              }
            });
          } catch (dbErr) {
            console.error("DB Clear error:", dbErr);
          }
        }


      } catch (error) {
        console.error("Message handler error:", error);
      }
    });

    // CLEANUP ON DISCONNECT -------------------------------------
    socket.on("close", () => {
      try {
        const index = users.findIndex(u => u.ws === socket);
        if (index !== -1) {
          console.log(`User disconnected`);
          users.splice(index, 1);
        }
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    });

  } catch (error) {
    console.error("Connection error:", error);
    socket.close();
  }
});
