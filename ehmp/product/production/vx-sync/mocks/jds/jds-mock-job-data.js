'use strict';

var syncJobStarted = function(jpid, rootJobId) {
    var cooldownJpidRegEx = new RegExp('21EC2020-3AEA-4069-A2DD-(?:C{12})');
    return [
        {
            jobId: rootJobId,
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'enterprise-sync-request',
            timestamp: cooldownJpidRegEx.test(jpid)?(Date.now() - (5*360000)).toString():'1417698653396',
            patientIdentifier: {
                type: 'pid',
                value: cooldownJpidRegEx.test(jpid)?'ABCD;3':'ABCD;1'
            },
            status: 'started'
        },
        {
            jobId: rootJobId + 1,
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'vista-9E7A-subscribe-request',
            timestamp: Date.now() - (5*360000).toString(),
            patientIdentifier: {
                type: 'pid',
                value: cooldownJpidRegEx.test(jpid)?'9E7A;42':'9E7A;43'
            },
            status: 'completed'
        },
        {
            jobId: rootJobId + 2,
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'hdr-sync-request',
            timestamp: Date.now() - (5*360000).toString(),
            patientIdentifier: {
                type: 'icn',
                value: '10101V420870'
            },
            status: 'started'
        }
    ];
};

var syncCompleteWithError = function(jpid, rootJobId) {
    return [
        {
            jobId: rootJobId,
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'enterprise-sync-request',
            timestamp: '1417798653396',
            patientIdentifier: {
                type: 'pid',
                value: 'ABCD;0'
            },
            status: 'completed'
        },
        {
            jobId: (parseInt(rootJobId) + 1).toString(),
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'vista-9E7A-subscribe-request',
            timestamp: '1417798653399',
            pid: '9E7A;0',
            status: 'completed'
        },
        {
            jobId: (parseInt(rootJobId) + 2).toString(),
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'vista-C877-subscribe-request',
            timestamp: '1417798653402',
            pid: 'C877;0',
            status: 'error',
            error: 'Server could not be reached'
        },
        {
            jobId: (parseInt(rootJobId) + 3).toString(),
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'jmeadows-sync-request',
            timestamp: '1417798653402',
            pid: 'dod;10108V420871',
            status: 'completed'
        },
        {
            jobId: (parseInt(rootJobId) + 4).toString(),
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'jmeadows-vital-sync-request',
            timestamp: '1417798653402',
            pid: 'dod;10108V420871',
            status: 'completed'
        },
        {
            jobId: (parseInt(rootJobId) + 5).toString(),
            rootJobId: rootJobId,
            jpid: jpid,
            type: 'jmeadows-lab-sync-request',
            timestamp: '1417798653402',
            pid: 'dod;10108V420871',
            status: 'completed'
        }
    ];
};

var syncComplete = function(jpid, rootJobId) {
    var ret = syncCompleteWithError(jpid, rootJobId);
    ret[2].status = 'completed';
    ret[0].patientIdentifier.value = 'ABCD;2';
    delete(ret[2].error);

    return ret;
};

var mockData = function (rootJobId) {
    return {
        '21EC2020-3AEA-4069-A2DD-AAAAAAAAAAAA': syncJobStarted('21EC2020-3AEA-4069-A2DD-AAAAAAAAAAAA', rootJobId),
        '21EC2020-3AEA-4069-A2DD-BBBBBBBBBBBB': syncComplete('21EC2020-3AEA-4069-A2DD-BBBBBBBBBBBB', rootJobId),
        '21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC': syncJobStarted('21EC2020-3AEA-4069-A2DD-CCCCCCCCCCCC', rootJobId),
        '21EC2020-3AEA-4069-A2DD-08002B30309D': syncCompleteWithError('21EC2020-3AEA-4069-A2DD-08002B30309D', rootJobId),
        'jpid': function(jpid) { return syncJobStarted(jpid, rootJobId); }
    };
};

module.exports = mockData;