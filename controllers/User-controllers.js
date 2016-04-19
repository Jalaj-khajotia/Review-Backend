'use strict';

var Boom = require('boom');
var UsersModel = require('../models/Users');

function UsersController(database) {
    this.usersModel = new UsersModel(database);
};

// [GET] /tasks
UsersController.prototype.index = function(request, reply) {
    var start = request.query.start;
    var limit = request.query.limit;

    if (start == null) {
        start = 0
    }

    if (limit == null) {
        limit = start + 9
    }

    this.usersModel.getUsers(start, limit).
    then(function(users) {

        for (var i = 0; i < users.length; i++) {
          
            if (users[i].email == request.payload.email) {

                if (users[i].password == request.payload.password) {
                    var user = {                        
                        email: users[i].email,
                        password: users[i].password,
                        scope: users[i].scope
                    }
                    //['user', 'admin', 'user-123']
                    users[i].scope = 'admin';
                    request.auth.session.set(user);
                    return reply('Login Successful!');
                } else {
                    return reply(Boom.unauthorized('Bad email or password'));
                }
            }
        }
        return reply(Boom.unauthorized('User not found'));       
        //return reply(users);
    }, function(error) {
        console.log(error);
    });
};

// [GET] /tasks/{id}
UsersController.prototype.show = function(request, reply) {
    try {
        console.log('starting UsersController show');       
        var id = request.params.id;
        this.usersModel.getUser(id).then(function(user){
         reply(user);
        }, function(error){
        reply(error);
        });      
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [POST] /tasks
UsersController.prototype.store = function(request, reply) {
    try {
        var value = request.payload.task;

        reply(this.usersModel.addUser(value))
            .created();
    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};

// [PUT] /tasks/{id}
UsersController.prototype.update = function(request, reply) {
    try {
        var id = request.params.id;
        var task = request.payload.task;

        reply(this.usersModel.updateUser(id, task));
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [DELETE] /tasks/{id}
UsersController.prototype.destroy = function(request, reply) {
    try {
        var id = request.params.id;

        this.usersModel.deleteUser(id);
        reply().code(204);
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

module.exports = UsersController;
