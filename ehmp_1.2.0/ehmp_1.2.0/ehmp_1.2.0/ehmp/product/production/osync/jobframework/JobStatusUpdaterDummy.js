'use strict';

function configure(setLog, setConfig) {
    return module.exports;
}

function writeStatus(jobState, callback) {
    callback(null, 'success');
}

function createJobStatus(job, callback) {
    module.exports.writeStatus(job, callback);
}

function startJobStatus(job, callback) {
    module.exports.writeStatus(job, callback);
}

function completeJobStatus(job, callback) {
    module.exports.writeStatus(job, callback);
}

function errorJobStatus(job, error, callback) {
    job.status = 'error';
    job.error = error;

    module.exports.writeStatus(job, callback);
}

module.exports = {
    'configure': configure,
    'writeStatus': writeStatus,
    'createJobStatus': createJobStatus,
    'startJobStatus': startJobStatus,
    'completeJobStatus': completeJobStatus,
    'errorJobStatus': errorJobStatus
};