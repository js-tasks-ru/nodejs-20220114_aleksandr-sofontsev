const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) {
    return next();
  }

  const products = await Product.find({subcategory: subcategory});
  ctx.body = {products: products.map((product) => mapProduct(product))};
};

module.exports.productList = async function productList(ctx) {
  const products = await Product.find();
  ctx.body = {products: products.map((product) => mapProduct(product))};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    return next();
  }

  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    return next();
  }

  ctx.body = {product: mapProduct(product)};
};
