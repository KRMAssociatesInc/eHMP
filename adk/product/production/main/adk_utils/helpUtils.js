define([
    "backbone",
    "marionette",
    "underscore",
    "_assets/js/helpMappings"
], function(Backbone, Marionette, _, helpMappings) {
    'use strict';

    var helpUtils = {
        mappingExist: function(key) {
            if (_.isUndefined(helpMappings[key])) {
                return false;
            }
            return true;
        },
        getTooltip: function(key) {
            if (helpMappings[key] === undefined) {
                console.log('Help tooltip undefined: ' + key);
                return;
            }
            return helpMappings[key].tooltip;
        },
        getUrl: function(key) {
            if (helpMappings[key] === undefined) {
                console.log('Help url undefined: ' + key);
                return "";
            }
            return helpMappings[key].url;
        },
        UrlExists: function(url, title, w, h) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url);
            http.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    if (this.status == 200) {

                        helpUtils.showHelpWindow(url, title, w, h, true);
                    } else {
                        helpUtils.showHelpWindow(helpMappings.page_not_found.url, title, '715', '320', false);
                    }
                }
            };
            http.send();
        },

        showHelpWindow: function(url, title, w, h, pdfLinkBool) {

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'location=no, menubar=no, scrollbars=yes, toolbar=no, resizable=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            if (newWindow) {
                var doLoad = function() {
                    var style = ' style="font-family: &quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size: 10pt;padding: 3px 7px;background: #ddd;border-radius: 4px;text-decoration: none;"';
                    if (pdfLinkBool) {
                        var pdfLink = '<div style="position:fixed; top:8px; right:5px;"><a id="save_as_pdf" href="' + helpMappings.pdf_version.url + '" target="_blank"' + style + '>PDF Version</a></div>';
                        $(newWindow.document).find('body').append(pdfLink);
                    }
                };

                if (newWindow.addEventListener) {
                    newWindow.addEventListener("load", doLoad, false);
                } else if (newWindow.attachEvent) {
                    newWindow.attachEvent("onload", doLoad);
                } else if (newWindow.onLoad) {
                    newWindow.onload = doLoad;
                }

                if (newWindow.focus) {
                    newWindow.focus();
                }
            }
        },
        popupCenter: function(url, title, w, h) {
            //focus the window first
            helpUtils.showHelpWindow(url, title, w, h);
            helpUtils.UrlExists(url, title, w, h);
        }
    };

    $('body').on('click', 'div.helpIconLink a.helpIconLinkAnchor', function(event) {
        var href = $(this).attr("href");
        helpUtils.popupCenter(href, 'helpIconUniqueWindow', '715', '300');

        return false;

    });

    return helpUtils;
});