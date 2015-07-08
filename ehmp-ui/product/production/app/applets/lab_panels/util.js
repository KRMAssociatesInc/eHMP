define([], function() {
    'use strict';

    function getFlag(interpretationCode) {
        var flag = {
            name: 'N',
            title: '',
            class: 'normal'
        };
        if (interpretationCode) {
            var temp = interpretationCode.split(":").pop();

            switch (temp) {
                case 'HH':
                case 'H*':
                    flag.name = 'H*';
                    flag.title = 'Critical High';
                    flag.class = 'critial label-danger';
                    break;
                case 'LL':
                case 'L*':
                    flag.name = 'L*';
                    flag.title = 'Critical Low';
                    flag.class = 'critical label-danger';
                    break;
                case 'H':
                    flag.name = 'H';
                    flag.title = 'Abnormal High';
                    flag.class = 'abnormal label-warning';
                    break;
                case 'L':
                    flag.name = 'L';
                    flag.title = 'Abnormal Low';
                    flag.class = 'abnormal label-warning';
                    break;
            }
        }
        return flag;
    }

    function getInterpretationClass(interpretationCode) {
        if (interpretationCode) {
            var flag = interpretationCode.split(":").pop();
            switch (flag) {
                case 'LL':
                case 'L*':
                case 'HH':
                case 'H*':
                    return 'critical';
                case 'L':
                case 'H':
                    return 'abnormal';
            }
        }
        return 'normal';
    }

    function getPanelFlags(results, panelCodes) {
        var flags = [];
        _.each(panelCodes, function(coding) {
            var res = _.find(results, function(r) {
                return r.get('typeCode') == coding.code;
            });
            var flag;
            if (res.has('interpreationFlag')) {
                flag = res.get('interpreationFlag');
            } else {
                if (res.has('interpretationCode')) {
                    flag = getFlag(res.get('interpretationCode'));
                }
            }
            if (flag && flag.name !== 'N' && !_.find(flags, function(f) {
                    return f.name === flag.name;
                })) {
                flags.push(flag);
            }
        });
        return flags;
    }

    var appletHelpers = {
        // add helpers here
        getInterpretationClass: getInterpretationClass,
        getFlag: getFlag,
        getPanelFlags: getPanelFlags
    };
    return appletHelpers;
});