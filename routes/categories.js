var express = require('express');
var { validateToken } = require('../middlewares/admin_authentication');
var router = express.Router();
var categoryController = require('../controllers/categories_controller')

/* GET home page. */
router.get('/', validateToken, async function(req, res, next) {
    try {
        let result = await categoryController.getAll();
        res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      } catch (error) {
        res.render('category-list', { user: req.body.logged_in_user, categorylist: [] });
      }
});

router.get('/add', validateToken, async function(req, res, next) {
  try {
    res.render('add-category', { user: req.body.logged_in_user, category: {} });
  } catch (error) {
      let result = await categoryController.getAll();
      res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
    }
});

router.get('/:category_id', validateToken, async function(req, res, next) {
  try {
    if(req.params.category_id){
      let category = await categoryController.getCategoryById(req.params.category_id)
      if(category.status) {
        res.render('edit-category', { user: req.body.logged_in_user, category: category.data });
      } else {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
        res.redirect('/categories');
      }
    } else {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
  } catch (error) {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
});

router.get('/delete/:category_id', validateToken, async function(req, res, next) {
  try {
    if (req.params.category_id) {
      let category = await categoryController.deleteCategory(req.params.category_id)
      // if(category.status) {
      //   res.render('edit-category', { user: req.body.logged_in_user, category: category.data });
      // } else {
        // let result = await categoryController.getAll();
        // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      // }
    //   res.redirect('/categories');
    // } else {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    } else {
      res.redirect('/categories');
    }
  } catch (error) {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
});

router.post('/:category_id', validateToken, async function(req, res, next) {
  try {
    if (req.params.category_id) {
      req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
      await categoryController.updateCategory(req.params.category_id, req.body);
      res.redirect('/categories');
    } else {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
  } catch (error) {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
});

router.post('/', validateToken, async function(req, res, next) {
  try {
    // req.body['is_active'] = req.body?.is_active == 'on' ? true : false;
    let category = await categoryController.createCategory(req.body);
    if(!category.status) {
      res.render('add-category', { user: req.body.logged_in_user, error: category.message, category: JSON.parse(JSON.stringify(category.data)) });
    } else {
      res.redirect('/categories');
    }
    // let result = await categoryController.getAll();
    // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
  } catch (error) {
      // let result = await categoryController.getAll();
      // res.render('category-list', { user: req.body.logged_in_user, categorylist: JSON.parse(JSON.stringify(result.data)) });
      res.redirect('/categories');
    }
});


module.exports = router;
