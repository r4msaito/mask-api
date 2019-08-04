const dbConn = require('./db-conn');
const sequelize = require('sequelize');
const UserModel = require('../models/user');
const PostModel = require('../models/post');

module.exports = () => {
    //All table models
    UserModel.hasMany(PostModel, {as: 'author', foreignKey: 'author'});
    new UserModel(dbConn, sequelize);
    new PostModel(dbConn, sequelize);

    dbConn.sync({force: false}).then(() => {
        console.log('All Tables are created');
    });

};