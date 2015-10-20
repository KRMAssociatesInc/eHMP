define([
    "jquery",
    "underscore",
    "backbone",
    "hbs!main/components/views/appletViews/pillsGistView/templates/pillGistLayout",
    "hbs!main/components/views/appletViews/pillsGistView/templates/pillGistChild",
    "hbs!main/components/views/appletViews/sharedTemplates/gistPopover",
    "api/ResourceService",
    "api/Messaging"


], function($, _, Backbone, pillGistLayoutTemplate, pillGistChildTemplate, popoverTemplate, ResourceService, Messaging) {
    'use strict';
    var PillGistItem = Backbone.Marionette.ItemView.extend({
        template: pillGistChildTemplate,
        className: 'gistItem',
        events: {
            'click button#closeGist': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.$('.sub-elements').hide();
            },
            'click button.groupItem': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
            },
            'hover div.gistItem': function(event) {
                this.$(event.target).blur();
            },
            'focus div.gistItem': function(event) {
                this.$('[data-toggle=popover]').keypress(function(e) {
                    if (e.which === 13 || e.which === 32) {
                        gistItem.trigger('click');
                    }
                });
            },
            'click div.gistItem': function(event) {
                this.$('[data-toggle=popover]').popover('hide');

                ADK.utils.infoButtonUtils.onClickFunc(this, event, baseClickGistItem);

                function baseClickGistItem(that, event) {
                        console.log(that.collection);
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        var currentPatient = ResourceService.patientRecordService.getCurrentPatient();
                        var channelObject = {
                            collection: that.collection,
                            model: that.model,
                            uid: that.model.get("uid"),
                            patient: {
                                icn: currentPatient.attributes.icn,
                                pid: currentPatient.attributes.pid
                            }
                        };
                        Messaging.getChannel(that.AppletID).trigger('getDetailView', channelObject);
                    }
            }

        },
        initialize: function(options) {
            this.AppletID = options.AppletID;
        },
        setPopover: function() {
            this.$('[data-toggle=popover]').popover({
                trigger: 'hover',
                html: 'true',
                container: 'body',
                template: popoverTemplate(this.model),
                placement: 'bottom',
            });
        },
        onRender: function() {
            this.setPopover();
        },
        onDestroy: function(){
            this.$('[data-toggle=popover]').popover('destroy');
        }
    });
    var PillGist = Backbone.Marionette.CompositeView.extend({
        template: pillGistLayoutTemplate,
        childView: PillGistItem,
        emptyView: Backbone.Marionette.ItemView.extend({
            template: _.template('<div class="emptyGistList">No Records Found</div>')
        }),
        initialize: function(options) {
            var appletID = getAppletId(options);
            this.childViewOptions = {
                AppletID: appletID,
                collection: options.collection
            };
            this.gistModel = options.gistModel;
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };

            this.collection = options.collection;

            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('appletID', appletID);
            this.childViewContainer = "#" + appletID + "-pill" + "-gist-items";
        },
        onBeforeRender: function() {
            this.collection.reset(this.collectionParser(this.collection).models);
            _.each(this.collection.models, function(item) {

                _.each(this.gistModel, function(object) {
                    var id = object.id;
                    item.set(object.id, item.get(object.field));
                });
            }, this);
        }
    });

    function getAppletId(options) {
        return options.appletConfig.id;
    }

    var PillGistView = {
        create: function(options) {
            var pillGistView = new PillGist(options);
            return pillGistView;
        },
        getView: function() {
            return PillGist;
        }
    };

    return PillGistView;
});