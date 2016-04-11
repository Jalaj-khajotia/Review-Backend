'use strict';

// Tasks routes
var Joi = require('joi');
var Boom = require('boom');
var Promise = require('bluebird');
var TasksController = require('../controllers/Tasks');

exports.register = function(server, options, next) {
    // Setup the controller
    var tasksController = new TasksController(options.database);

    // Binds all methods
    // similar to doing `tasksController.index.bind(tasksController);`
    // when declaring handlers

    server.bind(tasksController);
        server.register([
        {
            register: require('hapi-auth-cookie')
        }
    ], function(err) {
        if (err) {
            console.error('Failed to load a plugin:', err);
            throw err;
        }

        // Set our server authentication strategy
        server.auth.strategy('standard', 'cookie', {
            password: 'somecrazycookiesecretthatcantbeguesseswouldgohere', // cookie secret
            cookie: 'app-cookie', // Cookie name
            isSecure: false, // required for non-https applications
            ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
        });

    });

    server.auth.default({
        strategy: 'standard',
        scope: ['admin']
    });

    // Declare routes
    server.route([{
        method: 'POST',
        path: '/login',
        config: {
            auth: false,
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().min(2).max(200).required()
                }
            },
            handler: function(request, reply) {

                getValidatedUser(request.payload.email, request.payload.password)
                    .then(function(user){

                        if (user) {
                            request.auth.session.set(user);
                            return reply('Login Successful!');
                        } else {
                            return reply(Boom.unauthorized('Bad email or password'));
                        }

                    })
                    .catch(function(err){
                        return reply(Boom.badImplementation());
                    });

            }
        }
    },
        {
            method: 'GET',
            path: '/tasks',
            config: {
                  auth: false,
                handler: tasksController.index,
                validate: {
                    query: Joi.object().keys({
                        start: Joi.number().min(0),
                        limit: Joi.number().min(1)
                    })
                }
            }
        },
        {
            method: 'GET',
            path: '/tasks/{id}',
            config: {
                handler: tasksController.show,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/tasks',
            config: {
                handler: tasksController.store,
                validate: {
                    payload: Joi.object().length(1).keys({
                        task: Joi.string().required().min(1).max(60)
                    })
                }
            }
        },
        {
            method: 'PUT',
            path: '/tasks/{id}',
            config: {
                handler: tasksController.update,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    },
                    payload: Joi.object().length(1).keys({
                        task: Joi.string().required().min(1).max(60)
                    })
                }
            }
        },
        {
            method: 'DELETE',
            path: '/tasks/{id}',
            config: {
                handler: tasksController.destroy,
                validate: {
                    params: {
                        id: Joi.string().regex(/[a-zA-Z0-9]{16}/)
                    }
                }
            }
        },{
        method: 'GET',
        path: '/example-two',
        config: {
            description: 'User required authorization',
            auth: {
                strategy: 'standard',
                scope: 'user'
            },
            handler: function(request, reply) {

                return reply('Success, you can access a route that requires the user role!');

            }
        }
    },{
        method: 'GET',
        path: '/example-three',
        config: {
            description: 'Admin required authorization because the default is admin.',
            handler: function(request, reply) {

                return reply('Success, you can access a route that requires the admin role!');

            }
        }
    },{
        method: 'GET',
        path: '/example-four/{id}',
        config: {
            description: 'User specific authorization required.',
            auth: {
                strategy: 'standard',
                scope: ['admin', 'user-{params.id}']
            },
            handler: function(request, reply) {

                return reply('Success, you can access a route for ' + request.params.id + '!');

            }
        }
    }]);
    next();
}

exports.register.attributes = {
    name: 'routes-tasks',
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