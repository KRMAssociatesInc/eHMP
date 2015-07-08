VPRJTSOD ;KRM/CJE -- Unit Tests for GET/PUT/DELETE session Data
 ;;1.0;JSON DATA STORE;;Jan 27, 2015
 ;
 ; Endpoints tested
 ;POST/PUT session/set/this SET^VPRJSES
 ;GET session/get/{_id} GET^VPRJSES
 ;GET session/length/this LEN^VPRJSES
 ;DELETE session/destroy/{_id} DEL^VPRJSES
 ;GET session/destroy/{_id} DEL^VPRJSES
 ;DELETE session/clear/this CLR^VPRJSES
 ;GET session/clear/this CLR^VPRJSES
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
SITEOD(SITE,KEY,VALUE) ; Setup Session Data JSON for set
 Q "{""_id"": """_SITE_""","""_KEY_""": """_VALUE_"""}"
SETJSONERR ;; @TEST Error code is set if JSON is mangled in PUT/POST
 N RETURN,BODY,ARG,HTTPERR
 ; Create bad JSON
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S BODY(1)=BODY(1)_":"
 ; Send it to the URL
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 202 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
SETIDRR ;; @TEST Error code is set if no ID
 N RETURN,BODY,ARG,HTTPERR
 ; Try with a null _id field
 S BODY(1)=$$SITEOD("","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(220,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 220 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Try with a non existant _id field
 S BODY(1)="{""ZZUT"": ""20150127-1000""}"
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(220,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 220 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
SET1 ;; @TEST Store one Session Data
 N RETURN,BODY,ARG,HTTPERR
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJSES
 K ^VPRJSES("ZZUT")
 I $G(^VPRJSES(0))>0 S ^VPRJSES(0)=^VPRJSES(0)-1
 Q
SET2 ;; @TEST Store two Session Data
 N RETURN,BODY,ARG,HTTPERR
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,BODY,ARG
 ; Run it again with a new lastUpdate time
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1500")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1500",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,BODY,ARG
 ; Run it again with a new lastUpdate time that is smaller
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-25")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-25",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJSES
 K ^VPRJSES("ZZUT")
 I $G(^VPRJSES(0))>0 S ^VPRJSES(0)=^VPRJSES(0)-3
 Q
DELIDERR ;; @TEST Error code is set if no Id
 N DATA,OBJECT,ERR,ARGS,HTTPERR
 ; Try with a non existant _id
 D DEL^VPRJSES(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup vars
 K DATA,OBJECT,ERR,ARGS
 ; Try with a blank _id
 S ARGS("_id")=""
 D DEL^VPRJSES(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
DEL ;; @TEST Delete Session Data
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create Session Data
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now delete it
 S ARGS("_id")="ZZUT"
 D DEL^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT("{}",$G(DATA),"DATA returned from a DELETE call (should not happen)")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
LEN ;; @TEST Get number of Session Data
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create Session Data
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now get length
 D LEN^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error Occured")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(1,$G(OBJECT("length")),"The total number of objects doesn't match1")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K OBJECT,DATA,ERR,ARGS
 ; Create Session Data
 S BODY(1)=$$SITEOD("ZZUT1","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"A Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now get length
 D LEN^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error Occured")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(2,$G(OBJECT("length")),"The total number of objects doesn't match2")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJSES
 K ^VPRJSES("ZZUT")
 K ^VPRJSES("ZZUT1")
 I $G(^VPRJSES(0))>0 S ^VPRJSES(0)=^VPRJSES(0)-2
 Q
GETIDERR ;; @TEST Error code is set if no Id
 N DATA,ARGS,OBJECT,HTTPERR
 ; Try with a non existant _id attribute
 D GET^VPRJSES(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,OBJECT,ARGS
 ; Try with a null id
 S ARGS("_id")=""
 D GET^VPRJSES(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
GETJSONERR ;; Error code is set if encoding to JSON fails
 N DATA,ARGS,OBJECT,HTTPERR
 S ARGS("_id")="ZZUT"
 D GET^VPRJSES(.DATA,.ARGS)
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 202 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
GET ;; @TEST Get Session Data
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create Session Data
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored
 S ARGS("_id")="ZZUT"
 D GET^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"Session Data does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1000",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,ARGS,OBJECT,ERR
 ; Create Session Data update
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1500")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJSES("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1500",$G(^VPRJSES("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored update
 S ARGS("_id")="ZZUT"
 D GET^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJSES("ZZUT")),"Session Data does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1500",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,ARGS,OBJECT,ERR
 ; Create second Session Data
 S BODY(1)=$$SITEOD("ZZUT1","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ZZUT1")),"Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(^VPRJSES("ZZUT1","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJSES("ZZUT1","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get second Session Data
 S ARGS("_id")="ZZUT1"
 D GET^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJSES("ZZUT1")),"Session Data does not exists and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1000",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; leave these around so they can be killed in the next test
 Q
CLR ;; @TEST Clear ALL Session Data
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 D CLR^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^VPRJSES("ZZUT")),"A Session Data exists and it should not")
 D ASSERT("{}",$G(DATA),"DATA returned from a DELETE call (should not happen)")
 D ASSERT(10,$D(^VPRJSES),"Global not cleared")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
REAL ;; @TEST with realistic data
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create Session Data
 S BODY(1)="{""_id"":""ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4"",""session"":{""cookie"":{""originalMaxAge"":900000,""expires"":""2015-01-30T04:38:30.084Z"",""httpOnly"":true,""path"":""/""},""user"":{""accessCode"":""pu1234"",""verifyCode"":""pu1234!!"",""username"":""9E7A;pu1234"",""password"":""pu1234!!"",""firstname"":""PANORAMA"",""lastname"":""USER"",""facility"":""PANORAMA"",""vistaKeys"":[""XUPROG"",""PROVIDER"",""GMRA-SUPERVISOR"",""ORES"",""GMRC101"",""XUPROGMODE"",""GMV MANAGER"",""PSB CPRS MED BUTTON""],""title"":""Clinician"",""section"":""Medicine"",""disabled"":false,""requiresReset"":false,""divisionSelect"":false,""dgRecordAccess"":""false"",""dgSensitiveAccess"":""false"",""dgSecurityOfficer"":""false"",""duz"":{""9E7A"":""10000000226""},""site"":""9E7A"",""ssn"":""666441233"",""corsTabs"":""true"",""rptTabs"":""false"",""permissions"":[""edit-patient-record"",""add-patient-allergy"",""remove-patient-allergy"",""add-patient-vital"",""remove-patient-vital"",""add-patient-med"",""edit-patient-med"",""remove-patient-med"",""add-patient-problem"",""edit-patient-problem"",""remove-patient-problem"",""add-patient-laborder"",""edit-patient-laborder"",""remove-patient-laborder"",""add-patient-radiology"",""edit-patient-radiology"",""remove-patient-radiology"",""patient-visit"",""add-patient-order"",""add-patient-immunization"",""edit-patient-demographics""]}},""expires"":""2015-01-30T04:38:30.084Z""}"
 S RETURN=$$SET^VPRJSES(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4")),"Session Data does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4",$G(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4","_id")),"The _id field was not stored correctly")
 D ASSERT("900000",$G(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4","session","cookie","originalMaxAge")),"returned data for sessin cookie originalMaxAge didn't match")
 D ASSERT("10000000226",$G(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4","session","user","duz","9E7A")),"The user duz 9E7A field was not stored correctly")
 D ASSERT("XUPROG",$G(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4","session","user","vistaKeys",1)),"The user vistaKeys array was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored
 S ARGS("_id")="ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4"
 D GET^VPRJSES(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJSES("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4")),"Session Data does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ebTxc-5Zqn6qup8LGwf4deTrJRGIw1y4",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("900000",$G(OBJECT("session","cookie","originalMaxAge")),"returned data for sessin cookie originalMaxAge didn't match")
 D ASSERT("10000000226",$G(OBJECT("session","user","duz","9E7A")),"The user duz 9E7A field was not stored correctly")
 D ASSERT("XUPROG",$G(OBJECT("session","user","vistaKeys",1)),"The user vistaKeys array was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 D CLR^VPRJSES(.DATA,.ARGS)
 Q
