/**
 * A panel who's contents is always loaded from the server.  It tracks with the current patient ID
 * and will reload from the server using the detailURL template.
 * 
 * TODO: Try to merge the details panel and this.  They are similar except for the patientaware part.
 */
Ext.define('gov.va.hmp.containers.PatientAwarePanel',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.patientawarepanel',
	mixins: {
		patientaware: 'gov.va.hmp.PatientAware'
	},
	detailURL: '',
	detailURLTpl: null, // detailURL will be compiled into this tpl
	autoScroll: true,
	iframe: false, // render the detailURL in an iframe instead of an ajax request (for cross-site scripting issues)
	editorCmp: 'gov.va.cpe.designer.PatientAwarePanelEditor', // the editor component (name or instance) use getEditor() to create/get it
	loader: {
		autoLoad: false,
        failure: function(loader, resp, opts) {
        	console.log('load failure', arguments);
        	loader.getTarget().update('Load Failure: ' + resp.responseText);
        }
	},
    listeners: {
        patientchange: function(pid) {
            this.pid = pid;
            //do not enable pages if invalid patient
            if (this.pid == 0) {
                return true;
            }

            this.configure(pid);
        }
    },
	initComponent: function() {
		var me = this;
		
	    this.tools = [{
        	type: 'refresh',
        	icon: '/images/icons/arrow_refresh.png',
        	tooltip: 'Refresh',
        	text: 'Refresh',
        	handler: function() {
        		me.reload();
        	}
	    },{
	    	type: 'gear',
	    	icon: '/images/icons/cog_edit.png',
	    	tooltip: 'Edit Page',
	    	text: 'Edit Page',
	    	handler: function() {
				//var win = Ext.create('gov.va.cpe.designer.PatientAwarePanelEditor');
				var win = Ext.create('gov.va.hmp.containers.WidgetTabPanelEditWin');
				win.configure(me);
				win.show();
			}
	    }];
		
		this.callParent();
		this.form = Ext.create('Ext.form.Basic', this);
		// compile the detail url template
		if (Ext.isString(this.detailURL) && !this.detailURLTpl) {
    		this.detailURLTpl = new Ext.Template(this.detailURL, {compiled: true});
    	}
	},
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    },
	getParams: function() {
		return this.form.getValues();
	},	
	reload: function() {
		this.configure(this.pid);
	},
	configure: function(pid) {
		if (!this.rendered || pid === null) {
			// don't autoload if its not rendered yet or no patient context
			return;
		}
		// run the template detailURLTpl get the new URL
		var url = this.detailURLTpl.apply(this);
		
		if (this.iframe) {
			this.getLoader().getTarget().update('<iframe src="' + url + '" height="100%" width="100%" frameborder="1">');
		} else {
			this.getLoader().load({
		    	url: url,
		    	params: this.getParams(),
		        renderer: function(loader, response, active) {
		        	// TODO: Allow more dynamic loading like the details panel.
		            loader.getTarget().update(response.responseText, true);
		            return true;
		        }
			});
		}
	},
    getEditor: function() {
    	if (Ext.isObject(this.editorCmp)) {
    		return this.editorCmp;
    	} else if (Ext.isString(this.editorCmp)) {
    		this.editorCmp = Ext.create(this.editorCmp);
    		this.editorCmp.setEditorValues(this.getState());
    		return this.editorCmp;
    	}
    	return null;
    },  
    
    getState: function() {
    	var ret = {
			xtype: 'patientawarepanel',
			title: this.title,
    		detailURL: this.detailURLTpl.html,
    		iframe: this.iframe
    	}
    	
    	// only add the tabconfig if its specified
    	/*
    	 * JC 4-16-2012: Very strange. When the tooltip was included in getState, this failed to load properly.
    	 * Everything looked in order, but it would cause the tab to not activate when clicked.
    	 * The tooltip appeared, though.
    	 */
//		var tooltip = (this.tabConfig && this.tabConfig.tooltip) ? this.tabConfig.tooltip : null;
//		if (tooltip) {
//			ret.tabConfig = {tooltip: tooltip}
//		}
    	
    	return ret;
    }


});