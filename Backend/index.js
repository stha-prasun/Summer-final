import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger, { requestLogger } from './logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get('/check', (req, res) => {
  res.send('API Health Check');
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
