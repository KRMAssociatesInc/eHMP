/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var VistaJS = require('../../VistaJS/VistaJS');
var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var filemanDateUtil = require('../../utils/filemanDateUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var paramUtil = require('../../utils/paramUtil');
var _ = require('underscore');

var MATCHES_FOUND = 'matches found';
var DATE_DISPLAY_FORMAT = 'MMM DD YYYY';

function getResourceConfig() {
    return [{
        name: 'getProblems',
        path: '',
        get: getProblems,
        parameters: {
            get: {
                searchfor: {
                    required: true,
                    description: 'the term used to used to search for problems'
                },
                uncoded: {
                    required: false,
                    description: 'type of return view'
                },
                limit: {
                    required: false,
                    description: 'the maximum number of problems to return from the search'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: 'Returns array of problem items that match submitted search term',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('query', 'the term used to used to search for problems', 'string', true),
                    rdk.docs.swagger.paramTypes.query('uncoded', 'type of return view', 'string', true),
                    rdk.docs.commonParams.jds.limit
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns array of problem items that match submitted search term'
        },
        interceptors: {
            pep: false
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jdsSync']
        }
    }, {
        name: 'AddProblem',
        path: '',
        put: addProblem,
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jdsSync']
        },
        permissions: ['add-patient-problem'],
        parameters: {
            put: {
                patientIEN: {
                    required: true,
                    description: 'the patient IEN'
                },
                patientName: {
                    required: true,
                    description: 'the name of the patient'
                },
                providerIEN: {
                    required: true,
                    description: 'the user IEN adding the new problem'
                },
                lexiconCode: {
                    required: true,
                    description: 'code from lexicon search'
                },
                problemName: {
                    required: true,
                    description: 'the name of the problem'
                },
                status: {
                    required: true,
                    description: 'status of problem'
                },
                problemNumber: {
                    required: true,
                    description: 'the number associated with the problem'
                },
                enteredBy: {
                    required: true,
                    description: 'the name of the user entering the new problem'
                },
                enteredByIEN: {
                    required: true,
                    description: 'the IEN of the user entering the new problem'
                },
                dateRecorded: {
                    required: true,
                    description: 'the date of when the new problem is recorded'
                },
                acuity: {
                    required: false,
                    description: 'the problem priority; possible values are acute/chronic/unknown'
                },
                recordingProvider: {
                    required: false,
                    description: 'the provider recording the problem'
                },
                recordingProviderIEN: {
                    required: false,
                    description: 'the provider IEN recording the problem'
                },
                responsibleProvider: {
                    required: false,
                    description: 'the provider responsible for the problem'
                },
                responsibleProviderIEN: {
                    required: false,
                    description: 'the provider IEN responsible for the problem'
                },
                dateOfOnset: {
                    required: false,
                    description: 'the date of onset'
                },
                snomedCode: {
                    required: false,
                    description: 'the SNOMED CT concept code'
                },
                service: {
                    required: false,
                    description: 'the SNOMED CT designation code'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: 'Add a new problem',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.body('Problem', '', 'problems.add', undefined, true)
                ],
                responseMessages: []
            },
            models: {
                'problems.add': {
                    id: 'Problem',
                    required: ['patientIEN', 'patientName', 'providerIEN', 'lexiconCode', 'problemName', 'status', 'problemNumber', 'enteredBy', 'enteredByIEN', 'dateRecorded'],
                    properties: {
                        patientIEN: {
                            type: 'string',
                            description: 'the patient IEN'
                        },
                        patientName: {
                            type: 'string',
                            description: 'the name of the patient'
                        },
                        providerIEN: {
                            type: 'string',
                            description: 'the user IEN adding the new problem'
                        },
                        lexiconCode: {
                            type: 'string',
                            description: 'code from lexicon search'
                        },
                        problemName: {
                            type: 'string',
                            description: 'the name of the problem'
                        },
                        status: {
                            type: 'string',
                            description: 'status of problem'
                        },
                        problemNumber: {
                            type: 'string',
                            description: 'the number associated with the problem'
                        },
                        enteredBy: {
                            type: 'string',
                            description: 'the name of the user entering the new problem'
                        },
                        enteredByIEN: {
                            type: 'string',
                            description: 'the IEN of the user entering the new problem'
                        },
                        dateRecorded: {
                            type: 'string',
                            description: 'the date of when the new problem is recorded'
                        },
                        acuity: {
                            type: 'string',
                            description: 'the problem priority; possible values are acute/chronic/unknown'
                        },
                        recordingProvider: {
                            type: 'string',
                            description: 'the provider recording the problem'
                        },
                        recordingProviderIEN: {
                            type: 'string',
                            description: 'the provider IEN recording the problem'
                        },
                        responsibleProvider: {
                            type: 'string',
                            description: 'the provider responsible for the problem'
                        },
                        responsibleProviderIEN: {
                            type: 'string',
                            description: 'the provider IEN responsible for the problem'
                        },
                        dateOfOnset: {
                            type: 'string',
                            description: 'the date of onset'
                        },
                        snomedCode: {
                            type: 'string',
                            description: 'the SNOMED CT concept code'
                        },
                        service: {
                            type: 'string',
                            description: 'the SNOMED CT designation code'
                        }
                    }
                }
            }
        },
        description: {
            put: 'Add a new problem'
        }
    }, {
        name: 'UpdateProblem',
        path: '',
        post: updateProblem,
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: ['edit-patient-problem'],
        parameters: {
            post: {
                action: {
                    required: false,
                    description: 'update or delete'
                },
                problemNumber: {
                    required: true,
                    description: 'IEN of Problem'
                },
                userIEN: {
                    required: true,
                    description: 'the user IEN making changes to the new problem'
                },
                lexiconCode: {
                    required: false,
                    description: 'code from lexicon search'
                },
                dateLastModified: {
                    required: true,
                    description: 'Date last modified'
                },
                problemText: {
                    required: true,
                    description: 'the name of the problem'
                },
                dateOfOnset: {
                    required: true,
                    description: 'date of onset'
                },
                status: {
                    required: true,
                    description: 'status of problem'
                },
                comments: {
                    required: false,
                    description: 'comments regarding the problem'
                },
                agentOrange: {
                    required: false,
                    description: ''
                },
                acuity: {
                    required: false,
                    description: 'the problem priority; possible values are acute/chronic/unknown'
                },
                serviceConnected: {
                    required: false,
                    description: '0^NO 1^YES   default to ^UNKNOWN'
                },
                responsibleProviderIEN: {
                    required: false,
                    description: 'the provider IEN responsible for the problem'
                },
                responsibleProvider: {
                    required: false,
                    description: 'the provider responsible for the problem'
                },
                service: {
                    required: false,
                    description: 'the SNOMED CT designation code'
                },
                snomedCode: {
                    required: false,
                    description: 'the SNOMED CT concept code'
                },
                problemIEN: {
                    required: true,
                    description: 'IEN of Problem'
                },
                providerID: {
                    required: true,
                    description: 'the provider ID'
                },
                reason: {
                    required: false,
                    description: 'the reason to for deleting the problem'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: 'Edit or mark as removed an existing problem',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.body('Problem', '', 'problems.update', undefined, true)
                ],
                responseMessages: []
            },
            models: {
                'problems.update': {
                    id: 'Problem',
                    required: ['problemNumber', 'userIEN', 'dateLastModified', 'problemText', 'dateOfOnset', 'status', 'problemIEN', 'providerID'],
                    properties: {
                        action: {
                            type: 'string',
                            description: 'update or delete'
                        },
                        problemNumber: {
                            type: 'string',
                            description: 'IEN of Problem'
                        },
                        userIEN: {
                            type: 'string',
                            description: 'the user IEN making changes to the new problem'
                        },
                        lexiconCode: {
                            type: 'string',
                            description: 'code from lexicon search'
                        },
                        dateLastModified: {
                            type: 'string',
                            description: 'Date last modified'
                        },
                        problemText: {
                            type: 'string',
                            description: 'the name of the problem'
                        },
                        dateOfOnset: {
                            type: 'string',
                            description: 'date of onset'
                        },
                        status: {
                            type: 'string',
                            description: 'status of problem'
                        },
                        comments: {
                            type: 'string',
                            description: 'comments regarding the problem'
                        },
                        agentOrange: {
                            type: 'string',
                            description: ''
                        },
                        acuity: {
                            type: 'string',
                            description: 'the problem priority; possible values are acute/chronic/unknown'
                        },
                        serviceConnected: {
                            type: 'string',
                            description: '0^NO 1^YES   default to ^UNKNOWN'
                        },
                        responsibleProviderIEN: {
                            type: 'string',
                            description: 'the provider IEN responsible for the problem'
                        },
                        responsibleProvider: {
                            type: 'string',
                            description: 'the provider responsible for the problem'
                        },
                        service: {
                            type: 'string',
                            description: 'the SNOMED CT designation code'
                        },
                        snomedCode: {
                            type: 'string',
                            description: 'the SNOMED CT concept code'
                        },
                        problemIEN: {
                            type: 'string',
                            description: 'IEN of Problem'
                        },
                        providerID: {
                            type: 'string',
                            description: 'the provider ID'
                        },
                        reason: {
                            type: 'string',
                            description: 'the reason to for deleting the problem'
                        }
                    }
                }
            }
        },
        description: {
            post: 'Edit or mark as removed an existing problem'
        }
    }];
}

function getProblems(req, res) {
    req.logger.info('Problems resource GET called');
    req.audit.logCategory = 'PROBLEMS';

    getData(req, function(err, data) {
        if (typeof(err) === 'string') {
            req.logger.debug(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        }
        if (err) {
            req.logger.error(err.message);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        }
        res.status(rdk.httpstatus.ok).send({
            data: {
                items: data
            }
        });
    });
}

function massageData(req, input, limit) {
    if (_.isUndefined(input) || _.isNull(input)) {
        req.logger.debug('massageData: input is missing');
        return '';
    }

    var problems = input.split('\r\n');
    if (!_.isArray(problems)) {
        req.logger.debug('input is not an array');
        return '';
    }

    var retVals = [];

    // turn limit into an integer...
    var limitNumber = Number(limit);
    _.each(problems, function(problem, index) {
        var parts = problem.split('^');

        if (parts !== problem && (limitNumber === 0 || index < limitNumber)) {
            var foundProblem = new ProblemDefinition(problem);
            retVals.push(foundProblem);
        }
    });

    if (retVals.length !== 0) {
        // do not add the last entry if it is a mere count...
        var lastIndex = retVals.length - 1;
        if (retVals[lastIndex].problemNumber.indexOf(MATCHES_FOUND) !== -1) {
            retVals.splice(lastIndex, 1);
        }
    }

    return retVals;
}

function ProblemDefinition(input) {
    var parts = input.split('^');
    this.problemNumber = parts[0];
    this.problem = parts[1];
    this.icd = parts[2];
    this.lexiconCode = parts[2] + '^' + parts[3];
    this.snomed = parts[5];
    this.problemText = this.problem + ' ICD-10CM:(' + this.icd + ')';
}

/**
* Calls the problems RPC. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request.
* @param {function} callback - The function to call back to.
*/
function getData(req, callback) {
    var searchfor = req.param('query') || '';
    var uncoded = req.param('uncoded');
    var limit = req.param('limit') || '';

    var params = [];

    params[0] = searchfor;
    params[1] = (uncoded === undefined) ? 'PLS' : 'CLF';
    params[2] = 0;

    var rpcConfiguration = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfiguration.accessCode = req.session.user.accessCode;
    rpcConfiguration.verifyCode = req.session.user.verifyCode;

    VistaJS.callRpc(req.logger, rpcConfiguration, 'ORQQPL4 LEX', params, function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            return callback(error);
        }
        var returnMessage = result.trim();

        req.logger.debug('for ' + searchfor + ' we got ' + returnMessage);
        req.logger.debug('Type for: ' + returnMessage + ' is ' + typeof(returnMessage));
        if (returnMessage === '') {
            callback(null, 'No data');
            return;
        }
        if (typeof(returnMessage) === 'string') {
            if (returnMessage.indexOf('Please try a different search') !== -1) {
                callback('Search is unsupported');
                return;
            }
            if (returnMessage.indexOf('Code search failed') !== -1) {
                callback(null, 'No data');
                return;
            }
        }
        var problems = massageData(req, returnMessage, limit);
        callback(null, problems);
    });
}

function countOfComments(preExistingComments, comments) {
    if (nullchecker.isNullish(comments) || !Array.isArray(comments)) {
        return 0;
    }

    var retVal = 0;
    for (var i = 0; i < comments.length; i++) {

        if (!preExistingComments) {
            if (nullchecker.isNullish(comments[i].old)) {
                retVal++;
            }
        } else {
            if (nullchecker.isNotNullish(comments[i].old)) {
                retVal++;
            }
        }
    }

    return retVal;
}

function updateExistingComments(comments, params, currentIndex) {
    if (nullchecker.isNullish(comments) || !Array.isArray(comments)) {
        return;
    }

    // need to keep the indeces and comment text intact so the pattern matching
    // continues to work.
    // for update GMPFLD(10 contains the text to be updated
    // for delete GMPFLD(10 contains empty string
    for (var x = 1, index = 0; index < comments.length; x++, index++) {

        var before = comments[index].old;
        var after = comments[index]['new'];

        if (nullchecker.isNullish(before)) {
            // this is a new comment
            // will process after the existing ones...
            continue;
        }

        // it is a pre existing problem
        if (nullchecker.isNotNullish(before)) {
            // we know it is a change to an existing comment...

            if (nullchecker.isNotNullish(after)) {
                // this is an update
                params[currentIndex++] = 'GMPFLD(10,' + x + ')="' + x + '^1^' + after + '^A^^^"';
            } else {
                // a delete
                params[currentIndex++] = 'GMPFLD(10,' + x + ')="' + x + '^1^^A^^"';
            }

            params[currentIndex++] = 'GMPORIG(10,' + x + ')="' + x + '^1^' + before + '^A^^^"';
        }
    }
    return currentIndex;
}

function addNewComments(comments, params, currentIndex) {
    if (nullchecker.isNullish(comments) || !Array.isArray(comments)) {
        return;
    }

    // Rules of engagement is all new comments go at the end of the list
    // so once we find one, the rest are the same, new comments to get added.

    for (var x = 0; x < comments.length; x++) {
        if (nullchecker.isNotNullish(comments[x].old)) {
            // this is a pre existing comments.
            // bookkeep and move on
            continue;
        }

        params[currentIndex++] = 'GMPFLD(10,"NEW",' + (x + 1) + ')="' + comments[x]['new'] + '"';
    }
}

function processComments(comments, params, currentIndex) {

    if (nullchecker.isNullish(comments)) {
        params[currentIndex++] = 'GMPFLD(10,0)="0"';
        params[currentIndex++] = 'GMPORIG(10,0)="0^"';
        return;
    }

    var existingCommentsCount = countOfComments(true, comments);
    var newCommentCount = countOfComments(false, comments);

    params[currentIndex++] = 'GMPFLD(10,0)="' + (existingCommentsCount + newCommentCount) + '"';
    params[currentIndex++] = 'GMPORIG(10,0)="' + (existingCommentsCount === 0 ? '' : existingCommentsCount) + '^"';

    currentIndex = updateExistingComments(comments, params, currentIndex);

    addNewComments(comments, params, currentIndex);

    return params;
}

/**
* Calls the update problems RPC. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to update a problem.
* @param {Object} res - The default Express response.
* @param {Object} data - The data to use for updating the problem.
*/
function processUpdateRequest(req, res, data) {
    var params = {};
    var problemIEN = data.problemNumber;
    var userIEN = data.userIEN;
    var GMPLUSER = 1;
    var lexiconCode = data.lexiconCode || -1;
    var dateLastModified = data.dateLastModified; // 'GMPFLD(.03)="3141001^Oct 01 2014"'
    var problemText = data.problemText;
    var dateOfOnset = data.dateOfOnset;
    var status = data.status;
    var comments = data.comments || [];
    var agentOrange = data.agentOrange || ''; // sample is 0^AGENT ORANGE
    var acuity = data.acuity || ''; // sample "C^CHRONIC A^ACUTE
    var serviceConnected = data.serviceConnected || '0^NO'; // 0^NO 1^YES   default to ^UNKNOWN
    var responsibleProviderIEN = data.responsibleProviderIEN || ''; // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\"";
    var responsibleProvider = data.responsibleProvider || ''; // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\"";
    var location = data.service || '';
    var snomedCode = data.snomedCode || '';
    var dateObject = paramUtil.convertWriteBackInputDate(dateLastModified); //new Date(dateLastModified);
    dateLastModified = filemanDateUtil.getFilemanDate(dateObject.toDate()) + '^' + dateObject.format(DATE_DISPLAY_FORMAT);
    var currentDate = new Date();
    currentDate = filemanDateUtil.getFilemanDate(currentDate) + '^' + currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();
    dateObject = paramUtil.convertWriteBackInputDate(dateOfOnset); //new Date(dateOfOnset);
    dateOfOnset = filemanDateUtil.getFilemanDate(dateObject.toDate()) + '^' + dateObject.format(DATE_DISPLAY_FORMAT);

    params[0] = 'GMPFLD(.01)="' + lexiconCode + '"';
    params[1] = 'GMPFLD(.03)="' + dateLastModified + '"';
    params[2] = 'GMPFLD(.05)="^' + problemText + '"'; // 641^Acute myocardial infarction, unspecified site, episode of care unspecified"';
    params[3] = 'GMPFLD(.08)="' + currentDate + '"';
    params[4] = 'GMPFLD(.12)="' + status + '"';
    params[5] = 'GMPFLD(.13)="' + dateOfOnset + '"';
    //params[6] = 'GMPFLD(1.01)="269673^Test1 myocardial infarction, unspecified site, episode of care unspecified"';
    params[6] = 'GMPFLD(1.01)=""';
    params[7] = 'GMPFLD(1.02)=""';
    params[8] = 'GMPFLD(1.03)=""';
    params[9] = 'GMPFLD(1.04)=""';
    params[10] = 'GMPFLD(1.05)="' + responsibleProviderIEN + '^' + responsibleProvider + '"'; // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\"";
    //S ADDARRAY(11)="GMPFLD(1.05)=""10000000224^Lord,Brian""" ;responsible provider
    params[11] = 'GMPFLD(1.06)=""';
    params[12] = 'GMPFLD(1.07)=""';
    params[13] = 'GMPFLD(1.08)="' + location + '"';
    params[14] = 'GMPFLD(1.09)=""';
    params[16] = 'GMPFLD(1.1)="' + serviceConnected + '"';
    params[17] = 'GMPFLD(1.11)="' + agentOrange + '"';
    params[18] = 'GMPFLD(1.12)=""';
    params[19] = 'GMPFLD(1.13)=""';
    params[20] = 'GMPFLD(1.14)="' + acuity + '"';
    params[21] = 'GMPFLD(1.15)=""';
    params[22] = 'GMPFLD(1.16)=""';
    params[23] = 'GMPFLD(1.17)=""';
    params[24] = 'GMPFLD(1.18)=""';
    params[25] = 'GMPFLD(80001)="' + snomedCode + '"';
    params[26] = 'GMPFLD(80002)=""';
    params[27] = 'GMPFLD(80101)=""';
    params[28] = 'GMPFLD(80102)=""';

    var currentIndex = 29;

    params[currentIndex++] = 'GMPORIG(.01)=""';
    params[currentIndex++] = 'GMPORIG(.03)=""';
    params[currentIndex++] = 'GMPORIG(.05)=""';
    params[currentIndex++] = 'GMPORIG(.08)=""';
    params[currentIndex++] = 'GMPORIG(.12)=""';
    params[currentIndex++] = 'GMPORIG(.13)=""';
    params[currentIndex++] = 'GMPORIG(1.01)=""';
    params[currentIndex++] = 'GMPORIG(1.02)=""';
    params[currentIndex++] = 'GMPORIG(1.05)=""';
    params[currentIndex++] = 'GMPORIG(1.06)=""';
    params[currentIndex++] = 'GMPORIG(1.07)=""';
    params[currentIndex++] = 'GMPORIG(1.08)=""';
    params[currentIndex++] = 'GMPORIG(1.09)=""';
    params[currentIndex++] = 'GMPORIG(1.1)=""';
    params[currentIndex++] = 'GMPORIG(1.11)=""';
    params[currentIndex++] = 'GMPORIG(1.12)=""';
    params[currentIndex++] = 'GMPORIG(1.13)=""';
    params[currentIndex++] = 'GMPORIG(1.14)=""';
    params[currentIndex++] = 'GMPORIG(1.15)=""';
    params[currentIndex++] = 'GMPORIG(1.16)=""';
    params[currentIndex++] = 'GMPORIG(1.17)=""';
    params[currentIndex++] = 'GMPORIG(1.18)=""';

    processComments(comments, params, currentIndex);

    var siteId = sitetoStationID(req, req.session.user.site);

    req.logger.debug('problemIEN: ' + problemIEN);
    req.logger.debug('userIEN: ' + userIEN);
    req.logger.debug('siteId: ' + siteId);

    for (var i = 0; i < params.length; i++) {
        req.logger.debug('Index: ' + i + ' value: ' + params[i]);
    }

    var rpcConfiguration = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfiguration.accessCode = req.session.user.accessCode;
    rpcConfiguration.verifyCode = req.session.user.verifyCode;

    VistaJS.callRpc(req.logger, rpcConfiguration, 'ORQQPL EDIT SAVE', [problemIEN, userIEN, siteId, GMPLUSER, params], function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error.message);
            res.send(rdk.httpstatus.internal_server_error, 'error: ' + error.message);
        } else {
            req.logger.info('Successfully updated problem back to VistA. with ' + result);
            res.send(rdk.httpstatus.ok, {
                response: 'Success'
            });
        }
    });
}

