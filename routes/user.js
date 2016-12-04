var express = require('express');
var router = express.Router();
var userQueries = require('../database/queries/user_queries')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/dashboard/collections', isLoggedIn, function(req, res, next) {
    res.render('dashboard/collections', {
        user: req.user,
        title: '| Collections'
    });
});

router.get('/register', isLoggedIn, function(req, res, next) {
    if (req.user.newUser) {
        res.render('user/register', {
            user: req.user,
            title: '| Welcome'
        });
    } else {
        res.redirect('/dashboard');
    };
});

router.post('/register', isLoggedIn, function(req, res, next) {
    userQueries.signUp(req.user.id, req.body.about)
        .then(function(data) {
            req.user.newUser = false;
            res.redirect('/dashboard');
        })
        .catch(function(error) {
            return next(error);
        });
});

router.get('/settings', isLoggedIn, function(req, res, next) {
    res.render('user/settings', {
        user: req.user,
        title: '| Settings'
    });
});

router.get('/update', isLoggedIn, function(req, res, next) {
    res.render('user/update', {
        user: req.user,
        title: '| Update'
    });
});

router.post('/update', isLoggedIn, function(req, res, next) {

    let userInfo = {
        googleID: req.user.google_id,
        email: req.body.email,
        about: req.body.about
    };

    userQueries.updateUser(userInfo)
        .then(function(data) {
            res.redirect('/dashboard');
        })
        .catch(function(error) {});
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect('/');
};

module.exports = router;