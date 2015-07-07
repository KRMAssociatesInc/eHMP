Ext.define('gov.va.cpe.viewdef.editors.MentalHealth', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mentalhealth',
	myVal: null,
	minWidth: 150,
    setValue: function(val) {
    	if(Ext.isString(val)) {
    		val = Ext.decode(val);
    	}
    	this.removeAll();
    	if(val && val.results && val.results.length>0) {
			var rslt = "<table class=\"hmp-labeled-values\">";
    		for(i in val.results) {
    			var result = val.results[i];
    			if(result) {
    				rslt += "<tr><td>"+result.displayName+"</td><td>";
    				if(result.scales && result.scales.length>0) {
    					for(j in result.scales) {
        					var scale = result.scales[j].scale;
        					rslt += scale.rawScore + " ("+scale.name+")<br>";
        				}
    				}
    				rslt += "</td></tr>";
    			}
    		}
			rslt += "</table>";
			this.add({xtype: 'panel', html: rslt, autoScroll: true});
			this.setHeight(23*val.results.length);
    	}
    }
});