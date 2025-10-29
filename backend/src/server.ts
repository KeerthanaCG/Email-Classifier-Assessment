import app from './app';
import env from './config';
app.listen(env.PORT, () => {
    console.log(`Backend running at http://localhost:${env.PORT}`);
});


