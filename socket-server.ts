
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import prisma from './lib/prisma';
import translate from 'translate';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

translate.engine = 'google';

// In-memory storage for language and users in rooms
const socketLanguages: { [socketId: string]: string } = {};
const chatRooms: { [purchaseId: string]: string[] } = {};

io.on('connection', (socket: Socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('register_language', (language: string) => {
    socketLanguages[socket.id] = language.split('-')[0]; // Store base language (e.g., 'en' from 'en-US')
    console.log(`Socket ${socket.id} registered language: ${socketLanguages[socket.id]}`);
  });

  socket.on('join_chat', (purchaseId: string) => {
    socket.join(purchaseId);
    if (!chatRooms[purchaseId]) {
      chatRooms[purchaseId] = [];
    }
    if (!chatRooms[purchaseId].includes(socket.id)) {
        chatRooms[purchaseId].push(socket.id);
    }
    console.log(`Socket ${socket.id} joined chat for purchase: ${purchaseId}`);
  });

  socket.on('send_message', async (data) => {
    const { purchaseId, senderId, content } = data;

    try {
      const senderLang = socketLanguages[socket.id] || 'en';
      let translatedContent: string | null = null;

      // Find receiver's socket ID
      const roomUsers = chatRooms[purchaseId];
      const receiverSocketId = roomUsers?.find(id => id !== socket.id);

      if (receiverSocketId) {
        const receiverLang = socketLanguages[receiverSocketId] || 'en';

        if (senderLang !== receiverLang) {
          try {
            translatedContent = await translate(content, { from: senderLang, to: receiverLang });
          } catch (e) {
            console.error("Translation failed", e);
          }
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          purchase_id: purchaseId,
          sender_id: senderId,
          content,
        },
        include: {
          sender: {
            select: {
              username: true,
              avatar_url: true,
            },
          },
        },
      });

      const broadcastMessage = {
        ...newMessage,
        translated_content: translatedContent,
      };

      io.to(purchaseId).emit('receive_message', broadcastMessage);

    } catch (error) {
      console.error('Failed to process or broadcast message', error);
    }
  });

  socket.on('close_chat', async (data) => {
    const { purchaseId, reason } = data;
    try {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { chat_status: 'CLOSED', chat_closed_reason: reason },
      });
      io.to(purchaseId).emit('chat_closed', { reason });
    } catch (error) {
      console.error('Failed to close chat', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Clean up disconnected user
    delete socketLanguages[socket.id];
    for (const purchaseId in chatRooms) {
      const index = chatRooms[purchaseId].indexOf(socket.id);
      if (index !== -1) {
        chatRooms[purchaseId].splice(index, 1);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
