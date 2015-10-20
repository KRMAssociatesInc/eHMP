define(["backbone", "underscore", "api/Messaging"], function(Backbone, _, Messaging) {

    var appletUtils = {};

    appletUtils.isChromeEnabled = function(appletConfig, viewType) {
        var viewTypeConfig = appletUtils.getViewTypeConfig(appletConfig, viewType);
        if (!_.isUndefined(viewTypeConfig) && _.isBoolean(viewTypeConfig.chromeEnabled)) {
            return viewTypeConfig.chromeEnabled;
        }
        return false;
    };
    appletUtils.getViewTypeConfig = function(appletConfig, viewType) {
        if (!viewType || typeof viewType === 'undefined' || viewType === "") {
            if (appletConfig.defaultViewType) {
                viewType = appletConfig.defaultViewType;
            } else {
                console.log("View Type: '" + viewType + "' is not available for the " + appletConfig.id + " applet.");
                return;
            }
        }
        var viewType_objectConfig = _.where(appletConfig.viewTypes, {
            type: viewType
        });
        if (viewType_objectConfig.length > 0) {
            return viewType_objectConfig[0];
        }
        console.log("View Type: '" + viewType + "' is not available for the " + appletConfig.id + " applet.");
        return;
    };
    appletUtils.getAppletView = function(appletID, viewType) {
        if (!viewType || typeof viewType === 'undefined' || viewType === "") {
            console.log("View Type: '" + viewType + "' is not available for the " + appletID + " applet.");
            return false;
        }
        var viewTypes = Messaging.getChannel(appletID).request('viewTypes');
        var viewType_objectConfig = _.where(viewTypes, {
            type: viewType
        });
        if (viewType_objectConfig.length > 0) {
            return viewType_objectConfig[0].view;
        }
        console.log("View Type: '" + viewType + "' is not available for the " + appletID+ " applet.");
        return;
    };

    return appletUtils;
});