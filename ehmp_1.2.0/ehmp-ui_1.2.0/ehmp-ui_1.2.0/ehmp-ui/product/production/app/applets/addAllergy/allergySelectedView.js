define([
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'moment',
    'hbs!app/applets/addAllergy/templates/allergySelectedGridTemplate',
    'hbs!app/applets/addAllergy/templates/allergySelectedFooter',
    'app/applets/addAllergy/symptomsView',
    'app/applets/addAllergy/symptomsSelectedView',
    'app/applets/addAllergy/symptomsScrollEventHandler',
    'app/applets/addAllergy/symptomsSearchEventHandler',
    'app/applets/addAllergy/utils/allergiesUtil',
    'app/applets/addAllergy/utils/symptomsUtil',
    'app/applets/addAllergy/utils/modelBindingUtil',
    'app/applets/addAllergy/models/allergenModel'
], function(Backbone, Marionette, _, Handlebars, Moment, modalTemplate, footerTemplate, SymptomsView, SymptomsSelectedView, SymptomsScrollEventHandler, SymptomsSearchEventHandler, AllergiesUtil, SymptomsUtil, ModelBindingUtil, AllergenModel) {
    'use strict';

    var FooterView = Backbone.Marionette.ItemView.extend(ModelBindingUtil).extend({
        template: footerTemplate,
        className: 'add-allergy-styles',
        events: {
            'click #add-allergy': 'addAllergy',
            'click #btn-add-allergy-back': 'navToSearch'
        }
    });

    var AllergySelectedView = Backbone.Marionette.LayoutView.extend(ModelBindingUtil).extend({
        template: modalTemplate,
        className: 'add-allergy-styles',
        initialize: function() {
            this.model = new AllergenModel();
            //clear it out in case it held items and we've navigated away
            this.model.get('param').symptoms.reset();

            this.errorView = new ADK.Views.ServerSideError();
            this.loadingIndicatorView = ADK.Views.Loading.create();
            this.symptomsView = new SymptomsView();
            this.symptomsSelectedView = new SymptomsSelectedView({
                collection: this.model.get('param').symptoms
            });
            SymptomsScrollEventHandler.setView(this);
            SymptomsSearchEventHandler.setView(this);
            this.initializeBinding();

            this.model.on('change', function() {
                var elem = this.$('#obs-time'),
                    disable = !(this.model.get('obs-date'));
                $('#add-allergy').prop('disabled', !(this.model.isValid() && this.model.get('param').symptoms.isValid()));
                if (disable) {
                    elem.val('').change();
                }
                elem.prop('disabled', disable);
            }, this);
        },
        regions: {
            symptomsInnerList: '#symptoms-inner-list',
            symptomsSelectedList: '#symptoms-selected',
            symptomsLoadingIndicator: '#symptomsLoadingIndicator',
            errorContainer: '#error-container'
        },
        onRender: function() {
            this.loadSymptoms();
            this.$el.find('#symptomSearchInput').val('');
            var self = this,
                obsDate,
                obsTime;

            obsDate = this.$("#obs-date");
            obsTime = this.$("#obs-time");

            ADK.utils.dateUtils.datepicker(obsDate, {
                'endDate': new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
            });

            obsDate.parent().find('.glyphicon-calendar').on('click', function() {
                obsDate.datepicker('show');
            });

            obsTime.inputmask('Regex', {
                'placeholder': 'hh:mm a/p',
                'clearIncomplete': true,
                'onincomplete': function(e) { //Required to ensure model is sync'd to field
                    $(this).val('').trigger('change');
                }
            });

            this.errorContainer.show(this.errorView);
        },
        loadSymptoms: function() {
            this.symptomsInnerList.show(this.symptomsView);
            this.symptomsSelectedList.show(this.symptomsSelectedView);
            this.symptomsLoadingIndicator.show(this.loadingIndicatorView);
            this.$el.find('#symptomsList').on('scroll', SymptomsScrollEventHandler.symptomsEventHandler);
        },
        modelEvents: { //translations
            'change:name': 'setAllergyName',
            'change:IEN': 'setAllergyName',
            'change:location': 'setAllergyName',
            'change:obs-date': 'setObsTime',
            'change:obs-time': 'setObsTime',
            'change:nature': function() {
                var nature = (this.model.get('nature')) ? this.model.get('nature').split('^') : '';
                this.model.get('param').natureOfReaction = (nature.length > 1) ? nature[1] : '';
            },
            'change:historicalOrObserved': function() {
                this.model.get('param').historicalOrObserved = this.model.get('historicalOrObserved') || '';
            },
            'change:comments': function() {
                this.model.get('param').cmtText = this.model.get('comments') || '';
            },
            'change:severity': function() {
                this.setSeverity();
                this.model.get('param').severity = this.model.get('severity') || '';
            }
        },
        events: {
            'keyup #comments': 'navigateToSymptomsFromComments',
            'keydown #symptomSearchInput': 'navigateToSymptomsFromSearch',
            'keyup #symptomSearchInput': 'submitSearchSymptoms',
            'click button[data-dismiss="modal"]': 'clearErrors',
            'click #add-allergy': function(e) {
                this.addAllergy(e);
                this.clearErrors(e);
            },
            'click #btn-severe': function() {
                this.model.set({
                    'severity': '3'
                }, {
                    validate: true
                });
            },
            'click #btn-moderate': function() {
                this.model.set({
                    'severity': '2'
                }, {
                    validate: true
                });
            },
            'click #btn-mild': function() {
                this.model.set({
                    'severity': '1'
                }, {
                    validate: true
                });
            },
            'click #btn-observer': function() {
                this.showObserver();
                this.model.set({
                    'historicalOrObserved': $('#btn-observer').attr('data-value')
                }, {
                    validate: true
                });
            },
            'click #btn-historical': function() {
                this.hideObserver();
                this.model.set({
                    'historicalOrObserved': $('#btn-historical').attr('data-value')
                }, {
                    validate: true
                });
            },
        },
        clearErrors: function() {
            this.errorView.clearErrors();
        },
        showError: function(resp) {
            this.errorView.addError(resp.responseText, 'Save Failed');
        },
        setAllergyName: function() {
            if (this.model.get('name') && this.model.get('IEN') && this.model.get('location')) {
                this.model.get('param').allergyName = this.model.get('name') + '^' + this.model.get('IEN') + ';' + this.model.get('location').split('"')[0];
            }
        },
        setObsTime: function() {
            var obsDate = this.model.get('obs-date'),
                obsTime = this.model.get('obs-time'),
                observedTimestamp;
            if (obsDate) {
                if (obsTime) {
                    observedTimestamp = ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateTimeFromDateTimeStrings(obsDate, obsTime);
                } else {
                    observedTimestamp = ADK.utils.dateUtils.getRdkDateTimeFormatter().getDateFromDateString(obsDate);
                }
            }
            this.model.get('param').observedDate = observedTimestamp || '';
        },
        setAllergen: function(allergen) {
            _.each(allergen.attributes, function(value, key) {
                this.model.set(key, value);
            }, this);
        },
        addAllergy: function() {
            this.clearErrors();
            $('#add-allergy').prop('disabled', true);

            this.model.get('param').eventDateTime = ADK.utils.dateUtils.getRdkDateTimeFormatter().getCurrentDate() + ADK.utils.dateUtils.getRdkDateTimeFormatter().getCurrentTimeWithZeroSeconds();

            var that = this,
                saveOptions = {
                    beforeSend: that.model.beforeSend,
                    error: function(model, resp) {
                        //add error banner to modal
                        that.showError(resp);
                        $('#add-allergy').prop('disabled', false);
                    },
                    success: function(model, resp) {
                        //close modal...we are done with it
                        ADK.hideModal();
                        setTimeout(function() {
                            that.gridView.refresh({});
                        }, 2000);
                    }
                };
            console.log(JSON.stringify(this.model));
            this.model.save(null, saveOptions);
        },
        setSeverity: function(event) {
            var severity = this.model.get('severity');
            switch (severity) {
                case '3':
                    $('#btn-severe').attr('is-active', 'true');
                    $('#btn-severe').removeClass('severity-none');
                    $('#btn-severe').addClass('severity-severe');

                    $('#btn-moderate').attr('is-active', 'false');
                    $('#btn-moderate').removeClass('severity-moderate');
                    $('#btn-moderate').addClass('severity-none');

                    $('#btn-mild').attr('is-active', 'false');
                    $('#btn-mild').removeClass('severity-mild');
                    $('#btn-mild').addClass('severity-none');
                    break;
                case '2':
                    $('#btn-severe').attr('is-active', 'false');
                    $('#btn-severe').removeClass('severity-severe');
                    $('#btn-severe').addClass('severity-none');

                    $('#btn-moderate').attr('is-active', 'true');
                    $('#btn-moderate').removeClass('severity-none');
                    $('#btn-moderate').addClass('severity-moderate');

                    $('#btn-mild').attr('is-active', 'false');
                    $('#btn-mild').removeClass('severity-mild');
                    $('#btn-mild').addClass('severity-none');
                    break;
                case '1':
                    $('#btn-severe').attr('is-active', 'false');
                    $('#btn-severe').removeClass('severity-severe');
                    $('#btn-severe').addClass('severity-none');

                    $('#btn-moderate').attr('is-active', 'false');
                    $('#btn-moderate').removeClass('severity-moderate');
                    $('#btn-moderate').addClass('severity-none');

                    $('#btn-mild').attr('is-active', 'true');
                    $('#btn-mild').removeClass('severity-none');
                    $('#btn-mild').addClass('severity-mild');
                    break;
            }
        },
        validObserverDate: function(userValue, show) {
            $('.errorMessage').remove();
            if (userValue.length && !AllergiesUtil.requiredDateFormat(userValue)) {
                if (show) {
                    this.showError('Please enter the date in format HH:MMa or HH:MMp');
                }
                return false;
            } else {
                return true;
            }

        },
        showObserver: function() {
            $('#obs-form').css('visibility', 'visible');
            $('#btn-historical').removeClass('toggle-on');
            $('#btn-historical').addClass('toggle-off');
            $('#btn-observer').removeClass('toggle-off');
            $('#btn-observer').addClass('toggle-on');
            $('#btn-observer').attr('is-active', 'true');
            $('#btn-historical').attr('is-active', 'false');
        },
        hideObserver: function() {
            $('#obs-form').css('visibility', 'hidden');
            $('#btn-historical').removeClass('toggle-off');
            $('#btn-historical').addClass('toggle-on');
            $('#btn-observer').removeClass('toggle-on');
            $('#btn-observer').addClass('toggle-off');
            $('#btn-observer').attr('is-active', 'false');
            $('#btn-historical').attr('is-active', 'true');
        },
        navigateToSymptomsFromSearch: function(event) {
            if (event.keyCode === 9 && !event.shiftKey) {
                event.preventDefault();

                if (SymptomsUtil.isSymptomsListEmpty() && !SymptomsUtil.isSelectedSymptomsEmpty()) {
                    $('#symptoms-selected-tbl > tbody').find('input')[0].focus();
                } else if (SymptomsUtil.isSymptomsListEmpty() && SymptomsUtil.isSelectedSymptomsEmpty()) {
                    $('#comments').focus();
                } else {
                    $('#symptoms-ul:first > li:first > a').focus();
                }
            }
        },
        submitSearchSymptoms: function(event) {
            if (event.keyCode !== 9) {
                AllergiesUtil.performActionWhileTyping(event, 'keyup', 2, 500, SymptomsSearchEventHandler.symptomsEventHandler);
            }
        },
        navigateToSymptomsFromComments: function(event) {
            if (event.keyCode === 9) {
                if (event.shiftKey) {
                    event.preventDefault();

                    if (!SymptomsUtil.isSymptomsListEmpty() && SymptomsUtil.isSelectedSymptomsEmpty()) {
                        $('#symptoms-ul:first > li:first > a').focus();
                        $('#symptomsList').scrollTop(0);
                    } else if (SymptomsUtil.isSymptomsListEmpty() && SymptomsUtil.isSelectedSymptomsEmpty()) {
                        $('#symptomSearchInput').focus();
                    } else {
                        var xbuttons = $('#symptoms-selected-tbl > tbody').find('.xbutton');
                        var xbuttonFocusIndex = xbuttons.length - 2;
                        xbuttons[xbuttonFocusIndex].focus();
                    }
                }
            }
        },
        showModal: function(destroy) {

            //pass in the function pointers, view, and model to the footer
            var footerView = FooterView.extend({
                navToSearch: this.navToSearch,
                addAllergy: this.addAllergy,
                showError: this.showError,
                clearErrors: this.clearErrors,
                errorView: this.errorView,
                model: this.model,
                gridView: this.gridView
            });

            var titleView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>×</span><span class='sr-only'>Close</span></button><h4 class='modal-title'>Enter Allergy/Adverse Reaction for <b> {{name}} </b></h4>")
            });

            ADK.showWorkflowItem(this, {
                title : 'Enter Allergy/Adverse Reaction',
                headerView : titleView.extend({
                    model: this.model
                }),
                'footerView' : footerView,
                                'regionName': 'addEditAllergy',
                'replaceContents': destroy
            });
        }
    });

    return AllergySelectedView;

});
