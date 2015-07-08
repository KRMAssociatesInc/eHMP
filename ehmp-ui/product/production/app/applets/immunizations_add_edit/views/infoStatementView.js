define([
    'underscore', 'handlebars'
], function(_, Handlebars){

    var OptionItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{name}}'),
        tagName: 'option',
        attributes: function(){
            return {
                'data-name': this.model.get('name')   
            };
        }
    });

    var SelectView = Backbone.Marionette.CompositeView.extend({
        template: Handlebars.compile('<select class="form-control pull-left"></select>{{#unless isFirst}}<span class="info-source-remove pull-right" tabIndex="0"><b class="glyphicon glyphicon-remove"></b></span>{{/unless}}</div>'),
        childViewContainer: 'select',
        childView: OptionItemView,
        events: {
            'change': 'handleChanged',
            'click .info-source-remove': 'removeSelect',
            'keyup .info-source-remove': 'handleRemoveKeyPress'
        },
        tagName: 'div',
        className: 'clearfix info-source-block',
        initialize: function(){
            this.collection = new Backbone.Collection();
            this.collection.add({name: ''});
            this.collection.add(this.model.get('items').models);
        },
        handleRemoveKeyPress: function(e){
            if(e.keyCode === 13){
                this.removeSelect();
            }
        },
        handleChanged: function(){
            if(this.collection.length > 2){
                $(this.el).trigger('addSelect', this);
            }
        },
        removeSelect: function(){
            $(this.el).trigger('removeSelect', this);
        }
    });
    
    return Backbone.Marionette.CollectionView.extend({
        tagName: 'div',
        childView: SelectView,
        events: {
            'addSelect': 'addAnotherSelect',
            'removeSelect': 'removeSelect'
        },
        initialize: function(){
              this.collection = new Backbone.Collection();
        },
        setFirstModel: function(data){
            var firstModel = new Backbone.Model({isFirst: 'yes', items: new Backbone.Collection(data)});
            this.collection.add(firstModel);
        },
        addAnotherSelect: function(event, view){
            var selectedValue = $(view.el).find('select').val();
            
            if(selectedValue){
                $(view.el).find('select').attr('disabled', true);
                var newCollection = this.buildNewCollection();
                this.collection.add(new Backbone.Model({items: newCollection}));
                $(this.el).find('select').last().focus();
            }
        },
        removeSelect: function(event, view){
            this.collection.remove(view.model);
            
            if(this.collection.length === 1){
                $(this.el).find('select').first().attr('disabled', false).focus();
            }else {
                var preSelectedName = $(this.el).find('select').last().find('option:selected').attr('data-name');
                this.collection.remove(this.collection.models[this.collection.models.length - 1]);
                var newCollection = this.buildNewCollection();
                this.collection.add(new Backbone.Model({items: newCollection}));

                if(preSelectedName){
                     $(this.el).find('select').last().find('option[data-name="' + preSelectedName + '"]').attr('selected', true);
                }
                
                $(this.el).find('select').last().focus();
            }
        },
        buildNewCollection: function(){
            var newCollection = new Backbone.Collection();
            
            var items = this.collection.models[0].get('items').models;
            var alreadyUsedStatements = $('.info-source-block select option:selected').map(function(){
                return $(this).text();
            }).get();
            
            _.each(items, function(item){
                if(!_.contains(alreadyUsedStatements, item.get('name'))){
                    newCollection.add(item);
                }
            });
            
            return newCollection;
        }
    });
});
