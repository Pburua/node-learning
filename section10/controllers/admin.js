const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  if (!editMode) return res.redirect('/');

  Product.findById(productId, (product) => {
    if (!product) res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode: true,
      product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(productId, title, imageUrl, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  
  Product.deleteById(productId);
  
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
