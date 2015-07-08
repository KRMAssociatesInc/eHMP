/**
 * this is a private inner grid for the roster window
 * @private
 */
Ext.define('gov.va.cpe.roster.RosterPatientList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.rosterpatientlist',
    autoScroll:true,
	store: {
		model:'gov.va.cpe.roster.SourceWithPatients',
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json'
	        }
	    }
	},
	items: [],
	setRoster: function(roster) {
		var me = this;
	   var srcs = roster.sources();
	   var pats = roster.patients();
	   var srcdefs = new Array();
	   var html = '';
	   me.removeAll();
	   srcs.each(function (src) {
		   var srcpats = [];
		   if(src.get('source')=='patient') {
			   src.set('source', 'Patient');
		   } else if(src.get('source')=='ward') {
			   src.set('source', 'Ward');
		   } else if(src.get('source')=='clinic') {
			   src.set('source', 'Clinic');
		   } else if(src.get('source')=='pcmm') {
			   src.set('source', 'PCMM Team');
		   } else if(src.get('source')=='oe/rr') {
			   src.set('source', 'OE/RR');
		   } else if(src.get('source')=='vpr roster') {
			   src.set('source', 'VPR Roster');
		   } else if(src.get('source')=='specialty') {
			   src.set('source', 'Specialty');
		   } else if(src.get('source')=='provider') {
			   src.set('source', 'Provider');
		   }
		   pats.each(function(pat) {
			   if(pat.get('sourceSequence')==src.get('sequence')) {
				   srcpats.push(pat);
			   }
		   });
		   src.set('patients',srcpats);
		   me.add(me.makeItemForSource(src));
		   srcdefs.push(src);
	   });
	},
	/*
	 * I would have liked to use a dataview for this, with XTemplate values, however I couldn't get it to show an inner loop on 'patients' inside the outer loop on '.'. It would count the records, but only show blanks and not reveal field values.
	 */
	makeItemForSource: function(src) {
		var html = '<div class="hmp-floatie-parent"><span><b>'+src.get('source')+': '+src.get('name')+"</b></span>";
		html += "<div class='hmp-cell-floaties'><span class='fa-remove-sign' onmousedown='gov.va.cpe.roster.RosterPatientList.deleteSource(event, "+src.get('sequence')+")'></span></div>";
		if(src.get('source')!='Patient') {
			html += '<div class="hmp-roster-source-patients">';
			for(key in src.get('patients')) {
				var pat = src.get('patients')[key];
				html +=pat.get('displayName')+'<br>';
			}
			html += '</div>';
		}
		return Ext.create('Ext.panel.Panel', {
			html: html,
			padding: '0 0 10 0'
		});
	},
	itemSelector: 'div.hmp-tile',
	overItemCls: 'hmp-tile-over',
	emptyText: 'No Sources Entered',
	statics: {
		deleteSource: function(event, srcSequence) {
			var plist = Ext.ComponentQuery.query('rosterpatientlist')[0];
			if(plist) {
				plist.fireEvent("deleteSource",srcSequence);
			}
		}
	}
});