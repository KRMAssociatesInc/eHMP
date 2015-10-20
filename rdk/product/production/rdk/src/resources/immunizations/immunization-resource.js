'use strict';

var rdk = require('../../core/rdk');
var _ = require('lodash');
var immuTypeOpData = require('./immu-type-op-data');
var immuLotNumOpData = require('./immu-lot-num-op-data');
var immuAnatomLocOpData = require('./immu-anatom-loc-op-data');
var immuManufacturersList = require('./immu-manufacturer-op-data');
var immuInfoSourceList = require('./immu-info-source-op-data');
var immuRouteOfAdminOpData = require('./immu-route-of-admin-op-data');

function getResourceConfig() {
    return [
        {
            name: 'immunizationTypes',
            path: '/immunization-types',
            get: getImmunizationTypes,
            interceptors: {
                pep: false
            }
        },
        {
            name: 'lotNumbers',
            path: '/lot-numbers',
            get: getLotNumbers,
            parameters: {
                get: {
                    uri: {
                        required: true,
                        description: 'The URI value of the immunization type'
                    }
                }
            },
            interceptors: {
                pep: false
            }
        },
        {
            name: 'anatomicalLocations',
            path: '/anatomical-locations',
            get: getAnatomicalLocations,
            interceptors: {
                pep: false
            }
        },
        {
            name: 'manufacturers',
            path: '/manufacturers',
            get: getManufacturers,
            interceptors: {
                pep: false
            }
        },
        {
            name: 'informationSources',
            path: '/information-sources',
            get: getInformationSources,
            interceptors: {
                pep: false
            }
        },
        {
            name: 'routeOfAdministration',
            path: '/route-of-administration',
            get: getRouteOfAdministration,
            interceptors: {
                pep: false
            }
        }];
}

function getImmunizationTypes(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend(immuTypeOpData.immunizationTypesList);
}

function getLotNumbers(req, res) {
    if (!req.param('uri')) {
        res.status(rdk.httpstatus.not_found).rdkSend('Missing param: uri');
        return;
    }
    var json = _.filter(immuLotNumOpData.immunizationLotNumbersList, {
        vaccine: {
            value: req.param('uri')
        }
    });
    res.status(rdk.httpstatus.ok).rdkSend(json);
}

function getAnatomicalLocations(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend(immuAnatomLocOpData.immunizationAnatomLocList);
}

function getManufacturers(req, res) {
    var json = _.filter(immuManufacturersList.immunizationManufacturersList, {
        status: {
            value: 'ACTIVE'
        }
    });
    res.status(rdk.httpstatus.ok).rdkSend(json);
}

function getInformationSources(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend(immuInfoSourceList.immunizationInfoSourceList);
}

function getRouteOfAdministration(req, res) {
    res.status(rdk.httpstatus.ok).rdkSend(immuRouteOfAdminOpData.immunizationRouteOfAdminList);
}

module.exports.getResourceConfig = getResourceConfig;
