import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import { authenticateJWT } from './middlewares/auth.middleware';

import authRoutes from './routes/auth.routes';
import authGitHubRoutes from './routes/auth.github.routes';
import boardsRoutes from './routes/boards.routes';
import cardsRoutes from './routes/cards.routes';
import tasksRoutes from './routes/tasks.routes';
import githubRoutes from './routes/github.routes';
import inviteRoutes from './routes/invite.routes';
import cardInviteRoutes from './routes/card-invite.routes';
import taskInviteRoutes from './routes/task-invite.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Public authentication routes
app.use('/auth', authRoutes);
app.use('/auth/github', authGitHubRoutes);

// Protected routes (require JWT)
app.use('/boards', authenticateJWT, boardsRoutes);
app.use('/boards/:boardId/cards', authenticateJWT, cardsRoutes);
app.use('/boards/:boardId/cards/:cardId/tasks', authenticateJWT, tasksRoutes);
app.use('/boards/:boardId/invite', authenticateJWT, inviteRoutes);
app.use('/boards/:boardId/cards/:cardId/invite', authenticateJWT, cardInviteRoutes);
app.use('/boards/:boardId/cards/:cardId/tasks/:taskId/invite', authenticateJWT, taskInviteRoutes);

app.use('/repositories', authenticateJWT, githubRoutes);

app.use('/user', authenticateJWT, userRoutes);

// Centralized error handler
app.use(errorMiddleware);

export default app;