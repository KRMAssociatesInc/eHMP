define([
    'backbone',
    'puppetForm',
    'handlebars',
    'underscore',
    'typeahead'
], function(Backbone, PuppetForm, Handlebars, _, Typeahead) {
    'use strict';

    var TypeaheadPrototype = {
        defaults: {
            label: '',
            options: {
                hint: false,
                highlight: true,
                minLength: 0,
                templates: {
                    footer: Handlebars.compile('Fetch more "{{ query }}" results...')
                }
            },
            extraClasses: [],
            type: 'text',
            title: 'The type ahead feature will begin searching for content as you type. The results are listed below. Use the up and down arrow keys to review the results.'
        },
        attributeMappingDefaults: {
            value: 'value',
            label: 'label'
        },
        setFormatter: function() {
            var ValueLabelFormatter = function() {};
            var self = this;
            ValueLabelFormatter = _.extend(ValueLabelFormatter.prototype, {
                    fromRaw: function(value, model) {
                        var matchingItem = self.pickList.find(function(anItem) {
                            return (anItem.get(self.mappedAttribute('value')) === value);
                        });

                        if (matchingItem !== undefined && matchingItem !== null) {
                            return matchingItem.get(self.mappedAttribute('label'));
                        } else {
                            return value;
                        }
                    },
                    toRaw: function(label, model) {
                        var matchingItem = self.pickList.find(function(anItem) {
                            return (anItem.get(self.mappedAttribute('label')) === label);
                        });

                        if (matchingItem !== undefined && matchingItem !== null) {
                            return matchingItem.get(self.mappedAttribute('value'));
                        } else {
                            return label;
                        }
                    }
                }
            );

            this.formatter = ValueLabelFormatter;
        },
        getTemplate: function() {
            return Handlebars.compile([
                '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
                '<input type="{{type}}" id="{{clean-for-id name}}" name="{{name}}" value="{{value}}"' +
                    ' class="typeahead {{PuppetForm "controlClassName"}}"' +
                    '{{#if title}} title="{{title}}"{{/if}}' +
                    '{{#if disabled}} disabled{{/if}}' +
                    '{{#if required}} required{{/if}}' +
                    '{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}' +
                    '{{#if readonly}} readonly{{/if}}/>',
                '{{#if helpMessage}} <span {{#if (has-puppetForm-prop "helpMessageClassName")}}class="{{PuppetForm "helpMessageClassName"}}"{{/if}}>{{helpMessage}}</span>{{/if}}'
            ].join("\n"));
        },
        events: {
            'change input': 'onChange',
            'blur input': 'onChange',
            'typeahead:selected': 'onChange',
            'control:label': function(e, labelString) {
                e.preventDefault();
                this.setStringFieldOption('label', labelString, e);
            },
            'control:disabled': function(e, disabledBool) {
                e.preventDefault();
                this.setBooleanFieldOption('disabled', disabledBool, e);
            },
            'control:required': function(e, requiredBool) {
                e.preventDefault();
                this.setBooleanFieldOption('required', requiredBool, e);
            },
            'control:picklist:set': function (e, pickList) {
                e.preventDefault();
                this.setPickList({pickList: pickList});
            }
        },
        initialize: function(options) {
            this.pickList = new Backbone.Collection();
            this.initOptions(options);
            this.setFormatter();
            this.setAttributeMapping();
            this.listenToFieldName();
            this.setExtraClasses(this.defaults.extraClasses);
            this.registerToComponentList(this);
            this.setPickList({pickList: this.field.get('pickList')});
            this.listenToPickList();
            this.listenToFieldOptions();
        },
        setPickList: function(options) {
            var pickList = options.pickList;

            //var pickList = this.field.get('pickList');
            if (pickList instanceof Backbone.Collection) {
                pickList = pickList || new Backbone.Collection();
            } else {
                pickList = new Backbone.Collection(pickList, this.mappedAttribute('label'));
            }

            this.pickList.reset(pickList.models);
        },
        listenToPickList: function() {
            var self = this;

            this.pickList.bind('reset',  function () {
                self.render();
            });
        },
        onRender: function() {
            this.$el.addClass(this.field.get('name')).addClass(this.extraClasses);
            this.updateInvalid();

            var pickListMatcher = this.field.get('matcher') || this.substringMatcher;
            var typeaheadElement = this.$el.find('#' + this.field.get('name'));

            var libOptions = _.defaults(this.field.get('options') || {}, this.defaults.options);

            typeaheadElement.typeahead(libOptions, {
                name: this.mappedAttribute('value'),
                display: this.mappedAttribute('label'),
                limit: 100,
                source: pickListMatcher(this.pickList, this.mappedAttribute('label')),
                templates: {
                    footer: Handlebars.compile('Fetch more "{{ query }}" results...')
                }
            });
        },
        substringMatcher: function(itemList, labelAttribute) {
            return function findMatches(q, cb) {
                var matches = [];
                var substrRegex = new RegExp(q, 'i');

                itemList.each(function(anItem) {
                    if (substrRegex.test(anItem.get(labelAttribute))) {
                        matches.push(anItem.toJSON());
                    }
                });

                cb(matches);
            };
        },
        getValueFromDOM: function() {
            var label = this.$el.find('#' + this.field.get('name')).typeahead('val');
            return this.formatter.toRaw(label, this.model);
        }
    };

    var TypeaheadControl = PuppetForm.TypeaheadControl = PuppetForm.Control.extend(
        _.defaults(TypeaheadPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return TypeaheadControl;
});