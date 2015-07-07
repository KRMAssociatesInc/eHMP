define([
    "backbone",
    "marionette",
    "underscore",
    "moment",
    "hbs!app/applets/addAllergy/templates/symptomsSelectedViewTemplate",
    "app/applets/addAllergy/utils/symptomsUtil",
    "app/applets/addAllergy/utils/allergiesUtil",
    "app/applets/addAllergy/addAllergyGlobals",
    "app/applets/addAllergy/utils/modelBindingUtil",
    "app/applets/addAllergy/models/symptomsModel"
], function(Backbone, Marionette, _, Moment, SymptomsSelectedViewTemplate, SymptomsUtil, AllergiesUtil, AddAllergyGlobals, ModelBindingUtil, SymptomsModel) {
    var symptomsSelectedItemView = Backbone.Marionette.ItemView.extend(ModelBindingUtil).extend({
        template: SymptomsSelectedViewTemplate,
        tagName: 'tr',
        className: '',
        model: SymptomsModel,
        initialize: function() {
            this.initializeBinding();
            this.model.on('change', function() {
                var disable = !(this.model.get('symptomDate')),
                    elem = this.$('.timepicker input');
                if (disable) {
                    elem.val('').change();
                }
                elem.prop('disabled', disable);
            }, this);
        },
        attributes: function() {
            return {
                'id': 'symptom' + '^' + this.model.get('IEN') + '^' + this.model.get('name'),
            };
        },
        onRender: function() {
            var toEnd = new Date();
            /*
            <div id='obs-date-gp-{{count}}-{{IEN}}'>
                    <div class="input-group date">
                      <input id="dp-{{count}}-{{IEN}}" type="text" autocomplete="off" class="form-control input-sm text-sm datepicker" data-provide="datepicker" data-date-end-date="0d"><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
                    </div>
                </div>
            */
            var dp_id = 'dp' + '-' + this.model.get('count') + '-' + this.model.get('IEN');
            var dpicker = this.$('#' + dp_id);

            ADK.utils.dateUtils.datepicker(dpicker, {
                'endDate': new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
            });
            dpicker.parent().find('.glyphicon-calendar').on('click', function() {
                dpicker.datepicker('show');
            });
            /*
             <div class="input-append input-group bootstrap-timepicker timepicker">
                    <input id="tp-{{count}}-{{IEN}}" type="text" autocomplete="off" class="form-control input-sm text-sm" data-inputmask-regex="([0][1-9]|[1][0-2]):([0-5]\d) (a|p)" placeholder="HH:MM a/p" max-length="10">
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-time"></span>
                    </span>
                </div>
            */

            var tp_id = 'tp' + '-' + this.model.get('count') + '-' + this.model.get('IEN');
            var tpicker = this.$('#' + tp_id);

            tpicker.inputmask("Regex", {
                'placeholder': 'hh:mm a/p',
                'clearIncomplete': true,
                'onincomplete': function(e) { //Required to ensure model is sync'd to field
                    $(this).val('').trigger('change');
                }
            });
        },
        modelEvents: {
            'change:symptomDate': 'setDateTime',
            'change:symptomTime': 'setDateTime'
        },
        events: {
            'click .xbutton': 'removeSymptom',
            'keydown .xbutton': 'removeSymptomKeyEvent',
            'keyup .date > input': 'datepickerKeyDownEvent',
            "focus .date > input": "datepickerFocusEvent",
            'change .date > input': function() {
                this.model.set({
                    'symptomDate': this.$el.find("#dp-" + this.model.get("count") + "-" + this.model.get("IEN")).val()
                });
            },
            'change .timepicker': function() {
                this.model.set({
                    'symptomTime': this.$el.find("#tp-" + this.model.get("count") + "-" + this.model.get("IEN")).val()
                });
            }
        },
        setDateTime: function(event) {
            var time = this.model.get("symptomTime"),
                date = this.model.get("symptomDate"),
                dateTime = '';
            if (time) {
                dateTime = ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateTimeFromDateTimeStrings(date, time);
            } else {
                dateTime = ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateFromDateString(date);
            }
            if (dateTime === 'Invalid date') dateTime = '';
            this.model.set('dateTime', dateTime);
        },
        removeSymptom: function(event) {
            var focusedTrElement = $(':focus').parent().parent().parent().parent().parent().parent();
            var firstElementOfTbody = $('#symptoms-selected-tbl > tbody').children().eq(0);
            var modelElementId = 'symptom' + '^' + this.model.get('IEN') + '^' + this.model.get('name');
            var focusElementIndex = $(focusedTrElement, $('#symptoms-selected-tbl > tbody')).index();
            var focusElement;

            if ($('#symptoms-selected-tbl > tbody').children().length === 1) {
                focusElement = $('#symptoms-ul:first > li:first > a');
            } else if ($('#symptoms-selected-tbl > tbody').children().length > 1 && modelElementId === firstElementOfTbody.attr('id')) {
                focusElement = $('#symptoms-selected-tbl > tbody');
            } else {
                focusElement = $('#symptoms-selected-tbl > tbody').children().eq(focusElementIndex - 1);
            }

            this.model.set('focusElement', focusElement);
            AddAllergyGlobals.addAllergyApplication.vent.trigger(AddAllergyGlobals.events.REMOVE_SYMPTOMS, this.model);
            this.remove();
            return false;
        },
        removeSymptomKeyEvent: function(event) {
            if (event.keyCode === 13 || event.keyCode === 32) {
                event.preventDefault();
                this.removeSymptom();
            }
        },
        datepickerKeyDownEvent: function(event) {
            var firstElementOfTbody = $('#symptoms-selected-tbl > tbody').children().eq(0);
            var modelElementId = 'symptom' + '^' + this.model.get('IEN') + '^' + this.model.get('name');

            if (event.keyCode === 9 && event.shiftKey && modelElementId === firstElementOfTbody.attr('id')) {
                event.preventDefault();
                if (SymptomsUtil.isSymptomsListEmpty()) {
                    $('#symptomSearchInput').focus();
                } else {
                    $('#symptoms-ul:first > li:first > a').focus();
                    $('#symptomsList').scrollTop(0);
                }
            }
        },
        datepickerFocusEvent: function(evt) {
            $(".errorMessage").remove();
            $(evt.target).val(AllergiesUtil.currentObservedDateString());
        },
    });

    var symptomsSelectedCollectionView = Backbone.Marionette.CollectionView.extend({
        initialize: function() {
            var self = this;
            AddAllergyGlobals.addAllergyApplication.vent.on(AddAllergyGlobals.events.ADD_SYMPTOMS, function(model) {
                self.collection.add(new SymptomsModel(model.attributes));
            });

            AddAllergyGlobals.addAllergyApplication.vent.on(AddAllergyGlobals.events.REMOVE_SYMPTOMS, function(model) {
                self.collection.remove(model);
            });
        },
        childView: symptomsSelectedItemView,
        tagName: 'table',
        className: 'table table-condensed table-striped table-hover',
        id: 'symptoms-selected-tbl',
        attributes: {
            'width': '250'
        },
    });

    return symptomsSelectedCollectionView;
});
