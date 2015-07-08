define([
    "backbone",
    "moment"
], function(Backbone, moment) {
    'use strict';

    var UserModel, PatientModel;
    if (window.sessionStorage.hasOwnProperty('user')) {
        UserModel = Backbone.Model.extend({
            defaults: new Backbone.Model(JSON.parse(window.sessionStorage.getItem('user'))).attributes
        });
        PatientModel = Backbone.Model.extend({
            defaults: new Backbone.Model(JSON.parse(window.sessionStorage.getItem('patient'))).attributes
        });
    } else {
        UserModel = Backbone.Model.extend({
            defaults: {
                site: '',
                expires: moment.utc('Thu, 01 Jan 1970 00:00:01 GMT'),
                status: 'loggedout'
            }
        });
        PatientModel = Backbone.Model.extend();
    }

    var GlobalDateModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('months', 18).format('MM/DD/YYYY'), // one year ago by default
            toDate: moment().add('months', 6).format('MM/DD/YYYY'), // 6 months into future by default
            customFromDate: moment().subtract('months', 18).format('MM/DD/YYYY'),
            customToDate: moment().add('months', 6).format('MM/DD/YYYY'),
            selectedId: 'custom-range-apply-global' // '1yr-range-global'
        }
    });

    var Session = {
        user: new UserModel(),
        patient: new PatientModel(),
        globalDate: new GlobalDateModel(),
        clearSessionModel: function(key, setDefault) {
            this[key].clear();
            if (_.isBoolean(setDefault) && setDefault === true) {
                this[key].set(this[key].defaults);
            }
        },
        clearAllSessionModels: function() {
            this.user.clear({silent: true});
            this.patient.clear({silent: true});
            this.globalDate.clear({silent: true}).set(this.globalDate.defaults, {silent: true});
        }
    };

    return Session;
});
