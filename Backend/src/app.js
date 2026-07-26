import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import logger, { requestLogger } from './config/logger.js';
import healthRoutes from './modules/health/health.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';

const app = express();

//cors
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(healthRoutes);
app.use(contactRoutes);
app.use(authRoutes);
app.use(productRoutes);

export { app, logger };
