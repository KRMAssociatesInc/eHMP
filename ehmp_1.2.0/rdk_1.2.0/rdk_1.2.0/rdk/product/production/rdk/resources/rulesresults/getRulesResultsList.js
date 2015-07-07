/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = require('../../utils/http-wrapper/http');
var util = require('util');

var NodeCache = require('node-cache');
var rulesCache = new NodeCache();

//begin code to remove after verification for US3793/US3798
var request = require('request');
var logResponseUri = 'http://10.2.2.49:3000/api/logresponse';
var logRequestUri = 'http://10.2.2.49:3000/api/logrequest';

function logResponse(body, code) {
    var options = {
        uri: logResponseUri,
        method: 'POST',
        json: {
            'source': 'RDK Rules Results',
            'destination': 'CDS Advice Applet',
            'code': code,
            'body': body,
        }
    };
    request(options, function ( /*error, response, body*/ ) {
        //Just drop the error on the floor if we have one...this is non-essential stuff...
        //console.log(error);
    });
}

function logRequest(type, url) {
    var options = {
        uri: logRequestUri,
        method: 'POST',
        json: {
            'source': 'CDS Advice Applet',
            'destination': 'RDK Rules Results',
            'type': type,
            'url': url,
            'body': '',
        }
    };
    request(options, function ( /*error, response, body*/ ) {
        //Just drop the error on the floor if we have one...this is non-essential stuff...
        //console.log(error);
    });
}

function getUrl(req) {
    if (req && req.headers) {
        return (req.protocol || '{unknown}') + '://' + (req.headers.host || '{unknown}') +
            (req.originalUrl || req.url || '/{unknown}');
    } else {
        return '{no request information is available}';
    }
}
//end code to remove after verification for US3793/US3798


/* just stub this out, not sure if any post processing will be needed. */
function processJSON(input) {
    var items = input.results;
    return {
        data: {
            items: items
        }
    };
}

function createKey(pid, use) {
    return 'rules-result' + pid + use;
}

function getRulesResultsList(req, res /*, next*/ ) {
    req.logger.info('Rules Results - list resource GET called');

    var thisres = res;

    var pid = req.param('pid');
    var use = req.param('use');
    var useCachedValue = req.param('cache');

    req.logger.debug('PID: ' + pid);
    req.logger.debug('USE: ' + use);
    req.logger.debug('USE CACHED RESULTS: ' + useCachedValue);

    //begin remove after verification for US3793/US3798
    logRequest('GET', getUrl(req));
    //end remove after verification for US3793/US3798

    if (nullchecker.isNullish(pid) || nullchecker.isNullish(use)) {
        req.logger.error('Rules Results - missing or null parameters');
        return res.status(rdk.httpstatus.bad_request).end();
    }

    var cacheKey = createKey(pid, use);
    req.logger.debug('rules result cache key: ' + cacheKey);
    //if we scope this to the session, we can get it here: 'req.session.id';
    var cachedValue = rulesCache.get(cacheKey);

    if (useCachedValue === 'true' && (Object.keys(cachedValue).length !== 0)) {
        req.logger.debug('rules results cache hit for key: ' + cacheKey + ' value: ' + cachedValue);
        return res.send(rdk.httpstatus.ok, cachedValue[cacheKey]);
    }

    if (use === 'test') {
        var items = [{
                'id': '200abcd',
                'priority': 40,
                'type': 0,
                'title': 'Due Colonoscopy',
                'details': 'Patient John Smith is due for a colonoscopy.',
                'provenance': 'The U.S. Preventive Services Task Force (USPSTF) recommends screening for colorectal cancer using high-sensitivity fecal occult blood testing, sigmoidoscopy, or colonoscopy beginning at age 50 years and continuing until age 75 years. [source: http://www.cdc.gov/cancer/colorectal/basic_info/screening/guidelines.htm]'
        },
            {
                'id': '300xyz',
                'priority': 30,
                'type': 0,
                'title': 'Lab tests',
                'details': 'Patient John Smith is due for lab tests.',
                'provenance': 'The U.S. Preventive Services Task Force (USPSTF) recommends screening...'
        }];

        var data = JSON.stringify({
            'data': {
                'items': items
            }
        });

        //cache result.
        req.logger.debug('caching rules results key: ' + cacheKey + ' value: ' + data);
        rulesCache.set(cacheKey, data, 900000); //15 minute cache life.

        //begin remove after verification for US3793/US3798
        logResponse(JSON.stringify(data), rdk.httpstatus.ok);
        //end remove after verification for US3793/US3798

        return thisres.status(rdk.httpstatus.ok).send(data);
    }

    // this needs to be moved to config.js
    var cdsInvocationServer = {
        host: '10.2.2.49',
        port: '8080',
        path: '/cds-results-service/rest/invokeRulesForPatient',
        method: 'POST'
    };
    //
    var options = {
        host: cdsInvocationServer.host,
        port: cdsInvocationServer.port,
        path: cdsInvocationServer.path,
        method: cdsInvocationServer.method
    };
    var config = {
        timeoutMillis: 50000,
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    var content = {
        context: {
            patientId: pid,
            userId: req.session.user.username, //req.session.user.duz[0],
            siteId: req.session.user.site,
            credentials: '11111' //req.session.cookie
        },
        reason: use
    };

    req.logger.info('Rules Results - service post called');
    httpUtil.post(
        content,
        config,
        function (err, response) {
            req.logger.debug('callback from fetch()');
            if (err) {
                // there was an error calling the invocation server
                req.logger.debug('CDS Advice: error calling cds invocation server=' + util.inspect(err, {
                    depth: null
                }));
                return res.status(rdk.httpstatus.internal_server_error).json(err);
            }
            req.logger.debug('callback response=' + util.inspect(response, {
                depth: null
            }));

            //cache this...
            req.logger.debug('caching rules results key: ' + cacheKey + ' value: ' + response);
            rulesCache.set(cacheKey, response, 900000); //15 minute cache life

            res.status(rdk.httpstatus.ok).send(response);

            //begin remove after verification for US3793/US3798
            logResponse(JSON.stringify(response), rdk.httpstatus.ok);
            //end remove after verification for US3793/US3798

            //  next();
            req.logger.info('Rules Results - response: %s', JSON.stringify(response));
            return '';
        },
        function (statusCode, response) {
            // parse response
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    req.logger.info('Rules Results - bad response: %s', response);
                }
            }
            req.logger.info('Rules Results - service response: %s', JSON.stringify(response));
            return processJSON(response);
        }
    );
}

module.exports.getRulesResultsList = getRulesResultsList;
