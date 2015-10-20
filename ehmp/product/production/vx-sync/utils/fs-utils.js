'use strict';

var fs = require('fs');
var _ = require('underscore');
var mkdirp = require('mkdirp');

function rmDir(removeSelf, dirPath) {
    var files;
    if (removeSelf === undefined) {
        removeSelf = true;
    }
    try {
        files = fs.readdirSync(dirPath);
    } catch (e) {
        return;
    }
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (!deleteFile(filePath)) {
                rmDir(true, filePath);
                if (fs.statSync(filePath).isDirectory()) {
                    fs.rmdirSync(filePath);
                }
            }
        }
    }
}

var deleteAllFiles = rmDir.bind(undefined, false);

function deleteFile(path) {
    var filePath = path;
    if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

function writeFile(log, path, filename, permissions, file, tryAgainCallback, callback) {
    fs.open(path+'/'+filename,'wx',permissions, function(err, fd){
        if(err) {
            if(_.isObject(err) && err.code && err.code === 'EEXIST') {
                tryAgainCallback(log, path, permissions, file, callback);  //name already taken, try again
            } else {    //other unknown error
                log.error(err);
                return callback('Unknown error writing JMeadows document ' + err);
            }
        } else {
            fs.write(fd, file, 0, file.length, null, function(err) {
                callback(err, filename);
            });
        }
    });
}

function copyFile(oldPath, newPath, callback) {
    var outDir = newPath.substring(0, newPath.lastIndexOf('/'));
    createPath(outDir, null, function(error) {
        if(!error) {
            var instream = fs.createReadStream(oldPath);
            var outstream = fs.createWriteStream(newPath);
            outstream.on('finish', function(){
                callback();
            });
            outstream.on('error', function(err){
                callback(err);
            });
            instream.on('error', function(err){
                callback(err);
            });
            instream.pipe(outstream);
        } else {
            callback(error);
        }
    });
}

function createPath(path, permissions, callback) {
    permissions = permissions || '700';
    mkdirp(path, permissions, callback);
}

/**************     file exists is not protected against race conditions         ***************/
module.exports.fileExists = fs.exists;
module.exports.fileExistsSync = fs.existsSync;  //Args: 1 = file path
module.exports.renameFile = fs.rename;          //Args: 1 = old Path 2 = new Path 3 = callback
module.exports.moveFile = fs.rename;            //Args: 1 = old Path 2 = new Path 3 = callback
module.exports.copyFile = copyFile;             //Args: 1 = old path 2 = new path
module.exports.readFileSync = fs.readFileSync;  //Args: 1 = file path
module.exports.deleteFile = deleteFile;         //Args: 1 = file path
module.exports.createPath = createPath;         //Args: 1 = directory path 2 = permissions (optional) 3 = callback
module.exports.deleteAllFiles = deleteAllFiles; //Args: 1 = directory path
module.exports.writeFile = writeFile;