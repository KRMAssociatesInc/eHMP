define([
    "underscore",
    "jquery.inputmask",
    "hbs!app/applets/visit/modal",
    "hbs!app/applets/visit/visitItem",
    "hbs!app/applets/visit/newVisit",
    "hbs!app/applets/visit/selectedVisit",
    "app/applets/visit/typeaheadView",
    "hbs!app/applets/visit/footer",
    "app/applets/visit/util"
], function(_, InputMask, modalTemplate, visitItemTemplate, newVisitTemplate, selectedVisitTemplate, Typeahead, footerTemplate, VisitUtil) {

    // Channel constants
    var OPEN_VISIT_SELECTOR = 'openVisitSelector';
    var CHANGE_VISIT = 'changeVisit';
    var ENFORCE_VISIT_SELECTION = 'enforceVisitSelection';
    var VISIT = 'visit';
    var SET_VISIT_SUCCESS = 'set-visit-success';
    var SET_VISIT_CANCEL = 'set-visit-cancel';

    // Using an applet key for success event so we don't broadcast success and every applet tries to take action
    var visitChannel = ADK.Messaging.getChannel(VISIT),
        currentAppletKey,
        modalView;

    visitChannel.comply(OPEN_VISIT_SELECTOR, handleOpenVisit);
    visitChannel.comply(ENFORCE_VISIT_SELECTION, handleEnforceVisit);
    visitChannel.comply(CHANGE_VISIT, handleChangeVisit);

    function isVisitSet() {
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        if (!currentPatient.get(VISIT)) return false;
        return true;
    }

    function handleVisitWF(appletKey, param) {
        currentAppletKey = appletKey;
        modalView = new ModalView();

        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();
        $('#modal-lg-region').empty();
    }

    function handleOpenVisit(appletKey, options) {
        var closeVisit = function() {
            ADK.UI.Modal.hide();
        };
        visitChannel.once(SET_VISIT_SUCCESS + ':' + appletKey, closeVisit);
        visitChannel.once(SET_VISIT_CANCEL + ':' + appletKey, closeVisit);

        currentAppletKey = appletKey;
        modalView = new ModalView();
        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();
        $('#modal-lg-region').empty();
    }

    function handleEnforceVisit(appletKey, options) {
        if (!isVisitSet()) {
            visitChannel.once(SET_VISIT_SUCCESS + ':' + appletKey, function() {
                invokeApplet(options);
            });
            visitChannel.once(SET_VISIT_CANCEL + ':' + appletKey, function() {
                ADK.UI.Modal.hide();
            });
            handleVisitWF(appletKey, options);
        } else {
            invokeApplet(options);
        }
    }

    function handleChangeVisit(appletKey, options) {
        visitChannel.once(SET_VISIT_SUCCESS + ':' + appletKey, function() {
            invokeApplet(options);
        });
        visitChannel.once(SET_VISIT_CANCEL + ':' + appletKey, function() {
            invokeApplet(options);
        });
        handleVisitWF(appletKey, options);
    }

    function invokeApplet(options) {
        var deferredResponse = ADK.Messaging.getChannel(options.channel).request(options.command);
        deferredResponse.done(options.callback);
    }

    function enableNextButton() {
        // Don't have a handle to the modal after it's shown, so not sure how else to accomplish this
        $("#setVisitBtn").attr("disabled", false);
    }

    function disableNextButton() {
        $("#setVisitBtn").attr("disabled", true);
    }

    function resetErrorList() {
        $('#location-error').text('');
        $('#date-error').text('');
        $('#time-error').text('');
    }

    function resetFocusList() {
        $("#visitModal ul li").removeClass('focused');
    }


    var VisitItemView = Backbone.Marionette.ItemView.extend({
        id: function() {
            //return this.model.get('uid');
            var regex = /^\w+:\w+:(\w+)/;
            var match = this.model.get('uid').match(regex);
            var prefix = 'location_';
            if (match[1]) {
                prefix += match[1] + '_';
            }
            return prefix + this.model.collection.indexOf(this.model);
        },
        tagName: 'li',
        className: 'list-group-item',
        model: VisitModel,
        template: visitItemTemplate,
        events: {
            'click': 'highlightRow',
            'keydown': 'pressKey'
        },
        attributes: {
            'role': 'listitem',
            'tabindex': -1
        },
        highlightRow: function() {
            $("#visitModal div.tab-pane li.active").removeClass("active");
            resetFocusList();
            this.$el.addClass('active');
            enableNextButton();
            modalView.setSelectedVisit(this.model, true);
        },
        pressKey: function(e) {
            if (e.keyCode === 13 || e.keyCode === 32) {
                this.highlightRow();
            }
        }
    });

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: _.template('<span class="loading">Loading...</span>')
    });

    var EmptyListView = Backbone.Marionette.ItemView.extend({
        template: _.template('<span class="empty-activities">No activities available</span>')
    });

    var VisitListView = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'list-group',
        childView: VisitItemView,
        emptyView: LoadingView,
        events: {
            'keydown': 'handleArrowSelection',
            'focus': function(event) {
                this.$el.find('li').removeClass('focused');
                this.$el.find('li:first-child').addClass('focused').focus();

            }
        },
        collectionEvents: {
            'sync': 'onSync'
        },
        attributes: {
            'role': 'group',
            'tabindex': 0
        },
        initialize: function(options) {
            var fetchOptions = {};
            fetchOptions.viewModel = VisitModel;
            fetchOptions.patient = ADK.PatientRecordService.getCurrentPatient();
            fetchOptions.resourceTitle = options.resourceTitle;
            this.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        onSync: function() {
            if (this.collection.length === 0) {
                this.emptyView = EmptyListView;
                this.render();
            }
        },
        handleArrowSelection: function(e) {
            if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                var focusedItem = $(this.el).find('li.focused');

                if (focusedItem[0]) {
                    focusedItem.removeClass('focused');

                    var newFocusedItem;
                    if (e.keyCode === 40) {
                        if (focusedItem.is(':last-child')) {
                            newFocusedItem = $(this.el).find('li:first-child');
                        } else {
                            newFocusedItem = focusedItem.next();
                        }
                    } else {
                        if ($(this.el).find('li:first-child')[0].id === focusedItem[0].id) {
                            newFocusedItem = $(this.el).find('li:last-child');
                        } else {
                            newFocusedItem = focusedItem.prev();
                        }
                    }

                    newFocusedItem.addClass('focused');
                    newFocusedItem.focus();

                    var pos = $(newFocusedItem).position().top - $(this.el).position().top;
                    $('#visitModal .tab-pane.active').scrollTop(pos);

                } else {
                    e.preventDefault();
                    var listItem = $(this.el).find('li:first-child');
                    listItem.addClass('focused');
                    listItem.focus();
                }
            } else if (e.keyCode === 13) {
                e.preventDefault();
            }
        }
    });

    var LocationItemModel = Backbone.Model.extend({
        parse: function(response) {
            return response;
        }
    });

    var ProviderModel = {
        parse: function(response) {
            return response;
        }
    };

    var VisitModel = {
        parse: function(response) {
            response.formattedDate = ADK.utils.formatDate(response.dateTime, "MM/DD/YYYY HH:mm");
            return response;
        }
    };

    var NewVisitView = Backbone.Marionette.LayoutView.extend({
        template: newVisitTemplate,
        regions: {
            locations: '#locationSelection'
        },
        events: {
            'blur #dp-visit': 'handleDateSelection',
            'blur #tp-visit': 'updateSelectedVisit',
            'blur #location': 'checkLocationStatus',
            'click #date-picker-icon': 'openDatePicker'
        },
        initialize: function() {

            var siteCode = ADK.UserService.getUserSession().get('site');
            var user = ADK.UserService.getUserSession();
            var fetchOptions = {};
            fetchOptions.viewModel = LocationItemModel;
            fetchOptions.resourceTitle = "locations-clinics";

            fetchOptions.criteria = {
                "site.code": siteCode,
                limit: 10
            };

            var TypeaheadView = Typeahead.generate("location", "Visit Location", fetchOptions, "name", "name");
            this.locationsView = new TypeaheadView();
            this.listenTo(this.locationsView, 'selected_typeahead:location', this.updateSelectedVisit);

            var date = moment().format('MM/DD/YYYY');
            var time = moment().format('hh:mma');
            time = time.substring(0, 6);

            this.model = new Backbone.Model();
            this.model.set('date', date);
            this.model.set('time', time);
        },
        onRender: function() {
            this.locations.show(this.locationsView);
            ADK.utils.dateUtils.datepicker(this.$('#dp-visit'));

            this.$('#tp-visit').inputmask("Regex", {
                'placeholder': "HH:MM(a/p)",
                'clearIncomplete': true
            });
        },
        openDatePicker: function() {
            this.$('#dp-visit').datepicker('show');
        },
        checkLocationStatus: function() {
            if (!$('#location').val()) {
                disableNextButton();
            }
        },
        resetLocationModel: function() {
            this.locationsView.model = undefined;
        },
        handleDateSelection: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var view = this;

            setTimeout(function() {
                view.updateSelectedVisit();
            }, 150);
        },
        updateSelectedVisit: function() {
            var selectedDate = $('#dp-visit').val();
            var selectedTime = $('#tp-visit').val();

            if (this.locationsView.model) {
                enableNextButton();
            } else {
                disableNextButton();
            }

            if (this.locationsView.model || selectedDate || selectedTime) {
                var newSelectedVisit = new Backbone.Model();


                if (this.locationsView.model) {
                    newSelectedVisit.set("locationUid", this.locationsView.model.get('uid'));
                    newSelectedVisit.set("locationDisplayName", this.locationsView.model.get('name'));
                }

                if (selectedDate) {
                    var dateTime = VisitUtil.getDateTime(selectedDate, selectedTime);
                    newSelectedVisit.set("dateTime", dateTime);
                    newSelectedVisit.set("formattedDate", ADK.utils.formatDate(dateTime, "MM/DD/YYYY HH:mm"));
                }
                newSelectedVisit.set("isHistorical", $('#visit-historical').val());
                modalView.setSelectedVisit(newSelectedVisit, false);
            }
        },
        isDataValid: function() {
            var selectedDate = $('#dp-visit').val();
            var selectedTime = $('#tp-visit').val();
            var errorCount = 0;
            if (!this.locationsView.model) {
                errorCount++;
                $('#location-error').text('No location selected');
                $('#location-error').focus();
            }

            if (!selectedDate) {
                errorCount++;
                $('#date-error').focus();
            } else {
                if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/[0-9]{4}$/.test(selectedDate)) {
                    errorCount++;
                    $('#date-error').text('Invalid date format - should be MM/DD/YYYY');
                    $('#date-error').focus();
                } else {
                    var dateDiff = moment(selectedDate).diff(moment(), 'years', true);
                    if (dateDiff > 1 || dateDiff < -1) {
                        errorCount++;
                        $('#date-error').text('Date must be within one year of today');
                        $('#date-error').focus();
                    }
                }
            }

            if (!/^([0][1-9]|[1][0-2]):([0-5]\d)(a|p)$/.test(selectedTime)) {
                errorCount++;
                $('#time-error').text('Invalid time format - should be HH:MMa/p');
            }

            return errorCount === 0;
        }
    });

    var SelectedVisitView = Backbone.Marionette.ItemView.extend({
        model: VisitModel,
        template: selectedVisitTemplate,
        tagName: "div",
        attributes: {
            "id": "innerVisit",
            "tabindex": -1
        },
        initialize: function() {
            this.model = new Backbone.Model();
        }
    });

    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: modalTemplate,
        regions: {
            appts: "#appts",
            admits: "#admits",
            new_visit: "#new-visit",
            selected_visit: "#selected-visit",
            provider: "#provider-select"
        },
        events: {
            'click #visitModal ul.nav-tabs a[href="#appts"]': 'changeToListTab',
            'click #visitModal ul.nav-tabs a[href="#admits"]': 'changeToListTab',
            'click #visitModal ul.nav-tabs a[href="#new-visit"]': 'changeToNewVisitTab',
            'click #encounter-btn' : 'openEncounterForm'
        },
        initialize: function() {
            this.selectedVisit = new Backbone.Model();
            this.apptsView = new VisitListView({
                resourceTitle: 'visits-appointments'
            });
            this.admitsView = new VisitListView({
                resourceTitle: 'visits-admissions'
            });
            this.selectedVisitView = new SelectedVisitView();
            this.newVisitView = new NewVisitView();

            var existingVisit = ADK.PatientRecordService.getCurrentPatient().get('visit');

            if (existingVisit) {
                existingVisit.existingVisit = true;
                var selectedVisitModel = new Backbone.Model(existingVisit);
                this.selectedVisit = selectedVisitModel;
                this.selectedVisitView.model = selectedVisitModel;
            } else {
                this.selectedVisit = new Backbone.Model();
            }

            var siteCode = ADK.UserService.getUserSession().get('site');
            var fetchOptions = {
                viewModel: ProviderModel,
                resourceTitle: "visits-providers",
                criteria: {
                    "facility.code": siteCode,
                    limit: 10
                }
            };

            var user = ADK.UserService.getUserSession();
            var prov;
            if (user.get('provider')) {
                var provName = user.get('lastname') + ',' + user.get('firstname');
                var provId = user.get('duz')[user.get('site')];
                prov = new Backbone.Model({
                    name: provName,
                    localId: provId,
                    displayName: provName
                });

            }

            var ProviderTypeaheadView = Typeahead.generate("provider", "Encounter Provider", fetchOptions, "name", "pname", prov);
            this.providerView = new ProviderTypeaheadView();
        },
        getSelectedVisit: function() {
            return this.selectedVisit;
        },
        setSelectedVisit: function(model, isExistingVisit) {
            model.set('existingVisit', isExistingVisit);
            this.selectedVisit = model;
            this.selectedVisitView.model = model;
            this.selectedVisitView.render();
        },

        setProvider: function() {
            if (this.providerView.model) {
                this.getSelectedVisit().set('selectedProvider', this.providerView.model.toJSON());
            } else {
                this.getSelectedVisit().set('selectedProvider', {});
            }
        },

        onRender: function() {
            this.appts.show(this.apptsView);
            this.admits.show(this.admitsView);
            this.new_visit.show(this.newVisitView);
            this.selected_visit.show(this.selectedVisitView);
            this.provider.show(this.providerView);
        },
        changeToListTab: function() {
            if (!modalView.getSelectedVisit().get("uid")) {
                disableNextButton();
            }
        },
        changeToNewVisitTab: function() {
            //$('#location').val('');
            if (this.getSelectedVisit() && !this.getSelectedVisit().get('isExistingVisit')) {
                if (this.isDataValid()) {
                    enableNextButton();
                }
                resetErrorList();
            } else {
                enableNextButton();
            }
            //this.newVisitView.resetLocationModel();
        },
         openEncounterForm: function(event) {
            event.preventDefault();
            var encounterFormChannel = ADK.Messaging.getChannel('encounterFormRequestChannel');
             encounterFormChannel.command('openEncounterForm');
        },
        isDataValid: function() {
            return this.newVisitView.isDataValid();
        }
    });

    var footerView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate,
        events: {
            'click #setVisitBtn': 'handleNext',
            'click #visitCancelBtn': 'goBack'
        },
        initialize: function() {
            this.model = new Backbone.Model();
            if (!ADK.PatientRecordService.getCurrentPatient().get('visit')) {
                this.model.set('disabled', 'disabled');
            }
        },
        goBack: function() {
            var appletEventName = SET_VISIT_CANCEL + ':' + currentAppletKey;
            visitChannel.trigger(SET_VISIT_CANCEL);
            visitChannel.trigger(appletEventName);
        },
        handleNext: function(event) {
            var visit = modalView.getSelectedVisit();

            if (modalView.getSelectedVisit().get('existingVisit') || modalView.isDataValid()) {
                if (!modalView.getSelectedVisit().get('existingVisit')) {

                    // This is a new visit - update form fields before we submit
                    modalView.newVisitView.updateSelectedVisit();
                }

                modalView.setProvider();
                var newPatientModel = ADK.PatientRecordService.getCurrentPatient();
                newPatientModel.set({
                    //The view expects the data
                    visit: JSON.parse(JSON.stringify(modalView.getSelectedVisit()))
                });

                ADK.SessionStorage.addModel('patient', newPatientModel);
                var appletEventName = SET_VISIT_SUCCESS + ':' + currentAppletKey;
                visitChannel.trigger(SET_VISIT_SUCCESS);
                visitChannel.trigger(appletEventName);
            } else {

                event.stopPropagation();
                enableNextButton();
            }
        }
    });

    var modalOptions = {
        'title': 'Location for Current Activity',
        'footerView': footerView,
        'regionName': 'visitRegion',
        'replaceContents': false,
        'callShow': true
    };

    // Eventually need to get rid of the view here when we have a way to load applets without them existing on a screen
    var applet = {
        id: "visit",
        getRootView: function() {
            var EmptyView = Backbone.Marionette.ItemView.extend({
                template: _.template('')
            });

            return EmptyView;
        }
    };

    return applet;
});
