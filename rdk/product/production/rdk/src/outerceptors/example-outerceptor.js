'use strict';

module.exports = example;
function example(req, res, body, callback) {
    body = JSON.parse(body);
    body.intercepted = true;
    body = JSON.stringify(body);
    var error = null;
    callback(error, req, res, body);
}
