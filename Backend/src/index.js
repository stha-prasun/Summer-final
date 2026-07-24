import dotenv from 'dotenv';
dotenv.config();

const { app, logger } = await import('./app.js');
import connectDB from './config/database.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Swagger docs at http://localhost:${PORT}/api/docs`);
});
