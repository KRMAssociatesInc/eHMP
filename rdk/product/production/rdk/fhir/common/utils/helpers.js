/* jshint -W016 */
'use strict';

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
}

function pidFromUid(uid) {
    var regex = /[^:]+:[^:]+:[^:]+:([^:]+:[^:]+):[^:]*/;
    var match = uid.match(regex);

    if (!match || match.length < 2) {
        throw 'Invalid uid';
    }


    return match[1].replace(/:/, ';');
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports.isEmpty = isEmpty;
module.exports.generateUUID = generateUUID;
module.exports.pidFromUid = pidFromUid;
