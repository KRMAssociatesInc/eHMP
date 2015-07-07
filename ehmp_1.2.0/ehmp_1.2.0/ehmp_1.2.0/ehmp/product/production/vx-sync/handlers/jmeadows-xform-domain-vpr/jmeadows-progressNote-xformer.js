'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

function dodNoteToVPR(dodNote, edipi){
    var vprNote = {};
    vprNote.referenceDateTime = moment(dodNote.noteDate, 'x').format('YYYYMMDDHHmmss');
    vprNote.codes = xformUtils.transformCodes(dodNote.codes);
    vprNote.localTitle = dodNote.noteTitle;
    vprNote.documentTypeName = dodNote.noteType;
    if (dodNote.provider && dodNote.provider.name) {
        vprNote.author = dodNote.provider.name;
        vprNote.authorDisplayName = dodNote.provider.name;
    }
    vprNote.status = 'completed';
    vprNote.statusName = 'completed';
    vprNote.facilityName = 'DOD';
    vprNote.facilityCode = 'DOD';
    vprNote.uid = uidUtils.getUidForDomain('document', 'DOD', edipi, dodNote.cdrEventId);
    vprNote.pid = 'DOD;' + edipi;
    vprNote.text = [];
    if(dodNote.noteText && dodNote.status!=='RTF'){
        vprNote.text = [{
            content: dodNote.noteText,
            dateTime: vprNote.referenceDateTime,
            status: 'completed',
            uid: vprNote.uid
        }];
    }

    //This was not part of the Java transformation
    //but must be included for our method of document conversion
    vprNote.dodComplexNoteUri = dodNote.complexDataUrl;

    return vprNote;
}

module.exports = dodNoteToVPR;