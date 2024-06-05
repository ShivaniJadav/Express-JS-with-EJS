var { sqldb } = require("../models/dbconfig");
const { PDFDocument, rgb } = require("pdf-lib");
const qr = require("qrcode");
const fs = require("fs");
const path = require("path");

let generateQRBulk = async (product_id, points, qty) => {
  try {
    return new Promise((resolve, reject) => {
    for (let i = 0; i < qty; i++) {
        qr.toDataURL(JSON.stringify({ product_id, points, timestamp: Date.now() }),
          async function (err, url) {
            if (err) {
              console.log(err);
            }
            console.log(url);
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([400, 400]);
            const imageEmbed = await pdfDoc.embedPng(url);
            const { width, height } = imageEmbed.scaleToFit(
              page.getWidth(),
              page.getHeight()
            );
            page.drawImage(imageEmbed, {
              x: page.getWidth() / 2 - width / 2,
              y: page.getHeight() / 2 - height / 2,
              width,
              height,
              color: rgb(0, 0, 0),
            });
            const pdfBytes = await pdfDoc.save();
            await fs.promises.writeFile(path.join(__dirname, "../public/QR_codes/"+product_id+'.pdf'), pdfBytes);
          }
        );
      }
      resolve({ status: true, message: "QR codes generated successfully!" });
    });
  } catch (error) {
    return { status: false, message: error.message };
  }
};

let getProductByName = async (name) => {
  try {
    let data = await sqldb.products.findOne({
      where: {
        name: name,
        is_deleted: 0,
      },
    });
    if (data) {
      return { status: true, data: data, message: "User found!" };
    } else {
      return { status: false, data: {}, message: "User not found!" };
    }
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let createProduct = async (productData) => {
  try {
    let product = await getProductByName(productData.name);
    if (product.status) {
      return {
        status: false,
        data: product,
        message: "Product with the same name already exists!",
      };
    }
    let data = await sqldb.products.create(productData);

    return {
      status: true,
      data: data,
      message: "Product created successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let updateProduct = async (product_id, data) => {
  try {
    let product = await getProductByName(data.name);
    if (
      product.status &&
      JSON.parse(JSON.stringify(product)).data.product_id != product_id
    ) {
      return {
        status: false,
        data: product,
        message: "Product with the same name already exists!",
      };
    }
    await sqldb.products.update(data, {
      where: {
        product_id: product_id,
      },
      individualHooks: true,
    });
    return {
      status: true,
      message: "Product updated successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let getAll = async () => {
  try {
    let categories = await sqldb.products.findAll({
      where: { is_deleted: 0 },
      include: {
        model: sqldb.categories,
        where: { is_deleted: 0 },
      },
    });
    return {
      status: true,
      data: categories,
      message: "Fetched all users successfully!",
    };
  } catch (error) {
    return { status: false, data: [], message: error.message, error };
  }
};

let getProductById = async (product_id) => {
  try {
    let product = await sqldb.products.findByPk(product_id);
    return {
      status: true,
      data: product,
      message: "Fetched all categories successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let deleteProduct = async (product_id) => {
  try {
    let product = await sqldb.products.update(
      {
        is_deleted: 1,
      },
      {
        where: {
          product_id: product_id,
        },
      }
    );
    return {
      status: true,
      data: product,
      message: "Deleted product successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAll,
  getProductById,
  deleteProduct,
  generateQRBulk,
};
