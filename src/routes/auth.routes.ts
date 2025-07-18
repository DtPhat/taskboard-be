import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/signin/verify', AuthController.verifySignin);

export default router;