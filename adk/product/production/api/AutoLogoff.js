define([
    'underscore',
    'jquery',
    'api/Navigation',
    'api/UserService',
    'api/Messaging',
    'main/components/views/popupView'
], function(_, $, Navigation, UserService, Messaging, popupView) {

    /**
     * AutoLogoff intends to ensure the user has a resonably up to date token
     * based on application usage. After 12 min of inacctivity a popup
     * asking the user if they would like to continue or logoff will display
     * (but also allow for ignoring the popup)
     * @return {Object}
     */
    var AutoLogoff = function() {

        var _this = this || {};

        // this will hold the token setTimeout
        var tokenTimer;
        // this will hold the logoff setInterval
        var logoffTimer;
        // when popups start do not allow user interaction to refresh the token until continue is
        // clicked or the user has navigated to another route
        var refreshAllowed = true;

        // just holds whether the timers are started
        var timersStarted = false;

        // set a default of 15 seconds to refresh the token
        _this.tokenInterval = 15000;

        /**
         * Do the refreshing of token expiration on the server
         * @return {undefined}
         */
        var refreshToken = function() {
            if (refreshAllowed) {
                UserService.refreshUserToken();
                refreshAllowed = false;
            }
        };

        /**
         * Clearns the timer interval
         */
        var clearTokenTimer = function() {
            if (tokenTimer) {
                clearInterval(tokenTimer);
            }
        };

        /**
         * displays the popup to the user
         * @param  {popupView} popup the popup to be displayed to the user
         */
        var envokePopupModal = function(popup) {
            if (_.isObject(popup)) {
                refreshAllowed = false;
                popupView.setModel(popup, false);
                popupView.show();
            }
        };
        /**
         * displays the logout popup to the user
         * @param  {popupView} popup the logout view to be displayed to the user
         */
        var envokeLogoutModal = function(popup) {
            if (_.isObject(popup)) {
                refreshAllowed = false;
                popupView.logout(popup);
            }

        };

        /**
         * Stops all refresh events on the document
         */
        var stopRefreshEvents = function() {
            $(document).off('mouseup.autologoff mousedown.autologoff mousemove.autologoff keyup.autologoff keydown.autologoff');
        };

        /**
         * Displays the auto logoff warning to the user
         * @param  {popupView} popup    the popup to be displayed to the user
         * @param  {int} minsLeft   the amount of time left before logging out
         */
        var showLogoffWarning = function(popup, minsLeft) {
            //remove the event listeners
            stopRefreshEvents();

            //append the text to the header
            popup.header += minsLeft + ' minute';
            if (minsLeft > 1) {
                popup.header += 's';
            }
            popup.header += '.';

            //show the popup
            envokePopupModal(popup);

            //turn off refresh until the popup is dismissed
            refreshAllowed = false;
        };

        var checkToken = function() {
            // check if the token is still valid
            // if not popup a window
            refreshToken();
            var timeLeft = UserService.checkUserToken();
            var popup = popupView.getDefaultModel();
            popup.title = 'Warning: Login Session Ending.';
            popup.header = 'Your user session will time out in ';
            popup.body = 'To help ensure/protect your information, your user session times out after 15 minutes';
            popup.footer = 'If you are actively using your app, simply tap Continue to reset the session. You can also tap Logout to logout of your user session now.';
            popup.buttons = true;

            switch (timeLeft) {
                case 3:
                    showLogoffWarning(popup, timeLeft);
                    break;
                case 2:
                    showLogoffWarning(popup, timeLeft);
                    break;
                case 1:
                    showLogoffWarning(popup, timeLeft);
                    break;
                case 0:
                    popup.title = 'Warning: You Have Been Logged Out';
                    popup.header = 'You\'ve been logged out due to inactivity.';
                    popup.body = '';
                    popup.footer = 'To help ensure/protect your information, your user session times out after 15 minutes';
                    popup.buttons = false;
                    envokeLogoutModal(popup);
                    break;
                default:
                    //do nothing
                    break;
            }

        };

        var clearLogoffTimer = function() {
            if (logoffTimer) {
                clearInterval(logoffTimer);
            }
        };

        var resetLogoffTimer = function() {
            clearLogoffTimer();
            logoffTimer = setInterval(checkToken, _this.tokenInterval);
        };

        /**
         * On a login event the timers are started
         * @return undefined
         */
        var startTimers = function(e) {
            if (!timersStarted) {
                //set up the event listners for a user's interactions
                stopRefreshEvents();
                $(document).on('mouseup.autologoff mousedown.autologoff mousemove.autologoff keyup.autologoff keydown.autologoff', function(e) {
                    refreshAllowed = true;
                });

                //kickoff the LogoffTimer
                resetLogoffTimer();
                //started the timers
                timersStarted = true;
            }
        };

        /**
         * On a logoff event the timers are stopped
         * @return undefined
         */
        var stopTimers = function(e) {
            //clear the timers
            clearLogoffTimer();
            clearTokenTimer();
            //remove the event listeners
            stopRefreshEvents();
            //sliently reset the model for the popupView
            popupView.setModel(popupView.getDefaultModel(), true);
            //timers stopped
            timersStarted = false;
        };

        // add event listeners listening when the user logs in and logs out
        Messaging.on('user:sessionStart user:sessionCheck', function() {
            if (UserService.getStatus() === UserService.STATUS.LOGGEDIN) {
                startTimers();
            }
        });
        Messaging.on('user:sessionEnd', stopTimers);
        Messaging.on('autologoff:continue', function() {
            refreshAllowed = true;
            refreshToken();
            resetLogoffTimer();
            stopRefreshEvents();
            //set up the event listners for a user's interactions
            $(document).on('mouseup.autologoff mousedown.autologoff mousemove.autologoff keyup.autologoff keydown.autologoff', function(e) {
                refreshAllowed = true;
            });
        });

        return _this;

    };

    var autologoff = new AutoLogoff();


    return autologoff;
});
