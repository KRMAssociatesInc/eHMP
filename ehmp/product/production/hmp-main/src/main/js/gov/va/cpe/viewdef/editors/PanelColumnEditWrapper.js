Ext.define('gov.va.cpe.viewdef.editors.PanelColumnEditWrapper', {
	alias: 'widget.pceditwrapper',
	extend: 'Ext.panel.Panel',
	mixins: ['Ext.form.field.Field'],
	layout: 'fit',
	autoScroll: true,
	targetComp: null,
	setValue: function(val) {
		this.setVal = val; // Timing issue part 1 of 2
		if(this.targetComp) {
			this.targetComp.setValue(val);
		}
	},
	getValue: function() {
		if(this.targetComp && Ext.isFunction(this.targetComp.getValue)) {
			return this.targetComp.getValue();
		}
	},
	reset: function(a, b, c) {
		if(this.targetComp && Ext.isFunction(this.targetComp.reset)) {
			this.targetComp.reset();
		}
	},
	/**
	 * This gets it cooperating with collapsing when it should (document events)
	 */
	initComponent: function() {
		var me = this;
		this.initField();

        // monitor clicking and mousewheel
        me.mon(Ext.getDoc(), {
            mousewheel: me.collapseIf,
            mousedown: me.collapseIf,
            scope: me
        });
        
        if(this.editorXtype) {
            this.items=[{xtype: this.editorXtype}];
        } else if(this.editorConfig) {
        	this.items=[editorConfig];
        }
        
		this.callParent(arguments);
	},
	onBoxReady: function(width, height) {
		this.targetComp = this.down(this.editorXtype);
		this.callParent(arguments);
		this.targetComp.setValue(this.setVal); // Timing issue part 2 of 2
	},
	collapseIf: function(event) {
        var me = this;
        
    	var boxen = Ext.ComponentQuery.query('pickerfield',this);
    	for(idx in boxen) {
    		var picker = boxen[idx].getPicker();
    		if(picker.rendered && event.within(picker.el)) {
    			return;
    		}
    	}
		if(me.externalWidget) {
			if(event.within(me.externalWidget.body)) {
				return;
			}
			if(Ext.isFunction(me.externalWidget.getHeader)) {
				if(event.within(me.externalWidget.getHeader().getEl())) {
					return;
				}
			}
		}
        if ((!me.isDestroyed) && (!event.within(me.el, false, true))) {
        	
            me.collapse();
        }
    },
    collapse: function() {
        this.isExpanded = false;
        if(this.ownerCt) {
        	if(this.readOnly) {
	            this.ownerCt.cancelEdit(false);
	        } else {
	        	this.ownerCt.completeEdit();
	        }
        }
    },
});