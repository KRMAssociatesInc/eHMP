Ext.define('gov.va.hmp.CcowContext', {
    uses: [
        'gov.va.hmp.UserContext',
        'gov.va.hmp.PatientContext'
    ],
    statics: {
    	singleton: true,
        ccowEnabled: false,
        ccowInfo: {},
        initialized: false,
        init: function (postInitCallbackFn) {
        	if(gov.va.hmp.CcowContext.initialized) {return;}
//        	console.log("CCow Initializing....");
        	gov.va.hmp.CcowContext.initialized=true;
            if (Ext.isIE && Ext.isIE9p) {
                try {
                    gov.va.hmp.CcowContext.ccowInfo.contextorControl = new ActiveXObject("Sentillion.Contextor.1");//ContextorControl;
                    gov.va.hmp.CcowContext.ccowInfo.nameItem = new ActiveXObject("Sentillion.ContextItem.1");
                    gov.va.hmp.CcowContext.ccowInfo.localIdItem = new ActiveXObject("Sentillion.ContextItem.1");
                    gov.va.hmp.CcowContext.ccowInfo.nationalIdItem = new ActiveXObject("Sentillion.ContextItem.1");
                    gov.va.hmp.CcowContext.ccowInfo.contextCollection = new ActiveXObject("Sentillion.ContextItemCollection.1");
                    gov.va.hmp.CcowContext.postInit(postInitCallbackFn);
                    window.onbeforeunload = function(event) {
					   //in case of a close action with the white cross in the red square in the title bar
                    	gov.va.hmp.CcowContext.suspendContext();
                    	gov.va.hmp.CcowContext.initialized = false;
					}
                } catch (errorObject) {
                	gov.va.hmp.CcowContext.ccowError();
                	gov.va.hmp.CcowContext.ccowEnabled = false;
                }
            } else {
            	gov.va.hmp.CcowContext.ccowEnabled = false;
            }
        },
        
        postInit: function(postInitCallbackFn, secondCall) {
        	console.log("Ccow Post-Initializing...");
        	//this is the applications passcode, must be provided for User link
            var appcode = ""

            //the name of the application as configured
            var appname = "hmp"

            //True, if you application wnats to be surveyed prior to the context changing
            // this will cause the "Pending" event below to be fired
            var surveyable = true;
            
            var cstate = gov.va.hmp.CcowContext.ccowInfo.contextorControl.State;
        	console.log("(PostInit) State: " + cstate);
            if(cstate==1 && !secondCall) { // Contextor not started.
            	try {
            		gov.va.hmp.CcowContext.ccowInfo.contextorControl.Run(appname, appcode, surveyable);
            	} catch(errorObject) {
            		console.log("(PostInit) Unable to participate; Trying again with hmp#"); 
                	appname = appname + "#";
                	try {
                		gov.va.hmp.CcowContext.ccowInfo.contextorControl.Run(appname, appcode, surveyable);
                	} catch(errorObject) {
                    	console.log("Error starting Ccow: "+errorObject.description);
                	}
            	}
            	gov.va.hmp.CcowContext.postInit(postInitCallbackFn, true);
            	return;
            } else if(cstate==2) { // Contextor started, and we are participating (everything's jake)
                eval('function gov.va.hmp.CcowContext.ccowInfo.contextorControl::Pending(contextItems) { gov.va.hmp.CcowContext.pendingChangeCheck(gov.va.hmp.CcowContext.ccowInfo.contextorControl); }');
                eval('function gov.va.hmp.CcowContext.ccowInfo.contextorControl::Committed(contextItems) { gov.va.hmp.CcowContext.commitChange(gov.va.hmp.CcowContext.ccowInfo.contextorControl); }');
                gov.va.hmp.CcowContext.ccowEnabled = true;
            } else if(cstate==3 && !secondCall) { // Contextor is suspended
            	try {
            		gov.va.hmp.CcowContext.ccowInfo.contextorControl.Resume();
            	} catch(errorObject) {
                	console.log("Error resuming Ccow: "+errorObject.description);
            	}
            	gov.va.hmp.CcowContext.postInit(postInitCallbackFn, true);
            } else {
            	gov.va.hmp.CcowContext.ccowError();
            	gov.va.hmp.CcowContext.ccowEnabled = false;
            }
            
            if (gov.va.hmp.CcowContext.ccowOff()) {
            	console.log("CcowContext is off; (We should never get here)");
            	gov.va.hmp.CcowContext.ccowEnabled = false;
            }

            //enumerate over the collection and for now just dipslay them
            try {
                //get the current context
                var contextItems = gov.va.hmp.CcowContext.ccowInfo.contextorControl.CurrentContext;
                var dfn, icn, token, site;
                var coll = new Enumerator(contextItems);
                if (!coll.atEnd()) {
	                for (; !coll.atEnd(); coll.moveNext()) {
	                    var itemName = coll.item().name;
	                    var itemValue = coll.item().value;
	                    console.log("(PostInit) "+itemName + ": " + itemValue);
	                    if (itemName.indexOf("dfn") > 0) dfn = itemValue;
	                    if (itemName.indexOf("nationalidnumber") > 0) icn = itemValue;
	                    if (itemName.indexOf("vistatoken") > 0) token = itemValue;
	                    if (itemName.indexOf("vistalogon") > 0) site = itemValue;
	                }
                }
//                console.log("dfn: " + dfn);
//                console.log("token: " + token);
//                console.log("State: " + ContextorControl.State);
                gov.va.hmp.CcowContext.ccowInfo.token = token;

            } catch (errorObject) {
                // might want to find a way to pass the errorObject...
//                console.log('Error in context change');
            	gov.va.hmp.CcowContext.ccowError();
            	gov.va.hmp.CcowContext.ccowEnabled = false;
            }
        	gov.va.hmp.CcowContext.ccowEnabled = true;
            if(Ext.isFunction(postInitCallbackFn)) {
            	postInitCallbackFn();
            }
        },
        
        pendingChangeCheck: function () {
//        	if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();}
            console.log('In new pending change check');
            if (gov.va.hmp.CcowContext.ccowInfo.contextorControl.State == 2) {
                var patientChanged = false;
                var dfn, patientString, icn, site;
                var contextItems = gov.va.hmp.CcowContext.ccowInfo.contextorControl.CurrentContext;
                var coll = new Enumerator(contextItems);
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
                    console.log("Pending " + itemName + ": " + itemValue);
                    if (itemName.indexOf("dfn") > 0) {
                        dfn = itemValue;
                        patientString = itemName;
                    }
                    if (itemName.indexOf("nationalidnumber") > 0) icn = itemValue;
                    if (itemName.indexOf("vistalogon") > 0) site = itemValue;

                }
                if (dfn) {
                    var pid;
                    var userDetails = gov.va.hmp.UserContext;
                    var vistaId = userDetails.getUserInfo().vistaId;
                    pid = vistaId +';'+ dfn;
                    if (gov.va.hmp.CcowContext.accountCheck(pid, patientString) == false) {
                    	gov.va.hmp.CcowContext.suspendContext();
                        return;
                    }
                    if (!gov.va.hmp.CcowContext.checkPatientChange(pid, true, false)) {
//                        suspendContext(ContextorControl);
                    }
                }

            }

        },

        commitChange: function () {
            if (gov.va.hmp.CcowContext.ccowInfo.contextorControl.State == 2) {
                var patientChanged = false;
                var dfn, patientString, icn, site;
                var coll = new Enumerator(gov.va.hmp.CcowContext.ccowInfo.contextorControl.CurrentContext);
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
                    console.log("Committed " + itemName + ": " + itemValue);
                    if (itemName.indexOf("dfn") > 0) {
                        dfn = itemValue;
                        patientString = itemName;
                    }
                    if (itemName.indexOf("nationalidnumber") > 0) icn = itemValue;
                    if (itemName.indexOf("vistalogon") > 0) site = itemValue;

                }
//                console.log("committed dfn: " + dfn);
//                console.log("committed icn: " + icn);
                if (dfn) {
                    var pid;
                        var userDetails = gov.va.hmp.UserContext;
                        var vistaId = userDetails.getUserInfo().vistaId;
                        pid = vistaId +';'+ dfn;
                    if (pid != gov.va.hmp.PatientContext.pid) gov.va.hmp.CcowContext.changeContext(pid, dfn, icn, site, patientString);
                }
            }

        },

        ccowChangePatient: function (pid, icn, dfn, name, contextor) {
            var userInfo = gov.va.hmp.UserContext.getUserInfo();
            var prod = userInfo.attributes.productionAccount;
            try {
                if ((dfn) && (contextor.State == 2)) {
                    var temp = true;
                    var response;
                    contextor.StartContextChange();
                    gov.va.hmp.CcowContext.setIcon(3);
                    var tempCollection = gov.va.hmp.CcowContext.ccowInfo.contextCollection;
                    tempCollection.removeAll();
                    var nameItem = gov.va.hmp.CcowContext.ccowInfo.nameItem;
                    var localId = gov.va.hmp.CcowContext.ccowInfo.localIdItem;
                    var nationalId = gov.va.hmp.CcowContext.ccowInfo.nationalIdItem;
                    //patient name
                    nameItem.name ='Patient.co.PatientName';
                    nameItem.value = name + '^^^^';
                    tempCollection.Add(nameItem);
                    //dfn
                    localId.name ='Patient.id.MRN.DFN_' + userInfo.primaryStationNumber;
                    if (!prod) localId.name = localId.name + '_TEST';
                    localId.value = dfn;
                    tempCollection.Add(localId);
                    //icn
                    if(icn != null) {
                        nationalId.name ='Patient.id.MRN.NationalIDNumber';
                        if (!prod) nationalId.name = nationalId.name + '_TEST';
                        if (icn.indexOf(pid)==0) nationalId.value = pid
                        else nationalId.value = icn;
                        tempCollection.Add(nationalId);
                    }
                    var coll = new Enumerator(tempCollection);
                    for (; !coll.atEnd(); coll.moveNext()) {
                        var itemName = coll.item().name;
                        var itemValue = coll.item().value;
                        console.log("in ccowChangePatient " + itemName + ": " + itemValue);
                    }
                    response = contextor.EndContextChange(temp, tempCollection);
                    // response = 1 commint, 2= cancel, 3 = breakLink
                    
                    if (response == 1) {
                    	gov.va.hmp.CcowContext.setIcon(1);
                        return true;
                    } else if (response == 2) {
                    	gov.va.hmp.CcowContext.setIcon(1);
                        return false;
                    } else {
                        gov.va.hmp.CcowContext.suspendContext();
                        return true;
                    }
                }

            }
            catch (errorObject) {
            	gov.va.hmp.CcowContext.ccowError();
                return true;
            }
        },

        changeContext: function (pid, dfn, icn, site, patientString) {
//            console.log('in changeContext');
            if (pid) {
                if (gov.va.hmp.CcowContext.accountCheck(pid, patientString) == false)  {
                	gov.va.hmp.CcowContext.suspendContext();
                    return;
                }
                try {
                	gov.va.hmp.CcowContext.ccowInfo.patientChangeStarted = true;
                    gov.va.hmp.CcowContext.checkPatientChange(pid, false, true);
                    gov.va.hmp.PatientContext.setPatientContext(pid);
                    gov.va.hmp.CcowContext.ccowInfo.patientChangeStarted = false;
                    gov.va.hmp.CcowContext.setIcon(1);
                }
                catch (errorObject) {
                	gov.va.hmp.CcowContext.ccowError();
                }
            } else {
            	gov.va.hmp.CcowContext.ccowError();
            }
        },

        checkCcowChange: function (pid) {
//            console.log("in checkCcowChange");
            if (gov.va.hmp.CcowContext.ccowOff() == true) return true;
            if (gov.va.hmp.CcowContext.ccowInfo.patientChangeStarted == true) return true;
            var contextor = gov.va.hmp.CcowContext.ccowInfo.contextorControl;
            var icn, dfn, name;
            var store = Ext.StoreManager.lookup("ptSelectStore");
            var record = store.findRecord('pid', pid, 0, false, false, true);
            if (record) {
                name = record.raw.familyName + '^' + record.raw.givenNames;
                icn = record.raw.icn;
                dfn = record.raw.localId;
                return gov.va.hmp.CcowContext.ccowChangePatient(pid, icn, dfn, name, contextor);
            }
            return true;
        },

        checkPatientChange: function (pid, survey, change) {
//            console.log('in checkPatientChange');
            // reset the patient update date (for the patient poller)
            var fail = false;
            // first let any component veto a context change (ie: maybe there is a dirty editor)
            var comps = Ext.ComponentQuery.query('[patientAware=true]');
            for (var i = 0; i < comps.length; i++) {
                // TODO: could they return a string (veto reason eg 'You must save your worksheet first')?
                if (comps[i].fireEvent('beforepatientchange', pid, false, survey, change) !== true) {
                    // TODO: should this be the error mask? Mabye ErrorManager.warn()?
                    fail = true;
                }
            }
            if (fail == true) {
            	gov.va.hmp.CcowContext.ccowInfo.contextorControl.SetSurveyResponse("A form is open");
            }
//            console.log('in checkPatientChange out');
            return true;
        },

        accountCheck: function (pid, patientString) {
//        	if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();}
            var ccowDivision = gov.va.hmp.CcowContext.getCcowSite(patientString);
            var ccowProd = gov.va.hmp.CcowContext.isCcowProd(patientString);
            var userDetails = gov.va.hmp.UserContext;
            var userName = userDetails.userInfo.displayName;
            var division = gov.va.hmp.UserContext.getUserInfo().division;
            var divisionName = gov.va.hmp.UserContext.getUserInfo().divisionName;
//            not sure if this is needed if division mismatch.
//            ccow logon does not set division value
//            if (division != ccowDivision) {
//                return false;
//            }
//            check test site
          var prod = userDetails.getUserInfo().attributes.productionAccount;
            if (ccowProd != prod) return false;
            return true;
        },

        getCCOWPatient: function () {
        	if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();} // Used in PatientContext.js
            if (gov.va.hmp.CcowContext.ccowOff() == true) return '';
            var contextor = gov.va.hmp.CcowContext.ccowInfo.contextorControl;
            var dfn, icn, patientString, site;
//            console.log('contextor state: '+ contextor.State);
            if (contextor.State == 2) {
                var collection = contextor.CurrentContext;
                var coll = new Enumerator(collection);
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
//                    console.log("in get CCOWPatient: " + itemName + ' ' + itemValue);
                    if (itemName.indexOf("dfn") > 0) {
                        dfn = itemValue;
                        patientString = itemName;

                    } else if (itemName.indexOf("nationalidnumber") > 0) {
                        icn = itemValue;
                    } else if (itemName.indexOf("vistalogon") > 0) site = itemValue;
                }

            } else return '';
            var pid = '';
            if ((typeof dfn != 'undefined')&&(dfn.length > 0)) {
                var userDetails = gov.va.hmp.UserContext;
                var vistaId = userDetails.getUserInfo().vistaId;
                pid = vistaId + ';' + dfn;
            }
            if (pid.length < 1) return '';
            if (gov.va.hmp.CcowContext.accountCheck(pid, patientString) == false) {
            	gov.va.hmp.CcowContext.suspendContext();
                return '';
            } else {return pid}
        },

        resumeContext: function () {
//        	if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();}
            try {
                var dfn, patientString, icn, site;
                gov.va.hmp.CcowContext.ccowInfo.contextorControl.Resume();
                contextItems = gov.va.hmp.CcowContext.ccowInfo.contextorControl.CurrentContext;
                var coll = new Enumerator(contextItems);
                for (; !coll.atEnd(); coll.moveNext()) {
                    var itemName = coll.item().name;
                    var itemValue = coll.item().value;
//                    console.log("In Resume " + itemName + ": " + itemValue);
                    if (itemName.indexOf("dfn") > 0) {
                        dfn = itemValue;
                        patientString = itemName;
                    }
                    if (itemName.indexOf("nationalidnumber") > 0) icn = itemValue;
                    if (itemName.indexOf("vistalogon") > 0) site = itemValue;
                }
                if (dfn) {
                    var pid;
                    var userDetails = gov.va.hmp.UserContext;
                    var vistaId = userDetails.getUserInfo().vistaId;
                    pid = vistaId + ';' + dfn;
                    gov.va.hmp.CcowContext.changeContext(pid, dfn, icn, site, patientString);
                }
            } catch (errorObj) {
            	gov.va.hmp.CcowContext.ccowError();
            }

        },

        suspendContext: function () {
        	if(gov.va.hmp.CcowContext.ccowInfo.contextorControl.State==3) {
        		console.log("(suspendContext) Already suspended, so we're OK.");
            	gov.va.hmp.CcowContext.setIcon(2);
        		return;
        	}
        	if(gov.va.hmp.CcowContext.ccowInfo.contextorControl.State==1) {
        		console.log("(suspendContext) Ccow is not running, so we're OK.");
            	gov.va.hmp.CcowContext.setIcon(2);
        		return;
        	}
            try {
            	gov.va.hmp.CcowContext.ccowInfo.contextorControl.Suspend();
            	gov.va.hmp.CcowContext.setIcon(2);
                console.log("(suspendContext) "+gov.va.hmp.CcowContext.ccowInfo.contextorControl.State);
            } catch (errorObj) {
            	gov.va.hmp.CcowContext.ccowError();
            }

        },

        getToken: function () { // Used for single sign-on, in ccow.vm 
        	if(!gov.va.hmp.CcowContext.initialized) {gov.va.hmp.CcowContext.init();}
        	return gov.va.hmp.CcowContext.ccowInfo.token;
        },

        getCcowSite: function(itemName) {
            var siteCode = itemName.slice(itemName.indexOf("_") + 1, itemName.length);
            if (siteCode.indexOf("_") != -1) {
                siteCode = siteCode.slice(0, siteCode.indexOf("_"));
            }
            return siteCode;
        },

        isCcowProd: function(itemName) {
            if (itemName.toUpperCase().indexOf("TEST") > 0) return false
            else return true;
        },

        setIcon: function(type)     {
            var comps = Ext.ComponentQuery.query('#ccowIcon');
            for (var i = 0; i < comps.length; i++) {
                comps[i].contextChange(type);
            }
        },

        noCcow: function() {
            if (gov.va.hmp.CcowContext.ccowInfo.contextorControl.State == 2) {
            	gov.va.hmp.CcowContext.suspendContext();
            }
            gov.va.hmp.CcowContext.ccowEnabled = false;
            gov.va.hmp.CcowContext.setIcon(4);
        },

        ccowError: function() {
            if (gov.va.hmp.CcowContext.ccowInfo.contextorControl && gov.va.hmp.CcowContext.ccowInfo.contextorControl.State == 2) {
            	gov.va.hmp.CcowContext.suspendContext();
            	Ext.Ajax.request({
            		url: "/ccow/disable",
            		method: "POST"
            	});
            }
            gov.va.hmp.CcowContext.ccowErrorState = true;
            gov.va.hmp.CcowContext.setIcon(4);

        },

        ccowOff: function() {
            if (gov.va.hmp.CcowContext.ccowErrorState == true) return true;
            else if (gov.va.hmp.CcowContext.isNoCcow()) return true;
            else return false;
        },

        isNoCcow: function() {
            return !gov.va.hmp.CcowContext.ccowEnabled;
        }
    }
});



