'use strict';

var Database = require('./database');
var Hapi = require('hapi');
var models = require('./dbmodels');

var database = new Database();
var server = new Hapi.Server({ debug: { request: ['info', 'error'] } });

// Expose database
if (process.env.NODE_ENV === 'test') {
    server.database = database;
}

// Create server
server.connection({
    host: 'localhost',
    port: 8000,

    routes: {
        cors: true
    }
});

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
    
// Add routes
var plugins = [{
            register: require("good"),
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    events: { ops: '*', request: '*', log: '*', response: '*', 'error': '*' }
                }]
            }
        }, {
            register: require('./routes/tasks.js'),
            options: {
                database: database
            }
        }, {
            register: require('./routes/user-routes.js'),
            options: {
                database: database
            }},
            {
            register: require('./routes/product-routes.js'),
            options: {
                database: database
            }}];

        server.register(plugins, function(err) {
            if (err) {
                throw err;
            }

            console.log(!module.parent);

            if (!module.parent) {

                models.sequelize.sync().then(function() {
                    server.start(function(err) {
                        if (err) {
                            throw err;
                        }
                        //console.log('starting server '+ server.info.uri);
                        server.log('info', 'Server running at: ' + server.info.uri);
                    });
                });
            };
        });

        module.exports = server;
