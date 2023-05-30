const { validationResult } = require("express-validator");

const Product = require("../models/product");
const fileHelper = require("../util/file-helper");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
    hasError: false,
    errorMessage: "",
    product: {
      title: "",
      price: "",
      description: "",
    },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editMode: false,
      hasError: true,
      errorMessage:
        "Attached file does not exist or has unacceptable extension",
      product: {
        title,
        price,
        description,
      },
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editMode: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        price,
        description,
      },
      validationErrors: errors.array(),
    });

  const imageUrl = image.path;

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
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
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
        hasError: false,
        errorMessage: "",
        validationErrors: [],
        product,
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 404;
      return next(newError);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const curUserId = req.user._id;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        price,
        description,
        _id: productId,
      },
      validationErrors: errors.array(),
    });

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== curUserId.toString()) {
        res.redirect("/admin/products");
        throw "Authorization error: Operation not allowed.";
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save();
    })
    .then(() => {
      console.log("Product updated successfully.");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  const curUserId = req.user._id;

  Product.findById(productId)
    .then((product) => {
      if (!product)
        throw new Error("Product deletion error: Product not found for user.");

      fileHelper.deleteFile(product.imageUrl);

      return Product.deleteOne({ _id: productId, userId: curUserId });
    })
    .then((result) => {
      res.status(200).json({message: 'Product deleted successfully.'});

      if (!result) {
        throw new Error("Product deletion error: Product not found for user.");
      }

      console.log("Product deleted successfully.");
    })
    .catch((err) => {
      res.status(500).json({message: 'Product deletion error: Product not found for user.'});
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
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};
