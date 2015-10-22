VPRJTPR ;SLC/KCM -- Integration tests for RESTful queries
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 K ^VPRPTJ
 K ^VPRPT
 K ^TMP
 Q
SETUP    ; Run before each test
 K HTTPREQ,HTTPERR,HTTPRSP
 Q
TEARDOWN ; Run after each test
 K HTTPREQ,HTTPERR,HTTPRSP
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
 ;
TIMERNG ;; @TEST query for range of time
 ;;{"apiVersion":"1.0","data":{"updated":20120517174918,"totalItems":3,"items":[{
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/med-time/?range=20060101..20061231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(3,$G(JSON("data","totalItems")))
 D ASSERT("METFORMIN",$G(JSON("data","items",3,"products",1,"ingredientName")))
 Q
LAST ;; @TEST query for last instance of items in list
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/last/med-ingredient-name?range=Metformin, Aspirin Tab")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(2,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:18069",$G(JSON("data","items",1,"uid")))
 D ASSERT("urn:va:med:93EF:-7:18068",$G(JSON("data","items",2,"uid")))
 Q
ORDASC ;; @TEST query to return in different order
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?order=qualifiedName asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("WARFARIN",$G(JSON("data","items",5,"qualifiedName")))
 Q
ORDDESC ;; @TEST query to return in different order
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?order=qualifiedName DESC")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("WARFARIN",$G(JSON("data","items",1,"qualifiedName")))
 Q
ORDEMPTY ;; @TEST "order by" where field includes empty string
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?order=stopped")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("",$G(JSON("data","items",1,"stopped")))
 D ASSERT("20080128",$G(JSON("data","items",5,"stopped")))
 Q
FILTER ;; @TEST filter to return based on criteria
 ;;{"apiVersion":"1.0","data":{"updated":20120517174918,"totalItems":3,"items":[{
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication/?filter=gt(""orders[].fillsRemaining"",4)")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:17203",$G(JSON("data","items",1,"uid")))
 ;D SHOWRSP^VPRJTX(ROOT)
 Q
GETUID ;; @TEST getting an object by UID only
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/uid/"_"urn:va:med:93EF:-7:18068")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("ASPIRIN",$G(JSON("data","items",1,"qualifiedName")))
 Q
EVERY ;; @TEST retrieving every object for a patient
 N JSON,ERR,HTTPERR,VPRJTPID1
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,$G(JSON("data","totalItems")))
 D ASSERT(0,$D(^TMP($J,$J)))
 S VPRJTPID1=$$JPID4PID^VPRJPR(VPRJTPID)
 ; Cache is disable
 ;D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"))))
 ;D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"),$J)))
 K JSON
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every?start=3&limit=3")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(3,$G(JSON("data","currentItemCount")))
 ; Cache is disabled
 ;D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"))))
 ;D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"),$J)))
 Q
FINDALL ;; @TEST finding every object in collection
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/find/med")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(5,$G(JSON("data","totalItems")))
 Q
FINDPAR ;; @TEST finding with parameters
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/find/med?filter=eq(""products[].ingredientName"",""METFORMIN"") eq(""dosages[].dose"",""250 MG"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:16982",$G(JSON("data","items",1,"uid")))
 Q
FINDLIKE ;; @TEST finding using like()
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/find/med?filter=like(""products[].ingredientName"",""ASPIRIN%25"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:18068",$G(JSON("data","items",1,"uid")))
 Q
ADDOBJ ;; @TEST adding object to store
 N HTTPERR,VPRJPID
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/"_VPRJPID_"/urn:va:med:93EF:-7:15231",HTTPREQ("location"))
 D ASSERT(10,$D(^VPRPT(VPRJTPID,"urn:va:med:93EF:-7:15231")))
 D ASSERT(1,$D(^VPRPTI(VPRJTPID,"attr","medication","79949668=","urn:va:med:93EF:-7:15231",1)))
 Q
DELOBJ ;; @TEST remove object from store
 N HTTPERR
 D SETDEL^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRPT(VPRJTPID,"urn:va:med:93EF:-7:15231")))
 D ASSERT(0,$D(^VPRPTI(VPRJTPID,"list","medication",20050331,"urn:va:med:93EF:-7:15231")))
 Q
ADDPT ;; @TEST add new patient
 N MYPID,JSON,HTTPERR
 D SETPUT^VPRJTX("/vpr","DEMOG8","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S MYPID="93EF;-8"
 D ASSERT(1,$D(^VPRPTJ("JPID",MYPID)))
 D ASSERT("/vpr/"_MYPID_"/urn:va:patient:93EF:-8:-8",$G(HTTPREQ("location")))
 ; do it again, make sure we get the same PID
 D SETPUT^VPRJTX("/vpr","DEMOG8","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/"_MYPID_"/urn:va:patient:93EF:-8:-8",$G(HTTPREQ("location")))
 ; now get the patient demographics
 D SETGET^VPRJTX("/vpr/"_MYPID)
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(-88888888,$G(JSON("data","items",1,"ssn")))
 D SETDEL^VPRJTX("/vpr/"_MYPID)
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRPT(MYPID)))
 D ASSERT(0,$D(^VPRPTJ("JSON",MYPID)))
 D ASSERT(0,$D(^VPRPTI(MYPID)))
 Q
NOICN ;; @TEST add patient without ICN
 N HTTPERR,JSON
 D SETPUT^VPRJTX("/vpr","DEMOG9","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/93EF;-9/urn:va:patient:93EF:-9:-9",HTTPREQ("location"))
 ; do it again for same pid
 D SETPUT^VPRJTX("/vpr","DEMOG9","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/93EF;-9/urn:va:patient:93EF:-9:-9",HTTPREQ("location"))
 D ASSERT(1,$D(^VPRPT("93EF;-9"))>0)
 ; one more time for date of death
 D SETPUT^VPRJTX("/vpr","DIED9","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/93EF;-9/urn:va:patient:93EF:-9:-9",HTTPREQ("location"))
 D ASSERT(1,$D(^VPRPT("93EF;-9"))>0)
 D SETGET^VPRJTX("/vpr/93EF;-9")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("666223456",$G(JSON("data","items",1,"ssn")))
 D ASSERT("20120524",$G(JSON("data","items",1,"dateOfDeath")))
 D ASSERT("93EF;-9",$G(JSON("data","items",1,"pid")))
 D SETDEL^VPRJTX("/vpr/93EF;-9")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRPT("93EF;-9")))
 D ASSERT(0,$D(^VPRPTJ("JSON","93EF;-9")))
 D ASSERT(0,$D(^VPRPTI("93EF;-9")))
 Q
