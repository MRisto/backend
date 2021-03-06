'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
    express = require("express"),
    _ = require('lodash'),
    mongoose = require('./mongoose'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    cors = require('cors');


mongoose.connect(function () {
    var app = express();
    app.use(cors({origin: config.webServer}));

    var middleware = require('./middleware/middlewares');

    //Add Middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));
    app.use(passport.initialize());
    app.use(middleware.isAuthenticated());
    app.use(middleware.translations());

    // // write cleaned languages to request
    // // app.use(function(req,res,next){
    // //     var langArray =[];
    // //     if(req.isSignedIn && req.user.preferredLanguage){
    // //         next();
    // //     }else{
    // //         _.forEach(req.acceptsLanguages(),function(acceptedLanguage){
    // //             _.forEach(config.languageOptions.languages,function(allowedLanguage){
    // //                 if(allowedLanguage === acceptedLanguage){
    // //                     langArray.push(acceptedLanguage);
    // //                 }
    // //             })
    // //         });
    // //     }
    // //     req.languages = langArray;
    // //     next();
    // // });
    // //load Backendtranslations
    // app.use(function (req, res, next) {
    //     //check here if there are params
    //     //check here if there are params
    //
    // });

    //Importe routes
    _.forEach(config.files.routes, function (routePath) {
        require(path.resolve(routePath))(app, middleware);
    });

    //catch 404 error sites
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //app listen on port
    app.listen(config.server.port, function () {
    });
});