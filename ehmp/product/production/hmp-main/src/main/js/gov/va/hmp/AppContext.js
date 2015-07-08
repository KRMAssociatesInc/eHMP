/**
 * Singleton for tracking the currently selected HMP 'app'.
 */
Ext.define('gov.va.hmp.AppContext', {
    requires:[
        'gov.va.hmp.UserContext',
        'gov.va.hmp.CcowContext'
    ],
    singleton:true,
    config:{
        /**
         * @cfg {Object} appInfo
         * @cfg {String} appInfo.displayName
         * @cfg {String} appInfo.app
         * @cfg {Object} appInfo.env System environment of server JVM. (See java.lang.System.getenv())
         * @cfg {Object} appInfo.system System properties of server JVM. (See java.lang.System.getProperties())
         * @cfg {Object} appInfo.props HMP specific properties.
         */
        appInfo:{}
    },
    /**
     *
     * @returns {String}
     */
    getVersion:function() {
        var appInfo = this.getAppInfo();
        if (appInfo.props && appInfo.props['hmp.version']) {
            return appInfo.props['hmp.version'];
        } else {
            Ext.Error.raise('Expected hmp.version property to be set');
        }
    },
    /**
     *
     * @returns {Date}
     */
    getBuildDate:function() {
        var appInfo = this.getAppInfo();
        if (appInfo.props && appInfo.props['hmp.build.date']) {
            return Ext.Date.parse(appInfo.props['hmp.build.date'], 'Y-m-d H:i:s T');
        } else {
            Ext.Error.raise('Expected hmp.build.date property to be set');
        }
    },

    /**
     *
     * @returns {String}
     */
    getBuildDateString:function() {
        return Ext.Date.format(this.getBuildDate(), 'F j, Y');
    },

    /**
     *
     * @returns {String}
     */
    getBuildNumber:function() {
        var appInfo = this.getAppInfo();
        if (appInfo.props && appInfo.props['hmp.build.number']) {
            return appInfo.props['hmp.build.number'];
        } else {
            Ext.Error.raise('Expected hmp.build.number property to be set');
        }
    },
    /**
     *
     * @returns {String}
     */
    getBuildString:function() {
        return "Build #" + this.getBuildNumber() + ", built on " + this.getBuildDateString();
    },
    /**
     * Loads AppContext and UserContext with currently selected app and logged in user.
     * @param fn
     * @param scope
     */
    load:function(fn, scope) {
        var me = this;
        me.ajaxRequest = Ext.Ajax.request({
            url:'/app/info',
            callback: me.onLoad,
            scope: me,
            fn: fn
        });
    },
    /**
     * @private
     */
    onLoad:function (options, success, response) {
        var me = this;
        if (success) {
            var jsonc = Ext.JSON.decode(response.responseText);
            var appInfo = jsonc.data;

            // UserContext integration
            gov.va.hmp.UserContext.setUserInfo(appInfo.userInfo);
            gov.va.hmp.UserContext.setUserPrefs(appInfo.userPrefs);
            gov.va.hmp.CcowContext.ccowErrorState = appInfo.ccowDisabled;
            if(appInfo.authenticatedJiraUser!=null) {
                gov.va.hmp.jira.JiraAuth.sessionAuthenticated = true;
                gov.va.hmp.jira.JiraAuth.username = appInfo.authenticatedJiraUser;
            }
            // remove the user-related stuff now that it has been set in UserContext
            delete appInfo.userInfo;
            delete appInfo.userPrefs;

            me.setAppInfo(appInfo);
        } else {
            // TODO: report this error or sommat?
        }

        if (Ext.isDefined(options.fn)) {
            options.fn.call(options.scope || me, success);
        }
    }
//    applyAppInfo:function (appInfo) {
//        this.appInfo = appInfo;
//        if (Ext.isDefined(this.listeners) && this.listeners != null) {
//            for (var i = 0; i < this.listeners.length; i++) {
//                this.listeners[i].fn.call(this.listeners[i].scope || this.appInfo, this.appInfo);
//            }
//            delete this.listeners;
//        }
//    },
    /**
     *
     * @param {Function} fn
     */
//    onAvailable:function (fn, scope) { // TODO: maybe rename this onReady?
//        if (!Ext.isDefined(this.ajaxRequest)) {
//            fn.call(scope || this.appInfo, this.appInfo);
//        } else {
//            // meh
//            this.listeners = new Array();
//            this.listeners.push({fn:fn, scope:scope});
//        }
//    }
});