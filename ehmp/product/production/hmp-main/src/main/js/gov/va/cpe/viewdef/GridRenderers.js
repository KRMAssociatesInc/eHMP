Ext.define('gov.va.cpe.viewdef.GridRenderers', {
	requires: [
        'gov.va.hmp.healthtime.PointInTime',
        'gov.va.cpe.viewdef.editors.PatientCommentEditor',
        'gov.va.cpe.viewdef.editors.RoadTripEditor'
    ],
	statics: {
		getRenderClassFunction: function(rc) {
			var statusHomogenizer = function(value) {
				if(value && value.substring(0,9)=="SCHEDULED" || value=="INPATIENT") {
					return "Scheduled";
				} else if(value && value.substring(0,6)=="CANCEL") {
					return "Canceled";
				} else {
					return value;
				}
			};
			var jsonHomogenizer = function(value) {
				var json = value;
				if(!Ext.isObject(value) && !Ext.isArray(value))
				{
					if(value=="") {return "";}
					json = Ext.decode(value);
				}
				return json;
			};
			switch(rc) {
			case 'comments':
				return function(value, metadata, record) {
					var json = jsonHomogenizer(value);
					var rslt = '';
					var pid = record.get("pid");
					for(x in json) {
						var rec = json[x];
						if(rec.comment) {
							rslt += "<div class='hmp-floatie-parent'>";
							rslt += "<span style='word-wrap: break-word; white-space: normal;'>"+rec.comment+"</span>";
							rslt += "<div class='hmp-cell-floaties'><span class='fa-pencil' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.editRecord(event, "+pid+", "+x+", false)'></span>  ";
							rslt += "<span class='fa-times-circle' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.deleteRecord(event, "+pid+", "+x+", false)'></span></div>";
							rslt += '<div class=\"text-muted\">Author: '+rec.author+'</div></div>'
							rslt += "<hr class='hmp-waffer-thin'>";
						}
					}
					rslt += "<a href='javascript:;' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.editRecord(event, "+pid+", -1, false)'>New Preference</a><br>";
					return rslt;
				};
				break;
			case 'currentcomments':
				return function(value, metadata, record) {
					if(value==null) {
						return "<span class=\"text-muted\">No Current Visit</span>";
					}
					var json = jsonHomogenizer(value);
					var rslt = '';
					var pid = record.get("pid");
					for(x in json) {
						var rec = json[x];
						if(rec.comment) {
							rslt += "<div class='hmp-floatie-parent'>";
							rslt += "<span style='word-wrap: break-word; white-space: normal;'>"+rec.comment+"</span>";
							rslt += "<div class='hmp-cell-floaties'><span class='fa-pencil' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.editRecord(event, "+pid+", "+x+", true)'></span>  ";
							rslt += "<span class='fa-times-circle' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.deleteRecord(event, "+pid+", "+x+", true)'></span></div>";
							rslt += '<div class=\"text-muted\">Author: '+rec.author+'</div></div>'
							rslt += "<hr class='hmp-waffer-thin'>";
						}
					}
					rslt += "<a href='javascript:;' onmousedown='gov.va.cpe.viewdef.editors.PatientCommentEditor.editRecord(event, "+pid+", -1, true)'>New Comment</a><br>";
					return rslt;
				};
				break;
			case 'roadTrip':
				return function(value, metadata, record) {
					var json = jsonHomogenizer(value);
					var rslt = '';
					var pid = record.get("pid");
					for(x in json.results) {
						var rec = json.results[x];
						
						if(rec.location) {
							rslt += "<div class='hmp-floatie-parent'>";
							if(rec.comment && rec.comment!="") {
								rslt += "<span>"+rec.location.displayName+" "+PointInTime.format(rec.day, 'M j,y')+' '+rec.time+"</span>";
								rslt += "<div class='hmp-cell-floaties'><span class='fa-pencil' onmousedown='gov.va.cpe.viewdef.editors.RoadTripEditor.editRecord(event, "+pid+", \""+rec.uid+"\")'></span>  ";
								rslt += "<span class='fa-times-circle' onmousedown='gov.va.cpe.viewdef.editors.RoadTripEditor.deleteRecord(event, "+pid+", \""+rec.uid+"\")'></span></div>";
								rslt += '<div class=\"text-muted\">'+rec.comment+'</div></div>'
							} else {
								rslt += "<div class='hmp-cell-floaties'><span class='fa-pencil' onmousedown='gov.va.cpe.viewdef.editors.RoadTripEditor.editRecord(event, "+pid+", \""+rec.uid+"\")'></span>  ";
								rslt += "<span class='fa-times-circle' onmousedown='gov.va.cpe.viewdef.editors.RoadTripEditor.deleteRecord(event, "+pid+", \""+rec.uid+"\")'></span></div>";
								rslt += "<span>"+rec.location.displayName+" "+PointInTime.format(rec.day, 'M j,y')+' '+rec.time+"</span>";
								rslt += '</div>'
							}
							rslt += "<hr class='hmp-waffer-thin'>";
						}
					}
					rslt += "<a href='javascript:;' onmousedown='gov.va.cpe.viewdef.editors.RoadTripEditor.editRecord(event, "+pid+")'>New Transport</a><br>";
					return rslt;
				};
				break;
			case 'location':
				return function(value) {
					var json = jsonHomogenizer(value);
					if(json.data && json.data.length>0) {
						json = json.data[0];
					}
					if(json && json.location) {
						json = json.location;
					}
					return json.displayName;
				};
				break;
			case 'notices':
				return function(value) {
					var json = jsonHomogenizer(value);
					var rslt = '';
					if(json.data) {
						json = json.data;
					}
					var cwadf = [false,false,false,false,false];
					var cmp = ['C','W','A','D','F'];
					if(json.length>0) {
						for(i in json) {
							var dat = json[i];
							if(cmp.indexOf(dat.code)>-1) {
								cwadf[cmp.indexOf(dat.code)]=true;
							}
						}
					}
					rslt = rslt + '<span class="hmp-cwad">';
					for(key in cwadf) {
						if(cwadf[key]) {
							rslt = rslt + cmp[key];
						}
					}
					rslt = rslt + '</span>';
					return rslt;
				};
				break;
			case 'patientTeams':
				return function(value) {
					var json = jsonHomogenizer(value);
					var rslt = "";
					if(json.results && json.results.length>0) {
						for(key in json.results) {
							if(json.results[key].displayName) {
								rslt = rslt + json.results[key].displayName + "<br>";
							}
						}
					}
					return rslt;
				};
				break;
			case 'acuity':
				return function(value) {
					if(value==null) {
						return "<span class=\"text-muted\">No Current Visit</span>";
					}
					var rslt = '';
					var json = jsonHomogenizer(value);
					if(json.data) {
						json = json.data;
					}
					if(json.length>0) {
						for(i in json) {
							var dat = json[i];
							rslt = rslt + dat.text + '<br>';
						}
					}
					if(json.acuity) {
						rslt = json.acuity;
					}
					return rslt;
				};
				break;
			case 'resultedOrders':
				return function(value) {
					var rslt = '';
					var json = jsonHomogenizer(value);
					if(json.results) {
						json = json.results;
					}
					var dat = json[0];
					
					rslt = "<table class=\"hmp-labeled-values\">";
					if (dat != undefined ) {
						if (dat.ORDERED != undefined) {
							rslt += "<tr><td>Ordered</td><td>"+ dat.ORDERED +"</td></tr>";
						}
						if (dat.ACTIVE != undefined) {
							rslt += "<tr><td>Active</td><td>"+ dat.ACTIVE +"</td></tr>";
						}
						if (dat.COMPLETED != undefined) {
							rslt += "<tr><td>Completed</td><td>"+ dat.COMPLETED +"</td></tr>";
						}
						if (dat.PENDING != undefined) {
							rslt += "<tr><td>Pending</td><td>"+ dat.PENDING +"</td></tr>";
						}
						if (dat.RESULT != undefined) {
							rslt += "<tr><td>Resulted</td><td>"+ dat.RESULT +"</td></tr>";
						}
					}
					rslt += "</table>";
					
					return rslt;
				};
				break;
			case 'mentalHealth':
				return function(value) {
					var json = jsonHomogenizer(value);
					if(json.results && json.results.length>0) {return json.results.length;}
				};	
				break;
			case 'checkin':
				return function(value) {
					var rslt = '';
					var json = jsonHomogenizer(value);
					for(idx in json.results) {
						var rec = json.results[idx];
						var pid = rec.pid;
						rslt += "<span>"+rec.locationName+"</span>";
						rslt += "<i> (<span>"+rec.stopCodeName+"</span>)</i><br>";
						
						if(rec.checkOut) {
							rslt += "<b>Checked Out: "+gov.va.hmp.healthtime.PointInTime.format(rec.checkIn, "H:i")+"</b>";
						} else if(rec.checkIn) {
							rslt += "<b>Checked In: "+gov.va.hmp.healthtime.PointInTime.format(rec.checkIn, "H:i")+"</b>";
						} else {
							rslt += statusHomogenizer(rec.appointmentStatus)+": "+gov.va.hmp.healthtime.PointInTime.format(rec.dateTime, "H:i");
						}
						if(idx < (json.results.length-1)) {
							rslt += "<hr class='hmp-waffer-thin'>";
						}
					}
					return rslt;
				}
				break;
			case 'brList':
				return function(value) {
					var rslt = '';
					var json = jsonHomogenizer(value);
					if(json && json.results) {
						for(idx in json.results) {
							rslt += json.results[idx]; // Yes this looks silly but it is backwards compatible with some existing columns and will cut down on refactration time.
						}
					} else {
					}
					return rslt;
				};
				break;
			}
		},
		applyCustomRendererFn: function(grd, coldef, rendererFnType) {
			switch(rendererFnType) {
			case 'claimedBy':
				Ext.apply(coldef, {renderer: function(value) {
					return value?value.name:'';
				}})
				break;
			case 'mentalHealthScales':
				var rslt = '';
				Ext.apply(coldef, {renderer: function(value) {
					rslt = "";
					if(value && value.length>0) {
						for(i in value) {
							var scale = value[i].scale;
							rslt += scale.rawScore + " ("+scale.name+")<br>";
						}
					}
					return rslt;
				}})
				break;
			}
		}
	}
});