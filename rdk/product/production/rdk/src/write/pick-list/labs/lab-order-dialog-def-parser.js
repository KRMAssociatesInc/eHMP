'use strict';

var _ = require('lodash');
var rpcCategoryTransformer = require('../utils/rpc-categories-tilde-transformer');
var rpcUtil = require('../utils/rpc-util');

/**
 * ~Lab Collection Times
 * iLNEXT^Next scheduled lab collection
 * iLT+1@0930^AM Collection: 09:30 (Tomorrow)
 *
 * ~Schedules
 * i90^HOURLY^C^60
 * i26^NOW^O^0
 * i27^ONCE^O^0
 */
function addCollectionTime(logger, retValue, categoryName, type, fields) {
    var categoryEntry = {
        code: fields[0],
        name: fields[1]
    };

    if (fields.length >= 4) {
        categoryEntry.frequencyType = fields[2];
        categoryEntry.frequency = fields[3];
    }

    addEntry(logger, retValue, categoryName, type, fields, categoryEntry);
}

function addEntry(logger, retValue, categoryName, type, fields, categoryEntry) {
    if (rpcCategoryTransformer.CATEGORY_DEFAULT_ENTRY === type) {
        rpcCategoryTransformer.addCategoryDefaultEntry(logger, retValue, categoryName, type, fields, categoryEntry);
    } else {
        rpcCategoryTransformer.addCategoryRegularEntry(logger, retValue, categoryName, type, fields, categoryEntry);
    }
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

    if (fields.length === 2 || fields.length === 4) {
        addCollectionTime(logger, retValue, categoryName, type, fields);
    }
    else {
        logger.error("The RPC 'ORWDLR32 DEF' returned data but we couldn't understand it: unknown category entry '" + categoryName + '"');
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
 * ~ShortList
 * ~Lab Collection Times
 * iLNEXT^Next scheduled lab collection
 * iLT+1@0930^AM Collection: 09:30 (Tomorrow)
 * iLT+1@1100^AM Collection: 11:00 (Tomorrow)
 * iLT+1@1230^PM Collection: 12:30 (Tomorrow)
 * iLT+1@1300^PM Collection: 13:00 (Tomorrow)
 * iLT@1530^PM Collection: 15:30 (Today)
 * iLT@1545^PM Collection: 15:45 (Today)
 * iLT@1600^PM Collection: 16:00 (Today)
 * iLT@1730^PM Collection: 17:30 (Today)
 * iLO^Future
 * ~Ward Collection Times
 * iWT+1@0930^09:30 AM (Tomorrow) Ward collect
 * iWT+1@1100^11:00 AM (Tomorrow) Ward collect
 * iWT+1@1230^12:30 PM (Tomorrow) Ward collect
 * iWT+1@1300^13:00 PM (Tomorrow) Ward collect
 * iWT@1530^15:30 PM (Today) Ward collect
 * iWT@1545^15:45 PM (Today) Ward collect
 * iWT@1600^16:00 PM (Today) Ward collect
 * iWT@1730^17:30 PM (Today) Ward collect
 * iWNOW^Now (Collect on ward)
 * ~Send Patient Times
 * iLT^Today
 * iLT+1^Tomorrow
 * ~Collection Types
 * iLC^Lab Collect
 * iWC^Ward Collect
 * iSP^Send Patient to Lab
 * iI^Immediate Collect
 * ~Default Urgency
 * i9^ROUTINE
 * d9^ROUTINE
 * ~Schedules
 * i90^HOURLY^C^60
 * i26^NOW^O^0
 * i27^ONCE^O^0
 * i28^ONE TIME^O^0
 * d28^ONE TIME
 * i70^Q15MIN^C^15
 * i48^Q2H^C^120
 * i88^Q4HLR^C^240
 * i75^Q6-8H^C^120
 * i51^Q6H^C^360
 * i85^Q6H-TEST^C^360
 * i58^Q8H^C^480
 * i59^Q8HR^R^480
 * i29^QAM^C^1440
 * i30^QD^C^1440
 * i31^QH^C^60
 * i44^QMON^C^43200
 * i64^QMONTH^C^43200
 * i32^QOD^C^2800
 * i33^QW^C^10080
 * i84^WEEKLY^C^10080
 * ~Common
 * </pre>
 * END Example of the RPC Data that is returned:<br/>
 */
module.exports.parseLabOrderDialogDef = function(logger, rpcData) {
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
