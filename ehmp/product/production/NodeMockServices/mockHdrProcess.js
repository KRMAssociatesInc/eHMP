/*jslint node: true */
'use strict';

var config = require('./config.js');
var bunyan = require('bunyan');
var logger = bunyan.createLogger(config.logger);
var _ = require('lodash');
var async = require('async');

var data_path = '/data/hdr/';
var data_file_extension = '.json';
var no_content = 204;

function fetchHdrData(pid, domain, res, actualpid) {
    if (!actualpid) {
        actualpid = pid;
    }

    var options = {
        root: __dirname + data_path,
        headers: {
            'x-timestamp': Date.now()
        }
    };

    var filename = pid + '/' + domain + data_file_extension;

    res.sendFile(filename, options, function (err) {
        if (err) {
            if (err.code == 'ENOENT') {
                if (pid != 'default') {
                    logger.trace('No ' + domain + ' data found for ' + pid + '; checking for default ' + domain + ' data');
                    fetchHdrData('default', domain, res, pid);
                } else {
                    logger.debug('No ' + domain + ' data found for ' + actualpid);
                    res.status(no_content).end();
                }
            } else {
                logger.error(err);
                res.status(err.status).end();
            }
        } else {
            logger.debug(filename + ' sent');
        }
    });
}


module.exports.fetchHdrData = fetchHdrData;
