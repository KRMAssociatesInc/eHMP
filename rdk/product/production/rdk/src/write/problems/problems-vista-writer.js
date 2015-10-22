'use strict';

var async = require('async');
var VistaJS = require('../core/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var RpcParameter = VistaJS.RpcParameter;
var paramUtil = require('../../utils/param-converter');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var _ = require('underscore');

var DATE_DISPLAY_FORMAT = 'MMM DD YYYY';

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

    if (!nullChecker.isNullish(dateOfOnset)) {
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
 * Calls the update problems RPC. Uses the site id that is stored in the user session.
 *
 * @param {Object} data - The data to use for updating the problem.
 */
function updateProblem(data) {
    var params = {};
    var problemIEN = data.problemIEN;
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
    currentDate = filemanDateUtil.getFilemanDate(currentDate) + '^' + currentDate.getDate() + '/' +
        (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();

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


    return ({
        problemIEN: problemIEN,
        userIEN: userIEN,
        GMPLUSER: GMPLUSER,
        params: params
    });


}

function countOfComments(preExistingComments, comments) {
    if (nullChecker.isNullish(comments) || !Array.isArray(comments)) {
        return 0;
    }

    var retVal = 0;
    for (var i = 0; i < comments.length; i++) {

        if (!preExistingComments) {
            if (nullChecker.isNullish(comments[i].old)) {
                retVal++;
            }
        } else {
            if (nullChecker.isNotNullish(comments[i].old)) {
                retVal++;
            }
        }
    }

    return retVal;
}


function processComments(comments, params, currentIndex) {

    if (nullChecker.isNullish(comments)) {
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

function updateExistingComments(comments, params, currentIndex) {
    if (nullChecker.isNullish(comments) || !Array.isArray(comments)) {
        return;
    }

    // need to keep the indeces and comment text intact so the pattern matching
    // continues to work.
    // for update GMPFLD(10 contains the text to be updated
    // for delete GMPFLD(10 contains empty string
    for (var x = 1, index = 0; index < comments.length; x++, index++) {

        var before = comments[index].old;
        var after = comments[index]['new'];

        if (nullChecker.isNullish(before)) {
            // this is a new comment
            // will process after the existing ones...
            continue;
        }

        // it is a pre existing problem
        if (nullChecker.isNotNullish(before)) {
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
    if (nullChecker.isNullish(comments) || !Array.isArray(comments)) {
        return;
    }

    // Rules of engagement is all new comments go at the end of the list
    // so once we find one, the rest are the same, new comments to get added.

    for (var x = 0; x < comments.length; x++) {
        if (nullChecker.isNotNullish(comments[x].old)) {
            // this is a pre existing comments.
            // bookkeep and move on
            continue;
        }

        params[currentIndex++] = 'GMPFLD(10,"NEW",' + (x + 1) + ')="' + comments[x]['new'] + '"';
    }
}

module.exports.create = function (writebackContext, callback) {


    var problems,
        logger = writebackContext.logger,
        siteid = writebackContext.vistaConfig.division,
        rpcName = 'ORQQPL ADD SAVE';


    async.series([function sendDataToVista(callback) {

        logger.debug('Add Problem Content: ');
        problems = parseAddProblemInput(writebackContext.model);

        logger.debug({problems: problems});

        VistaJS.callRpc(writebackContext.logger, writebackContext.vistaConfig,
            rpcName, [problems.patient, problems.provider, siteid, problems.params], callback);

    }], function (err, data) {
        if (err) {
            return callback(err.message, data);
        }

        writebackContext.vprResponse = new paramUtil.returnObject([]);
        return callback(null);
    });

};

module.exports.update = function (writebackContext, callback) {
    async.series([
        function sendDataToVista(callback) {
            var logger = writebackContext.logger,
                siteid = writebackContext.vistaConfig.division,
                rpcName = 'ORQQPL EDIT SAVE',
                problems;

            problems = updateProblem(writebackContext.model);

            for (var i = 0; i < problems.params.length; i++) {
                logger.debug('Index: ' + i + ' value: ' + problems.params[i]);
            }


            VistaJS.callRpc(writebackContext.logger, writebackContext.vistaConfig,
                rpcName, [problems.problemIEN, problems.userIEN, siteid, problems.GMPLUSER, problems.params], callback);

        }
    ], function (err, data) {
        if (err) {
            return callback(err.message, data);
        }
        writebackContext.vprResponse = new paramUtil.returnObject([]);
        return callback(null);
    });
};
