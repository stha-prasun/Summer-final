import { initiatePayment, verifyPayment } from './payment.service.js';

export const initiate = async (req, res) => {
  try {
    const { items, customer } = req.body;

    const payment = await initiatePayment({
      userId: req.userId,
      items,
      customer,
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated',
      ...payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const { pidx } = req.body;

    const result = await verifyPayment({ pidx });

    const isCompleted = result.status === 'Completed';

    res.status(200).json({
      success: isCompleted,
      message: isCompleted ? 'Payment successful' : 'Payment not completed',
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
