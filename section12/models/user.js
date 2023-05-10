const mongodb = require("mongodb");

const { getDb } = require("../util/database");

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const existingCartProductIndex = this.cart.items.findIndex((cartItem) => {
      return product._id.toString() === cartItem.productId.toString();
    });
    const productAlreadyExists = existingCartProductIndex !== -1;

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (productAlreadyExists) {
      newQuantity = this.cart.items[existingCartProductIndex].quantity + 1;
      updatedCartItems[existingCartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();

    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  getCartProducts() {
    const db = getDb();
    const cartProductIds = this.cart.items.map(
      (cartItem) => cartItem.productId
    );
    return db
      .collection("products")
      .find({
        _id: { $in: cartProductIds },
      })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          const quantity = this.cart.items.find((cartItem) => {
            return cartItem.productId.toString() === product._id.toString();
          }).quantity;
          return {
            ...product,
            quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCatItems = this.cart.items.filter((cartItem) => {
      return cartItem.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCatItems } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
