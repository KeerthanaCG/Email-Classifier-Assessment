import express from 'express';
import cors from 'cors';
import session from 'express-session';
import env from './config';
import bodyParser from "body-parser"
import authRoutes from './routes/authRoutes';
import emailRoutes from './routes/emailRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());


app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
}));

app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);


app.get('/', (_req, res) => res.send('Email Classifier Backend'));


app.use(errorHandler);

export default app;
