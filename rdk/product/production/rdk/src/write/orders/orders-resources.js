'use strict';

var _ = require('lodash');
var dd = require('drilldown');
var writebackWorkflow = require('../core/writeback-workflow');
var writeVprToJds = require('../core/jds-direct-writer');
var getCommonOrderTasks = require('./common/orders-common-tasks');

var validateOrders = {};
validateOrders['Medication, Outpatient'] = require('./med/orders-med-validator');
validateOrders['Laboratory'] = require('./lab/orders-lab-validator');
validateOrders['Common'] = require('./common/orders-common-validator');

var writeOrderToVista = {};
writeOrderToVista['Medication, Outpatient'] = require('./med/orders-med-vista-writer');
writeOrderToVista['Laboratory'] = require('./lab/orders-lab-vista-writer');


module.exports.getResourceConfig = function() {
    return [{
        name: 'create',
        path: '',
        post: withOrderType('create'),
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'update',
        path: '/:resourceId',
        put: withOrderType('update'),
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'edit',
        path: '/:resourceId',
        get: commonOrder('edit'),
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }, {
        name: 'discontinue',
        path: '/:resourceId',
        delete: withOrderType('discontinue'),
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        permissions: [] // TODO set permissions. See https://wiki.vistacore.us/display/VACORE/Writeback+Edition+Permissions
    }];
};

function withOrderType(action) {
    return function(req, res) {
        var orderType = identifyOrderType(req);
        var tasks;
        if (orderType === 'Unhandled Order Type') {
            tasks = [handleUnhandledOrder];
            return writebackWorkflow(req, res, tasks);
        }
        var commonOrderTasks = getCommonOrderTasks(action, req.body);
        if (commonOrderTasks) {
            tasks = []
                .concat(validateOrders[orderType][action])
                .concat(commonOrderTasks)
                .concat(writeVprToJds);
        } else {
            tasks = [
                validateOrders[orderType][action],
                writeOrderToVista[orderType][action],
                writeVprToJds
            ];
        }
        writebackWorkflow(req, res, tasks);
    };
}

function commonOrder(action) {
    return function(req, res) {
        var tasks;
        var commonOrderTasks = getCommonOrderTasks(action, req.body);
        if (commonOrderTasks) {
            tasks = []
                .concat(validateOrders['Common'][action])
                .concat(commonOrderTasks)
                .concat(writeVprToJds);
        }else {
            tasks = [handleInvalidAction];
        }
        writebackWorkflow(req, res, tasks);
    }
}

function identifyOrderType(req) {
    //var orderType = dd(req.body)('kind').val;
    var orderType = req.body.kind;
    /*
     Known order types:
     Allergy/Adverse Reaction
     Consult
     Dietetics Order
     Laboratory
     Medication, Infusion
     Medication, Inpatient
     Medication, Non-VA
     Medication, Outpatient
     Nursing Order
     Radiology
     ZZVITALS Order
     */
    req.logger.info({
        orderType: orderType
    });
    var handledOrderTypes = [
        'Medication, Outpatient',
        'Laboratory'
    ];
    if (_.include(handledOrderTypes, orderType)) {
        return orderType;
    }
    req.logger.info('Unhandled order type');
    return 'Unhandled Order Type';
}

function handleUnhandledOrder(vistaContext, callback) {
    return setImmediate(callback, 'Unhandled order type supplied');
}

function handleInvalidAction(vistaContext, callback) {
    return setImmediate(callback, 'Unhandled action requested');
}

var medOrder = {
    // VPR+ template model for med order
};

var labOrder = {
    // VPR+ template model for lab order
};

module.exports._identifyOrderType = identifyOrderType;
