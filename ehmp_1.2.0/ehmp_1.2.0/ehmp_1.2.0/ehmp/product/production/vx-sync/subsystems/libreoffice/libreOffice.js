'use strict';
var fsUtil = require(global.VX_UTILS + 'fs-utils');

var spawn = require('child_process').spawn;

function convert(file, destinationType, outputDir, config, handlerCallback) {
    var command = config.documentStorage.officeLocation + 'soffice';
    if(!fsUtil.fileExistsSync(command)) {
        return handlerCallback('LibreOffice was not found');
    }
    try {
        run_cmd(command,['--headless','--convert-to', destinationType, file,'--outdir', outputDir], handlerCallback);
    } catch(e) {
        handlerCallback(e);
    }
}

function run_cmd(cmd, args, end) {
    var child = spawn(cmd, args);
    child.stdout.on('close', end);
}

module.exports.convert = convert;