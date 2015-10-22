/*
  PuppetForm
  ...is a Backbone.Marionette form generator.
   - PuppetForm takes a Backbone model and transforms it into an HTML form.
   - Any changes to the form are reflected back to the model and vice versa.
   - PuppetForm controls are Backbone.Marionette views and extensible.
   - PuppetForm even supports nested objects.
   - PuppetForm is built with Bootstrap 3 markup.
 */
(function() {

    // PuppetForm namespace and global options
    PuppetForm = {
        // HTML markup global class names. More can be added by individual controls
        // using _.extend. Look at RadioControl as an example.
        formClassName: "adk-form form-container",
        formDefaultMethod: 'post',
        groupClassName: "form-group",
        controlLabelClassName: "",
        controlsClassName: "",
        controlClassName: "form-control",
        helpClassName: "help-block",
        errorClassName: "has-error",
        helpMessageClassName: "help-block",

        resolveNameToClass: function(name, suffix) {
            if (_.isString(name)) {
                var key = _.map(name.split('-'), function(e) {
                    return e.slice(0, 1).toUpperCase() + e.slice(1);
                }).join('') + suffix;
                var klass = PuppetForm[key];
                if (_.isUndefined(klass)) {
                    throw new ReferenceError("Class '" + key + "' not found");
                }
                return klass;
            }
            return name;
        }
    };

    // PuppetForm Form view
    // A collection of field models.
    var Form = PuppetForm.Form = Backbone.Marionette.CollectionView.extend({
        tagName: "form",
        attributes: {
          'action': '#',
          'method': PuppetForm.formDefaultMethod
        },
        getControl: function(options) {
            options = options || {};
            var controlId = options.controlType + '_' + options.controlName;
            return this.componentList[controlId];
        },
        callControlFunction: function(options) {
            options = options || {};

            var functionName = options.functionName;
            var functionOptions = options.options;
            var targetControl = this.getControl(options);

            if (targetControl === undefined || targetControl === null) {
                var controlId = options.controlType + '_' + options.controlName;
                console.error('There is no such ui-control with "' + controlId + '"');
            }

            targetControl[functionName](functionOptions);
        },
        className: function() {
            return PuppetForm.formClassName;
        },
        initialize: function(options) {
            this.workflow = options.workflow;
            this.viewIndex = options.viewIndex;
            this.componentList = {};

            if(!_.isUndefined(this.methodType)) {
              //The element is already rendered
              this.$el.attr('method', this.methodType);
            }

            if (!(options.fields instanceof Backbone.Collection))
                options.fields = new Fields(options.fields || this.fields);
            this.fields = options.fields;
            this.collection = this.fields;
            this.model.errorModel = options.errorModel || this.model.errorModel || new Backbone.Model();
        },
        getChildView: function(item) {
            return (item.get('control'));
        },
        childViewOptions: function(model, index) {
            return {
                field: model,
                model: this.model,
                componentList: this.componentList
            };
        },
        transferFocusToFirstError: function(){
            var stringOfErrorFields = [
                '.' + PuppetForm.errorClassName + ' input:not(.tt-hint, .bootstrap-timepicker-hour, .bootstrap-timepicker-minute)',
                '.' + PuppetForm.errorClassName + ' select:not(.select2-hidden-accessible)',
                '.' + PuppetForm.errorClassName + ' .select2-selection',
                '.' + PuppetForm.errorClassName + ' textarea'
            ].join(", ");
            var a = this.$(stringOfErrorFields).first().focus();
            console.log(a);
        }
    });

    // Converting data to/from Model/DOM.
    // Stolen directly from Backgrid's CellFormatter.
    // Source: http://backgridjs.com/ref/formatter.html
    /**
       Just a convenient class for interested parties to subclass.

       The default Cell classes don't require the formatter to be a subclass of
       Formatter as long as the fromRaw(rawData) and toRaw(formattedData) methods
       are defined.

       @abstract
       @class PuppetForm.ControlFormatter
       @constructor
    */
    var ControlFormatter = PuppetForm.ControlFormatter = function() {};
    _.extend(ControlFormatter.prototype, {

        /**
           Takes a raw value from a model and returns an optionally formatted string
           for display. The default implementation simply returns the supplied value
           as is without any type conversion.

           @member PuppetForm.ControlFormatter
           @param {*} rawData
           @param {Backbone.Model} model Used for more complicated formatting
           @return {*}
        */
        fromRaw: function(rawData, model) {
            return rawData;
        },

        /**
           Takes a formatted string, usually from user input, and returns a
           appropriately typed value for persistence in the model.

           If the user input is invalid or unable to be converted to a raw value
           suitable for persistence in the model, toRaw must return `undefined`.

           @member PuppetForm.ControlFormatter
           @param {string} formattedData
           @param {Backbone.Model} model Used for more complicated formatting
           @return {*|undefined}
        */
        toRaw: function(formattedData, model) {
            return formattedData;
        }

    });

    // Store value in DOM as stringified JSON.
    var JSONFormatter = PuppetForm.JSONFormatter = function() {};
    _.extend(JSONFormatter.prototype, {
        fromRaw: function(rawData, model) {
            return JSON.stringify(rawData);
        },
        toRaw: function(formattedData, model) {
            return JSON.parse(formattedData);
        }
    });

    // Field model and collection
    // A field maps a model attriute to a control for rendering and capturing user input
    var Field = PuppetForm.Field = Backbone.Model.extend({
        defaults: {
            name: "", // Name of the model attribute; accepts "." nested path (e.g. x.y.z)
            placeholder: "",
            disabled: false,
            required: false,
            value: undefined, // Optional. Default value when model is empty.
            control: undefined, // Control name or class
            formatter: undefined
        },
        initialize: function() {
            var control = PuppetForm.resolveNameToClass(this.get("control"), "Control");
            this.set({
                controlName: this.get('control'),
                control: control
            }, {
                silent: true
            });
        }
    });

    var Fields = PuppetForm.Fields = Backbone.Collection.extend({
        model: Field
    });

    var CommonContainerEventsFunctions = PuppetForm.CommonContainerEventsFunctions = {
      addModel: function(collection, model, e) {
        if(!_.isUndefined(collection) && !_.isUndefined(model)) {
          if(this[collection] instanceof Backbone.Collection) {
            model = new Field(model);
            this[collection].add(model);
          }
        }
        e.stopPropagation();
      },
      removeModel: function(collection, model, e) {
        if(!_.isUndefined(collection) && !_.isUndefined(model)) {
          if(this[collection] instanceof Backbone.Collection) {
            if(!_.isUndefined(model.control)) {
              model.controlName = model.control;
              delete model.control;
            }
            var models = this[collection].where(model);
            this[collection].remove(models);
          }
        }
        e.stopPropagation();
      },
      updateCollection: function(collection, model, e) {
        if(!_.isUndefined(collection) && !_.isUndefined(model)) {
          if(this[collection] instanceof Backbone.Collection) {
            if(model instanceof Array) {
              model = _.map(model, function(m) {
                return new Field(m);
              })
            } else {
              model = new Field(model);
            }
            this[collection].reset(model);
          }
        }
        e.stopPropagation();
      }
    };
    var CommonContainerEvents = PuppetForm.CommonContainerEvents = _.defaults({
      events: {
        'control:items:add': function(e, model) {
          this.addModel('collection', model, e);
        },
        'control:items:remove': function(e, model) {
          this.removeModel('collection', model, e);
        },
        'control:items:update': function(e, model) {
          this.updateCollection('collection', model, e);
        } 
      }
    }, CommonContainerEventsFunctions);

    
    var CommonEventsFunctions = PuppetForm.CommonEventsFunctions = {
      setBooleanFieldOption: function(attribute, booleanValue, e) {
        if (_.isBoolean(booleanValue)) {
          this.field.set(attribute, booleanValue);
        }
        e.stopPropagation();
      },
      setStringFieldOption: function(attribute, stringValue, e) {
        if (_.isString(stringValue)) {
          this.field.set(attribute, stringValue);
        }
        e.stopPropagation();
      },
      setIntegerFieldOption: function(attribute, intValue, e) {
        if (_.isNumber(intValue)) {
          this.field.set(attribute, intValue);
        }
        e.stopPropagation();
      },
      hideControl: function(e, booleanValue) {
        if (_.isBoolean(booleanValue) && $(e.target).is(this.$el)) {
          $(e.currentTarget).toggleClass('hidden', booleanValue);
        }
        e.stopPropagation();
      }
    };

    var CommonPrototype = PuppetForm.CommonPrototype = {
        defaults: {}, // Additional field defaults
        formatter: ControlFormatter,
        className: function() {
            return "control form-group";
        },
        setFormatter: function() {
            var formatter = PuppetForm.resolveNameToClass(this.field.get("formatter") || this.formatter, "Formatter");
            if (!_.isFunction(formatter.fromRaw) && !_.isFunction(formatter.toRaw)) {
                formatter = new formatter();
            }
            this.formatter = formatter;
        },
        setExtraClasses: function(defaultClasses) {
            this.extraClasses = this.field.get('extraClasses') || defaultClasses || '';
            this.extraClasses = (this.extraClasses ? this.extraClasses.join(' ') : '');
        },
        getComponentInstanceName: function() {
            var attrArr = this.field.get('name').split('.');
            var name = attrArr.shift();
            return name;
        },
        registerHandlers: function () {
            this.handlers = this.field.get('handlers');
        },
        listenToFieldName: function() {
            this.modelName = this.getComponentInstanceName();

            this.listenTo(this.model, "change:" + this.modelName, this.render);
            if (this.model.errorModel instanceof Backbone.Model)
                this.listenTo(this.model.errorModel, "change:" + this.modelName, this.updateInvalid);

            var events = this.field.get('events');
            var self = this;
            if (events !== undefined && events !== null) {
                _.map(events, function (method, event) {
                    self.listenTo(self.model, event, self.handlers[method]);
                });
            }
        },
        listenToFieldOptions: function() {
            this.listenTo(this.field, "change", this.render);
        },
        registerToComponentList: function(componentObj) {
            var componentId = this.field.get('controlName') + '_' + this.getComponentInstanceName();
            this.componentList[componentId] = componentObj;
        },
        initOptions: function(options) {
            this.field = options.field; // Back-reference to the field
            this.componentList = options.componentList || {};
        },
        initCollection: function(collectionConfigOptionName){
            var name = this.getComponentInstanceName();
            if (!_.isUndefined(this.model.get(name))) {
                if (this.model.get(name) instanceof Backbone.Collection) {
                    this.collection = this.model.get(name);
                } else {
                    //not already in the form of a collection
                    this.collection = new Backbone.Collection(this.model.get(name));
                }
            } else {
                //not in model yet so use what is given in the config
                if (!(this.field.get(collectionConfigOptionName) instanceof Backbone.Collection)) {
                    this.collection = new Backbone.Collection(this.field.get(collectionConfigOptionName));
                } else {
                    this.collection = this.field.get(collectionConfigOptionName) || new Backbone.Collection();
                }
            }
        },
        setAttributeMapping: function() {
            this.attributeMapping = _.defaults(this.field.get('attributeMapping') || {}, this.attributeMappingDefaults);
        },
        mappedAttribute: function(attribute, handlebarSyntax, doubleQuotes) {
            var mappedAttribute = this.attributeMapping[attribute];

            if (handlebarSyntax) {
                mappedAttribute = '{{' + mappedAttribute + '}}';
            }

            if (doubleQuotes) {
                mappedAttribute = '"' + mappedAttribute + '"';
            }

            return mappedAttribute;
        },
        buildAttributeMappedArray: function(collection, customAttrMapping, defaultAttrMapping, defaultValueField) {
            customAttrMapping = _.defaults(customAttrMapping || {}, defaultAttrMapping);

            return collection.map(function(item) {
                var mappedItem = {};
                _.each(_.keys(defaultAttrMapping), function(aKey) {
                    mappedItem[aKey] = item.get(customAttrMapping[aKey]) || item.get(customAttrMapping[defaultValueField]);
                });

                return mappedItem;
            });
        },
        serializeModel: function(model, moreOptions) {
            var field = _.defaults(this.field.toJSON(), this.defaults);
            var attributes = model.toJSON();
            var attrArr = field.name.split('.');
            var name = attrArr.shift();
            var path = attrArr.join('.');
            var rawValue = this.keyPathAccessor(attributes[name], path);
            var value = this.formatter.fromRaw(rawValue, model);

            _.extend(field, {
                rawValue: rawValue,
                value: value,
                attributes: attributes,
                formatter: this.formatter
            });

            moreOptions && _.extend(field, moreOptions);

            this.fieldModel = {
                rawValue: rawValue,
                value: value
            };

            return field;
        },
        onChange: function(e) {
            e.preventDefault();
            var model = this.model,
                $el = $(e.target),
                attrArr = this.field.get("name").split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.'),
                value = this.getValueFromDOM(),
                changes = {};
            if (this.model.errorModel instanceof Backbone.Model) {
                if (_.isEmpty(path)) {
                    this.model.errorModel.unset(name);
                } else {
                    var nestedError = this.model.errorModel.get(name);
                    if (nestedError) {
                        this.keyPathSetter(nestedError, path, null);
                        this.model.errorModel.set(name, nestedError);
                    }
                }
            }
            changes[name] = _.isEmpty(path) ? value : _.clone(model.get(name)) || {};
            if (!_.isEmpty(path)) this.keyPathSetter(changes[name], path, value);
            this.stopListening(this.model, "change:" + name, this.render);
            model.set(changes);
            this.listenTo(this.model, "change:" + name, this.render);
        },
        clearInvalid: function() {
            this.$el.removeClass(PuppetForm.errorClassName)
                .find("." + PuppetForm.helpClassName + ".error").remove();
            return this;
        },
        updateInvalid: function() {
            var errorModel = this.model.errorModel;
            if (!(errorModel instanceof Backbone.Model)) return this;

            this.clearInvalid();

            var attrArr = this.field.get('name').split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.'),
                error = errorModel.get(name);

            if (_.isEmpty(error)) return;
            if (_.isObject(error)) error = this.keyPathAccessor(error, path);
            if (_.isEmpty(error)) return;

            this.$el.addClass(PuppetForm.errorClassName);
            this.$el.append('<span class="' + PuppetForm.helpClassName + ' error">' + (_.isArray(error) ? error.join(", ") : error) + '</span>');

            return this;
        },
        keyPathAccessor: function(obj, path) {
            var res = obj;
            path = path.split('.');
            for (var i = 0; i < path.length; i++) {
                if (_.isNull(res)) return null;
                if (_.isEmpty(path[i])) continue;
                if (!_.isUndefined(res[path[i]])) res = res[path[i]];
            }
            return _.isObject(res) && !_.isArray(res) ? null : res;
        },
        keyPathSetter: function(obj, path, value) {
            path = path.split('.');
            while (path.length > 1) {
                if (!obj[path[0]]) obj[path[0]] = {};
                obj = obj[path.shift()];
            }
            return obj[path.shift()] = value;
        },
        events: {
            "control:hidden": "hideControl"
        },
        onRender: function() {
            this.$el.addClass(this.field.get('controlName') + '-control ' + this.field.get('name').split('.').shift() + (this.extraClasses ? ' ' + this.extraClasses : ''));
            this.updateInvalid();
        }
    };

    var ControlPrototype = {
        initialize: function(options) {
            this.initOptions(options);
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();
        }
    };

    // Base Control class

    var Control = PuppetForm.Control = Backbone.Marionette.ItemView.extend(
        _.defaults(ControlPrototype, _.defaults(CommonPrototype, CommonEventsFunctions))
    );

    // Built-in controls

    var UneditableInputControl = PuppetForm.UneditableInputControl = Control;

    var HelpControl = PuppetForm.HelpControl = Control.extend({
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>">&nbsp;</label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <span class="<%=PuppetForm.helpMessageClassName%> help-block"><%=label%></span>',
            '</div>'
        ].join("\n"))
    });

    var SpacerControl = PuppetForm.SpacerControl = Control.extend({
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>">&nbsp;</label>',
            '<div class="<%=PuppetForm.controlsClassName%>"></div>'
        ].join("\n"))
    });

    var TextareaControl = PuppetForm.DefaultTextareaControl = Control.extend({
        defaults: {
            label: "",
            maxlength: 4000,
            extraClasses: [],
            helpMessage: ""
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>"><%-label%></label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <textarea class="<%=PuppetForm.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" maxlength="<%=maxlength%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%>><%-value%></textarea>',
            '  <% if (helpMessage.length) { %>',
            '    <span class="<%=PuppetForm.helpMessageClassName%>"><%=helpMessage%></span>',
            '  <% } %>',
            '</div>'
        ].join("\n")),
        events: _.defaults({
            "change textarea": "onChange"
        }, Control.prototype.events),
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("textarea").val(), this.model);
        }
    });

    var SelectControl = PuppetForm.DefaultSelectControl = Control.extend({
        defaults: {
            label: "",
            options: [], // List of options as [{label:<label>, value:<value>}, ...]
            extraClasses: []
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>"><%-label%></label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <select class="<%=PuppetForm.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" value="<%-value%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> >',
            '    <% for (var i=0; i < options.length; i++) { %>',
            '      <% var option = options[i]; %>',
            '      <option value="<%-formatter.fromRaw(option.value)%>" <%=option.value === rawValue ? "selected=\'selected\'" : ""%> <%=option.disabled ? "disabled=\'disabled\'" : ""%>><%-option.label%></option>',
            '    <% } %>',
            '  </select>',
            '</div>'
        ].join("\n")),
        events: {
            "change select": "onChange"
        },
        formatter: JSONFormatter,
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("select").val(), this.model);
        }
    });

    var MultiSelectControl = PuppetForm.MultiSelectControl = Control.extend({
        defaults: {
            label: "",
            options: [], // List of options as [{label:<label>, value:<value>}, ...]
            extraClasses: [],
            height: '78px'
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>"><%-label%></label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <select multiple="multiple" class="<%=PuppetForm.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" value="<%-value%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> style="height:<%=height%>">',
            '    <% for (var i=0; i < options.length; i++) { %>',
            '      <% var option = options[i]; %>',
            '      <option value="<%-formatter.fromRaw(option.value)%>" <%=option.value == rawValue ? "selected=\'selected\'" : ""%> <%=option.disabled ? "disabled=\'disabled\'" : ""%>><%-option.label%></option>',
            '    <% } %>',
            '  </select>',
            '</div>'
        ].join("\n")),
        events: {
            "change select": "onChange",
            "dblclick select": "onDoubleClick"
        },
        formatter: JSONFormatter,
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("select").val(), this.model);
        },
        onDoubleClick: function(e) {
            this.model.trigger('doubleclick', e);
        }
    });

    var InputControl = PuppetForm.DefaultInputControl = Control.extend({
        defaults: {
            type: "text",
            label: "",
            maxlength: 255,
            extraClasses: [],
            helpMessage: ''
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>"><%-label%></label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <input type="<%=type%>" class="<%=PuppetForm.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />',
            '  <% if (helpMessage.length) { %>',
            '    <span class="<%=PuppetForm.helpMessageClassName%>"><%=helpMessage%></span>',
            '  <% } %>',
            '</div>'
        ].join("\n")),
        events: _.defaults({
            "change input": "onChange"
        }, Control.prototype.events),
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("input").val(), this.model);
        }
    });


    var BooleanControl = PuppetForm.DefaultBooleanControl = InputControl.extend({
        defaults: {
            type: "checkbox",
            label: "",
            controlLabel: '&nbsp;',
            extraClasses: []
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>"><%=controlLabel%></label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <div class="checkbox">',
            '    <label>',
            '      <input type="<%=type%>" class="<%=extraClasses.join(\' \')%>" name="<%=name%>" <%=value ? "checked=\'checked\'" : ""%> <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> /> <%-label%>',
            '    </label>',
            '  </div>',
            '</div>'
        ].join("\n")),
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("input").is(":checked"), this.model);
        }
    });

    var CheckboxControl = PuppetForm.DefaultCheckboxControl = BooleanControl;

    var RadioControl = PuppetForm.DefaultRadioControl = InputControl.extend({
        defaults: {
            type: "radio",
            label: "",
            options: [],
            extraClasses: []
        },
        template: _.template([
            '<% if (drawLabel === true) { %>',
              '<label class="<%=PuppetForm.controlLabelClassName%>"><%-label%></label>',
              '<div class="<%=PuppetForm.controlsClassName%> <%=PuppetForm.radioControlsClassName%>">',
            '<% } %>',
            '  <% for (var i=0; i < options.length; i++) { %>',
            '    <% var option = options[i]; %>',
            '    <label class="<%=PuppetForm.radioLabelClassName%>">',
            '      <input type="<%=type%>" class="<%=extraClasses.join(\' \')%>" name="<%=name%>" value="<%-formatter.fromRaw(option.value)%>" <%=rawValue === option.value ? "checked=\'checked\'" : ""%> <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> /> <%-option.label%>',
            '    </label>',
            '  <% } %>',
            '</div>'
        ].join("\n")),
        formatter: JSONFormatter,
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("input:checked").val(), this.model);
        },
        bootstrap2: function() {
            PuppetForm.radioControlsClassName = "radio";
            PuppetForm.radioLabelClassName = "";
        }
    });
    _.extend(PuppetForm, {
        radioControlsClassName: "radio",
        radioLabelClassName: "radio-inline"
    });

    var ButtonControl = PuppetForm.DefaultButtonControl = Control.extend({
        defaults: {
            type: "submit",
            label: "Submit",
            status: undefined, // error or success
            message: undefined,
            extraClasses: []
        },
        template: _.template([
            '<label class="<%=PuppetForm.controlLabelClassName%>">&nbsp;</label>',
            '<div class="<%=PuppetForm.controlsClassName%>">',
            '  <button type="<%=type%>" name="<%=name%>" class="btn <%=extraClasses.join(\' \')%>" <%=disabled ? "disabled" : ""%> ><%-label%></button>',
            '  <% var cls = ""; if (status == "error") cls = PuppetForm.buttonStatusErrorClassName; if (status == "success") cls = PuppetForm.buttonStatusSuccessClassname; %>',
            '  <span class="status <%=cls%>"><%=message%></span>',
            '</div>'
        ].join("\n")),
        initialize: function() {
            Control.prototype.initialize.apply(this, arguments);
            this.listenTo(this.field, "change:status", this.render);
            this.listenTo(this.field, "change:message", this.render);
        },
        bootstrap2: function() {
            PuppetForm.buttonStatusErrorClassName = "text-error";
            PuppetForm.buttonStatusSuccessClassname = "text-success";
        }
    });
    _.extend(PuppetForm, {
        buttonStatusErrorClassName: "text-danger",
        buttonStatusSuccessClassname: "text-success"
    });

}).call(this);
