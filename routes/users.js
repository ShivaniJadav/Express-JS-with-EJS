var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();
var { validateToken } = require('../middlewares/admin_authentication')
require('dotenv').config();
var userController = require('../controllers/users_controller')
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images/',
    filename: (req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = file.originalname;
      const newFileName = `${uniquePrefix}-${originalName}`;
      cb(null, newFileName);
    },
  })
 })

// Get all users
router.get("/", validateToken, async function (req, res, next) {
  try {
    let result = await userController.getAll();
    res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
  } catch (error) {
    res.render('user-list', { user: req.body.logged_in_user, userlist: [] });
  }
});


router.get("/login", function (req, res, next) {
  res.redirect('/');
});

// User/Admin login
router.post("/login", async function (req, res, next) {
  try {
    let user = await userController.getUserByEmail(req.body.email);
    user = JSON.parse(JSON.stringify(user));
    if(user && user.data && user.data.password) {
      const isMatched = await bcrypt.compare(
        req.body.password,
        user?.data.password,
      );
      if(isMatched) {
        let token = await jwt.sign({...user.data, timestamp: Date.now()}, process.env.SECRET);
        res.cookie('token', token, { 
          maxAge: 3600 * 1000 // 1 hour
        });
        if(user.data.is_admin) {
          res.redirect('/dashboard');
        } else {
          res.render('login', { error: 'Please log into the Application!', email: req.body.email });
        }
      } else {
        res.render('login', { error: 'Incorrect Email or Password!', email: req.body.email });
      }
    } else {
      res.render('login', { error: 'Incorrect Email or Password!', email: req.body.email });
    }
  } catch (error) {
    res.render('login', { error: error.message, email: req.body.email });
  }
});

// router.get("/add", validateToken, async function (req, res, next) {
//   try {
//     res.render('add-user', { user: req.body.logged_in_user});
//   } catch (error) {
//     let result = await userController.getAll();
//     res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
//   }
// });

// router.put("/add", validateToken, async function (req, res, next) {
//   try {
//     res.render('add-user', { user: req.body.logged_in_user});
//   } catch (error) {
//     let result = await userController.getAll();
//     res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
//   }
// });

router.get("/change-password", validateToken, function (req, res, next) {
  res.render('change-password', { user: req.body.logged_in_user });
});

router.post("/change-password", validateToken, async function (req, res, next) {
  try {
    if(!req.body.logged_in_user) {
      res.render('login', {error: 'Session expired! Please login again!'})
    }
    const isMatched = await bcrypt.compare(
      req.body.oldPassword,
      req.body?.logged_in_user?.password,
    );
    if(isMatched) {
      await userController.updatePassword(req.body?.logged_in_user?.user_id, req.body.password)
      res.redirect('/dashboard')
    } else {
      res.render('change-password', { oldpass: req.body.oldPassword, newpass: req.body.password, confirmpass: req.body.confirmPassword, oldPasswordServerError: 'Old password is incorrect!' })
    }
  } catch (error) {
    res.send({status: false, data: error, message: error.message});
  }
});

router.get("/logout", validateToken, function (req, res, next) {
  res.cookie('token', '', {
    maxAge: 0 
  });
  res.redirect('login');
});

router.get("/profile", validateToken, function (req, res, next) {
  res.render('profile', { user: req.body.logged_in_user });
});

router.post("/profile", upload.single('photo'), validateToken, async function (req, res, next) {
  try {
    if(req.file?.filename) {
      req.body['photo'] = req.file?.filename;
    }
    let result = await userController.updateUser(req.body.logged_in_user.user_id, req.body);
    if(!result.status) {
      res.render('/profile', { error: result.message });
    } else {
      let token = await jwt.sign({...JSON.parse(JSON.stringify(result.data)), timestamp: Date.now()}, process.env.SECRET);
        res.cookie('token', token, { 
          maxAge: 3600 * 1000 // 1 hour
        });
      res.redirect('/dashboard');
    }
  } catch (error) {
    let result = await userController.getAll();
    res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
  }
}); 

// User registration
router.post("/register", upload.single('photo'), async function (req, res, next) {
  try {
    req.body['photo'] = req.file?.filename || '';
    let result = await userController.createUser(req.body);
    if(result.status) {
      res.redirect('login');
    } else {
      res.render('signup', { error: result.message, user: req.body });
    }
  } catch (error) {
    res.render('signup', { error: result.message });
  }
});

router.get("/:user_id", validateToken, async function (req, res, next) {
  try {
    if (!req.params.user_id) {
      let result = await userController.getAll();
      res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
    }
    let user = await userController.getUserById(req.params.user_id)  
    if(user && user.status){
      res.render('edit-user', { user: req.body.logged_in_user, edituser: JSON.parse(JSON.stringify(user.data)) });
    } else {
      let result = await userController.getAll();
      res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
    }
  } catch (error) {
    let result = await userController.getAll();
    res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
  }
});  

router.post("/:user_id", upload.single('photo'), validateToken, async function (req, res, next) {
  try {
    req.body['is_verified'] = req.body?.is_verified == 'on' ? true : false;
    let result = await userController.updateUser(req.params.user_id, req.body);
    let users = await userController.getAll();
    // window.location.href = '/';
    // res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(users.data)), error: result.status ? (users.status ? '' : users.message) : result.message });
    res.redirect('/users');
  } catch (error) {
    let result = await userController.getAll();
    res.render('user-list', { user: req.body.logged_in_user, userlist: JSON.parse(JSON.stringify(result.data)) });
  }
});  


router.get("/signup", function (req, res, next) {
  res.redirect('/');
});



router.get("/profile", validateToken, function (req, res, next) {
  res.render('profile', { user: req.body?.logged_in_user });
});



module.exports = router;
