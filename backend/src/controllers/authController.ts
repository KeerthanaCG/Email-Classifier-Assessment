


import { Request, Response, NextFunction } from "express";
import { createOAuthClient } from "../services/googleService";
import sessionService from "../services/sessionService";
import env from "../config";
import { google } from "googleapis";

export const redirectToGoogle = (_req: Request, res: Response) => {
    const oauth2Client = createOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt: "consent",
    });
    res.redirect(url);
};

export const handleCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const code = req.query.code as string | undefined;
    if (!code) return res.redirect(`${env.FRONTEND_URL}/?error=no_code`);

    try {
        const oauth2Client = createOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);


        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client as any });
        const userInfo = (await oauth2.userinfo.get()).data;

        const sessionId = sessionService.create(tokens, userInfo);
        sessionService.cleanup();


        req.session.user = {
            name: userInfo.name ?? userInfo.given_name ?? undefined,
            email: userInfo.email ?? undefined,
            picture: userInfo.picture ?? undefined,
        };

        const encodedUser = encodeURIComponent(JSON.stringify(userInfo));
        res.redirect(`${env.FRONTEND_URL}/dashboard?sessionId=${sessionId}&user=${encodedUser}`);
    } catch (err) {
        next(err);
    }
};

export const getUser = (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not logged in" });
    }
    res.json({ success: true, user: req.session.user });
};
