const { errorLogger } = require('../helpers/logger');
const Carts = require('../models/cartSchema');
const { getById } = require('./productsDao');

//CREA UN CARRITO Y DEVUELVE SU ID
const newCart = async (userId) => {
  try {
    const newCart = await Carts.create({
      userId,
      timestamp: new Date().toLocaleString(),
    });
    return newCart._id;
  } catch (e) {
    errorLogger(e);
  }
};

const getCartById = async (cartId) => {
  try {
    return await Carts.findById(cartId);
  } catch (e) {
    errorLogger(e);
  }
};

const deleteCartById = async (cartId) => {
  try {
    return await Carts.findByIdAndDelete(cartId);
  } catch (e) {
    errorLogger(e);
  }
};

const addProdToCart = async (cartId, prodId) => {
  try {
    const prod = await getById(prodId);
    return await Carts.findByIdAndUpdate(cartId, {
      $addToSet: { products: prod },
    });
  } catch (e) {
    errorLogger(e);
  }
};

const deleteProdFromCart = async (cartId, prodId) => {
  try {
    const prod = await getById(prodId);
    return await Carts.findByIdAndUpdate(cartId, { $pull: { products: prod } });
  } catch (e) {
    errorLogger(e);
  }
};

module.exports = {
  newCart,
  getCartById,
  deleteCartById,
  addProdToCart,
  deleteProdFromCart,
};