/**
 * NOTE: Yes I definitely plan on changing the name before this goes anywhere, before anyone asks.
 * 
 * The intent here is to have one panel that can handle all the UI customization / widget manipulation that the EU will want to do.
 * - Shooting for table layout / multiple row/colspans.
 * 
 */

Ext.define('gov.va.hmp.containers.OnePanelToRuleThemAll', {
	extend: 'Ext.panel.Panel',
    cls: 'x-gbpanel',
    bodyCls: 'x-gbpanel-body',
	requires: [
        'gov.va.hmp.containers.GridBagLayout',
        'gov.va.hmp.containers.NewItemConfigWindow'
    ],
	alias: 'widget.wunderpanel',
//    layout: 'auto',
	layout: {
		type: 'gridbag',
		tableAttrs: {
            style: {
                width: '100%',
                height: '100%'
            }
        }
	},
	border: 0,
	stateful: false,
	/**
	 * EXT panel property (Ext.panel.Panel) for handling all items that are added, either hard-coded, thru external config passed to constructor, or added dynamically with add or insert.
	 */
	defaults: function(config) {
		config.padding = '2 2 2 2';
		
		/*
		 * If we haven't specified grid coordinate and width, we need to do it now.
		 */
		if(this.rendered)
		{
			if((!config.gridX) && (!config.gridY) && (!config.widthX) && !(config.widthY))
			{
				Ext.apply(config, this.layout.getNextAvailableCellConstraints(this.items, config.gridBagHint));
			}
		}	
		if(!config.weightX)
		{
			config.weightX = 1;
		}	
		if(!config.weightY)
		{
			config.weightY = 1;
		}
		config.flex = 1;

//    	config.draggable = true;

		// this only works for items dynamically added to the panel after
		// inital creation/rendering.
		if (this.detailCmp && config.setDetailPanel) {
			config.setDetailPanel(this.detailCmp);
		}
	},
	initComponent: function() {
		var me = this;

        // tools may also be rendered as menu items in some cases, so use the icon/text elements as well.
        // cant use the addTools() method because we need this data intact prior to render.
        this.tools = [{
            type: 'expand',
            icon: '/images/icons/ic_plus.png',
            tooltip: 'Add Grid Panel',
            text: 'Add Grid Panel',
            handler: function() {
                // TODO: how to make this a menu/selection of different things to add?
                var cfg = {xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...', gridBagHint: 'east', deferRowRender: false, resizable: true};
                //Ext.apply(cfg, me.getLayout().getNextAvailableCellConstraints(me.items));
                var wnd = Ext.create('gov.va.hmp.containers.NewItemConfigWindow', {pnl: me, cmp: cfg}).show();
                wnd.setValues(me.getLayout().getNextAvailableCellConstraints(me.items));
                //me.add({xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...', gridBagHint: 'east', deferRowRender: false, resizable: true});
            }
        },{
            type: 'expand',
            icon: '/images/icons/ic_plus.png',
            tooltip: 'Add Shared Detail Panel',
            text: 'Add Shared Detail Panel',
            handler: function() {
                // TODO: how to make this a menu/selection of different things to add?
                var cfg = {xtype: 'griddetailpanel', title: 'Shared Detail', resizable: true};
                //Ext.apply(cfg, me.getLayout().getNextAvailableCellConstraints(me.items));
                var wnd = Ext.create('gov.va.hmp.containers.NewItemConfigWindow', {pnl: me, cmp: cfg}).show();
                wnd.setValues(me.getLayout().getNextAvailableCellConstraints(me.items));
                //me.add({xtype: 'viewdefgridpanel', title: 'New Item', html: 'Click Edit...', gridBagHint: 'east', deferRowRender: false, resizable: true});
            }
        }];

		me.callParent(arguments);

//        me.addEvents({
//            validatedrop: true,
//            beforedragover: true,
//            dragover: true,
//            beforedrop: true,
//            drop: true
//        });
//        me.on('drop', this.doLayout, this);
        me.on('resize', this.doLayout, this);
	},

    // private
//    initEvents : function(){
//        this.callParent(arguments);
//        this.dd = Ext.create('Ext.app.GridBagDropZone', this, this.dropConfig);
//    },

    // private
    beforeDestroy : function() {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent(arguments);
    },

	getStateForPanel: function(panel)
	{
		var state = {};
		if(panel.xtype=='panel' || panel.xtype=='container')
		{
			if(panel.items && panel.items.length>0)
			{	
				state = {
						xtype: panel.xtype, 
						items: [], 
						flex: panel.flex, 
						layout: {
							type: panel.layout.type, 
							align: panel.layout.align
						}
				};
				for(key in panel.items.items)
				{
					state.items[key] = this.getStateForPanel(panel.items.items[key]);
				}	
			}
		}
		else if(panel.xtype=='griddetailpanel')
		{
			state = {
					xtype: panel.xtype,
					itemId: panel.itemId,
					height: panel.height,
					collapsible: panel.collapsible,
					autoCollapse: panel.autoCollapse,
					flex: panel.flex
			}
		}
		else if(Ext.isFunction(panel.getState))
		{
			state = panel.getState();
		}
		else
		{
			Ext.log("UNKNOWN ITEM: "+panel.xtype);
		}
		// Universal stuff.
		this.setFieldValueIfExists(state, panel, 'height');
		this.setFieldValueIfExists(state, panel, 'width');
		
		// If this is participating in a GridBagLayout... which it must be because it's in this panel...
		// Perhaps we should be able to ask the Layout to do this for us.
		this.setFieldValueIfExists(state, panel, 'gridX');
		this.setFieldValueIfExists(state, panel, 'gridY');
		this.setFieldValueIfExists(state, panel, 'weightX');
		this.setFieldValueIfExists(state, panel, 'weightY');
		this.setFieldValueIfExists(state, panel, 'widthX');
		this.setFieldValueIfExists(state, panel, 'widthY');
		
		return state;
	},

	getState: function() {
		var me = this, state = {xtype: 'wunderpanel', title: this.title, items: []};
		for (var i=0; i < me.items.length; i++) {
			var panel = me.items.get(i);

			state.items[i] = this.getStateForPanel(panel);//.getState();
		}
		return state;
	},
	
	/**
	 * Gently set values only if the field actually exists.
	 * This is a hack to avoid setting values that EXT thinks were set explicitly.
	 */
	setFieldValueIfExists: function(dest, src, fldName)
	{
		if(!Ext.isEmpty(src[fldName]))
		{
			dest[fldName] = src[fldName];
		}	
	}
});


Ext.define('Ext.app.GridBagDropZone', {
    extend: 'Ext.dd.DropTarget',

    constructor: function(mainPanel, cfg) {
        this.mainPanel = mainPanel; // Reference to the main grid bag panel
        Ext.app.GridBagDropZone.superclass.constructor.call(this, mainPanel.body, cfg);
    },

    createEvent: function(dd, e, data, col, c, pos) {
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    /*
     * The function a Ext.dd.DragSource calls continuously while it is being dragged over the target. This method will be called on every mouse movement while the drag source is over the drop target. 
     * (The default implementation simply returns the dropAllowed config value.)
     */
    notifyOver: function(dd, e, data) {
        var xy = e.getXY(),
            mainPanel = this.mainPanel,
            proxy = dd.proxy;
        
        var irep = null;
        
        for(var key in mainPanel.items.items)
        {
        	var item = mainPanel.items.items[key];
        	var evtX = xy[0];
        	var evtY = xy[1];
        	var iposX = item.getPosition()[0];
        	var iposY = item.getPosition()[1];
        	var iw = item.getSize().width;
        	var ih = item.getSize().height;
        	console.log("EX,EY,IX,IY,IW,IH: "+evtX+","+evtY+","+iposX+","+iposY+","+iw+","+ih);
        	if(evtX>iposX && evtX<(iposX+iw))
        	{
        		if(evtY>iposY && evtY<(iposY+ih))
        		{
        			irep = item;
        		}
        	}
        }
        if(irep)
        {
        	// Get the parent element for this guy and swap 'em out.
        	if(irep.el.dom.parentElement)
        	{
        		var gridX = proxy.panel.gridX;
        		var gridY = proxy.panel.gridY;
        		proxy.panel.gridX = irep.gridX;
        		proxy.panel.gridY = irep.gridY;
        		/**
        		 * Attempted hack to take care of grid drag-drop glitch.  I think it is a glitch with ANY complex component, at this point.
        		 */
                if(proxy.panel.header && proxy.panel.header.preLayoutSize && proxy.panel.header.preLayoutSize.width != proxy.panel.width)
                {
                	proxy.panel.header.preLayoutSize.width = proxy.panel.width;
                }	
                if(proxy.panel.headerCt && proxy.panel.headerCt.preLayoutSize && proxy.panel.headerCt.preLayoutSize.width != proxy.panel.width)
                {
                	proxy.panel.headerCt.preLayoutSize.width = proxy.panel.width;
                }	
        		irep.gridX = gridX;
        		irep.gridY = gridY;
        		
        		var irepParent = irep.el.dom.parentNode;
        		var proxyParent = proxy.panel.el.dom.parentNode;
        		
        		irep.el.dom.parentNode.removeChild(irep.el.dom);
        		proxy.panel.el.dom.parentNode.removeChild(proxy.panel.el.dom);
        		
        		irepParent.appendChild(proxy.panel.el.dom); // ?
        		proxyParent.appendChild(irep.el.dom);
        		
        		proxy.moveProxy(irepParent, null);
        		//mainPanel.doLayout();
        	}
        }	

    },

    notifyOut: function() {
        delete this.grid;
    },

    notifyDrop: function(dd, e, data) {
        var panel = dd.panel,
            dropEvent = this.createEvent(dd, e, data);
        if(panel.header && panel.header.preLayoutSize && panel.header.preLayoutSize.width != panel.width)
        {
        	panel.header.preLayoutSize.width = panel.width;
        }	
        if(panel.headerCt && panel.headerCt.preLayoutSize && panel.headerCt.preLayoutSize.width != panel.width)
        {
        	panel.headerCt.preLayoutSize.width = panel.width;
        }	
        

        if (this.mainPanel.fireEvent('validatedrop', dropEvent) !== false && this.mainPanel.fireEvent('beforedrop', dropEvent) !== false) {

            dd.proxy.hide();
            this.mainPanel.fireEvent('drop', dropEvent);

        }
    	dd.proxy.hide();
        return true;
    }

});
