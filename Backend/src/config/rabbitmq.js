import amqp from 'amqplib';
import logger from './logger.js';

const QUEUE_NAME = 'bulk-emails';
let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  try {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1);
    logger.info('RabbitMQ connected & queue asserted');
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error', { error: err.message });
    });
    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed');
    });
    return channel;
  } catch (err) {
    logger.error('RabbitMQ connection failed', { error: err.message });
    throw err;
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialised');
  return channel;
};

export { QUEUE_NAME };
