define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {
    var collectionHandler = {
        getServiceCategory: function(locationIEN, patientStatus, callback) {
            var self = this;
            var fetchOptions = {
                resourceTitle: "visit-service-category",
                onSuccess: callback,
                criteria: {
                    "locationIEN": locationIEN,
                    "patientStatus": patientStatus
                }
            };
            ADK.ResourceService.fetchCollection(fetchOptions);
        },
        getProviders: function(callback) {
            var siteCode = ADK.UserService.getUserSession().get('site');
            var providersfetchOptions = {
                resourceTitle: "visits-providers",
                onSuccess: callback,
                criteria: {
                    "facility.code": siteCode
                }
            };
            ADK.ResourceService.fetchCollection(providersfetchOptions);
        },
        getProvidersPicklist: function(callback) {
            var collection = new Backbone.Collection();
            var site = ADK.UserService.getUserSession().get('site');
            collection.url = '/resource/write-pick-list?type=new-persons&new-persons-type=PROVIDER&site=' + site;
            collection.fetch({
                success: callback
            });
        },
        getLocations: function(callback) {
            var siteCode = ADK.UserService.getUserSession().get('site');
            var locationsfetchOptions = {};
            locationsfetchOptions.resourceTitle = "locations-clinics";
            locationsfetchOptions.onSuccess = callback;
            locationsfetchOptions.criteria = {
                "site.code": siteCode
            };
            ADK.ResourceService.fetchCollection(locationsfetchOptions);
        },
        getAdmissions: function(callback) {
            var admissionsfetchOptions = {
                patient: ADK.PatientRecordService.getCurrentPatient(),
                resourceTitle: 'visits-admissions',
                criteria: {},
                onSuccess: callback
            };
            return ADK.PatientRecordService.fetchCollection(admissionsfetchOptions);
        },
        getAppointments: function(callback) {
            var appointmentsfetchOptions = {
                patient: ADK.PatientRecordService.getCurrentPatient(),
                resourceTitle: 'visits-appointments',
                criteria: {},
                onSuccess: callback
            };

            return ADK.PatientRecordService.fetchCollection(appointmentsfetchOptions);
        },
        providerParser: providerParser,
        locationsParser: locationsParser,
        admissionsParser: admissionsParser,
        appointmentsParser: appointmentsParser,
        collectionDateFilter: collectionDateFilter
    };

    function collectionDateFilter(col, fromDate, toDate) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        self = this;
        return _.filter(col.models, function(model) {
            var d = moment(model.get('dateTime'), "YYYYMMDDHHmm");
            return (moment(this.fromDate || '01/01/1900') <= d) && (d <= moment(this.toDate || '01/01/2999'));
        }, self);
    }

    function admissionsParser(col) {
        col.forEach(function(model) {
            model.set({
                formatteddateTime: moment(model.get('dateTime'), "YYYYMMDDHHmm").format('MM/DD/YYYY HH:mm')
            });
        });
        return col;
    }

    function appointmentsParser(col) {
        col.forEach(function(model) {
            model.set({
                formatteddateTime: moment(model.get('dateTime'), "YYYYMMDDHHmm").format('MM/DD/YYYY HH:mm')
            });
        });
        return col;
    }

    function locationsParser(collection) {
        var pickListArray = [{
            pickList: [{}]
        }];
        var pickList = collection.map(function(model) {
            return {
                label: model.get('name'),
                value: model.get('uid')
            };
        });
        pickListArray[0].pickList = pickList;
        return pickListArray;
    }

    function providerParser(collection) {
        var pickListArray = [{
            pickList: [{}]
        }];
        var pickList = collection.map(function(model) {
            return {
                label: model.get('name'),
                value: model.get('code')
            };
        });
        pickListArray[0].pickList = pickList;
        return pickListArray;
    }
    return collectionHandler;
});