import dotenv from 'dotenv';
dotenv.config();

const { app, logger } = await import('./app.js');
import http from 'http';
import connectDB from './config/database.js';
import redis from './config/redis.js';
import { initSocket } from './config/socket.js';

const { startBulkEmailWorker } = await import('./modules/bulkEmail/bulkEmail.worker.js');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
initSocket(server);

connectDB().then(async () => {
  try {
    await redis.ping();
    logger.info('Redis Connected');
  } catch (error) {
    logger.error('Redis connection failed', { error: error.message });
  }

  await startBulkEmailWorker();

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Swagger docs at http://localhost:${PORT}/api/docs`);
  });
});
