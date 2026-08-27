import { connectRabbitMQ, getChannel, QUEUE_NAME } from '../../config/rabbitmq.js';
import { resend } from '../../config/resend.js';
import logger from '../../config/logger.js';

const MAX_RETRIES = 3;

export const startBulkEmailWorker = async () => {
  try {
    await connectRabbitMQ();
    const channel = getChannel();

    logger.info('Bulk email worker started, consuming from queue...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const retries = msg.properties.headers?.['x-retries'] || 0;
      const content = msg.content.toString();

      try {
        const { to, name, subject, html } = JSON.parse(content);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: [to],
          subject,
          html,
        });

        logger.info(`Email sent to ${to}`);
        channel.ack(msg);
      } catch (err) {
        logger.error(`Failed to send email to ${to}`, { error: err.message });

        if (retries < MAX_RETRIES) {
          logger.info(`Retrying email to ${to} (attempt ${retries + 1}/${MAX_RETRIES})`);
          channel.sendToQueue(QUEUE_NAME, Buffer.from(content), {
            persistent: true,
            headers: { 'x-retries': retries + 1 },
          });
          channel.ack(msg);
        } else {
          logger.error(`Email to ${to} failed after ${MAX_RETRIES} retries, discarding`);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (err) {
    logger.error('Bulk email worker failed to start', { error: err.message });
  }
};
