const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const filepath = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = callback => {
  fs.readFile(filepath, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex((product) => {
          return product.id === this.id;
        });
        const updatedProducts = [ ...products ];
        updatedProducts[existingProductIndex] = this;

        products = updatedProducts;

      } else {
        this.id = Math.random().toString();
        products.push(this);
      }

      fs.writeFile(filepath, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static deleteById(productId) {
    getProductsFromFile(products => {
      const product = products.find((product) => {
        return product.id === productId;
      });
      const updatedProducts = products.filter((product) => {
        return product.id !== productId;
      });

      fs.writeFile(filepath, JSON.stringify(updatedProducts), err => {
        console.log(err);

        Cart.deleteProduct(productId, product.price);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(productId, callback) {
    getProductsFromFile((products) => {
      const product = products.find((product) => {
        return product.id === productId;
      });
      callback(product);
    })
  }
};
