/*jslint node: true */
'use strict';
var _ = require('underscore');
var moment = require('moment');
var referenceRangeConfig = require('./referenceRangeConfig');

module.exports.addNormalizedName = addNormalizedName;
module.exports.addCalculatedBMI = addCalculatedBMI;
module.exports.addReferenceRanges = addReferenceRanges;
module.exports.filterVlerData = filterVlerData;
module.exports.setExpirationLabel = setExpirationLabel;
module.exports.setStandardizedDescription = setStandardizedDescription;
module.exports.setTimeSince = setTimeSince;
module.exports._calculateBmi = calculateBmi;

function addNormalizedName(jdsData) {
    _.each(jdsData.data.items, function(item) {
        var normalizedName = null;
        if (hasCodesDisplay(item)) {
            normalizedName = getCodesDisplay(item);
        } else if (item.qualifiedName !== undefined) {
            normalizedName = item.qualifiedName;
        } else if (item.productFormName !== undefined) {
            normalizedName = item.productFormName;
        } else {
            normalizedName = item.name;
        }

        item.normalizedName = normalizedName;
    });
    return jdsData;
}

function hasCodesDisplay(item) {
    var hasDisplay = false;
    if (item.codes !== undefined) {

        for (var code = 0; code < item.codes.length; code++) {
            if (item.codes[code].display !== undefined) {
                hasDisplay = true;

            }
        }
    }

    return hasDisplay;
}

function getCodesDisplay(item) {

    for (var code = 0; code < item.codes.length; code++) {
        if (item.codes[code].display !== undefined) {
            return item.codes[code].display;
        }
    }
}

function setExpirationLabel(jdsData) {
    _.each(jdsData.data.items, function(item) {
        var overallStop = '';
        if (item.stopped) {
            item.stopped = item.stopped.toString();
        }

        if (item.overallStop) {
            item.overallStop = item.overallStop.toString();
        }

        if (item.overallStop) {
            overallStop = moment(item.overallStop.toString(), 'YYYYMMDDHHmmssSSS');
        } else {
            overallStop = moment(item.stopped, 'YYYYMMDDHHmmssSSS');
        }
        var currentDate = moment();
        //console.log('stop expiration label: ------- ' + overallStop);

        if (!item.vaStatus) {
            item.calculatedStatus = '';
            return;
        }
        switch (item.vaStatus.toUpperCase()) {
            case 'PENDING':
                item.calculatedStatus = 'PENDING'; //is this what we should put here? FYI, 9E7A;164 has Pending meds.
                break;
            case 'ACTIVE':
                if (item.vaType === 'N') {
                    item.calculatedStatus = 'Start';
                }
                if (overallStop < currentDate) {
                    item.calculatedStatus = 'Expired';
                } else {
                    item.calculatedStatus = 'Expires';
                }
                break;
            case 'SUSPEND':
                item.calculatedStatus = 'Ordered';
                break;
            case 'HOLD':
                item.calculatedStatus = 'Ordered';
                break;
            case 'EXPIRED':
                if (item.vaType === 'N') {
                    item.calculatedStatus = 'Start';
                } else {
                    item.calculatedStatus = 'Expired';
                }
                break;
            case 'UNRELEASED':
                item.calculatedStatus = '';
                break;
            case 'DISCONTINUED':
                item.calculatedStatus = 'Discontinued';
                break;
            case 'DISCONTINUED/EDIT':
                item.calculatedStatus = 'Discontinued';
                break;
            default:
                // return 'Add a new case to expirationLabel';
                item.calculatedStatus = item.vaStatus;
        }
    });

    return jdsData;
}

