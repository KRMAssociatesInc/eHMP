define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addVitals/templates/upperVitalRowTemplate',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil',
    'app/applets/addVitals/utils/viewHelper'
], function(Backbone, Marionette, _, upperRowTemplate, modelUtils, dateUtil, viewHelper) {
    'use strict';

    var util = modelUtils;
    var helper = viewHelper;

    return Backbone.Marionette.ItemView.extend({
        tagName: 'div',


        getTemplate: function(){
            return upperRowTemplate;
        },

        events: {
            'click .btn' : 'handleClick',
            'blur input' : 'handleInput',
            'change select' : 'handleSelect'
        },

        initialize: function(){
            this.model.on('change:unavailable', this.toggleUR, this);
            this.model.on('change:refused', this.toggleUR, this);
            this.model.on('change:sel-unit-name', this.toggleUnit, this);
            this.model.on('change:on-pass', this.toggleOnPass, this);
            this.model.on('change:reading', this.updateReading, this);
            this.model.on('change:error', this.updateError, this);
            this.model.on('change:refused-label', this.updateRefusedLabel, this);
            this.model.on('change:unavailable-label', this.updateUnavailableLabel, this);
        },


        onRender : function(){
            $('#' +this.model.get('sname') +'-hide-show').removeClass("show");
            $('#' +this.model.get('sname') +'-hide-show').addClass("hide");
            if (this.model.get('mask')){

                if (this.model.get('regex')){
                    this.$el.find('#' +this.model.get('sname') +'-reading').inputmask('Regex', {
                        'regex': this.model.get('mask')
                    });

                } else {
                    this.$el.find('#' +this.model.get('sname') +'-reading').inputmask(this.model.get('mask'));
                }
            }
        },

        handleInput : function(evt){
            evt.preventDefault();
            if ($(evt.target).data('type') === 'reading'){
                this.model.setReading($(evt.target).val());

            }
        },

        handleSelect : function(evt){
            //Special case for Pain
            evt.preventDefault();
            if ($(evt.target).data('type') === 'reading'){
                var value = $(evt.target).find(':selected').val();
                var shortVal = value.split(' ')[0];
                this.model.setReading(shortVal);
            }
        },

        updateReading: function(){
            var reading = this.model.getReading();
            //set value for all but pain. pain has a select box.
            if(this.model.get('sname') !== 'pa'){
                $('#' +this.model.get('sname') +'-reading').val(reading);
            }
        },

        updateError: function(){
            var error = this.model.get('error');
            if (error){
                helper.showError(this.model.get('sname'), this.model.get('hint'));
            }
            else {
                helper.hideError(this.model.get('sname'));
            }
        },

        handleClick : function(evt){
            evt.preventDefault();
            var type = $(evt.target).data('type');
            if (type === 'qualifier'){
                this.handleQualifierClick(evt);
            } else if (type === 'u-r'){
                this.model.toggleURAttribute($(evt.target).data('subtype'));
            } else if (type === 'unit'){
                this.model.toggleUnit($(evt.target).data('value'));
            }
        },

        toggleOnPass : function(){
            var onPass = this.model.get('on-pass');
            helper.enableRow(this.model.get('sname')+'-', !onPass);
            if (onPass){
                $('#' +this.model.get('sname') +'-hide-show').removeClass("show");
                $('#' +this.model.get('sname') +'-hide-show').addClass("hide");
                helper.selectBtn($('#' +this.model.get('sname') +'-q-btn'), false);
            }
        },

        toggleUnit: function(){
            var selUnit = this.model.get('sel-unit-name');
            var name = this.model.get('sname');
            var abtn = $('#' +name +'-u1-btn');
            var bbtn = $('#' +name +'-u2-btn');
            var u1name = this.model.get('unit-1-name');
            var u2name = this.model.get('unit-2-name');
            helper.updateLabel($('#' +name +'-reading'), (this.model.get('name') + ' ' +selUnit));
            if (abtn.data('value') === selUnit){
                helper.selectBtn(abtn, true, u1name);
                helper.selectBtn(bbtn, false, u2name);
           } else {
                helper.selectBtn(bbtn, true, u2name);
                helper.selectBtn(abtn, false, u1name);
           }
        },

        toggleUR : function(){
            var u = this.model.get('unavailable');
            var r = this.model.get('refused');
            var ubtn = $('#' +this.model.get('sname') +'-u-btn');
            var rbtn = $('#' +this.model.get('sname') +'-r-btn');
            var sname = this.model.get('sname');
            var qbtn = $('#' +this.model.get('sname') +'-q-btn');
            var canToggle = qbtn.data('disabled') === 'toggle';
            helper.enableInputs(sname+'-', true);
            helper.enableUnits(sname, true);
            if (canToggle){
                helper.enableItem($('#' +sname +'-q-btn'), true);
            }
            helper.selectBtn($('#' +sname +'-q-btn'), false);
            if (u || r){
                this.model.set('sel-unit-name', this.model.get('unit-1-name'));
                helper.hideError(sname);
                helper.enableUnits(sname, false);
                helper.resetRowQualifierInputs(sname);
                //$('#' +sname +'-hide-show').css("display", "none");
                $('#' +sname +'-hide-show').removeClass("show");
                $('#' +sname +'-hide-show').addClass("hide");

                helper.enableItem($('#' +sname +'-q-btn'), false);
                helper.enableInputs(sname+'-', false);
            }
            if (u){
                helper.selectBtn(ubtn, true);
                helper.selectBtn(rbtn, false);

            } else {
                helper.selectBtn(ubtn, false);
            }

            if (r){
                helper.selectBtn(rbtn, true);
                helper.selectBtn(ubtn, false);

            } else {
                helper.selectBtn(rbtn, false);
            }
        },

        updateRefusedLabel: function(){
            var lbl = this.model.get('refused-label');
            $('#' +this.model.get('sname') +'-r-btn').attr('aria-label', lbl);
        },

        updateUnavailableLabel: function(){
            var lbl = this.model.get('unavailable-label');
            $('#' +this.model.get('sname') +'-u-btn').attr('aria-label', lbl);
        },

        handleQualifierClick : function(){
            var qbtn = $('#' +this.model.get('sname') +'-q-btn');
            var element = $('#' +this.model.get('sname') +'-hide-show');
            if (helper.isSelected(qbtn)){
                helper.selectBtn(qbtn, false);
                element.removeClass("show");
                element.addClass("hide");
            } else {
                helper.selectBtn(qbtn, true);
                element.removeClass("hide");
                element.addClass("show");
            }
        }

    });
});
