/**
 * Created by alexluong on 5/26/15.
 */

'use strict';

var _ = require('lodash');
var vistaSites = null;
var rdk = require('../core/rdk');
var dd = require('drilldown');
var logger = null;

module.exports.initialize = function(app) {
    var appVistaSites = dd(app)('config')('vistaSites').val;
    var appLogger = dd(app)('logger').val;
    if(!_.isObject(appLogger)) {
        process.exit(1);  // TODO: determine whether to gracefully exit
    }
    logger = appLogger;
    if(!_.isObject(appVistaSites)) {
        app.logger.fatal('pidValidator: attempted to initialize with no VistA sites defined');
        process.exit(1);
    }
    vistaSites = appVistaSites;
};

function containsSite(pid) {
    if(!_.isObject(logger)) {
        process.exit(1);
    }
    if(!_.isObject(vistaSites)) {
        logger.fatal('pidValidator: attempted to access vista site configuration when none exists');
        process.exit(1);
    }
    return pid.indexOf(';') !== -1;
}
function isCurrentSite(currentSite, pid) {
    return pid.split(';')[0] === currentSite;
}
function isPrimarySite(pid) {
    return vistaSites[pid.split(';')[0]];
}

var icnRegex = /\w+V\w+/;
var dfnRegex = /^\d+$/;
function isIcn(pid) {
    return !containsSite(pid) && icnRegex.test(pid);
}
function isDfn(pid) {
    return !containsSite(pid) && dfnRegex.test(pid);
}
function isSiteIcn(pid) {
    return containsSite(pid) && icnRegex.test(pid.split(';')[1]);
}
function isSiteDfn(pid) {
    return containsSite(pid) && dfnRegex.test(pid.split(';')[1]);
}
function isSiteEdipi(pid) {
    return containsSite(pid) && !isPrimarySite(pid) && !isSiteIcn(pid);
}

module.exports.containsSite = containsSite;
module.exports.isCurrentSite = isCurrentSite;
module.exports.isPrimarySite = isPrimarySite;
module.exports.icnRegex = icnRegex;
module.exports.dfnRegex = dfnRegex;
module.exports.isIcn = isIcn;
module.exports.isDfn = isDfn;
module.exports.isSiteIcn = isSiteIcn;
module.exports.isSiteDfn = isSiteDfn;
module.exports.isSiteEdipi = isSiteEdipi;
