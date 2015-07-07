Ext.define('gov.va.cpe.ChartPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.chartpanel',
	itemId: 'cpanel-default',
	/**
	 * Data sources are objects which have a "getHCDataSet()" function that will return a JSON 
	 * object that can be used as a HighChart data set.
	 * 
	 * Example of data set JSON: 
	 * 		{
	            name: 'Lab Results',
	            type: 'line',
	            data: [
	                [Date.UTC(2011,  9, 27), 0   ],
	                [Date.UTC(2011, 10, 10), 0.6 ]
	            ]
	        }

	* Another example: 
	* 		{
	        	name: 'Med Dossages',
	        	type: 'area',
	        	data: [
	        	    [Date.UTC(2011,  10, 2), 0.3   ],
	                [Date.UTC(2011, 10, 5), 0.3 ] 
	        	]
	        }
	 */
	dataSources: [],
	/**
	 * The 'sets' argument is another way to send data into this call. It will be processed after all dataSources have been consulted for their data sets - so if this is passed in, it will appear above all other sets gleaned from dataSources already configured for this ChartPanel (if any.)
	 */
	updateChart: function(sets, cfg) {
		// Collect data from data sources
		// Convert dates from HL7 to JS-native dates
		// Create HighChart instance from data arrays
		var me = this;
		var srs = [];
		for(ds in this.dataSources)
		{
			if(Ext.isFunction(ds.getHCDataSet)) {
				srs.push(ds.getHCDataSet());
			}
		}
		for(x in sets)
		{
			srs.push(sets[x]);
		}
		/**
		 * If we don't sort the data sets, tool tips will not display properly.
		 */
		for(x in srs) {
			var dat = srs[x].data;
			dat.sort(function(i1, i2){
				if(i1['x']) {return i1['x']-i2['x'];}
	        	return i1[0] - i2[0];
	        });
		}
		var boilerplate = {
				chart: {
		            renderTo: me.id,
		            type: 'line'
		        },
		        xAxis: {
		            type: 'datetime',
		            dateTimeLabelFormats: {
		                second: '%m/%d/%Y',
		                minute: '%m/%d/%Y',
		                hour: '%m/%d/%Y',
		                day: '%m/%d/%Y',
		                week: '%m/%d/%Y',
		                month: '%m/%d/%Y',
		                year: '%m/%d/%Y'
		            },
		            labels: {rotation: 45, align: 'left'}
		        },
		        yAxis: {
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        series: srs,
		        credits: {enabled: false},
		        title: {text: ''},
		        header: false,
		        tooltip: {
		            xDateFormat: '%m/%d/%Y'
		        }
			};
		if(cfg) {
			cfg = Ext.Object.merge(boilerplate,cfg);
		} else {
			cfg = boilerplate;
		}
		new Highcharts.Chart(cfg);
		
	}
});