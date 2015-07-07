'use strict';

var inspect = require(global.VX_UTILS + 'inspect');

function acceptAll(log, config, environment, patientIdentifiers, exceptions, callback) {
    log.debug('accept-all-rule.acceptAll() : Running accept-all-rule on ' + inspect(patientIdentifiers));
    return callback(null, patientIdentifiers);
}

function loadRule() {
    return acceptAll;
}

module.exports = loadRule;