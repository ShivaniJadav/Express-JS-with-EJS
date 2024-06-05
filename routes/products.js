var express = require("express");
var { validateToken } = require("../middlewares/admin_authentication");
var router = express.Router();
var productController = require("../controllers/products_controller");
var categoryController = require("../controllers/categories_controller");

router.get("/", validateToken, async function (req, res, next) {
  try {
    let result = await productController.getAll();
    res.render("product-list", {
      user: req.body.logged_in_user,
      productlist: JSON.parse(JSON.stringify(result.data)),
    });
} catch (error) {
    res.render("product-list", {
      user: req.body.logged_in_user,
      productlist: [],
    });
  }
});

router.post('/', validateToken, async function(req, res, next) {
    try {
      req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
      let product = await productController.createProduct(req.body);
      if(!product.status) {
        categories = await categoryController.getAll();
        res.render('add-product', { user: req.body.logged_in_user, error: product.message, product: JSON.parse(JSON.stringify(product.data)), categories: JSON.parse(JSON.stringify(categories.data)) });
      } else {
        res.redirect('/products');
      }
    } catch (error) {
       res.redirect('/products');
      }
  });

  router.get('/bulkQR/:product_id/:points/:qty', validateToken, async function(req, res, next) {
    try {
      let result = await productController.generateQRBulk(req.params.product_id, req.params.points, req.params.qty);
      if(!result.status) {
        // res.render('add-product', { user: req.body.logged_in_user, error: product.message, product: JSON.parse(JSON.stringify(product.data)) });
        res.redirect('/products');
      } else{
        // Show list of QR codes
        res.redirect('/products');
      }
    } catch (error) {
       res.redirect('/products');
      }
  });

router.get("/add", validateToken, async function (req, res, next) {
  try {
    categories = await categoryController.getAll();
    res.render("add-product", { user: req.body.logged_in_user, product: {}, categories: JSON.parse(JSON.stringify(categories.data)) });
  } catch (error) {
    let result = await productController.getAll();
    res.render("product-list", {
      user: req.body.logged_in_user,
      productlist: JSON.parse(JSON.stringify(result.data)),
    });
  }
});

router.get('/:product_id', validateToken, async function(req, res, next) {
    try {
      if(req.params.product_id){
        let product = await productController.getProductById(req.params.product_id)
        if(product.status) {
          categories = await categoryController.getAll();
          res.render('edit-product', { user: req.body.logged_in_user, product: product.data, categories: JSON.parse(JSON.stringify(categories.data)) });
        } else {
          // let result = await categoryController.getAll();
          // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
          res.redirect('/products');
        }
      } else {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/products');
      }
    } catch (error) {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/products');
      }
  });
  
  router.get('/delete/:product_id', validateToken, async function(req, res, next) {
    try {
      if (req.params.product_id) {
        let product = await productController.deleteProduct(req.params.product_id)
      }
    res.redirect('/products');
    } catch (error) {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/products');
      }
  });
  
  router.post('/:product_id', validateToken, async function(req, res, next) {
    try {
      if (req.params.product_id) {
        req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
        await productController.updateProduct(req.params.product_id, req.body);
        res.redirect('/products');
      } else {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/products');
      }
    } catch (error) {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/products');
      }
  });

module.exports = router;
