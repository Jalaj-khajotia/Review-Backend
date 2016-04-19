'use strict';

// Tasks routes
var Joi = require('joi');
var Boom = require('boom');
var Promise = require('bluebird');
var TasksController = require('../controllers/Tasks');
var UsersController = require('../controllers/User-controllers.js');

exports.register = function(server, options, next) {
    // Setup the controller 
    var usersController = new UsersController(options.database);

    // Binds all methods
    // similar to doing `tasksController.index.bind(tasksController);`
    // when declaring handlers

    server.bind(usersController);
    
    // Declare routes
    server.route([{
        method: 'GET',
        path: '/user/{id}',
        config: {
            auth: false,
            handler: usersController.show       
        }
    },{
        method: 'POST',
        path: '/login',
        config: {
            auth: false,
            handler: usersController.index,
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().min(2).max(200).required()
                }
            }            
        }
    }]);
    next();
}

exports.register.attributes = {
    name: 'routes-users',
    version: '1.0.1'
};

function getValidatedUser(email, password){
    return new Promise(function(fulfill, reject){

        var users = [
            {
                id: 123,
                email: 'admin@admin.com',
                password: 'admin',
                scope: ['user', 'admin', 'user-123']
            },
            {
                id: 124,
                email: 'guest@guest.com',
                password: 'guest',
                scope: ['user', 'user-124']
            },
            {
                id: 125,
                email: 'other@other.com',
                password: 'other',
                scope: ['user', 'user-125']
            }
        ];

        // This is done to remove the password before being sent.
        function grabCleanUser(user) {
            var user = user;
            delete user.password;
            return user;
        };

        // very simple look up based on the user array above.
        if (email === users[0].email && password === users[0].password) {
            return fulfill(grabCleanUser(users[0]));
        } else if (email === users[1].email && password === users[1].password) {
            return fulfill(grabCleanUser(users[1]));
        } else if (email === users[2].email && password === users[2].password) {
            return fulfill(grabCleanUser(users[2]));
        } else {
            return reject(null);
        }
    });
}