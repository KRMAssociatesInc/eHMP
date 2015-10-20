'use strict';

var _ = require('lodash');
var rpcUtil = require('../utils/rpc-util');
var rpcCategoryTransformer = require('../utils/rpc-categories-tilde-transformer');


//----------------------------------------------------------------------------------------------------------------------

/**
 * ~Test Name
 * d1,25-DIHYDROXYVIT D
 */
function addTestName(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    var categoryEntry = {
        name: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Item ID
 * d431^CH
 */
function addItemID(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 2, fields, categoryName);
    var categoryEntry = {
        ien: fields[0],
        name: fields[1]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~OIMessage
 * tTest is sent out to Nishols Inst. Allow 4-6 weeks for results.
 */
function addOIMessage(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
}

function addCollSampRegularEntry(logger, retValue, categoryName, type, fields) {
    if (fields.length === 9) {
        rpcCategoryTransformer.validateCategoryArraySize(logger, 9, fields, categoryName);
    }
    else {
        rpcCategoryTransformer.validateCategoryArraySize(logger, 10, fields, categoryName);
    }
    var categoryEntry = {
        n: fields[0],
        ien: fields[1],
        name: fields[2],
        specPtr: fields[3],
        tubeTop: fields[4],
        //"Looking at the code it is hard coded with those ^^^ pieces. This is typically done to add more data or due to
        //data being removed from the call and to prevent having to change every parser when it gets removed." Christopher Edwards.
        unused1: fields[5],
        unused2: fields[6],
        labCollect: fields[7],
        unused3: fields[8]
    };

    //The case of having 10 entries means the specName is known.  If it's not, CPRS displays the word "Other" and when
    //they select it a new dialog comes up for them to select from.
    if (fields.length === 10) {
        categoryEntry.specName = fields[9];
    }
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addCollSampTextEntry(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
}
/**
 * ~CollSamp
 * i1^1^BLOOD  ^72^GOLD TOP^^^1^^SERUM
 * tTEST OF WARD REMARKS FIELD !!!
 *
 * From here: https://github.com/OSEHRA/VistA-M/blob/master/Packages/Order%20Entry%20Results%20Reporting/Routines/ORWDLR32.m
 * n^SampIEN^SampName^SpecPtr^TubeTop^^^LabCollect^^SpecName
 */
function addCollSamp(logger, retValue, categoryName, type, fields) {
    if (rpcCategoryTransformer.CATEGORY_REGULAR_ENTRY === type) {
        addCollSampRegularEntry(logger, retValue, categoryName, type, fields);
    }
    else if (rpcCategoryTransformer.CATEGORY_TEXT_ENTRY === type) {
        addCollSampTextEntry(logger, retValue, categoryName, type, fields);
    }
    else {
        throw new Error('Unknown type within category: "' + categoryName + '": type=' + type);
    }
}

/**
 * ~Default CollSamp
 * d1
 */
function addDefaultCollSamp(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    var categoryEntry = {
        value: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~GenWardInstructions
 * tTest is sent out to Nishols Inst. Allow 4-6 weeks for results.
 */
function addGenWardInstructions(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    rpcCategoryTransformer.addCategoryTextEntry(logger, retValue, categoryName, type, fields);
}

/**
 * ~Lab CollSamp
 * d1
 */
function addLabCollSamp(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    var categoryEntry = {
        value: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~ReqCom
 * dANTICOAGULATION
 */
function addReqCom(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    var categoryEntry = {
        name: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Specimens
 * i72^SERUM
 */
function addSpecimens(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 2, fields, categoryName);
    var categoryEntry = {
        ien: fields[0],
        name: fields[1]
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Unique CollSamp
 * d1
 */
function addUniqueCollSamp(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 1, fields, categoryName);
    var categoryEntry = {
        value: fields[0]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Urgencies
 * i9^ROUTINE^1
 */
function addUrgencies(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 3, fields, categoryName);
    var categoryEntry = {
        ien: fields[0],
        name: fields[1],
        parent: fields[2]
    };
    rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

/**
 * ~Default Urgency
 * d9^ROUTINE^1
 */
function addDefaultUrgencies(logger, retValue, categoryName, type, fields) {
    rpcCategoryTransformer.validateCategoryArraySize(logger, 3, fields, categoryName);
    var categoryEntry = {
        ien: fields[0],
        name: fields[1],
        parent: fields[2]
    };
    rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * Since we know the names of our categories, this method determines which method to call based on the category.
 */
function addCategoryEntry(logger, retValue, categoryName, fields) {
    if (categoryName === null) {
        throw new Error('Cannot add a category entry if no category has been created: ' + fields[0]);
    }
    if (!fields && fields.length === 0) {
        throw new Error('fields must have at least one entry');
    }

    var type = fields[0][0];
    fields[0] = fields[0].substring(1); //Remove the type from the first entry

    if (categoryName === 'Test Name') {
        addTestName(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Item ID') {
        addItemID(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'OIMessage') {
        addOIMessage(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'CollSamp') {
        addCollSamp(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Default CollSamp') {
        addDefaultCollSamp(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'GenWardInstructions') {
        addGenWardInstructions(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Lab CollSamp') {
        addLabCollSamp(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'ReqCom') {
        addReqCom(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Specimens') {
        addSpecimens(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Unique CollSamp') {
        addUniqueCollSamp(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Urgencies') {
        addUrgencies(logger, retValue, categoryName, type, fields);
    }
    else if (categoryName === 'Default Urgency') {
        addDefaultUrgencies(logger, retValue, categoryName, type, fields);
    }
    else {                               //This is an unknown entry
        throw new Error('The RPC "ORWDLR32 LOAD" returned data but we couldn\'t understand it: unknown category entry "' + categoryName + '"');
    }
}

//----------------------------------------------------------------------------------------------------------------------

/**
 * The RPC returns data in the following format:<br/>
 * ~category<br/>
 * i+delimited string = entry<br/>
 * d+delimited string = default<br/>
 * t+string = text<br/><br/><br/>
 *
 * Example of the RPC Data that is returned:<br/>
 * <pre>
 * ~Test Name
 * d1,25-DIHYDROXYVIT D
 * ~Item ID
 * d431^CH
 * ~OIMessage
 * tTest is sent out to Nishols Inst. Allow 4-6 weeks for results.
 * ~CollSamp
 * i1^1^BLOOD  ^72^GOLD TOP^^^1^^SERUM
 * ~Default CollSamp
 * d1
 * ~GenWardInstructions
 * tTest is sent out to Nishols Inst. Allow 4-6 weeks for results.
 * ~Lab CollSamp
 * d1
 * ~ReqCom
 * dANTICOAGULATION
 * ~Specimens
 * i72^SERUM
 * ~Unique CollSamp
 * d1
 * ~Urgencies
 * i9^ROUTINE^1
 * ~Default Urgency
 * d9^ROUTINE^1
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 */
module.exports.parseLabSampleSpecimenUrgency = function(logger, rpcData) {
    logger.info({rpcData: rpcData});

    var retValue = [];
    var lines = rpcData.split('\r\n');
    var categoryName = null;
    lines = rpcUtil.removeEmptyValues(lines);

    _.each(lines, function(line) {
        var fields = line.split('^');
        if (rpcCategoryTransformer.isCategoryEntry(fields)) {
            categoryName = fields[0].substring(1);

            var category = {
                categoryName: categoryName
            };

            logger.debug({categoryName: categoryName});
            retValue.push(category);
        }
        else {
            addCategoryEntry(logger, retValue, categoryName, fields);
        }
    });

    //console.log(JSON.stringify(retValue, null, 2));
    logger.info({retValue: retValue});
    return retValue;
};
