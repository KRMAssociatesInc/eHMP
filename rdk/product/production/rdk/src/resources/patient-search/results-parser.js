'use strict';
var _ = require('underscore');
var moment = require('moment');

module.exports.determineIDType = determineIDType;

module.exports.transformPatient = function(patient) {
    //identify data source
    //looking for local, non-local, vista, or dod as values
    if (patient.id) {
        var idParts = patient.id.split('^');
        switch (idParts.length) {
            case 5:
            case 4:
                patient.facility = idParts[2]; //facility
                patient.dataSource = idParts[3]; //patient identifier authority = DOD or USVHA
                /* falls through */
            case 2:
                patient.pid = idParts[0]; //id value
                patient.idType = idParts[1]; //PI = Patient, EI = Employee, NI = National, PN = PersonNumber
                break;
            default:
                patient.pid = patient.id;
        }
        patient.idClass = determineIDType(patient.id);
        if(patient.idClass === 'DFN') {
            patient.pid = patient.facility + ';' + patient.pid;
        }
    }

    if (patient.fullName && (!patient.familyName || !patient.givenNames)) {
        var name = patient.fullName.split(',');
        patient.familyName = name[0];
        patient.givenNames = name[1];
    } else if (patient.familyName && patient.givenNames && !patient.fullName) {
        //put first name together
        if (_.isArray(patient.givenNames)) {
            patient.givenNames = patient.givenNames.join(' ');
        }
        patient.fullName = patient.familyName + ',' + patient.givenNames;
    }
    if(patient.fullName && !patient.displayName) {
        patient.displayName = patient.fullName;
    }

    if (patient.birthDate) {
        //calculate age
        patient.age = moment().diff(moment(patient.birthDate, 'YYYYMMDD'), 'years');
    }

    if (patient.ssn) {
        //truncate ssn
        patient.ssn4 = patient.ssn.substring(5);
    }

    if (patient.genderCode) {
        if (patient.genderCode.length > 2) {
            var genderParts = patient.genderCode.split(':');
            patient.genderCode = genderParts[genderParts.length - 1];
        }

        //expand gender
        if (patient.genderCode && !patient.genderName) {
            switch (patient.genderCode) {
                case 'M':
                    patient.genderName = 'Male';
                    break;
                case 'F':
                    patient.genderName = 'Female';
                    break;
                case 'UN':
                    patient.genderName = 'Undifferentiated';
                    break;
                default:
                    patient.genderName = 'Unknown';
            }
        }
    }

    if (patient.address) {
        _.each(patient.address, function(address) {
            if (address.use && address.use === 'PHYS') {
                address.use = 'H';
            }
        });
    }

    if (patient.telecom) {
        _.each(patient.telecom, function(telecom) {
            if (telecom.use && telecom.use === 'HP') {
                telecom.use = 'H';
            }
        });
    }

    return patient;
};

module.exports.retrieveObjFromTree = function(obj, path) {
    var objRef = obj;
    if (!_.isArray(path) || obj === null) {
        return objRef;
    }
    for (var index = 0; index < path.length; index++) {
        if (_.isArray(objRef) && _.isNumber(path[index])) {
            if (path[index] < objRef.length) {
                objRef = objRef[path[index]];
            } else {
                break;
            }
        } else if (_.isObject(objRef) && _.isString(path[index])) {
            if (_.has(objRef, path[index])) {
                objRef = objRef[path[index]];
            } else {
                var re = new RegExp('.*' + path[index] + '.*');
                var found = false;
                for (var key in objRef) {
                    if (re.test(key)) {
                        objRef = objRef[key];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    break;
                }
            }
        } else {
            break;
        }
    }
    return objRef;
};

module.exports.merge = function(obj1, obj2) {
    var obj = {};
    mergeRecursive(obj, obj1);
    mergeRecursive(obj, obj2);
    return obj;
};

function mergeRecursive(obj1, obj2) {
    for (var p in obj2) {
        if (obj2.hasOwnProperty(p)) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor === Object) {
                    obj1[p] = mergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
    }
    return obj1;
}

function determineIDType(mviID) {
    var idParts = mviID.split('^');
    var dfnType = /PI\^[A-Z0-9]{4}\^USVHA/g;
    if (idParts[3] && idParts[3] === 'USSSA' && idParts[0].length === 9) {
        return 'SSN';
    }
    else if (mviID.match(dfnType)) {
        return 'DFN';
    } else if (idParts[1] && idParts[1] === 'NI') {
        if (idParts[3] && idParts[3] === 'USVHA') {
            return 'ICN';
        } else if (idParts[3] && idParts[3] === 'USDOD') {
            return 'EDIPI';
        } else {
            return 'Unknown';
        }
    } else if (idParts[1] && idParts[1] === 'PI') {
        if (idParts[3] && idParts[3] === 'USVHA' && idParts[2] === '742V1') {
            return 'VHIC';
        }
        else {
            return 'Unknown';
        }
    } else {
        return 'Unknown';
    }
}
