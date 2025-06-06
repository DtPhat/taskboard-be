import { Router } from 'express';
import BoardsController from '../controllers/boards.controller';

const router = Router();

router.post('/', BoardsController.createBoard);
router.get('/', BoardsController.getAllBoards);
router.get('/:id', BoardsController.getBoardById);
router.put('/:id', BoardsController.updateBoard);
router.delete('/:id', BoardsController.deleteBoard);
router.post('/:boardId/invite', BoardsController.inviteMember);
router.post('/:boardId/invite/accept', BoardsController.acceptInvite);

export default router;