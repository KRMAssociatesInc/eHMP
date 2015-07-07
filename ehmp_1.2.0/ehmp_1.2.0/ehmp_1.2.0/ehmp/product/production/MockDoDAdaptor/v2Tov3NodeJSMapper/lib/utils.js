var fs = require('fs');
var admnMap = require('./maps/map21869-3.js')
var medsMap = require('./maps/map10160-0.js');
var demoMap = require('./maps/map52536-0.js');
var apptMap = require('./maps/map56446-8.js');
var encoMap = require('./maps/map46240-8.js');
var noteMap = require('./maps/map11536-0.js');
var procMap = require('./maps/map47519-4.js');
var ordersallMap = require('./maps/map46209-3.js');
var ordersmedMap = require('./maps/map29305-0.js');
var ordersconMap = require('./maps/map11487-6.js');
var orderslabMap = require('./maps/map26436-6.js');
var ordersradMap = require('./maps/map18726-0.js');
var quesMap = require('./maps/map10187-3.js');

var getJSONFileListingByLOINC = function (loinc, path) {
    var fileListArray = fs.readdirSync(path);

    var filteredNames = fileListArray.filter(function (fileName) {
        if (fileName.indexOf(loinc) > 6){
            return fileName;
        }
    })

    return filteredNames;
};

var domains = {
    "admissions": {v2loinc: "21869-3", v3loinc: "21869-3", mapper: admnMap},
    "appointments": {v2loinc: "56446-8", v3loinc: "56446-8", mapper: apptMap},
    "demographics": {v2loinc: "52536-0", v3loinc: "52536-0", mapper: demoMap},
    "encounters": {v2loinc: "46240-8", v3loinc: "46240-8", mapper: encoMap},
    "meds": {v2loinc: "10160-0", v3loinc: "10160-0", mapper: medsMap},
    "notes": {v2loinc: "60733-3", v3loinc: "11536-0", mapper: noteMap},
    "allOrders": {v2loinc: "46209-3", v3loinc: "46209-3", mapper: ordersallMap},
    "ordersConsults": {v2loinc: "11487-6", v3loinc: "11487-6", mapper: ordersconMap},
    "ordersLabs": {v2loinc: "26436-6", v3loinc: "26436-6", mapper: orderslabMap},
    "ordersMeds": {v2loinc: "29305-0", v3loinc: "29305-0", mapper: ordersmedMap},
    "ordersRads": {v2loinc: "18726-0", v3loinc: "18726-0", mapper: ordersradMap},
    "procedures": {v2loinc: "47519-4", v3loinc: "47519-4", mapper: procMap},
    "questionnaires": {v2loinc: "10187-3", v3loinc: "10187-3", mapper: quesMap}
    //"insurances": {loinc: "48768-6", mapper: insuMap}
}

var getMapper= function (domainName) {


}

module.exports.getJSONFileListingByLOINC = getJSONFileListingByLOINC;
module.exports.domains = domains;