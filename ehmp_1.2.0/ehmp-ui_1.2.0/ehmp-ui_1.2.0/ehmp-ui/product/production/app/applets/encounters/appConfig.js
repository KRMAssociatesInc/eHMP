define([
    "app/applets/encounters/parserAdmissionsChart",
    "hbs!app/applets/encounters/templets/gistQViewVisits",
    "hbs!app/applets/encounters/templets/gistQViewProcedures",
    "hbs!app/applets/encounters/templets/gistQViewAdmission",
    "hbs!app/applets/encounters/templets/gistQViewAppointment"
], function(parsAdChart,gQVV,gQVP,gQVAd,gQVAp) {
    'use strict';
   
var Config = {
    // Switch ON/OFF debug info
        debug: false,

    // order for top level of tiles
        eventOrder: {
                    visit:       { title: "Visits",     order:  0, sort_direction: "past"}, //oreder - 0 ->up/ 3-> down
                    admission:   { title: "Admissions", order:  2, sort_direction: "past"},
                    procedure:   { title: "Procedures", order:  3, sort_direction: "past"},
                    appointment: { title: "Appointments",order: 1, sort_direction: "future"}
        },
    // group by
        groupBy: { visit :       {grouping:[{title: "Visit type", field: "stopCodeName"}],
                                  sort_direction: "past", 
                                  parser: function(obj){
                                                          obj.applet_id = "enc_detail_v_a";  // chanel name for visit detail view
                                                          obj.allGroupedEncounters = [];
                                                          for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            StopCode:  obj.recent[z].stopCodeName,
                                                                            Facility: obj.recent[z].facilityMoniker,
                                                                            Location: obj.recent[z].locationDisplayName,
                                                                            Provider: obj.recent[z].encProvider,
                                                                            Status: obj.recent[z].appointmentStatus || "Unknown"
                                                                     });
                                                            }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0];
                                                            obj.tooltip = gQVV(obj); // gist Quick View (tooltip)for Visits
                                                        }
                                 }  },
                   appointment : {grouping:[{title: "Appointment type", field: "stopCodeName"}],
                                  sort_direction: "future",
                                  parser: function(obj){
                                                          obj.applet_id = "enc_detail_v_a";  // chanel name for admission detail view
                                                          obj.allGroupedEncounters = [];
                                                          for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            StopCode:  obj.recent[z].stopCodeName,
                                                                            Facility: obj.recent[z].facilityMoniker,
                                                                            Location: obj.recent[z].locationDisplayName,
                                                                            Provider: obj.recent[z].encProvider,
                                                                            Status: obj.recent[z].appointmentStatus  || "Unknown"
                                                                     });
                                                            }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0];
                                                            obj.tooltip = gQVAp(obj); // gist Quick View for Appointments
                                                        }
                                 } },
                   procedure :   {grouping:[{title: "Procedure name", field:"procName"}],// "facilityName"
                                  sort_direction: "past",
                                  parser: function(obj){
                                                        obj.applet_id = "enc_detail_p";  // chanel name for procedure detail view
                                                        obj.allGroupedEncounters = [];
                                                        for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            Service:  obj.recent[z].service || "Unknown",
                                                                            Facility: obj.recent[z].facilityMoniker,
                                                                            Provider: obj.recent[z].encProvider
                                                                     });
                                                          }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0];
                                                            obj.tooltip = gQVP(obj); // gist Quick View for Procedures
                                                        }
                                 }                                 
                                 },
                   admission :   {grouping:[{title: "Reason name", field:"reasonName"}],
                                  sort_direction: "past",
                                  specialChart: true,
                                  parser: function(obj){
                                                        if(obj.subKind){   // parser for gist level
                                                            obj.applet_id = "enc_detail_v_a";  // chanel name for admission detail view
                                                            obj.allGroupedEncounters = [];
                                                            for(var z=0;z<obj.recent.length; z++){
                                                                         obj.allGroupedEncounters.push({
                                                                                dateTime:  obj.recent[z].showDate,
                                                                                Location:  obj.recent[z].locationDisplayName,
                                                                                Facility:  obj.recent[z].facilityMoniker
                                                                                //Provider: obj.recent[z].reasonName
                                                                         });
                                                              }
                                                            if(obj.recent.length>0){
                                                                obj.uid = obj.recent[0].uid;
                                                                obj.recent_model = obj.recent[0];
                                                                obj.tooltip = gQVAd(obj); // gist Quick View for Admissions
                                                            }
                                                            // Non standard Chart for Admission
                                                            // Extract data for inpatient days stay
                                                            obj.graphData.series = parsAdChart.chartParser(obj.allData).chartData;
                                                            obj.graphData.isDuration = true;
                                                            delete obj.chartData;
                                                        }else{  // parser for applet level
                                                            obj.isDuration = true;
                                                            obj.chartData = parsAdChart.chartParser(obj.allData).chartData;
                                                        }
                                                      // delete temp data
                                                      delete obj.allData;
                                 }                                 
                                 }                 
            },
    // show without grouping
        showBy:  { admission_off:   {showing: [ // sitched off by _off
                                        {title: "Date", field: "showDate"},  // field is parsing result
                                        {title: "Location", field: "locationDisplayName"},
                                        {title: "CLN/WARD", field: "facilityName"},
                                        {title: "DateTime", field: "dateTime"}, // for datetime sorting
                                        {title: "uid", field: "uid"}, // for id
                                        {title: "Service", field: "service"},
                                        {title: "Reason", field: "reasonName"},                      
                                        {title: "Facility", field: "facilityMoniker"}                      
                                    ],
                                 parser: function(obj){
                                        obj.subKind = obj.locationDisplayName+" - "+obj.facilityName;
                                        obj.time = ADK.utils.getTimeSince(obj.dateTime).timeSince;//obj.showDate;
                                        obj.sort_time = obj.dateTime;
                                        obj.count = 1; 
                                        obj.applet_id = "enc_detail_v_a";  // chanel name for admission detail view
                                        obj.allGroupedEncounters = [];
                                        obj.allGroupedEncounters.push({
                                                                      dateTime:     obj.showDate,
                                                                      Service:      obj.service,
                                                                      Facility:     obj.facilityMoniker,
                                                                      Diagnosis:    obj.reasonName
                                                                    });
                                        obj.tooltip = gQVAd(obj); // gist Quick View for Admissions
                                }}
           }
    };
  return Config;
});
