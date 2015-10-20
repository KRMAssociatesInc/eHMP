'use strict';

var util = require('util');
var _ = require('underscore');
var clc = require('cli-color');
var moment = require('moment');
var VistaJS = require('./RpcClient').RpcClient;
var logger = require('bunyan').createLogger({
    name: 'RpcClient',
    level: 'trace'
});



///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
TO DO:

1. handle default logging better (maybe throw an exception, or write to console.log)
2. add 3rd parameter to callback with additional returned info (i.e. authentication, etc.)
3. add authenticate() function
4. get rid of 'throw' in results processing
5. look into connection pooling (can the user be changed? can multiple RPCs be called?):

*/
///////////////////////////////////////////////////////////////////////////////////////////////////////



function inspect(obj) {
    return obj ? util.inspect(obj, {
        depth: null
    }) : '';
}

function printResult(error, result) {
    console.log(clc.red(inspect(error)));
    console.log(clc.red(inspect(result)));
}

function printNamedResult(name, error, result) {
    console.log(clc.red('NAME: %s'), name);
    if (error) {
        return console.log('error: ' + clc.red(inspect(error)));
    }

    console.log('result: ' + clc.cyan(inspect(result)));
}

// function printJsonResult(error, result) {
//     console.log(clc.red(inspect(error)));

//     var output = result;
//     try {
//         output = JSON.parse(result);
//     } catch (err) {
//         // use default
//     }

//     console.log(clc.red(inspect(output)));
// }

var context = 'OR CPRS GUI CHART';

var configuration = {
    context: 'HMP SYNCHRONIZATION CONTEXT',
    host: '10.2.2.101',
    port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    localIP: '10.2.2.1',
    localAddress: 'localhost',
    noReconnect: false
};

// VistaJS.callRpc(logger, configuration, 'HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printResult);

//VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', 'AMP', printResult);
// VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', 'AMP', printResult);

// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'logPatientAccess', '"patientId"': '167' }, printResult);
// response -> '{"result":"ok"}'

//RpcClient.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '3' }, printResult);
// response -> '{}'

// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '167' }, printResult);
// response -> '{"sensitive":{"dfn":167,"logAccess":true,"mayAccess":true,"text":"\\r\\n***RESTRICTED RECORD***\\r\\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \\r\\n* This record is protected by the Privacy Act of 1974 and the Health    *\\r\\n* Insurance Portability and Accountability Act of 1996. If you elect    *\\r\\n* to proceed, you will be required to prove you have a need to know.    *\\r\\n* Accessing this patient is tracked, and your station Security Officer  *\\r\\n* will contact you for your justification.                              *\\r\\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * "}}'


// VistaJS.callRpc(logger, configuration, 'ORWU USERINFO', printResult);

// VistaJS.authenticate(logger, configuration, printResult);
//VistaJS.callRpc(logger, configuration, 'VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', [
//     VistaJS.RpcParameter.literal(''),
//     VistaJS.RpcParameter.literal('1')
// ], printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', ['', '1'], printResult);

//VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', '', '1', printResult);
// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', '', 1, printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 DEF', printResult);

// var allergyList = {
//     '"GMRAGNT"': 'SULFAPYRIDINE^88;PS(50.416,',
//     '"GMRATYPE"': 'D^Drug',
//     '"GMRANATR"': 'A^Allergy',
//     '"GMRAORIG"': '10000000225',
//     '"GMRAORDT"': '3140904.1737',
//     '"GMRASYMP",0': '1',
//     '"GMRASYMP",1': '39^ANXIETY^^^',
//     '"GMRACHT",0': '1',
//     '"GMRACHT",1': '3140904.17374',
//     '"GMRAOBHX"': 'h^HISTORICAL'
// };

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SAVE ALLERGY', '0', '8', allergyList, printResult);


//    context: 'VPR APPLICATION PROXY',

// configuration.rpc = 'GMV ALLERGY';
// configuration.rpc = 'ORQQAL LIST';
// VistaJS.callRpc(logger, configuration, 'ORQQAL LIST', [RpcParameter.literal('8')], printResult);


//VistaJS.callRpc(logger, configuration, [{ type: 'literal', value: '8' }]);


//VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', ['test'], [1, 2], { test: 'value' }, printResult);


var client = VistaJS.create(logger, configuration);
client.connect(printNamedResult.bind(null, 'CONNECT'));
// client.execute('ORWU USERINFO', printNamedResult.bind(null, 1));
// client.execute('VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printNamedResult.bind(null, 'BAD 1'));
// client.execute('HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printNamedResult.bind(null, 2));
// client.execute('ORWU USERINFO', printNamedResult.bind(null, 3));
// client.execute('HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printNamedResult.bind(null, 4));
// client.execute('VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printNamedResult.bind(null, 'BAD 2'));
// client.execute('ORWU USERINFO', printNamedResult.bind(null, 5));
// client.execute('ORWU USERINFO', printNamedResult.bind(null, 6));
// client.execute('HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printNamedResult.bind(null, 7));
// client.execute('VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printNamedResult.bind(null, 'BAD 3'));
// client.execute('VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printNamedResult.bind(null, 'BAD 4'));
// client.execute('HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printNamedResult.bind(null, 8));
// client.execute('HMP LOCAL GETCORRESPONDINGIDS', '3^PI^USVHA^500', printNamedResult.bind(null, 9));
// client.execute('ORWU USERINFO', printNamedResult.bind(null, 10));
client.close();

// console.log('highwater mark: %s', client.queue._highWaterMark);

