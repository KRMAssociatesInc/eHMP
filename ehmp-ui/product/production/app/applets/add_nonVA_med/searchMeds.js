define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/add_nonVA_med/searchMedsResultTemplate',
    'hbs!app/applets/add_nonVA_med/searchMedsTemplate',
    'app/applets/add_nonVA_med/addMedication',
    'app/applets/add_nonVA_med/utils/searchUtil',
    'app/applets/add_nonVA_med/searchMedsEventHandler',
    'app/applets/add_nonVA_med/searchMedsScrollEventHandler',
    "app/applets/add_nonVA_med/addMedicationModalFooterView",
    "app/applets/add_nonVA_med/utils/util"
], function(Backbone, Marionette, _, SearchMedsResultTemplate, SearchMedsTemplate, AddMedication, SearchUtil, SearchEventHandler, ScrollEventHandler, addFooter, util) {
    'use strict';

    // Channel constants
    var ADD_NON_VA_MED = 'add-nonVA-med';

    var MedsModel = Backbone.Model.extend({});
    var MedsCollection = Backbone.Collection.extend();
    var scrollStart = false;
    var result = new MedsCollection();
    var viewInstance = Backbone.Model.extend({});
    var inMedModelInstance = Backbone.Model.extend({});
    var editView;

    var searchMedsModalOptions = {
        'title': 'Document Herbal/OTC/Non-VA Medications',
        'replaceContents': false,
        'regionName': 'searchDialog',
        'callShow': true
    };

    addFooter = addFooter.extend({
        goBack: function() {
            if (!util.isEdit()) {
                // Navigate to search
                showModal();
            } else {
                $('#btn-add-non-va-med-cancel').click();
            }
        }
    });

    var SearchMedsResultView = Backbone.Marionette.ItemView.extend({
        template: SearchMedsResultTemplate,
        tagName: 'li',
        events: {
            "click": "selectMed"
        },
        selectMed: function(evt) {
            evt.preventDefault();
            var currentPatient = ADK.PatientRecordService.getCurrentPatient(),
                destroy = false;
            if (viewInstance !== this.model) {
                viewInstance = this.model;
                destroy = true;
            }
            showAddNonVaMed(destroy);
        }
    });

    function showAddNonVaMed(destroy) {
        viewInstance.set({
            'IEN': viewInstance.get('internal')
        }, {
            silent: true
        });
        var view = new AddMedication(viewInstance, false);
        view.errorView = new ADK.Views.ServerSideError();
        var nameDesc = viewInstance.get('name') + ' ' + SearchUtil.escapeHtml(viewInstance.get('desc') || '');

        addFooter = addFooter.extend({
            templateHelpers: {
                isNew: function() {
                    return true;
                },
                isLocal: function() {
                    return true;
                }
            }
        });

        var options = {
            'title': nameDesc,
            'footerView': addFooter,
            'replaceContents': destroy,
            'regionName': 'addEditDialog',
            'callShow': true
        };

        var modal = new ADK.UI.Modal({
            view: view,
            options: options
        });
        modal.show();

        if ($('#locationDisplayName span').text() === "No visit set") {
            $('#btn-add-non-va-med-accept').prop('disabled', false);
        }
    }

    var SearchMedsResultsView = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'nav nav-stacked',
        attributes: {
            'id': 'meds-ul',
            'role': 'menu'
        },
        childView: SearchMedsResultView,
        initialize: function() {
            this.collection = new Backbone.Collection();
        }
    });

    var showModal = function() {
        var modal = new ADK.UI.Modal({
            view: new SearchView(),
            options: searchMedsModalOptions
        });
        modal.show();
    };

    var SearchView = Backbone.Marionette.LayoutView.extend({
        modalOptions: searchMedsModalOptions,
        template: SearchMedsTemplate,
        className: 'add-medication-styles',
        regions: {
            searchMedsResults: '#med-results-inner-container',
            medsSearchError: "#error-container"
        },
        initialize: function() {
            this.errorView = new ADK.Views.ServerSideError();
        },
        onRender: function() {
            this.medsSearchError.show(this.errorView);
            var medsView = new SearchMedsResultsView();
            this.medsView = medsView;
            this.searchMedsResults.show(medsView);

            SearchUtil.enableLoadingIndicator(true);
        },
        events: {
            'keyup #medsSearchInput': 'submitSearchMeds',
            'keydown input': function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                }
            }
        },

        submitSearchMeds: function(event) {
            if (event.keyCode !== 9) {
                SearchEventHandler.setView(this);
                SearchUtil.performActionWhileTyping(event, 'keyup', 2, 500, SearchEventHandler.medsEventHandler);
            }
        },
        handleChangeVisit: function(inMedModel) {
            var medModel = inMedModel.med;
            var med = inMedModel.med,
                medName = med.get("name"),
                ien = med.get("IEN"),
                view;
            medModel.set({
                name: medName,
                IEN: ien,
                savedMed: med
            });
            view = new AddMedication(medModel, false);
            view.errorView = new ADK.Views.ServerSideError();
            var nameDesc = medName + ' ' + SearchUtil.escapeHtml(med.get('desc'));
            var options = {
                'title': nameDesc,
                'footerView': addFooter,
                'replaceContents': false,
                'regionName': 'addEditDialog',
                'callShow': true
            };

            var modal = new ADK.UI.Modal({
                view: view,
                options: options
            });
            modal.show();
            if ($('#locationDisplayName span').text() !== "Not set" && $('#provider-name span').text() !== "Not set") {
                $('#btn-add-non-va-med-accept').prop('disabled', false);
            }
        },

        showModal: function() {
            var modal = new ADK.UI.Modal({
                view: this,
                options: searchMedsModalOptions
            });
            modal.show();
        },

        editMed: function(inMedModel) {
            var medName = inMedModel.get('qualifiedName');
            inMedModel.set({
                name: medName,
                IEN: 'Loading',
            });
            editView = new AddMedication(inMedModel, true);
            editView.errorView = new ADK.Views.ServerSideError();

            var pid = editView.attributes.pid;
            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = pid ? pid.split(';')[0] : '';

            addFooter = addFooter.extend({
                templateHelpers: {
                    isNew: function() {
                        return false;
                    },
                    isLocal: function() {
                        if (ADK.UserService.hasPermission('edit-patient-med') && pidSiteCode === siteCode) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            });

            var options = {
                'title': medName,
                'footerView': addFooter,
                'regionName': 'addEditDialog',
                'replaceContents': true
            };

            var modal = new ADK.UI.Modal({
                view: editView,
                options: options
            });
            modal.show();

            var fetchOptions = {
                patient: ADK.PatientRecordService.getCurrentPatient(),
                resourceTitle: "med-op-data-orderpresets",
                criteria: {},
                onError: function(model, resp) {
                    // opData.errorView.addError(resp.responseText);
                },
                onSuccess: function(model, resp) {
                    //console.log('onSuccess');
                    var med = model.models[0];
                    editView.updateData(med);
                }
            };
            fetchOptions.criteria.param = JSON.stringify({
                "orderien": inMedModel.get('orderUid')
            });
            ADK.PatientRecordService.fetchCollection(fetchOptions);
        },

    });

    return SearchView;
});