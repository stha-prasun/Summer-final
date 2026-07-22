import dotenv from 'dotenv';
import { app, logger } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
