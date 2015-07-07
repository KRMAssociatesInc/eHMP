'use strict';

var moment = require('moment');

function createStampTime() {
    return moment().format('YYYYMMDDHHmmss');
}

module.exports.createStampTime = createStampTime;
