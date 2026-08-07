import * as orderService from "./order.service.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders(req.userId);

    if (orders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No orders found.",
        orders: [],
      });
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get orders.",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const orderItem = await orderService.getOrderById(id, req.userId);
    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order: orderItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get order.",
    });
  }
};
