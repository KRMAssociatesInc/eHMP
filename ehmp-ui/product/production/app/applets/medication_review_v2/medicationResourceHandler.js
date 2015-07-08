define([
    'main/ADK',
    "app/applets/medication_review_v2/medicationCollectionFormatHelper",
    "app/applets/medication_review_v2/charts/chartBuilder",
    "app/applets/medication_review_v2/medicationCollectionHandler"
], function(ADK, medicationCollectionFormatHelper, chartBuilder, CollectionHandler) {
    /* 
    -------------How to use these functions-------------
    1.  fetchAllMeds(useGlobalDataFilter): Fetches the medication data and filters the data based on the GDF if useGlobalDataFilter is true
                                           If useGlobalDataFilter is false the full meds collection is returned.
    2.  chartBuilder: Returns the set of functions necessary to build the highchats object
    3.  getMedicationGroupNames(collection): Pass in the collection returned from  "fetchAllMeds" and it returns an array of group names;
    4.  getMedicationGroup(collection, groupName): Pass in the collection returned from  "fetchAllMeds" and a group name from "getMedicationGroupNames".
                                                   Returns an object with two groups; inpatient meds and outpatient meds; 
    */
    return {
        fetchAllMeds: CollectionHandler.fetchAllMeds,
        chartBuilder: chartBuilder,
        getMedicationGroupNames: medicationCollectionFormatHelper.getMedicationGroupNames,
        getMedicationGroup: medicationCollectionFormatHelper.getMedicationGroup
    };
});