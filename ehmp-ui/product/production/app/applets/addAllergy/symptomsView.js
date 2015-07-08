define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/addAllergy/templates/symptomsViewTemplate",
    "app/applets/addAllergy/utils/symptomsUtil",
    "app/applets/addAllergy/addAllergyGlobals",
    "app/applets/addAllergy/models/symptomsCollection"
], function(Backbone, Marionette, _, SymptomsViewTemplate, SymptomsUtil, AddAllergyGlobals, SymptomsCollection) {
    var fetchOptions = {
        patient: ADK.PatientRecordService.getCurrentPatient(),
        resourceTitle: "allergy-op-data-symptoms",
        criteria: {
            'dir': '1',
            'from': ''
        }
    };

    var symptomsItemView = Backbone.Marionette.ItemView.extend({
        template: SymptomsViewTemplate,
        tagName: 'li',
        className: '',
        attributes: function() {
            return {
                'id': 'symptom' + this.model.get('count') + '-' + this.model.get('IEN'),
                'style': 'cursor:pointer'
            };
        },
        events: {
            'click': 'triggerSelectedSymptom',
            'keydown': 'triggerSelectedSymptomKeyDown',
        },
        triggerSelectedSymptom: function(event) {
            event.preventDefault();
            AddAllergyGlobals.addAllergyApplication.vent.trigger(AddAllergyGlobals.events.ADD_SYMPTOMS, this.model);
            this.remove();
        },
        triggerSelectedSymptomKeyDown: function(event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                //enter key
                event.preventDefault();
                var focusIndex = $($(':focus').parent(), $('#symptoms-ul')).index();
                var children = $('#symptoms-ul').children().eq(focusIndex + 1).children();

                _.defer(function() {
                    if (children.length === 0) {
                        $('#symptoms-selected-tbl > tbody').find('input')[0].focus();
                    } else {
                        children.eq(0).focus();
                    }
                });

                this.triggerSelectedSymptom(event);
            } else if (event.keyCode === 9 || event.keyCode === 39) {
                //tab and right arrow
                event.preventDefault();

                if (event.shiftKey) {
                    $('#symptomSearchInput').focus();
                } else {
                    if (SymptomsUtil.isSelectedSymptomsEmpty()) {
                        $('#comments').focus();
                    } else {
                        $('#symptoms-selected-tbl > tbody').find('input')[0].focus();
                    }
                }
            }
        }
    });

    var symptomsCollectionView = Backbone.Marionette.CollectionView.extend({
        initialize: function() {
            var self = this;
            this.collection = new SymptomsCollection();
            this.collection.comparator = function(model) {
                return model.get('name');
            };

            AddAllergyGlobals.addAllergyApplication.vent.on(AddAllergyGlobals.events.ADD_SYMPTOMS, function(model) {
                self.collection.remove(model);
            });

            AddAllergyGlobals.addAllergyApplication.vent.on(AddAllergyGlobals.events.REMOVE_SYMPTOMS, function(model) {
                self.collection.add(model);
                self.collection.sort();

                _.defer(function() {
                    if (model.get('focusElement').selector.indexOf('#symptoms-ul') > -1) {
                        $('#symptom' + model.get('count') + '-' + model.get('IEN') + ' > a').focus();
                    } else {
                        $(model.get('focusElement')).find('.xbutton')[0].focus();
                    }
                });
            });
        },
        childView: symptomsItemView,
        tagName: 'ul',
        className: 'nav nav-pills nav-stacked',
        attributes: {
            'id': 'symptoms-ul',
            'role': 'menu'
        }
    });

    return symptomsCollectionView;
});