function setTimeSince(jdsData) {
    if(!(jdsData && jdsData.data && jdsData.data.items)) {
        return jdsData;
    }
    _.each(jdsData.data.items, function(item) {

        if (item.overallStart) {
            item.overallStart = item.overallStart.toString();
        } else if (item.orders && item.orders.length > 0 && item.orders[0].ordered) {
            item.overallStart = item.orders[0].ordered.toString();
        }

        if (item.stopped) {
            item.stopped = item.stopped.toString();
        }

        if (!item.fills) {
            item.fills = [];
        }

        var startDateToUse = '';
        var today = moment();
        if (item.lastFilled !== undefined) {
            startDateToUse = item.lastFilled.toString();
            var lastFilledTime = moment(startDateToUse, 'YYYYMMDDHHmmssSSS').format('YYYY-MM-DD HH:mm:ss');
            var lastFilledLocalTime = moment.utc(lastFilledTime).toDate();
            lastFilledTime = moment(lastFilledLocalTime);
            var secondToLastFill = item.fills[item.fills.length - 2];
            var advancedFillForReleaseAfterCurrentFillExpiresExists = (
                lastFilledTime > today && item.fills.length > 1 &&
                secondToLastFill !== undefined &&
                secondToLastFill.dispenseDate !== undefined);
            if (advancedFillForReleaseAfterCurrentFillExpiresExists) {
                //use the date of the fill the patient is currently on
                startDateToUse = secondToLastFill.dispenseDate.toString();
            }

        } else if (item.fills && item.fills[0] !== undefined && item.fills[0].dispenseDate !== undefined) {
            startDateToUse = item.fills[0].dispenseDate.toString();
        } else if (item.lastAdmin !== undefined) {
            startDateToUse = item.lastAdmin;
        } else {
            startDateToUse = item.overallStart;
        }
        var overallStop = '';
        if (item.overallStop) {
            overallStop = moment(item.overallStop.toString(), 'YYYYMMDDHHmmssSSS');
        } else {
            overallStop = moment(item.stopped, 'YYYYMMDDHHmmssSSS');
        }
        var startDate = moment(startDateToUse, 'YYYYMMDDHHmmssSSS');
        if (overallStop > startDate && overallStop < today) {
            startDate = overallStop;
        }
        // ensure the start time is no sooner than the medication order time and no later than right now.
        if (item.orders !== undefined && item.orders !== null && item.orders[0].ordered !== undefined) {
            var orderedDate = moment(item.orders[0].ordered.toString(), 'YYYYMMDDHHmmssSSS');
            if (startDate <= orderedDate || startDate > today) {
                startDate = moment(item.orders[0].ordered.toString(), 'YYYYMMDDHHmmssSSS').add(1, 'second');
            }
        }
        var duration = moment.duration(today.diff(startDate));
        var months = parseFloat(duration.asMonths());
        //recent check
        var recent = false;
        if (months <= 6) {
            recent = true;
        }
        item.lastAction = startDate.format('YYYYMMDDHHmmssSSS');
        item.expirationDate = overallStop.format('YYYYMMDDHHmmssSSS');
        item.recent = recent;
    });
    return jdsData;
}

function setStandardizedDescription(jdsData) {
    _.each(jdsData.data.items, function(item) {
        _.each(item.codes, function(code) {
            if (code.system.indexOf('http://snomed.info/sct') !== -1) {
                item.standardizedDescription = code.display;
                item.snomedCode = code.code;
            }
        });

    });

    return jdsData;
}

/*
    Add calculated BMI to the domain data
    Each facility data is used to calculate BMI.  No crossover between different facilities.
    For each facility, use last height of all days and last measured weight on a day are used to calculate BMI
 */