function updateProblem(req, res) {
    var data = req.body;

    if (_.isUndefined(data.action)) {
        processUpdateRequest(req, res, data);
    } else {
        removeProblem(req, res, data);
    }
}

function parseDeleteProblemInput(input) {
    var data = input;

    if (_.isUndefined(data.problemIEN) || _.isUndefined(data.providerID)) {
        return ({
            error: 'Missing expected parameters'
        });
    }

    return ({
        problemIEN: data.problemIEN,
        providerID: data.providerID,
        reason: (data.reason || '')
    });
}

function sitetoStationID(req, siteName) {

    // this is only for POSTMAN work...
    if (nullchecker.isNullish(siteName)) {
        return 500;
    }

    var site = req.app.config.vistaSites[siteName].division;
    if (_.isUndefined(site)) {
        req.logger.error('Unknown site name encountered');
        throw new Error('Unknown site name encountered');
    } else {
        req.logger.debug('Site corresponding to: ' + siteName + ' is ' + site);
        return site;
    }
}

/**
* Removes a problem Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to remove a problem.
* @param {Object} res - The default Express response.
* @param {Object} input - The information to use to remove the problem.
*/
function removeProblem(req, res, input) {
    var result = parseDeleteProblemInput(input);
    if (!_.isUndefined(result.error)) {
        req.logger.error(result.error);
        // we get here for an invalid JSON... It IS a bad request.
        res.status(rdk.httpstatus.bad_request).send(result.error);
        return;
    }

    // Lets translate the site name to station ID.
    var siteID;

    try {
        siteID = sitetoStationID(req, req.session.user.site);
    } catch (e) {
        req.logger.error(e.message);
        res.status(rdk.httpstatus.bad_request).send(e.message);
        return;
    }

    var rpcConfiguration = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfiguration.accessCode = req.session.user.accessCode;
    rpcConfiguration.verifyCode = req.session.user.verifyCode;

    VistaJS.callRpc(req.logger, rpcConfiguration, 'ORQQPL DELETE', [result.problemIEN, result.providerID, siteID, result.reason], function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error.message);
            res.send(rdk.httpstatus.internal_server_error, 'error: ' + error.message);
        } else {
            req.logger.info('Successfully deleted problem from VistA. with ' + result);
            res.send(rdk.httpstatus.ok, {
                response: 'Success'
            });
        }
    });
}

