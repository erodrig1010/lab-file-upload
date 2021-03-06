const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Picture    = require('../models/picture');
const multer     = require('multer');
const upload     = multer({ dest: './public/uploads/' });

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('authentication/login', { message: req.flash('error')});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('authentication/signup', { message: req.flash('error')});
});


router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
}));

router.post('/signup', upload.single('photo'), function(req, res){

    const pic = new Picture({
        name: req.body.name,
        // filename grabs the name of the file as uploaded from the users computer
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname
    });
  
    pic.save((err) => {
        // res.redirect('/signup');
    });
  });

// router.post('/upload', upload.single('photo'), function(req, res){

//     const pic = new Picture({
//         name: req.body.name,
//         // filename grabs the name of the file as uploaded from the users computer
//         path: `/uploads/${req.file.filename}`,
//         originalName: req.file.originalname
//     });
  
//     pic.save((err) => {
//         // res.redirect('/signup');
//     });
//   });


router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
    res.render('authentication/profile', {
        user : req.user
    });
});

router.get('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
