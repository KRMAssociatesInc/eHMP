define([
    'api/Navigation',
    'main/ADKApp',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'main/Utils',
    'api/SessionStorage',
    'api/UserDefinedScreens',
    'hbs!main/components/applet_header/templates/navTemplate',
    'hbs!main/components/global_datepicker/template/gdrHeaderMinimizedTemplate',
    'hbs!main/components/global_datepicker/template/gdrHeaderExtendedTemplate',
    'main/components/global_datepicker/view/gdrSelectorView',
    'main/components/global_datepicker/view/spikeLineView',
    'main/components/global_datepicker/view/trendHistoryView',
    'main/components/text_search/textSearchInputView',
    'main/components/applet_header/views/workspaceSelect'

], function(Navigation, ADKApp, Backbone, Marionette, _, hand, Utils, SessionStorage, UserDefinedScreens, navTemplate, GdrMinimizedHeader, GdrExtendedHeader, GdrSelector, SpikeLineView, TrendHistoryView, TextSearchInputView, WorkspaceSelectView) {
    'use strict';

    var timelineSummaryHasBeenInitialized = false;

    var GdrMinimizedHeaderView = Marionette.ItemView.extend({
        template: GdrMinimizedHeader,
        modelEvents: {
            'change': 'render'
        },
        initialize: function() {
            var sessionGlobalDate = SessionStorage.getModel_SessionStoragePreference('globalDate');
            this.model = sessionGlobalDate;
        }
    });
    var navLayoutView = Backbone.Marionette.LayoutView.extend({
        //return Marionette.LayoutView.extend({
        template: navTemplate,
        className: 'applet-nav',
        regions: {
            gdrSpikeline: '#gdr-spikeline',
            globalDateRegion: '#globalDate-region',
            dateRegionMinimized: '#date-region-minimized',
            textSearchInput: '#text-search-input',
            screenSelectionRegion: '#nav-workspaceSelect',
            dropDownSelect: '.dropdown-menu'
        },
        events: {
            'click .globalDatePickerButton': 'togglePopover',
            'click #gdr-spikeline': 'togglePopover',
            'keydown #globalDatePicker-compact': 'handleEnterOrSpaceBar',
            'keydown #gdr-spikeline': 'handleEnterOrSpaceBar',
        },
        provisionPredefinedScreens: function(predefinedScreensArray) {
            var finalPredefinedScreens = [];
            _.each(predefinedScreensArray, function(predefinedScreen) {
                var hasPermission = true;
                if (!_.isUndefined(predefinedScreen.hasPermission)) {
                    if (_.isFunction(predefinedScreen.hasPermission)) {
                        var permission = predefinedScreen.hasPermission();
                        if (!_.isBoolean(permission)) {
                            permission = false;
                        }
                        hasPermission = permission;
                    } else {
                        hasPermission = false;
                    }
                }
                if (hasPermission === true) {
                    finalPredefinedScreens.push(predefinedScreen);
                }
            });
            return finalPredefinedScreens;
        },
        initialize: function() {
            timelineSummaryHasBeenInitialized = false;

            this.globalDatePicker = new GdrSelector();
            this.gdrMinimizedHeader = new GdrMinimizedHeaderView({
                dateModel: this.globalDatePicker.model
            });
            this.spikeLineView = new SpikeLineView({
                navView: this
            });

            var workspaceSelectModel = new Backbone.Model();
            workspaceSelectModel.set("currentScreen", this.model.get("currentScreen"));
            this.workspaceSelectView = new WorkspaceSelectView({
                model: workspaceSelectModel
            });
            var isNonPatientCentricView = (!_.isUndefined(this.model.get("currentScreen").nonPatientCentricView) &&
                this.model.get("currentScreen").nonPatientCentricView === true);

            if (!isNonPatientCentricView) {
                this.textSearchInputView = new TextSearchInputView();
            } else {
                this.model.set('isNonPatientCentricView', true);
            }

            var self = this;
            var promise = UserDefinedScreens.getScreensConfig();
            self.collection = new Backbone.Collection();
            promise.done(function(screensConfig) {
                var provisionedPredefinedScreens = self.provisionPredefinedScreens(screensConfig.screens);
                self.collection.reset(provisionedPredefinedScreens);
            });

        },
        modelEvents: {
            'change:globalDatepicker': 'toogleGlobalDate',
            'change:currentScreen': 'updateWorkspaceSelection',
            'change:defaultScreen': 'updateWorkspaceDefaultScreen'
        },
        toogleGlobalDate: function() {
            if (this.model.get('globalDatepicker')) {
                this.gdrMinimizedHeader.$el.show();
                this.spikeLineView.$el.show();
                this.$el.find('#date-region-minimized').removeClass('hidden');
            } else {
                this.gdrMinimizedHeader.$el.hide();
                this.spikeLineView.$el.hide();
                this.$el.find('#date-region-minimized').addClass('hidden');
            }
        },
        onShow: function() {
            this.dateRegionMinimized.show(this.gdrMinimizedHeader);
            this.globalDateRegion.show(this.globalDatePicker);
            this.gdrSpikeline.show(this.spikeLineView);
            this.screenSelectionRegion.show(this.workspaceSelectView);
            this.toogleGlobalDate();
            var isNonPatientCentricView = (!_.isUndefined(this.model.get("currentScreen").nonPatientCentricView) &&
                this.model.get("currentScreen").nonPatientCentricView === true);

            if (!isNonPatientCentricView) {
                this.textSearchInput.show(this.textSearchInputView, {
                    preventDestroy: true
                });
            }

            // var self = this;

            // var counter = 0;
            // var interval = setInterval(function() {
            //     try {
            //         counter++;
            //         self.globalDatePicker.getTimelineSummaryView();
            //         console.log('Timeline summary view loaded.');
            //         clearInterval(interval);
            //         interval = 0;
            //     } catch (err) {
            //         if (counter >= 10) {
            //             clearInterval(interval);
            //             interval = 0;
            //             console.log("Timeline summary failed to load.");
            //         } else {
            //             console.log('Attempting to load timeline summary view...');
            //         }
            //     }
            // }, 1000);
        },
        getDropDownItems: function() {},
        setModel: function() {
            var allDropDownItems = this.getDropDownItems();
            var items = Math.ceil(this.collection.length / allDropDownItems);
            this.model.set({

            });
        },
        handleEnterOrSpaceBar: function(event) {
            var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;

            if (keyCode == 13 || keyCode == 32) {
                // e.preventDefault();
                this.togglePopover();
            }
        },
        togglePopover: function() {
            if (!timelineSummaryHasBeenInitialized) {
                this.globalDatePicker.getTimelineSummaryView();
                timelineSummaryHasBeenInitialized = true;
            }

            $('#hiddenDiv').toggleClass('hidden');

            if ($('#hiddenDiv').hasClass('hidden')) {
                $('.cover-sheet .datepicker').hide();
                this.$el.find('#navigation-dateButton').focus();
            } else {
                if (this.globalDatePicker !== undefined && this.globalDatePicker !== null) {
                    this.globalDatePicker.resetToCurrentGlbalDate();
                }
                this.$el.find('#filter-from-date-global').focus();
            }

            $('#navigation-dateButton').toggleClass('active');

            $('body').on('mousedown', this.bodyMousedown);
            $('#hiddenDiv').on('mousedown', this.hiddenDivMousedown);
        },
        hiddenDivMousedown: function(evt) {
            var globalFromDate = $('.input-group.date#custom-date-from-global');
            var globalToDate = $('.input-group.date#custom-date-to-global');

            if (globalFromDate !== undefined && globalFromDate !== null) {
                globalFromDate.datepicker('hide');
            }

            if (globalToDate !== undefined && globalToDate !== null) {
                globalToDate.datepicker('hide');
            }

            evt.stopPropagation();
        },

        bodyMousedown: function(evt) {
            if ($('#mainModal').length === 0) {
                if (!($('#hiddenDiv').hasClass('hidden'))) {
                    // var datepicker = $(evt.target).closest('.datepicker');

                    // if (datepicker === undefined || datepicker === null) {
                    $('#hiddenDiv').toggleClass('hidden');
                    $('#navigation-dateButton').toggleClass('active');
                    $('body').off('mousedown', this.bodyMousedown);
                    // }
                }
            }
        },

        updateWorkspaceSelection: function() {
            this.workspaceSelectView.model.set("currentScreen", this.model.get("currentScreen"));
        },
        updateWorkspaceDefaultScreen: function() {
            this.workspaceSelectView.model.set("defaultScreen", this.model.get("defaultScreen"));
        },
        updateWorkspaceList: function() {
            this.workspaceSelectView.updateWorkspaceList();
        },

        onBeforeDestroy: function() {
            $('#hiddenDiv').off('mousedown', this.hiddenDivMousedown);
        }
    });
    return navLayoutView;
});