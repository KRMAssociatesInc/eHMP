define([
    'underscore',
    'handlebars',
    'hbs!app/applets/allergyEiE/assets/templates/allergyEiETemplate',
    'hbs!app/applets/allergyEiE/assets/templates/allergyEiEFooterTemplate'
], function(_, Handlebars, allergyEiETemplate, allergyEiEFooterTemplate) {
    var eieFooterView = Backbone.Marionette.ItemView.extend({
        template: allergyEiEFooterTemplate,
        events: {
            'click #submit': 'save'
        },
        save: function() {
            this.bodyView.save();
        }
    });
    var applet = {
        id: 'allergyEiE',
        getRootView: function() {
            return Backbone.Marionette.ItemView.extend({
                template: allergyEiETemplate,
                initialize: function() {
                    this.model = new Backbone.Model({});
                },
                events: {
                    'click #submit': 'save',
                    'change #comments': 'update'
                },
                update: function(event) {
                    this.model.set({
                        'comments': $(event.currentTarget).val()
                    });
                },
                save: function(event) {
                    var self = this,
                        patientRecord = ADK.PatientRecordService.getCurrentPatient(),
                        fetchOptions = {
                            data: JSON.stringify({
                                'isRemove' : true,
                                'uid': this.model.get('uid'),
                                'comments': this.model.get('comments')
                            }),
                            contentType: 'application/json',
                            error: function(model, resp) {
                                //add server side error container and call here
                                //ADK.hideModal();
                                var a = 'dummy';
                                //} else {
                                console.log(resp, 'FAIL');
                                //}
                            },
                            success: function(model, resp) {
                                ADK.hideModal();
                                setTimeout(function() {
                                    self.model.get('gridView').refresh({});
                                }, 2000);
                            }
                        };

                    this.model.id = 'destroy';
                    this.model.url = ADK.ResourceService.buildUrl('write-back-allergy-error-save', {
                        pid: patientRecord.get('icn') || patientRecord.get('pid') || patientRecord.get('id')
                    });
                    this.model.save(null, fetchOptions);
                },
                showModal: function(event, options) {
                    this.model.set(options);
                    var footerView = eieFooterView.extend({
                        bodyView: this,
                    });
                    var titleView = Backbone.Marionette.ItemView.extend({
                        template: Handlebars.compile("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button><h4 class='modal-title'>Mark Adverse Reaction to <strong> {{allergen}} </strong> as Entered in Error</h4>"),
                        initialize: function(){
                            this.model.set('allergen', this.model.get('allergen').toUpperCase());
                        }
                    });
                    var modalOptions = {
                        title : 'Mark Adverse Reaction',
                        headerView : titleView.extend({
                            model: this.model
                        }),
                        'footerView': footerView
                    };
                    ADK.showModal(this, modalOptions);
                }
            });
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('allergyEiERequestChannel');
        channel.reply('allergyEiEModal', function() {
            var view = applet.getRootView();
            var response = $.Deferred();
            response.resolve({
                view: new view(),
            });

            return response.promise();
        });
    })();

    return applet;
});
