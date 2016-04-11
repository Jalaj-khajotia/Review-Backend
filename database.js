/**
 * There's not much value to this file
 * It's just a database stub to simulate calls
 *   to a db storage engine.
 * Pay little attention to this file in the context
 *   of this example.
 **/
'use strict';
var Sequelize = require('sequelize');
var config = require('./config/config')["development"];
console.log('password ' + config.username);
var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        logging: console.log,
        define: {
            timestamps: false
        }
    }
);
var reviewModel = require('./dbmodels/review')(sequelize, Sequelize);
var productModel = require('./dbmodels/product')(sequelize, Sequelize);
var userModel = require('./dbmodels/user')(sequelize, Sequelize);
reviewModel.belongsTo(productModel);
productModel.hasMany(reviewModel);

module.exports = function() {

    var store = { "tasks": [{ "name": "BLU", "rating": "4", "desc": "", "image": "" }, { "name": "", "rating": "5", "desc": "", "image": "" }] };

    function Database() {};

    Database.prototype.get = function(key) {
        return productModel.findAll({ include: [{ all: true }] });
        /* reviewModel.findAll().
            then(function(reviews) {
                console.log('reviews are ');
                console.log(reviews);
                return reviews;
            }, function(error) {
                console.log(error);
            });*/

        /*var value;
        return value = typeof store !== 'undefined' && store !== null ? store[key] : void 0;*/
    };

    Database.prototype.set = function(key, value) {
        store[key] = value;
        return store[key];
    };

    // Used in tests
    Database.prototype.clear = function() {
        store = {};
    };

    return new Database();
};
