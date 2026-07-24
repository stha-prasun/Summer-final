import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Summer Final API',
      version: '1.0.0',
      description: 'Backend API for Summer Final project',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 8000}` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/modules/*/*.routes.js'],
};

export default swaggerJsdoc(options);
