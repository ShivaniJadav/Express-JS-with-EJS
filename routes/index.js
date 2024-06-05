var express = require("express");
var { validateToken } = require("../middlewares/admin_authentication");
var router = express.Router();
const indexController = require('../controllers/index_controller')

/* GET home page. */
router.get("/", validateToken, async function (req, res, next) {
  if (req.body.logged_in_user) {
    res.redirect('/dashboard');
  } else {
    res.render("login");
  }
});

router.get("/login", function (req, res, next) {
  // if (req.body.logged_in_user) {
  //   res.redirect("/dashboard");
  // } else {
    res.render("login");
  // }
});

router.get("/signup", function (req, res, next) {
  // if (req.body.logged_in_user) {
  //   res.redirect("/dashboard");
  // } else {
    res.render("signup");
  // }
});

router.get("/forgot-password", function (req, res, next) {
  // if (req.body.logged_in_user) {
  //   res.redirect("/dashboard");
  // } else {
    res.render("forgot-password");
  // }
});

router.post("/forgot-password", async function (req, res, next) {
  try {
    let result = await indexController.forgotPassword(req.body.email);
    if(!result.status) {
      res.render("forgot-password", {
        error: result.message,
        email: req.body.email,
      });  
    } else {
      res.cookie('reset_password_email', req.body.email, { 
        maxAge: 3600 * 1000 // 1 hour
      });
      res.redirect("/OTP-verification");
    }
  } catch (error) {
    res.render("forgot-password", {
      error: error.message,
      email: req.body.email,
    });
  }
});

router.get("/resend-OTP", async function (req, res, next) {
  try {
    let email = req.cookies?.reset_password_email;
    if(email != '' || typeof email != "undefined") {
      let result = await indexController.forgotPassword(email);
      if(!result.status) {
        res.render("forgot-password", {
          error: result.message,
          email: req.body.email,
        });  
      } else {
        res.redirect("/OTP-verification");
      }
    } else {
      res.render("forgot-password", {
        error: 'Enter email again!',
        email: req.body.email,
      });
    }
  } catch (error) {
    res.render("forgot-password", {
      error: error.message,
      email: req.body.email,
    });
  }
});

router.get("/OTP-verification", function (req, res, next) {
    res.render("OTP-verification");
});

router.post("/OTP-verification", async function (req, res, next) {
  try {
    let email = req.cookies?.reset_password_email;
    if(email != '' || typeof email != "undefined") {
      let result = await indexController.verifyOTP(email, req.body.otp);
      if(!result.status) {
        res.render("OTP-verification", {
          error: result.message,
        });  
      } else {
        res.redirect("/reset-password");
      }
    } else {
      res.render("forgot-password", {
        error: 'Email is required.',
        email: req.body.email,
      });
    }
  } catch (error) {
    res.render("forgot-password", {
      error: error.message,
      email: req.body.email,
    });
  }
});

router.get("/reset-password", function (req, res, next) {
  if(req.cookies?.reset_password_email && req.cookies?.reset_password_email != '') {
    res.render("reset-password");
  } else {
    res.redirect("/forgot-password");
  }
});

router.post("/reset-password", async function (req, res, next) {
  try {
    let email = req.cookies?.reset_password_email;
    if(email != '' || typeof email != "undefined") {
      let result = await indexController.resetPassword(email, req.body.password);
      if(!result.status) {
        res.render("reset-password", {
          error: result.message,
        });  
      } else {
        res.cookie('reset_password_email', '', {
          maxAge: 0 
        });
        res.redirect('/login');
      }
    } else {
      res.render("forgot-password", {
        error: 'Email is required.',
        email: req.body.email,
      });
    }
  } catch (error) {
    res.render("reset-password", { error: error.message });
  }
});

module.exports = router;
