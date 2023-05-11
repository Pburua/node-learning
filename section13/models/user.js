const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
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

module.exports = mongoose.model("User", userSchema);

// const { getDb } = require("../util/database");

// class User {
//   constructor(name, email, cart, _id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id ? new mongodb.ObjectId(_id) : null;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const existingCartProductIndex = this.cart.items.findIndex((cartItem) => {
//       return product._id.toString() === cartItem.productId.toString();
//     });
//     const productAlreadyExists = existingCartProductIndex !== -1;

//     let newQuantity = 1;

//     const updatedCartItems = [...this.cart.items];

//     if (productAlreadyExists) {
//       newQuantity = this.cart.items[existingCartProductIndex].quantity + 1;
//       updatedCartItems[existingCartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCartProducts()
//       .then((cartProducts) => {
//         const newOrder = {
//           items: cartProducts,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(newOrder);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   getCartProducts() {
//     const db = getDb();
//     const cartProductIds = this.cart.items.map(
//       (cartItem) => cartItem.productId
//     );
//     return db
//       .collection("products")
//       .find({
//         _id: { $in: cartProductIds },
//       })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           const quantity = this.cart.items.find((cartItem) => {
//             return cartItem.productId.toString() === product._id.toString();
//           }).quantity;
//           return {
//             ...product,
//             quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCatItems = this.cart.items.filter((cartItem) => {
//       return cartItem.productId.toString() !== productId.toString();
//     });

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCatItems } } }
//       );
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) });
//   }
// }

// module.exports = User;
