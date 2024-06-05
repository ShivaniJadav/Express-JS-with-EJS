var express = require("express");
var { validateToken } = require('../middlewares/admin_authentication')
var router = express.Router();
var dashboardController = require('../controllers/dashboard_controller')
var userController = require('../controllers/users_controller')

router.get("/", validateToken, async function (req, res, next) {
    let users = await userController.getAll(4);
    let data = await dashboardController.getCounts()
    res.render('dashboard', { user: req.body.logged_in_user, dashboard : { 
        counts: data.data,  
        userlist: JSON.parse(JSON.stringify(users?.data))
    } 
    });
});


module.exports = router;