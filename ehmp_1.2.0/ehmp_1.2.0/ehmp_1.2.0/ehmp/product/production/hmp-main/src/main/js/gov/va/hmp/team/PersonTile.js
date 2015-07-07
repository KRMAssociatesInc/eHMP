Ext.define('gov.va.hmp.team.PersonTile', {
    extend:'Ext.Component',
    alias:'widget.persontile',
    /**
     * @cfg {String} [baseCls='x-tile']
     * The base CSS class to add to all buttons.
     */
    baseCls: 'hmp-tile',
    /**
     * @cfg {String} overCls
     * The CSS class to add to a tile when it is in the over (hovered) state.
     */
    overCls: 'hmp-tile-over',
    /**
     * @cfg {String} icon
     * The path to an image to display in the button.
     */
    icon:'/images/icons/pt-no-picture.png',
    /**
     * @cfg {String} text
     * The button text to be used as innerHTML (html tags are accepted).
     */
    text:'A Person',
//    textAlign:'right',
    childEls: [
        'tileIconEl', 'tileInnerEl', 'tileCloseEl'
    ],
    renderTpl:[
            '<tpl if="iconUrl">',
                '<img id="{id}-tileIconEl" class="{baseCls}-icon {iconCls}" src="{iconUrl}"/>',
            '</tpl>',
            '<div id="{id}-tileInnerEl" class="{baseCls}-inner">',
            '{text}',
            '</div>',
            '<div id="{id}-tileCloseEl" class="{baseCls}-close"></div>'
    ],
    // inherit docs
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.addEvents(
            /**
             * @event close
             * Fires to indicate that the tile is to be closed, usually because the user has clicked the close button.
             * @param {gov.va.hmp.team.PersonTile} panel The Tile object
             */
            'close',
            /**
             * @event mouseover
             * Fires when the mouse hovers over the button
             * @param {gov.va.hmp.team.PersonTile} this
             * @param {Event} e The event object
             */
            'mouseover',

            /**
             * @event mouseout
             * Fires when the mouse exits the button
             * @param {gov.va.hmp.team.PersonTile} this
             * @param {Event} e The event object
             */
            'mouseout',

            /**
             * @event textchange
             * Fired when the tile's text is changed by the {@link #setText} method.
             * @param {gov.va.hmp.team.PersonTile} this
             * @param {String} oldText
             * @param {String} newText
             */
            'textchange',

            /**
             * @event iconchange
             * Fired when the tile's icon is changed by the {@link #setIcon} or {@link #setIconCls} methods.
             * @param {gov.va.hmpteam.PersonTile} this
             * @param {String} oldIcon
             * @param {String} newIcon
             */
            'iconchange'
        );

        if (me.html && !me.text) {
            me.text = me.html;
            delete me.html;
        }
    },
    // @private
    onRender: function() {
        var me = this,
            tile,
            tileListeners;

        me.doc = Ext.getDoc();
        me.callParent(arguments);

        // Set tile as a local variable for easy access
        tile = me.el;

//        if (me.tooltip) {
//            me.setTooltip(me.tooltip, true);
//        }

        // Add the mouse events to the button
        if (me.handleMouseEvents) {
            tileListeners = {
                scope: me,
                mouseover: me.onMouseOver,
                mouseout: me.onMouseOut,
                mousedown: me.onMouseDown
            };
            if (me.split) {
                tileListeners.mousemove = me.onMouseMove;
            }
        } else {
            tileListeners = {
                scope: me
            };
        }

        // Add whatever tile listeners we need
        me.mon(tile, tileListeners);
        me.mon(me.tileCloseEl, 'click', me.onCloseClick, me);
    },
    /**
     * This method returns an object which provides substitution parameters for the {@link #renderTpl XTemplate} used to
     * create this Component's DOM structure.
     *
     * Instances or subclasses which use a different Template to create a different DOM structure may need to provide
     * their own implementation of this method.
     *
     * @return {Object} Substitution data for a Template. The default implementation which provides data for the default
     */
    getTemplateArgs: function() {
        var me = this;
        return {
            disabled : me.disabled,
            iconUrl  : me.icon,
            iconCls  : me.iconCls,
            text     : me.text || '&#160;',
            tabIndex : me.tabIndex,
            closeText: me.closeText
        };
    },
    getComponentCls: function() {
        var me = this,
            cls = [];

        // Check whether the button has an icon or not, and if it has an icon, what is the alignment
        if (me.iconCls || me.icon) {
            if (me.text) {
                cls.push('icon-text-' + me.iconAlign);
            } else {
                cls.push('icon');
            }
        } else if (me.text) {
            cls.push('noicon');
        }
        return cls;
    },
    beforeRender: function () {
        var me = this;

        me.callParent();

        // Add all needed classes to the protoElement.
        me.oldCls = me.getComponentCls();

        // Apply the renderData to the template args
        Ext.applyIf(me.renderData, me.getTemplateArgs());
    },
    onBoxReady:function () {
        this.initializeDragZone();
    },
    /**
     * Sets the background image (inline style) of the button. This method also changes the value of the {@link #icon}
     * config internally.
     * @param {String} icon The path to an image to display in the button
     * @return {gov.va.hmp.team.PersonTile} this
     */
    setIcon: function(icon) {
        icon = icon || '';
        var me = this,
            tileIconEl = me.tileIconEl,
            oldIcon = me.icon || '';

        me.icon = icon;
        if (icon != oldIcon) {
            if (tileIconEl) {
                tileIconEl.setAttribute('src', icon);
                me.setComponentCls();
                if (me.didIconStateChange(oldIcon, icon)) {
                    me.updateLayout();
                }
            }
            me.fireEvent('iconchange', me, oldIcon, icon);
        }
        return me;
    },
    /**
     * Sets this Button's text
     * @param {String} text The button text
     * @return {gov.va.hmp.team.PersonTile} this
     */
    setText: function(text) {
        text = text || '';
        var me = this,
            oldText = me.text || '';

        if (text != oldText) {
            me.text = text;
            if (me.rendered) {
                me.tileInnerEl.update(text || '&#160;');
                me.setComponentCls();
                if (Ext.isStrict && Ext.isIE8) {
                    // weird repaint issue causes it to not resize
                    me.el.repaint();
                }
                me.updateLayout();
            }
            me.fireEvent('textchange', me, oldText, text);
        }
        return me;
    },
    /**
     * @private
     */
    initializeDragZone:function () {
        var me = this;
        me.dragZone = Ext.create('Ext.dd.DragZone', me.getEl(), {

//      On receipt of a mousedown event, see if it is within a draggable element.
//      Return a drag data object if so. The data object can contain arbitrary application
//      data, but it should also contain a DOM element in the ddel property to provide
//      a proxy to drag.
            getDragData:function (e) {
                var sourceEl = me.getEl().dom, d;
                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return me.dragData = {
                        sourceEl:sourceEl,
                        repairXY:Ext.fly(sourceEl).getXY(),
                        ddel:d,
                        patientData: {
                            name: me.text
                        }
                    };
                }
            },

//      Provide coordinates for the proxy to slide back to on failed drag.
//      This is the original XY coordinates of the draggable element.
            getRepairXY:function () {
                return this.dragData.repairXY;
            }
        });
    },
    onCloseClick:function() {
        this.up().remove(this);

        this.fireEvent('close', this);

        Ext.destroy(this);
    }
});