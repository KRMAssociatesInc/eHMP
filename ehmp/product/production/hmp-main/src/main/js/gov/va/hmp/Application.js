/**
 * Represents an ExtJS 4 based HMP application, which is typically a single page app using a {@link gov.va.hmp.Viewport Viewport}.
 * Provides an entry point for initializing the application via {@link #launch}.
 *
 * Serves similar role as {@link Ext.app.Application} without the same strict namespacing conventions for Models/Stores/Controllers/Views.
 */
Ext.define('gov.va.hmp.Application', {
    requires:[
        'gov.va.hmp.AppContext',
        'gov.va.hmp.Controller',
        'gov.va.hmp.Viewport',
        'gov.va.hmp.BroadcastEventListener'
    ],
    mixins:{
        observable:'Ext.util.Observable'
    },
    /**
     * @cfg {String[]} controllers
     * Names of controllers that the app uses.
     */

    /**
     * @cfg {Object} scope
     * The scope to execute the {@link #launch} function in. Defaults to the Application instance.
     */
    scope:undefined,

    /**
     * @cfg {Boolean} enableQuickTips
     * True to automatically set up Ext.tip.QuickTip support.
     */
    enableQuickTips:true,
    /**
     * @cfg {Boolean} autoCreateViewport
     * True to automatically load and instantiate gov.va.hmp.Viewport before firing the launch function.
     */
    autoCreateViewport:false,
    /**
     * @cfg {Boolean} autoListenForBroadcastEvents
     * True to automatically start listening to broadcast events from the server.
     */
    autoListenForBroadcastEvents:true,

    onClassExtended:function (cls, data, hooks) {
        var j, subLn, controllerName,
            controllers = data.controllers || [],
            requires = [];

        // require all controllers
//        for (j = 0, subLn = controllers.length; j < subLn; j++) {
//            controllerName = controllers[j];
//            requires.push(controllerName);
//        }

//        if (data.autoCreateViewport) {
//            requires.push('gov.va.hmp.Viewport');
//        }

        // Any "requires" also have to be processed before we fire up the App instance.
        if (requires.length) {
            onBeforeClassCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function (cls, data) {
                var args = Ext.Array.clone(arguments);

                Ext.require(requires, function () {
                    return onBeforeClassCreated.apply(this, args);
                });
            };
        }
    },

    /**
     * Creates new Application.
     * @param {Object} [config] Config object.
     */
    constructor:function (config) {
        var me = this,
            controllers;

        config = config || {};
        Ext.apply(this, config);

        me.mixins.observable.constructor.call(this);

        me.callParent(arguments);

        controllers = Ext.Array.from(me.controllers);
        me.controllers = new Ext.util.MixedCollection();

//            console.log("init()");
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

        me.doInit(me);

        var ln, i, controller;
        ln = controllers && controllers.length;
        for (i = 0; i < ln; i++) {
            controller = me.getController(controllers[i]);
            controller.doInit(me);
        }

//            console.log("AppContext.load()");
        // trigger launch sequence after AppContext has loaded
        gov.va.hmp.AppContext.load(function () {
//                console.log("AppContext loaded()");
            me.onBeforeLaunch.call(me);
        }, me);
    },
    doInit:function (app) {
        if (!this._initialized) {
            this.init(app);
            this._initialized = true;
        }
    },
    /**
     * A template method that is called when your application boots. It is called before the
     * {@link Ext.app.Application Application}'s launch function is executed so gives a hook point to run any code before
     * your Viewport is created.
     *
     * @param {gov.va.hmp.Application} application
     * @template
     */
    init:Ext.emptyFn,

    /**
     * @method
     * @template
     * Called automatically when the page has completely loaded. This is an empty function that should be
     * overridden by each application that needs to take action on page load.
     * @param {String} profile The detected application profile
     * @return {Boolean} By default, the Application will dispatch to the configured startup controller and
     * action immediately after running the launch function. Return false to prevent this behavior.
     */
    launch:Ext.emptyFn,

    /**
     * @private
     */
    onBeforeLaunch:function () {
//        console.log("onBeforeLaunch()");
        var me = this,
            controllers, c, cLen, controller;

        if (me.enableQuickTips) {
            Ext.tip.QuickTipManager.init();
        }

        if (me.autoCreateViewport) {
            Ext.create('gov.va.hmp.Viewport');
        }

        if (window.splashTimer) {
            clearTimeout(window.splashTimer);
        }

        var splash = Ext.select('#splash');
        if (splash) {
//            var task = Ext.create('Ext.util.DelayedTask', function() {
            // Fade out the splash
            splash.fadeOut({
                duration: 300,
                remove: true
            });
//            });
//            task.delay(50);
        }

        me.launch.call(this.scope || this);
        me.launched = true;

        me.fireEvent('launch', this);

        // call onLaunch() on all controllers
        controllers = me.controllers.items;
        cLen = controllers.length;

        for (c = 0; c < cLen; c++) {
            controller = controllers[c];
            controller.onLaunch(this);
        }

        if (me.autoListenForBroadcastEvents) {
            gov.va.hmp.BroadcastEventListener.startListener();
        }
    },
    getController:function (name) {
        var me = this,
            controllers = me.controllers,
            controller = controllers.get(name);

        if (!controller) {
            controller = Ext.create(name, {
                application:me,
                id:name
            });

            controllers.add(controller);
            if (me._initialized) {
                controller.doInit(me);
            }
        }
        return controller;
    },
    /**
     * @inheritdoc Ext.Loader#loadScript
     */
    loadScript:function(options) {
        Ext.Loader.loadScript(options);
    },
    /**
     * Loads the specified stylesheet URL and calls the supplied callbacks.
     *
     * @param {String} url The URL from which to load the stylesheet.
     */
    loadStylesheet:function(url) {
        // Get a reference to the HEAD element of the HTML page.
        // document.head is more efficient but only works in HTML5.
        var head = document.head || document.getElementsByTagName('head')[0];
        // Dynamically add a CSS reference to the HEAD element.
        var linkEl = document.createElement('link');
        linkEl.type = 'text/css';
        linkEl.rel = 'stylesheet';
        linkEl.href = url;
        head.appendChild(linkEl);
    }
});