ADDICN ;; @TEST add an ICN where the patient did not previously have one
 N HTTPERR,JSON
 D SETPUT^VPRJTX("/vpr","DEMOG9","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/93EF;-9/urn:va:patient:93EF:-9:-9",HTTPREQ("location"))
 D SETPUT^VPRJTX("/vpr","NEWICN9","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/93EF;-9/urn:va:patient:93EF:-9:-9",HTTPREQ("location"))
 D ASSERT(1,$D(^VPRPT("93EF;-9"))>0)
 D SETGET^VPRJTX("/vpr/93EF;-9")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("666223456",$G(JSON("data","items",1,"ssn")))
 D ASSERT("-999V123999",$G(JSON("data","items",1,"icn")))
 D ASSERT("93EF;-9",$G(JSON("data","items",1,"pid")))
 Q
NSITE ;; @TEST multiple sites for patient demographics
 N HTTPREQ,HTTPERR,JSON,MYPID
 D SETPUT^VPRJTX("/vpr/","D7BAD","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(1,$G(HTTPERR)>0)  ; should have bad ICN error
 D ASSERT("",$G(HTTPREQ("location"))) ; location should be blank (not created)
 D ASSERT(0,$D(^VPRPTJ("JPID","93CC;-7"))>1)
 D ASSERT(0,$D(^VPRPTJ("JPID","-787V123787"))>1)
 K HTTPREQ,HTTPERR
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"D7GOOD","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 S MYPID=$P($G(HTTPREQ("location")),"/",3)
 D ASSERT(1,$D(^VPRPTJ("JPID","-777V123777"))) ; Ensure forward node exists ICN
 D ASSERT(MYPID,$G(^VPRPTJ("JPID","-777V123777"))) ; Ensure correct data for forward index ICN
 D ASSERT(1,$D(^VPRPTJ("JPID","93EF;-7"))) ; Ensure forward node exists PID
 D ASSERT(MYPID,$G(^VPRPTJ("JPID","93EF;-7"))) ; Ensure correct data for forward index PID
 Q
FULLICN ;; @TEST get patient info using full ICN
 N HTTPREQ,HTTPERR,JSON
 D SETGET^VPRJTX("/vpr/-777V123777")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(2,$G(JSON("data","currentItemCount")))
 D ASSERT("urn:va:patient:93EF:-7:-7",$G(JSON("data","items",2,"uid")))
 D ASSERT(1,$D(^VPRPTJ("JPID","93EF;-7")))
 D ASSERT(1,$D(^VPRPTJ("JPID","-777V123777")))
 D ASSERT("urn:va:patient:93DD:-7:-7",$G(JSON("data","items",1,"uid")))
 D ASSERT(1,$D(^VPRPTJ("JPID","93DD;-7")))
 D ASSERT(1,$D(^VPRPTJ("JPID","-777V123777")))
 Q
NUMFAC ;; @TEST fully numeric facility id
 N MYPID,JSON,HTTPERR
 D SETPUT^VPRJTX("/vpr","NUMFAC","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S MYPID="4321;-1"
 D ASSERT("/vpr/"_MYPID_"/urn:va:patient:4321:-1:-1",HTTPREQ("location"))
 ; do it again, make sure we get the same PID
 D SETPUT^VPRJTX("/vpr","NUMFAC","VPRJTP01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/"_MYPID_"/urn:va:patient:4321:-1:-1",HTTPREQ("location"))
 ; now get the patient demographics
 D SETGET^VPRJTX("/vpr/"_MYPID)
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(-111111111,$G(JSON("data","items",1,"ssn")))
 D ASSERT("4321;-1",$G(JSON("data","items",1,"pid")))
 D SETDEL^VPRJTX("/vpr/"_MYPID)
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRPT(MYPID)))
 D ASSERT(0,$D(^VPRPTJ("JSON",MYPID)))
 D ASSERT(0,$D(^VPRPTI(MYPID)))
 Q
