define(['jquery', 'moment', 'underscore'], function($, Moment, _) {

    var DateUtils = {};

    var regex = /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/g,
        dpFormat = 'MM/DD/YYYY',
        config = function() {
            return {
                format: dpFormat.toLowerCase(),
                placeholder: dpFormat,
                regex: regex,
                clearIncomplete: true,
                todayHighlight: true,
                endDate: new Moment().format(dpFormat),
                startDate: new Moment('01/01/1900', dpFormat).format(dpFormat),
                keyboardNavigation: false,
                onincomplete: function(e) { //Required to ensure model is sync'd to field
                    $(this).val('').trigger('change');
                },
                inputmask: 'm/d/y',
                autoclose: true
            };
        }();

    DateUtils.datepicker = function(el, options) {
        var datePickerConfig = config,
            opts = options || {};

        _.extend(datePickerConfig, opts);

        el.datepicker(datePickerConfig).data({
            //Set the data against the DOM element
            value: datePickerConfig.initialDate,
            regex: datePickerConfig.regex,
            format: datePickerConfig.format,
            autoclose: datePickerConfig.autoclose,
            dateUtilsOptions: datePickerConfig
        }).inputmask(datePickerConfig.inputmask, datePickerConfig).prop('placeholder', datePickerConfig.placeholder);
    };

    DateUtils.defaultOptions = function() {
        return config;
    };

    DateUtils.getRdkDateTimeFormatter = function() {
        return {
            getCurrentDate: function() {
                return new Moment().format("YYYYMMDD");
            },

            getCurrentTimeWithZeroSeconds: function() {
                return new Moment().format("HHmm") + "00";
            },

            getCurrentTime: function() {
                return new Moment().format("HHmmss");
            },

            getDateFromDateString: function(dateString) {
                return new Moment(dateString, dpFormat).format("YYYYMMDD");
            },

            getDateTimeFromDateTimeStrings: function(date, time) {
                var input = new Moment(date + ' ' + time + 'm');
                if (!input.isValid()) {
                    return 0;
                } else {
                    return input.format('YYYYMMDDHHmm');
                }
            }
        };
    };

    return DateUtils;
});
