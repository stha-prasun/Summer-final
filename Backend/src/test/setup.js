import dotenv from 'dotenv';

dotenv.config();

process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'test-jwt-secret';