function parseAddProblemInput(input) {

    var data = input;

    var patientIEN = data.patientIEN; //  || "100022^BCMA,EIGHT^0008^";
    var patientName = data.patientName;
    var providerIEN = data.providerIEN; // || 10000000224 ;
    var lexiconCode = data.lexiconCode; // || "GMPFLD(.01)=\"9779^784.0\""
    var problemName = data.problemName; // || "GMPFLD(.05)=\"^Chronic headache disorder\""
    var status = data.status; // || "GMPFLD(.12)=\"A^ACTIVE\"";
    var problemNumber = data.problemNumber || ''; // 8109405
    var enteredBy = data.enteredBy; // "GMPFLD(1.03)=\"10000000224^LORD,BRIAN\"";
    var enteredByIEN = data.enteredByIEN; // "GMPFLD(1.03)=\"10000000224^LORD,BRIAN\"";
    var dateRecorded = data.dateRecorded; //"GMPFLD(1.09)=\"3141001^Oct 01 2014\"",
    var condition = 'P'; //data.condition; // "GMPFLD(1.02)=\"P\""

    // optional fields
    var acuity = data.acuity || '^'; //"GMPFLD(1.14)=""C^CHRONIC"""
    var recordingProvider = data.recordingProvider || ''; // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\"";
    var recordingProviderIEN = data.recordingProviderIEN || ''; // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\"";
    var responsibleProvider = data.responsibleProvider || ''; // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\"";
    var responsibleProviderIEN = data.responsibleProviderIEN || ''; // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\"";
    var dateOfOnset = data.dateOfOnset || '^'; //"GMPFLD(.13)=\"3141001^Oct 01 2014\"",
    var snomedCode = data.snomedCode || '';
    var location = data.service || '^';

    // Treatment Factors
    var serviceConnected = data.serviceConnected || '0^NO';
    var agentOrange = data.agentOrange || '0^NO';
    var radiation = data.radiation || '0^NO';
    var shipboard = data.shipboard || '0^NO';
    var persianGulfVet = data.southwestAsiaConditions || '0^NO';
    var headOrNeckCancer = data.headOrNeckCancer || '0^NO';
    var combatVet = data.combatVet || '0^NO';
    var MST = data.MST || '0^NO';
    var newComments = data.comments || [];

    if (patientIEN === undefined || // 100022
        patientName === undefined || // BCMA,EIGHT
        providerIEN === undefined || // 10000000224
        lexiconCode === undefined || // '9779^784.0'
        problemName === undefined || // GMPFLD(.05)=\"^Chronic headache disorder\""
        status === undefined || // "GMPFLD(.12)=\"A^ACTIVE\""
        problemName === undefined || // "Chronic headache disorder\"
        problemNumber === undefined || /// 8109405
        enteredBy === undefined || // "GMPFLD(1.03)=\"10000000224^LORD,BRIAN\""
        enteredByIEN === undefined || // "GMPFLD(1.03)=\"10000000224^LORD,BRIAN\""
        recordingProvider === undefined || // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\""
        recordingProviderIEN === undefined || // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\""
        responsibleProvider === undefined || // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\""
        responsibleProviderIEN === undefined || // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\""
        dateRecorded === undefined //"GMPFLD(1.09)=\"3141001^Oct 01 2014\"",
    ) {
        throw new Error('Missing expected parameters');
    }

    var patient = patientIEN + '^' + patientName + '^0008^';

    var currentDate = new Date();
    currentDate = filemanDateUtil.getFilemanDate(currentDate) + '^' + currentDate.getDate() + '/' +
        (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();

    var dateObject = paramUtil.convertWriteBackInputDate(dateRecorded); //new Date(dateRecorded);
    dateRecorded = filemanDateUtil.getFilemanDate(dateObject.toDate()) + '^' + dateObject.format(DATE_DISPLAY_FORMAT);

    if (!nullchecker.isNullish(dateOfOnset)) {
        dateObject = paramUtil.convertWriteBackInputDate(dateOfOnset); //new Date(dateOfOnset);
        dateOfOnset = filemanDateUtil.getFilemanDate(dateObject.toDate()) + '^' + dateObject.format(DATE_DISPLAY_FORMAT);
    } else {
        dateOfOnset = '^';
    }

    /*
     S ADDARRAY(16)="GMPFLD(1.1)=""^Unknown""" ;service connected
     S ADDARRAY(17)="GMPFLD(1.11)=""0^NO""" ;Agent orange
     S ADDARRAY(18)="GMPFLD(1.12)=""0^NO""" ;ionizing radiation
     S ADDARRAY(19)="GMPFLD(1.13)=""0^NO""" ;Persian Gulf vet
     S ADDARRAY(21)="GMPFLD(1.15)=""0^NO""" ;head/or neck cancer
     S ADDARRAY(22)="GMPFLD(1.16)=""0^NO""" ;military sexual trauma
     S ADDARRAY(23)="GMPFLD(1.17)=""0^NO""" ;combat vet
     S ADDARRAY(24)="GMPFLD(1.18)=""0^NO""" ;shipboard hazard & defense
     */
    var params = {};

    params[0] = 'GMPFLD(.01)="' + lexiconCode + '"'; // "GMPFLD(.01)=\"9779^784.0\"";
    params[1] = 'GMPFLD(.03)="0^"';
    params[2] = 'GMPFLD(.05)="^' + problemName + '"'; // "GMPFLD(.05)=\"^Chronic headache disorder\"";
    params[3] = 'GMPFLD(.08)="' + currentDate + '"'; // "GMPFLD(.08)=\"3141001^Oct 01 2014\"";
    params[4] = 'GMPFLD(.12)="' + status + '"'; // "GMPFLD(.12)=\"A^ACTIVE\""
    params[5] = 'GMPFLD(.13)="' + dateOfOnset + '"';
    params[6] = 'GMPFLD(1.01)="' + problemNumber + '^' + problemName + '"'; // "GMPFLD(1.01)=\"8109405^Chronic headache disorder\""
    params[7] = 'GMPFLD(1.02)="' + condition + '"';
    params[8] = 'GMPFLD(1.03)="' + enteredByIEN + '^' + enteredBy + '"'; // "GMPFLD(1.03)=\"10000000224^LORD,BRIAN\"";

    params[9] = 'GMPFLD(1.04)="' + recordingProviderIEN + '^' + recordingProvider + '"'; // "GMPFLD(1.04)=\"10000000224^LORD,BRIAN\"";
    params[10] = 'GMPFLD(1.05)="' + responsibleProviderIEN + '^' + responsibleProvider + '"'; // "GMPFLD(1.05)=\"10000000224^LORD,BRIAN\"";
    params[11] = 'GMPFLD(1.06)="^"';
    params[12] = 'GMPFLD(1.07)="^"';
    params[13] = 'GMPFLD(1.08)="' + location + '"';
    params[14] = 'GMPFLD(1.09)="' + dateRecorded + '"';
    params[15] = 'GMPFLD(1.1)="' + serviceConnected + '"';
    params[16] = 'GMPFLD(1.11)="' + agentOrange + '"';
    params[17] = 'GMPFLD(1.12)="' + radiation + '"';
    params[18] = 'GMPFLD(1.13)="' + persianGulfVet + '"';
    params[19] = 'GMPFLD(1.14)="' + acuity + '"';
    params[20] = 'GMPFLD(1.15)="' + headOrNeckCancer + '"';
    params[21] = 'GMPFLD(1.16)="' + MST + '"';
    params[22] = 'GMPFLD(1.17)="' + combatVet + '"';
    params[23] = 'GMPFLD(1.18)="' + shipboard + '"';
    params[24] = 'GMPFLD(80001)="' + snomedCode + '"';
    params[25] = 'GMPFLD(80002)="^"';
    params[26] = 'GMPFLD(80101)="^"';
    params[27] = 'GMPFLD(80102)="^"';
    var currentIndex = 28;
    var x = 1;
    if (_.isArray(newComments) && newComments.length) {
        params[currentIndex++] = 'GMPFLD(10,0)="' + newComments.length + '"';
        for (; x <= newComments.length; x++) {
            params[currentIndex++] = 'GMPFLD(10,"NEW",' + x + ')="' + newComments[x - 1] + '"';
        }
    } else {
        params[currentIndex] = 'GMPFLD(10,0)="0"';
    }

    return ({
        patient: patient,
        provider: providerIEN,
        params: params
    });
}

/**
* Adds a problem. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to add a problem.
* @param {Object} res - The default Express response.
*/
function addProblem(req, res) {
    var content = req.body;

    var result;
    var siteID;
    try {
        req.logger.debug('addProblem content: ' + content);
        result = parseAddProblemInput(content);
        siteID = sitetoStationID(req, req.session.user.site);
    } catch (e) {
        req.logger.error(e.message);
        res.send(rdk.httpstatus.bad_request, e.message);
        return;
    }

    var rpcConfiguration = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfiguration.accessCode = req.session.user.accessCode;
    rpcConfiguration.verifyCode = req.session.user.verifyCode;

    VistaJS.callRpc(req.logger, rpcConfiguration, 'ORQQPL ADD SAVE', [result.patient, result.provider, siteID, result.params], function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully wrote new problem back to VistA. with ' + result);
            res.send(rdk.httpstatus.ok, {
                response: 'Success'
            });
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.parseDeleteProblemInput = parseDeleteProblemInput;
module.exports.addProblem = addProblem;
module.exports.parseAddProblemInput = parseAddProblemInput;
module.exports.getProblems = getProblems;
