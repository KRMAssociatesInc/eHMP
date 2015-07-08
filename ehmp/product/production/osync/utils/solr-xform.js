'use strict';

//---------------------------------------------------------------------------------------------
// This is used to create a transform to the SOLR format of the record.
//
// @Author: Les Westberg, Will McVay
//---------------------------------------------------------------------------------------------

require('../env-setup');

var _ = require('underscore');
var util = require('util');
var uidUtil = require(global.OSYNC_UTILS + 'uid-utils');

//---------------------------------------------------------------------------------------------
// This is used to create a transform to the SOLR format of the record.
//
// record: The record in VPR format.
// log: The logger to output log messages to.
//---------------------------------------------------------------------------------------------
function xformVprToSolr(record, log) {

    var domain;
    if ((_.isObject(record)) && (_.isString(record.uid))) {
        domain = uidUtil.extractDomainFromUID(record.uid);
    }

    if ((!_.isString(domain)) || (_.isEmpty(domain))) {
        log.info('solr-xform.xformVprToSolr: Record did not contain a uid with a valid domain.  record: %j', record);
        return null;
    }

    var xformer;

    try {
        xformer = require(util.format('./solr-xform/solr-%s-xform', domain));
    }
    catch (e) {
        log.info('solr-xform.xformVprToSolr: No solr transform available for domain: %s', domain);
        return null;
    }

    return xformer(record, log);
}

module.exports = xformVprToSolr;