import app from './app';
import { SocketService } from './services/socket.service';

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
SocketService.initialize(server);