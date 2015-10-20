define([
    'backbone',
    'marionette',
    'async',
    'app/applets/documents/docUtils',
    'app/applets/documents/modal/unknownDocumentModalView',
    'app/applets/documents/detail/simple/docDetailView',
    'app/applets/documents/detail/complex/complexDetailView',
    'app/applets/documents/detail/dodComplexNoteUtil',
    'app/applets/documents/debugFlag',
    'app/applets/documents/appletHelper'
], function(Backbone, Marionette, Async, docUtils, UnknownDocumentModalView, DocDetailView, ComplexDetailView, DodComplexNoteUtil, DebugFlag, AppletHelper) {
    'use strict';

    var DEBUG = DebugFlag.flag;

    function getDodComplexNotes(models, parentCallback) {

        Async.forEach(models, function makeRequest(model, callback) {

            var complexNoteUri = model.get('dodComplexNoteUri');
            if (complexNoteUri !== undefined && complexNoteUri !== null && !model.get('dodComplexNoteContent')) {
                if (DEBUG) console.log("Fetching DoD Complex Note...");

                var complexNoteFetchOptions = {
                    resourceTitle: 'patient-record-complexnote',
                    criteria: {
                        uid: model.get('uid')
                    },
                    viewModel: {
                        parse: DodComplexNoteUtil.parseModel
                    },
                    onSuccess: function(response) {
                        // Store complex note content in model
                        if (response.models.length > 0) {
                            model.set('dodComplexNoteContent', response.models[0].get('complexNote'));
                        }
                        if (DEBUG) console.log("Success fetching DoD Complex Note content");
                        callback();
                    },
                    onError: function(model, response) {
                        var errorMsg = "Error fetching DoD Complex Note";
                        if (DEBUG) console.log(errorMsg);
                        callback(errorMsg);
                    }
                };
                ADK.PatientRecordService.fetchCollection(complexNoteFetchOptions);
            } else {
                if (DEBUG) console.log("Already have DoD Complex Note, not re-fetching");
                callback();
            }
        }, function onComplete(error) {
            parentCallback(error, models);
        });
    }

    function doGetView(model, docType, resultDocCollection, childDocCollection, callback) {

        var dt = docType.toLowerCase();

        if (dt === 'surgery report' || dt === 'discharge summary') {
            // request external view (asyncronous)
            var deferredResponse = DocDetailsDisplayer.getExternalView(model, docType, resultDocCollection);
            deferredResponse.done(function(results) {
                callback(null, results);
            });
            deferredResponse.fail(function(error) {
                callback(error);
            });

        } else {
            // build internal view (syncronous)
            var view;
            if (AppletHelper.hasChildDocs(model)) {
                view = new ComplexDetailView({
                    resultDocCollection: resultDocCollection,
                    childDocCollection: childDocCollection,
                    model: model
                });
            } else if (docType.toLowerCase() === 'advance directive') {
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === 'administrative note') {
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === 'consult') {
                view = new ComplexDetailView({
                    resultDocCollection: resultDocCollection,
                    model: model
                });
            } else if (docType.toLowerCase() === "crisis note") {
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === "laboratory report") { //this might have a better template by another team. Feel free to replace this
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === 'procedure') {
                view = new ComplexDetailView({
                    resultDocCollection: resultDocCollection,
                    model: model
                });
            } else if (docType.toLowerCase() === "progress note") {
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === "radiology") {
                view = new DocDetailView({
                    model: model
                });
            } else if (docType.toLowerCase() === "imaging") { //||(docType === "Radiology"))
                view = new ComplexDetailView({
                    resultDocCollection: resultDocCollection,
                    model: model
                });
            } else if (docType.toLowerCase() === 'surgery') {
                view = new ComplexDetailView({
                    resultDocCollection: resultDocCollection,
                    model: model
                });
            } else if (docType.toLowerCase() === 'clinical procedure') {
                view = new DocDetailView({
                    model: model
                });
            } else {
                view = new DocDetailView({
                    model: model
                });
            }

            // call the callback with the view we just built
            callback(null, {
                view: view,
                title: DocDetailsDisplayer.getTitle(model, docType)
            });
        }
    }

    function doGetTitle(callback) {
        var title = DocDetailsDisplayer.getTitle(model, docType);
        callback(null, title);
    }

    var DocDetailsDisplayer = {

        getDocType: function(model) {
            return model.get('kind');
        },

        getDocId: function(model) {
            return model.get('uid');
        },

        getTitle: function(model, docType) {
            switch (docType.toLowerCase()) {

                // external detail view
                case 'clinical procedure':
                    return 'Clinical Procedure Details';
                case 'discharge summary':
                    return 'Discharge Summary Details';
                case 'surgery report':
                    return 'Surgery Report Details';

                // internal detail view
                case 'advance directive':
                case 'administrative note':
                case 'crisis note':
                case 'laboratory report':
                case 'progress note':
                case 'radiology':
                case 'consult':
                case 'procedure':
                case 'imaging':
                case 'surgery':
                    return model.get('displayTitle') + ' Details';
                default: //for the default case try to use the simple docDetailView
                    return model.get('displayTitle') + ' Details';
            }
        },

        getExternalView: function(model, docType, collection) {
            // request external detail view from screen controller
            var extDetailChannel = ADK.Messaging.getChannel('documents');
            var deferredResponse = extDetailChannel.request('extDetailView', {
                model: model,
                kind: docType,
                uid: model.get('uid')
            });

            return deferredResponse;
        },

        getView: function(model, docType, resultDocCollection, childDocCollection) {

            var deferredResponse = $.Deferred(),
                complexNoteModels = [];

            if (resultDocCollection && resultDocCollection.length > 0) {
                complexNoteModels = resultDocCollection.models;
            } else if (model.get('dodComplexNoteUri')) {
                complexNoteModels = [model];
            }

            Async.series([

                // Fetch complex note content and store in model
                getDodComplexNotes.bind(null, complexNoteModels),

                // Get the detail view
                doGetView.bind(null, model, docType, resultDocCollection, childDocCollection)

            ], function onComplete(error, results) {
                if (error) {
                    deferredResponse.reject(error);
                } else {
                    deferredResponse.resolve(results[1]);
                }
            });

            return deferredResponse.promise();
        }
    };
    return DocDetailsDisplayer;
});
