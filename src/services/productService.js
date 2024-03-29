const { Factory } = require("../daos/mainDao");
const { errorLogger } = require("../helpers/logger");
const DaoFactory = new Factory();
const Products = DaoFactory.createDao("Products");

const getProducts = async (category) => {
  const products = await Products.getAll(category);
  const productsData = [];
  products.forEach((prod) => {
    if (prod.stock > 0) {
      productsData.push({
        id: prod._id.valueOf(),
        title: prod.title,
        price: prod.price,
        thumbnail: prod.thumbnail,
      });
    }
  });
  return productsData;
};

const getProduct = async (id) => {
  const product = await Products.getById(id);
  const productData = {
    id: product._id.valueOf(),
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    stock: product.stock,
    description: product.description,
    category: product.category,
    code: product.code,
  };
  return productData;
};

const prodToCart = async (id) => {
  const product = await Products.getById(id);
  return {
    id: product._id.valueOf(),
    title: product.title,
    price: product.price,
    stock: product.stock,
  };
};

const createProduct = async (prod) => {
  prod.price = parseInt(prod.price);
  prod.stock = parseInt(prod.stock);
  const id = await Products.save(prod);
  return id;
};

const updateProduct = async (id, data) => {
  data.price = parseInt(data.price);
  data.stock = parseInt(data.stock);
  await Products.updateById(id, data);
};

const updateStock = async (id, data) => {
  await Products.updateById(id, data);
};

const deleteProduct = async (id) => {
  await Products.deleteById(id);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  prodToCart,
  updateStock,
};
