Ext.define('gov.va.hmp.ptselect.PatientSelect', {
    extend: 'Ext.data.Model',
    requires: [
        'gov.va.hmp.healthtime.PointInTime'
    ],
    idProperty:  {
        name: 'id',
        type: 'string',
        // set id for identifying ptselect objects based on pid and appointment time due to same patient appearing in list for multiple appointments
        convert:function(value, record) {
            var appointment = record.get('appointment');
            var id = record.get('pid') + (appointment ? '-' + appointment : '');
            return id;
        }
    },
    fields: [
        'uid',
        'pid',
        'icn',
        'localId',
        'displayName',
        'genderName',
        {
            name:'birthDate',
            type: 'string',      // TODO: custom 'healthtime' type here?
            convert: function (value, record) {
                return PointInTime.format(value);
            }
        },
        {
            name:'deceased',
            type: 'string',      // TODO: custom 'healthtime' type here?
            convert: function (value, record) {
                return PointInTime.format(value);
            }
        },
        {
            name: 'ssn',
            type: 'string',
            convert: function (value, record) {
                return gov.va.hmp.ptselect.PatientSelect.formatSSN(value);
            }
        },
        'last4',
        'last5',
        {
            name: 'age',
            type: 'integer'
        },
        'photoHRef',
        {
            name:'sensitive',
            type: 'boolean'
        },
        'patientType',
        'sourceDisplayName',
        'sourceName',
        'sourceShortName',
        'sourceUid',
        'roomBed',
        'appointment',
        'sourceSequence', // For roster defs. Not worth creating another JS file.
        'admissionUid',
        'appointmentUid',
        'locationShortName'
    ],
    statics: {
        formatSSN:function(value) {
            var length = value.length;

            // Fill the first dash for the user
            if (length > 3 && length < 6) {
                var segmentA = value.slice(0, 3);
                var segmentB = value.slice(3, 5);
                return segmentA + "-" + segmentB;
            } else {
                // Fill the dashes for the user
                if (length > 5) {
                    var segmentA = value.slice(0, 3);
                    var segmentB = value.slice(3, 5);
                    var segmentC = value.slice(5, 9);
                    return segmentA + "-" + segmentB + "-" + segmentC;
                } else {
                    // If nothing is entered, leave the field blank
                    if (length < 1) {
                        return "";
                    }
                }
            }
        }
    }
});
