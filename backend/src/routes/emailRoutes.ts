import { Router } from 'express';
import { fetchEmails } from '../controllers/emailController';
import { classifyEmails } from '../controllers/classificationController';

const router = Router();

router.post('/fetch', fetchEmails);
router.post('/classify', classifyEmails);

export default router;
