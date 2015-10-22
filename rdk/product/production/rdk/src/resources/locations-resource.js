'use strict';

var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var rdk = require('../core/rdk');
var VistaJS = rdk.utils.VistaJS;
var httpUtil = rdk.utils.http;
var jdsFilter = require('jds-filter');
var dateUtil = require('../utils/fileman-date-converter');
var maskPtSelectSsn = require('./patient-search/search-mask-ssn').maskPtSelectSsn;

var getLocationDataParameters = {
    get: {
        name: {
            required: false,
            description: 'Case-insensitive "starts-with" search on the "name" field'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results per page'
        },
        facilityCode: {
            required: false,
            description: 'Case sensitive exact match against the "facilityCode" field'
        },
        siteCode: {
            required: false,
            description: 'Case sensitive exact match against the site code piece of the colon-delimited "uid" field'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};

var apiDocs = {
    locationData: {
        spec: {
            nickname: 'locations-{type}',
            path: '/locations/{type}',
            summary: 'Get list of clinics or wards',
            notes: '',
            parameters: [
                rdk.docs.swagger.paramTypes.path('type', 'location type', 'string', ['wards', 'clinics'], true),
                rdk.docs.swagger.paramTypes.query('name', 'Case-insensitive "starts-with" search on the "name" field', 'string', false),
                rdk.docs.swagger.paramTypes.query('facility.code', 'Case sensitive exact match against the "facilityCode" field', 'string', false),
                rdk.docs.swagger.paramTypes.query('site.code', 'Case sensitive exact match against the site code piece of the colon-delimited "uid" field', 'string', false),
                rdk.docs.commonParams.jds.start,
                rdk.docs.commonParams.jds.limit,
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    },
    search: {
        spec: {
            nickname: 'locations-{type}-search',
            path: '/locations/{type}/patients',
            summary: 'Get patients for a particular clinic/ward',
            notes: '',
            parameters: [
                rdk.docs.swagger.paramTypes.path('type', 'location type', 'string', ['wards', 'clinics']),
                rdk.docs.commonParams.uid('ward|clinic', true),
                rdk.docs.swagger.paramTypes.query('ref.id', 'refId of ward|clinic field', 'string', false),
                rdk.docs.swagger.paramTypes.query('date.start', '(REQUIRED for clinic only) YYYYMMDD, defaults to today ', 'string', false),
                rdk.docs.swagger.paramTypes.query('date.end', '(applicable to clinic only) YYYYMMDD, defaults to today ', 'string', false),
                rdk.docs.commonParams.jds.filter,
                rdk.docs.commonParams.jds.order
            ],
            responseMessages: []
        }
    }
};

var searchParameters = {};
searchParameters.ward = {
    get: {
        filter: {
            required: false,
            description: 'Limit the result set of patients with JDS-format filters'
        },
        locationUid: {
            required: true,
            description: 'Location uid of ward'
        },
        refId: {
            required: true,
            description: 'refId of ward'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};
searchParameters.clinic = {
    get: {
        filter: {
            required: false,
            description: 'Limit the result set of patients with JDS-format filters'
        },
        locationUid: {
            required: true,
            description: 'Location uid of clinic'
        },
        startDate: {
            required: false,
            description: 'YYYYMMDD, defaults to today'
        },
        stopDate: {
            required: false,
            description: 'YYYYMMDD, defaults to today'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};

function getResourceConfig() {
    return [].concat(
        _.map(['wards', 'clinics'], function(value) {
            return {
                name: value,
                path: value,
                get: getLocationData.bind(null, value),
                interceptors: {
                    jdsFilter: true,
                    pep: false,
                    synchronize: false
                },
                parameters: getLocationDataParameters,
                apiDocs: apiDocs.locationData,
                healthcheck: {
                    dependencies: ['patientrecord','jds','solr','jdsSync']
                }
            };
        }),
        _.map(['ward', 'clinic'], function(locationType) {
            return {
                name: util.format('%ss-search', locationType),
                path: util.format('%ss/patients', locationType),
                get: searchLocation.bind(null, locationType),
                interceptors: {
                    jdsFilter: true,
                    pep: false,
                    synchronize: false
                },
                parameters: searchParameters[locationType],
                apiDocs: apiDocs.search,
                healthcheck: {
                    dependencies: ['patientrecord','jds','solr','jdsSync']
                }
            };
        })
    );
}

function buildUrlPath(locationType, req) {
    var range = req.param('name');
    var facilityCode = req.param('facility.code');
    var siteCode = req.param('site.code');

    var queryObj = _.pick(req.query, 'start', 'limit', 'order');

    if(range) {
        queryObj.range = range + '*';
    }

    var filter;
    if(!req.interceptorResults.jdsFilter.error && req.interceptorResults.jdsFilter.filter) {
        filter = req.interceptorResults.jdsFilter.filter;
    } else {
        filter = [];
    }
    if(facilityCode) {
        filter.push(['eq', 'facilityCode', facilityCode]);
    }
    if(siteCode) {
        filter.push(['ilike', 'uid', util.format('%:%s:%', siteCode)]);
    }
    filter.push(['eq', 'oos', 'false']);
    filter.push(['not', ['exists', 'inactive']]);
    if(filter.length > 0) {
        queryObj.filter = jdsFilter.build(filter);
    }

    var baseUrl = util.format('/data/index/locations-%s', locationType);
    return util.format('%s?%s', baseUrl, querystring.stringify(queryObj));
}

function getLocationData(locationType, req, res) {
    var jdsPath = buildUrlPath(locationType, req);

    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });

    var config = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger,
        options: options
    };

    req.audit.dataDomain = locationType;
    req.audit.logCategory = 'SUPPORT';

    req.logger.info('Retrieve %s from JDS: %s://%s:%s%s', locationType, config.protocol, options.host, options.port, options.path);
    rdk.utils.http.fetch(req.app.config, config, function(error, result) {
        req.logger.debug('callback from fetchLocationData()');
        if(error) {
            handleError(req.logger, res, error, locationType, jdsPath);
        } else {
            var obj;
            try {
                obj = JSON.parse(result);
                if('data' in obj) {
                    res.rdkSend(obj);
                } else if('error' in obj) {
                    handleError(req.logger, res, obj, locationType, jdsPath);
                }
            } catch(err) {
                req.logger.error(err);
                handleError(req.logger, res, err, locationType, jdsPath);
            }
        }
    });
}

function searchLocation(locationType, req, res, next) {
    /*
    locationUid and refId come from /data/index/locations-{clinics,wards}

    location uid example: urn:va:location:C877:158
    location uids have a site code and the ien of a 'hospital location' file,
    which is not a clinic or ward.

    refId is the ward or clinic ien

    filter is required to prevent a search from showing every patient in a clinic or ward by default
     */
    var location = req.param('uid');
    var refId;
    if (req.param('ref.id') !== undefined) {
        refId = req.param('ref.id');
    }

    if(!location && !refId) {
        return next();
    }
    var locationRegex = /^urn:(?:va:)?(?:location:)?([^:]*):(\w*)$/;
    if(!locationRegex.test(location)) {
        return next();
    }

    var siteCode = location.match(locationRegex)[1];
    if(!_.has(req.app.config.vistaSites, siteCode)) {
        return res.status(500).rdkSend(new Error('Unknown VistA'));
    }
    var vistaConfig = _.extend({}, req.app.config.vistaSites[siteCode], {
        context: 'HMP UI CONTEXT'
    });

    var vistaRpc;
    var parameters;
    if(locationType === 'clinic') {
        location = location.split(':')[4];
        parameters = [location];
        addClinicParameters(req, parameters);
        vistaRpc = 'ORQPT CLINIC PATIENTS';
    }
    if(locationType === 'ward') {
        parameters = [refId];
        vistaRpc = 'ORWPT BYWARD';
    }

    async.waterfall(
        [
            VistaJS.callRpc.bind(VistaJS, req.logger, vistaConfig, vistaRpc, parameters),
            extractPatientInfoFromRpc.bind(null, req, locationType),
            selectPatientsFromDfns.bind(null, req, locationType, siteCode)
        ],
        function(err, result) {
            if(err) {
                if(err instanceof Error) {
                    return res.status(500).rdkSend(err.message);
                } else {
                    return res.status(200).rdkSend(err);
                }
            }

            if(!_.isObject(result)) {
                        return res.status(500).rdkSend(result);
                }
            return res.status(200).rdkSend(result);
        }
    );

}

/**
 * Mutates parameters
 */
function addClinicParameters(req, parameters) {
    // start date and stop date are required but start date can be (an empty string, which defaults to today in vista)
    var startDate = req.param('date.start') || '';
    var stopDate = req.param('date.end') || moment().format('YYYYMMDD');
    parameters.push(startDate);
    parameters.push(stopDate);
}

function extractPatientInfoFromRpc(req, locationType, rpcResponse, callback) {
    var error = rpcResponse.match(/^\s*\^(.*)/);  // Only the errors start with ^
    if(error) {
        if(error[1].match(/^Server Error/i)) {
            return callback(new Error(error[1]));
        }
        return callback(error[1]);
    }
    var patients = rpcResponse.split('\r\n');
    var patientDfnRoomBed = _.map(patients, function (patient) {
        var patientInfo = patient.split('^');
        if (patientInfo.length === 0 || patientInfo[0].length === 0) {
            return;
        }
        var patientLocationInfo = {
            clinic: { dfn: patientInfo[0], appointmentTime: dateUtil.getVprDateTime(patientInfo[3]) },
            ward: { dfn: patientInfo[0], roomBed: patientInfo[2].trim() }
        };
        return patientLocationInfo[locationType];
    });
    //If this request is for a ward, roll up any duplicate patients.
    //For clinics we want to show each appointment associated with a patient
    if(locationType === 'ward'){
        patientDfnRoomBed = _.uniq(_.compact(patientDfnRoomBed), function(patient) {return patient.dfn;});
    }
    else if( locationType === 'clinic'){
        patientDfnRoomBed = _.compact(patientDfnRoomBed);
    }
    if (patientDfnRoomBed.length === 0) {
        return callback('No patients found');
    }
    callback(null, patientDfnRoomBed);
}

function selectPatientsFromDfns(req, locationType, siteCode, patientInfoFromRpc, callback) {
    var range = _.map(_.pluck(patientInfoFromRpc, 'dfn'), function(dfn) {
        return siteCode + ';' + dfn;
    }).join(',');

    var jdsQuery = {};
    jdsQuery.range = range;
    if(req.query.filter) {
        jdsQuery.filter = req.query.filter;
    }
    if(req.query.order) {
        jdsQuery.order = req.query.order;
    }
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsResource = '/data/index/pt-select-pid';
    var jdsPath = jdsResource + '?' + jdsQueryString;
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var jdsConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger,
        options: options
    };
    return httpUtil.fetch(req.app.config, jdsConfig, callback, function processor(statusCode, patientInfo) {
        try {
            patientInfo = JSON.parse(patientInfo);
            if(locationType === 'ward') {
                var dfnsWithRoomBed = _.filter(patientInfoFromRpc, function (dfnRoomBedItem) {
                    return (dfnRoomBedItem.roomBed !== '');
                });
                addRoomBedToPatientInfo(dfnsWithRoomBed, patientInfo);
            }
            else if(locationType === 'clinic'){
                addAppointmentDateToPatientInfo(patientInfoFromRpc, patientInfo);
            }
        } catch(e) {
            // do nothing
        }
        patientInfo = maskPtSelectSsn(patientInfo);
        return patientInfo;
    });
}

/**
 * Mutates patientInfo
 */
function addRoomBedToPatientInfo(dfnsWithRoomBed, patientInfo) {
    _.each(dfnsWithRoomBed, function(dfnWithRoomBed) {
        var patientThatNeedsRoomBed = _.findWhere(patientInfo.data.items, {localId: dfnWithRoomBed.dfn});
        if(patientThatNeedsRoomBed) {
            patientThatNeedsRoomBed.roomBed = dfnWithRoomBed.roomBed;
        }
    });
}

/**
 * Adds the appointment time to the patient info object
 */
function addAppointmentDateToPatientInfo(dataFromRpc, patientInfo) {
    _.each(dataFromRpc, function(dataFromRpc) {
        var patient= _.findWhere(patientInfo.data.items, {localId: dataFromRpc.dfn});
        if(patient) {
            patient.appointmentTime = dataFromRpc.appointmentTime;
        }
    });
}

function handleError(logger, res, error, locationType, jdsPath) {
    logger.error('Error parsing results of retrieving %s with path=%s\n%s', locationType, jdsPath, util.inspect(error, {
        depth: null
    }));

    res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
}


module.exports.getResourceConfig = getResourceConfig;
module.exports._getLocationData = getLocationData;
module.exports._handleError = handleError;
module.exports._buildUrlPath = buildUrlPath;
module.exports._extractDfnsFromRpc = extractPatientInfoFromRpc;
