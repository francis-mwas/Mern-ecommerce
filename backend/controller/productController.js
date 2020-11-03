import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";




// @description Fetch all products
// @route GET /api/products
// @access public
const getProducts = asyncHandler(async(req, res) => { 
    const products = await Product.find({});
    res.json(products)
})


// @description Fetch a single product
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => { 
     const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(products);
})

export { getProducts, getProductById }
