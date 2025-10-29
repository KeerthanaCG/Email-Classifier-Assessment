
class SessionService {
    private sessions = new Map<string, { tokens: any; userInfo: any; createdAt: number }>();

    create(tokens: any, userInfo: any) {
        const id = require('crypto').randomBytes(24).toString('hex');
        this.sessions.set(id, { tokens, userInfo, createdAt: Date.now() });
        return id;
    }

    get(id: string) {
        return this.sessions.get(id);
    }

    delete(id: string) {
        this.sessions.delete(id);
    }

    cleanup(ttl = 24 * 60 * 60 * 1000) {
        const now = Date.now();
        for (const [k, v] of this.sessions) {
            if (now - v.createdAt > ttl) this.sessions.delete(k);
        }
    }
}

export default new SessionService();
