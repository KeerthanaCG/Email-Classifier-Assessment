import 'express-session';
import { Credentials } from 'google-auth-library';

declare module 'express-session' {
  interface SessionData {
    tokens?: Credentials;
    user?: { name?: string; email?: string; picture?: string };
  }
}
