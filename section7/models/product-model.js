const fs = require("fs");
const path = require("path");

const filepath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(filepath, (err, data) => {
    let products = [];
    if (err) {
      console.log(err);
      return callback(products);
    }
    products = JSON.parse(data);
    return callback(products);
  });
};

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filepath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
}

module.exports = Product;
