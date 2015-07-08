'use strict';

var inspect = require(global.VX_UTILS + 'inspect');

function rejectAll(log, config, environment, patientIdentifiers, exceptions, callback) {
    log.debug('reject-all-rule.rejectAll() : Running reject-all-rule on ' + inspect(patientIdentifiers));
    return callback(null, []);
}

function loadRule() {
    return rejectAll;
}

module.exports = loadRule;