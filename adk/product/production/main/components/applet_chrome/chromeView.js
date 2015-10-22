define([
    'jquery',
    'underscore',
    'api/Messaging',
    'main/Utils',
    'api/Navigation',
    'api/ResourceService',
    'api/SessionStorage',
    'hbs!main/components/applet_chrome/templates/containerTemplate',
    'main/components/applet_chrome/views/addButtonView',
    'main/components/applet_chrome/views/exitOptionsButtonView',
    'main/components/applet_chrome/views/optionsButtonView',
    'main/components/applet_chrome/views/refreshButtonView',
    'main/components/applet_chrome/views/resizeView',
    'main/components/applet_chrome/views/filterButtonView',
    'main/components/applet_chrome/views/helpButtonView',
    'main/components/applet_chrome/views/buttonCollectionView',
    'main/api/WorkspaceFilters'
], function($, _, Messaging, Utils, Navigation, ResourceService, SessionStorage, containerTemplate, AddButtonView, ExitOptionsButtonView, OptionsButtonView, RefreshButtonView, ResizeView, FilterButtonView, HelpButtonView, ButtonCollectionView, WorkspaceFilters) {
    'use strict';


    function getAppletHelpKey(appletView) {
        var appletViewName = appletView.options.appletConfig.id;
        var viewType = appletView.options.appletConfig.viewType;
        if (viewType !== undefined) {
            appletViewName += '_' + viewType.replace('summary', 'standard');
        } else {
            appletViewName += '_' + appletView.options.appletConfig.fullScreen ? '_expanded' : 'standard';
        }
        return appletViewName;
    }

    function getHelpUrl(appletView) {
        var helpKey = getAppletHelpKey(appletView);
        return Utils.helpUtils.getUrl(helpKey);
    }

    function getHelpTooltip(appletView) {
        var helpKey = getAppletHelpKey(appletView);
        return Utils.helpUtils.getTooltip(helpKey);
    }
    var ButtonViewModel = Backbone.Model.extend({
        defaults: {
            'id': '',
            'view': undefined
        }
    });

    /*
     * options: {appletScreenConfig, AppletView, AppletController(optional)}
     */
    var ChromeLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function(options) {
            this.buttonCollection = new Backbone.Collection();
            this.appletScreenConfig = this.appletScreenConfig || options.appletScreenConfig;
            this.model = new Backbone.Model(this.appletScreenConfig);
            this.AppletView = this.AppletView || options.AppletView;
            this.options = options;
            this.predefinedScreen = dd(options)('screenModule')('config')('predefined').val;
            if (!dd(this.predefinedScreen).exists) {
                this.predefinedScreen = true;
            }
        },
        onShow: function() {
            this.createViews();
            this.appletDiv.show(this.viewToDisplay);

            this.createPredefinedButtons();
            this.buttonCollectionView = new ButtonCollectionView({
                collection: this.buttonCollection
            });
            this.buttonRegion.show(this.buttonCollectionView);
            if (this.refreshButtonView) {
                this.chromeRefreshButton.show(this.refreshButtonView);
            }
            this.ensureEditableTitleCssClass();
            var appletInstanceId = this.model.get('instanceId');
            WorkspaceFilters.onAppletFilterCollectionChanged(appletInstanceId, this.refreshAppletTitleColor, this);
        },
        refreshAppletTitleColor: function(args) {
            var anyFilters = args.anyFilters;
            var panelHeading = this.$el.find('.panel-heading');
            if (anyFilters) {
                panelHeading.addClass('panel-heading-filtered');
            } else {
                panelHeading.removeClass('panel-heading-filtered');
            }
        },
        createViews: function() {
            if (this.AppletController) {
                this.viewToDisplay = new this.AppletController(this.options);
                this.listenTo(this.viewToDisplay.model, 'change:currentView', this.appletViewTypeChange);
                this.appletView = this.viewToDisplay.model.get('currentView');
            } else {
                this.viewToDisplay = new this.AppletView(this.options);
                this.appletView = this.viewToDisplay;
            }
            if (this.appletView.eventMapper) {
                this.eventMapper = this.appletView.eventMapper;
            }
        },
        createPredefinedButtons: function() {
            //Create Refresh Button View
            if (this.refreshEnabled()) {
                this.refreshButtonView = new RefreshButtonView();
            }

            var viewConfig = Utils.appletUtils.getViewTypeConfig(this.options, this.model.get('viewType'));
            if (dd(viewConfig)('chromeOptions')('additionalButtons').val && viewConfig.chromeOptions.additionalButtons instanceof Array) {
                _.forEach(viewConfig.chromeOptions.additionalButtons, function(item) {
                    if (item.id && item.view) {
                        this.buttonCollection.add(new ButtonViewModel({
                            id: item.id,
                            view: new item.view()
                        }));
                    }
                }, this);
            }

            //Create Help Button View
            if (this.helpEnabled()) {
                this.buttonCollection.add(new ButtonViewModel({
                    id: 'help-button',
                    view: new HelpButtonView({
                        model: this.model.clone().set('helpTooltip', getHelpTooltip(this.appletView))
                    })
                }));
            }
            //Create Add Button View
            // - if the view being displayed has a onClickAdd method
            if (this.appletView.hasOwnProperty('onClickAdd')) {
                this.buttonCollection.add(new ButtonViewModel({
                    id: 'add-button',
                    view: new AddButtonView()
                }));
            }
            //Create Filter Button View
            // - when the view being displayed has a filterDateRangeView or filterView
            if (this.appletView.hasOwnProperty('filterDateRangeView') || this.appletView.hasOwnProperty('filterView')) {
                if (!this.model.get('filterName')) {
                    this.model.set('filterName', 'Filtered');
                }
                this.buttonCollection.add(new ButtonViewModel({
                    id: 'filter-button',
                    view: new FilterButtonView({
                        model: this.model
                    })
                }));
            }
            //Create the cog icon Options Button View
            // - don't show if on a fullScreen view or not a user defined workspace
            // this if(options.screenModule) check needs to be here for the timeline summary view
            if (!this.predefinedScreen && (!this.model.has('fullScreen') && ($('.gridster').length > 0)) && this.AppletController) {
                this.buttonCollection.add(new ButtonViewModel({
                    id: 'options-button',
                    view: new OptionsButtonView({
                        model: new Backbone.Model({
                            'openContext': false
                        })
                    })
                }));
            }
            //Create Resize Button View
            // - when applet has a maximizeScreen specified in the screen config
            if (this.model.has('maximizeScreen') || (this.model.has('fullScreen') && this.model.get('fullScreen') === true)) {
                this.buttonCollection.add(new ButtonViewModel({
                    id: 'resize',
                    view: new ResizeView({
                        model: this.model
                    })
                }));
            }
        },
        appletViewTypeChange: function(appletControllerModel) {
            this.appletView = this.viewToDisplay.model.get('currentView');
            this.model.set('viewType', appletControllerModel.get('currentViewType'));
            this.resetButtons();

            this.$el.find(".appletDiv_ChromeContainer").removeClass("hide");
            this.$el.find(".switchboard-container").addClass("hide");
            this.$el.find(".grid-applet-heading").toggleClass("optionsPanelStyle panel-heading");
            this.$el.find(".grid-refresh-button").removeClass("hide");

            if (this.$el.find(".panel-title-label").text().indexOf("- Select a View") > -1) {
                this.$el.find(".panel-title-label").text(this.model.attributes.title);
            } else {
                this.$el.find(".panel-title-label").text(this.model.attributes.title + " - Select a View");
            }
            this.switchboardContainer.reset();
        },
        resetButtons: function() {
            this.buttonCollection.reset();

            this.refreshButtonView = null;
            this.chromeRefreshButton.empty();
            this.createPredefinedButtons();
            if (this.refreshButtonView) {
                this.chromeRefreshButton.show(this.refreshButtonView);
            }
        },
        ensureEditableTitleCssClass: function() {
            if (this.isTitleEditable()) {
                this.$el.addClass('editable-title');
            }
        },
        onRender: function() {
            window.scrollTo(0, 0);
            Utils.applyMaskingForSpecialCharacters(this.$el.find('.panel-title-textbox'));
        },
        template: containerTemplate,
        regions: {
            appletDiv: '.appletDiv_ChromeContainer',
            chromeContainer: '.chrome-container',
            buttonRegion: '.right-button-region',
            chromeRefreshButton: '.grid-refresh-button',
            chromeFooter: '.grid-footer',
            switchboardContainer: '.switchboard-container'
        },
        events: {
            'click .applet-maximize-button': 'expandApplet',
            'click .applet-minimize-button': 'minimizeApplet',
            'click .applet-refresh-button': function(event) {
                this.onClickButton("refresh", event);
            },
            'click .applet-add-button': function(event) {
                this.onClickButton("add", event);
            },
            'click .applet-help-button': 'showHelp',
            'click .applet-options-button': 'displaySwitchboard',
            'click .applet-exit-options-button': 'closeSwitchboard',
            'click .panel-title-label': 'setTitleModeFromUi',
            'focusout .panel-title-textbox': 'setTitleModeFromUi',
            'change .panel-title-textbox': 'saveTitle',
            'keypress .panel-title-textbox': 'titleKeypress'
        },
        titleKeypress: function(e) {
            if (e.which == 13) {
                this.getPanelTitleTextbox().focusout();
            }
        },
        isTitleEditable: function() {
            var isUserDefinedWorkspace = !Messaging.request('get:current:screen').config.predefined;
            var isStackedGraphApplet = this.model.id === 'stackedGraph';
            var isInRegularViewModeNotInSettingsMode = $('.panel-heading.grid-applet-heading', this.$el).length;
            return isUserDefinedWorkspace && isStackedGraphApplet && isInRegularViewModeNotInSettingsMode;
        },
        saveTitle: function() {
            var panelTitleTextbox = this.getPanelTitleTextbox();
            var newTitle = panelTitleTextbox.val();
            if (newTitle === '')
                return;
            this.model.set('title', newTitle);
            var panelTitleLabel = this.getPanelTitleLabel();
            panelTitleLabel.text(newTitle).focus();
            Messaging.trigger('gridster:saveAppletsConfig');
        },
        getPanelTitleTextbox: function() {
            return this.$el.find('.panel-title-textbox');
        },
        setVisible: function(el, visible) {
            if (visible) {
                el.removeClass('hidden');
            } else {
                el.addClass('hidden');
            }
        },
        setTitleModeFromUi: function(event) {
            var makeEditible = $(event.target).hasClass('panel-title-label');
            this.setTitleMode(makeEditible);
        },
        getPanelTitleLabel: function() {
            return this.$el.find('.panel-title-label');
        },
        setTitleMode: function(setEditable) {
            if (!this.isTitleEditable()) {
                console.log("Can't edit non-user defined workspaces");
                return;
            }
            setEditable = setEditable === undefined ? true : setEditable;
            var panelTitleLabel = this.getPanelTitleLabel();
            var panelTitleLabelWidth = panelTitleLabel.width();
            this.setVisible(panelTitleLabel, !setEditable);
            var panelTitleTextbox = this.getPanelTitleTextbox();
            this.setVisible(panelTitleTextbox, setEditable);
            panelTitleTextbox.width(panelTitleLabelWidth);

            if (setEditable) {
                var currentTitle = this.model.get('title');
                panelTitleTextbox
                    .focus()
                    .val(currentTitle.trim());
            }
        },
        refreshEnabled: function() {
            if (this.eventMapper && this.eventMapper.refresh) {
                var eventMethod = this.eventMapper.refresh;
                if (_.isFunction(this.appletView[eventMethod])) {
                    return true;
                }
            }
            return false;
        },
        helpEnabled: function() {
            var url = getHelpUrl(this.appletView);
            return (url !== "");
        },
        expandApplet: function(event) {
            /* Remove any popover elements on the screen before expanding an applet bug fix*/
            $('.popover').popover('hide');
            $('.tooltip').tooltip('hide');
            Navigation.navigate(this.model.get('maximizeScreen'));
        },
        minimizeApplet: function(event) {
            $('.tooltip').tooltip('hide');
            Backbone.history.history.back();
        },
        onClickButton: function(type, event) {
            if (this.eventMapper && this.eventMapper[type] && type !== null) {
                var eventMethod = this.eventMapper[type];
                this.appletView[eventMethod](event);
            }
        },
        toggleClasses_SwitchBoard_show_hide: function() {
            this.$el.find(".grid-applet-heading").toggleClass("optionsPanelStyle panel-heading");
            this.$el.find(".grid-filter, .grid-toolbar, .grid-refresh-button").toggleClass("hide");
            _.forEach(this.buttonCollection.models, function(buttonModel) {
                if (buttonModel.get('id') != "options-button") {
                    this.$el.find(".grid-" + buttonModel.get('id')).toggleClass("hide");
                }
            }, this);

            if (this.$el.find(".panel-title-label").text().indexOf("- Select a View") > -1) {
                this.$el.find(".panel-title-label").text(this.model.attributes.title);
            } else {
                this.$el.find(".panel-title-label").text(this.model.attributes.title + " - Select a View");
            }
        },
        toolTipHide : function(event){
            $('.tooltip').tooltip('hide');
        },
        displaySwitchboard: function(event) {
            this.toolTipHide(event);
            var switchboardOptions = {
                appletController: this.viewToDisplay,
                region: this.viewToDisplay.appletRegion,
                containerRegion: this.options.region,
                appletId: this.appletScreenConfig.id,
                appletConfig: this.options.appletConfig,
                switchOnClick: true,
                appletChrome: this
            };
            var SwitchboardView = Messaging.request('switchboard : display', switchboardOptions);
            this.switchboardContainer.show(SwitchboardView);
            this.$el.find(".appletDiv_ChromeContainer").addClass("hide");
            this.$el.find(".switchboard-container").removeClass("hide");
            _.find(this.buttonCollection.models, {
                'id': 'options-button'
            }).get('view').model.set('openContext', true);
            this.toggleClasses_SwitchBoard_show_hide();
        },
        closeSwitchboard: function(event) {
            this.toolTipHide(event);
            _.find(this.buttonCollection.models, {
                'id': 'options-button'
            }).get('view').model.set('openContext', false);
            this.$el.find(".appletDiv_ChromeContainer").removeClass("hide");
            this.$el.find(".switchboard-container").addClass("hide");
            this.toggleClasses_SwitchBoard_show_hide();
            this.switchboardContainer.reset();
        },
        addFilterOpenClass: function() {
            if (this.$el.find('#grid-filter-' + this.appletScreenConfig.id + ':not(.collapse)').length > 0) {
                this.filterButtonView.$el.find('button').addClass("filterOpen");
            }
        },
        showHelp: function(event) {
            var url = getHelpUrl(this.appletView);
            if (url !== "")
                Utils.helpUtils.popupCenter(url, 'helpIconUniqueWindow', '715', '300');
        }
    });

    return ChromeLayoutView;
});