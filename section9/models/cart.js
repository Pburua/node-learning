const fs = require('fs');
const path = require('path');

const filepath = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
    static addProduct(newProductId, newProductPrice) {
        console.log('Cart addProduct');
        console.log('newProductId', newProductId);
        console.log('newProductPrice', newProductPrice);

        fs.readFile(filepath, (err, data) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) cart = JSON.parse(data);

            const existingProductIndex = cart.products.findIndex((product) => {
                return product.id === newProductId;
            });
            const existingProduct = cart.products[existingProductIndex];

            console.log('existingProductIndex', existingProductIndex);
            console.log('existingProduct', existingProduct);

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

            console.log('old cart.totalPrice', cart.totalPrice);

            cart.totalPrice = cart.totalPrice + +newProductPrice;

            console.log('new cart.totalPrice', cart.totalPrice);

            fs.writeFile(filepath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
}