function addCalculatedBMI(jdsData) {
    var domainData = jdsData;

    var items = _.filter(jdsData.data.items, function(item) {
        if (((item.typeName.toLowerCase().indexOf('height') >= 0) ||
                (item.typeName.toLowerCase().indexOf('weight') >= 0)) &&
            isValidVitalMeasurement(item.result)) {
            return item;
        }
    });
    if (items.length <= 0) {
        return domainData;
    }
    items = _.groupBy(items, function(item) {
        return item.facilityCode;
    });
    var facilities = _.keys(items);
    var lastHeight;
    var heights;
    var weights;
    var weightGroups;
    var days;
    var weightGroupWeights;
    var bmi;
    _.each(facilities, function(facility) {
        heights = _.filter(items[facility], function(item) {
            if ((item.typeName.toLowerCase().indexOf('height') >= 0) &&
                isValidVitalMeasurement(item.result)) {
                return item;
            }
        });
        if (heights.length <= 0) {
            return;
        }
        heights = _(heights).chain().sortBy('observed').reverse().value();

        lastHeight = heights[0];
        weights = _.filter(items[facility], function(item) {
            if ((item.typeName.toLowerCase().indexOf('weight') >= 0) &&
                isValidVitalMeasurement(item.result)) {
                return item;
            }
        });
        if (weights.length <= 0) {
            return;
        }
        weightGroups = _.groupBy(weights, function(item) {
            return item.observed.toString().substring(0, 8);
        });
        days = _.keys(weightGroups);
        _.each(days, function(day) {
            weightGroupWeights = _(weightGroups[day]).chain().sortBy('observed').reverse().value();
            bmi = calculateBmi(lastHeight.result, lastHeight.units, weightGroupWeights[0].result,
                weightGroupWeights[0].units);
            domainData.data.items.push({
                facilityCode: weightGroupWeights[0].facilityCode,
                facilityName: weightGroupWeights[0].facilityName,
                observed: weightGroupWeights[0].observed,
                result: bmi,
                summary: 'BMI ' + bmi,
                typeName: 'BMI',
                facilityDisplay: weightGroupWeights[0].facilityDisplay,
                facilityMoniker: weightGroupWeights[0].facilityMoniker
            });
        });
    });
    var count = domainData.data.items.length;
    if (count > domainData.data.totalItems) {
        domainData.data.totalItems = count;
        domainData.data.currentItemCount = count;
    }

    return domainData;
}

function addReferenceRanges(jdsData) {
    _.each(jdsData.data.items, function(item) {
        var refRange = referenceRangeConfig.getReferenceRanges()[item.typeName.toLowerCase()];
        if (refRange) {
            item.low = (refRange.override && refRange.low) || item.low || refRange.low;
            item.high = (refRange.override && refRange.high) || item.high || refRange.high;
        }
    });
    return jdsData;
}

/*
    Filter VLER data to only send individual records when a request is sent from frontend
    and not send all records at once.
 */


function filterVlerData(vlerCallType, vler_uid, name, jdsData) {
    var domainData = jdsData;
    //console.log('jdsData from JDS: ' + jdsData);

    if ((vlerCallType === 'vler_list') && (name === 'vlerdocument') && (domainData.data.items)) { // && domainData.sections) {
        var itemsLength = domainData.data.items.length; // && domainData.sections) {
        var itemsCount;
        var sectionsCount;
        var sectionsLength;
        for (itemsCount = 0; itemsCount < itemsLength; itemsCount++) {
            if (domainData.data.items[itemsCount].sections) {
                sectionsLength = domainData.data.items[itemsCount].sections.length;
                for (sectionsCount = 0; sectionsCount < sectionsLength; sectionsCount++) {
                    delete domainData.data.items[itemsCount].sections;
                }
            }
        }
    } else if ((vlerCallType === 'vler_modal') && (name === 'vlerdocument') && (domainData.data.items)) {

        var count;
        for (count = 0; count < domainData.data.items.length; count++) {
            console.log('count 1: ' + count);
            if (domainData.data.items[count].uid !== vler_uid) {
                domainData.data.items.splice(count, 1);
                count--;
            }
        }
    }

    return domainData;
}

function isValidVitalMeasurement(measurement) {
    return measurement !== 'Pass' &&
        measurement !== 'Refused';
}

function calculateBmi(height, heightUnit, weight, weightUnit) {
    if (heightUnit === 'cm') {
        height = height * 0.393701;
    }
    if (weightUnit === 'kg') {
        weight = weight * 2.20462;
    }

    var bmi = (weight / Math.pow(height, 2) * 703).toFixed(1);

    if (isNaN(bmi)) {
        return 'No Record';
    }

    return bmi;
}
