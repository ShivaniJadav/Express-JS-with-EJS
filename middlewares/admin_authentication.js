const jwt = require("jsonwebtoken");
module.exports = {
    validateToken: async (req, res, next) => {
        try {
            if(typeof req.cookies.token == "undefined") {
                res.redirect('/login');
            } else if (req.cookies.token != "") {
                let result = await jwt.verify(req.cookies.token, process.env.SECRET)
                res.cookie('user', result, { 
                    maxAge: 3600 * 1000 // 1 hour
                });
                req.body['logged_in_user'] = result;
                next();
            } else {
                res.render('login', {error: "Session Expired! Please Log In again!"});
            }
        } catch (error) {
            res.render('login', {error: error.message});
        }
    }
}