Ext.define('gov.va.hmp.ux.PopUpButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.popupbutton',
    requires: [
         'gov.va.hmp.ux.PopupMenu'      
    ],
    ui: 'popup',
    /**
     * @cfg {String} closeButtonText
     */
    closeButtonText: '',
    listeners: {
        menushow: function (btn, menu) {
            if (btn.getWidth() > menu.getWidth() && !Ext.isDefined(menu.getComponent(0).preserveWidth)) {
                menu.setWidth(btn.getWidth());
            }
            if (btn.popUp.loader) {
                menu.getComponent(0).getLoader().load();
            }
            if ( Ext.isDefined(menu.getComponent(0).loadOnPatientChange) ) {
                menu.getComponent(0).loadOnPatientChange();
            }
        }
    },
    // private
    initComponent: function () {
        var me = this;

        /**
         * @cfg {Ext.Component/String/Object} popUp
         * Convenience config.
         *
         *      popUp: {
         *          xtype: 'component',
         *          html: '<div>foo</div>'
         *      }
         *
         * is equivalent to
         *
         *      menu: {
         *          items: [
         *              {
         *                  xtype: 'component',
         *                  html: '<div>foo</div>'
         *              }
         *          ]
         *      }
         */
        if (Ext.isDefined(me.popUp)) {
            if (Ext.isString(me.popUp.tpl) || Ext.isArray(me.popUp.tpl)) {
                me.popUp.tpl = Ext.create('Ext.XTemplate', me.popUp.tpl);
            }
            me.menu = {
            	xtype: 'popupmenu',
                items: [
                    Ext.applyIf(me.popUp, {
                        height: 360,
                        width: 200
                    })
                ],
                fbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: 'Close',
                        handler: function (btn) {
                            me.hideMenu();
                        }
                    }
                ]
            };
        }
        /**
         * @cfg {Ext.Component/String/Object} popUpButtons
         * Convenience config used for adding buttons docked to the bottom of the panel.
         *
         *      popUpButtons: [
         *          { text: 'Button 1' }
         *      ]
         *
         * is equivalent to
         *
         *      menu: {
         *          fbar: [
         *              { text: 'Button 1' }
         *          ]
         *      }
         */
        if (Ext.isDefined(me.popUpButtons) && Ext.isDefined(me.menu)) {
            me.menu.fbar = me.popUpButtons;
        }

        if (Ext.isString(me.tpl) || Ext.isArray(me.tpl)) {
            me.tpl = Ext.create('Ext.XTemplate', me.tpl);
        }

        me.callParent(arguments);

        if (Ext.isDefined(me.popUp)) {
            var popUp = me.menu.getComponent(0);
            me.mon(popUp, 'afterrender', me.onAfterPopUpRender, me);
        }
    },
    /**
     * Update the content area of a component.
     * @param {String/Object} htmlOrData If this component has been configured with a template via the tpl config then
     * it will use this argument as data to populate the template. If this component was not configured with a template,
     * the components content area will be updated via Ext.Element update.  If the popUp component has been configured
     * with a template via its tpl config then the popUp content area will use this argument to populate the popUp
     * component's template.
     * @param {Boolean} [loadScripts=false] Only legitimate when using the html configuration.
     * @param {Function} [callback] Only legitimate when using the html configuration. Callback to execute when
     * scripts have finished loading
     *
     * @since Ext 3
     */
    update: function (htmlOrData, loadScripts, cb) {
       var me = this;

        if (me.popUp && me.popUp.tpl && !Ext.isString(htmlOrData)) {
            if (me.menu.rendered) {
                me.menu.getComponent(0).update(htmlOrData);
            }
        }

        me.callParent(arguments);
    },
    /**
     * @private
     */
    onAfterPopUpRender: function () {
        var me = this;
        if (me.popUp && me.popUp.tpl) {
            me.menu.getComponent(0).update(me.data);
        }
    },
    // overridden so that PopUpButtons don't fire a toggle event unless explicitly told to using toggle()
    onClick: function(e) {
        var me = this;
        me.doPreventDefault(e);

        // Can be triggered by ENTER or SPACE keydown events which set the button property.
        // Only veto event handling if it's a mouse event with an alternative button.
        if (e.type !== 'keydown' && e.button !== 0) {
            return;
        }
        if (!me.disabled) {
            me.maybeShowMenu();
            me.fireHandler(e);
        }
    }
});