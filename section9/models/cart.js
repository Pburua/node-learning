const fs = require('fs');
const path = require('path');

const filepath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
    static addProduct(newProductId, newProductPrice) {

        fs.readFile(filepath, (err, data) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) cart = JSON.parse(data);

            const existingProductIndex = cart.products.findIndex((product) => {
                return product.id === newProductId;
            });
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;

            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: newProductId, quantity: 1 };
                cart.products = [ ...cart.products, updatedProduct ];
            }

            cart.totalPrice = cart.totalPrice + +newProductPrice;

            fs.writeFile(filepath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }

    static deleteProduct(productId, productPrice) {
        fs.readFile(filepath, (err, data) => {
            if (err) return;

            const cart = JSON.parse(data);

            const updatedCart = { ...cart };

            const existingProductIndex = cart.products.findIndex((product) => {
                return product.id === productId;
            });
            const existingProduct = cart.products[existingProductIndex];

            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * existingProduct.quantity;

            updatedCart.products = updatedCart.products.filter((product) => {
                return product.id !== productId;
            });

            fs.writeFile(filepath, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            })
        });
    }

    static getCart(callback) {
        fs.readFile(filepath, (err, data) => {
            if (err) return callback(null);
            callback(JSON.parse(data));
        });
    }
}