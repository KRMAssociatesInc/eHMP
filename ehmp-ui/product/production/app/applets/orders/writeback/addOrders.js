define([
    'main/ADK',
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!app/applets/orders/writeback/summaryTemplate',
    'app/applets/orders/writeback/writebackUtils',
    'main/components/sign/models/signModels',
    ], function(ADK, Backbone, Marionette, $, Handlebars, SummaryTemplate, Utils, signModels) {

        var alertMessageContainer = {
            control: "container",
            extraClasses: ["row", "row-subheader"],
            items: [{
                control: "alertBanner",
                name: "alertMessage",
                extraClasses: ["alert-info"],
                dismissible: true
            }]
        };

        var availableLabTestsContainer = {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["form-highlight"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "typeahead",
                        name: "availableLabTests",
                        label: "Available Lab Tests",
                        attributeMapping: {
                            label: 'name',
                            value: 'ien'
                        },
                        required: true,
                        pickList: []
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-6"],
                    items: [{
                        control: "select",
                        name: "urgency",
                        label: "Urgency",
                        required: true,
                        attributeMapping: {
                            label: 'name',
                            value: 'ien'
                        },
                        options: []
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-6"],
                    items: [{
                        control: "select",
                        name: "collectionDateTimePicklist",
                        label: "Collection Date/Time",
                        attributeMapping: {
                            label: 'name',
                            value: 'code'
                        },
                        options: []
                    },{
                        control: "datepicker",
                        name: "collectionDate",
                        label: "Collection Date/Time"
                    },{
                        control: "timepicker",
                        name: "collectionTime",
                        label: "Collection Time",
                        srOnlyLabel: true
                    }]
                }]
            }]
        };

        var restOfBodyContainer = {
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "select",
                    name: "howOften",
                    label: "How Often?",
                    required: true,
                    attributeMapping: {
                        label: 'name',
                        value: 'code'
                    },
                    options: []
                }]
            }, {
                control: "container",
                extraClasses: ["col-xs-6"],
                items: [{
                    control: "input",
                    name: "howLong",
                    label: "How Long?",
                    title: 'Enter a number of days, or an "X" followed by a number of times.',
                    disabled: true
                }]
            }, {
                control: "container",
            extraClasses: ["col-xs-6"] //EXTRA COL FOR FORMATTING
        }, {
            control: "container",
            extraClasses: ["col-xs-6"],
            items: [{
                control: "select",
                name: "collectionSample",
                label: "Collection Sample",
                required: true,
                attributeMapping: {
                    label: 'name',
                    value: 'ien'
                },
                options: []
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "hidden", "otherCollectionSampleContainer"] //EXTRA COL FOR FORMATTING
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "hidden", "otherCollectionSampleContainer"],
            items: [{
                control: "typeahead",
                name: "otherCollectionSample",
                label: "Select Other Collection Sample",
                attributeMapping: {
                    label: 'name',
                    value: 'ien'
                },
                options: []
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"],
            items: [{
                control: "select",
                name: "collectionType",
                label: "Collection Type",
                required: true,
                attributeMapping: {
                    label: 'name',
                    value: 'code'
                },
                options: []
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"],
            items: [{
                control: "select",
                name: "specimen",
                label: "Specimen",
                required: true,
                attributeMapping: {
                    label: 'name',
                    value: 'ien'
                },
                options: []
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"] //EXTRA COL FOR FORMATTING
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "hidden", "otherSpecimenContainer"],
            items: [{
                control: "typeahead",
                name: "otherSpecimen",
                label: "Select Other Specimen",
                attributeMapping: {
                    label: 'name',
                    value: 'ien'
                },
                options: []
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"],
            items: [{
                control: "input",
                name: "anticoagulant",
                label: "What Kind of anticoagulant is the patient on?"
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"],
            items: [{
                control: "input",
                name: "orderComment",
                label: "Enter order comment:"
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "sampleDrawnAtContainer"],
            items: [{
                control: "fieldset",
                legend: "Sample drawn at:",
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-6"],
                    items: [{
                        control: "radio",
                        name: "sampleDrawnAt",
                        options: [{
                            label: "Peak",
                            value: "~Dose is expected to be at &PEAK level.",
                        }]
                    }, {
                        control: "radio",
                        name: "sampleDrawnAt",
                        options: [{
                            label: "Trough",
                            value: "~Dose is expected to be at &TROUGH level."
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-6"],
                    items: [{
                        control: "radio",
                        name: "sampleDrawnAt",
                        options: [{
                            label: "Mid",
                            value: "~Dose is expected to be at &MID level."
                        }]
                    }, {
                        control: "radio",
                        name: "sampleDrawnAt",
                        options: [{
                            label: "Unknown",
                            value: "~Dose is expected to be at &UNKNOWN level."
                        }]
                    }]
                }]
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6"] //EXTRA COL FOR FORMATTING
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "doseContainer"],
            items: [{
                control: "datepicker",
                name: "doseDate",
                label: "Enter the last dose date/time:"
            }, {
                control: "timepicker",
                name: "doseTime",
                srOnlyLabel: true
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "drawContainer"],
            items: [{
                control: "datepicker",
                name: "drawDate",
                label: "Enter draw date/time:"
            }, {
                control: "timepicker",
                name: "drawTime",
                srOnlyLabel: true
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-12", "additionalCommentsContainer"],
            items: [{
                control: "textarea",
                name: "additionalComments",
                label: "Additional Comments",
                rows: 3
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-12", "immediateCollectionContainer"],
            items: [{
                control: "fieldset",
                legend: "Immediate Collection Times",
                items: [{
                    control: "container",
                    extraClasses: ["well"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('{{#each immediateCollection}}{{this}}<br />{{/each}}<br />'),
                            modelListeners: ["immediateCollection"]
                        }]
                    },{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "datepicker",
                                label: "Date Taken",
                                name: "immediateCollectionDate"
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "timepicker",
                                label: "Time Taken",
                                name: "immediateCollectionTime"
                            }]
                        }]
                    }]
                }]
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-12", "futureLabCollectTimesContainer"],
            items: [{
                control: "fieldset",
                legend: "Future Lab Collect Times",
                items: [{
                    control: "container",
                    extraClasses: ["well"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "datepicker",
                                label: "Select a date and a routine lab collect time for that date.",
                                name: "futureLabCollectDate"
                            }]
                        }]
                    },{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "select",
                            extraClasses: ["col-xs-6"],
                            name: "futureLabCollectTime",
                            label: "Collect Time",
                            pickList: []
                        }]
                    },{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('{{futureLabCollectErrorMessage}}'),
                            modelListeners: ["futureLabCollectErrorMessage"]
                        },{
                            control: "container",
                            extraClasses: ["col-xs-12", "text-left", "futureLabCollectInProgress"],
                            template: Handlebars.compile('<p><i class="fa fa-spinner fa-spin"></i> Loading...</p>'),
                        }]
                    }]
                }]
            }]
        }]
    };

    var orderPreviewContainer = {
        control: "container",
        template: SummaryTemplate,
        modelListeners: ["availableLabTests", "urgencyText",
        "collectionSampleText", "collectionType", "specimenText", "howOftenText",
        "sampleDrawnAt", "additionalComments", "anticoagulant", "orderComment", "doseDate", "doseTime",
        "drawDate", "drawTime"
        ],
        extraClasses: ["order-preview"]
    };

    var ordersFields = [
        // **************************************** Modal Body Start ******************************************
        {
            control: "container",
            extraClasses: ["modal-body"],
            items: [{
                control: "container",
                extraClasses: ["scroll-enter-form"],
                items: [alertMessageContainer, availableLabTestsContainer, restOfBodyContainer, orderPreviewContainer]
            }]
        }, { // **************************************** Modal Footer Start ******************************************
            control: "container",
            extraClasses: ["modal-footer"],
            items: [{
                control: "container",
                extraClasses: ["row", "col-xs-12"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-4", "text-left"],
                    template: Handlebars.compile('<p><span id="observation-saved-at3">{{savedTime}}</span></p>'),
                    modelListeners: ["savedTime"]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-4"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-12", "text-left", "inProgressContainer", "hidden"],
                        template: Handlebars.compile('<h5><i class="fa fa-spinner fa-spin"></i> {{inProgressMessage}}</h5>'),
                        modelListeners: ["inProgressMessage"]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1"],
                    items: [{
                        control: "button",
                        id: 'form-delete-btn',
                        extraClasses: ["icon-btn", "btn-sm"],
                        title: "Remove",
                        type: "button",
                        name: "trash",
                        icon: "fa-trash-o",
                        label: ""
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1", "cancelBtnContainer"],
                    items: [{
                        control: "button",
                        id: "form-close-btn",
                        extraClasses: ["btn-primary", "btn-sm"],
                        title: "Close",
                        label: "Close",
                        type: 'button',
                        icon: "fa-times",
                        name: "cancel"
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-2", "acceptDrpDwnContainer"],
                    items: [{
                        control: "dropdown",
                        split: true,
                        id: "acceptDrpDwnContainer",
                        name: "acceptDrpDwnContainer",
                        extraClasses: ["dropup"],
                        disabled: true,
                        label: "Accept",
                        type: "submit",
                        items: [{label: 'Accept', id: 'accept', extraClasses: []}, {label: 'Accept & Add Another', id: 'accept-add', extraClasses: []}, {label: 'Accept & Sign', id: 'accept-sign', extraClasses: []}]
                    }]
                }]
            }]
        }
        ];

        var cancelButton = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('{{ui-button "Cancel" title="Click button to cancel your action!"}}'),
            events: {
                'click': function() {
                    ADK.UI.Alert.hide();
                }
            },
            tagName: 'span'
        });

        var continueButton = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('{{ui-button "Continue" classes="btn-success" title="Click button to continue your action!"}}'),
            events: {
                'click': function() {
                    ADK.UI.Alert.hide();
                    ADK.UI.Workflow.hide();
                }
            },
            tagName: 'span'
        });

        var FormModel = Backbone.Model.extend({
            defaults: {
                additionalComments: '',
                alertMessage: '',
                anticoagulant: '',
                availableLabTests: '',
                acceptDrpDwnContainer: '',
                collectionDateTime: '',
                collectionSample: '',
                collectionType: '',
                doneDate: '',
                drawTime: '',
                howLong: '',
                howOften: '',
                sampleDrawnAt: '',
                savedTime: '00:00',
                specimen: '',
                theoSection: '',
                urgency: ''
            }
        });
        var DeleteMessageView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('You will lose all work in progress if you delete this lab order. Would you like to proceed?'),
            tagName: 'p'
        });
        var CloseMessageView = Backbone.Marionette.ItemView.extend({
            template: Handlebars.compile('You will lose all work in progress if you close this lab order. Would you like to proceed?'),
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
            model: FormModel,
            ui: {
                "inProgressContainer": ".inProgressContainer",

                "availableLabTests": ".availableLabTests",
                "urgency": ".urgency",
                "howOften": ".howOften",
                "howLong": ".howLong",
                "collectionType": ".collectionType",
                "collectionDateTimePicklist": ".collectionDateTimePicklist",
                "collectionDate": ".collectionDate",
                "collectionTime": ".collectionTime",
                "specimen": ".specimen",
                "otherSpecimen": ".otherSpecimen",
                "otherSpecimenContainer": ".otherSpecimenContainer",
                "collectionSample": ".collectionSample",
                "otherCollectionSample": ".otherCollectionSample",
                "otherCollectionSampleContainer": ".otherCollectionSampleContainer",
                "anticoagulant": ".anticoagulant",
                "sampleDrawnAt": ".sampleDrawnAt",
                "sampleDrawnAtContainer": ".sampleDrawnAtContainer",
                "additionalComments": ".additionalComments",
                "additionalCommentsContainer": ".additionalCommentsContainer",
                "orderComment": ".orderComment",
                "doseContainer": ".doseContainer",
                "drawContainer": ".drawContainer",
                "doseDate": ".doseDate",
                "doseTime": ".doseTime",
                "drawDate": ".drawDate",
                "drawTime": ".drawTime",
                "immediateCollectionContainer": ".immediateCollectionContainer",
                "immediateCollection": ".immediateCollection",
                "immediateCollectionDate": ".immediateCollectionDate",
                "immediateCollectionTime": ".immediateCollectionTime",
                "futureLabCollectTimesContainer": ".futureLabCollectTimesContainer",
                "futureLabCollectDate": ".futureLabCollectDate",
                "futureLabCollectTime": ".futureLabCollectTime",
                "futureLabCollectInProgress": ".futureLabCollectInProgress",
                "acceptDrpDwnContainer": ".acceptDrpDwnContainer",
                "cancelBtnContainer": ".cancelBtnContainer"
            },
            fields: ordersFields,
            onRender: function() {
                this.hideAll();
                Utils.disableAllFields(this, true);
                this.$(this.ui.acceptDrpDwnContainer).find('button').attr('disabled', true).addClass('disabled');
                this.$(this.ui.collectionDateTimePicklist).trigger('control:hidden', true);
                this.model.set('acceptDrpDwnContainer', 'Accept');
                Utils.retrieveAllCollectionSamples(this);
                Utils.retrieveAllSpecimens(this);
                Utils.processMaxDays(this);
                if (this.model.orderModel) {
                    //hard code semicolon and 1 for now
                    var orderId = this.model.orderModel.get('orderNumber') + ";1";
                    this.model.set('orderId', orderId);
                }
                Utils.retrieveOrderableItems(this);
                Utils.retrieveCollectionTypesUrgencyAndSchedules(this);
                Utils.retrieveImmediateCollection(this);
                if(this.model.get('orderId')) {
                    this.showInProgress('Loading...');
                    Utils.retrieveExisting(this);
                }
                else {
                    Utils.setInitialCollectionDateTimeValues(this);
                }
            //hard coded for now
            this.model.set('location', '158');
        },
        events: {
            "click #form-delete-btn": function(e) {
                e.preventDefault();
                var deleteAlertView = new ADK.UI.Alert({
                    title: 'Are you sure you want to delete?',
                    icon: 'fa-exclamation-triangle',
                    messageView: DeleteMessageView,
                    footerView: FooterView
                });
                deleteAlertView.show();
            },
            "click #acceptDrpDwnContainer-accept": function(e) {
                $('#acceptDrpDwnContainer').text("Accept");
            },
            "click #acceptDrpDwnContainer-accept-sign": function(e) {
                $('#acceptDrpDwnContainer').text("Accept & Sign");
            },
            "click #acceptDrpDwnContainer-accept-add": function(e) {
                $('#acceptDrpDwnContainer').text("Accept & Add Another");
            },
            "click #form-close-btn": function(e) {
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
                e.preventDefault();
                var form = this;
                var componentList = form.model.get('componentList');
                form.model.set('componentList', {});

                var saveCallback = {
                    error: function(model, resp) {
                        model.set('componentList', componentList);
                        console.log('Failed to accept lab order: ' + JSON.stringify(resp));
                        model.set("formStatus", {
                            status: "error",
                            message: "Failed to accept lab order: " + resp.responseText
                        });
                        Utils.disableAllFields(form, false);
                        form.hideInProgress();
                        form.$(form.ui.cancelBtnContainer).find('button').attr('disabled', false).removeClass('disabled');
                    },
                    success: function(model, resp) {
                        model.set('componentList', componentList);
                        console.log('Successfully accepted lab order: ' + JSON.stringify(resp));
                        console.log(JSON.parse(resp.data.data));
                        Utils.disableAllFields(form, false);
                        form.hideInProgress();
                        form.$(form.ui.cancelBtnContainer).find('button').attr('disabled', false).removeClass('disabled');
                        var SignListModel = Backbone.Model.extend({});
                        var ordersModel = new SignListModel({});
                        var labOrders = [JSON.parse(resp.data.data)];

                        ordersModel.set('items', labOrders);
                        //ADK.Messaging.getChannel('orders').request('refreshGridView');
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
                        model.set("savedTime", "Accepted at " + fourDigitTime());
                        //
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Lab Order Accepted',
                            icon: 'fa-exclamation-triangle',
                            messageView: Backbone.Marionette.ItemView.extend({
                                template: Handlebars.compile('Lab order successfully accepted with no errors.'),
                                tagName: 'p'
                            }),
                            footerView: Backbone.Marionette.ItemView.extend({
                                template: Handlebars.compile('{{ui-button "Continue" classes="btn-primary" title="Click button to continue."}}'),
                                events: {
                                    'click .btn-primary': function(e) {
                                        e.preventDefault();
                                        Utils.resetForm(form);
                                        model.unset('availableLabTests');
                                        ADK.UI.Alert.hide();
                                        ADK.UI.Workflow.hide();
                                    }
                                },
                                tagName: 'span'
                            })
                        });
                        var closeAndAddAlertView = new ADK.UI.Alert({
                            title: 'Lab Order Accepted',
                            icon: 'fa-exclamation-triangle',
                            messageView: Backbone.Marionette.ItemView.extend({
                                template: Handlebars.compile('Lab order successfully accepted with no errors.'),
                                tagName: 'p'
                            }),
                            footerView: Backbone.Marionette.ItemView.extend({
                                template: Handlebars.compile('{{ui-button "Continue" classes="btn-primary" title="Click button to continue."}}'),
                                events: {
                                    'click .btn-primary': function(e) {
                                        e.preventDefault();
                                        Utils.resetForm(form);
                                        model.unset('availableLabTests');
                                        ADK.UI.Alert.hide();
                                        Utils.resetForm();
                                    }
                                },
                                tagName: 'span'
                            })
                        });
                        //
                        if($('#acceptDrpDwnContainer').text() === ("Accept")){
                           closeAlertView.show();
                       }else if ($('#acceptDrpDwnContainer').text() === ("Accept & Sign")){
                        ADK.UI.Workflow.hide();
                        ADK.SignApi.sign(ordersModel, function(output) {
                            console.log(labOrders);
                        });
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    } else {
                     closeAndAddAlertView.show();
                    }
                    $('div[data-appletid="orders"] .applet-refresh-button').trigger('click');
                   }
               };

               var existingVisit = ADK.PatientRecordService.getCurrentPatient().get('visit');
               if (!this.model.isValid())
                this.model.set("formStatus", {
                    status: "error",
                    message: self.model.validationError
                });
            else {
                Utils.disableAllFields(this, true);
                this.showInProgress('Saving...');
                this.$(this.ui.inProgressContainer).removeClass('hidden');
                this.$(this.ui.acceptDrpDwnContainer).find('button').attr('disabled', true).addClass('disabled');
                this.$(this.ui.cancelBtnContainer).find('button').attr('disabled', true).addClass('disabled');

                var patient = ADK.PatientRecordService.getCurrentPatient();
                var localId = patient.get('localId');
                var uid = patient.get('uid');

                var session = ADK.UserService.getUserSession();
                var siteCode = session.get('site');
                var provider = session.get('duz')[siteCode];

                this.model.set('pid', patient.get("pid"));
                this.model.set('dfn', localId);
                this.model.set('provider', provider);
                    //this.model.set('provider', existingVisit.selectedProvider.localId);
                    this.model.set('orderDialog', 'LR OTHER LAB TESTS');
                    this.model.set('quickOrderDialog', '2');
                    this.model.set('displayGroup', '6');
                    this.model.set('inputList', Utils.generateInputList(this.model));
                    this.model.set('commentList', Utils.generateCommentList(form));
                    this.model.set('localId', localId);
                    this.model.set('uid', uid);
                    this.model.set('kind','Laboratory');
                    Utils.save(this.model, saveCallback);
                    this.model.unset("formStatus");
                }
                return false;
            }
        },
        hideAll: function() {
            this.$(this.ui.anticoagulant).trigger('control:hidden', true);
            this.$(this.ui.sampleDrawnAtContainer).trigger('control:hidden', true);
            this.$(this.ui.additionalCommentsContainer).trigger('control:hidden', true);
            this.$(this.ui.orderComment).trigger('control:hidden', true);
            this.$(this.ui.doseContainer).trigger('control:hidden', true);
            this.$(this.ui.drawContainer).trigger('control:hidden', true);
            this.$(this.ui.immediateCollectionContainer).trigger('control:hidden', true);
            this.$(this.ui.futureLabCollectTimesContainer).trigger('control:hidden', true);
            //this.$(this.ui.collectionDateTimePicklist).trigger('control:hidden', true);
            //this.$(this.ui.collectionTime).trigger('control:hidden', true);
            //this.$(this.ui.collectionDate).trigger('control:hidden', true);
            this.$(this.ui.otherSpecimenContainer).addClass('hidden');
            this.$(this.ui.otherCollectionSampleContainer).addClass('hidden');
            //this.$(this.ui.immediateCollectionContainer).addClass('hidden');
        },
        showInProgress: function(message) {
            this.model.set('inProgressMessage', message);
            this.$(this.ui.inProgressContainer).removeClass('hidden');
        },
        hideInProgress: function() {
            this.$(this.ui.inProgressContainer).addClass('hidden');
            this.model.unset('inProgressMessage');
        },
        modelEvents: {
            'change:sampleDrawnAt' : function(model) {
                Utils.handleSampleDrawnAt(this);
            },
            'change:anticoagulant' : function(model) {
                Utils.handleAnticoagulant(this);
            },
            'change:orderComment': function(model) {
                Utils.handleOrderComment(this);
            },
            'change:doseDate': function(model) {
                Utils.handleDoseDrawTimes(this);
            },
            'change:doseTime': function(model) {
                Utils.handleDoseDrawTimes(this);
            },
            'change:drawDate': function(model) {
                Utils.handleDoseDrawTimes(this);
            },
            'change:drawTime': function(model) {
                Utils.handleDoseDrawTimes(this);
            },
            'change:futureLabCollectDate': function(model) {
                Utils.handleFutureLabCollectDate(this);
            },
            'change:urgency': function(model) {
                Utils.handleUrgency(this);
            },
            'change:specimen': function(model) {
                Utils.handleSpecimen(this);
            },
            'change:otherSpecimen': function(model) {
                Utils.handleSpecimen(this);
            },
            'change:howOften': function(model) {
                Utils.handleHowOften(this);
            },
            'change:collectionType': function(model) {
                Utils.handleCollectionType(this);
            },
            'change:collectionDate': function(model) {
                Utils.handleCollectionDateTime(this);
            },
            'change:collectionTime': function(model) {
                Utils.handleCollectionDateTime(this);
            },
            'change:collectionDateTimePicklist': function(model) {
                Utils.handleCollectionDateTimePicklist(this);
            },
            'change:collectionSample': function(model) {
                Utils.handleCollectionSample(this);
            },
            'change:otherCollectionSample': function(model) {
                Utils.updateCollectionSampleText(this);
            },
            'change:availableLabTests': function(model) {
                var ien = model.get('availableLabTests');
                if (ien !== '' && ien !== $('#availableLabTests').val()) {
                    this.showInProgress('Loading...');
                    Utils.resetForm(this);
                    Utils.retrieveOrderableItemLoad(this, ien);
                }
            }
        }
    });
return formView;

});