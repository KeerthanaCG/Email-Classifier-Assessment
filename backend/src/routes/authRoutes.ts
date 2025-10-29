import { Router } from 'express';
import { redirectToGoogle, handleCallback, getUser } from '../controllers/authController';

const router = Router();
router.get('/google', redirectToGoogle);
router.get('/google/callback', handleCallback);
router.get("/user", getUser);

export default router;
