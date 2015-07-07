/*jslint node: true */
/*jshint -W098 */
'use strict';

var util = require('util');
var _ = require('underscore');
var clc = require('cli-color');
var moment = require('moment');
var VistaJS = require('./VistaJS');
var logger = require('bunyan').createLogger({
    name: 'RpcClient',
    level: 'debug'
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
    console.log(clc.cyan(inspect(result)));
}

function printJsonResult(error, result) {
    console.log(clc.red(inspect(error)));

    var output = result;
    try {
        output = JSON.parse(result);
    } catch (err) {
        // use default
    }

    console.log(clc.cyan(inspect(output)));
}

var context = 'OR CPRS GUI CHART';

var configuration = {
    context: 'HMP UI CONTEXT',
    host: '10.2.2.101',
    port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    localIP: '10.2.2.1',
    localAddress: 'localhost'
};


// VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', VistaJS.RpcParameter.literal('AMP'), printResult);
// VistaJS.callRpc(logger, configuration, 'ORWDAL32 ALLERGY MATCH', 'AMP', printResult);

// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'logPatientAccess', '"patientId"': '167' }, printResult);
// response -> '{"result":"ok"}'

// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '3' }, printResult);
// response -> '{}'

// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '1' }, printResult);
// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '6' }, printResult);
// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '167' }, printResult);
// VistaJS.callRpc(logger, configuration, 'VPRCRPC RPC', { '"command"': 'getPatientChecks', '"patientId"': '3' }, printResult);
// response -> '{"sensitive":{"dfn":167,"logAccess":true,"mayAccess":true,"text":"\\r\\n***RESTRICTED RECORD***\\r\\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \\r\\n* This record is protected by the Privacy Act of 1974 and the Health    *\\r\\n* Insurance Portability and Accountability Act of 1996. If you elect    *\\r\\n* to proceed, you will be required to prove you have a need to know.    *\\r\\n* Accessing this patient is tracked, and your station Security Officer  *\\r\\n* will contact you for your justification.                              *\\r\\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * "}}'


VistaJS.callRpc(logger, configuration, 'ORWU USERINFO', printResult);

// VistaJS.authenticate(logger, configuration, printResult);

// VistaJS.callRpc(logger, configuration, 'VPR GET PATIENT DATA JSON', { '"patientId"': '8', '"domain"': 'allergy' }, printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', [
//     VistaJS.RpcParameter.literal(''),
//     VistaJS.RpcParameter.literal('1')
// ], printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', ['', '1'], printResult);

// VistaJS.callRpc(logger, configuration, 'ORWDAL32 SYMPTOMS', '', '1', printResult);
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


// VistaJS.callRpc(logger, configuration, 'RPC ORWDX SAVE', [
//     100022,
//     10000000226,
//     11,
//     'PSH OERR',
//     48,
//     389,
//     '', {
//         '(0,1)': '',
//         '(15,1)': 'ORDIALOG("WP",15,1)',
//         '(1615,1)': 'ORDIALOG("WP",1615,1)',
//         '("WP",1615,1,1,0)': '',
//         '(385,1)': 'ORDIALOG("WP",385,1)',
//         '(4,1)': 1349,
//         '(136,1)': '500MG',
//         '(138,1)': 639,
//         '(386,1)': '500&MG&1&CAPSULE&500MG&639&500&MG',
//         '(384,1)': '500MG',
//         '(137,1)': 1,
//         '(170,1)': 'NOW',
//         '("WP",15,1,1,0)': 'this comment',
//         '("WP",385,1,1,0)': 'Take one tablet by mouth now',
//         '("ORCHECK")': 0,
//         '("ORTS")': 9,
//         '("WP",1615,1,2,0)': 'Non-VA medication not recommended by VA provider. ',
//         '("WP",1615,1,3,0)': 'Non-VA medication recommended by VA provider. ',
//         '(6,1)': 'Sep 12,2014'
//     },
//     '',
//     '',
//     '',
//     0
// ], printResult);

/*
ORWDX SAVE
 
Params ------------------------------------------------------------------
literal 100829
literal 10000000224
literal 23
literal PSH OERR
literal 48
literal 389
literal 
list 
 (4,1)=2455
 (136,1)=1 TABLET PENTAZOCINE HCL 50/NALOXONE 0.5MG TAB
 (138,1)=5069
 (386,1)=&&&&1 TABLET&5069&&
 (384,1)=
 (1350,1)=PENTAZOCINE HCL 50/NALOXONE 0.5MG TAB
 (137,1)=1
 (170,1)=BID
 (0,1)=
 (15,1)=ORDIALOG("WP",15,1)
 (1615,1)=ORDIALOG("WP",1615,1)
 ("WP",1615,1,1,0)=
 ("WP",1615,1,2,0)=Medication prescribed by Non-VA provider.  
 (385,1)=ORDIALOG("WP",385,1)
 ("WP",385,1,1,0)=TAKE ONE TABLET BY MOUTH TWICE A DAY
 ("ORCHECK")=0
 ("ORTS")=0
literal 
literal 
literal 
literal 0
 
Results -----------------------------------------------------------------
~33388;1^48^3140919.1513^^^11^3^^^10000000224^LORD,BRIAN^^0^^^^^^GENERAL MEDICINE:23^^0^0^0^0
tNon-VA PENTAZOCINE HCL 50/NALOXONE 0.5MG TAB
tTAKE ONE TABLET BY MOUTH TWICE A DAY  Medication prescribed by Non-VA provider.
*/


// VistaJS.callRpc(logger, configuration, 'RPC ORWDX SAVE', [
//     100829,
//     10000000224,
//     23,
//     'PSH OERR',
//     48,
//     389,
//     '', {
//         '(4,1)': '2455',
//         '(136,1)': '1 TABLET PENTAZOCINE HCL 50/NALOXONE 0.5MG TAB',
//         '(138,1)': '5069',
//         '(386,1)': '&&&&1 TABLET&5069&&',
//         '(384,1)': '',
//         '(1350,1)': 'PENTAZOCINE HCL 50/NALOXONE 0.5MG TAB',
//         '(137,1)': '1',
//         '(170,1)': 'BID',
//         '(0,1)': '',
//         '(15,1)': 'ORDIALOG("WP",15,1)',
//         '(1615,1)': 'ORDIALOG("WP",1615,1)',
//         '("WP",1615,1,1,0)': '',
//         '("WP",1615,1,2,0)': 'Medication prescribed by Non-VA provider.  ',
//         '(385,1)': 'ORDIALOG("WP",385,1)',
//         '("WP",385,1,1,0)': 'TAKE ONE TABLET BY MOUTH TWICE A DAY',
//         '("ORCHECK")': '0',
//         '("ORTS")': '0'
//     },
//     '',
//     '',
//     '',
//     0
// ], printResult);
