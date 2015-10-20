VPRJTSYST ;KRM/CJE -- Unit Tests for GET Patient Sync Status
 ;;1.0;JSON DATA STORE;;Dec 16, 2014
 ;
STARTUP  ; Run once before all tests
 K ^VPRSTATUS
 K ^VPRPTJ("JPID")
 D PATIDS
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRSTATUS
 K ^VPRPTJ("JPID")
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
BLANK ; basic sync status
 K ^VPRSTATUS
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920)=""
 Q
 ;
BLANK2 ; basic sync status
 K ^VPRSTATUS
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy",20141031094933)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1001",20141031094931)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1002",20141031094931)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals",20141031094933)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1001",20141031094932)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1002",20141031094932)=""
 Q
 ;
BLANK2DIFF ; basic sync status
 K ^VPRSTATUS
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920)=""
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"allergy",20141031094933)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"allergy","urn:va:allergy:C877:3:1001",20141031094931)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"allergy","urn:va:allergy:C877:3:1002",20141031094931)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"vitals",20141031094933)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"vitals","urn:va:vitals:C877:3:1001",20141031094932)=""
 S ^VPRSTATUS("C877;3","C877",20141031094930,"vitals","urn:va:vitals:C877:3:1002",20141031094932)=""
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","9E7A;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","C877;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1234V4321")=""
 S ^VPRPTJ("JPID","9E7A;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","C877;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
GETINITIAL ;; @TEST Get Initial Patient Sync Status
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; Ensure that the JSON matches what we expect
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; ensure all elements of inProgress exist
 D ASSERT("1234V4321",$G(OBJECT("inProgress","icn")))
 D ASSERT("9E7A;3",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","pid")),"pid is incorrect")
 D ASSERT(3,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","localId")),"localId is incorrect")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","stampTime")),"source stampTime doesn't exist")
 ; ensure allergy domain and event stamps exist correctly
 D ASSERT("allergy",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","domain")),"allergy domain doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stampTime")),"Allergy 9E7A:3:1001 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 shouldn't be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stampTime")),"Allergy 9E7A:3:1002 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 shouldn't be stored")
 ; ensure vitals domain and event stamps exist correctly
 D ASSERT("vitals",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","domain")),"vitals domain doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stampTime")),"Vital 9E7A:3:1001 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 shouldn't be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stampTime")),"Vital 9E7A:3:1002 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 shouldn't be stored")
 K @DATA
 Q
GETLASTVITAL ;; @TEST Get Patient Sync Status - Last Vital Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 ; Last Vital should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 K @DATA
 Q
GETLASTALLERGY ;; @TEST Get Patient Sync Status - Last Allergy Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
  ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should not be stored")
 ; Last Allergy should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored")
 K @DATA
 Q
GETLASTALLERGYVITAL;; @TEST Get Patient Sync Status - Last Vital & Allergy Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 ; Last Allergy & Vital should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 K @DATA
 Q
GETALLERGY ;; @TEST Get Patient Sync Status - Both Allergies Stored. Test complete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should not be stored")
 K @DATA
 Q
GETVITAL ;; @TEST Get Patient Sync Status - Both Vitals Stored. Test complete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 K @DATA
 Q
GETBOTH ;; @TEST Get Patient Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be completed
 D ASSERT(0,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(10,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 K @DATA
 Q
GET2SAMESOURCE ;; @TEST Get Patient Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set for 2 metaStamps for the same source
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK2
 ; Setup to make sure the old object doesn't appear
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should not be stored")
 ; Setup to make sure the new object completes
 K ARG,@DATA,OBJECT,ERR
 ; Set complete flags - allergy uses incorrect times
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1001",20141031094932,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1002",20141031094932,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1001",20141031094932,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1002",20141031094932,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 ; Setup to make sure the new object completes
 K ARG,@DATA,OBJECT,ERR
 ; Set complete flags - allergy uses correct times
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1001",20141031094932,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"vitals","urn:va:vitals:9E7A:3:1002",20141031094932,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1001",20141031094931,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094930,"allergy","urn:va:allergy:9E7A:3:1002",20141031094931,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 D ASSERT(0,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(10,$D(OBJECT("completedStamp")),"Sync status is completed")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored")
 K @DATA
 Q
GET2DIFFSOURCE ;; @TEST Get Patient Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set for 2 metaStamps for different sources
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK2DIFF
 ; Setup to make sure both objects are inProgress
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is completed")
 ; 9E7A
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","9E7A")),"Source 9E7A should exist")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should not be stored")
 ; C877
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","C877")),"Source C877 should exist")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1001","stored")),"Allergy C877:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1002","stored")),"Allergy C877:3:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1001","stored")),"Vital C877:3:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1002","stored")),"Vital C877:3:1002 should not be stored")
 ; Setup to make sure one source is complete
 K ARG,@DATA,OBJECT,ERR
 ; Set complete flags
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1001",20141031094920,"stored")=1
 S ^VPRSTATUS("9E7A;3","9E7A",20141031094920,"allergy","urn:va:allergy:9E7A:3:1002",20141031094920,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; 9E7A
 ; this Sync Status should now be completed
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","9E7A")),"Source 9E7A should exist and be complete (9E7A)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (9E7A)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should be stored (9E7A)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored (9E7A)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete (9E7A)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored (9E7A)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored (9E7A)")
 ; C877
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","C877")),"Source C877 should exist and not be complete (9E7A)")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete (9E7A)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1001","stored")),"Allergy C877:3:1001 should not be stored (9E7A)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1002","stored")),"Allergy C877:3:1002 should not be stored (9E7A)")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete (9E7A)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1001","stored")),"Vital C877:3:1001 should not be stored (9E7A)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1002","stored")),"Vital C877:3:1002 should not be stored (9E7A)")
 ; Setup to make sure both sources are complete
 K ARG,@DATA,OBJECT,ERR
 ; Set complete flags C877
 S ^VPRSTATUS("C877;3","C877",20141031094930,"vitals","urn:va:vitals:C877:3:1001",20141031094932,"stored")=1
 S ^VPRSTATUS("C877;3","C877",20141031094930,"vitals","urn:va:vitals:C877:3:1002",20141031094932,"stored")=1
 S ^VPRSTATUS("C877;3","C877",20141031094930,"allergy","urn:va:allergy:C877:3:1001",20141031094931,"stored")=1
 S ^VPRSTATUS("C877;3","C877",20141031094930,"allergy","urn:va:allergy:C877:3:1002",20141031094931,"stored")=1
 S ARG("id")="9E7A;3"
 S ARG("detailed")="true"
 D GET^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; 9E7A
 ; this Sync Status should now be completed
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","9E7A")),"Source 9E7A should exist and be complete (All)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1001","stored")),"Allergy 9E7A:3:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:9E7A:3:1002","stored")),"Allergy 9E7A:3:1002 should be stored (All)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1001","stored")),"Vital 9E7A:3:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","9E7A","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:9E7A:3:1002","stored")),"Vital 9E7A:3:1002 should be stored (All)")
 ; C877
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","C877")),"Source C877 should exist and be complete (All)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1001","stored")),"Allergy C877:3:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","allergy","eventMetaStamp","urn:va:allergy:C877:3:1002","stored")),"Allergy C877:3:1002 should be stored (All)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1001","stored")),"Vital C877:3:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","C877","domainMetaStamp","vitals","eventMetaStamp","urn:va:vitals:C877:3:1002","stored")),"Vital C877:3:1002 should be stored (All)")
 K @DATA
 Q
