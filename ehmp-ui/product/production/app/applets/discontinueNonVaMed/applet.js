define([
    'handlebars',
    'hbs!app/applets/discontinueNonVaMed/assets/templates/discontinueTemplate',
    'hbs!app/applets/discontinueNonVaMed/assets/templates/discontinueFooterTemplate',
    'hbs!app/applets/discontinueNonVaMed/assets/templates/discontinueReasonTemplate'
], function(Handlebars,DiscontinueTemplate, DiscontinueFooterTemplate, DiscontinueReasonTemplate) {
    var ErrorListView = new ADK.Views.ServerSideError();
    var fetchMedication = function(uid, that) {
        var medUid = uid,
            orderUid = medUid.replace('med', 'order'),
            patientUid = medUid.replace('med', 'patient');

        patientUid = patientUid.split(':');
        patientUid[patientUid.length - 1] = patientUid[patientUid.length - 2];
        patientUid = patientUid.join(':');

        ADK.PatientRecordService.fetchCollection({
            'resourceTitle': 'order-detail',
            'criteria': {
                'dfn': patientUid.split(':')[5],
                'orderId': orderUid.split(':')[5]
            },
            'onSuccess': function(collection) {
                if (!that.isDestroyed) {
                    var model = collection.get(orderUid.split(':')[5]);
                    that.model.set({
                        'nature': model.get('Activity')['Nature of Order'].split('\\r\\n')[0],
                        'specialty': model.get('Current Data')['Treating Specialty'],
                        'instructions': model.get('Order').Instructions
                    });
                }
            }
        });
        ADK.PatientRecordService.fetchCollection({
            'resourceTitle': 'patient-record-patient',
            'criteria': {
                'uid': patientUid
            },
            'viewModel': {
                'idAttribute': 'uid'
            },
            'onSuccess': function(collection) {
                if (!that.isDestroyed) {
                    var patientModel = collection.get(patientUid);
                    that.model.set({
                        'patientRecord': patientModel,
                        'attending': patientModel.get('teamInfo').attendingProvider.name
                    });
                    that.render();
                }
            }
        });
        ADK.PatientRecordService.fetchCollection({
            'resourceTitle': 'patient-record-order',
            'criteria': {
                'uid': orderUid
            },
            'viewModel': {
                'idAttribute': 'uid'
            },
            'onSuccess': function(collection) {
                if (!that.isDestroyed) {
                    var orderModel = collection.get(orderUid),
                        signature;
                    if (typeof orderModel.get('clinicians') === 'undefined') {
                        signature = 'NOT REQUIRED';
                    } else {
                        signature = orderModel.get('clinicians')[0].name;
                    }
                    that.model.set({
                        'orderRecord': orderModel,
                        'orderedBy': orderModel.get('providerDisplayName'),
                        'comments': orderModel.get('summary').split('  ')[2],
                        'signature': signature
                    });
                    that.render();
                }
            }
        });

    };

    var ReasonsView = Backbone.Marionette.CollectionView.extend({
        'childView': Backbone.Marionette.ItemView.extend({
            'template': DiscontinueReasonTemplate
        }),
        'childViewOptions': function(model, index) {
            model.set({
                'index': index
            });
        }
    });

    var rootItemView = Backbone.Marionette.LayoutView.extend({
        'template': DiscontinueTemplate,
        'regions': {
            errorContainer: '#error-container',
            reasonsContainer: '#reasons-container'
        },
        'initialize': function() {
            var userSession = ADK.UserService.getUserSession(),
                duz = userSession.get('duz'),
                that = this,
                patientIen;

            if (typeof duz[0] === 'undefined') {
                patientIen = duz[userSession.get('site')];
            } else {
                patientIen = duz[0];
            }

            var reasonsCollection = ADK.ResourceService.fetchCollection({
                'resourceTitle': 'med-op-data-discontinuereason',
                'onSuccess': function(collection) {
                    if (!that.isDestroyed) {
                        that.render();
                    }
                }
            });

            this.model = new Backbone.Model({
                'medication': 'LOADING',
                'start': 'LOADING',
                'status': 'LOADING',
                'location': 'LOADING',
                'orderNo': 'LOADING',
                'attending': 'LOADING',
                'orderedBy': 'LOADING',
                'nature': 'LOADING',
                'signature': 'LOADING',
                'specialty': 'LOADING',
                'sig': 'LOADING',
                'instructions': 'LOADING',
                'comments': 'LOADING',
                'patientIen': patientIen,
                'reasonsCollection': reasonsCollection
            });
        },
        'events': {
            'click input[name="reason"]': 'updateReason'
        },
        'onRender': function() {
            if (ADK.UserService.hasPermission('remove-patient-med') && this.pidSiteCode === this.siteCode) {
                this.reasonsContainer.show(new ReasonsView({
                    'collection': this.model.get('reasonsCollection')
                }));
            }
        },
        'showModal': function(event, options) {
            var that = this;
            this.model.set('name', options.model.get('name').toUpperCase());

            var titleView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button><h4 class='modal-title'><span class='text-danger'>Discontinue</span> {{name}}</h4>")
            });

            fetchMedication(options.uid, this);

            ADK.PatientRecordService.fetchCollection({
                'resourceTitle': 'patient-record-med',
                'criteria': {
                    'uid': options.uid
                },
                'viewModel': {
                    'idAttribute': 'uid'
                },
                'onSuccess': function(collectionJson) {
                    var model = collectionJson.get(options.uid),
                        localSite = false;

                    that.siteCode = ADK.UserService.getUserSession().get('site');
                    that.pidSiteCode = that.model.get('patientRecord').get('pid') ? that.model.get('patientRecord').get('pid').split(';')[0] : '';
                    if (ADK.UserService.hasPermission('remove-patient-med') && that.pidSiteCode === that.siteCode) {
                        localSite = true;
                    }

                    var footerView = Backbone.Marionette.ItemView.extend({
                        'template': DiscontinueFooterTemplate,
                        'events': {
                            'click button.btn-danger': function() {
                                that.save();
                            }
                        },
                        model: new Backbone.Model({
                            'data': localSite
                        })
                    });

                    that.model.set({
                        'medRecord': model,
                        'medication': model.get('summary'),
                        'start': model.get('overallStart'),
                        'status': model.get('medStatusName'),
                        'sig': model.get('sig'),
                        'location': model.get('orders')[0].locationName,
                        'orderNo': model.get('uid').split(':').splice(-1)
                    });

                    var modalOptions = {
                        title: 'Discontinue',
                        headerView: titleView.extend({
                            model: that.model
                        }),
                        'footerView': footerView,
                        'callShow': true
                    };

                    ADK.showModal(that, modalOptions);
                }
            });
        },

        'updateReason': function(event) {
            this.model.set({
                'reason': event.currentTarget.value
            });
            $('#discontinueSubmit').attr('disabled', false);
        },
        'save': function(event) {
            var that = this,
                patientRecord = ADK.PatientRecordService.getCurrentPatient(),
                fetchOptions = {
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'isRemove': true,
                        'param': {
                            'orderien': this.model.get('orderNo'),
                            'ien': this.model.get('patientIen'),
                            'locien': this.model.get('orderRecord').get('locationUid').split(':').splice(-1),
                            'reason': this.model.get('reason'),
                            'localId': patientRecord.get('localId')
                        }
                    }),
                    success: function(resp) {
                        // Send updated model to meds medChangeChannel
                        var channel = ADK.Messaging.getChannel('medicationChannel');
                        var deferredResponse = channel.request('refresh');
                        var afterSync = function(response) {
                            // Wait for sync to complete, then update applet
                            var medicationCollectionHandler = response.medicationCollectionHandler;
                            medicationCollectionHandler.fetchAllMeds();
                            ADK.hideModal();
                        };
                        _.delay(deferredResponse.done, 6000, afterSync);
                    },
                    error: function(model, response) {
                        ErrorListView.addError(response.responseText);
                        that.errorContainer.show(ErrorListView);
                    }
                };
            $('#discontinueSubmit').attr('disabled', true);
            $('#discontinueSubmit').html('<i class="fa fa-spinner fa-spin"></i> ' + $('#discontinueSubmit').html());
            this.model.id = 'destroy';
            this.model.url = ADK.ResourceService.buildUrl('write-back-save-nonVA-med-discontinue', {
                pid: patientRecord.get('icn') || patientRecord.get('pid') || patientRecord.get('id')
            });
            this.model.save(null, fetchOptions);
        }
    });

    var applet = {
        'id': 'discontinueNonVaMed',
        'hasCSS': true,
        'getRootView': function() {
            return rootItemView;
        }
    };

    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('medicationChannel');
        channel.reply('discontinueNonVaModal', function() {
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
