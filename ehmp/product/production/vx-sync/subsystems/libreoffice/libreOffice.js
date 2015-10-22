'use strict';
var fsUtil = require(global.VX_UTILS + 'fs-utils');

var spawn = require('child_process').spawn;

var dummyLogger = require(global.VX_UTILS + 'dummy-logger');

function convert(file, destinationType, outputDir, config, handlerCallback, log) {
    if(!log) {log = dummyLogger;}
    log.debug('libreOffice.convert() : entering method');

    var command = config.documentStorage.officeLocation + 'soffice';
    log.debug('libreOffice.convert() : using command %s', command);

    log.debug('libreOffice.convert() : making sure LibreOffice exists in the correct directory...');
    if(!fsUtil.fileExistsSync(command)) {
        log.error('LibreOffice was not found in the expected location.');
        return handlerCallback('LibreOffice was not found');
    }
    try {
        run_cmd(command,['--headless','--convert-to', destinationType, file,'--outdir', outputDir], handlerCallback, log);
    } catch(e) {
        log.error('libreOffice.convert() : error encountered in converion process: %s' + e);
        handlerCallback(e);
    }
}

function run_cmd(cmd, args, end, log) {
    if(!log) {log = dummyLogger;}

    log.debug('libreOffice.run_cmd() : entering method with args cmd: %s, args: %s, end: %s', cmd, args, end);
    var child = spawn(cmd, args);

    log.debug('libreOffice.run_cmd() : setting listener for \'close\'');
    child.stdout.on('close', end);
}

module.exports.convert = convert;