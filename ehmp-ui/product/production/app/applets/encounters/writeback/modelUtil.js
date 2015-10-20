define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'moment'
],function(Backbone, Marionette, $, _, Moment) {
    'use strict';
    var DEBUG = false;
    var userSession  = ADK.UserService.getUserSession();
    var currentProvider = userSession.get('firstname') + ' ' + userSession.get('lastname');

     var util = {
         retrieveProcedureItems: function(form) {
            //Verify ClinicIen
            var clinicIen = ADK.PatientRecordService.getCurrentPatient().attributes.visit.locationUid;
            if(clinicIen === undefined){
                return;
            }

            //Construct fetch url & fetch collection
            clinicIen=clinicIen.split(':').splice(-1);
            var url = 'resource/write-pick-list?type=encounters-procedure-types';
            var formatDate= ADK.PatientRecordService.getCurrentPatient().attributes.visit.dateTime;
            var visitDate =  moment(formatDate, 'YYYYMMDDHHmm').format('MMDDYYYY');
            var site = ADK.UserService.getUserSession().attributes.site;
            url += '&ien=' + clinicIen + '&visitDate=' + visitDate + '&site=' + site;
            var encountersFetch = new Backbone.Collection();
            encountersFetch.url = url;

            //Make RDK Call
            encountersFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     encountersFetch.reset();
                 },

                 success: function(collection,resp) {
                    /**** SUCCESS: Lets put it in the model **/
                    var procedurePicklist = form.model.get('ProcedureCollection');

                    //Set picklist for comment box
                    var provider = form.model.set('provider', util.setPrimaryProvider(form));
                    form.$(form.ui.provider).trigger('control:picklist:set', provider.provider);

                    //Lets go through each item and put in model appropriately.
                    for(var list=0; list < resp.data.length; list++){
                        var procOptionsList = resp.data[list];
                        var listItems = new Backbone.Collection();
                        //If sublist available
                        if (procOptionsList.cptCodes !== undefined) {
                            //Let's set it up for the model
                            for(var item = 0; item < procOptionsList.cptCodes.length; item++){
                               listItems.add({
                                    id:procOptionsList.cptCodes[item].ien,
                                    label: procOptionsList.cptCodes[item].name,
                                    value: false, //For checklist
                                    //rest for comment box
                                    quantity: 1,
                                    provider: currentProvider,
                                    comments: new Backbone.Collection([]),
                                    modifiers: []
                                });
                            }
                        }


                        procedurePicklist.add({
                                value: procOptionsList.categoryName,
                                label: procOptionsList.categoryName,
                                listItems: listItems
                        });
                    }

                    $('#procedureSection').trigger('control:picklist:set', procedurePicklist);
                    //Autoselect the first option
                    if(procedurePicklist.length !== 0){// Just in case the data vanishes.
                        form.model.set('procedureSection', procedurePicklist.models[0].attributes.label);
                    }
                    console.log('Procedure Section populated.');
                 }
             });
        },
        retrieveProviders: function(form) {
            //Set Primary Provider for Availble Providers
            form.model.set('selectedPrimaryProvider', currentProvider);
            form.$(form.ui.selectedPrimaryProvider).trigger('control:picklist:set', util.setPrimaryProvider(form));

            //Construct the url
            var site = ADK.UserService.getUserSession().attributes.site;
            var url = 'resource/write-pick-list?type=new-persons&new-persons-type=PROVIDER&searchString=OPTIONAL~&dateTime=OPTIONAL&site='+site;
            var providersFetch = new Backbone.Collection();
            providersFetch.url = url;

            //Fetch the Data!
            providersFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     providersFetch.reset();
                 },
                 success: function(collection,resp) {
                    /** SUCCESS: Let's start populating the list **/
                    var providersList =  form.model.get('providerList');
                    for(var list=0; list < resp.data.length; list++){
                    var provOptionsList = resp.data[list];
                    providersList.add({
                                name: provOptionsList.code,
                                label: provOptionsList.name,
                                value: false

                            });
                 }

                console.log('Providers List Populated');
                }
             });
        },
        retrieveProcedureLexicon: function(form, searchString, context) {
            //Show the loading screen.
            form.$(form.ui['SelectAddOther' + context]).trigger("control:loading:show");

            //Construct the url
            var url = 'resource/write-pick-list?type=encounters-procedures-lexicon-lookup';
            var site = ADK.UserService.getUserSession().attributes.site;
            url += '&site=' + site + '&searchString=' + searchString;
            var lexFetch = new Backbone.Collection();
            lexFetch.url = url;

            //Fetch the data!
            lexFetch.fetch({
                 error: function(collection, resp) {
                     console.log("error: " + resp.responseText);
                     lexFetch.reset();
                 },

                 success: function(collection, resp) {
                    /** SUCCESS: Now let's populate **/
                     form.$(form.ui['SelectAddOther' + context]).trigger("control:loading:hide");
                     var procLex = new Backbone.Collection();
                     var currList;
                     for (var list = 0; list < resp.data.length; list++){
                        currList = resp.data[list];
                        procLex.add({
                            value: currList.ien,
                            label: currList.name,
                            id: currList.ien

                        });
                     }
                     form.$(form.ui['SelectAddOther' + context]).trigger("control:picklist:set", procLex);

                     console.log('Populated Procedure Search');
                 }
             });
        },
        retrieveDiagnosisItems: function(form) {
            var util = this;
            var fetchOptions = {
                resourceTitle: 'patient-record-problem',
                criteria: { },
                onSuccess: function(collection) {
                    /*** SUCCESS: Let's start constructing the picklist. ***/
                    //Condition is weird so we have to format it
                    var rawCondData = collection.models;
                    var condItems = [{categoryName:'CONDITION LIST ITEMS', values: []}];
                    for(var model=0; model < rawCondData.length; model++){
                        condItems[0].values[model] = {
                            icdCode: rawCondData[model].attributes.icdCode,
                            name: rawCondData[model].attributes.icdName,
                        };
                    }

                    util.addToDiagnosisList(form, condItems);
                    //Now let's go get the rest of them!
                    util.retrieveDiagCont(form);
                    console.log('Condition List Populated');
                },
                onError: function(model, response) {
                    console.log('error: ' + response.responseText);
                }
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions);

        },
        retrieveDiagCont: function(form) {
            //Verify clinicIen
            var clinicIen = ADK.PatientRecordService.getCurrentPatient().attributes.visit.locationUid;
            if(clinicIen === undefined){
            }

            //Construct url
            var url = 'resource/write-pick-list?type=encounters-diagnosis-codes-for-clinic';
            var site = ADK.UserService.getUserSession().attributes.site;
            clinicIen=clinicIen.split(':').splice(-1);
            var util = this;
            url += '&site=' + site + '&clinic=' + clinicIen;
            var diagFetch = new Backbone.Collection();
            diagFetch.url = url;

            //Fetch the data!
            diagFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     diagFetch.reset();
                 },
                 success: function(collection, resp) {
                    /** SUCCESS: Now let's populate the rest of the picklist **/
                    util.addToDiagnosisList(form, resp.data);

                    $('#diagnosesSection').trigger('control:picklist:set',form.model.get('DiagnosisCollection'));
                    //Set condition list as selected
                    form.model.set('diagnosesSection', 'CONDITION LIST ITEMS');
                    console.log('Diagnosis List Populated');
                 }
             });
        },
        /** Factored out adding to diagnosis Picklist to reduce code duplication **/
        addToDiagnosisList: function(form, data) {
            var diagnosisPicklist = form.model.get('DiagnosisCollection');
            for (var list = 0; list < data.length; list++){
                //Add List as option in Diagnositic Panel
                var currList = data[list];

                //Establish Lists for Condition List Panel
                var listItems = new Backbone.Collection();
                if (currList.values !== undefined) {
                    for(var item = 0; item < currList.values.length; item++){
                        listItems.add({
                            name: currList.values[item].icdCode,
                            label: currList.values[item].name,
                            value: false, //checklist
                            //commentbox
                            addToCL: false,
                            comments: new Backbone.Collection([]),
                            primary: false,
                        });
                    }
                }
                diagnosisPicklist.add({
                    value: currList.categoryName,
                    label: currList.categoryName,
                    listItems: listItems
                });
             }
        },
        retrieveDiagnosisLexicon: function(form, searchString, context) {
            //Show loading screen
            form.$(form.ui['SelectAddOther' + context]).trigger('control:loading:show');

            //Construct url
            var url = 'resource/write-pick-list?type=encounters-diagnosis-lexicon-lookup';
            var site = ADK.UserService.getUserSession().attributes.site;
            url += '&site=' + site + '&searchString=' + searchString;
            var lexFetch = new Backbone.Collection();
            lexFetch.url = url;

            //Fetch the data!
            lexFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     lexFetch.reset();
                 },

                 success: function(collection, resp) {
                /** SUCCESS: Now let's populate **/
                    //Hide loading screen
                     form.$(form.ui.diagSearchSelect).trigger('control:loading:hide');
                     var diagLex = new Backbone.Collection();
                     var currList;
                     for (var list = 0; list < resp.data.length; list++) {
                        currList = resp.data[list];
                        diagLex.add({
                            value: currList.name,
                            label: currList.name
                        });
                     }
                     //Show the data
                     form.$(form.ui['SelectAddOther' + context]).trigger('control:picklist:set', diagLex);
                     console.log('Populated Diagnosis Search');
                 }
             });
        },
        retrieveRatedDisabilties: function(form) {
            //Construct the url
            var url = 'resource/patient/record/service-connected/serviceconnectedrateddisabilities?';
            var pid = ADK.PatientRecordService.getCurrentPatient().attributes.icn;
            url += 'pid=' + pid;
            var ratedFetch = new Backbone.Collection();
            ratedFetch.url = url;

            //Fetch the data!
            ratedFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     ratedFetch.reset();
                 },

                 success: function(collection, resp) {
                    /** SUCCESS: Now let's populate the model **/
                     var ary = resp.data;

                     if(ary.serviceConnected === 'NO') {
                        form.model.set('serviceConnected', ary.serviceConnected);
                        form.model.set('ratedDisabilities', ary.disability);
                    }
                    else {
                        form.model.set('serviceConnected', ary.scPercent);
                        var tempString = '</br>';
                        for(var i = 0; i < ary.disability.length; i++){
                            tempString += ary.disability[i].name + ' ' + ary.disability[i].disPercent +
                                '%</br>';
                        }
                        form.model.set('ratedDisabilities', tempString);
                    }
                     console.log('Disabilities Populated');
                 }
             });
        },
        retrieveVisitRelated: function(form) {
            //Construct url
            var url = 'resource/patient/record/service-connected/serviceconnectedserviceexposurelist?';
            var pid = ADK.PatientRecordService.getCurrentPatient().attributes.icn;
            url += 'pid=' + pid;
            var util = this;
            var visitFetch = new Backbone.Collection();
            visitFetch.url = url;

            //Fetch the Data!
            visitFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     visitFetch.reset();
                 },

                 success: function(collection, resp) {
                    /** SUCCESS: Now lets put together the data **/
                    var selected = resp.data.exposure;
                     //Have to get the hardcoded values first.
                    var checklist = new Backbone.Collection(form.model.get('yesNoChecklist').models);
                    if(checklist.models.length === 0){
                        return;
                    }
                    for(var related = 0; related < selected.length; related++){
                        //Then get the id to be able to match it up with data
                        var name = selected[related].uid.split(':')[2];
                        if(selected[related].name === 'No') {
                            checklist.get(name).set({value: false});
                        }
                        else if(selected[related].name === 'Yes') {
                            checklist.get(name).set({value: true});
                        }
                        else {
                            checklist.get(name).set({value: undefined});
                        }
                    }

                    util.retrieveHidden(form, checklist);
                    console.log('Yes/No appropriately marked.');
                 }
             });
        },
        retrieveHidden: function(form, checklist){
            //Construct url
            var url = 'resource/write-pick-list?type=encounters-visit-service-connected';
            var site = ADK.UserService.getUserSession().attributes.site;
            var pid = ADK.PatientRecordService.getCurrentPatient().attributes.icn;
            var formatDate= ADK.PatientRecordService.getCurrentPatient().attributes.visit.dateTime;
            var visitDate =  moment(formatDate, 'YYYYMMDDHHmm').format('MMDDYYYY');
            url += '&site=' + site + '&dfn=' + pid + '&visitDate=' + visitDate;
            var disabledFetch = new Backbone.Collection();
            disabledFetch.url = url;

            //Fetch the data!
            disabledFetch.fetch({
                 error: function(collection, resp) {
                     console.log('error: ' + resp.responseText);
                     disabledFetch.reset();
                     //Well let's at least display what we got
                    form.model.set('yesNoChecklist', checklist);
                 },

                 success: function(collection, resp) {
                    /** SUCCESS: Now lets do the hiding **/
                    //But wait! Hiding doesn't appear to be an option. Let's disable for now.
                    var disabled = resp.data[0];
                    if (disabled.SC === '0') {
                        checklist.remove('service-connected');
                    }
                    if (disabled.AO === '0') {
                        checklist.remove('agent-orange');
                    }
                    if (disabled.IR === '0') {
                        checklist.remove('ionizing-radiation');
                    }
                    if (disabled.SHD === '0') {
                        checklist.remove('shad');
                    }
                    if (disabled.MST === '0') {
                        checklist.remove('mst');
                    }
                    if (disabled.HNC === '0') {
                        checklist.remove('head-neck-cancer');
                    }
                    if (disabled.CV === '0') {
                        checklist.remove('combat-vet');
                    }
                    if (disabled.SAC === '0') {
                        checklist.remove('sw-asia');
                    }

                    //Now let's update the form model!
                    form.model.get('yesNoChecklist').reset();
                    form.model.get('yesNoChecklist').set(checklist.models);
                    console.log('Visit Related Items Hidden (Disabled)');
                 }
            });
        },
         retrieveVisitType: function(form) {
            //Set text for empty slot
            $('input#available-Providers-modifiers-filter-results').attr("placeholder", "Select Provider");
            //Construct url
            var url = 'resource/write-pick-list?type=encounters-visit-categories';
            var formatDate= ADK.PatientRecordService.getCurrentPatient().attributes.visit.dateTime;
            var visitDate =  moment(formatDate, 'YYYYMMDDHHmm').format('MMDDYYYY');
            var clinicIen = ADK.PatientRecordService.getCurrentPatient().attributes.visit.locationUid.split(':').splice(-1);
            var site = ADK.UserService.getUserSession().attributes.site;
            url += '&ien=' + clinicIen + '&visitDate=' + visitDate + '&site=' + site;
            var visitFetch = new Backbone.Collection();
            visitFetch.url = url;

            //Fetch the Data!
            visitFetch.fetch({
                error: function(collection, resp) {
                    console.log('error: ' + resp.responseText);
                    visitFetch.reset();
                },
                success: function(collection,resp) {
                /** SUCCESS: Now let's populate the form **/
                    var visitPicklist = form.model.get('visitCollection');
                     for(var list=0; list < resp.data.length; list++){
                        var visitOptionsList = resp.data[list];

                         //Establish Lists for Procedure List Panel
                        var visitList = new Backbone.Collection();
                        if (visitOptionsList.cptCodes !== undefined) {
                            for(var item = 0; item < visitOptionsList.cptCodes.length; item++){
                               visitList.add({
                                    name: visitOptionsList.cptCodes[item].ien,
                                    label: visitOptionsList.cptCodes[item].name,
                                    value: false
                                });
                            }
                        }

                        visitPicklist.add({
                                label: visitOptionsList.categoryName,
                                value: visitOptionsList.categoryName,
                                items: visitList
                        });
                    }

                    $('#visitTypeSelection').trigger('control:picklist:set', visitPicklist);
                    //Set first option as selected
                    if(visitPicklist.length !== 0){ //Just in case the data vanishes
                        form.model.set('visitTypeSelection', visitPicklist.models[0].attributes.label);
                    }
                    console.log('Visit Type Populated');
                 }
            });

        },
        setPrimaryProvider: function(form) {
           var primaryProviderList =  new Backbone.Collection();
            primaryProviderList.add({
                                label: currentProvider,
                                value: currentProvider
            });
            return primaryProviderList;
        },
        /** Hasn't been updated/refactored since we're not getting the data right now
        to be able to tell if it's set up right. **/
        retrieveVisitModifiers: function(model, value, options) {
         if(value){
            var self = this;
            var url = "resource/write-pick-list?type=encounters-procedures-cpt-modifier";
            var cpt = model.attributes.name;
            var formatDate= ADK.PatientRecordService.getCurrentPatient().attributes.visit.dateTime;
            var visitDate =  moment(formatDate, 'YYYYMMDDHHmm').format('MMDDYYYY');
            var site = ADK.UserService.getUserSession().attributes.site;
            url += "&site=" + site + "&cpt=" + cpt + "&visitDate=" + visitDate;
            console.log("retrieveVisitModifiers function");
            modifiersFetch.url = url;
            modifiersFetch.fetch({
                 error: function(collection, resp) {
                     console.log("error: " + resp.responseText);
                     modifiersFetch.reset();
                 },
                 success: function(collection,resp) {
                    var modifiersList = new Backbone.Collection();
                     var modifiersOptions;
                     for (var list = 0; list < resp.data.length; list++){
                        modifiersOptions = resp.data[list];
                        modifiersList.add({
                            name: modifiersOptions.ien,
                            label: modifiersOptions.name,
                            value: false
                        });
                     }
                    self.model.get("availableProviders1").add(modifiersList.models);
                     console.log("success modsList");
                }
             });
          }
        }

    };
    return util;
});