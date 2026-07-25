import dotenv from 'dotenv';
dotenv.config();

const { app, logger } = await import('./app.js');
import connectDB from './config/database.js';
import redis from './config/redis.js';

const PORT = process.env.PORT || 8000;

connectDB().then(async () => {
  try {
    await redis.ping();
    logger.info('Redis Connected');
  } catch (error) {
    logger.error('Redis connection failed', { error: error.message });
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Swagger docs at http://localhost:${PORT}/api/docs`);
  });
});
