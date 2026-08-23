import { User } from '../user/user.model.js';
import { getChannel, QUEUE_NAME } from '../../config/rabbitmq.js';
import { getTemplate } from './templates.js';
import logger from '../../config/logger.js';

export const sendBulkEmail = async ({ templateType }) => {
  const template = getTemplate(templateType);
  if (!template) {
    throw new Error(`Invalid template type: ${templateType}`);
  }

  const users = await User.find({ email: { $exists: true, $ne: null } })
    .select('email name')
    .lean();

  if (users.length === 0) {
    throw new Error('No registered users found');
  }

  const channel = getChannel();
  let queued = 0;

  for (const user of users) {
    const message = {
      to: user.email,
      name: user.name || 'Customer',
      subject: template.subject,
      html: template.html(user.name || 'Customer'),
    };

    const sent = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    if (sent) queued++;
  }

  logger.info(`Bulk email queued: ${queued}/${users.length} emails`, { templateType });

  return { totalUsers: users.length, queued };
};
