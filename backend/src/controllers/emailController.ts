import { Request, Response } from 'express';
import { google } from 'googleapis';
import sessionService from '../services/sessionService';

function decodeBase64Url(input: string) {
    try {
        return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    } catch {
        return '';
    }
}

function extractFromPayload(payload: any) {
    let body = '';
    let html = '';
    const recurse = (part: any) => {
        if (!part) return;
        if (part.mimeType === 'text/plain' && part.body?.data) body += decodeBase64Url(part.body.data);
        if (part.mimeType === 'text/html' && part.body?.data) html += decodeBase64Url(part.body.data);
        if (part.parts) part.parts.forEach(recurse);
    };
    recurse(payload);
    return { body, html };
}

export const fetchEmails = async (req: Request, res: Response) => {
    try {
        const { sessionId, maxResults = 15 } = req.body;
        if (!sessionId) return res.status(400).json({ success: false, error: 'Missing sessionId' });

        const s = sessionService.get(sessionId);
        if (!s) return res.status(401).json({ success: false, error: 'Invalid session' });

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials(s.tokens);
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const list = await gmail.users.messages.list({
            userId: 'me',
            maxResults: parseInt(String(maxResults)),
            q: 'in:inbox'
        } as any);

        const msgs = list.data.messages || [];
        const emails: any[] = [];

        for (const msg of msgs) {
            try {
                const data = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id!,
                    format: 'full'
                } as any);

                const headers = data.data.payload?.headers || [];
                const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
                const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
                const date = headers.find((h: any) => h.name === 'Date')?.value || '';
                const snippet = data.data.snippet || '';
                const { body, html } = extractFromPayload(data.data.payload);

                emails.push({
                    id: data.data.id || msg.id,
                    subject,
                    from,
                    date,
                    snippet,
                    body: html || body,
                    isHtml: !!html
                });
            } catch (err) {
                console.error('Error fetching single message', err);
            }
        }

        res.json({ success: true, emails });
    } catch (err) {
        console.error('fetchEmails error', err);
        res.status(500).json({ success: false, error: 'Failed to fetch emails' });
    }
};
