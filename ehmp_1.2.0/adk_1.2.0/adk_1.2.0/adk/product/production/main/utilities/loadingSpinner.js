/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $, define, navigator, window */

'use strict';
define([ 'jquery' ], function ($) {
    return (function () {
        var _loadingSpinner = {};
        _loadingSpinner.showing = false;

        _loadingSpinner.register = function register() {
            $(window.document)
                .ajaxStart(function () {
                    _loadingSpinner.show();
                    _loadingSpinner.showing = true;
                })
                .ajaxStop(function () {
                    _loadingSpinner.hide();
                    _loadingSpinner.showing = false;
                })
                .ajaxError(function () {
                    // sometimes errors cause the spinner to hide, re-show it
                    if (_loadingSpinner.showing) {
                        _loadingSpinner.show();
                    }
                });
        };

        _loadingSpinner.show = function(withMask){
            if (withMask) { $("body").append('<div class="loaderModalMask"/>'); }
            $.mobile.loading('show', {
                text: 'Loading',
                textVisible: true,
                theme: 'a',
                html: ""
            });
        };

        _loadingSpinner.hide = function(){
            $('.loaderModalMask').remove();
            $.mobile.loading('hide');
        };

        return _loadingSpinner;
    }());
});
