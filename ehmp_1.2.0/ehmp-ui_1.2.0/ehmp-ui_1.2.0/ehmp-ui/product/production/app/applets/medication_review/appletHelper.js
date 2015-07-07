define([
    "backbone",
    "marionette",
    "underscore",
], function(Backbone, Marionette, _) {
    var appletHelper = {
        isPRN: function(medDomainData) {
            if (medDomainData.sig && medDomainData.sig.toUpperCase().indexOf("AS NEEDED") != -1) {
                return true;
            } else if (medDomainData.scheduleType == "PRN") {
                return true;
            } else if (medDomainData.scheduleName && medDomainData.scheduleName.indexOf("PRN") != -1) {
                return true;
            } else {
                return false;
            }
        },

        hasFillDetail: function(medDomainData) {
            if (medDomainData.vaType == "O" || medDomainData.supply) {
                if (medDomainData.orders[0].fillsAllowed) {
                    return true;
                } else return false;
            } else {
                return false;
            }
        },

        hasScheduledTimes: function(medDomainData) {
            if (medDomainData.vaType == "I") {
                return true; //more logic will go into this once we know more about adminitrations
            }
            return false;
        },
        hasDailyDoseInfo: function(medDomainData) {
            if (medDomainData.scheduleFreq) {
                if (medDomainData.dose) {
                    if (medDomainData.vaType == "O" || medDomainData.vaType == "N") {
                        return true;
                    } else return false;
                } else return false;
            }
            return false;
        },

        getDailyOrScheduledDosePrefix: function(medDomainData) {
            if (this.hasScheduledTimes(medDomainData)) {
                return "Scheduled Times";
            }
            if (this.hasDailyDoseInfo(medDomainData)) {
                return "Total Daily";
            } else {
                return false;
            }
        },

        getDailyOrScheduledDose: function(medDomainData) {
            if (this.hasScheduledTimes(medDomainData)) {
                return "No Data";
            } else if (this.hasDailyDoseInfo(medDomainData)) {
                return 1440 / medDomainData.scheduleFreq * parseInt(medDomainData.dose) + " " + medDomainData.units;
            } else {
                return false;
            }
        },
        isExpiredSetter: function(medDomainData) {
            if (medDomainData.vaStatus) {
                switch (medDomainData.vaStatus.toUpperCase()) {
                    case "ACTIVE":
                        if (moment(medDomainData.overallStop, 'YYYYMMDDHHmmssSSS') < moment().format("YYYYMMDD")) {
                            return "Expired";
                        } else if (moment(medDomainData.stopped, 'YYYYMMDDHHmmssSSS') < moment().format("YYYYMMDD")) {
                            return "Expired";
                        }else {
                            return medDomainData.vaStatus;
                        }
                        break;
                    default:
                        return medDomainData.vaStatus;
                }
            }
        },
        getExpirationLabel: function(medDomainData) {
            if (medDomainData.vaStatus) {
                switch (medDomainData.vaStatus.toUpperCase()) {
                    case "PENDING":
                        return ""; //is this what we should put here? FYI, 9E7A;164 has Pending meds.
                    case "ACTIVE":
                        return "Expires";
                    case "SUSPEND":
                        return "Ordered";
                    case "HOLD":
                        return "Ordered";
                    case "EXPIRED":
                        return "Expired";
                    case "UNRELEASED":
                        return "";
                    case "DISCONTINUED":
                        return "Discontinued";
                    case "DISCONTINUED/EDIT":
                        return "Discontinued";
                    default:
                        // return "Add a new case to expirationLabel";
                        return "";
                }
            } else {
                return "";
            }
        },

        getLastDatePrefix: function(medDomainData) {
            if (medDomainData.vaType == "N") {
                return false;
            } else if (medDomainData.vaType == "I") {
                return "Last admin";
            } //add clinic orders to the if statement
            else if (medDomainData.lastFilled || medDomainData.supply) {
                return "Last filled";
            } else {
                return false;
            }
        },

        getLastDate: function(medDomainData) {
            if (medDomainData.vaType == "N") {
                return "";
            }
            if (medDomainData.vaType == "I") { //add clinic orders
                return medDomainData.lastAdmin;
            } else if (medDomainData.vaType == "O" || medDomainData.supply) {
                return medDomainData.lastFilled;
            } else {
                return "";
            }
        },

        getLastFillStyle: function(medDomainData) {
            if (!this.hasFillDetail(medDomainData)) {
                return "";
            } else if (medDomainData.orders[0].fillsRemaining === 0) {
                return "noFillsRemain";
            } else if (medDomainData.orders[0].fillsRemaining <= 3) {
                return "fewFillsRemain";
            } else {
                return "";
            }
        },

        getLastFillDetails: function(medDomainData) {
            if (medDomainData.vaType == "O" && !medDomainData.supply) {
                if (this.hasFillDetail(medDomainData)) {
                    return medDomainData.orders[0].fillsRemaining + " Refills (" + medDomainData.orders[0].daysSupply + " days each)";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        },

        getPickUpType: function(medDomainData) {
            if (medDomainData.routing == "W") {
                return "Window";
            }
            if (medDomainData.routing == "M") {
                return "Mail";
            } else return false;
        },

        getStandarizedFacilityCode: function(medDomainData) {
            if (medDomainData.facilityCode == "DOD") {
                return "DOD";
            }
            if (medDomainData.facilityCode == "500") {
                return "NCH";
            } else {
                return "";
            }
        },

        getStandardizedVaStatus: function(medDomainData) {
            var standardizedStatus;
            if (medDomainData.vaStatus) {
                standardizedStatus = this.isExpiredSetter(medDomainData).toUpperCase();
                if (standardizedStatus == "DISCONTINUED/EDIT") {
                    standardizedStatus = "DISCONTINUED";
                }
                return standardizedStatus;
            } else {
                return "";
            }
        },

        getSubcategory: function(medDomainData) {
            if (this.isPRN(medDomainData)) {
                return "PRN";
            } else if (medDomainData.vaType == "V") {
                return "IV";
            } else {
                return false;
            }
        },
        getSummaryViewDate: function(medDomainData) {
            var endStatus = this.getExpirationLabel(medDomainData);
            if (endStatus) {
                switch (endStatus) {
                    case "Expired":
                        return medDomainData.overallStop; //should this be overallStop or stopped?
                    case "Expires":
                        return medDomainData.overallStop;
                    case "Discontinued":
                        return medDomainData.stopped;
                    case "Ordered":
                        return medDomainData.orders[0].ordered;
                    default:
                        return false; //if it is Pending or Unreleased, do not return a date
                }
            } else {
                return false;
            }
        },
        getGroupByName: function(medDomainData) {
            if (medDomainData.qualifiedName) {
                return medDomainData.qualifiedName;
            } else {
                //get the first word from 'name' with no commas or spaces
                var groupbyValue = medDomainData.name.split(",")[0];
                return groupbyValue.split(" ")[0];
            }
        },
        getGroupByField: function(medDomainData) {
            if (medDomainData.qualifiedName) {
                return 'qualifiedName';
            } else {
                return 'name';
            }
        },
        sliceString: function(s) {
            return s.slice(s.lastIndexOf(":") + 1, -1);
        },

        sortCollection: function(collection, key1, key2, sortType, ascending) {
            if (sortType) {
                // Checking collection models to see if they have the specified key
                var hasKey1 = false;
                if (collection.at(0).attributes[key1]) {
                    hasKey1 = true;
                } else if (collection.at(collection.length - 1).attributes[key1]) {
                    hasKey1 = true;
                } else {
                    for (var i = 1, collectionLength1 = collection.length; i < collectionLength1 - 1; i++) {
                        if (collection.at(i).attributes[key1]) {
                            hasKey1 = true;
                            break;
                        }
                    }
                }
                var hasKey2 = false;
                if (collection.at(0).attributes[key2]) {
                    hasKey2 = true;
                } else if (collection.at(collection.length - 1).attributes[key2]) {
                    hasKey2 = true;
                } else {
                    for (var j = 1, collectionLength2 = collection.length; j < collectionLength2 - 1; j++) {
                        if (collection.at(j).attributes[key2]) {
                            hasKey2 = true;
                            break;
                        }
                    }
                }
                if (hasKey1) {
                    collection.comparator = function(item1, item2) {
                        var ascendingToggle;
                        if (ascending) {
                            ascendingToggle = 1;
                        } else {
                            ascendingToggle = -1;
                        }
                        var item1val1 = item1.get(key1);
                        var item2val1 = item2.get(key1);
                        var item1val2 = item1.get(key2);
                        var item2val2 = item2.get(key2);

                        if (sortType === "alphanumerical" || sortType === "numeric" || sortType === "date" || sortType === "alphabetical") {
                            if (item1val1 === item2val1) {
                                if (hasKey2) {
                                    if (item1val2 > item2val2 || item2val2 === undefined) {
                                        return -1;
                                    } else if (item1val2 < item2val2) {
                                        return 1;
                                    }
                                }
                                return 0;
                            } else if ((item1val1 < item2val1) || (item2val1 === undefined)) {
                                return -1 * ascendingToggle;
                            } else {
                                return 1 * ascendingToggle;
                            }
                        }
                    };
                    collection.sort();
                }

            }
        },

        parseMedResponse: function(response) {
            var groupType;
            if (response.supply) {
                response.groupType = "Supplies";
            } else if (response.IMO) {
                response.groupType = "Clinic Orders";
            } else {
                response.groupType = response.vaType;
                if (response.groupType == "V") {
                    response.groupType = "I";
                }
            }
            if (response.name) {
                response.name = response.name.toLowerCase();
            }
            if (response.products[0]) {
                if (response.products[0].ingredientName) {
                    response.ingredientName = response.products[0].ingredientName;
                }
            }
            if (response.dosages && response.dosages[0]) {
                if (response.dosages[0].dose) {
                    response.dose = response.dosages[0].dose;
                }
                if (response.dosages[0].units) {
                    response.dosagesUnits = response.dosages[0].units;
                }
                if (response.dosages[0].routeName) {
                    response.routeName = response.dosages[0].routeName;
                }
                if (response.dosages[0].scheduleName) {
                    response.scheduleName = response.dosages[0].scheduleName;
                }
                if (response.dosages[0].start) {
                    response.start = response.dosages[0].start;
                }
                if (response.dosages[0].scheduleFreq) {
                    response.scheduleFreq = response.dosages[0].scheduleFreq;
                }
                if (response.dosages[0].scheduleType) {
                    response.scheduleType = response.dosages[0].scheduleType;
                }
                if (response.dosages[0].instructions) {
                    response.instructions = response.dosages[0].instructions;
                }
            }
            if (response.orders && response.orders[0]) {
                if (response.orders[0].fillsAllowed) {
                    response.fillsAllowed = response.orders[0].fillsAllowed;
                }
                if (response.orders[0].daysSupply) {
                    response.daysSupply = response.orders[0].daysSupply;
                }
                if (response.orders[0].orderUid) {
                    response.orderUid = this.sliceString(" \"" + response.orders[0].orderUid + " \"");
                }
            }
            if (response.fills && response.fills[0]) {
                if (response.fills[0].dispenseDate) {
                    response.dispenseDate = response.fills[0].dispenseDate;
                    response.routing = response.fills[0].routing;
                }
            }
            if (response.medStatusName) {
                response.medStatusName = response.medStatusName.toUpperCase();
            }

            if (response.uid) {
                try {
                    response.detailId = (response.uid).replace(/[:|.]/g, "_");
                } catch (err) {
                    console.log("detailId unable to be created");
                }
            }

            response.dailyOrScheduledDosePrefix = appletHelper.getDailyOrScheduledDosePrefix(response);
            response.dailyOrScheduledDose = appletHelper.getDailyOrScheduledDose(response);
            response.summaryViewDate = appletHelper.getSummaryViewDate(response);
            response.expirationLabel = appletHelper.getExpirationLabel(response);
            response.lastDate = appletHelper.getLastDate(response);
            response.lastDatePrefix = appletHelper.getLastDatePrefix(response);
            response.lastFillStyle = appletHelper.getLastFillStyle(response);
            response.lastFillDetails = appletHelper.getLastFillDetails(response);
            response.pickUpType = appletHelper.getPickUpType(response);
            response.standardizedFacilityCode = appletHelper.getStandarizedFacilityCode(response);
            response.standardizedVaStatus = appletHelper.getStandardizedVaStatus(response);
            response.subcategory = appletHelper.getSubcategory(response);

            /* create groupByField */
            response.groupbyField = appletHelper.getGroupByField(response);
            response.groupbyValue = appletHelper.getGroupByName(response);
            if (response.facilityName) {
                response.groupbyFacility = response.facilityName;
            }
            //console.log(response.groupByField);
            return response;
        },
        getMedicationGroupbyData: function(medModel) {
            return {
                groupbyValue: medModel.get('groupbyValue'),
                groupbyField: medModel.get('groupbyField'),
                groupbyFacility: medModel.get('groupbyFacility')
            };
        }
    };

    return appletHelper;
});
