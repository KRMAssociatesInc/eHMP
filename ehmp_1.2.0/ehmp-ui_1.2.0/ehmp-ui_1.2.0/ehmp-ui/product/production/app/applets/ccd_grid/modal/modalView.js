define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/ccd_grid/util',
    'hbs!app/applets/ccd_grid/modal/modalTemplate',
    'app/applets/ccd_grid/modal/modalHeaderView'
], function(Backbone, Marionette, _, Util, modalTemplate, modalHeader) {
    'use strict';

    var modelUids = [],
        dataCollection;

    var viewParseModel = {
        parse: function(response) {
            if (response.kind == "C32 Document") {
                if (response.name) {
                    response.localTitle = response.name;
                }
                if (response.creationTime) {
                    response.referenceDateTime = response.creationTime;
                } else if (response.dateTime) {
                    response.referenceDateTime = response.dateTime;
                }
                response.referenceDateDisplay = ADK.utils.formatDate(response.referenceDateTime);
                if (response.referenceDateDisplay === '') {
                    response.referenceDateDisplay = 'N/A';
                }

                response.referenceDateTimeDisplay = ADK.utils.formatDate(response.referenceDateTime, 'MM/DD/YYYY - HH:mm');
                if (response.referenceDateTimeDisplay === '') {
                    response.referenceDateTimeDisplay = 'N/A';
                }

                if (response.authorList) {
                    if (response.authorList.length > 0) {
                        if (response.authorList[0].institution) {
                            response.authorDisplayName = response.authorList[0].institution;
                        }
                    } else {
                        response.authorDisplayName = "N/A";
                    }
                }
                response.facilityName = "VLER";
            }
            return response;
        }
    };

    var ModalView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        initialize: function(options) {
            this.model = options.model;

            this.collection = options.collection;
            dataCollection = options.collection;


            this.getModelUids();


            if(options.initCount === 0) {
                options.initCount++;
                var next = _.indexOf(modelUids, this.model.get('uid'));
                var modelUid = modelUids[next];




                var modalFetchOptions = {
                    resourceTitle: 'patient-record-vlerdocument',
                    pageable: true,
                    viewModel: viewParseModel,
                    cache: true,
                    criteria: {
                        callType : 'vler_modal',
                        vler_uid : modelUid
                    }
                };
                modalFetchOptions.onSuccess = function() {
                    var modalModel = _.find(modalCollection.models, function(model) {
                        return model.get('uid') === modelUid; 
                    });

                    //model = modalModel;
                    //this.setNextPrevModal(modalModel);

                    var view = new ModalView({
                        model: modalModel,
                        //target: event.currentTarget,
                        collection: dataCollection
                    });

                    var modalOptions = {
                        'title': Util.getModalTitle(modalModel),
                        'size': 'xlarge',
                        'headerView': modalHeader.extend({
                            model: modalModel,
                            theView: view
                        })
                    };

                    ADK.showModal(view, modalOptions);

                    //ADK.showModal(modalModel, modalOptions);
                };

                var modalCollection = ADK.PatientRecordService.fetchCollection(modalFetchOptions);
            }


            var sections = this.model.get('sections');
            _.each(sections, function(section) {
                section.text = section.text.replace(/\s+/g, ' ');
            });
            this.model.set('sections', sections);
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            this.model.set('fullName', currentPatient.get('fullName'));
            this.model.set('birthDate', currentPatient.get('birthDate'));
            this.model.set('genderName', currentPatient.get('genderName'));
            this.model.set('ssn', currentPatient.get('ssn'));

        },
        events: {
            'click .ccdNext': 'getNextModal',
            'click .ccdPrev': 'getPrevModal'
        },
        getNextModal: function(e) {
            var next = _.indexOf(modelUids, this.model.get('uid')) + 1;
            if (next >= modelUids.length) {
                // if (dataCollection.hasNextPage()) {
                //     dataCollection.getNextPage();
                // } else {
                //     dataCollection.getFirstPage();
                // }

                this.getModelUids();
                next = 0;
            }
            var modelUid = modelUids[next];

            var modalFetchOptions = {
                resourceTitle: 'patient-record-vlerdocument',
                pageable: true,
                viewModel: viewParseModel,
                cache: true,
                criteria: {
                    callType : 'vler_modal',
                    vler_uid : modelUid
                }
            };
            modalFetchOptions.onSuccess = function() {
                var modalModel = _.find(modalCollection.models, function(model) {
                    return model.get('uid') === modelUid; 
                });

                var view = new ModalView({
                    model: modalModel,
                    //target: event.currentTarget,
                    collection: dataCollection
                });

                var modalOptions = {
                    'title': Util.getModalTitle(modalModel),
                    'size': 'xlarge',
                    'headerView': modalHeader.extend({
                        model: modalModel,
                        theView: view
                    })
                };

                ADK.showModal(view, modalOptions);
            };

            var modalCollection = ADK.PatientRecordService.fetchCollection(modalFetchOptions);

        },
        getPrevModal: function(e) {
            var next = _.indexOf(modelUids, this.model.get('uid')) - 1;

            //var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {
                // if (dataCollection.hasPreviousPage()) {
                //     dataCollection.getPreviousPage();
                // } else {
                //     dataCollection.getLastPage();
                // }

                this.getModelUids();
                next = modelUids.length - 1;
            }
            var modelUid = modelUids[next];




            var modalFetchOptions = {
                resourceTitle: 'patient-record-vlerdocument',
                pageable: true,
                viewModel: viewParseModel,
                cache: true,
                criteria: {
                    callType : 'vler_modal',
                    vler_uid : modelUid
                }
            };
            modalFetchOptions.onSuccess = function() {
                var modalModel = _.find(modalCollection.models, function(model) {
                    return model.get('uid') === modelUid; 
                });

                var view = new ModalView({
                    model: modalModel,
                    //target: event.currentTarget,
                    collection: dataCollection
                });

                var modalOptions = {
                    'title': Util.getModalTitle(modalModel),
                    'size': 'xlarge',
                    'headerView': modalHeader.extend({
                        model: modalModel,
                        theView: view
                    })
                };

                ADK.showModal(view, modalOptions);
            };

            var modalCollection = ADK.PatientRecordService.fetchCollection(modalFetchOptions);

        },
        getModelUids: function() {
            modelUids = [];
            _.each(dataCollection.models, function(m, key) {

                if (m.get('vlerdocument')) {
                    var outterIndex = dataCollection.indexOf(m);
                    // console.log('>>>>>outterIndex', outterIndex);
                    _.each(m.get('vlerdocument').models, function(m2, key) {
                        m2.set({
                            'inAPanel': true,
                            'parentIndex': outterIndex,
                            'parentModel': m
                        });
                        modelUids.push(m2.get('uid'));

                    });
                } else {
                    modelUids.push(m.get('uid'));
                }

            });
        },
        setNextPrevModal: function(model) {

            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }

            var view = new ModalView({
                model: model,
                //target: event.currentTarget,
                collection: dataCollection
            });

            var modalOptions = {
                'title': Util.getModalTitle(model),
                'size': 'xlarge',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                })
            };

            ADK.showModal(view, modalOptions);
        },
    });

    return ModalView;
});

