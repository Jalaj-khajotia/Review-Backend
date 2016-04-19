'use strict';

// Tasks routes
var Joi = require('joi');
var Boom = require('boom');
var Promise = require('bluebird');

var ProductController = require('../controllers/Product-controllers.js');

exports.register = function(server, options, next) {
    // Setup the controller 
    var productController = new ProductController(options.database);

    // Binds all methods
    // similar to doing `tasksController.index.bind(tasksController);`
    // when declaring handlers

    server.bind(productController);
    
    // Declare routes
    server.route([{
        method: 'GET',
        path: '/products',
        config: {
            auth: false,
            handler: productController.index         
        }
    },
        {
            method: 'GET',
            path: '/product/{id}',
            config: {
                  auth: false,
                handler: productController.show,
                validate: {
                    params: {
                        id: Joi.string()
                    }
                }
            }
        }]);
    next();
}

exports.register.attributes = {
    name: 'routes-products',
    version: '1.0.1'
};