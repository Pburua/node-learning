const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = Schema({
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true
    },
  },
  items: [
    {
      product: {
        type: {
          _id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
          title: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
        },
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
