define([
    "jquery",
    "underscore",
    "hbs!main/components/applets/grid_applet/gists/templates/interventions",
    "hbs!main/components/applets/grid_applet/gists/templates/problems",
    "hbs!main/components/applets/grid_applet/gists/templates/pill",
    "hbs!main/components/applets/grid_applet/gists/templates/observations",
    "api/ResourceService",
    "api/Messaging"
], function($, _, interventionTemplate, problemTemplate, pillTemplate, observationTemplate, ResourceService, Messaging) {
    'use strict';
    var gistHelper = {
        getGistItemGraphicClass: function(gistGraphicType) {
            switch (gistGraphicType.toUpperCase()) {
                case 'NONE':
                    return '';
                case 'UPARROW':
                    return 'fa fa-arrow-up changeArrow';
                case 'DOWNARROW':
                    return 'fa fa-arrow-down changeArrow';
                    // case 'EXCLAMATION-CIRCLE':
                    //     return 'fa fa-exclamation-circle discontinuedMed';
                    // case 'MINUS-CIRCLE':
                    //     return 'fa fa-minus-circle expiredMed';
                default:
                    return '';
            }
        },
        getInterventionSeverityClass: function(interventionCount) {
            switch (interventionCount.toUpperCase()) {
                case '0':
                    return 'label label-danger';
                case '1':
                    return 'label label-warning';
                case 'EXP':
                    return 'expiredMedWarning';
                default:
                    return '';
            }
        },
        getGistItem: function(gistType, AppletID, hover) {
            var self = this;
            var gistItemConfig = {
                AppletID: AppletID,
                className: 'gistItem',
                template: '',
                detailTrigger: 'getDetailView',
                events: {
                    'click button#closeGist': function(event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        $(this.el).find('.sub-elements').hide();
                    },
                    'click button.groupItem': function(event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    },
                    'hover div.gistItem': function(event) {
                        var gistID = $(event.target).attr('id');
                        $('#' + gistID).blur();
                    },
                    'focus div.gistItem': function(event) {
                        var gistItem = $(document.activeElement);
                        gistItem.keypress(function(e) {
                            if (e.which === 13 || e.which === 32) {
                                gistItem.trigger('click');
                            }
                        });
                    },
                    'click div.gistItem': function(event) {
                        console.log('=-=-=-=');
                        if (hover) {
                            $('.customPopover').popover('hide');
                        }
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                        var channelObject = {
                            model: this.model,
                            uid: this.model.get("uid"),
                            patient: {
                                icn: currentPatient.attributes.icn,
                                pid: currentPatient.attributes.pid
                            }
                        };
                        console.log('++++++', channelObject);
                        Messaging.getChannel(gistItemConfig.AppletID).trigger(gistItemConfig.detailTrigger, channelObject);
                    }
                },
                onRender: function() {}
            };
            switch (gistType.toUpperCase()) {
                case 'INTERVENTION':
                    gistItemConfig.className = 'gistItem col-sm-12';
                    gistItemConfig.template = interventionTemplate;
                    gistItemConfig.onRender = function() {
                        var severityCheck = $(this.el).find('span[count]');
                        var graphic = $(this.el).find('span[graphic]');
                        severityCheck.addClass(self.getInterventionSeverityClass(severityCheck.text()));
                        graphic.addClass(self.getGistItemGraphicClass(graphic.attr('graphic')));
                    };
                    break;
                case 'PROBLEM':
                    gistItemConfig.className = 'gistItem col-sm-12';
                    gistItemConfig.template = problemTemplate;
                    break;
                case 'PILL':
                    gistItemConfig.template = pillTemplate;
                    break;
            }
            return this.buildGistItem(gistItemConfig);
        },
        buildGistItem: function(gistItemConfig) {
            var gistItem = Backbone.Marionette.ItemView.extend({
                //tagName: "li",
                className: gistItemConfig.className,
                template: gistItemConfig.template,
                events: gistItemConfig.events,
                onRender: gistItemConfig.onRender
            });
            return gistItem;

        }
    };
    return gistHelper;

});
