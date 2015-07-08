define(["underscore", "moment"], function(_, Moment) {

    function rightPad(num) {
        if (num.length >= 14) {
            return num;
        }

        var pad = '00000000000000' + '';
        return num + pad.substring(0, pad.length - num.length);
    }

    function sortByDateTime(a, b) {
        a = a.dateTime || a.referenceDateTime;
        if (!a) {
            return 0;
        }

        b = b.dateTime || b.referenceDateTime;
        if (!b) {
            return 0;
        }

        return a - b;
    }

    //this code is tested via gradle test in viewModelParseTest.js
    return function(response) {
        if (!response) {
            return {};
        }

        if (response.hasOwnProperty('inpatient')) {
            var dateFormatFull = 'YYYYMMDDHHmmss';
            var dateFormatNoSeconds = 'YYYYMMDDHHmm';
            var dateFormats = [dateFormatFull, dateFormatNoSeconds];
            var allAdmissions = [];
            var indexOffset = 0;

            //prepopulate and format list of hospital admissions for lookahead purposes
            _.each(response.inpatient, function(encounter, key, list) {
                // if (encounter.dateTime) {
                //     response.inpatient[key].dateTime = rightPad(encounter.dateTime);
                // } else if (encounter.referenceDateTime) {
                //     response.inpatient[key].referenceDateTime = rightPad(encounter.referenceDateTime);
                // }

                if (encounter.stay && encounter.stay.arrivalDateTime) {
                    var arrival = Moment(encounter.stay.arrivalDateTime, dateFormats);
                    allAdmissions.push(arrival);
                }
            });

            var inpatientObjs = response.inpatient; //as response is modified on the fly, operate on the clone to limit iterations

            _.each(inpatientObjs, function(encounter, key, list) {
                // Create admission objects for entire length of stay
                if (encounter.stay && encounter.stay.arrivalDateTime) {
                    var arrival = Moment(encounter.stay.arrivalDateTime, dateFormats);
                    var discharge;
                    if (encounter.stay.dischargeDateTime) {
                        discharge = Moment(encounter.stay.dischargeDateTime, dateFormats);

                    } else {
                        //no dischargeDateTime
                        //find most recent admission after this -- if so, set it as discharge date
                        //note that this assumes allAdmissions is in correct order, which relies on resource passing events in correct order
                        for (var i = 0; i < allAdmissions.length; i++) {
                            if (allAdmissions[i] && allAdmissions[i].isAfter(arrival)) {
                                discharge = allAdmissions[i];
                                break;
                            }
                        }

                        if (!discharge) {
                            //no more recent discharge date was found, set to today
                            discharge = Moment(); //.format(dateFormat);
                        }
                    }
                    var stayLength = discharge.diff(arrival, 'days');
                    if (stayLength >= 1) {
                        var curLength = 1;
                        var dateCounter = arrival.hour(0).minute(0).second(0);
                        var newObjects = [];
                        while (curLength <= stayLength) {
                            dateCounter = dateCounter.add(1, 'd');
                            newObjects.push({
                                kind: 'Hospital Stay',
                                dateTime: dateCounter.format(dateFormatFull)
                            });
                            curLength++;
                        }
                        var spliceIndex = key + indexOffset + 1;
                        //splice into existing results
                        // note that this splicing doesnt order correctly when 2 admissions of same day
                        // however the graph seems not to care
                        var end = response.inpatient.slice(spliceIndex);
                        var begin = response.inpatient.slice(0, spliceIndex).concat(newObjects);
                        response.inpatient = begin.concat(end);
                        indexOffset += newObjects.length;
                    }
                }
            });

            //response.inpatient = response.inpatient.sort(sortByDateTime);
        }

        return response;
    };
});
