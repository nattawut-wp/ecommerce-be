import produtModel from "../models/productModel.js";
import { uploadImages } from "../utils/cloudinaryUtil.js";

// add product service
const addProductService = async (productData, images) => {
  try {
    //  upload images to cloudinary (if any)
    let imagesUrl = [];
    if (images && images.length > 0) {
      imagesUrl = await uploadImages(images);
    }

    // prepare product data (convert types)
    const newProductData = {
      ...productData,
      // convert price from string to Number
      price: Number(productData.price),
      // convert bestseller to Boolean
      bestseller:
        typeof productData.bestseller === "string"
          ? productData.bestseller === "true"
          : Boolean(productData.bestseller),
      // convert sizes from JSON string to Array (if string)
      sizes:
        typeof productData.sizes === "string"
          ? JSON.parse(productData.sizes)
          : productData.sizes,
      // use URLs from Cloudinary or original data or empty array
      image: imagesUrl.length > 0 ? imagesUrl : productData.image || [],
      // add timestamp
      date: Date.now(),
    };

    // create and save new product
    const product = new produtModel(newProductData);
    await product.save();

    return product;
  } catch (error) {
    throw error;
  }
};

// list products service
const listProductsService = async () => {
  try {
    // get all products (no filter)
    const products = await produtModel.find({});
    return products;
  } catch (error) {
    throw error;
  }
};

// get product by id service
const getProductByIdService = async (productId) => {
  try {
    // find product by id
    const product = await produtModel.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

// delete product service
const deleteProductService = async (productId) => {
  try {
    const product = await produtModel.findByIdAndDelete(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

export {
  addProductService,
  listProductsService,
  getProductByIdService,
  deleteProductService,
};
