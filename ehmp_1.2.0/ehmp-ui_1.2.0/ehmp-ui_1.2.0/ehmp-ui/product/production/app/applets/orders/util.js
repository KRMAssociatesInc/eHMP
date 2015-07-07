define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var Util = {};

    Util.getStatusStyle = function(response) {
        switch (response.statusName.toUpperCase()) {
            case ('PENDING'):
                response.statusStyle = 'label label-warning';
                break;
            case ('COMPLETE'):
                response.statusStyle = 'label label-success';
                break;
            case ('EXPIRED'):
                response.statusStyle = 'label label-danger';
                break;
            case ('DISCONTINUED'):
                response.statusStyle = 'label label-info';
                break;
            case ('ACTIVE'):
                response.statusStyle = 'label label-success';
                break;
            default:
                response.statusStyle = 'label label-default';
        }

        return response;
    };

    Util.getFacilityColor = function(response) {

        if (response.facilityCode && response.facilityCode == 'DOD') {
            response.facilityColor = 'DOD';
        } else {
            response.facilityColor = 'nonDOD';
        }

        return response;
    };

    Util.getSigners = function(response) {
        var clinicians = response.clinicians;

        _.each(clinicians, function(clinician) {

            switch (clinician.role) {
                case 'S':
                    response.provider = clinician.name;
                    break;
                case 'N':
                    response.nurse = clinician.name;
                    break;
                case 'C':
                    response.clerk = clinician.name;
                    break;
                case 'R':
                    response.chart = clinician.name;
                    break;
            }

        });

        return response;
    };

    // Added by PG: 20141001 Update for LabSummary Data
    Util.parseLabSampleString = function(labSampleStr) {

        var endLimits = [" I", " LC", " SP", " WC"];
        var labCollectionMessage = ['Immediate COLLECT', 'LAB COLLECT', 'SEND PATIENT', 'WARD COLLECT'];
        var labCollectionMsgIndex = 1;
        var labCollectionArray = ['', '', '']; // [Collection By, Sample, Specimen]
        var indexOf3S = labSampleStr.indexOf("   ");
        var indexOfLBN = labSampleStr.indexOf("LB #");
        var indOfType;
        var balStr;
        if (indexOfLBN > 1) {
            balStr = labSampleStr.substr(0, indexOfLBN).trim();
            if (indexOf3S < 0) {
                indexOf3S = 0;
            }

            for (var i = 0; i < endLimits.length; i++) {
                indOfType = balStr.indexOf(endLimits[i], indexOf3S);
                if (indOfType > 1) {
                    // Now we find a lab type..
                    labCollectionArray[0] = labCollectionMessage[i];
                    // trim..
                    balStr = balStr.substr(0, indOfType + 1);
                    break;
                }
            }

            var spFirst = balStr.lastIndexOf(" ", indexOf3S - 1);
            if (indexOf3S === 0) {
                // Then there is only one that is specimen.
                spFirst = balStr.indexOf(" ");
                while (spFirst > -1) {
                    balStr = balStr.substr(spFirst, balStr.length).trim();
                    spFirst = balStr.indexOf(" ");
                }
            } else {
                spFirst = balStr.lastIndexOf(" ", indexOf3S - 1);
                balStr = balStr.substr(spFirst, balStr.length).trim();
            }

            var ssLabs;
            ssLabs = balStr.split("   ");
            if (ssLabs.length > 1) {
                labCollectionArray[1] = ssLabs[0];
                labCollectionArray[2] = ssLabs[1];
            } else {
                if (indexOf3S === 0) {
                    labCollectionArray[2] = ssLabs[0];
                } else {
                    labCollectionArray[1] = ssLabs[0];
                    labCollectionArray[2] = '';
                }
            }

            return labCollectionArray;

        } else {
            labCollectionArray[0] = 'Not Found';
            labCollectionArray[1] = 'Not Found';
            labCollectionArray[2] = 'Not Found';

            return labCollectionArray;
        }

    };
    // End by PG: 20141001 Update for LabSummary Data


    // Added by PG: 20140930 Update for LabData: PG
    Util.trimSampleString = function(sampleStr) {

        var endLimits = [" I", " LC", " SP", " WC"];
        var labCollectionMessage = ['Immediate COLLECT', 'LAB COLLECT', 'SEND PATIENT', 'WARD COLLECT'];
        var labCollectionMsgIndex = 1;
        var labCollectionArray = ['', '', '']; // [Collection By, Sample, Specimen]
        var indexOf3S = sampleStr.indexOf("   ");
        var indexOfLBN = sampleStr.indexOf("LB #");

        var indOfType;
        var balStr;
        if (indexOfLBN > 1) {
            balStr = sampleStr.substr(0, indexOfLBN).trim();

            if (indexOf3S < 0) {
                indexOf3S = 0;
            }

            for (var i = 0; i < endLimits.length; i++) {
                indOfType = balStr.indexOf(endLimits[i], indexOf3S);

                if (indOfType > 1) {
                    // Now we find a lab type..
                    labCollectionArray[0] = labCollectionMessage[i];
                    // trim..
                    balStr = balStr.substr(0, indOfType + 1);
                    break;
                }
            }

            var spFirst = balStr.lastIndexOf(" ", indexOf3S - 1);
            if (indexOf3S === 0) {
                // Then there is only one that is specimen.
                spFirst = balStr.indexOf(" ");
                while (spFirst > -1) {
                    balStr = balStr.substr(spFirst, balStr.length).trim();
                    spFirst = balStr.indexOf(" ");
                }
            } else {
                spFirst = balStr.lastIndexOf(" ", indexOf3S - 1);
                balStr = balStr.substr(spFirst, balStr.length).trim();
            }

            var ssLabs; // = balStr.split("<|>");
            ssLabs = balStr.split("   ");
            if (ssLabs.length > 1) {
                labCollectionArray[1] = ssLabs[0];
                labCollectionArray[2] = ssLabs[1];
            } else {
                if (indexOf3S === 0) {
                    labCollectionArray[2] = ssLabs[0];
                } else {
                    labCollectionArray[1] = ssLabs[0];
                    labCollectionArray[2] = '';
                }
            }

            return labCollectionArray;

        } else {
            labCollectionArray[0] = 'Not Found';
            labCollectionArray[1] = 'Not Found';
            labCollectionArray[2] = 'Not Found';
            return labCollectionArray;
        }

    };
    // End by PG: 20140930 Update for LabData: PG

    Util.splitLongSummaryText = function(response) {
        if (response.summary && response.summary.length > 160) {
            response.shortSummary = response.summary.substr(0, 160);
            response.longSummary = true;
        } else {
            response.shortSummary = response.summary;
            response.longSummary = false;
        }
        return response;
    };

    Util.parseOrderResponse = function(response) {

        response = Util.getSigners(response);
        response = Util.splitLongSummaryText(response);

        //DE448 - Fix the Stop and Start dates for order display
        if (response.stop) {
            response.stop = Util.parseForOrderStopStartDate(response.stop);
        }
        if (response.start) {
            response.start = Util.parseForOrderStopStartDate(response.start);
        }

        return response;
    };

    // Added by PG: 20141028 Update for Signature Data
    Util.parseForSignature = function(arraySignors) {

        var signatureDetails = {
            byName: '',
            onDate: ''
        }; // Name, date
        // Take the latest one.
        if (arraySignors !== undefined && arraySignors !== null) {
            var s = arraySignors.length;
            if (s > 0) {
                signatureDetails.byName = arraySignors[s - 1].name + ' on '; // Add format 'on' here to avoid display issues
                signatureDetails.onDate = arraySignors[s - 1].signedDateTime; //yyyyMMddhhmm
            }
        }
        return signatureDetails;
    };

    Util.parseForOrderNumber = function(dataStr, isLab) {

        var balStr = '';
        if (isLab) {
            var indexOfLBN = dataStr.indexOf("LB #");
            if (indexOfLBN > 1) {
                balStr = dataStr.substr(indexOfLBN + 4).trim();
            }
        } else {
            var lastOfColon = dataStr.lastIndexOf(":");
            balStr = dataStr.substr(lastOfColon + 1).trim();
        }
        return balStr;
    };

    //Purpose of this Util is for the Stop and Start date for orders. If they show 00:00 on a given
    // date then we need to move them to 23:59 of the previous day. We are only changing this string
    // for the date/time that is being used for display. This is for DE448.
    Util.parseForOrderStopStartDate = function(dataStr) {

        var myDate = dataStr;
        var indexOfZeroTime = dataStr.indexOf("0000");
        if (indexOfZeroTime > 1) {  //Check for 0000 in the time
             //This date/time is at 00:00 so we need to move the date to the previous day and
             //subtract 1 minute to go from 00:00 to 23:59 on the previous day
             var month;
             var day;
             var tmpDateStr = myDate.substr(0,4) + '-' + myDate.substr(4,2) + '-' + myDate.substr(6,2);
             var tmpDate = new Date(tmpDateStr);
             tmpDate.setDate(tmpDate.getDate() - 1); // Got back one day so we are on the previous day
             var tmpMonth = tmpDate.getUTCMonth() + 1; //UTC Months are 0 to 11 so need to add 1
             if (tmpMonth < 10) {
                month = '0' + tmpMonth.toString();  //Needs to be 2 digit month
             }
             else {
                month = tmpMonth.toString();
             }
             var tmpDay = tmpDate.getUTCDate();
             if (tmpDay < 10) {
                day  = '0' + tmpDay.toString();  // Needs to be 2 digit day
             }
             else {
                day  = tmpDay.toString();
             }
             myDate =  tmpDate.getUTCFullYear().toString() + month + day + "2359";  //Previous Day at 23:59 pm
        }
        return myDate;
    };

    return Util;
});
