/**
 * Component that implements Twitter Bootstrap Alerts.
 *
 * @see "http://twitter.github.com/bootstrap/components.html#alerts"
 */
Ext.define('gov.va.hmp.ux.Alert', {
    extend: 'Ext.Component',
    statics: {
        error: function (msg, title) {
            return this.show({
                msg: msg,
                title: title,
                ui: 'error'
            });
        },
        warn: function (msg, title) {
            return this.show({
                msg: msg,
                title: title,
                ui: 'warning'
            });
        },
        success: function (msg, title) {
            return this.show({
                msg: msg,
                title: title,
                ui: 'success'
            });
        },
        info: function (msg, title) {
            return this.show({
                msg: msg,
                title: title,
                ui: 'info'
            });
        },
        show: function (config) {
            var cfg = Ext.applyIf(config, {
//               floating: true
            });
            var alert = Ext.widget('alert', cfg);
            if (alert.floating) {
                alert.show();
            }
            return alert;
        }
    },
    alias: 'widget.alert',
    baseCls: 'alert',
    ui: 'warning',
    config: {
        /**
         * @cfg {String} [title=null]
         * The button title to be used nested in a <strong> element (html tags are accepted).
         */
        title: null,
        /**
         * @cfg {String} msg
         * The alert msg to be used as innerHTML (html tags are accepted).
         */
        msg: '&#160;',
        /**
         * @cfg {Object} detail
         * An object to be displayed as detail
         */
        detail: null
    },
    /**
     * @cfg {Boolean} block
     * True to display a block alert for longer messages (defaults to false)
     */
    block: false,
    /**
     * @cfg {Boolean} closable
     * True to display the 'close' button and allow the user to close the Alert, false to hide the button and
     * disallow closing the window.
     *
     * By default, when close is requested by either clicking the close button pressing ESC when the
     * Alert has focus, the {@link #method-close} method will be called. This will _{@link Ext.Component#method-destroy destroy}_ the
     * Alert and its content meaning that it may not be reused.
     *
     * To make closing a Alert _hide_ the Window so that it may be reused, set {@link #closeAction} to 'hide'.
     */
    closable: true,
    /**
     * @cfg {String} closeAction
     * The action to take when the close button is clicked:
     *
     * - **`'{@link #method-destroy}'`** :
     *
     *   {@link #method-remove remove} the alert from the DOM and {@link Ext.Component#method-destroy destroy} it and all descendant
     *   Components. The alert will **not** be available to be redisplayed via the {@link #method-show} method.
     *
     * - **`'{@link #method-hide}'`** :
     *
     *   {@link #method-hide} the alert by setting visibility to hidden and applying negative offsets. The window will be
     *   available to be redisplayed via the {@link #method-show} method.
     *
     * **Note:** This behavior has changed! setting *does* affect the {@link #method-close} method which will invoke the
     * approriate closeAction.
     */
    closeAction: 'destroy',
    tpl: '<tpl if="closable"><button id="{id}-closeEl" type="button" class="close">&times;</button></tpl>' +
        '<tpl if="block">' +
        '<tpl if="title"><h4>{title}</h4></tpl>' +
        '<div>{msg}</div>' +
        '<tpl if="detail">' +
        '<button id="{id}-detailToggleEl" class="btn btn-link btn-small" style="margin: 0; padding: 0">Show Details</button>' +
        '{detail}' +
        '</tpl>' +
        '<tpl else>' +
        '<tpl if="title"><strong>{title}</strong>&nbsp;</tpl>' +
        '{msg}' +
        '</tpl>',
    detailTpl: new Ext.XTemplate('<div id="{id}-detailEl" style="display: none">{detail}</div>'),
    constructor: function (cfg) {
        this.initConfig(cfg);
        return this.callParent(arguments);
    },
    initComponent: function () {
        var data = this.data || {};
        Ext.applyIf(data, this.getTemplateArgs());
        this.data = data;

        if (this.ui === 'error') this.ui = 'danger'; // bootstrap 3 alert class is now 'danger' instead of 'error'

        this.callParent(arguments);

        this.addEvents(
            /**
             * @event beforeclose
             * Fires before the user closes the alert. Return false from any listener to stop the close event being
             * fired
             * @param {gov.va.hmp.ux.Alert} panel The Alert object
             */
            'beforeclose',

            /**
             * @event close
             * Fires when the user closes the alert.
             * @param {gov.va.hmp.ux.Alert} panel The Alert object
             */
            'close',

            /**
             * @event titlechange
             * Fired when the alert's title is changed by the {@link #setTitle} method.
             * @param {gov.va.hmp.ux.Alert} The Alert object
             * @param {String} oldTitle
             * @param {String} newTitle
             */
            'titlechange',

            /**
             * @event msgchange
             * Fired when the alert's msg is changed by the {@link #setMsg} method.
             * @param {gov.va.hmp.ux.Alert} The Alert object
             * @param {String} oldMsg
             * @param {String} newMsg
             */
            'msgchange',
            /**
             * @event detailchange
             * Fired when the alert's detail is changed by the {@link #setDetail} method.
             * @param {gov.va.hmp.ux.Alert} The Alert object
             * @param {Object} oldDetail
             * @param {Object} newDetail
             */
            'detailchange'
        );

    },
    beforeRender:function() {
        if (this.block) {
            this.addCls('alert-block');
        }

        this.callParent(arguments);
    },
    afterRender:function() {
        var me = this;
        me.callParent(arguments);
        if (me.closable) {
            var closeEl = Ext.get(me.getId() + '-closeEl');
//            closeEl.on('click', function() { console.log("fefefafadfer"); });
            me.mon(closeEl, 'click', me.close, me);
        }
        if (me.block) {
            var detailEl = Ext.get(me.getId() + '-detailEl');
            detailEl.setVisibilityMode(Ext.dom.AbstractElement.DISPLAY);
            var detailToggleEl = Ext.get(me.getId() + '-detailToggleEl');
            me.mon(detailToggleEl, 'click', function() {
                var label = detailToggleEl.getHTML();
                if (label == 'Show Details') {
                    detailToggleEl.setHTML('Hide Details');
                } else {
                    detailToggleEl.setHTML('Show Details');
                }
                detailEl.toggle();
            });
        }
    },

    /**
     * Sets this Alert's title
     * @param {String} title The alert title
     * @return {gov.va.hmp.ux.Alert} this
     */
    setTitle: function (title) {
        title = title || '';
        var me = this,
            oldTitle = me.title || '';

        if (title != oldTitle) {
            me.title = title;
            if (me.rendered) {
                me.update(me.getTemplateArgs());
                me.updateLayout();
            }
            me.fireEvent('titlechange', me, oldTitle, title);
        }
        return me;
    },
    /**
     * Sets this Alert's msg
     * @param {String} msg The alert message
     * @return {gov.va.hmp.ux.Alert} this
     */
    setMsg: function (msg) {
        msg = msg || '';
        var me = this,
            oldMsg = me.msg || '';

        if (msg != oldMsg) {
            me.msg = msg;
            if (me.rendered) {
                me.update(me.getTemplateArgs());
                me.updateLayout();
            }
            me.fireEvent('msgchange', me, oldMsg, msg);
        }
        return me;
    },
    /**
     * Sets this Alert's detail
     * @param {Object} detail The detail object
     * @return {gov.va.hmp.ux.Alert} this
     */
    setDetail: function (detail) {
        detail = detail || {};
        var me = this,
            oldDetail = me.detail || {};

        if (detail != oldDetail) {
            me.detail = detail;
            if (me.rendered) {
                me.update(me.getTemplateArgs());
                me.updateLayout();
            }
            me.fireEvent('detailchange', me, oldDetail, detail);
        }
        return me;
    },
    /**
     * Closes the Alert. By default, this method, removes it from the DOM, {@link Ext.Component#method-destroy destroy}s the
     * Alert object and all its descendant Components. The {@link #beforeclose beforeclose} event is fired before the
     * close happens and will cancel the close action if it returns false.
     *
     * **Note:** This method is also affected by the {@link #closeAction} setting. For more explicit control use
     * {@link #method-destroy} and {@link #method-hide} methods.
     */
    close: function() {
        if (this.fireEvent('beforeclose', this) !== false) {
            this.doClose();
        }
    },
    // @private
    doClose: function() {
        this.fireEvent('close', this);
        this[this.closeAction]();
    },
    // @private
    getTemplateArgs: function () {
        return {
            id: this.getId(),
            title: this.getTitle(),
            msg: (this.getMsg() || '&#160;'),
            detail: this.detailTpl.apply({
                id: this.getId(),
                detail: this.getDetail()
            }),
            block: this.block,
            closable: this.closable
        };
    }
});