define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addVitals/templates/lowerVitalRowTemplate',
    'hbs!app/applets/addVitals/templates/pulseOximetryLowerTemplate',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil',
    'app/applets/addVitals/utils/viewHelper'
], function(Backbone, Marionette, _, lowerRowTemplate, poLowerTemplate, modelUtils, dateUtil, viewHelper) {
    'use strict';

    var util = modelUtils;
    var helper = viewHelper;

return Backbone.Marionette.ItemView.extend({
        tagName: 'div',
        events : {
            'change select' : 'handleSelect',
            'blur input' : 'handleInput'
        },

        onRender : function(){
            if (this.model.get('qual-1-mask')){

                if (this.model.get('qual-1-regex')){
                    //id="{{sname}}-{{qual-1-sname}}-text"
                    this.$el.find('#' +this.model.get('sname') + '-' + this.model.get('qual-1-sname') +"-text").inputmask('Regex', {
                        'regex': this.model.get('qual-1-mask')
                    });

                } else {
                    this.$el.find('#' +this.model.get('sname') + '-' + this.model.get('qual-1-sname') +"-text").inputmask(this.model.get('mask'));
                }
            }
            if (this.model.get('qual-2-mask')){

                if (this.model.get('qual-2-regex')){
                    //id="{{sname}}-{{qual-2-sname}}-text"
                    this.$el.find('#' +this.model.get('sname') + '-' + this.model.get('qual-2-sname') +"-text").inputmask('Regex', {
                        'regex': this.model.get('qual-2-mask')
                    });

                } else {
                    this.$el.find('#' +this.model.get('sname') + '-' + this.model.get('qual-2-sname') +"-text").inputmask(this.model.get('mask'));
                }
            }
        },
        initialize: function(){
            this.model.on('change:on-pass', this.toggleOnPass, this);
            this.model.on('change:qual-1-error', this.updateQualOneError, this);
            this.model.on('change:qual-2-error', this.updateQualTwoError, this);
        },
        getTemplate: function(){
            if (this.model.get('sname') === 'po'){
                return poLowerTemplate;
            }
            return lowerRowTemplate;
        },
        handleSelect : function(evt){
            var id = $(evt.target).find(':selected').data('fileien');
            var cat = $(evt.target).find(':selected').data('category');
            this.model.setQualifier(cat, id);
        },

        handleInput : function(evt){
            //special case for Operational Data inputs
            var val = $(evt.target).val();
            if ($(evt.target).data('name') === this.model.get('qual-1-sname')){
                this.model.setFlowRate(val);
            } if ($(evt.target).data('name') === this.model.get('qual-2-sname')){
                this.model.setOxiConc(val);
            }
        },
        toggleOnPass : function(){
             var onPass = this.model.get('on-pass');
             if (onPass){
                helper.resetAllQualifierInputs();
             }
        },
        updateQualifierValue: function(){
            var reading = this.model.getReading();
            $('#' +this.model.get('sname') +'-reading').val(reading);
        },

        updateQualOneError: function(){
            var error = this.model.get('qual-1-error');
            if (error){
                helper.showQualifierError(this.model.get('qual-1-sname'), this.model.get('qual-1-hint'));
            }
            else {
                helper.hideQualifierError(this.model.get('qual-1-sname'));
            }
        },

        updateQualTwoError: function(){
            var error = this.model.get('qual-2-error');
            if (error){
                helper.showQualifierError(this.model.get('qual-2-sname'), this.model.get('qual-2-hint'));
            }
            else {
                helper.hideQualifierError(this.model.get('qual-2-sname'));
            }
        },
    });
});
