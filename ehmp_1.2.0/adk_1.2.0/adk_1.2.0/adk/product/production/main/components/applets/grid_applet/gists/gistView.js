//----------------------------------------
// Name:        Gist View Controler
// File:        GistView.js      
// Version:     0.9
// Date:        2014-12-17
// Modified:    2014-12-27
// Team:        Jupiter
// Description: 
//----------------------------------------
define([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "main/components/applets/grid_applet/gists/gistViewConfig",
    "main/components/applets/grid_applet/gists/gistBuilderHelper",
    "hbs!main/components/applets/grid_applet/gists/templates/interventionsHeader",
    "hbs!main/components/applets/grid_applet/gists/templates/gistLayout",
    "hbs!main/components/applets/grid_applet/gists/templates/problemsHeader"
    //"hbs!main/components/applets/grid_applet/gists/templates/observationsHeader"

], function($, _, Backbone, Marionette, CONFIG, helper, interventionsHeader, gistLayoutTemplate, problemsHeader,observationsHeader) {
    'use strict';
    var AppletID = null;
    var CurrentPopover = null;
    // Switch ON/OFF debug info
    var DEBUG = CONFIG.debug;

    var GistView = Backbone.Marionette.CompositeView.extend({
        events: {
            'click #interventions-header': function(event) { // sould close all sub elements on click (not working)
                console.log("clicked");
            },
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },
            'focus .info-display': function(event) {
                var gistItem = $(document.activeElement);
                gistItem.keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        gistItem.trigger('click');
                    }
                });
            },
            'click .info-display': function(event) {
                $('.customPopover').popover('hide');
                //$(this.el).find('[data-toggle="tooltip"]').tooltip('hide');
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
                console.log(channelObject);
                Messaging.getChannel(AppletID).trigger('detailView', channelObject);
            }
        },
        initialize: function(options) {
            //console.log(options);
            $('html').click(function() {
                $('.customPopover').popover('hide');
            });
            this.gistOptions = options.gistOptions;
            //console.log(options.appletConfiguration.gistModel);
            this.collection = options.collection;
            this.viewType = options.appletConfiguration.defaultView;
            this.headersTemplate = '';
            var self = this;
            this.collection.on("filterDone", function() {
                if (DEBUG) {
                    console.log("filterDone");
                }
                this.render();
            }, this);
            if (_.isUndefined(options.appletConfig.instanceId)) {
                options.appletConfig.instanceId = options.appletConfig.id;
            }
            this.AppletID = options.appletConfig.id;
            var headers = "";
            this.hover = false;
            /*---ADD HEADER LOGIC HERE---*/
            if (this.viewType.toUpperCase() === "INTERVENTION") {
                headers = options.appletConfiguration.gistHeaders;
                this.headersTemplate = interventionsHeader(headers);
                this.hover = true;

            } else if (this.viewType.toUpperCase() === "PROBLEM") {
                headers = options.appletConfiguration.gistHeaders;
                this.headersTemplate = problemsHeader(headers);
            } else if (this.viewType.toUpperCase() === "PILL") {
                this.hover = true;
            } /*else if (this.viewType.toUpperCase() === "OBSERVATION") {
                this.hover = true;
                if(options.appletConfiguration.enableHeader==='true') {
                    headers = options.appletConfiguration.gistHeaders;
                    this.headersTemplate = observationsHeader(headers);
                }
            }*/

            this.childView = helper.getGistItem(this.viewType.toUpperCase(), this.AppletID, this.hover);
            this.childViewContainer = "#" + this.AppletID + "-" + this.viewType.toUpperCase() + "-gist-items";
            this.template = gistLayoutTemplate({
                headerOptionsTemplate: this.headersTemplate,
                appletID: this.AppletID,
                gistType: this.viewType.toUpperCase(),
                verticalLine: options.appletConfiguration.viewColumns == 2 ? true : false
            });


            this.maximizeScreen = options.appletConfig.maximizeScreen;
            this._super = Backbone.Marionette.CompositeView.prototype;
            this._super.initialize.apply(this, arguments);
            //console.log(options.collection);
        },
        onStop: function() {
            $('.customPopover').popover('hide');
        },
        onRender: function() {
            // if (DEBUG) console.log("Show Gist onRender ----->> " + this.AppletID);
            // if (DEBUG) console.log(this.collection);
            var trigger = 'click';
            if (this.hover) {
                trigger = 'hover';
            }
            this.$el.find('[data-toggle=popover]').popover({
                trigger: 'manual',
                html: 'true',
                container: 'body',
                template: '<div class="popover customPopover" role="tooltip" style="max-width: 100%;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"><div class="data-content"></div></div></div>',
                placement: function(tip, element) { //$this is implicit
                    var position = $(element).position();
                    $('div.gistItem').blur();
                    if ((position.left > 515) && (position.top > 80)) {
                        return "left";
                    }
                    if ((position.left < 515) && (position.top > 80)) {
                        return "right";
                    }
                    if (position.top < 110) {
                        return "bottom";
                    }
                    return "top";
                }
            }).click(function(evt) {
                //evt.stopPropagation();
                if (CurrentPopover !== null && CurrentPopover[0] === $(this)[0]) {
                    $(this).popover('toggle');
                } else {
                    $('.customPopover').popover('hide');
                    $(this).popover('toggle');
                    CurrentPopover = $(this);
                }
            });
            if (this.collection.length === 0) {
                this.$el.find('.gistList')
                    .after('<div class="emptyGistList">No Records Found</div>');
            }
        },
    });
    return GistView;
});
