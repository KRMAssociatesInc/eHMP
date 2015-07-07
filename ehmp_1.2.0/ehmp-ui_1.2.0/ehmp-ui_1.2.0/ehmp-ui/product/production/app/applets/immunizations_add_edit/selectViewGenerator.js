define([
    'underscore',
    'handlebars'
], function(_, Handlebars){
    
    return {
        createSelectView: function(selectId, selectLabel, optionTextProperty, optionValueProperty, onChangedCallback){
            var OptionItemView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{' + optionTextProperty + '}}'),
                tagName: 'option',
                attributes: function(){
                    return {
                        value: this.model.get(optionValueProperty)
                    };
                },
                events: {
                    'selected': 'handleSelected'
                },
                handleSelected: function(){
                    onChangedCallback(this.model);
                }
            });
            
            var SelectView = Backbone.Marionette.CompositeView.extend({
                template: _.template('<label class="label-group" for="' + selectId + '">' + selectLabel + '</label><select id="' + selectId + '" class="form-control"></select><span id="' + selectId + '-error" class="help-inline" aria-hidden="true"></span>'),
                childViewContainer: 'select',
                childView: OptionItemView,
                events: {
                    'change': 'handleChanged'
                },
                initialize: function(){
                    this.collection = new Backbone.Collection();
                    var defaultObj = {};
                    defaultObj[optionValueProperty] = 'default';
                    defaultObj[optionTextProperty] = '';
                    var defaultModel = new Backbone.Model(defaultObj);
                    this.collection.add(defaultModel);
                },
                handleChanged: function(){
                    if(onChangedCallback){
                        this.$('option:selected').trigger('selected');
                    }
                }
            });
            
            return new SelectView();
        }
    };
});
