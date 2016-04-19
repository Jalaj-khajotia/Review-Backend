'use strict';

var crypto = require('crypto');
var Promise = require('bluebird');

function UsersModel(database) {
    this.db = database;
};

UsersModel.prototype.getAllUsers = function() {
    return this.db.get('users') || [];
};

UsersModel.prototype.findUsersByProperty = function(prop, value) {
    var user, i, len;
    var users = this.getAllUsers();
    return new Promise(function(fulfill, reject) {
        users.then(function(_user) {
        
            for (i = 0, len = _user.length; i < len; i++) {
                user = _user[i];
                if (_user[i].id == value) {                      
                    return fulfill( _user[i]);
                }
            }
            return reject('no user found');
        }, function(error) {
            return reject(error);
        });
    })


};

UsersModel.prototype.getUsers = function(start, limit) {
    var tasks = this.getAllUsers();
    // console.log(tasks);

    return tasks;
    // .slice(start, limit + 1);
};

UsersModel.prototype.getUser = function(id) {
    var task = this.findUsersByProperty('id', id);
     return task;
    if (!task) {
        throw new Error('Task doesn\'t exists.');
    }
   
};

UsersModel.prototype.addUser = function(newTask) {
    var tasks = this.getAllUsers();
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

UsersModel.prototype.updateUser = function(id, updatedTask) {
    updatedTask = updatedTask.trim();

    var task = this.findTaskByProperty('id', id);

    if (!task) {
        throw new Error('Task doesn\'t exists.');
    }

    task.value = updatedTask;

    return task;
};

UsersModel.prototype.deleteUser = function(id) {
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

module.exports = UsersModel;
