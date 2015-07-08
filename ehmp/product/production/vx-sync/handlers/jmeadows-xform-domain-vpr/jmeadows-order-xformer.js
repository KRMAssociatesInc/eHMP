'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');
var nc = require('namecase');

function dodOrderToVPR(dodRecord, edipi) {
    var vprOrder = {};

    vprOrder.codes = xformUtils.transformCodes(dodRecord.codes);
    vprOrder.facilityCode = 'DOD';
    vprOrder.facilityName = 'DOD';

    vprOrder.uid = uidUtils.getUidForDomain('order', 'DOD', edipi,
        dodRecord.cdrEventId);
    vprOrder.pid = 'DOD;' + edipi;

    vprOrder.name = dodRecord.orderDetail;
    vprOrder.content = dodRecord.orderDetail;
    vprOrder.summary = vprOrder.content;

    // Empty string is intended here
    vprOrder.statusName = '';

    if (dodRecord.orderingProvider && dodRecord.orderingProvider.name) {
        vprOrder.providerName = dodRecord.orderingProvider.name;
        vprOrder.providerDisplayName = nc(dodRecord.orderingProvider.name);
    }

    if (!_.isNull(dodRecord.orderDate) && !_.isUndefined(dodRecord.orderDate)) {
        vprOrder.entered = moment(dodRecord.orderDate, 'x').format(
            'YYYYMMDDHHmmss');
    }

    if (!_.isNull(dodRecord.startDate) && !_.isUndefined(dodRecord.startDate)) {
        vprOrder.start = moment(dodRecord.startDate, 'x').format(
            'YYYYMMDDHHmmss');
    }

    if (!_.isNull(dodRecord.completedDate) && !_.isUndefined(dodRecord.completedDate)) {
        vprOrder.stop = moment(dodRecord.completedDate, 'x').format(
            'YYYYMMDDHHmmss');
    }

    var orderType = dodRecord.type;
    if (!_.isNull(orderType) && !_.isUndefined(orderType)) {
        if (_.isEqual(orderType, 'CONSULT')) {
            vprOrder.service = 'GMRC';
        } else if (_.isEqual(orderType, 'LAB')) {
            vprOrder.service = 'LR';
        } else if (_.isEqual(orderType, 'MEDICATION')) {
            vprOrder.service = 'PSH';
        } else if (_.isEqual(orderType, 'RADIOLOGY')) {
            vprOrder.service = 'RA';
        }
    }

    vprOrder.kind = getKindForService(vprOrder.service);

    return vprOrder;
}

function getKindForService(service) {
    var kind = '';

    if (_.isEqual(service, 'PSJ')) {
        kind = 'Medication, Inpatient';
    } else if (_.isEqual(service, 'PSO')) {
        kind = 'Medication, Outpatient';
    } else if (_.isEqual(service, 'PSH')) {
        kind = 'Medication, Non-VA';
    } else if (_.isEqual(service, 'PSIV')) {
        kind = 'Medication, Infusion';
    } else if (_.isEqual(service, 'PSG')) {
        kind = 'Medication, Inpatient';
    } else if (_.isEqual(service, 'GMRA')) {
        kind = 'Allergy/Adverse Reaction';
    } else if (_.isEqual(service, 'GMRC')) {
        kind = 'Consult';
    } else if (_.isEqual(service, 'RA')) {
        kind = 'Radiology';
    } else if (_.isEqual(service, 'FH')) {
        kind = 'Dietetics Order';
    } else if (_.isEqual(service, 'LR')) {
        kind = 'Laboratory';
    } else if (_.isEqual(service, 'OR')) {
        kind = 'Nursing Order';
    } else if (_.isEqual(service, 'VBEC')) {
        kind = 'Blood Bank Order';
    } else if (_.isEqual(service, 'ZZRV')) {
        kind = 'ZZVITALS Order';
    }

    return kind;
}

module.exports = dodOrderToVPR;