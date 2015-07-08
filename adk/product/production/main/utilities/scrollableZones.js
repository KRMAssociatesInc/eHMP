/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $, define, navigator, window */

'use strict';
define([ 'jquery', 'Portal' ], function ($, Portal) {
    return (function () {
        var _scrollableZones = {};

        _scrollableZones.calculateHeight = function calculate() {
            var populatedZones =
                $(Portal.infobarRegion.el).outerHeight() +
                $(Portal.infobarFooterRegion.el).outerHeight() +
                $(Portal.infobarSubRegion.el).outerHeight() - 6;
                // -6 from overlapping borders and position top/bottom of fixed headers and footers

            return ('height:' + ($(window).innerHeight() - populatedZones) + 'px');
        };

        _scrollableZones.register = function register() {
            var that = this;
            $(window).resize(function () {
                $('.scrollable').not('.scrollable-main').attr('style', that.calculateHeight());
            });
        };
        _scrollableZones.androidFix = function androidFix() {
            var $mainScroll = $('.scrollable-main').eq(0),
                calcHeight = $('footer').position().top-$('header').height();
            console.log(calcHeight);

            var getAndroidVersion = function getAndroidVersion(ua) {
                var userAgent = ua || navigator.userAgent;
                var match = userAgent.match(/Android\s([0-9\.]*)/);
                return match ? match[1] : false;
            };

            if(getAndroidVersion()){
                //alert(getAndroidVersion());
                $mainScroll.height(Math.floor(calcHeight));
            } else {
                $mainScroll.css('height', 'calc(100%-122px)');
            }
        };
        return _scrollableZones;
    }());
});
