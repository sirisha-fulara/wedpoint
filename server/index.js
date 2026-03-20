import app, { initializeApp } from './app.js';

const port = Number(process.env.PORT || 3001);

const start = async () => {
  try {
    await initializeApp();
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
