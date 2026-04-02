import app, { initializeApp } from './app.js';

const port = Number(process.env.PORT || 3001);

const start = async () => {
  try {
    await initializeApp();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database (e.g. Neon connection dead), but starting server anyway:', error.message);
  }
  
  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
};

start();
