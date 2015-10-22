define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/immunizations_add_edit/utils/parseUtils',
    'app/applets/immunizations_add_edit/utils/validationUtil'
], function(Backbone, Marionette, $, Handlebars, ParseUtil, ValidationUtil) {

    var ImmunizationAddView = {
        createForm: function() {
            var F360Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row", "section-divider"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            template: Handlebars.compile('<p class="required-note">* indicates a required field.</class></p>'),
                            items: [{
                                control: "radio",
                                name: "immunizationOption",
                                label: "1. Choose an option.",
                                required: true,
                                options: [{
                                    value: "administered",
                                    label: "Administered"
                                }, {
                                    value: "historical",
                                    label: "Historical"
                                }]
                            }, {
                                control: "typeahead",
                                name: "immunizationType",
                                label: "2. Select an immunization type.",
                                required: true,
                                disabled: true,
                                placeholder: 'Search for available immunization types...',
                                options: {
                                    minLength: 2
                                },
                                matcher: function(itemList, labelAttribute) {
                                    return function findMatches(q, cb) {
                                        var matches = [];

                                        var substrRegex = new RegExp(q, 'i');
                                        var administered = formModel.get('immunizationOption') === 'administered';

                                        itemList.each(function(anItem) {
                                            if(ParseUtil.doesItemMatch(substrRegex, anItem, administered)){
                                                matches.push(anItem.toJSON());
                                            }
                                        });
                                        cb(matches);
                                    };
                                }
                            }]
                        }]
                    }]
                }]
            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        items: [{
                            control: 'container',
                            extraClasses: ['col-md-3']
                        },
                        {
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            type: 'button',
                            title: 'Press enter to delete order'
                        },
                        {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Next",
                            id: "nextBtn",
                            name: "nextBtn",
                            disabled: true,
                            title: 'Press enter to proceed to the next step'
                        }]
                    }]
                }]
            }];

            var F360Fields2 = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-12"],
                            template: Handlebars.compile('<h5>{{immunizationLabel}}</h5><span class="text-uppercase">{{immunizationOption}}</span>'),
                            modelListeners: ["immunizationOption", 'immunizationLabel']
                        }, {
                            control: "spacer"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["form-highlight"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "input",
                                    name: "lotNumberHistoric",
                                    label: "Lot Number",
                                    type: "text",
                                    required: false,
                                    title: 'Please enter in lot number'
                                },
                                {
                                    control: "select",
                                    name: "lotNumberAdmin",
                                    label: "Lot Number",
                                    options: [],
                                    required: true
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-6"],
                                items: [{
                                    control: "datepicker",
                                    name: "expirationDate",
                                    label: "Expiration Date"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-6"],
                                items: [{
                                    control: "input",
                                    name: "manufacturerAdmin",
                                    label: "Manufacturer"
                                },
                                {
                                    control: 'typeahead',
                                    name: 'manufacturerHistorical',
                                    label: 'Manufacturer',
                                    options: {
                                        minLength: 3
                                    }
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-md-12"],
                                items: [{
                                    control: "select",
                                    name: "informationSource",
                                    label: "Information Source"
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "datepicker",
                                name: "administrationDate",
                                label: "Administration Date",
                                title: 'Please enter in a date in the following format, MM/DD/YYYY'
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "typeahead",
                                name: "administeringProvider",
                                label: "Administering Provider",
                                options: {
                                    minLength: 3
                                }
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "typeahead",
                                name: "orderingProvider",
                                label: "Ordering Provider",
                                options: {
                                    minLength: 3
                                }
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "typeahead",
                                name: "encounterLocation",
                                label: "Encounter Location",
                                required: true,
                                options: {
                                    minLength: 3
                                }
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "routeOfAdministration",
                                label: "Route of Administration"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "anatomicLocation",
                                label: "Anatomic Location",
                            }]
                        }, {
                            control: 'container',
                            extraClasses: ['col-md-6'],
                            items: [{
                                control: 'input',
                                type: 'decimal',
                                name: 'dose',
                                label: 'Dose',
                                units: 'mL'
                            }]
                        },
                        {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "series",
                                label: "Series"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                multiple: true,
                                name: "informationStatement",
                                label: "Vaccine Information Statement(s) (VIS)",
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "datepicker",
                                name: "visDateOffered",
                                label: "VIS Date Offered",
                                title: 'Please enter in a date in the following format, MM/DD/YYYY'
                            }]
                        }]
                    },
                    {
                        control: 'container',
                        extraClasses: ['row'],
                        items: [{
                            control: 'textarea',
                            extraClasses: ['col-md-12'],
                            name: 'comments',
                            label: 'Comments',
                            maxlength: 245
                        }]
                    }]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-3"],
                        template: Handlebars.compile('<p><span id="notes-saved-at-view2">Saved at {{savedTime}}</span></p>'),
                        modelListeners: ["savedTime"]
                    }, {
                        control: "container",
                        extraClasses: ["col-md-9"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            title: 'Press enter to delete order',
                            type: 'button'
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            title: 'Press enter to close immunization',
                            id: "close-btn"
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Back",
                            title:'Press enter to go back to the previous step',
                            id: "back-btn"
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            title: 'Press enter to add immunization',
                            id: "add-btn"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    savedTime: "00:00",
                    immunizationOption: "",
                    immunizationLabel: '',
                    validProviderSelected: false,
                    errorModel: new Backbone.Model()
                },
                validate: function(attributes, options){
                    return ValidationUtil.validateModel(this);
                }
            });

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var formView = ADK.UI.Form.extend({
                ui: {
                    "immunizationType": "#immunizationType",
                    "nextBtn": ".nextBtn"
                },
                fields: F360Fields,
                events: {
                    'click #delete-btn': function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-exclamation-triangle',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    'submit': function(e) {
                        e.preventDefault();
                        var self = this;
                        this.model.unset("formStatus");
                        var dataForm = workflowController.getFormView(1);

                        dataForm.callControlFunction({
                            controlType: 'select',
                            controlName: 'series',
                            functionName: 'setPickList',
                            options: {
                                pickList: ParseUtil.getSeriesList(this.model.get('maxInSeries'))
                            }
                        });

                        dataForm.callControlFunction({
                            controlType: 'select',
                            controlName: 'informationStatement',
                            functionName: 'setPickList',
                            options: {
                                pickList: this.model.get('immInfoStatements')
                            }
                        });

                        var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
                        var user = ADK.UserService.getUserSession();
                        var userDisplayName = user.get('lastname') + ',' + user.get('firstname');
                        var userId = user.get('duz')[user.get('site')];
                        dataForm.$(dataForm.ui.administeringProviderInput).typeahead('val', userDisplayName);
                        this.model.set('administeringProvider', userDisplayName, {silent: true});
                        this.model.set('administeringProviderPredefinedId', userId);
                        this.model.set('validProviderSelected', true);

                        if(!dataForm.anatomicLocationList){
                            var anatomicLocationOptions = {
                                resourceTitle: 'immunization-crud-anatomicalLocations',
                                onSuccess: function(model, response){
                                    dataForm.anatomicLocationList = ParseUtil.getAnatomicLocationList(response);
                                    dataForm.callControlFunction({
                                        controlType: 'select',
                                        controlName: 'anatomicLocation',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.anatomicLocationList
                                        }
                                    });
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(anatomicLocationOptions);
                        }

                        if(!dataForm.encounterLocationList){

                            var encounterLocationOptions = {
                                resourceTitle: 'locations-clinics',
                                criteria: {
                                    'site.code': ADK.UserService.getUserSession().get('site')
                                },
                                onSuccess: function(model, response){
                                    dataForm.encounterLocationList = ParseUtil.getEncounterLocationList(response);

                                    dataForm.callControlFunction({
                                        controlType: 'typeahead',
                                        controlName: 'encounterLocation',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.encounterLocationList
                                        }
                                    });

                                    var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
                                    dataForm.$(dataForm.ui.encounterLocationInput).typeahead('val', visit.locationDisplayName);
                                    dataForm.model.set('encounterLocation', visit.locationUid, {silent: true});
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(encounterLocationOptions);
                        }

                        if(!dataForm.routeOfAdministrationList){
                            var routeOfAdminOptions = {
                                resourceTitle: 'immunization-crud-routeOfAdministration',
                                onSuccess: function(model, response){
                                    dataForm.routeOfAdministrationList = ParseUtil.getRouteOfAdministrationList(response);
                                    dataForm.callControlFunction({
                                        controlType: 'select',
                                        controlName: 'routeOfAdministration',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.routeOfAdministrationList
                                        }
                                    });
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(routeOfAdminOptions);
                        }

                        if(!dataForm.orderingProviderList){
                            var orderingProviderOptions = {
                                resourceTitle: 'visits-providers',
                                criteria: {
                                    'facility.code': ADK.UserService.getUserSession().get('site')
                                },
                                onSuccess: function(model, response){
                                    dataForm.orderingProviderList = ParseUtil.getOrderingProviderList(response);

                                    dataForm.callControlFunction({
                                        controlType: 'typeahead',
                                        controlName: 'orderingProvider',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.orderingProviderList
                                        }
                                    });
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(orderingProviderOptions);
                        }

                        if(this.model.get('immunizationOption') === 'administered'){
                            this.model.set('administrationDate', moment().format('MM/DD/YYYY'));
                            var lotNumberOptions = {
                                resourceTitle: 'immunization-crud-lotNumbers',
                                criteria: {
                                    uri: this.model.get('immunizationType')
                                },
                                onSuccess: function(model, response){
                                    dataForm.lotNumberList = ParseUtil.getLotNumberPickList(response);
                                    dataForm.callControlFunction({
                                        controlType: 'select',
                                        controlName: 'lotNumberAdmin',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.lotNumberList
                                        }
                                    });

                                    $('#lotNumberAdmin').attr('required', 'required');
                                    self.model.set('lotNumberAdmin', $('#lotNumberAdmin').val());
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(lotNumberOptions);
                        }else {
                            if(!dataForm.manufacturerList){
                                var manufacturerOptions = {
                                    resourceTitle: 'immunization-crud-manufacturers',
                                    onSuccess: function(model, response){
                                        dataForm.manufacturerList = ParseUtil.getManufacturerList(response);
                                        dataForm.callControlFunction({
                                            controlType: 'typeahead',
                                            controlName: 'manufacturerHistorical',
                                            functionName: 'setPickList',
                                            options: {
                                                pickList: dataForm.manufacturerList
                                            }
                                        });
                                    }
                                };

                                ADK.PatientRecordService.fetchCollection(manufacturerOptions);
                            }

                            if(!dataForm.informationSourceList){
                                var infoSourceOptions = {
                                    resourceTitle: 'immunization-crud-informationSources',
                                    onSuccess: function(model, response){
                                        dataForm.informationSourceList = ParseUtil.getInformationSourceList(response);
                                        dataForm.callControlFunction({
                                            controlType: 'select',
                                            controlName: 'informationSource',
                                            functionName: 'setPickList',
                                            options: {
                                                pickList: dataForm.informationSourceList
                                            }
                                        });
                                    }
                                };

                                ADK.PatientRecordService.fetchCollection(infoSourceOptions);
                            }
                        }

                        this.workflow.goToNext();
                    },
                    'typeahead:selected #immunizationType': function(obj, data, name){
                        this.model.set('maxInSeries', data.maxInSeries);
                        this.model.set('immInfoStatements', data.informationStatements);
                        this.model.set('matchedTerm', true);
                        this.$(this.ui.nextBtn).find('button').attr('disabled', false).removeClass('disabled');
                        this.model.set('immunizationLabel', this.$(this.ui.immunizationType).val());
                    },
                    'typeahead:autocompleted #immunizationType': function(obj, data, name){
                        this.model.set('maxInSeries', data.maxInSeries);
                        this.model.set('immInfoStatements', data.informationStatements);
                        this.model.set('matchedTerm', true);
                        this.$(this.ui.nextBtn).find('button').attr('disabled', false).removeClass('disabled');
                        this.model.set('immunizationLabel', this.$(this.ui.immunizationType).val());
                    },
                    'input #immunizationType': function(e){
                        if(this.model.get('matchedTerm')){
                            this.model.set('matchedTerm', false);
                            this.$(this.ui.nextBtn).find('button').attr('disabled', true).addClass('disabled');
                        }
                    }
                },
                modelEvents: {
                    'change:immunizationOption': function(model) {
                        var immunizationOption = model.get('immunizationOption');
                        var immunizationType = model.get('immunizationType');
                        var immunizationTypeModel;

                        if(immunizationType){
                            immunizationTypeModel = _.findWhere(ImmunizationAddView.pickList, {value: immunizationType});
                        }

                        if (immunizationOption) {
                            this.$(this.ui.immunizationType).attr('disabled', false);

                            if(immunizationTypeModel && immunizationOption === 'administered' && immunizationTypeModel.isInactive){
                                model.unset('immunizationType', {silent: true});
                                this.$(this.ui.immunizationType).val('');
                                this.$(this.ui.nextBtn).find('button').attr('disabled', true).addClass('disabled');
                            }
                        }
                    }
                }
            });

            var formView2 = ADK.UI.Form.extend({
                ui: {
                    "lotNumberHistoric": ".lotNumberHistoric",
                    "lotNumberAdmin": ".lotNumberAdmin",
                    "manufacturerAdmin": ".manufacturerAdmin",
                    "manufacturerHistorical": ".manufacturerHistorical",
                    "expirationDate": ".expirationDate",
                    "administrationDate": ".administrationDate",
                    "administeringProvider": ".administeringProvider",
                    'administeringProviderInput': '#administeringProvider',
                    "orderingProvider": ".orderingProvider",
                    "encounterLocation": ".encounterLocation",
                    'encounterLocationInput': '#encounterLocation',
                    "informationSource": ".informationSource",
                    'routeOfAdministration': '.routeOfAdministration',
                    'anatomicLocation': '.anatomicLocation',
                    'dose': '.dose',
                    'informationStatement': '.informationStatement',
                    'visDateOffered': '.visDateOffered'
                },
                fields: F360Fields2,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-exclamation-triangle',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #back-btn": function(e) {
                        var self = this;
                        if(this.model.get('lotNumberAdmin')){
                            this.model.unset('lotNumberAdmin');
                            this.model.unset('manufacturerAdmin');
                            this.model.unset('manufacturerHistorical');
                            this.model.unset('expirationDate');
                        }

                        this.model.set('series', '');
                        this.model.set('informationStatement', '');

                        this.model.unset("formStatus");
                        this.workflow.goToPrevious();
                    },
                    'keyup #administeringProvider': function(e){
                        if(e.keyCode !== 9 && e.keyCode !== 13 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40 && e.keyCode !== 27){
                            this.model.set('validProviderSelected', false);
                            this.model.set('administeringProviderPredefinedId', '');
                            this.performActionWhileTyping(e, 2, 1000);
                        }
                    },
                    "click #close-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-exclamation-triangle',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
                    },
                    "submit": function(e) {
                        var self = this;
                        e.preventDefault();

                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Immunization Added',
                                icon: 'fa-check',
                                message: this.model.get('immunizationLabel'),
                                type: "success"

                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }

                        var fourDigitTime = function() {
                            var date = new Date();
                            var hours = "";
                            var mins = "";
                            if (date.getHours() < 10) {
                                hours = "0" + date.getHours();
                            } else {
                                hours = date.getHours();
                            }
                            if (date.getMinutes() < 10) {
                                mins = "0" + date.getMinutes();
                            } else {
                                mins = date.getMinutes();
                            }
                            return hours + ":" + mins;
                        };
                        this.model.set("savedTime", fourDigitTime());

                        return false;
                    },
                    'typeahead:selected #administeringProvider': function(){
                        this.model.set('validProviderSelected', true);
                    },
                    'typeahead:autocompleted #administeringProvider': function(){
                        this.model.set('validProviderSelected', true);
                    }
                },
                performActionWhileTyping: function(event, characterThreshold, timeThreshold) {
                    var target = (event.target) ? event.target : event.srcElement;
                    var dataForm = workflowController.getFormView(1);
                    dataForm.termInProgress = $(target).val();

                    if ($(target).val().length <= characterThreshold && typeof timeoutHandle !== 'undefined') {
                            clearTimeout(timeoutHandle);
                    } else if ($(target).val().length > characterThreshold) {
                        if (typeof timeoutHandle === 'undefined') {
                            timeoutHandle = _.delay(this.search, timeThreshold, dataForm);
                        } else {
                            clearTimeout(timeoutHandle);
                            timeoutHandle = _.delay(this.search, timeThreshold, dataForm);
                        }
                    }
                },
                search: function(view){
                    var searchTerm = $('#administeringProvider').val();
                    view.retrieveAdminsteringProviders(searchTerm, view);
                },
                retrieveAdminsteringProviders: function(searchTerm, view){
                    var params = {
                       type: 'GET',
                       url: 'resource/write-pick-list',
                       data: {type:'new-persons', site: '9E7A', searchString: searchTerm},
                       dataType: "json"
                    };

                    var pickListRequest = $.ajax(params);
                    pickListRequest.done(function(response) {
                        if(view.termInProgress === searchTerm){
                            view.administeringProviderList = ParseUtil.getAdministeringProviderList(response);
                            view.callControlFunction({
                                controlType: 'typeahead',
                                controlName: 'administeringProvider',
                                functionName: 'setPickList',
                                options: {
                                    pickList: view.administeringProviderList
                                }
                            });

                            $('#administeringProvider').typeahead('val', searchTerm);
                            $('#administeringProvider').focus();
                            var ev = $.Event("keydown");
                            ev.keyCode = ev.which = 40;
                            $('#administeringProvider').trigger(ev);
                            $('#administeringProvider')[0].setSelectionRange(searchTerm.length, searchTerm.length);
                        }
                    });
                },
                modelEvents: {
                    'change:immunizationOption': function(model) {
                        var immunizationOption = model.get('immunizationOption');

                        if (immunizationOption === 'administered') {
                            this.$(this.ui.administrationDate).trigger('control:required', true);
                            this.$(this.ui.administeringProvider).trigger('control:required', true);
                            this.$(this.ui.encounterLocation).find('input').attr('required', true);
                            this.$(this.ui.routeOfAdministration).trigger('control:required', true);
                            this.$(this.ui.anatomicLocation).trigger('control:required', true);
                            this.$(this.ui.dose).trigger('control:required', true);

                            this.$(this.ui.informationStatement).trigger('control:hidden', false);
                            this.$(this.ui.visDateOffered).trigger('control:hidden', false);
                            this.$(this.ui.informationSource).addClass('hidden');
                            this.$(this.ui.lotNumberHistoric).addClass('hidden');
                            this.$(this.ui.lotNumberAdmin).removeClass('hidden');
                            this.$(this.ui.manufacturerAdmin).removeClass('hidden');
                            this.$(this.ui.manufacturerHistorical).addClass('hidden');
                            this.$(this.ui.expirationDate).find('input').attr('disabled', true);
                            this.$(this.ui.manufacturerAdmin).find('input').attr('disabled', true);
                        } else {
                            this.$(this.ui.administrationDate).trigger('control:required', false);
                            this.$(this.ui.informationSource).removeClass('hidden');
                            this.$(this.ui.expirationDate).find('input').attr('disabled', false);
                            this.$(this.ui.manufacturerAdmin).find('input').attr('disabled', false);
                            this.$(this.ui.routeOfAdministration).trigger('control:required', false);
                            this.$(this.ui.anatomicLocation).trigger('control:required', false);
                            this.$(this.ui.dose).trigger('control:required', false);

                            this.$(this.ui.informationStatement).trigger('control:hidden', true);
                            this.$(this.ui.visDateOffered).trigger('control:hidden', true);
                            this.$(this.ui.lotNumberAdmin).addClass('hidden');
                            this.$(this.ui.lotNumberAdmin).find('select').attr('required', false);
                            this.$(this.ui.lotNumberHistoric).removeClass('hidden');
                            this.$(this.ui.manufacturerAdmin).addClass('hidden');
                            this.$(this.ui.manufacturerHistorical).removeClass('hidden');
                            this.$(this.ui.administeringProvider).trigger('control:required', false);
                            this.$(this.ui.encounterLocation).find('input').attr('required', false);
                        }
                    },
                    'change:lotNumberAdmin': function(model){
                        var lotNumber = model.get('lotNumberAdmin');

                        if(lotNumber){
                            var lotNumberModel = _.findWhere(this.lotNumberList, {value: lotNumber});
                            model.set('expirationDate', lotNumberModel.expirationDate, {silent: true});
                            model.set('manufacturerAdmin', lotNumberModel.manufacturer, {silent: true});
                            this.$(this.ui.expirationDate).find('input').val(lotNumberModel.expirationDate);
                            this.$(this.ui.manufacturerAdmin).find('input').val(lotNumberModel.manufacturer);
                        }else {
                            model.unset('expirationDate', {silent: true});
                            model.unset('manufacturerAdmin', {silent: true});
                            this.$(this.ui.expirationDate).find('input').val('');
                            this.$(this.ui.manufacturerAdmin).find('input').val('');
                        }
                    },
                    'change:encounterLocation': function(model){
                        var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
                        if(model.get('encounterLocation').indexOf('urn:va:location') === -1 && model.previous('encounterLocation').indexOf('urn:va:location') !== -1 && model.get('encounterLocation') === visit.locationDisplayName){
                            model.set('encounterLocation', visit.locationUid, {silent: true});
                        }
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Immunization",
                showProgress: true,
                keyboard: true,
                steps: [{
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Select an Immunization type'
                }, {
                    view: formView2,
                    viewModel: formModel,
                    stepTitle: 'Enter Immunization Info'
                }]
            };

            var workflowController = new ADK.UI.Workflow(workflowOptions);
            workflowController.show();

            var immTypeOptions = {
                resourceTitle: 'immunization-crud-immunizationTypes',
                onSuccess: function(model, response){
                    var searchForm = workflowController.getFormView(0);
                    ImmunizationAddView.pickList = ParseUtil.getImmunizationTypePickList(response);
                    searchForm.callControlFunction({
                        controlType: 'typeahead',
                        controlName: 'immunizationType',
                        functionName: 'setPickList',
                        options: {
                            pickList: ImmunizationAddView.pickList
                        }
                    });

                     if(formModel.get('immunizationOption')){
                        searchForm.$(searchForm.ui.immunizationType).attr('disabled', false);
                    }
                }
            };
            ADK.PatientRecordService.fetchCollection(immTypeOptions);
        },
        handleShowView: function(){
            var visitChannel = ADK.Messaging.getChannel('visit');
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            visitChannel.on('set-visit-success:immunizations_add_edit', ImmunizationAddView.createForm);

            if(currentPatient.get('visit')){
                ImmunizationAddView.createForm();
            }else {
                visitChannel.command('openVisitSelector', 'immunizations_add_edit');
            }
        }
    };
    return ImmunizationAddView;
});