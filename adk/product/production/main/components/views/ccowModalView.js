define([
    "backbone",
    "marionette",
    "jquery",
    "underscore",
    "main/ADK",
    "api/Messaging",
    "api/Navigation",
    "hbs!main/components/views/ccowFooterTemplate",
    'main/ScreensManifest'
], function(Backbone, Marionette, $, _, ADK, Messaging, Navigation, ccowFooterTemplate, ScreensManifest) {
    'use strict';

    var CCOWModalView = {
        activateModal: function(CCOWService, patient, bodyText){
            var modalOptions = {
                'title': 'Context Change',
                'footerView': this.getFooterView(CCOWService, patient),
                'headerView': this.getHeaderView(),
                'keyboard': false,
                'backdrop': 'static',
                'callShow': true
            };

            var modal = new ADK.UI.Modal({
                view: this.getModalView(bodyText),
                options: modalOptions
            });
            modal.show();

        },
        getFooterView: function(CCOWService, patient){
            var CCOWFooterView = Backbone.Marionette.ItemView.extend({
                template: ccowFooterTemplate,
                events: {
                    'click #cancelContextChangeBtn': 'cancelContextChange',
                    'click #breakContextBtn': 'breakContextLink',
                    'click #forceContextChangeBtn': 'forceContextChange'
                },
                cancelContextChange: function(){
                    CCOWService.cancelContextChange(function(){
                        ADK.UI.Modal.hide();
                    }, function(){
                        ADK.UI.Modal.hide();
                    });
                },
                breakContextLink: function(){
                    var callback = function(){
                        Messaging.trigger("patient:selected", patient);
                        Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen);
                    };

                    CCOWService.breakContextLink(callback, callback);
                },
                forceContextChange: function(){
                    var callback = function(){
                        Messaging.trigger("patient:selected", patient);
                        Navigation.navigate(ADK.ADKApp.userSelectedDefaultScreen);
                    };

                    CCOWService.forceContextChange(callback, callback);
                }
            });

            return CCOWFooterView;
        },
        getHeaderView: function(){
            var CCOWHeaderView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('<h4 class="modal-title" id="mainModalLabel">Context Change</h4>')
            });
            return CCOWHeaderView;
        },
        getModalView: function(bodyText){
            var ContextModalView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('<div id="ccowBodyText">{{bodyText}}</div>'),
                initialize: function(){
                    this.model = new Backbone.Model();
                    this.model.set('bodyText', bodyText);
                }
            });
            return new ContextModalView();
        }
    };

    return CCOWModalView;
});
