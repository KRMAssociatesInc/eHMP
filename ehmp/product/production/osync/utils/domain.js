'use strict';

require('../env-setup');
var _ = require('underscore');
var jmeadowsDomainList = require(global.OSYNC_ROOT + 'worker-config').jmeadows.domains;
var hdrDomainList = require(global.OSYNC_ROOT + 'worker-config').hdr.domains;
var vlerDomainList = require(global.OSYNC_ROOT + 'worker-config').vler.domains;

var domainList = [
    'allergy',
    'appointment',
    'consult',
    'cpt',
    'document',
    'vlerdocument',
    'exam',
    'education',
    'factor',
    'immunization',
    'lab',
    'med',
    'mh',
    'obs',
    'order',
    'problem',
    'procedure',
    'patient',
    'pov',
    'ptf',
    'image',
    'skin',
    'surgery',
    'task',
    'visit',
    'vital'
];

function getDomainList() {
    return _.clone(domainList);
}

function getJmeadowsDomainList(){
    return _.clone(jmeadowsDomainList);
}

function getHdrDomainList(){
    return _.clone(hdrDomainList);
}

function getVlerDomainList(){
    return _.clone(vlerDomainList);
}

module.exports.getDomainList = getDomainList;
module.exports.getJmeadowsDomainList = getJmeadowsDomainList;
module.exports.getHdrDomainList = getHdrDomainList;
module.exports.getVlerDomainList = getVlerDomainList;