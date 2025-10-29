import { Request, Response, NextFunction } from 'express';
import sessionService from '../services/sessionService';

export const requireSession = (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.headers['x-session-id'] as string || req.body.sessionId || req.query.sessionId;
    if (!sessionId) return res.status(401).json({ success: false, error: 'Missing sessionId' });

    const s = sessionService.get(sessionId);
    if (!s) return res.status(401).json({ success: false, error: 'Invalid session' });


    (req as any).gSession = s;
    next();
};
