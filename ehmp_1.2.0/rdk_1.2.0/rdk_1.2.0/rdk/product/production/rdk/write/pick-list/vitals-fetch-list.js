/*jslint node: true */
'use strict';
var VistaJS = require('../core/VistaJS');
var parseRpc = require('./parsers/vitals-parser').parseVitals;


module.exports.getVitals = function (log, configuration, callback) {
    VistaJS.callRpc(log, configuration, 'GMV VITALS/CAT/QUAL', '', function(err, result) {
        if (err) {
            callback(err.message);
        }
        else {
            try {
                var json = parseRpc(log, result);
                callback(null, json);
            }
            catch (error) {
                callback(error.message);
            }
        }
    });
};
