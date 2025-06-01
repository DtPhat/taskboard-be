import { Router } from 'express';
import CardsController from '../controllers/cards.controller';

const router = Router({ mergeParams: true });

router.get('/', CardsController.getAllCards);
router.post('/', CardsController.createCard);
router.get('/:id', CardsController.getCardById);
router.put('/:id', CardsController.updateCard);
router.delete('/:id', CardsController.deleteCard);

router.get('/user/:userId', CardsController.getCardsByUser);

router.post('/:id/invite/accept', CardsController.acceptInvite);

export default router;