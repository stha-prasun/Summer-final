import * as productService from './product.service.js';

export const addProduct = async (req, res) => {
  try {
    const { name, series, year, price, category } = req.body;

    if (!name || !series || !year || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, series, year, price, and category are required.',
      });
    }

    if (typeof req.body.specs === "string") {
      try { req.body.specs = JSON.parse(req.body.specs); } catch (e) {}
    }

    const product = await productService.addProduct(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to add product.',
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field is required to update.',
      });
    }

    const product = await productService.updateProduct(id, req.body, req.file);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product.',
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    await productService.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete product.',
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const products = await productService.getAllProducts(category);

    if (products.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No products found.',
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};
