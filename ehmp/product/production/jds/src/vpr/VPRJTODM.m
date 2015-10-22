VPRJTODM ;KRM/CJE -- Unit Tests for GET/PUT/DELETE Operational Data Mutable
 ;;1.0;JSON DATA STORE;;Jan 27, 2015
 ;
 ; Endpoints tested
 ;POST/PUT odmutable/set/this SET^VPRJODM
 ;GET odmutable/get/{_id} GET^VPRJODM
 ;GET odmutable/length/this LEN^VPRJODM
 ;DELETE odmutable/destroy/{_id} DEL^VPRJODM
 ;GET odmutable/destroy/{_id} DEL^VPRJODM
 ;DELETE odmutable/clear/this CLR^VPRJODM
 ;GET odmutable/clear/this CLR^VPRJODM
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
SITEOD(SITE,KEY,VALUE) ; Setup operational data mutable JSON for set
 Q "{""_id"": """_SITE_""","""_KEY_""": """_VALUE_"""}"
SETJSONERR ;; @TEST Error code is set if JSON is mangled in PUT/POST
 N RETURN,BODY,ARG,HTTPERR
 ; Create bad JSON
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S BODY(1)=BODY(1)_":"
 ; Send it to the URL
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 202 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
SETIDRR ;; @TEST Error code is set if no ID
 N RETURN,BODY,ARG,HTTPERR
 ; Try with a null _id field
 S BODY(1)=$$SITEOD("","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(220,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 220 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Try with a non existant _id field
 S BODY(1)="{""ZZUT"": ""20150127-1000""}"
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(220,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 220 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
SET1 ;; @TEST Store one operational data mutable
 N RETURN,BODY,ARG,HTTPERR
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJODM
 K ^VPRJODM("ZZUT")
 I $G(^VPRJODM(0))>0 S ^VPRJODM(0)=^VPRJODM(0)-1
 Q
SET2 ;; @TEST Store two operational data mutable
 N RETURN,BODY,ARG,HTTPERR
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,BODY,ARG
 ; Run it again with a new lastUpdate time
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1500")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1500",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,BODY,ARG
 ; Run it again with a new lastUpdate time that is smaller
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-25")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-25",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJODM
 K ^VPRJODM("ZZUT")
 I $G(^VPRJODM(0))>0 S ^VPRJODM(0)=^VPRJODM(0)-3
 Q
DELIDERR ;; @TEST Error code is set if no Id
 N DATA,OBJECT,ERR,ARGS,HTTPERR
 ; Try with a non existant _id
 D DEL^VPRJODM(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup vars
 K DATA,OBJECT,ERR,ARGS
 ; Try with a blank _id
 S ARGS("_id")=""
 D DEL^VPRJODM(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
DEL ;; @TEST Delete operational data mutable
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now delete it
 S ARGS("_id")="ZZUT"
 D DEL^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT("{}",$G(DATA),"DATA returned from a DELETE call (should not happen)")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
LEN ;; @TEST Get number of operational data mutable
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now get length
 D LEN^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error Occured")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(1,$G(OBJECT("length")),"The total number of objects doesn't match1")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K OBJECT,DATA,ERR,ARGS
 ; Create operational data mutable
 S BODY(1)=$$SITEOD("ZZUT1","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"A operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K BODY,RETURN,ARG
 ; Now get length
 D LEN^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error Occured")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(2,$G(OBJECT("length")),"The total number of objects doesn't match2")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup ^VPRJODM
 K ^VPRJODM("ZZUT")
 K ^VPRJODM("ZZUT1")
 I $G(^VPRJODM(0))>0 S ^VPRJODM(0)=^VPRJODM(0)-2
 Q
GETIDERR ;; @TEST Error code is set if no Id
 N DATA,ARGS,OBJECT,HTTPERR
 ; Try with a non existant _id attribute
 D GET^VPRJODM(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,OBJECT,ARGS
 ; Try with a null id
 S ARGS("_id")=""
 D GET^VPRJODM(.DATA,.ARGS)
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(111,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 111 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
GETJSONERR ;; Error code is set if encoding to JSON fails
 N DATA,ARGS,OBJECT,HTTPERR
 S ARGS("_id")="ZZUT"
 D GET^VPRJODM(.DATA,.ARGS)
 D ASSERT(0,$D(DATA),"No DATA should be returned")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 202 reason code should have occurred")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
GET ;; @TEST Get operational data mutable
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored
 S ARGS("_id")="ZZUT"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1000",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,ARGS,OBJECT,ERR
 ; Create operational data mutable update
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1500")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1500",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored update
 S ARGS("_id")="ZZUT"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1500",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,ARGS,OBJECT,ERR
 ; Create second operational data mutable
 S BODY(1)=$$SITEOD("ZZUT1","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT1")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(^VPRJODM("ZZUT1","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT1","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get second operational data mutable
 S ARGS("_id")="ZZUT1"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJODM("ZZUT1")),"operational data mutable does not exists and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1000",$G(OBJECT("lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; leave these around so they can be killed in the next test
 Q
GETFILTER ;; @TEST Get operational data mutable with filter
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)=$$SITEOD("ZZUT","lastUpdate","20150127-1000")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1000",$G(^VPRJODM("ZZUT","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Create operational data mutable update
 S BODY(1)=$$SITEOD("ZZUT1","lastUpdate","20150127-1500")
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT1")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(^VPRJODM("ZZUT1","_id")),"The _id field was not stored correctly")
 D ASSERT("20150127-1500",$G(^VPRJODM("ZZUT1","lastUpdate")),"The lastUpdate field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored update
 S ARGS("filter")="ne(_id,abc)"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("items",1,"_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1000",$G(OBJECT("items",1,"lastUpdate")),"returned data for lastUpdate didn't match")
 D ASSERT("ZZUT1",$G(OBJECT("items",2,"_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1500",$G(OBJECT("items",2,"lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K DATA,ARGS,OBJECT,ERR
 ; Get second operational data mutable
 S ARGS("filter")="ne(_id,ZZUT)"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT1",$G(OBJECT("items",1,"_id")),"returned data for the wrong _id")
 D ASSERT("20150127-1500",$G(OBJECT("items",1,"lastUpdate")),"returned data for lastUpdate didn't match")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; leave these around so they can be killed in the next test
 Q
CLR ;; @TEST Clear ALL operational data mutable
 N RETURN,BODY,ARG,DATA,ARGS,OBJECT,ERR,HTTPERR
 D CLR^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(0,$D(^VPRJODM("ZZUT")),"A operational data mutable exists and it should not")
 D ASSERT("{}",$G(DATA),"DATA returned from a DELETE call (should not happen)")
 D ASSERT(10,$D(^VPRJODM),"Global not cleared")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 Q
REAL ;; @TEST with realistic data
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)="{""_id"": ""ZZUT"",""timestamp"": ""3150126-724"",""uid"": ""urn:va:vprupdate:ZZUT""}"
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("3150126-724",$G(^VPRJODM("ZZUT","timestamp")),"The timestamp field was not stored correctly")
 D ASSERT("urn:va:vprupdate:ZZUT",$G(^VPRJODM("ZZUT","uid")),"The uid field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored
 S ARGS("_id")="ZZUT"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("3150126-724",$G(OBJECT("timestamp")),"returned data for timestamp didn't match")
 D ASSERT("urn:va:vprupdate:ZZUT",$G(OBJECT("uid")),"The uid field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup VPRJODM
 D CLR^VPRJODM(.DATA,.ARGS)
 Q
SETGET ;; @TEST set and get of session data
 N RETURN,ARG,BODY,DATA,ARGS,OBJECT,ERR,HTTPERR
 ; Create operational data mutable
 S BODY(1)="{""_id"": ""ZZUT"",""timestamp"": ""3150126-724"",""uid"": ""urn:va:vprupdate:ZZUT""}"
 S RETURN=$$SET^VPRJODM(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(^VPRJODM("ZZUT","_id")),"The _id field was not stored correctly")
 D ASSERT("3150126-724",$G(^VPRJODM("ZZUT","timestamp")),"The timestamp field was not stored correctly")
 D ASSERT("urn:va:vprupdate:ZZUT",$G(^VPRJODM("ZZUT","uid")),"The uid field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup Vars
 K RETURN,ARG,BODY
 ; Get the data we stored
 S ARGS("_id")="ZZUT"
 D GET^VPRJODM(.DATA,.ARGS)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 D ASSERT(10,$D(^VPRJODM("ZZUT")),"operational data mutable does not exist and it should")
 D ASSERT(0,$D(ERR),"A JSON Decode Error Occured")
 D ASSERT(0,$D(^TMP("HTTPERR",$J,1,"error")),"An HTTP error should NOT have occured")
 D ASSERT("ZZUT",$G(OBJECT("_id")),"returned data for the wrong _id")
 D ASSERT("3150126-724",$G(OBJECT("timestamp")),"returned data for timestamp didn't match")
 D ASSERT("urn:va:vprupdate:ZZUT",$G(OBJECT("uid")),"The uid field was not stored correctly")
 ; Cleanup HTTPERR
 K ^TMP("HTTPERR",$J)
 ; Cleanup VPRJODM
 K DATA,ARGS
 D CLR^VPRJODM(.DATA,.ARGS)
 Q
