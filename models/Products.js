'use strict';

var crypto = require('crypto');
var Promise = require('bluebird');

function ProductsModel(database) {
    this.db = database;
};

ProductsModel.prototype.getAllProducts = function() {
    return this.db.get('products') || [];
};

ProductsModel.prototype.findProductsByProperty = function(prop, value) {
    var task, i, len;
       var products = this.getProducts();
       var users =  this.db.get('users');
    return new Promise(function(fulfill, reject) {
        var tasks = products.
        then(function(products) {     
        users.then(function(user_data){
            for (i = 0, len = products.length; i < len; i++) {
                var product = products[i];
                if (products[i].id == value) {

                    return fulfill(product);
                }
            }
            return reject('not found');
        }, function(error){

        });      
            
            //return reply(users);
        }, function(error) {
          return reject(error);
            console.log(error);
        });
    });
};

ProductsModel.prototype.getProducts = function(start, limit) {
    var tasks = this.getAllProducts();
    // console.log(tasks);

    return tasks;
    // .slice(start, limit + 1);
};

ProductsModel.prototype.getProduct = function(id) {
    var task = this.findProductsByProperty('id', id);
   
    return task;
     if (!task) {
        throw new Error('Task doesn\'t exists.');
    }
};

ProductsModel.prototype.addUser = function(newTask) {
    var tasks = this.getAllProducts();
    newTask = newTask.trim();

    // We don't want duplicates
    if (this.findTaskByProperty('value', newTask)) {
        throw new Error('Task already exists for id: ' + task.id);
    }

    var task = {
        // Collisions can happen but unlikely
        // 1 byte to hex turns into two characters
        id: crypto.randomBytes(8).toString('hex'),
        value: newTask
    }
    tasks.push(task);

    this.db.set('tasks', tasks);

    return task;
};

ProductsModel.prototype.updateUser = function(id, updatedTask) {
    updatedTask = updatedTask.trim();

    var task = this.findTaskByProperty('id', id);

    if (!task) {
        throw new Error('Task doesn\'t exists.');
    }

    task.value = updatedTask;

    return task;
};

ProductsModel.prototype.deleteUser = function(id) {
    if (!this.findTaskByProperty('id', id)) {
        throw new Error('Task doesn\'t exists.');
    }

    var task, i, len;
    var tasks = this.getAllTasks();

    for (i = 0, len = tasks.length; i < len; i++) {
        task = tasks[i];
        if (task.id === id) {
            // Removes task
            tasks.splice(i, 1);
            this.db.set('tasks', tasks);
            return;
        }
    }
};

module.exports = ProductsModel;
