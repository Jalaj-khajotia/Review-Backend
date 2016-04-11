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
}];

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
