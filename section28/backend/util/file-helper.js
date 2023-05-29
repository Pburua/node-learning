const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

const deleteImage = (imageName) => {
  const filePath = path.join(__dirname, '..', imageName);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

const fileHelper = {
  deleteFile,
  deleteImage
};

module.exports = fileHelper;
