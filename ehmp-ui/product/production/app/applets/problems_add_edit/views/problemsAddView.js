// todo: jsaenz story is blocked due to required adk dependencies. see separate todos below.
//  - start using silent : true on model sets
//  - may want to start using the following syntax to set typeahead/datForm fields.
//      - dataForm.$(dataForm.ui.fieldName).typeahead('val', fieldValue);

define([
    'backbone',
    'marionette',
    'jquery',
    'moment',
    'handlebars',
    'app/applets/problems_add_edit/utils/parseUtils'
], function(Backbone, Marionette, $, Moment, Handlebars, ParseUtil) {

    var ProblemsAddView = {
        createForm: function() {

             var selectProblemContainer = {
                control: "typeahead",
                name: "problemTerm",
                label: "Select a Problem",
                // srOnlyLabel: true;
                placeholder: "Search for available Problems",
                required: true,
                matcher: function(itemList, labelAttribute) {
                    return function findMatches(q, cb) {
                        var matches = [];
                        itemList.each(function(anItem) {
                            matches.push(anItem.toJSON());
                        });
                        var sortedMatches = _.sortBy(matches, 'label');
                        cb(sortedMatches);
                   };
                }
            };

            var headerContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-8"],
                    items: [{
                        control: "container",
                        template: Handlebars.compile('<h4>{{problemLabel}}</h4>'),
                        modelListeners: ['problemLabel']
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-4"],
                    items: [{
                        control: "button",
                        extraClasses: ["icon-btn", "icon-btn-mini"],
                        type: "button",
                        id: "change-problem-btn",
                        label: "Change problem..."
                    }]
                }, {
                    control: "spacer"
                }]
            };

            var requiredText = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    tagName: "p",
                    template: "* indicates as a required field."
                }]
            };

            var statusContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "radio",
                    required: true,
                    name: "statusRadioValue",
                    label: "Status",
                    options: [{
                        label: "Active",
                        value: "active"
                    }, {
                        label: "Inactive",
                        value: "inactive"
                    }]
                }]
            };

            var immediacyContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "radio",
                    required: true,
                    name: "immediacyRadioValue",
                    label: "Immediacy",
                    options: [{
                        label: "Acute",
                        value: "acute"
                    }, {
                        label: "Chronic",
                        value: "chronic"
                    }, {
                        label: "Unknown",
                        value: "unknown"
                    }]
                }]
            };

            var onsetDateContainer = {
                control: "container",
                extraClasses: ["col-md-6"],
                items: [{
                    control: "datepicker",
                    name: "onset-date",
                    label: "Onset Date",
                    options: {
                        startDate: new Moment(ADK.PatientRecordService.getCurrentPatient().get('birthDate'), 'YYYYMMDD').format('MM/DD/YYYY'),
                        endDate: '0d' //new Moment().format('MM/DD/YYYY')
                    }
                }]
            };

            var getClinicLabel = function() {
                var patient = ADK.PatientRecordService.getCurrentPatient();
                return patient.get('inPatient') ? 'Service' : 'Clinic';
             };

            var clinicContainer = {
                control: "container",
                extraClasses: ["col-md-6"],
                items: [{
                    control: "typeahead",
                    name: "clinic",
                    label: getClinicLabel(),
                    matcher: function(itemList, labelAttribute) {
                        return function findMatches(q, cb) {
                            // Current workaround to not return results unless at least 3 characters are typed in
                            var matches = [];

                            if(q.length >= 3){
                                var substrRegex = new RegExp(q, 'i');

                                itemList.each(function(anItem) {
                                    if(substrRegex.test(anItem.get('label'))){
                                        matches.push(anItem.toJSON());
                                    }
                                });
                            }

                            var sortedMatches = _.sortBy(matches, 'label');
                            cb(sortedMatches);
                        };
                    }
                }]
            };

            var resProviderContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "typeahead",
                    name: "resProvider",
                    label: "Resp Provider *",
                    matcher: function(itemList, labelAttribute) {
                        return function findMatches(q, cb) {
                            // Current workaround to not return results unless at least 3 characters are typed in
                            var matches = [];

                            if(q.length >= 3){
                                var substrRegex = new RegExp(q, 'i');

                                itemList.each(function(anItem) {
                                    if(substrRegex.test(anItem.get('label'))){
                                        matches.push(anItem.toJSON());
                                    }
                                });
                            }

                            var sortedMatches = _.sortBy(matches, 'label');
                            cb(sortedMatches);
                        };
                    }
                }]
            };

            // todo: maybe move this to utils
            // treatment factors
            var getTreatmentFactors = function() {
                var patient = ADK.PatientRecordService.getCurrentPatient(),
                    exposures = patient.get('exposure'),
                    factors = {
                        'ionizing-radiation' : {
                            label : 'Radiation'
                        },
                        'agent-orange' : {
                            label : 'Agent Orange'
                        },
                        'sw-asia' : {
                            label : 'Southwest Asia Conditions'
                        },
                        'head-neck-cancer' : {
                            label : 'Head and/or Neck Cancer'
                        },
                        'mst' : {
                            label : 'MST'
                        },
                        'combat-vet' : {
                            label : 'Service Connected'
                        },
                        'shipboard' : {
                            label : 'Shipboard Hazard and Defense'
                        }
                    },
                    pickList = [];

                if(exposures){
                    for(var i=0; i < exposures.length; i++){
                        var relevant = exposures[i].name,
                            name = exposures[i].uid.match(/^urn:va:(.*):/)[1];

                        if (relevant.toUpperCase() !== "NO") {
                            pickList.push({
                                name : name,
                                label : factors[name].label,
                                value : false
                            });
                        }
                    }
                }

                //return new Backbone.Collection(pickList);
                return pickList;
            };

            // todo: not working need mercury fix.
            var treatmentFactorsContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    tagName: "h6",
                    template: "Treatment Factors"
                }, {
                    control: "container",
                    extraClasses: ["well"],
                    items: [{
                        control: "container",
                        // extraClasses: ["control", "form-group"],
                        items: [{
                            name: "testYN",
                            // label: "Available providers",
                            control: "yesNoChecklist",
                            collection: getTreatmentFactors(),
                            //options: getTreatmentFactors(),
                            attributeMapping: {
                                unique: 'name',
                                value: 'value',
                                label: 'label'
                            }
                        }]
                    }]
                }]
            };

            var annotationsContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    tagName: "h6",
                    template: "Annotate"
                }, {
                    control: "nestedCommentBox",
                    name: "diagnosis",
                    label: "Selected Diagnosis",
                    commentHeaderTitle: "Comments",
                    itemHeaderTitle: "Diagnosis",
                    additionalColumns: [{
                        title: "Add to CL",
                        name: "addToCL",
                        control: 'checkbox'
                    }, {
                        title: "Primary",
                        name: "primary",
                        control: 'button',
                        extraClasses: ["btn-link"],
                        type: "button",
                        label: "Primary"
                    }],
                    collection: new Backbone.Collection([{
                        id: "diagnosisGroup1",
                        label: "Diagnosis Group 1",
                        listItems: new Backbone.Collection([{
                            id: "group1-diagnosis1",
                            label: "group1 Diagnosis 1",
                            selectedValue: true,
                            addToCL: true,
                            comments: new Backbone.Collection([]),
                            primary: true
                        }, {
                            id: "group1-diagnosis2",
                            label: "group1 Diagnosis 2",
                            selectedValue: true,
                            addToCL: false,
                            comments: new Backbone.Collection([{
                                commentString: "This might be a non-causative symptom",
                                author: {
                                    name: "USER,PANORAMA",
                                    duz: {
                                        "9E7A": "10000000255"
                                    }
                                },
                                timeStamp: "12/12/2014 11:12PM"
                            }]),
                            primary: false
                        }])
                    }]),
                    attributeMapping: {
                        collection: "listItems",
                        commentsCollection: "comments",
                        comment: "commentString",
                        value: "selectedValue",
                        label: "label",
                        unique: "id",
                        author: "author",
                        timeStamp: "timeStamp"
                    }
                }]
            };

            var lowerBodyContainer = {
                    control: "container",
                    extraClasses: ["row"],
                    items: [requiredText, statusContainer, immediacyContainer, onsetDateContainer, clinicContainer, resProviderContainer, /*treatmentFactorsContainer,*/ annotationsContainer]
                };

            var F414_SelectProblemFields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [selectProblemContainer]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-3"]
                    }, {
                        control: "container",
                        extraClasses: ["col-md-9"],
                        items: [{
                            control: "button",
                            id: 'delete-btn',
                            extraClasses: ["icon-btn"],
                            type: "button",
                            icon: "fa-trash-o fa-lg",
                            label: ""
                        }, {
                            control: "button",
                            id: "nextBtn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Next",
                            name: "nextBtn",
                            disabled: true
                        }]
                    }]
                }]
            }];

            var F414_EnterProblemFields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [headerContainer, lowerBodyContainer]
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
                        items: [{
                            control: "container",
                            tagName: "p",
                            template: '<span id="id="problems-administered-saved-at">Saved {{savedDay}} at {{savedTime}}<span>'
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["col-md-9"],
                        items: [{
                            control: "button",
                            id: 'delete-btn',
                            extraClasses: ["icon-btn"],
                            type: "button",
                            icon: "fa-trash-o fa-lg",
                            label: ""
                        }, {
                            control: "button",
                            id: "close-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            type: 'button',
                            name: "close-btn"
                        }, {
                            control: "button",
                            id: "back-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Back",
                            type: 'button',
                            name: "back"
                        }, {
                            control: "button",
                            id: "add-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Add",
                            name: "add"
                        }]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    statusRadioValue :  'active',
                    immediacyRadioValue : 'unknown',
                    savedTime: "00:00",
                    problemLabel: ''
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

            var selectProblemView = ADK.UI.Form.extend({
                ui: {
                    "problemTerm": "#problemTerm",
                    "nextBtn": ".nextBtn"
                },
                fields: F414_SelectProblemFields,
                events: {
                    'click #delete-btn': function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-exclamation-triangle',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        var alertView = new ADK.UI.Alert(deleteAlertView);
                        alertView.show();
                    },
                    "submit": function(e) {
                        e.preventDefault();
                        var self = this;
                        this.model.unset("formStatus");

                        var dataForm = workflowController.getFormView(1),
                            user = ADK.UserService.getUserSession(),
                            siteCode = user.get('site'),
                            patient = ADK.PatientRecordService.getCurrentPatient(),
                            visit = patient.get('visit');

                        if(!dataForm.clinic){
                           if(visit.locationName) {
                                // todo: for writeback set clinic localid field - see immz addedit
                                // var localId = visit.locationUid.split(':').pop();
                                dataForm.clinic = visit.locationName;
                                self.model.set('clinic', dataForm.clinic);
                            }

                            var clinicOptions = {
                                resourceTitle: 'locations-clinics',
                                criteria: {
                                    "site.code": siteCode
                                },
                                onSuccess: function(model, response){
                                    dataForm.clinic = ParseUtil.getClinic(response);
                                    dataForm.callControlFunction({
                                        controlType: 'typeahead',
                                        controlName: 'clinic',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.clinic
                                        }
                                    });
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(clinicOptions);
                        }

                        if(!dataForm.resProvider){
                            if(visit.selectedProvider) {
                                // todo: see immz add/edit for setting provider field.
                                dataForm.resProvider = visit.selectedProvider.name;
                                self.model.set('resProvider', dataForm.resProvider, {silent: true});
                            }

                            var resProviderOptions = {
                                resourceTitle: 'visits-providers',
                                criteria: {
                                    'facility.code': siteCode                                },
                                onSuccess: function(model, response){
                                    dataForm.resProvider = ParseUtil.getResProvider(response);
                                    dataForm.callControlFunction({
                                        controlType: 'typeahead',
                                        controlName: 'resProvider',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.resProvider
                                        }
                                    });
                                }
                            };

                            ADK.PatientRecordService.fetchCollection(resProviderOptions);
                        }

                        this.workflow.goToNext();

                    },
                    'typeahead:selected #problemTerm': function(){
                        this.model.set('matchedTerm', true);
                        this.$(this.ui.nextBtn).find('button').attr('disabled', false).removeClass('disabled');
                        this.model.set('problemLabel', this.$(this.ui.problemTerm).val());
                    },
                    'input #problemTerm': function(e){
                        if(this.model.get('matchedTerm')){
                            this.model.set('matchedTerm', false);
                            this.$(this.ui.nextBtn).find('button').attr('disabled', true).addClass('disabled');
                        }

                        if(e.currentTarget.value.length >= 3){
                            var siteCode = ADK.UserService.getUserSession().get('site');

                            var response = $.ajax({
                                method: 'GET',
                                url: '/resource/write-pick-list',
                                data : {
                                    'type' : 'problems-lex',
                                    'view' : 'PLS',
                                    'site' : siteCode,
                                    'searchString' :  e.currentTarget.value
                                },
                                success: function(data, statusMessage, xhr) {
                                    var dataForm = workflowController.getFormView(0);
                                    dataForm.pickList = ParseUtil.getProblemTermPickList(data);
                                    dataForm.callControlFunction({
                                        controlType: 'typeahead',
                                        controlName: 'problemTerm',
                                        functionName: 'setPickList',
                                        options: {
                                            pickList: dataForm.pickList
                                        }
                                    });

                                    $('#problemTerm').typeahead('val', e.currentTarget.value);
                                    var ev = $.Event('keydown');
                                    ev.keyCode = ev.which = 40;
                                    $('#problemTerm').trigger(ev).focus();
                                    return true;
                                },
                                error: function(xhr, statusMessage, error) {
                                    console.info('Refresh Session Error');
                                },
                                async: true
                            });
                        }
                    }
                }
            });

            var enterProblemInfoView = ADK.UI.Form.extend({
                ui: {
                    'clinic': '.clinic',
                    'resProvider' : '.resProvider'
                },
                fields: F414_EnterProblemFields,
                events: {
                    'submit': function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Alert({
                                title: 'Problem Submitted',
                                notificationAlert: true,
                                icon: 'fa-check',
                                message: 'Problem successfully submitted with no errors.',
                                type: "sucess"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
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
                    "click #back-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                        return false;
                    },
                    "click #change-problem-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                        return false;
                    }
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Problem",
                showProgress: true,
                keyboard: true,
                steps: [{
                    view: selectProblemView,
                    viewModel: formModel,
                    stepTitle: 'Select a Problem'
                }, {
                    view: enterProblemInfoView,
                    viewModel: formModel,
                    stepTitle: 'Enter Problem Info'
                }]
            };

            var workflowController = new ADK.UI.Workflow(workflowOptions);
            workflowController.show();
        },
        handleShowView: function(){
            var visitChannel = ADK.Messaging.getChannel('visit');
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            visitChannel.on('set-visit-success:problems_add_edit', ProblemsAddView.createForm);

            if(currentPatient.get('visit')){
                ProblemsAddView.createForm();
            }else {
                visitChannel.command('openVisitSelector', 'problems_add_edit');
            }
        }
    };
    return ProblemsAddView;
});