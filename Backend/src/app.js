import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import logger, { requestLogger } from './config/logger.js';
import checkRoutes from './routes/check.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(checkRoutes);

export { app, logger };