DELCLTN ;; @TEST delete collection via REST
 N HTTPERR,X
 S X=$O(^VPRPT(VPRJTPID,"urn:va:med:")) D ASSERT(1,+(X["med"))
 D SETDEL^VPRJTX("/vpr/"_VPRJTPID_"/collection/med")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S X=$O(^VPRPT(VPRJTPID,"urn:va:med:")) D ASSERT(0,+(X["med"))
 Q
DELSITE ;; @TEST REST endpoint to delete a site's patient data
 N HTTPERR,PID1,PID2
 S PID1="93EF;-7"
 S PID2="93DD;-7"
 D SETPUT^VPRJTX("/vpr","DEMOG7","VPRJTP01")
 D SETPUT^VPRJTX("/vpr","NUMFAC","VPRJTP01")
 D ASSERT(10,$D(^VPRPT(PID1)))
 D ASSERT(10,$D(^VPRPTJ("JSON",PID1)))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",PID1)))
 D ASSERT(1,^VPRPTI(PID1,"tally","collection","patient"))
 D ASSERT(10,$D(^VPRPT(PID2)))
 D ASSERT(10,$D(^VPRPTJ("JSON",PID2)))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",PID2)))
 D ASSERT(1,^VPRPTI(PID2,"tally","collection","patient"))
 D SETDEL^VPRJTX("/vpr/site/93EF")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRPT(PID1)))
 D ASSERT(0,$D(^VPRPTJ("JSON",PID1)))
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE",PID1)))
 D ASSERT(0,^VPRPTI(PID1,"tally","collection","patient"))
 D ASSERT(10,$D(^VPRPT(PID2)))
 D ASSERT(10,$D(^VPRPTJ("JSON",PID2)))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",PID2)))
 D ASSERT(10,$D(^VPRPTI(PID2)))
 D SETDEL^VPRJTX("/vpr/site/93DD")
 Q
