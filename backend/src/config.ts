import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5001/auth/google/callback',
    SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret'
};
