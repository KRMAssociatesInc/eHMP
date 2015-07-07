define([
    "hbs!app/applets/add_nonVA_med/opData/dropdownViewTemplate",
    "moment"
], function(dropdownViewTemplate, Moment) {
    'use strict';

    var dosageCollection = new Backbone.Collection(),
        routeCollection = new Backbone.Collection(),
        scheduleCollection = new Backbone.Collection(),
        displayModel = new Backbone.Model(),
        med;

    var defaultFetchDone = false;
    var scheduleFetchDone = false;

    var defaultsFetchOptions = {
        resourceTitle: "med-op-data-defaults",
        criteria: {},
        onError: function(model, resp) {
            opData.errorView.addError(resp.responseText);
            defaultFetchDone = true;
        },
        onSuccess: function(model, resp) {
            if(model.toJSON()[0].internal.AllDoses){
                dosageCollection.reset(model.toJSON()[0].internal.AllDoses);
            } else {
                dosageCollection.reset();
            }
            if (model.toJSON()[0].internal.Route){
                routeCollection.reset(model.toJSON()[0].internal.Route);
            }
            displayModel.set(model.toJSON()[0].display);
            defaultFetchDone = true;
        }
    };

    var scheduleFetchOptions = {
        resourceTitle: "med-op-data-schedule",
        criteria: {},

        onError: function(model, resp) {
            opData.errorView.addError(resp.responseText);
            scheduleFetchDone = true;
        },
        onSuccess: function(model, resp) {
            if (model.toJSON()){
                scheduleCollection.reset(model.toJSON());
            } else {
                scheduleCollection.reset();
            }
            scheduleFetchDone = true;
        }
    };

    var getCollection = function(name) {
        switch (name.toLowerCase()) {
            case 'dose':
                return dosageCollection;
            case 'route':
                return routeCollection;
            case 'name':
                return scheduleCollection;
            default:
                return;
        }
    };

    var getChildView = function(attr) {
        return Backbone.Marionette.ItemView.extend({
            initialize: function() {},
            template: dropdownViewTemplate,
            tagName: 'li',
            className: '',
            templateHelpers: function() {
                return {
                    data: this.model.get(attr)
                };
            }
        });
    };

    var getPreviewValuesObj = function() {
        var obj = {},
            doseCompare = {
                dose: ($('#dosage').val()) ? $('#dosage').val().toUpperCase() : ''
            },
            routeCompare = {
                route: ($('#route').val()) ? $('#route').val().toUpperCase() : ''
            },
            scheduleCompare = {
                name: ($('#schedule').val()) ? $('#schedule').val().toUpperCase() : ''
            };

        obj.dose = obj.amount = $('#dosage').val();
        if (dosageCollection.where(doseCompare).length > 0) {
            getDispAmount(doseCompare, obj);
        }

        obj.route = $('#route').val();
        if (routeCollection.where(routeCompare).length > 0) {
            obj.route = getDispRoute(routeCompare);
            obj.routeIEN = routeCollection.where(routeCompare)[0].get('routeien');
        }

        obj.verb = displayModel.get('Verb') ? displayModel.get('Verb')[0].value + ' ' : '';
        obj.medName = displayModel.get('Medication') ? displayModel.get('Medication')[0].value + ' ' : '';

        obj.schedule = $('#schedule').val();
        if (scheduleCollection.where(scheduleCompare).length > 0) {
            obj.schedule = scheduleCollection.where(scheduleCompare)[0].get('externalValue') ||
                scheduleCollection.where(scheduleCompare)[0].get('name');
        }

        return obj;
    };

    var getDispAmount = function(doseCompare, obj) {
        obj.doseString = dosageCollection.where(doseCompare)[0].get('dose_desc');
        obj.doseIEN = dosageCollection.where(doseCompare)[0].get('drugien');
        var descArr = dosageCollection.where(doseCompare)[0].get('dose_desc').split('&');
        obj.amount = (descArr[2] + descArr[3]) || descArr[4];
        obj.strength = (descArr[6] + descArr[7]) || '';
    };

    var getDispRoute = function(doseCompare) {
        var model = routeCollection.where(doseCompare)[0];
        var prep = displayModel.get('Preposition') ? displayModel.get('Preposition')[0].value + ' ' : '';
        return prep + (model.get('outpatient_expansion') || model.get('route'));
    };

    var updateInput = function(applet) {
        if (med.get('savedMed')) {
            var inMed = med.get('savedMed'),
                strength = inMed.get('strength'),
                instr = inMed.get('instr'),
                route = inMed.get('route'),
                schedule = inMed.get('schedule'),
                comments = inMed.get('comment'),
                drug = inMed.get('drug'),
                orderable = inMed.get('orderable'),
                sig = inMed.get('sig'),
                date = (inMed.get('start') && new Moment(inMed.get('start').displayvalue).format(ADK.utils.dateUtils.defaultOptions().placeholder)) || '',
                formattedDate = (date && new Moment(date).format(ADK.utils.dateUtils.defaultOptions().placeholder)) || '',
                statements = inMed.get('statements'),
                NOT_RECOMMENDED = 'Non-VA medication not recommended by VA provider.',
                RECOMMENDED = 'Non-VA medication recommended by VA provider.',
                NON_VA_PHARMACY = 'Patient wants to buy from Non-VA pharmacy.',
                NON_VA_PROVIDER = 'Medication prescribed by Non-VA provider.',
                verb = displayModel.get('Verb') ? displayModel.get('Verb')[0].value + ' ' : '';

            applet.find('#dosage').val((instr && instr.displayvalue) || '');
            applet.find('#route').val((route && route.displayvalue) || '');
            applet.find('#schedule').val((schedule && schedule.displayvalue) || '');
            applet.find('#comments').val((comments && comments.values.text) || '');

            if (formattedDate) {
                applet.find('#startDate').datepicker('update', formattedDate);
            } else {
                applet.find("#startDate").val('');
            }

            // Radio and check boxes
            if (sig && sig.displayvalue && sig.displayvalue.toLowerCase().indexOf('prn') > -1) {
                applet.find('#prn').prop('checked', true);
            }

            var definedComments = [];

            if (statements && statements.displayvalue) {
                if (statements.displayvalue.indexOf(NOT_RECOMMENDED) > -1) {
                    applet.find('#notRecommended').prop('checked', true);
                    definedComments.push('<p>' + NOT_RECOMMENDED);
                }
                if (statements.displayvalue.indexOf(RECOMMENDED) > -1) {
                    applet.find('#recommended').prop('checked', true);
                    definedComments.push('<p>' + RECOMMENDED);
                }
                if (statements.displayvalue.indexOf(NON_VA_PHARMACY) > -1) {
                    applet.find('#nonVApharmacy').prop('checked', true);
                    definedComments.push('<p>' + NON_VA_PHARMACY);
                }
                if (statements.displayvalue.indexOf(NON_VA_PROVIDER) > -1) {
                    applet.find('#nonVAprovider').prop('checked', true);
                    definedComments.push('<p>' + NON_VA_PROVIDER);
                }
            }

            var instructions = sig && sig.displayvalue;
            var line1 = '<p>',
                line2 = '<p>',
                line3 = '<p>';
            line1 += med.get('name') || '';
            //line2 += (sig && sig.displayvalue + ' ') || '';
            line2 += (strength && strength.displayvalue + ' ') || '';
            line3 += (instructions && instructions + ' ') +
                (date && 'Start Date: ' + date + '<p>' || '') +
                (definedComments && definedComments + ' ' || '') +
                (comments && comments.values.text + ' ' || '');

            applet.find('#previewOrder').html(line1 + line2 + line3);
        }
    };

    function isEmpty(obj) {
        return (obj !== '');
    }

    var opData = {
        setMed: function(inMed) {
            med = inMed;
        },
        getMed: function() {
            return med;
        },

        getDate: function() {
            var patientModel = ADK.PatientRecordService.getCurrentPatient().get('visit') || '';
            if (isEmpty(patientModel)) {
                var patientDate = patientModel.formattedDate;
                var formatedDate = new Date(patientDate);
                var startDate = formatedDate.getFullYear() + "-" + formatedDate.getMonth() + 1 + '-' + formatedDate.getDate();
                return startDate;
            }
        },
        updateInput: function(applet) {
            return updateInput(applet);
        },
        getPreviewValues: function() {
            return getPreviewValuesObj();
        },
        getCollection: function(name) {
            return getCollection(name);
        },
        fetchDone: function(){
            var ret = defaultFetchDone && scheduleFetchDone;
            return ret;
        },
        resetFetch: function(){
            defaultFetchDone = false;
            scheduleFetchDone = false;
        },

        fetchScheduleOpData: function(args){
            var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');
            var param = {
                "dfn": dfn
            };
            scheduleFetchOptions.criteria.param = JSON.stringify(param);
            ADK.ResourceService.fetchCollection(scheduleFetchOptions);
            this.errorView.clearErrors();
        },

        fetchDefaultsOpData: function(args){
            var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');
            var param = {
                "oi": med.get('IEN'),
                "pstype": "X",
                "orvp": dfn,
                "needpi": "Y",
                "pkiactiv": "Y"
            };
            defaultsFetchOptions.criteria.param = JSON.stringify(param);

            //Fetch collections
            ADK.ResourceService.fetchCollection(defaultsFetchOptions);

        },

        fetchOpData: function(args) {
            var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');
            var param = {
                "dfn": dfn
            };
            scheduleFetchOptions.criteria.param = JSON.stringify(param);

            // TODO: this is hardcoded and may need to be updated.
            // OI(R)=Order Item file 101.41 IEN
            // PSTYPE(R)=Pharmacy type
            // ORVP(R)=Patient DFN
            // NEEDPI(R)=Patient instructions flag
            // PKIACTIV(R)=Drug DEA Schedule flag
            // All fields are required.  NEEDPI and PKIACTIV are booleans and should be either 'y' or 'n'.

            param = {
                "oi": med.get('IEN'),
                "pstype": "X",
                "orvp": dfn,
                "needpi": "Y",
                "pkiactiv": "Y"
            };
            defaultsFetchOptions.criteria.param = JSON.stringify(param);

            //Fetch collections
            ADK.ResourceService.fetchCollection(defaultsFetchOptions);
            ADK.ResourceService.fetchCollection(scheduleFetchOptions);

            this.errorView.clearErrors();
        },
        getComboBoxView: function(attr) {
            return Backbone.Marionette.CollectionView.extend({
                initialize: function() {
                    var self = this;
                    this.collection = getCollection(attr);
                },
                collectionEvents: {
                    "sync change reset": "render"
                },
                childView: getChildView(attr),
                tagName: 'ul',
                className: 'nav nav-pills nav-stacked',
                attributes: {}
            });
        }
    };

    return opData;
});
