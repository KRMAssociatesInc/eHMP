'use strict';
var rdk = require('../../../rdk/rdk');
var app = rdk.appfactory().defaultConfigFilename('../write/config/write-pick-list-service-config.json').argv(process.argv).build();
var  _ = require('underscore');
var Datastore = require('nedb')
  , db = new Datastore();

var dbFunctions = {
    initiateDB: function(){
        var sites = app.config.vistaSites;
        //get sites from config
        var siteNames = [];
        if (!_.isNull(sites)){
            for (var key in sites) {
              if (sites.hasOwnProperty(key) && typeof sites[key] ==='object') {
                siteNames.push(key);
              }
            }
        }
        //get the picklists list from config
        var pickLists = app.config.pickLists;
        if (_.isArray(pickLists)){
            _.each(pickLists, function(list){
                _.each(siteNames, function(site){
                    db.insert(JSON.parse('{"site":"'+site+'", "picklist":"'+list+'","data":["test1,test2"]}')); //just adding test for now...will be replaced with an RPC call returning appropriate picklist for that site
                });
            });
        }
    },

    getList: function(site, list, callback){
        db.find(JSON.parse('{"site":"'+site+'", "picklist":"'+list+'"}'), function(err, docs){
            if (err){
                app.logger.error('Error getting data %j',err);
                return callback(err, null);
            }
            else if (_.isArray(docs) && docs.length>0){
                return callback(null,docs[0].data);
            }
        });

    },
    deleteList: function(site, list, callback){
        db.remove(JSON.parse('{"site":"'+site+'", "picklist":"'+list+'"}'),{multi: false}, function(err, numRemoved){
            if (err){
                app.logger.error('Error removing list');
                return callback(err,null);
            }
            else{
                return callback(null,numRemoved);
            }
        });

    },
    //post call
    updateList: function(site, list, data, callback){

        db.update(JSON.parse('{"site":"'+site+'", "picklist":"'+list+'"}'),
            JSON.parse('{"site":"'+site+'", "picklist":"'+list+'","data":["'+data+'"]}'),
            {},
            function(err, numReplaced){
                if (err){
                    app.logger.error('Error updating list ' +list +' for site '+site);
                    return callback(err, null);
                }
                else{
                    return callback(null,numReplaced);
                }
            });
    },
    insertList: function(site, list, data, callback){
        db.insert(JSON.parse('{"site":"'+site+'", "picklist":"'+list+'","data":["'+data+'"]}'),
            function (err, newDoc){
                if (err){
                    app.logger.error('Error inserting list '+list+ ' for site '+site);
                    return callback(err,null);
                }
                else{
                    return callback(null,newDoc);
                }
            });

    }
};
module.exports.dbFunctions = dbFunctions;
