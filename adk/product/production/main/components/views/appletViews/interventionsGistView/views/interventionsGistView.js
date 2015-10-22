define([
    "jquery",
    "underscore",
    "main/Utils",
    "backbone",
    "hbs!main/components/views/appletViews/interventionsGistView/templates/interventionsGistLayout",
    "hbs!main/components/views/appletViews/interventionsGistView/templates/interventionsGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging",
    'main/components/applets/baseDisplayApplet/baseDisplayAppletItem',
    'main/components/applets/baseDisplayApplet/baseGistView',
    "main/components/appletToolbar/appletToolbarView",
    "main/components/views/appletViews/TileSortManager"
], function($, _, Utils, Backbone, interventionsGistLayoutTemplate, interventionsGistChildTemplate, popoverTemplate, ResourceService, Messaging, BaseAppletItem, BaseGistView, ToolbarView, TileSortManager) {
    'use strict';

    var InterventionsGistItem = BaseAppletItem.extend({
        template: interventionsGistChildTemplate,
        className: 'gistItem col-sm-12',
        getGistItemGraphicClass: function(gistGraphicType) {
            switch (gistGraphicType.toUpperCase()) {
                case 'NONE':
                    return 'noChange';
                case 'UPARROW':
                    return 'fa fa-caret-up changeArrow';
                case 'DOWNARROW':
                    return 'fa fa-caret-down changeArrow';
                case 'EXCLAMATION-CIRCLE':
                    return 'fa fa-exclamation-circle discontinuedMed';
                case 'EXPIRED':
                    return 'expiredMed';
                case 'NEW':
                    return 'newMed';
                default:
                    return 'noChange';
            }
        },
        getInterventionSeverityClass: function(interventionCount) {
            switch (interventionCount.toUpperCase()) {
                case '0':
                    return 'label label-danger labelSizeCorrection';
                case '1':
                    return 'label label-warning labelSizeCorrection';
                case 'EXP':
                    return 'expiredMedWarning';
                default:
                    return 'lineCorrection';
            }
        },
        onDestroy: function() {
            this.ui.popoverEl.popup('destroy');
        },
        initialize: function() {
            var buttonTypes = ['infobutton', 'detailsviewbutton', 'quicklookbutton'];
            if (!Messaging.request('get:current:screen').config.predefined) {
                buttonTypes.unshift('tilesortbutton');
            }

            this.toolbarOptions = {
                targetElement: this,
                buttonTypes: buttonTypes
            };
        },
        onRender: function() {
            //this._base.onRender.apply(this, arguments);
            var severityCheck = this.$('div[count]');
            var graphic = this.$('div[graphic]');
            var severity = (this.getInterventionSeverityClass(severityCheck.text()));
            severityCheck.addClass(severity);
            var graphicClass = this.getGistItemGraphicClass(graphic.attr('graphic'));
            var changeText = '';
            switch (graphicClass) {
                case 'expiredMed':
                    graphic.text('Exp');
                    changeText = 'Expired';
                    break;
                case 'newMed':
                    graphic.text('New');
                    changeText = 'New';
                    break;
                case 'fa fa-caret-down changeArrow':
                    changeText = 'Decreased';
                    break;
                case 'fa fa-exclamation-circle discontinuedMed':
                    changeText = 'Discontinued';
                    break;
                case 'fa fa-caret-up changeArrow':
                    changeText = 'Increased';
                    break;
                case 'noChange':
                    graphic.text('--');
                    changeText = 'No Change';
                    break;
            }
            graphic.addClass(graphicClass);
            var countText = this.$('#count').text();
            if (countText === '-1') {
                countText = 'Unknown';
                this.$('#count').text('NA');
            }
            var infoText = countText + ' refills left. Change: ' + changeText + ', Age: ' + this.$('#age').attr('title');
            this.$('.quickDraw').attr('aria-label', infoText);
            this.createPopover();
        }
    });

    var InterventionsGist = BaseGistView.extend({
        template: interventionsGistLayoutTemplate,
        childView: InterventionsGistItem,
        initialize: function(options) {
            this.childViewOptions = {
                AppletID: this.AppletID,
                appletOptions: options
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };
            this.collection.on("filterDone", function() {}, this);
            this.collection = options.collection;
            this.gistModel = options.gistModel;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model({});

            this.model.set('gistHeaders', options.gistHeaders || {
                name: 'Medication',
                description: '',
                graphic: 'Change',
                age: 'Age',
                count: 'Refills'
            });

            this.model.set('appletID', this.AppletID);
            this.childViewContainer = "#" + this.AppletID + "-interventions" + "-gist-items";
        }
    });

    var InterventionsGistView = {
        create: function(options) {
            var interventionsGistView = new InterventionsGist(options);
            return interventionsGistView;
        },
        getView: function() {
            return InterventionsGist;
        }
    };

    return InterventionsGistView;
});