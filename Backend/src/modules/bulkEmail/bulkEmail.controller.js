import * as bulkEmailService from './bulkEmail.service.js';

export const sendBulkEmail = async (req, res) => {
  try {
    const { templateType } = req.body;
    const validTemplates = ['newsletter', 'promotion', 'announcement'];

    if (!templateType || !validTemplates.includes(templateType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid template. Must be one of: ${validTemplates.join(', ')}`,
      });
    }

    const result = await bulkEmailService.sendBulkEmail({ templateType });
    return res.status(200).json({
      success: true,
      message: `${result.queued} emails queued successfully`,
      totalUsers: result.totalUsers,
      queued: result.queued,
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to queue bulk email.',
    });
  }
};
