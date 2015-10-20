define([
    "underscore",
    "moment",
    "crossfilter",
    "app/applets/encounters/appConfig"
], function(_, Moment, Crossfilter, CONFIG) {
    'use strict';
    // Switch ON/OFF debug info    
    var DEBUG = CONFIG.debug;
    // Top tile ordering & injection
    var EVENT_LIST = CONFIG.eventOrder;
    // var EMPTY_MODEL = CONFIG.getEmpty;
    var appHelper = {
        parseDate: function(datetime, aggregation) {
            var result = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMMDD');
            if (typeof aggregation !== 'undefined') {
                if (DEBUG) console.log("Chart data aggregation ---->>" + aggregation);
                switch (aggregation.toLowerCase()) {
                    case "y":
                        result = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYY');
                        break;
                    case "ym":
                        result = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMM');
                        break;
                    case "ymd":
                        result = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMMDD');
                        break;
                }
            }
            return result;
        },
        stringSplitter: function(str) {
            if (_.isUndefined(str)) {
                str = "";
            }
            var arrSubstr = str.split(',');
            if (arrSubstr.length > 1) {
                return arrSubstr.join(", ");
            }
            return str;
        },
        slashSplitter: function(str) {
            if (_.isUndefined(str)) {
                str = "";
            }
            var arrSubstr = str.split('/');
            if (arrSubstr.length > 1) {
                return arrSubstr.join("/ ");
            }
            return str;
        },
        encounterProvider: function(obj) {
            var provider = [];
            var primary = [];
            var arrResult = [];
            var result = "Unknown";
            if (obj.providers) {
                for (var m = 0; m < obj.providers.length; m++) {
                    if (obj.providers[m].primary) {
                        if (obj.providers[m].providerDisplayName) {
                            primary.push(this.stringSplitter(obj.providers[m].providerDisplayName));
                        }
                    }
                    if (obj.providers[m].providerDisplayName) {
                        provider.push(this.stringSplitter(obj.providers[m].providerDisplayName));
                    }
                }
                if (primary.length !== 0) {
                    arrResult = _.difference(provider, primary);
                    arrResult.unshift(primary);
                } else {
                    arrResult = provider;
                }
                if (arrResult.length !== 0) {
                    result = arrResult.join("<br/>");
                }
            } else {
                if (obj.providerDisplayName) {
                    result = _.isEmpty(obj.providerDisplayName) ? "Unknown" : obj.providerDisplayName;
                }
            }
            return result;
        },
        admissionDiagnosis: function(obj) {
            var result;
            var Unknown = "Unknown";
            var diagnosis = [];
            if (_.isUndefined(obj.dischDiagn)) {
                result = obj.reasonName || Unknown;
            } else {
                _.each(obj.dischDiagn, function(val) {
                    if (!_.isUndefined(val.icdName)) {
                        if (val.icdName === "") {
                            diagnosis.push(Unknown);
                        } else {
                            diagnosis.push(val.icdName);
                        }
                    }
                });
                if (diagnosis.length > 0) {
                    result = diagnosis.join(";//");
                } else {
                    result = Unknown;
                }
            }
            return result;
        },
        getTimeSinceForFuture: function(array) {
            var dateTime;
            for (var m = array.length - 1; m > 0; m--) {
                dateTime = moment(array[m].dateTime, 'YYYYMMDDHHmm');
                if (dateTime.isAfter()) {
                    return array[m].dateTime;
                }
            }
            return array[m].dateTime;
        },
        getRecentForFuture: function(array) {
            var dateTime;
            var arrRecent = [];
            var index = 0;
            var future = false;
            var k = 0;
            for (var m = array.length - 1; m > 0; m--) {
                dateTime = moment(array[m].dateTime, 'YYYYMMDDHHmm');
                if (dateTime.isAfter()) {
                    future = true;
                    index = m;
                    m = 0;
                }
            }
            if (!future) { // no events in a future
                arrRecent = array.slice(0, 5);
            } else {
                if ((array.length - (index + 1)) > 0) { //more than 1 event in a future
                    for (var n = index; n >= 0; n--) {
                        arrRecent.push(array[n]);
                        k++;
                        if (k >= 5) n = -1; // 5 next events
                    }
                } else { // 1 event in a future
                    arrRecent = array.slice(0, 5);
                    future = false;
                }
            }
            return {
                aResult: arrRecent,
                bFutureTime: future
            };
        },
        setAggregationScale: function(selector) {
            var result = "ymd";
            /*  if(selector == "all-range-global") {
                  result = "y";
              } else if(selector == "1yr-range-global"){
                  result = "ymd";
              } else if (selector == "2yr-range-global"){
                  result = "ym";
              }else if (selector == "custom-range-apply-global"){
                  result = "ym";
              }*/
            return result;
        },
        displayDate: function(datetime) {
            return moment(datetime, 'YYYYMMDD').format('YYYY-MM-DD'); //'YYYY-MM-DD'
        },
        isAppointment: function(model) {
            if ((model.uid.indexOf('appointment') !== -1) && (this.isVisit(model))) {
                return true;
                /*if(moment(model.dateTime,'YYYYMMDDHHmm').isBefore(moment())){ 
                    return false;
                }else{
                    return true;
                }*/
            } else {
                if ((model.uid.indexOf('visit') !== -1) && (this.isVisit(model))) { // in the future
                    if (moment(model.dateTime, 'YYYYMMDDHHmm').isAfter(moment())) {
                        return true;
                    }
                }
            }
            return false;
        },
        isProcedure: function(model) {
            if (model.kind.indexOf('Procedure') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        isAdmission: function(model) {
            if (model.kind.indexOf('Admission') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        isDoDAppointment: function(model) {
            if (model.kind.indexOf('DoD Appointment') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        isDoDAppointmentFuture: function(model) {
            if (model.kind.indexOf('DoD Appointment') !== -1) {
                if (moment(model.dateTime, 'YYYYMMDDHHmm').isAfter(moment())) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        isDoDEncounter: function(model) {
            if (model.kind.indexOf('DoD Encounter') !== -1) {
                return true;
            } else {
                return false;
            }
        },
        showDetailView: function(paramObj, channelName) {
            //console.log(paramObj);       
            var channelObject = paramObj;
            var model = channelObject.model = new Backbone.Model(channelObject.model.get("recent_model"));

            var modal = new ADK.UI.Modal({
                view: ADK.Views.Loading.create(),
                options: {
                    size: "large",
                    title: "Loading..."
                }
            });
            modal.show();

            var channel = ADK.Messaging.getChannel(channelName),
                deferredResponse = channel.request('detailView', channelObject);

            deferredResponse.done(function(response) {
                var modal = new ADK.UI.Modal({
                    view: response.view,
                    options: {
                        size: "large",
                        title: response.title
                    }
                });
                modal.show();
                $('#mainModal').modal('show');
            });
        },
        // Clean up kind/subkind
        clanUpItem: function(item) {
            return item.replace(/[\s\\/()!?*&:;,.^'"<>%]/g, '');
        },
        // sets first event, depends on GDF and first event for patient 
        selectStartStopPoint: function(firstEvent) { //YYYYMMDD
            //console.log(firstEvent);
            //var filterMode = ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("selectedId");
            var filterMode = ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("selectedId");
            var fromDate = moment(ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("fromDate"), "MM/DD/YYYY").format("YYYYMMDD"); //MM/DD/YYYY
            var toDate = moment(ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("toDate"), "MM/DD/YYYY").format("YYYYMMDD");
            //var maxDate = +new Date + (6 * 24 * 3600 * 1000 * 30); // 6 monthes ahead
            var maxDate = moment().add(6, 'M'); // 6 monthes ahead
            var aDate = moment().add(1, 'd'); // 6 monthes ahead

            if (filterMode === "all-range-global") {
                return {
                    start: firstEvent,
                    stop: moment(maxDate).format("YYYYMMDD")
                };
            } else if (filterMode === "custom-range-apply-global") {
                //return {start: fromDate, stop: moment(toDate, 'MM/DD/YYYY')*(24 * 3600 * 1000 * 30)};
                return {
                    start: fromDate,
                    stop: toDate
                };
            }
            //return {start: fromDate, stop: moment(maxDate).format("YYYYMMDD") };
            return {
                start: fromDate,
                stop: moment(aDate).format("YYYYMMDD")
            };
        },
        // empty model for top tile   
        getEmpty: function(start) {
            return {
                kind: "",
                elKind: "",
                count: 0,
                firstEvent: this.selectStartStopPoint(start).start,
                lastEvent: "",
                timeSinceLast: "None",
                chartData: [],
                firstEventDisplay: "",
                lastEventDisplay: "",
                maxChart: this.selectStartStopPoint(start).stop,
                processed: true,
                empty: true,
                order: 0
            };
        },
        // Adds empty data if top categories not exist
        addEmptyTiles: function(collection, start) {
            var arrTiles = [];
            var arrKind = [];
            //var model = this.getEmpty();
            for (var tile in EVENT_LIST) {
                //console.log(EVENT_LIST[tile].title);
                arrTiles.push(EVENT_LIST[tile].title);
                arrKind.push(tile);
            }
            for (var i = 0; i < arrTiles.length; i++) {
                if (collection.where({
                        kind: arrTiles[i]
                    }).length === 0) {
                    var model = this.getEmpty(start);
                    // Prepare empty model
                    if (EVENT_LIST[arrKind[i]]) {
                        model.kind = arrTiles[i];
                        model.elKind = this.clanUpItem(model.kind);
                        model.order = EVENT_LIST[arrKind[i]].order;
                    }
                    // Add empty model
                    //console.log(arrTiles[i]);
                    collection.add(model);

                }
            }

        },
        // Needs to check data source (probally filtering already done) added by VR 2015-02-02
        filterAppointments: function(collection) {
            var i, k;
            var arrToRemove = [];
            var dataset = new Crossfilter(collection.toJSON());
            var dimByKind = dataset.dimension(this.crossfilterStuff.dimKind); //this.crossfilterStuff.dimKind
            var arrVisits = dimByKind.filterExact("Visit").top(Infinity);
            dimByKind.filterAll();
            var arrAppointment = dimByKind.filterExact("Appointment").top(Infinity);
            dimByKind.filterAll();
            //console.log(arrAppointment);
            //console.log(arrVisits);
            for (i = 0; i < arrAppointment.length; i++) {
                for (k = 0; k < arrVisits.length; k++) {
                    if ((arrAppointment[i].dateTime.toLowerCase() == arrVisits[k].dateTime.toLowerCase()) && (arrAppointment[i].stopCodeName.toLowerCase() == arrVisits[k].stopCodeName.toLowerCase()) && (arrAppointment[i].facilityName.toLowerCase() == arrVisits[k].facilityName.toLowerCase())) {
                        if (DEBUG) console.log("Appointment duplication ----->>>" + arrVisits[k].dateTime.toLowerCase() + " | " + arrAppointment[i].facilityName + " | " + arrVisits[k].facilityName);
                        arrToRemove.push(collection.findWhere({
                            uid: arrAppointment[i].uid
                        }));
                    }
                }
            }
            dimByKind.dispose();
            dataset = null;
            // remove duplicated Appointments
            collection.remove(arrToRemove);
            return arrToRemove.length; // number of duplications
        },
        crossfilterStuff: {
            dimKind: function(d) {
                return d.kind;
            }
        },
        isHospitalization: function(model) {
            return model.categoryCode === 'urn:va:encounter-category:AD';
        },
        //returns true if discharged, false if admitted
        isDischargedOrAdmitted: function(model) {
            if (model.stay === undefined)
                throw "stay is required for this method!";
            return model.stay.dischargeDateTime !== undefined;
        },
        isVisit: function(model) {
            return this.isKindTypeHelper(model, "visit");
        },
        /*isVisit: function(model) {
            return this.isKindTypeHelper(model, "visit") ||
                this.isKindTypeHelper(model, "admission");
        },*/
        isKindTypeHelper: function(model, kindType) {
            if (model === undefined) return false;
            var kind = model.kind;
            if (model instanceof Backbone.Model)
                kind = model.get('kind');
            if (kind === undefined) return false;
            kind = kind.toLowerCase();
            return (kind === kindType);
        },
        getActivityDateTime: function(model) {
            if (this.isVisit(model)) {
                if (this.isHospitalization(model) && this.isDischargedOrAdmitted(model)) {
                    return model.stay.dischargeDateTime;
                }
                return model.dateTime;
            } else
                return model.dateTime;

        },
        convertChartDate: function(time) {
            return moment.utc(time, "YYYYMMDD").valueOf();
        },
        nowChart: function() {
            var tm = moment().format("YYYYMMDDHHmmssSSS");
            //if(DEBUG) console.log(this.convertChartDate(tm));
            return this.convertChartDate(tm);
        }

        // end of appHelpers
    };
    return appHelper;
});