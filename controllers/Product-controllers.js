'use strict';

var Boom = require('boom');
var ProductsModel = require('../models/Products');


function ProductsController(database) {
    this.productsModel = new ProductsModel(database); 
};

// [GET] /tasks
ProductsController.prototype.index = function(request, reply) {
    var start = request.query.start;
    var limit = request.query.limit;

    if (start == null) {
        start = 0
    }

    if (limit == null) {
        limit = start + 9
    }

    this.productsModel.getProducts(start, limit).
    then(function(products) {
        return reply(products);
        //return reply(users);
    }, function(error) {
        console.log(error);
    });
};

// [GET] /tasks/{id}
ProductsController.prototype.show = function(request, reply) {
        try {
            var id = request.params.id;
            this.productsModel.getProduct(id).then(function(product) {

               return reply(product);
        })
    .catch(function(err) {
        return reply('error');
    });
}
catch (e) {
    reply(Boom.notFound(e.message));
}
};

// [POST] /tasks
ProductsController.prototype.store = function(request, reply) {
    try {
        var value = request.payload.task;

        reply(this.productsModel.addUser(value))
            .created();
    } catch (e) {
        reply(Boom.badRequest(e.message));
    }
};

// [PUT] /tasks/{id}
ProductsController.prototype.update = function(request, reply) {
    try {
        var id = request.params.id;
        var task = request.payload.task;
        reply(this.productsModel.updateUser(id, task));
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

// [DELETE] /tasks/{id}
ProductsController.prototype.destroy = function(request, reply) {
    try {
        var id = request.params.id;

        this.productsModel.deleteUser(id);
        reply().code(204);
    } catch (e) {
        reply(Boom.notFound(e.message));
    }
};

module.exports = ProductsController;
