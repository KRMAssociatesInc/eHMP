define([
    'backbone',
    'puppetForm',
    'handlebars',
    'underscore',
    'select2'
    //'multiple-select'
], function(Backbone, PuppetForm, Handlebars, _) {
    'use strict';

    var OptionGroups = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            parse: function(resp) {
                this.pickList = new Backbone.Collection(resp.pickList);
                return resp;
            }
        })
    });

    var SelectPrototype = {
        defaults: {
            label: '',
            showFilter: false,
            groupEnabled: false,
            extraClasses: [],
            multiple: false,
            title: 'Press up and down arrow keys to view options. Press enter to select.',
            options: {
                width: '100%',
                minimumInputLength: 3
            }
        },
        attributeMappingDefaults: {
            group: 'group',
            value: 'value',
            label: 'label'
        },
        events: _.defaults({
            "change select": "onChange",
            "focus select": "",
            "control:label": function(e, labelString) {
                e.preventDefault();
                this.setStringFieldOption('label', labelString, e);
            },
            "control:disabled": function(e, disabledBool) {
                e.preventDefault();
                this.setBooleanFieldOption('disabled', disabledBool, e);
            },
            "control:required": function(e, requiredBool) {
                e.preventDefault();
                this.setBooleanFieldOption('required', requiredBool, e);
            },
            "control:multiple": function(e, multipleBool) {
                e.preventDefault();
                this.setBooleanFieldOption('multiple', multipleBool, e);
            },
            "control:size": function(e, sizeInt) {
                e.preventDefault();
                this.setIntegerFieldOption('size', sizeInt, e);
            },
            "control:picklist:set": function(e, pickList) {
                e.preventDefault();
                this.setPickList({
                    pickList: pickList
                });
            },
            "control:loading:hide": function(e) {
                e.preventDefault();
                this.hideLoading();
            },
            "control:loading:show": function(e) {
                e.preventDefault();
                this.showLoading();
            }
        }, PuppetForm.CommonPrototype.events),
        getTemplate: function() {
            var selectTemplate = [
                '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}' +
                '<select class="{{PuppetForm "controlClassName"}}" id="{{clean-for-id name}}" name="{{name}}"' +
                '{{#if title}} title="{{title}}"{{/if}} ' +
                '{{#if disabled}} disabled{{/if}}' +
                '{{#if required}} required{{/if}}' +
                '{{#if disabled}} disabled{{/if}}' +
                '{{#if multiple}} multiple{{/if}}' +
                '{{#if size}} size={{size}}{{/if}}' +
                '>'
            ].join("\n");

            if (this.isGroupEnabled()) {
                selectTemplate = [selectTemplate,
                    '{{#unless required}}' +
                        '<option {{#unless value}} selected="selected"{{/unless}}></option>' +
                    '{{/unless}}',
                    '{{#each groups}}' +
                        '<optgroup label=' + this.mappedAttribute('group', true, true) + '>',
                            '{{#each pickList}}' +
                                '<option value=' + this.mappedAttribute('value', true, true) +
                                    '{{#compare ' + this.mappedAttribute('value') +
                                    ' ../../rawValue}} selected="selected"{{/compare}}' +
                                    '{{#if disabled}} disabled="disabled"{{/if}}>' +
                                    this.mappedAttribute('label', true) +
                                '</option>' +
                            '{{/each}}',
                        '</optgroup>',
                    '{{/each}}'
                ].join("\n");
            } else {
                selectTemplate = [selectTemplate,
                    '{{#unless required}}' +
                        '<option {{#unless value}} selected="selected"{{/unless}}></option>' +
                    '{{/unless}}',
                    '{{#each options}}' +
                        '<option value="{{formatter-from-raw ../formatter ' + this.mappedAttribute('value') + '}}"' +
                            '{{#compare ' + this.mappedAttribute('value') +
                            ' ../rawValue}} selected="selected"{{/compare}}' +
                            '{{#if disabled}} disabled="disabled"{{/if}}>' +
                            this.mappedAttribute('label', true) +
                        '</option>' +
                    '{{/each}}'
                ].join("\n");
            }

            selectTemplate = [selectTemplate, '</select>'].join("\n");
            return Handlebars.compile(selectTemplate);
        },
        isGroupEnabled: function() {
            return this.field.get('groupEnabled');
        },
        initialize: function(options) {
            this.pickList = new Backbone.Collection();
            this.initOptions(options);

            this.field.set('options', _.defaults(this.field.get('options') || {}, this.defaults.options));

            if (this.field.get('fetchFunction') !== undefined &&
                this.field.get('fetchFunction') !== null &&
                typeof this.field.get('fetchFunction') == 'function') {
                this.field.set('fetchEnabled', true);
            }

            this.formatter = new PuppetForm.ControlFormatter();
            this.setAttributeMapping();
            this.registerHandlers();
            this.listenToFieldName();
            this.setExtraClasses(this.defaults.extraClasses);
            this.registerToComponentList(this);

            this.setPickList({
                pickList: this.field.get('pickList')
            });

            this.listenToPickList();
            this.listenToFieldOptions();
        },
        serializeModel: function(model) {
            if (this.isGroupEnabled()) {
                return PuppetForm.Control.prototype.serializeModel.call(this, model, {
                    groups: JSON.parse(JSON.stringify(this.pickList))
                });
            } else {
                return PuppetForm.Control.prototype.serializeModel.call(this, model, {
                    options: this.pickList.toJSON()
                });
            }
        },
        needMoreInput: function (searchInput) {
            this.field.get('options').minimumInputLength++;

            if (searchInput !== undefined && searchInput !== null) {
                this.$el.find('select').select2(
                    _.defaults({
                            dropdownParent: this.$el.closest('.workflow-container'), // Needed for Select2 508 to work in Modals and Tabs

                            fetchCollection: _.bind(this.fetchCollection, this),
                            minimumInputLength: this.field.get('options').minimumInputLength
                        },
                        this.field.get('options')
                    ));
                this.$el.find('select').select2('open', {term: searchInput, skipFetch: true});
            }
        },
        onFetchError: function(searchInput) {
            console.error('TODO implement onFetchError');
        },
        fetchCollection: function (searchInput) {
            var setPickList = _.bind(this.setPickList, this);
            var onFetchError = _.bind(this.onFetchError, this);
            var needMoreInput = _.bind(this.needMoreInput, this);

            console.log('this.field', this.field);
            this.field.get('fetchFunction')(searchInput, setPickList, needMoreInput, onFetchError);
        },
        setPickList: function(options) {
            var pickList = options.pickList;
            var searchInput = options.input;

            if (searchInput !== undefined && searchInput !== null) {
                this.$el.find('select').select2('close');
            }

            if (_.isString(pickList)) {
                var field = _.defaults(this.field.toJSON(), this.defaults);
                var attributes = this.model.toJSON();
                var attrArr = field.pickList.split('.');
                var name = attrArr.shift();
                var path = attrArr.join('.');
                var rawValue = this.keyPathAccessor(attributes[name], path);
                var value = this.formatter.fromRaw(rawValue, this.model);
                pickList = attributes[name];
            }

            if (this.isGroupEnabled()) {
                if (pickList instanceof Backbone.Collection) {
                    pickList = pickList || new Backbone.Collection();
                } else {
                    pickList = new OptionGroups(pickList, {
                        parse: true
                    });
                }
            } else {
                if (pickList instanceof Backbone.Collection) {
                    pickList = pickList || new Backbone.Collection();
                } else {
                    pickList = new Backbone.Collection(pickList);
                }
            }

            this.pickList.reset(pickList.models);

            if (searchInput !== undefined && searchInput !== null) {
                this.$el.find('select').select2(
                    _.defaults({dropdownParent: this.$el.closest('.workflow-container'), // Needed for Select2 508 to work in Modals and Tabs

                            fetchCollection: _.bind(this.fetchCollection, this)},
                        this.field.get('options')
                    ));
                this.$el.find('select').select2('open', {term: searchInput, skipFetch: true});
            }
        },
        initSelect2: function() {
            this.$el.attr('role', 'application');
            var self = this;
            var fetchEnabled = this.field.get('fetchEnabled');

            if (fetchEnabled) {
                this.$el.find('select').select2(
                    _.defaults({dropdownParent: this.$el.closest('.workflow-container'),
                            fetchCollection: _.bind(this.fetchCollection, this)},
                        this.field.get('options')
                    ));
            } else {
                this.$el.find('select').select2(
                    _.defaults({dropdownParent: this.$el.closest('.workflow-container')},
                        this.field.get('options')
                ));
            }

            this.$el.find('select').on("select2:open", function() {
                if (self.$el.hasClass('has-error')) {
                    self.$el.find('#select2-drop').addClass('has-error');
                }
            });
        },
        getPickList: function(options) {
            return this.pickList;
        },
        showLoading: function() {
            this.$el.find('select').prop('disabled', true).empty().append('<option value="loading">Loading...</option>');
        },
        hideLoading: function() {
            this.$el.find('select').prop('disabled', false).empty();
        },
        listenToPickList: function() {
            var self = this;

            this.pickList.bind('reset', function() {
                self.render();
            });
        },
        onAttach: function() {
            if (this.field.get('multiple') === true) {
                //TODO use David Linke's multiple select wrapper when it is ready for mercury
                //this.$el.attr('role', 'application');
                //this.$el.find('select').multipleSelect({
                //    width: '100%',
                //    onClick: function(view) {
                //        console.log('multi select label, value = ' + view.label + ', ' + view.value);
                //        //$eventResult.text(view.label + '(' + view.value + ') ' +
                //        //    (view.checked ? 'checked' : 'unchecked'));
                //    }
                //});
            } else if (this.field.get('showFilter') === true) {
                this.initSelect2();
                this.hasSelect2BeenInitialized = true;
            }
        },
        getValueFromDOM: function() {
            if (this.field.get('multiple') === true) {
                return this.formatter.toRaw(this.$el.find('select').val(), this.model);
            } else {
                return this.formatter.toRaw(this.$el.find('select').val(), this.model);
            }
        },
        onRender: function() {
            this.$el.addClass(this.field.get('controlName') + '-control ' + this.field.get('name').split('.').shift() + (this.extraClasses ? ' ' + this.extraClasses : ''));
            this.updateInvalid();

            // TODO delete these lines?
            //if (this.field.get('showFilter') === true && !this.hasSelect2BeenInitialized) {
            //  this.initSelect2();
            //  this.hasSelect2BeenInitialized = true;
            //}
            //if (this.field.get('showFilter')) {
            //  console.log('select html:', this.$el.find('select').html());
            //}
        }
    };

    var SelectControl = PuppetForm.SelectControl = PuppetForm.DefaultSelectControl.extend(
        _.defaults(SelectPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return SelectControl;
});
