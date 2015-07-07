define([
    'jquery',
    'jquery.inputmask',
    'backbone',
    'marionette',
    'hbs!app/applets/addOrder/templates/dropdownViewTemplate',
    'hbs!app/applets/addOrder/templates/dosageDropdownViewTemplate'
], function($, InputMask, Backbone, Marionette, dropdownViewTemplate, dosageDropdownViewTemplate) {
    'use strict';
    var dosageCollection = new Backbone.Collection(),
        routeCollection = new Backbone.Collection(),
        scheduleCollection = new Backbone.Collection(),
        displayModel = new Backbone.Model(),
        med;

    var defaultsFetchOptions = {
        patient: ADK.PatientRecordService.getCurrentPatient(),
        resourceTitle: 'med-op-data-defaults',
        criteria: {},
        onSuccess: function(model, resp) {
            var firstModelInJSON = model.toJSON()[0];

            for(var i=0; i<firstModelInJSON.internal.AllDoses.length; ++i) {
                firstModelInJSON.internal.AllDoses[i].price_per_dispensed_unit =
                    firstModelInJSON.internal.Dosage[i].price_per_dispensed_unit;
            }

            dosageCollection.reset(firstModelInJSON.internal.AllDoses);
            routeCollection.reset(firstModelInJSON.internal.Route);
            displayModel.set(firstModelInJSON.display);
        }
    };

    var scheduleFetchOptions = {
        patient: ADK.PatientRecordService.getCurrentPatient(),
        resourceTitle: 'med-op-data-schedule',
        criteria: {},

        onSuccess: function(model, resp) {
            scheduleCollection.reset(model.toJSON());
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
            getTemplate: function() {
                if (attr === 'dose')  {
                    return dosageDropdownViewTemplate;
                }
                else {
                    return dropdownViewTemplate;
                }
            },
            tagName: 'li',
            className: '',
            templateHelpers: function() {
                var helper = {
                    data: this.model.get(attr)
                };

                if (attr == 'dose') {
                    helper.unitPrice = this.model.get('price_per_dispensed_unit');
                }

                return helper;
            }
        });
    };

    var getPreviewValuesObj = function() {

        var obj = {},
            doseCompare = {
                dose: $('#dosage').val().toUpperCase()
            },
            routeCompare = {
                route: $('#route').val().toUpperCase()
            },
            scheduleCompare = {
                name: $('#schedule').val().toUpperCase()
            };

        //obj.amount = '';// $('#dosage').val();
        //if (dosageCollection.where(doseCompare).length > 0) {
        obj.amount = getDispAmount(doseCompare, obj);
        //}

        obj.route = $('#route').val();
        if (routeCollection.where(routeCompare).length > 0) {
            obj.route = getDispRoute(routeCompare);
            obj.routeIEN = routeCollection.where(routeCompare)[0].get('routeien');
        }

        obj.verb = displayModel.get('Verb') ? displayModel.get('Verb')[0].value + ' ' : '';
        obj.medName = displayModel.get('Medication') ? displayModel.get('Medication')[0].value + ' ' : '';

        obj.schedule = $('#schedule').val();
        if (scheduleCollection.where(scheduleCompare).length > 0) {
            obj.schedule = scheduleCollection.where(scheduleCompare)[0].get('desc') ||
                scheduleCollection.where(scheduleCompare)[0].get('name');
        }
        obj.supply = $('#supply').val();
        obj.quantity = $('#quantity').val();
        obj.refills = $('#refills').val();
        obj.pickup = $("input[name=pickup]:checked").val();
        obj.priority = $('#priority').val();
        return obj;
    };

    var getDispAmount = function(doseCompare, obj) {
        var descArr;
        var count = '';
        var unit = '';
        var doseObject = dosageCollection.where(doseCompare);
        if (doseObject !== undefined && doseCompare.dose.length > 0) {
            obj.doseString = doseObject[0].get('dose_desc');
            obj.drugIEN = doseObject[0].get('drugien');
            descArr = obj.doseString.split('&');
            count = descArr[2];
            unit = descArr[3];
            obj.strength = (descArr[6] + descArr[7]) || '';
            if (descArr[2].length > 0 && (descArr[3].indexOf('TABLET') >= 0 || descArr[3].indexOf('CAPSULE') >=0)) {
                switch (descArr[2]) {
                    case '1':
                        count = 'ONE';
                        break;
                    case '1.5':
                        count = 'ONE-HALF';
                        break;
                    case '2':
                        count = 'TWO';
                        break;
                    case '3':
                        count = 'THREE';
                        break;
                }
            }
        }
        return count + ' ' + unit;
    };

    var getDispRoute = function(doseCompare) {
        var model = routeCollection.where(doseCompare)[0];
        var prep = displayModel.get('Preposition') ? displayModel.get('Preposition')[0].value + ' ' : '';
        return prep + (model.get('outpatient_expansion') || model.get('route'));
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
        getPreviewValues: function() {
            return getPreviewValuesObj();
        },
        getCollection: function(name) {
            return getCollection(name);
        },
        fetchOpData: function(args) {
            var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');
            var param = {
                'dfn': dfn
            };
            scheduleFetchOptions.criteria.param = JSON.stringify(param);

            // All fields are required.  NEEDPI and PKIACTIV are booleans and should be either 'y' or 'n'.
            param = {
                'oi': med.get('IEN'), // OI(R)=Order Item file 101.41 IEN
                'pstype': 'X',  // PSTYPE(R)=Pharmacy type
                'orvp': dfn,    // ORVP(R)=Patient DFN
                'needpi': 'Y',  // NEEDPI(R)=Patient instructions flag
                'pkiactiv': 'Y'  // PKIACTIV(R)=Drug DEA Schedule flag
            };
            defaultsFetchOptions.criteria.param = JSON.stringify(param);

            //Fetch collections
            ADK.PatientRecordService.fetchCollection(defaultsFetchOptions);
            ADK.PatientRecordService.fetchCollection(scheduleFetchOptions);

        },
        getComboBoxView: function(attr) {
            return Backbone.Marionette.CollectionView.extend({
                initialize: function() {
                    var self = this;
                    this.collection = getCollection(attr);
                },
                childView: getChildView(attr),
                tagName: 'ul',
                className: 'nav nav-pills nav-stacked',
                attributes: {},
                onRender: function() {
                    this.applyInputMasking();
                    this.populateDefaults();
                },
                applyInputMasking: function() {
                    // if (attr === 'dose') {
                    //     $('#dosage').inputmask('Regex', {
                    //         regex: "(^[^^\\.])[\\sa-zA-Z0-9`~!@#$%&*()\\-_=+\\[\\]{}\\\\|;:\'\",<.>/?]{0,122}"
                    //     });
                    // } else if (attr === 'name') {
                    //     $('#schedule').inputmask('Regex', {
                    //         regex: "^.{0,20}$"
                    //     });
                    // }

                },
                populateDefaults: function() {
                    console.log('default display.Route = ' + displayModel.get('Route'));
                    console.log('default display.Schedule = '+ displayModel.get('Schedule'));
                }
            });
        },
        getDoseComboBoxView: function() {

        }
    };

    return opData;
});
