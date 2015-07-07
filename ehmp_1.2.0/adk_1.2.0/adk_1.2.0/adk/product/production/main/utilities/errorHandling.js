/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $, define, navigator, window, document, nativeAuthLib */

'use strict';
define([ 'jquery', 'underscore', 'Portal', 'core/utilities/authentication', 'modules/error-dialog/ErrorDialogView' ], function ($, _, Portal, authentication, ErrorDialogView) {
    return (function () {
        var _errorHandling = {},
            defined = false;

        _errorHandling.setupAjaxErrorHandling = function () {
            if (!defined) {
                Portal.vent.on('error', function (options) {
                    new ErrorDialogView(options).render();

                    if (console && console.log) {
                        console.log("Logged error: " + options.message);
                    }
                });

                $(document).ajaxError(function (e, jqxhr, settings, exception) {
                    var loginUrl;
                    function displayErrorDialog() {
                        Portal.vent.trigger('error', {
                            message: 'Unknown error\nurl: ' + settings.url + '\nstatus code: ' + jqxhr.status
                        });
                    }

                    if (jqxhr.status === 401 || jqxhr.status === 403) {
                        // Should only happen for 401, but HA returns incorrect 403 status code for unauthenticated
                        authentication.wipeSessionData();

                        console.log("errorHandling.js resource directory access - consider decoupling");
                        loginUrl = Portal.resources().get('oauth-login').get('href');
                        authentication.gotoLoginWithRedirect(loginUrl);

                    } else if (jqxhr.status === 500) {
                        if (jqxhr.responseText.indexOf('java.lang') > 0) {
                            displayErrorDialog.call();
                        }
                    } else if (jqxhr.status !== 0 && jqxhr.status !== 200 && jqxhr.status !== 400 && jqxhr.status === 404) {
                        displayErrorDialog.call();
                    }
                });

                defined = true;
            }
        };

        return _errorHandling;
    }());
});
