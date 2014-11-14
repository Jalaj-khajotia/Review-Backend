var Hapi = require('hapi');
var server = new Hapi.Server('localhost', 8000);

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        reply('hello world');
    }
});

server.start();