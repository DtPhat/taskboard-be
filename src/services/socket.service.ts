import { Server } from 'socket.io';

export const SocketService = {
  io: null as Server | null,

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      const userId = socket.handshake.auth?.userId;

      if (userId) {
        // 🔐 Join personal room
        socket.join(userId);
        console.log(`User ${userId} connected and joined room ${userId}`);
      } else {
        console.warn('No userId provided in auth');
      }

      // 🔄 Join board rooms
      socket.on('join-board', (boardId) => {
        socket.join(`board-${boardId}`);
        console.log(`User ${userId} joined board-${boardId}`);
      });

      socket.on('leave-board', (boardId) => {
        socket.leave(`board-${boardId}`);
        console.log(`User ${userId} left board-${boardId}`);
      });

      socket.on('disconnect', () => {
        console.log(`User ${userId || socket.id} disconnected`);
      });
    });
  },

  emitBoardInvitation(boardId: string, userId: string, inviteData: any) {
    if (this.io) {
      // 🔔 Emit to user's private room
      this.io.to(userId).emit('board-invitation', {
        ...inviteData,
        boardId,
        userId,
      });
    }
  },

  emitBoardJoin(boardId: string, userId: string, userData: any) {
    if (this.io) {
      this.io.to(`board-${boardId}`).emit('board-join', {
        boardId,
        userId,
        userData,
      });
    }
  },
};
