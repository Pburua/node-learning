const mongoose = require("mongoose");
const Order = require("./order");

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((cartItem) => {
    return cartItem.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.addOrder = function () {
  return this.populate("cart.items.productId")
    .then((user) => {
      return user.cart.items;
    })
    .then((cartItems) => {
      const newOrder = new Order({
        user: { userId: this._id, email: this.email },
        items: cartItems.map((cartItem) => {
          return { product: { ...cartItem.productId}, quantity: cartItem.quantity };
        }),
      });
      return newOrder.save();
    })
    .then(() => {
      this.cart = { items: [] };
      return this.save();
    });
};

module.exports = mongoose.model("User", userSchema);
