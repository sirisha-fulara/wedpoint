import app, { initializeApp } from '../../server/app.js';

export default async function handler(req, res) {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initialize API' });
  }
}
