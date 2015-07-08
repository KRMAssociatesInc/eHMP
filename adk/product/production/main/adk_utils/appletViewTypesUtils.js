define(["backbone", "underscore"], function(Backbone, _) {

    var AppletViewTypesUtils = {};

    AppletViewTypesUtils.isChromeEnabled = function(appletConfig, viewType) {
        var viewTypeConfig = AppletViewTypesUtils.getViewTypeConfig(appletConfig, viewType);
        if (!_.isUndefined(viewTypeConfig) && _.isBoolean(viewTypeConfig.chromeEnabled)){
            return viewTypeConfig.chromeEnabled;
        }
        return false;
    };
    AppletViewTypesUtils.getViewTypeConfig = function(appletConfig, viewType) {
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

    return AppletViewTypesUtils;
});
