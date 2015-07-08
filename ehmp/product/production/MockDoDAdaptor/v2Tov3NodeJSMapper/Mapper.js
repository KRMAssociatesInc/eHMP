/**
 * Created by sishii on 2/27/15.
 */
var jf = require('jsonfile');
var fs = require('fs');
var medsMapper = require('./lib/maps/map10160-0.js');
var demoMapper = require('./lib/maps/map52536-0.js');
var utils = require('./lib/utils.js');



//Write the callback function
//function handleFile(err, data) {
//    if (err) {
//        throw err;
//    }
//    obj = JSON.parse(data);
//    // You can now play with your datas
//
//    console.log(obj);
//}


// Read the file and send to the callback
//fs.readFile("./data/example.json", handleFile);
//fs.readFile("./data/" + process.argv[2], handleFile);
//obj = jf.readFileSync(__dirname + '/data/' + process.argv[2]);


//var fileList = utils.getJSONFileListingByLOINC("21869-3", "./v2Data");



//var medsFileList = utils.getJSONFileListingByLOINC(utils.domains.meds.loinc, "./v2Data");
//console.log(medsFileList);
//
//for (var medsFileNum = 0; medsFileNum < medsFileList.length; medsFileNum++) {
//    var v2JSON = jf.readFileSync(__dirname + '/v2Data/' + medsFileList[medsFileNum]);
//    var v3JSON = utils.domains.meds.mapper.map(v2JSON);
//    jf.writeFileSync(__dirname + '/output/v3_' + medsFileList[medsFileNum], v3JSON);
//}




//
//
//var medsObj = jf.readFileSync(__dirname + '/v2Data/' + '0000000001_10160-0_1.json');
//var medsV3Obj = medsMapper.map(medsObj);
//jf.writeFileSync(__dirname + '/output/' + "medsv3.json", medsV3Obj);
//
//
//var demoObj = jf.readFileSync(__dirname + '/v2Data/' + '0000000001_52536-0_1.json');
//var demoV3Obj = demoMapper.map(demoObj);
//jf.writeFileSync(__dirname + '/output/' + "demov3.json", demoV3Obj);



/// loop to get each domain type from utils.domains
var domainNames = Object.keys(utils.domains);
for (var domainTypeNum = 0; domainTypeNum < domainNames.length; domainTypeNum++) {
    // get the list of files
    var fileList = utils.getJSONFileListingByLOINC(utils.domains[domainNames[domainTypeNum]].v2loinc, "../src/main/resources/data/");

    // loop through the list of files and generate the maps
    for (var fileNum = 0; fileNum < fileList.length; fileNum++) {
        var v2JSON = jf.readFileSync('../src/main/resources/data/' + fileList[fileNum]);
        var v3JSON = utils.domains[domainNames[domainTypeNum]].mapper.map(v2JSON);

        var fileNameParts = fileList[fileNum].split("_");
        var edipi = fileNameParts[0];
        //use version 3 loinc
        var loinc = utils.domains[domainNames[domainTypeNum]].v3loinc;
        var iter_ext = fileNameParts[2];

        jf.writeFileSync('../src/main/resources/data/v3/v3_' + edipi + "_" + loinc + "_" + iter_ext, v3JSON);
    }

}


