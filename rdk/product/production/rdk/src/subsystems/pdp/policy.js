module.exports = {
    rules: [{
        'name': 'cprsUserPolicy',
        'on': true,
        'condition': function(R) {
            R.when(!this.corsTabs && !this.rptTabs);
        },
        'consequence': function(R) {
            this.result = {
                code: 'Deny'
            };
            R.stop();
        }
    }, {
        'name': 'accessOwnRecordPolicy',
        'on': true,
        'condition': function(R) {
            R.when(!this.dgRecordAccess && this.requestingOwnRecord);
        },
        'consequence': function(R) {
            this.result = {
                code: 'Deny'
            };
            R.stop();
        }
    }, {
        'name': 'undefinedOrNoSSNPolicy',
        'on': true,
        'condition': function(R) {
            R.when(!this.hasSSN && !this.breakglass);
        },
        'consequence': function(R) {
            this.result = {
                code: 'BreakGlass',
                text: '\r\n***RESTRICTED RECORD***\r\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \r\n* This record is protected by the Privacy Act of 1974 and the Health    *\r\n* Insurance Portability and Accountability Act of 1996. If you elect    *\r\n* to proceed, you will be required to prove you have a need to know.    *\r\n* Accessing this patient is tracked, and your station Security Officer  *\r\n* will contact you for your justification.                              *\r\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *',
                reason: 'PatientHasUndefinedSSN'
            };
            R.stop();
        }
    }, {
        'name': 'sensitivePolicyBreakglass',
        'on': true,
        'condition': function(R) {
            R.when(this.sensitive && !this.dgSensitiveAccess && !this.breakglass);
        },
        'consequence': function(R) {
            this.result = {
                code: 'BreakGlass',
                text: '\r\n***RESTRICTED RECORD***\r\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * \r\n* This record is protected by the Privacy Act of 1974 and the Health    *\r\n* Insurance Portability and Accountability Act of 1996. If you elect    *\r\n* to proceed, you will be required to prove you have a need to know.    *\r\n* Accessing this patient is tracked, and your station Security Officer  *\r\n* will contact you for your justification.                              *\r\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *',
                reason: 'SensitiveAccessRequired'
            };
            R.stop();
        }
    }, {
        'name': 'sensitivePolicyPermit',
        'on': true,
        'condition': function(R) {
            R.when(this.sensitive && !this.dgSensitiveAccess && this.breakglass);
        },
        'consequence': function(R) {
            this.result = {
                code: 'Permit'
            };
            R.stop();
        }
    }, {

        'name': 'default',
        'on': true,
        'condition': function(R) {
            R.when(true);
        },
        'consequence': function(R) {
            this.result = {
                code: 'Permit'
            };
            R.stop();
        }
    }]
};
