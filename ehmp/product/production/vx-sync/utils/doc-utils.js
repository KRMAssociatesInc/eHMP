'use strict';

//var fs = require('fs');
var format = require('util').format;
var path = require('path');
var crypto = require('crypto');

function getPatientDirByJob(job) {
    var uidUtil = require(global.VX_UTILS + 'uid-utils');
    var eventid = uidUtil.extractLocalIdFromUID(job.record.uid);
    var pidHex = new Buffer(job.patientIdentifier.value, 'utf8');
    return pidHex.toString('hex') + '/' + eventid;
}

function getPatientTopDirAbsPath(identifier, config) {
    var pidHex = new Buffer(identifier, 'utf8');
    return path.resolve(config.documentStorage.publish.path + '/' +  pidHex.toString('hex'));
}

function getDodComplexNoteUri(uriRoot, dir, htmlFilename) {
    return format(uriRoot + '?dir=%s&file=%s', dir, htmlFilename);
}

function getDocOutPathByJob(job, config) {
    var dir = getPatientDirByJob(job);
    return getDocOutPath(dir, config);
}

function getDocOutPath(dir, config) {
    return path.resolve(config.documentStorage.publish.path + '/' + dir);
}

function getRtfDocPathByJob(job, config) {
    var rtfFile = config.documentStorage.staging.path + '/' + job.record.fileJobId + '/' + job.record.fileId;
    return path.resolve(rtfFile);
}

function getSha1Filename(hashInput, fileExt) {
    var sha = crypto.createHash('sha1');
    sha.update(hashInput, 'binary');
    return sha.digest('hex') + fileExt;
}

function getStagingPermissons(config) {
    return config.documentStorage.staging.permissions;
}

function getTempStagingFilePath(config, job) {
    return path.resolve(config.documentStorage.staging.path + '/' + job.jobId);
}

/**************     file exists is not protected against race conditions         ***************/
module.exports.getPatientDirByJob = getPatientDirByJob;
module.exports.getStagingPermissons = getStagingPermissons;
module.exports.getTempStagingFilePath = getTempStagingFilePath;
module.exports.getPatientTopDirAbsPath = getPatientTopDirAbsPath;
module.exports.getDodComplexNoteUri = getDodComplexNoteUri;
module.exports.getRtfDocPathByJob = getRtfDocPathByJob;
module.exports.getSha1Filename = getSha1Filename;
module.exports.getDocOutPath = getDocOutPath;
module.exports.getDocOutPathByJob = getDocOutPathByJob;
