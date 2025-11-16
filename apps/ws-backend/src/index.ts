import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
const wss = new WebSocketServer({ port: 8080 });
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

wss.on('connection', (socket, request) => {
  try {
    const url = request.url;
    if (!url) {
      throw new Error(`URL is not defined`);
    }

    const searchparams = new URLSearchParams(url.split("?")[1]);
    const token = searchparams.get('token') || "";
    const userId = checkUser(token);

    if (!userId) {
      socket.close();
      return;
    }

    // store user
    users.push({
      userId,
      rooms: [],
      ws: socket
    });

    socket.on('message', (data) => {
      try {
        let parseData;
        try {
          parseData = JSON.parse(data.toString());
        } catch (err) {
          console.error("Invalid JSON:", err);
          return;
        }

        const user = users.find(x => x.ws === socket);
        if (!user) return;

        // JOIN ROOM ------------------------------------------------
        if (parseData.type === 'join_room') {
          try {
            user.rooms.push(parseData.roomId);
          } catch (err) {
            console.error("Error joining room:", err);
          }
        }

        // LEAVE ROOM -----------------------------------------------
        if (parseData.type === 'leave_room') {
          try {
            user.rooms = user.rooms.filter(r => r !== parseData.roomId);
          } catch (err) {
            console.error("Error leaving room:", err);
          }
        }

        // CHAT MESSAGE ---------------------------------------------
        if (parseData.type === 'chat') {
          try {
            const roomId = parseData.roomId;
            const message = parseData.message;

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

          } catch (err) {
            console.error("Chat handling error:", err);
          }
        }

      } catch (error) {
        console.error("Message handler error:", error);
      }
    });
  } catch (error) {
    console.error("Connection error:", error);
    socket.close();
  }
});
