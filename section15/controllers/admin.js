const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const newProduct = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });

  newProduct
    .save()
    .then(() => {
      console.log("Product created successfully.");
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  if (!editMode) return res.redirect("/");

  Product.findById(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode: true,
        product,
      });
    })
    .catch(() => {
      console.error(err);
      res.redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const curUserId = req.user._id;

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== curUserId.toString()) {
        res.redirect("/admin/products");
        throw "Authorization error: Operation not allowed.";
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(() => {
      console.log("Product updated successfully.");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  const curUserId = req.user._id;

  Product.deleteOne({ _id: productId, userId: curUserId })
    .then((result) => {
      res.redirect("/admin/products");
      
      if (result) {
        throw "Product deletion error: Product not found for user.";
      }

      console.log("Product deleted successfully.");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
