define([
    "require",
    "backbone",
    "underscore",
    "app/applets/lab_results_grid/modal/modalView",
    "app/applets/lab_results_grid/modal/errorView",
    "app/applets/lab_results_grid/modal/modalHeaderView"
], function(require, Backbone, _, ModalView, ErrorView, ModalHeaderViewUndef) {
    'use strict';

    var appletUiHelpers = {

		getDetailView: function(model, target, dataCollection, navHeader, onSuccess, onFail) {

            if (!model.get('pathology')) {
                // for non panel lab result row
                model.set('isNotAPanel', true);
                var view = new ModalView({
                    model: model,
                    target: target,
                    gridCollection: dataCollection,
                    isFromNonPanel: true
                });
                onSuccess(view, model, dataCollection, navHeader);

            } else {
                var resultDocs = model.get('results');

                if (resultDocs && resultDocs.length > 0 && resultDocs[0].resultUid) {
                    var uid = resultDocs[0].resultUid;
                    console.log(uid);
                    var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    var deferredDetailResponse = ADK.Messaging.getChannel("lab_results_grid").request('extDetailView', {
                        uid: uid,
                        patient: {
                            icn: currentPatient.attributes.icn,
                            pid: currentPatient.attributes.pid
                        },
                        suppressModal: false
                    });

                    deferredDetailResponse.done(function(detailData) {
                        onSuccess(detailData.view, model, dataCollection, navHeader);
                    });
                    deferredDetailResponse.fail(function(error) {
                        onFail(error);
                    });
                } else {
                    onFail("Lab has no link to a result document");
                }
            }
        },
        showModal: function(detailView, detailModel, dataCollection, navHeader) {
            var modalOptions = {
                'title': detailModel.get('typeName') + ' - ' + detailModel.get('specimen'),
                'size': 'large'
            };

            if (navHeader) {
                var ModalHeaderView = require('app/applets/lab_results_grid/modal/modalHeaderView');
                modalOptions.headerView = ModalHeaderView.extend({
                    model: detailModel,
                    theView: detailView,
                    dataCollection: dataCollection,
                    navHeader: navHeader
                });
            }

            ADK.showModal(detailView, modalOptions);
        },
        showErrorModal: function(errorMsg) {
            var modalOptions = {
                'title': "An Error Occurred",
                'size': 'large'
            };
            ADK.showModal(new ErrorView({
                model: new Backbone.Model({ error: errorMsg })
            }), modalOptions);
        }
    };
    return appletUiHelpers;
});
