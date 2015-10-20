'use strict';
var rdk = require('../core/rdk');
var dd = require('drilldown');
var mongoskin = require('mongoskin');
var _ = require('lodash');
var mongoDatabase = null;

var collectionWhiteList = {
    users: 'ehmpUsers'
};

/*
 * Checks to see if the passed in collectionName String is contained within the WhiteList collection
 * @param collectionName - a STRING containing the collection name being checked
 * @return false;
 * @return true;
 */
var isWhiteListed = function(collectionName) {
    var collectionNameList = _.values(collectionWhiteList);
    var indexOfCollectionName = _.indexOf(collectionNameList, collectionName);
    if (indexOfCollectionName === -1) {
        return false;
    }
    return true;
};

/*
 * Checks whether or not the Mongo Server has been correctly intialized and is correctly populated with data collections.
 * @param callback - a callback FUNCTION that is executed within isMongoServerInitialized
 * @return callback('Not initialized') - returns a 'Not intialized' error
 * @return callback() - returning true, MongoDB initialized
 */
var getMongoServerStatus = function(callback) {
    mongoDatabase.collectionNames(function(error, items) {
        if (!_.isNull(error)) {
            return callback('is not initialized');
        } else if (_.isUndefined(items) || _.isNull(items)) {
            return callback('has no collections');
        }
        return callback();
    });
};
/*
 * Initializes the Mongo Database
 * Do not consume from endpoint resources, already consumed by app-factory.js
 * @app.logger.error - logs a not initialized error
 * @app.logger.info - logs the url of the MongoDB if running
 */
module.exports.initialize = function(app) {
    var host = dd(app)('config')('mongoServer')('hostname').val;
    var port = dd(app)('config')('mongoServer')('port').val;
    var path = dd(app)('config')('mongoServer')('path').val;
    var scheme = 'mongodb';
    var url = scheme + '://' + host + ':' + port + path;
    mongoDatabase = mongoskin.db(url);
    getMongoServerStatus(function(error) {
        if (error) {
            app.logger.error('Mongo Database ' + error);
        } else {
            app.logger.info('Mongo database initialized on url: ' + url);
        }
    });

};

/*
 * To consume this function in an end point resource, used an the following sample code as an example:
 *
 *   mongoStore.getCollection(USERS_COLLECTION, req, res, function(ehmpUsers) {
 *        if (nullChecker.isNullish(ehmpUsers)) {
 *           return; // mongo-store db connector will report error
 *       }
 *       // ..Additional Code to complete resource function..
 *   });
 *
 * @param collectionName - a STRING containing the Collection Name of the collection being retrieved
 * @param req - an OBJECT containing the Request
 * @param res - an OBJECT containing the Response
 * @param callback - a callback FUNCTION that is executed within getCollection
 */
module.exports.getCollection = function(collectionName, req, res, callback) {
    getMongoServerStatus(function(error) {
        if (error) {
            req.logger.error('Mongo Database ' + error);
            res.status(rdk.httpstatus.internal_server_error).rdkSend('Mongo Database ' + error);
            callback();
        } else if (!isWhiteListed(collectionName)) {
            req.logger.error('Non standard or forbidden mongo collection: ' + collectionName);
            res.status(rdk.httpstatus.internal_server_error).rdkSend('Non standard or forbidden mongo collection: ' + collectionName);
            callback();
        } else {
            req.logger.info('returning mongodatabase collection');
            callback(mongoDatabase.collection(collectionName));
        }
    });

};
