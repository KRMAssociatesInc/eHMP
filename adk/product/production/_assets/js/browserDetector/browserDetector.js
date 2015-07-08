define([
	'underscore',
    'bowser',
    './browserManifest'
], function(_, Bowser, browserList) {

    var BrowserDetector = {
        enforceBrowserType: function() {
        	var browserSupported = undefined;
        	var alertMessage = 'WARNING: The application you are trying to access has not been fully tested with ' + Bowser.name + ' v.' + Bowser.version;
            _.each(browserList.browsers, _.bind(function(item) {
                if (Bowser[item.name] && (_.isUndefined(browserSupported) || browserSupported)) {
                    if (item.supported && (JSON.parse(Bowser.version) >= item.supported)) {
                        browserSupported = true;
                        return;
                    } else if (item.minimumAllowed && (JSON.parse(Bowser.version) >= item.minimumAllowed)) {
                        alert(alertMessage);
                        browserSupported = true;
                        return;
                    }
                    browserSupported = false;
                    this.redirectToBrowserUnsupportedPage();
                }
            }, this));
            if (_.isUndefined(browserSupported)) {
            	alert(alertMessage);
            }
            browserSupported = _.isBoolean(browserSupported) ? browserSupported : false;
            return browserSupported;
        },
        redirectToBrowserUnsupportedPage: function() {
            window.location = './browser-not-supported.html';
        }
    };

    return BrowserDetector;


});
