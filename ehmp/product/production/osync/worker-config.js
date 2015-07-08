'use strict';
var nconf = require('nconf');
require('./env-setup');
var _ = require('underscore');
var queueConfig = require(global.OSYNC_JOBFRAMEWORK + 'queue-config.js');

nconf
    .argv()
    .env()
    .file('conf', './worker-config.json');

var config = nconf.get('osync');
var cachedConfig = JSON.stringify(config);
var configChangeCallback = null;

// I don't like doing things this way, fix this later:


if (process.env.OSYNC_IP) {
    console.log('Using environment variable for O-SYNC: %s', process.env.OSYNC_IP);
    var osync = nconf.get('OSYNC_IP');
    osync = process.env.OSYNC_IP;
}
var reloadTimer;
if(config.configRefresh && config.configRefresh > 0) {
    reloadTimer = setInterval(reloadConfig, config.configRefresh);
}

function reloadConfig() {
    var newconfig;
    nconf.remove('conf');
    nconf.add('conf', {type:'file', file: './worker-config.json'});
    newconfig = nconf.get('osync');
    var refreshTime = config.configRefresh;
    var vistaSitesChanged = false;
    // console.log('refreshing config');
    //if file refresh changed, redo the file polling
    if(newconfig.configRefresh !== config.configRefresh) {
        console.log('updating refresh timer');
        clearInterval(reloadTimer);
        reloadTimer = setInterval(reloadConfig, newconfig.configRefresh);
    }
    if( JSON.stringify(newconfig.vistaSites) !== JSON.stringify(config.vistaSites) ) {
        console.log('vista site change found');
        vistaSitesChanged = true;
    }
    //update configuration with new settings
    var newConfigString = JSON.stringify(newconfig);
    if(cachedConfig !== newConfigString) {
        console.log('updating config');
        var keys = _.keys(newconfig);
        _.each(keys, function(key){
            config[key] = newconfig[key];
        });
        config.beanstak = queueConfig.createFullBeanstalkConfig(config.beanstalk);
        cachedConfig = newConfigString;
    }
    //run any registered callbacks
    if(configChangeCallback !== null) {
        if(vistaSitesChanged) {
            console.log('running callbacks');
            _.each(configChangeCallback, function(callbackConfig){
                    var delay = refreshTime; //use the old refresh time to ensure cross process coordination
                    if(!callbackConfig.useDelay) {
                        delay = 0;
                    }
                    setTimeout(callbackConfig.function, delay);
                }
            );
        }
    }
}

function addChangeCallback(callback , useDelay) {
    if(configChangeCallback === null) {
        configChangeCallback = [];
    }
    // console.log('registering config change callback');
    configChangeCallback.push({function: callback, delay: (useDelay || true)});
}


// if(process.env.PANORAMA_IP) {
// 	console.log('Using environment variable for PANORAMA: %s', process.env.PANORAMA_IP);
// 	config.vistaSites['9E7A'].host = process.env.PANORAMA_IP;
// }

// if(process.env.KODAK_IP) {
// 	console.log('Using environment variable for KODAK: %s', process.env.KODAK_IP);
// 	config.vistaSites.C877.host = process.env.KODAK_IP;
// }

// if(process.env.JDS_IP) {
// 	console.log('Using environment variable for JDS: %s', process.env.JDS_IP);
// 	config.jds.host = process.env.JDS_IP;
// }

// if(process.env.SOLR_IP) {
// 	console.log('Using environment variable for SOLR: %s', process.env.SOLR_IP);
// 	config.solrClient.host = process.env.SOLR_IP;
// }

// process.env.JMEADOWS_IP
// process.env.MVI_IP
// process.env.HDR_IP
// process.env.VLER_IP
// process.env.PGD_IP

config.beanstalk = queueConfig.createFullBeanstalkConfig(config.beanstalk);

module.exports = config;
module.exports.addChangeCallback = addChangeCallback;
