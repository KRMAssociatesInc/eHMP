define([
    'backbone',
    'marionette',
    'underscore',
    'moment',
    'app/applets/addVitals/utils/dateTimeUtil',
    'app/applets/addVitals/utils/viewHelper'
], function(Backbone, Marionette, _, Moment, dateUtil, viewHelper) {
    'use strict';
    var helper = viewHelper;
    var vitalsFetchOptions = {
        resourceTitle: 'vitals-qualifier-information',
        criteria: {},
        onError: function(model, resp) {
            //console.log("error");
        },
        onSuccess: function(model, resp) {
            var names = ['BLOOD PRESSURE', 'PULSE', 'RESPIRATION', 'TEMPERATURE', 'PULSE OXIMETRY', 'HEIGHT', 'PAIN', 'WEIGHT', 'CENTRAL VENOUS PRESSURE', 'CIRCUMFERENCE/GIRTH'];
            var models = getModelsAry();
            var opData = new Backbone.Collection();
            opData.reset(model.toJSON()[0].items);
            var name;
            var vitalModel;
            var idx;
            opData.each(function(data) {
                name = data.get('type');
                idx = names.indexOf(name);
                if (idx >= 0) {
                    vitalModel = models[idx];
                    updateModelFromOpData(vitalModel, data);
                }
            });
            enableLoadingIndicator(false);
            vitalsCollectionModel.reset(models);
            getVitalsModel().onPassOff();
            enableLoadingIndicator(false);
        }
    };

    var getUserSession = function() {
        return ADK.UserService.getUserSession();
    };

    var enableLoadingIndicator = function(isEnabled) {
        if (isEnabled) {
            $("#vitals-loading-indicator").show();
        } else {
            $("#vitals-loading-indicator").hide();
            $('#vitals-loading-indicator').focus();
        }
    };

    var updateModelFromOpData = function(model, opdata) {
        var categories = opdata.get('categories');
        var key;
        var optsData;
        var optsAry;
        var k;
        model.set('fileIEN', opdata.get('fileIEN'));
        if (categories) {
            model.set('qualifiers', categories.length);
            var curr = 0;
            _.each(categories, function(value, key) {
                curr = curr + 1;
                optsAry = [{
                    "fileIEN": "NONE",
                    "name": "None"
                }];
                k = 'qual-' + curr + '-name';

                //special case for Pulse Oximetry
                if (model.get('sname') === 'po') {
                    model.set('qual-3-name', value.name);
                    model.set('qual-3', value.fileIEN);
                } else {
                    model.set('qual-' + curr + '-name', value.name);
                    model.set('qual-' + curr, value.fileIEN);
                }
                optsData = value.qualifiers;
                optsData.sort(function(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
                _.each(optsData, function(option, ckey) {
                    option.name = toTitleCase(option.name);
                    optsAry.push(option);
                });
                //special case for Pulse Oximetry
                if (model.get('sname') === 'po') {
                    model.set('qual-3-options', optsAry);
                } else {
                    model.set('qual-' + curr + '-options', optsAry);
                }
            });
            model.set('qualifiers', curr);
        }
    };

    var toTitleCase = function(str) {
        if (!str) {
            return '';
        } else {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    };

    var VitalsCollection = Backbone.Collection.extend({
        model: Vital
    });

    var vitalsCollectionModel = new VitalsCollection();

    var Vitals = Backbone.Model.extend({

        defaults: function() {
            //patient id
            return {
                'dfn': '',
                "provider-id": '', //*** visit context
                "locIEN": '', //*** visit context id
                "location-name": '', //**** visit context name
                "provider-name": '', //*** get from user session: lastname, firstname
                'on-pass': true,
                'vital-min-reqs': [],
                'vitals-error': [],
                'min-reqs': false,
                'date': '',
                'time': '',
                'date-time-error': '',
                'items': '',
                'user-session': ''
            };
        },

        getDateTimeError: function() {
            return this.get('date-time-error');
        },

        hasValidDateTime: function() {
            return this.get('date-time-error').length === 0;
        },

        addToVitalsErrors: function(item) {
            if ($.inArray(item, this.get('vitals-error')) === -1) {

                this.get('vitals-error').push(item);
            }
        },


        removeFromVitalsErrors: function(item) {
            var ary = this.get('vitals-error');
            var newary = _.without(ary, item);
            this.set('vitals-error', newary);
        },

        addToVitalsMinReqs: function(item) {
            if ($.inArray(item, this.get('vital-min-reqs')) === -1) {
                this.get('vital-min-reqs').push(item);
            }
        },

        removeFromVitalsMinReqs: function(item) {
            var ary = this.get('vital-min-reqs');
            var newary = _.without(ary, item);
            this.set('vital-min-reqs', newary);
        },

        getDate: function() {
            return this.get('date');
        },

        setDate: function(dateString) {
            this.set('date', dateString);
            this.validateDateTime();
            this.checkReqs();
        },

        setLocation: function(locIEN) {
            //console.log("  sett locIEN to " +locIEN);
            this.set('locIEN', locIEN);
            this.checkReqs();
        },

        validateDateTime: function() {
            var dateString = this.get('date');
            var timeString = this.get('time');
            if (!dateUtil.requiredDateFormat(dateString)) {
                this.set('date-time-error', 'Date format is ' + ADK.utils.dateUtils.defaultOptions().placeholder);
            } else if (!dateUtil.requiredTimeFormat(timeString)) {
                this.set('date-time-error', 'Time format is HH:MM a/p');
            } else if (dateUtil.futureDate(dateString, timeString)) {
                this.set('date-time-error', 'Future date not permitted');
            } else {
                this.set('date-time-error', '');
            }
            this.checkReqs();
        },
        setTime: function(timeString) {
            this.set('time', timeString);
            this.validateDateTime();
            this.checkReqs();
        },

        getTime: function() {
            return this.get('time');
        },

        toggleOnPass: function() {
            var oldVal = this.get('on-pass');
            var newVal = oldVal === false ? true : false;
            this.set('on-pass', newVal);
            this.get('items').each(function(model) {
                model.setOnPass(newVal);
            });

            this.checkReqs();
        },

        onPassOff: function() {
            this.set('on-pass', false);
            this.get('items').each(function(model) {
                model.setOnPass(false);
            });

            this.checkReqs();

        },

        updateError: function(val, isError) {
            if (isError) {
                this.addToVitalsErrors(val);
            } else {
                this.removeFromVitalsErrors(val);
            }
            this.checkReqs();
        },


        updateVitalMinReqs: function(val, hasReqs) {
            if (hasReqs) {
                this.addToVitalsMinReqs(val);
            } else {
                this.removeFromVitalsMinReqs(val);
            }
            this.checkReqs();
        },


        checkReqs: function() {
            var min = this.get('date-time-error').length === 0 && this.get('vitals-error').length === 0;
            min = min && this.get('locIEN').length > 0;
            var reqs = false;
            if (this.get('on-pass') || this.get('vital-min-reqs').length > 0) {
                reqs = true;
            }
            this.set('min-reqs', min && reqs);
        },

        addOption: function(fileIEN) {
            if (fileIEN !== 'NONE' && !_.contains(this.get('sel_options'), fileIEN)) {
                this.get('sel_options').push(fileIEN);
            }
        }

    });

    var vitals = new Vitals({

    });



    var getVitalsCollectionModel = function() {
        return vitalsCollectionModel;
    };

    var getVitalsModel = function() {
        return vitals;
    };


    var initVitalsModel = function(vitalsModel, vitalsCollectionModel) {
        var patient = ADK.PatientRecordService.getCurrentPatient();
        var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');
        var pid = ADK.PatientRecordService.getCurrentPatient().attributes.pid;
        var session = ADK.UserService.getUserSession();
        var site = session.attributes.site;
        var last = session.attributes.lastname;
        var first = session.attributes.firstname;
        var providerName = last + ',' + first;

        //logged in user
        var models = getModelsAry();
        vitalsCollectionModel.reset(models);
        //console.log("  creating new instance");
        vitals.set({
            //'duz' : duz,
            'dfn': dfn,
            "provider-id": '', //*** visit context
            "locIEN": '', //*** visit context id
            "location-name": '', //**** visit context name
            "provider-name": providerName, //*** get from user session: lastname, firstname
            'on-pass': true,
            'vital-min-reqs': [],
            'vitals-error': [],
            'min-reqs': false,
            'date': '',
            'time': '',
            'date-time-error': '',
            'items': vitalsCollectionModel,
            'user-session': session
        });
        _.bindAll(vitals, 'getDateTimeError', 'validateDateTime', 'hasValidDateTime', 'setDate', 'setTime', 'getDate', 'getTime', 'toggleOnPass', 'checkReqs', 'updateError', 'updateVitalMinReqs', 'addToVitalsMinReqs', 'removeFromVitalsMinReqs', 'addToVitalsErrors', 'removeFromVitalsErrors');
        return vitals;
    };


    var Vital = Backbone.Model.extend({
        defaults: {
            'name': '',
            'fileIEN': '',
            'op-name': '',
            'sname': '',
            'reading': '',
            'mask': '',
            'regex': false,
            'error': false,
            'hint': '',
            'min-reqs': false,
            'on-pass': true,
            'units': 1,
            'qualifiers': 0,
            'sel-unit-name': '',
            'sel-unit-val': '',
            'unit-1-name': '',
            'unit-1-val': '',
            'unit-1-upper': '',
            'unit-1-lower': '',
            'unit-1-options': [],
            'unit-2-name': '',
            'unit-2-val': '',
            'unit-2-upper': '',
            'unit-2-lower': '',
            'unit-2-options': [],
            'unavailable': false,
            'refused': false,
            'date': '',
            'time': '',
            'validator': '1',
            'valid-info': '',
            'sel-options': [],
            'qual-1': '',
            'qual-1-name': '',
            'qual-1-val': 'None',
            'qual-1-error': '',
            'qual-1-hint': '',
            'qual-1-options': [],
            'qual-1-sel': '',
            'qual-2': '',
            'qual-2-name': '',
            'qual-2-val': 'None',
            'qual-2-error': '',
            'qual-2-hint': '',
            'qual-2-options': [],
            'qual-2-sel': '',
            'qual-3': '',
            'qual-3-name': '',
            'qual-3-val': 'None',
            'qual-3-error': '',
            'qual-3-hint': '',
            'qual-3-options': [],
            'qual-3-sel': '',
            'qual-4': '',
            'qual-4-name': '',
            'qual-4-val': 'None',
            'qual-4-hint': '',
            'qual-4-error': '',
            'qual-4-options': [],
            'qual-4-sel': '',
        },
        toggleURAttribute: function(attr) {
            var oldVal = this.get(attr);
            var newVal = oldVal === false ? true : false;
            this.set(attr, newVal);
            if (newVal) {
                this.clearData();
                if (attr === 'unavailable') {
                    this.set('refused', oldVal);
                    this.set('unavailable-label', this.get('name') + ' unavailable selected. Vitals row disabled.');
                    this.set('refused-label', this.get('name') + ' refused');
                } else if (attr === 'refused') {
                    this.set('unavailable', oldVal);
                    this.set('refused-label', this.get('name') + ' refused selected. Vitals row disabled.');
                    this.set('unavailable-label', this.get('name') + ' unavailable');
                }
            } else {
                if (attr === 'unavailable') {
                    this.set('unavailable-label', this.get('name') + ' unavailable');
                } else if (attr === 'refused') {
                    this.set('refused-label', this.get('name') + ' refused');
                }
            }
            this.checkReqs();
        },

        clearData: function() {
            this.set({
                'reading': '',
                'error': false,
                'qual-1': '',
                'qual-1-val': 'None',
                'qual-1-error': '',
                'qual-1-sel': '',
                'qual-2': '',
                'qual-2-val': 'None',
                'qual-2-error': '',
                'qual-2-sel': '',
                'qual-3': '',
                'qual-3-val': 'None',
                'qual-3-error': '',
                'qual-3-sel': '',
                'qual-4': '',
                'qual-4-val': 'None',
                'qual-4-error': '',
                'qual-4-sel': '',
            });
            if (this.get('sname') === 'po') {
                this.set('qual-1-val', '');
                this.set('qual-2-val', '');
            }
        },

        setOnPass: function(isOnPass) {
            this.set('on-pass', isOnPass);
            if (isOnPass) {
                this.clearData();
            }
            this.checkReqs();
        },

        setQualifier: function(category, fileIEN) {
            if (fileIEN === 'NONE') {
                this.set(category, '');
            } else {
                this.set(category, fileIEN);
            }
        },

        toggleUnit: function(seln) {
            //console.log('  toggleUnit with ' +seln);
            this.set('sel-unit-name', seln);
            var retval = this.validateReading();
            //console.log("  validate returned " +retval);
            if (retval.toString() === 'false') {
                this.set('error', false);
            } else {
                this.set('hint', retval);
                this.set('error', true);
            }
            this.checkReqs();
        },

        setReading: function(value) {
            //returns false or an error string
            this.set('reading', value);
            var retval = this.validateReading();
            if (retval.toString() === 'false') {
                this.set('error', false);
            } else {
                this.set('hint', retval);
                this.set('error', true);
            }
            this.checkReqs();
            //return nothing for good value, error message for bad value
            return retval ? retval : false;
        },


        setFlowRate: function(value) {
            this.set('qual-1-val', value);
            var retval = this.getFlowRateError();
            if (retval.toString() === 'false') {
                this.set('qual-1-error', false);
            } else {
                this.set('qual-1-hint', retval);
                this.set('qual-1-error', true);
            }
            this.checkReqs();
            //return nothing for good value, error message for bad value
            return retval ? retval : false;
        },


        setOxiConc: function(value) {
            this.set('qual-2-val', value);
            var retval = this.getOxiConcError();
            if (retval.toString() === 'false') {
                this.set('qual-2-error', false);
            } else {
                this.set('qual-2-hint', retval);
                this.set('qual-2-error', true);
            }
            this.checkReqs();
            //return nothing for good value, error message for bad value
            return retval ? retval : false;

        },

        getFileIEN: function() {
            return this.get('fileIEN');
        },

        getReading: function() {
            return this.get('reading');
        },

        getUnit: function() {
            return this.get('sel-unit-name');
        },

        isRefused: function() {
            return this.get('refused');
        },

        isUnavailable: function() {
            return this.get('unavailable');
        },

        setError: function(value) {
            this.set('error', value);
        },

        hasMinReqs: function() {
            return this.get('min-reqs');
        },

        isError: function() {
            return this.get('error');
        },

        isQual1Error: function() {
            return this.get('qual-1-error');
        },
        isQual2Error: function() {
            return this.get('qual-2-error');
        },
        isQual3Error: function() {
            return this.get('qual-3-error');
        },
        isQual4Error: function() {
            return this.get('qual-4-error');
        },


        getQualifiers: function() {
            var quals = [];
            if (this.get('qual-1-sel')) {
                quals.push(this.get('qual-1-sel'));
            }
            if (this.get('qual-2-sel')) {
                quals.push(this.get('qual-2-sel'));
            }
            if (this.get('qual-3-sel')) {
                quals.push(this.get('qual-3-sel'));
            }
            if (this.get('qual-4-sel')) {
                quals.push(this.get('qual-4-sel'));
            }
            return quals;
        },

        getUpper: function() {
            //console.log('  getUpper');
            var unit = this.get('sel-unit-name');
            //console.log('  unit: ' +unit);
            return this.get('unit-1-name') === unit ? Number(this.get('unit-1-upper')) : Number(this.get('unit-2-upper'));
        },

        getLower: function() {
            var unit = this.get('sel-unit-name');
            return this.get('unit-1-name') === unit ? Number(this.get('unit-1-lower')) : Number(this.get('unit-2-lower'));
        },

        validateReading: function() {
            if (this.get('validator') === '1') {
                return this.getReadingError();
            } else {
                return this.getBPReadingError();
            }
        },


        getFlowRateError: function() {
            var value = this.get('qual-1-val');
            if (value === '') {
                return false;
            }
            var upper = this.get('qual-1-upper');
            var lower = this.get('qual-1-lower');
            if (Number(value) <= upper && Number(value) >= lower) {
                return false;
            }
            return lower + ' to ' + upper;
        },


        getOxiConcError: function() {
            var value = this.get('qual-2-val');
            if (value === '') {
                return false;
            }
            var upper = this.get('qual-2-upper');
            var lower = this.get('qual-2-lower');
            if (Number(value) <= upper && Number(value) >= lower) {
                return false;
            }

            return lower + ' to ' + upper;
        },

        getReadingError: function() {
            var value = this.get('reading');
            //empty value or option selected from list

            if (value === '' || this.get('unit-options') === 'true') {
                return false;
            }
            var test = value ? value : this.get('reading');
            var upper = this.getUpper();
            var lower = this.getLower();
            //console.log('  upper: ' +upper+ "  lower: " +lower);
            if (Number(test) <= upper && Number(test) >= lower) {
                return false;
            }
            return lower + ' to ' + upper;
        },


        getBPReadingError: function() {
            var value = this.get('reading');
            if (value === '') {
                return false;
            }
            var upper = this.get('unit-1-upper');
            var lower = this.get('unit-1-lower');
            var retval = false;
            var parts = value.toString().split('/');
            var err = 'nnn/nnn 0 to 300';
            if (parts.length < 2 || parts.length > 3) {
                //console.log('  wrong number of parts');
                retval = err;
            }
            for (var i = 0; i < parts.length; i++) {
                if (Number(parts[i]) > upper || Number(parts[i]) < lower) {
                    retval = err;
                    break;
                }
            }

            return retval;
        },

        checkReqs: function() {
            //Check whether the vital is either refused or unavailable or has a reading
            var ready = this.get('refused') === true || this.get('unavailable') === true;
            ready = ready || this.get('reading').length > 0;
            this.set('min-reqs', ready);
        }
    });

    var getModelsAry = function() {
        var bp = new Vital({
            'name': 'Blood Pressure',
            'op-name': 'BLOOD PRESSURE',
            'sname': 'bp',
            'validator': '2',
            'sel-unit-name': 'mm[Hg]',
            'unit-1-name': 'mm[Hg]',
            'unit-1-upper': 300,
            'unit-1-lower': 0,
            'valid-info': 'nnn/nnn 0-300',
            'mask': '\\d{1,3}/\\d{1,3}(/\\d{1,3})?',
            'regex': true,
            'refused-label': 'Blood Pressure refused',
            'unavailable-label': 'Blood pressure unavailable'

        });
        var pulse = new Vital({
            'name': 'Pulse',
            'op-name': 'PULSE',
            'sname': 'pu',
            'sel-unit-name': '/min',
            'unit-1-name': '/min',
            'unit-1-upper': 300,
            'unit-1-lower': 0,
            'valid-info': '0-300',
            'mask': '\\d{1,3}',
            'regex': true,
            'refused-label': 'Pulse refused',
            'unavailable-label': 'Pulse unavailable'
        });
        var resp = new Vital({
            'name': 'Respiration',
            'op-name': 'RESPIRATION',
            'sname': 're',
            'sel-unit-name': '/min',
            'unit-1-name': '/min',
            'unit-1-upper': 100,
            'unit-1-lower': 0,
            'valid-info': '0-100',
            'mask': '\\d{1,3}',
            'regex': true,
            'refused-label': 'Respiration refused',
            'unavailable-label': 'Respiration unavailable'
        });
        var temp = new Vital({
            'name': 'Temperature',
            'op-name': 'TEMPERATURE',
            'sname': 'te',
            'units': 2,
            'sel-unit-name': 'F',
            'unit-1-name': 'F',
            'unit-1-upper': 120,
            'unit-1-lower': 45,
            'unit-2-name': 'C',
            'unit-2-upper': 48.9,
            'unit-2-lower': 7.2,
            'mask': '\\d{1,3}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'Temperature refused',
            'unavailable-label': 'Temperature unavailable'
        });
        var oxi = new Vital({
            'name': 'Pulse Oximetry',
            'op-name': 'PULSE OXIMETRY',
            'sname': 'po',
            'units': 2,
            'sel-unit-name': '%',
            'unit-1-name': '%',
            'unit-1-upper': 100,
            'unit-1-lower': 0,
            'qual-1-name': 'Flow Rate',
            'qual-1-sname': 'fr',
            'qual-1-upper': 20,
            'qual-1-lower': 0.5,
            'qual-1-mask': '\\d{1,2}(\\.\\d{1,2})?',
            'qual-1-regex': true,
            'qual-2-name': 'O2 Conc. (%)',
            'qual-2-sname': 'oc',
            'qual-2-upper': 100,
            'qual-2-lower': 21,
            'qual-2-mask': '\\d{1,3}',
            'qual-2-regex': true,
            'mask': '\\d{1,3}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'Pulse Oximetry refused',
            'unavailable-label': 'Pulse Oximetry unavailable'
        });
        var height = new Vital({
            'name': 'Height',
            'op-name': 'HEIGHT',
            'sname': 'he',
            'units': 2,
            'sel-unit-name': 'in',
            'unit-1-name': 'in',
            'unit-1-upper': 100,
            'unit-1-lower': 10,
            'unit-2-name': 'cm',
            'unit-2-upper': 254,
            'unit-2-lower': 25.4,
            'mask': '\\d{1,3}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'Height refused',
            'unavailable-label': 'Height unavailable'
        });
        var pain = new Vital({
            'name': 'Pain',
            'op-name': 'PAIN',
            'sname': 'pa',
            'unit-1-name': '',
            'unit-options': 'true',
            'unit-1-options': ['', '0 - no pain', '1 - slightly uncomfortable', '2', '3', '4', '5', '6', '7', '8', '9', '10 - worst imaginable', '99 - unable to respond'],
            //'unit-1-options' : ['','a bad','b fair','c good','1 yes','2','3'],
            'refused-label': 'Pain refused',
            'unavailable-label': 'Pain unavailable'
        });
        var weight = new Vital({
            'name': 'Weight',
            'op-name': 'WEIGHT',
            'sname': 'we',
            'units': 2,
            'sel-unit-name': 'lb',
            'unit-1-name': 'lb',
            'unit-1-upper': 1500,
            'unit-1-lower': 0,
            'unit-2-name': 'kg',
            'unit-2-upper': 680.39,
            'unit-2-lower': 0,
            'mask': '\\d{1,4}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'Weight refused',
            'unavailable-label': 'Weight unavailable'
        });
        var cvp = new Vital({
            'name': 'CVP',
            'op-name': 'CENTRAL VENOUS PRESSURE',
            'sname': 'cv',
            'units': 2,
            'sel-unit-name': 'cm H2O',
            'unit-1-name': 'cm H2O',
            'unit-1-upper': 13.6,
            'unit-1-lower': -13.6,
            'unit-2-name': 'mm HG',
            'unit-2-upper': 100,
            'unit-2-lower': -10,
            'mask': '-?\\d{1,3}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'CVP refused',
            'unavailable-label': 'CVP unavailable'
        });
        var girth = new Vital({
            'name': 'Circumference/Girth',
            'op-name': 'CIRCUMFERENCE/GIRTH',
            'sname': 'ci',
            'units': 2,
            'sel-unit-name': 'in',
            'unit-1-name': 'in',
            'unit-1-upper': 200,
            'unit-1-lower': 1,
            'unit-2-name': 'cm',
            'unit-2-upper': 508,
            'unit-2-lower': 2.54,
            'mask': '\\d{1,3}(\\.\\d{1,2})?',
            'regex': true,
            'refused-label': 'Circumference/Girth refused',
            'unavailable-label': 'Circumference/Girth unavailable'
        });
        var ary = [bp, pulse, resp, temp, oxi, height, pain, weight, cvp, girth];
        _.each(ary, function(model) {
            _.bindAll(model, 'set', 'get', 'toggleURAttribute', 'toggleUnit', 'setOnPass', 'setQualifier', 'getQualifiers', 'getFileIEN', 'getUnit', 'getUpper', 'getLower', 'validateReading', 'getReadingError', 'getBPReadingError', 'clearData', 'isError', 'hasMinReqs', 'getReading', 'setReading', 'checkReqs', 'setFlowRate', 'setOxiConc');
        });
        return ary;
    };


    var util = {

        fetchOpData: function() {
            var param = {
                //"pid": pid,
                //'types': 'BP'
            };
            vitalsFetchOptions.criteria.param = JSON.stringify(param);
            ADK.PatientRecordService.fetchCollection(vitalsFetchOptions);
        },
        setAddVidalsSessionFieldValues: function(applet) {
            var AddVidalsModelState = {
                "toJSON": function() {
                    var fields = [{
                        vitalsobsdate: applet.find('#vitals-obs-date').val(),
                    }, {
                        vitalsobstime: applet.find('#vitals-obs-time').val(),
                    }, {
                        notDisabled: applet.find('#patient-on-pass-btn').hasClass("btn pull-right btn-primary"),
                    }, {
                        bpreading: applet.find('#bp-reading').val(),
                    }, {
                        pureading: applet.find('#pu-reading').val(),
                    }, {
                        rereading: applet.find('#re-reading').val(),
                    }, {
                        tereading: applet.find('#te-reading').val(),
                    }, {
                        poreading: applet.find('#po-reading').val(),
                    }, {
                        hereading: applet.find('#he-reading').val(),
                    }, {
                        pareading: applet.find('#pa-reading').val(),
                    }, {
                        wereading: applet.find('#we-reading').val(),
                    }, {
                        cvreading: applet.find('#cv-reading').val(),
                    }, {
                        cireading: applet.find('#ci-reading').val(),
                    }, {
                        teu1btn: applet.find('#te-u1-btn').hasClass("btn-primary"),
                    }, {
                        heu1btn: applet.find('#he-u1-btn').hasClass("btn-primary"),
                    }, {
                        weu1btn: applet.find('#we-u1-btn').hasClass("btn-primary"),
                    }, {
                        cvu1btn: applet.find('#cv-u1-btn').hasClass("btn-primary"),
                    }, {
                        ciu1btn: applet.find('#ci-u1-btn').hasClass("btn-primary"),
                    }, {
                        bpqbtn: applet.find('#bp-q-btn').hasClass("btn-primary"),
                    }, {
                        bpLOCATIONel: applet.find('#bp-LOCATION-sel').val(),
                    }, {
                        bpMETHODsel: applet.find('#bp-METHOD-sel').val(),
                    }, {
                        bpPOSITIONsel: applet.find('#bp-POSITION-sel').val(),
                    }, {
                        bpCUFFSIZEel: applet.find('#bp-CUFF\\ SIZE-sel').val(),
                    }, {
                        puqbtn: applet.find('#pu-q-btn').hasClass("btn-primary"),
                    }, {
                        puLOCATIONel: applet.find('#pu-LOCATION-sel').val(),
                    }, {
                        puMETHODsel: applet.find('#pu-METHOD-sel').val(),
                    }, {
                        puPOSITIONsel: applet.find('#pu-POSITION-sel').val(),
                    }, {
                        puCUFFSIZEel: applet.find('#pu-SITE-sel').val(),
                    }, {
                        reqbtn: applet.find('#re-q-btn').hasClass("btn-primary"),
                    }, {
                        reMETHODsel: applet.find('#re-METHOD-sel').val(),
                    }, {
                        rePOSITIONsel: applet.find('#re-POSITION-sel').val(),
                    }, {
                        teqbtn: applet.find('#te-q-btn').hasClass("btn-primary"),
                    }, {
                        teLOCATIONsel: applet.find('#te-LOCATION-sel').val(),
                    }, {
                        poqbtn: applet.find('#po-q-btn').hasClass("btn-primary"),
                    }, {
                        pofrtext: applet.find('#po-fr-text').val(),
                    }, {
                        pooctext: applet.find('#po-oc-text').val(),
                    }, {
                        METHODsel: applet.find('#METHOD-sel').val(),
                    }, {
                        heqbtn: applet.find('#he-q-btn').hasClass("btn-primary"),
                    }, {
                        heQUALITYsel: applet.find('#he-QUALITY-sel').val(),
                    }, {
                        weqbtn: applet.find('#we-q-btn').hasClass("btn-primary"),
                    }, {
                        weMETHODsel: applet.find('#we-METHOD-sel').val(),
                    }, {
                        weQUALITYsel: applet.find('#we-QUALITY-sel').val(),
                    }, {
                        ciqbtn: applet.find('#ci-q-btn').hasClass("btn-primary"),
                    }, {
                        ciLOCATIONsel: applet.find('#ci-LOCATION-sel').val(),
                    }, {
                        ciSITEsel: applet.find('#ci-SITE-sel').val(),
                    }, {
                        bpubtn: applet.find('#bp-u-btn').hasClass("btn-primary"),
                    }, {
                        bprbtn: applet.find('#bp-r-btn').hasClass("btn-primary"),
                    }, {
                        puubtn: applet.find('#pu-u-btn').hasClass("btn-primary"),
                    }, {
                        purbtn: applet.find('#pu-r-btn').hasClass("btn-primary"),
                    }, {
                        reubtn: applet.find('#re-u-btn').hasClass("btn-primary"),
                    }, {
                        rerbtn: applet.find('#re-r-btn').hasClass("btn-primary"),
                    }, {
                        teubtn: applet.find('#te-u-btn').hasClass("btn-primary"),
                    }, {
                        terbtn: applet.find('#te-r-btn').hasClass("btn-primary"),
                    }, {
                        poubtn: applet.find('#po-u-btn').hasClass("btn-primary"),
                    }, {
                        porbtn: applet.find('#po-r-btn').hasClass("btn-primary"),
                    }, {
                        heubtn: applet.find('#he-u-btn').hasClass("btn-primary"),
                    }, {
                        herbtn: applet.find('#he-r-btn').hasClass("btn-primary"),
                    }, {
                        paubtn: applet.find('#pa-u-btn').hasClass("btn-primary"),
                    }, {
                        parbtn: applet.find('#pa-r-btn').hasClass("btn-primary"),
                    }, {
                        weubtn: applet.find('#we-u-btn').hasClass("btn-primary"),
                    }, {
                        werbtn: applet.find('#we-r-btn').hasClass("btn-primary"),
                    }, {
                        cvubtn: applet.find('#cv-u-btn').hasClass("btn-primary"),
                    }, {
                        cvrbtn: applet.find('#cv-r-btn').hasClass("btn-primary"),
                    }, {
                        ciubtn: applet.find('#ci-u-btn').hasClass("btn-primary"),
                    }, {
                        cirbtn: applet.find('#ci-r-btn').hasClass("btn-primary"),
                    }];
                    return fields;
                }
            };
            ADK.SessionStorage.setAppletStorageModel('addVitals', 'AddVidalsModelState', AddVidalsModelState);



        },
        getAddVitalsSessionFieldValues: function() {
            var uParam;
            var rParam;
            var sName;
            var notLoading = false;

            var isNotLoading = function() {

                if ($('#vitals-loading-indicator').is(':hidden')) {
                    var AddVitalsSession = ADK.SessionStorage.getAppletStorageModel('addVitals', 'AddVidalsModelState');
                    if (AddVitalsSession[0].vitalsobsdate !== '') {
                        $('#vitals-obs-date').val(AddVitalsSession[0].vitalsobsdate);
                    }
                    $('#vitals-obs-time').val(AddVitalsSession[1].vitalsobstime);

                    if (AddVitalsSession[2].notDisabled === true) {
                        vitals.toggleOnPass();
                        $('#patient-on-pass-btn').removeClass("btn pull-right btn-default").addClass("btn pull-right btn-primary");

                    } else {

                        $('#bp-reading').val(AddVitalsSession[3].bpreading);
                        $('#pu-reading').val(AddVitalsSession[4].pureading);
                        $('#re-reading').val(AddVitalsSession[5].rereading);
                        $('#te-reading').val(AddVitalsSession[6].tereading);
                        $('#po-reading').val(AddVitalsSession[7].poreading);
                        $('#he-reading').val(AddVitalsSession[8].hereading);
                        $('#pa-reading').val(AddVitalsSession[9].pareading);
                        $('#we-reading').val(AddVitalsSession[10].wereading);
                        $('#cv-reading').val(AddVitalsSession[11].cvreading);
                        $('#ci-reading').val(AddVitalsSession[12].cireading);
                        if (AddVitalsSession[13].teu1btn !== true) {
                            $('#te-u1-btn').removeClass("btn btn-xs btn-primary").addClass("btn btn-xs btn-default");
                            $('#te-u2-btn').removeClass("btn btn-xs btn-default").addClass("btn btn-xs btn-primary");
                        }
                        if (AddVitalsSession[14].heu1btn !== true) {
                            $('#he-u1-btn').removeClass("btn btn-xs btn-primary").addClass("btn btn-xs btn-default");
                            $('#he-u2-btn').removeClass("btn btn-xs btn-default").addClass("btn btn-xs btn-primary");
                        }
                        if (AddVitalsSession[15].weu1btn !== true) {
                            $('#we-u1-btn').removeClass("btn btn-xs btn-primary").addClass("btn btn-xs btn-default");
                            $('#we-u2-btn').removeClass("btn btn-xs btn-default").addClass("btn btn-xs btn-primary");
                        }
                        if (AddVitalsSession[16].cvu1btn !== true) {
                            $('#cv-u1-btn').removeClass("btn btn-xs btn-primary").addClass("btn btn-xs btn-default");
                            $('#cv-u2-btn').removeClass("btn btn-xs btn-default").addClass("btn btn-xs btn-primary");
                        }
                        if (AddVitalsSession[17].cvu1btn !== true) {
                            $('#ci-u1-btn').removeClass("btn btn-xs btn-primary").addClass("btn btn-xs btn-default");
                            $('#ci-u2-btn').removeClass("btn btn-xs btn-default").addClass("btn btn-xs btn-primary");
                        }
                        if (AddVitalsSession[18].bpqbtn === true) {
                            var qbtn = $('#bp-q-btn');
                            helper.selectBtn(qbtn, true);
                            $('#bp-hide-show').removeClass("hide").addClass("show");
                            $('#bp-hide-show').css("display", "inline");
                            $('#bp-LOCATION-sel').val(AddVitalsSession[19].bpLOCATIONel);
                            $('#bp-METHOD-sel').val(AddVitalsSession[20].bpMETHODsel);
                            $('#bp-POSITION-sel').val(AddVitalsSession[21].bpPOSITIONsel);
                            $('#bp-CUFF\\ SIZE-sel').val(AddVitalsSession[22].bpCUFFSIZEel);
                        }
                        if (AddVitalsSession[23].puqbtn === true) {
                            var puqbtn = $('#pu-q-btn');
                            helper.selectBtn(puqbtn, true);
                            $('#pu-hide-show').removeClass("hide").addClass("show");
                            $('#pu-hide-show').css("display", "inline");
                            $('#pu-LOCATION-sel').val(AddVitalsSession[24].puLOCATIONel);
                            $('#pu-METHOD-sel').val(AddVitalsSession[25].puMETHODsel);
                            $('#pu-POSITION-sel').val(AddVitalsSession[26].puPOSITIONsel);
                            $('#pu-SITE-sel').val(AddVitalsSession[27].puCUFFSIZEel);
                        }
                        if (AddVitalsSession[28].reqbtn === true) {
                            var reqbtn = $('#re-q-btn');
                            helper.selectBtn(reqbtn, true);
                            $('#re-hide-show').removeClass("hide").addClass("show");
                            $('#re-hide-show').css("display", "inline");
                            $('#re-METHOD-sel').val(AddVitalsSession[29].reMETHODsel);
                            $('#re-POSITION-sel').val(AddVitalsSession[30].rePOSITIONsel);
                        }
                        if (AddVitalsSession[31].teqbtn === true) {
                            var teqbtn = $('#te-q-btn');
                            helper.selectBtn(teqbtn, true);
                            $('#te-hide-show').removeClass("hide").addClass("show");
                            $('#te-hide-show').css("display", "inline");
                            $('#te-LOCATION-sel').val(AddVitalsSession[32].teLOCATIONsel);
                        }
                        if (AddVitalsSession[33].poqbtn === true) {
                            var porqbtn = $('#po-q-btn');
                            helper.selectBtn(porqbtn, true);
                            $('#po-hide-show').removeClass("hide").addClass("show");
                            $('#po-hide-show').css("display", "inline");
                            $('#po-fr-text').val(AddVitalsSession[34].pofrtext);
                            $('#po-oc-text').val(AddVitalsSession[35].pooctext);
                            $('#METHOD-sel').val(AddVitalsSession[36].METHODsel);
                        }
                        if (AddVitalsSession[37].heqbtn === true) {
                            var heqbtn = $('#he-q-btn');
                            helper.selectBtn(heqbtn, true);
                            $('#he-hide-show').removeClass("hide").addClass("show");
                            $('#he-hide-show').css("display", "inline");
                            $('#he-QUALITY-sel').val(AddVitalsSession[38].heQUALITYsel);
                        }
                        if (AddVitalsSession[39].weqbtn === true) {
                            var weqbtn = $('#we-q-btn');
                            helper.selectBtn(weqbtn, true);
                            $('#we-hide-show').removeClass("hide").addClass("show");
                            $('#we-hide-show').css("display", "inline");
                            $('#we-METHOD-sel').val(AddVitalsSession[40].weMETHODsel);
                            $('#we-QUALITY-sel').val(AddVitalsSession[41].weQUALITYsel);
                        }
                        if (AddVitalsSession[42].ciqbtn === true) {
                            var ciqbtn = $('#ci-q-btn');
                            helper.selectBtn(ciqbtn, true);
                            $('#ci-hide-show').removeClass("hide").addClass("show");
                            $('#ci-hide-show').css("display", "inline");
                            $('#ci-LOCATION-sel').val(AddVitalsSession[43].ciLOCATIONsel);
                            $('#ci-SITE-sel').val(AddVitalsSession[44].ciSITEsel);
                        }

                        getSessionToggleUR(AddVitalsSession[45].bpubtn, AddVitalsSession[46].bprbtn, 'bp');
                        getSessionToggleUR(AddVitalsSession[47].puubtn, AddVitalsSession[48].purbtn, 'pu');
                        getSessionToggleUR(AddVitalsSession[49].reubtn, AddVitalsSession[50].rerbtn, 're');
                        getSessionToggleUR(AddVitalsSession[51].teubtn, AddVitalsSession[52].terbtn, 'te');
                        getSessionToggleUR(AddVitalsSession[53].poubtn, AddVitalsSession[54].porbtn, 'po');
                        getSessionToggleUR(AddVitalsSession[55].heubtn, AddVitalsSession[56].herbtn, 'he');
                        getSessionToggleUR(AddVitalsSession[57].paubtn, AddVitalsSession[58].parbtn, 'pa');
                        getSessionToggleUR(AddVitalsSession[59].weubtn, AddVitalsSession[60].werbtn, 'we');
                        getSessionToggleUR(AddVitalsSession[61].cvubtn, AddVitalsSession[62].cvrbtn, 'cv');
                        getSessionToggleUR(AddVitalsSession[63].ciubtn, AddVitalsSession[64].cirbtn, 'ci');

                    }

                } else {

                    setTimeout(isNotLoading, 50);
                }
            };
            isNotLoading();
        },
        initVitalsModel: function() {
            return initVitalsModel(getVitalsModel(), getVitalsCollectionModel());
        },
        getVisitModel: function() {
            var selectedVisit = new Backbone.Model();
            selectedVisit.set('visit', ADK.PatientRecordService.getCurrentPatient().get('visit'));
            //console.log(JSON.stringify(select))
            return selectedVisit;
        },

        getVitalsCollectionModel: function() {
            return getVitalsCollectionModel();
        },

        getVitalsModel: function() {
            return getVitalsModel();
        },

        enableLoadingIndicator: function(isEnabled) {
            return enableLoadingIndicator(isEnabled);
        },

        currentObservedDateString: function() {
            return new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder);
        },

    };

    var getSessionToggleUR = function(uParam, rParam, sName) {
        var ubtn = $('#' + sName + '-u-btn');
        var rbtn = $('#' + sName + '-r-btn');
        var qbtn = $('#' + sName + '-q-btn');
        //    var canToggle = qbtn.data('disabled') === 'toggle';
        helper.enableInputs(sName + '-', true);
        helper.enableUnits(sName, true);
        //    if (canToggle) {
        //       helper.enableItem($('#' + sName + '-q-btn'), true);
        //   }
        helper.selectBtn($('#' + sName + '-q-btn'), false);
        if (uParam || rParam) {
            //  this.model.set('sel-unit-name', this.model.get('unit-1-name'));
            //  helper.hideError(sName);
            helper.enableUnits(sName, false);
            helper.resetRowQualifierInputs(sName);
            $('#' + sName + '-hide-show').css("display", "none");
            helper.enableItem($('#' + sName + '-q-btn'), false);
            helper.enableInputs(sName + '-', false);
        }
        if (uParam) {
            helper.selectBtn(ubtn, true);
            helper.selectBtn(rbtn, false);

        } else {
            helper.selectBtn(ubtn, false);
        }

        if (rParam) {
            helper.selectBtn(rbtn, true);
            helper.selectBtn(ubtn, false);

        } else {
            helper.selectBtn(rbtn, false);
        }
    };

    return util;
});
