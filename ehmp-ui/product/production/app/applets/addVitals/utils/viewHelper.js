define([
    'backbone',
    'marionette',
    'underscore',
    'moment',
    'app/applets/addVitals/utils/dateTimeUtil'

], function(Backbone, Marionette, _, Moment, dateUtil) {
    'use strict';

    var helper = {
        selectBtn : function(btn, isSelect, name){
            if (isSelect){
                btn.removeClass('btn-default');
                btn.addClass('btn-primary');
                if (name){
                    this.updateLabel(btn, name +' selected');
                }
            } else {
                btn.removeClass('btn-primary');
                btn.addClass('btn-default');
                if (name){
                    this.updateLabel(btn, name);
                }
            }
        },

        updateLabel : function(element, label){
            element.attr('aria-label', label);

        },

        isSelected: function(btn){
            return btn.hasClass('btn-primary');
        },

        enableItem : function(item, isEnabled){
            item.prop('disabled', !isEnabled);
        },

        showDisabledRowMessage: function(sname, isEnabled){
            if (!isEnabled){
                $('#'+sname+'-row').attr('aria-label', 'U or R selected. Vitals disabled.');
                $('#'+sname+'-row').attr('role', 'alert');
            } else {
                $('#'+sname+'-row').attr('aria-label', '');
                $('#'+sname+'-row').removeAttr('role');
            }
        },

        enableRow : function(itemPartialId, isEnabled){
            var bgcolor = isEnabled ? '#000' : '#666';
            $('*[data-disabled="toggle"]').prop('disabled', !isEnabled);
            $("input[id^='"+itemPartialId+"']").prop('disabled', !isEnabled);
            $("select[id^='"+itemPartialId+"']").prop('disabled', !isEnabled);
            $("div[id^='"+itemPartialId+"']").css({color:bgcolor});
            $("label[id^='"+itemPartialId+"']").css({color:bgcolor});
            var tabindex = isEnabled? '0' : '-1';
            $('#'+itemPartialId+'inner-error-container').attr('tabindex', tabindex);
        },

        enableInputs : function(itemPartialId, isEnabled){
            var bgcolor = isEnabled ? '#000' : '#666';
            $("label[id^='"+itemPartialId+"']").css({color:bgcolor});
            $("div[id^='"+itemPartialId+"']").css({color:bgcolor});
            $("select[id^='"+itemPartialId+"']").prop('disabled', !isEnabled);
            $("input[id^='"+itemPartialId+"']").prop('disabled', !isEnabled);
        },

        enableUnits: function(sname, isEnabled){
            var bgcolor = isEnabled ? '#000' : '#666';
            $('#'+sname+'-u1-btn').prop('disabled', !isEnabled);
            $('#'+sname+'-u2-btn').prop('disabled', !isEnabled);
            $('#'+sname+'-unit-label').css({color:bgcolor});
        },

        resetAllQualifierInputs : function(){
            $('*[data-type="qualifier-options"]').each(function(){
                $(this).children('option:eq(0)').prop('selected', true);
            });
            $('*[data-type="qualifier-input"]').each(function(){
                $(this).val('');
            });
        },

        resetRowQualifierInputs : function(rname){
            $('#'+rname+'-hide-show select').each(function(){
                $(this).children('option:eq(0)').prop('selected', true);
            });
            $('#'+rname+'-hide-show input').each(function(){
                $(this).val('');
            });
        },

        showError: function(sname, errorText){
            $('#'+sname+'-inner-error-container').text(errorText);
        },

        hideError: function(sname, errorText){
            $('#'+sname+'-inner-error-container').text('');
        },

        showQualifierError: function(sname, errorText){
            $('#'+sname+'-error').text(errorText);

        },

        hideQualifierError: function(sname, errorText){
            $('#'+sname+'-error').text('');
        }


    };

    return helper;
});
