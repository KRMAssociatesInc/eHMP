VPRJTCT ;SLC/KCM -- Integration tests for templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 D BLDPT^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
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
ONSAVE ;; @TEST template creation on save
 N TAGS
 S TAGS(1)="DATA1^VPRJTP03"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID)
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-general")))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-exclude")))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-instance")))
 N JSON,OBJ
 M JSON=^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-general")
 D DECODE^VPRJSON("JSON","OBJ")
 D ASSERT("Welby,Marcus/John,Trapper",$G(OBJ("clinicians")))
 D ASSERT(20121229103022,$G(OBJ("dateTime")))
 D ASSERT(1,$D(OBJ("dateTime","\s")))
 D ASSERT("Dragon Hair",$G(OBJ("ingredients",2,"name")))
 D ASSERT(60,$G(OBJ("lastFill","quantity")))
 K JSON,OBJ
 M JSON=^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-exclude")
 D DECODE^VPRJSON("JSON","OBJ")
 D ASSERT(10,$D(OBJ("dosages")))
 D ASSERT(10,$D(OBJ("authors")))
 D ASSERT(0,$D(OBJ("fills")))
 D ASSERT(0,$D(OBJ("content")))
 D ASSERT(0,$D(OBJ("products",1,"drugClass")))
 D ASSERT(1,$D(OBJ("products",1,"ingredient")))
 K JSON,OBJ
 M JSON=^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utesta:93EF:-7:1","unit-test-instance")
 D DECODE^VPRJSON("JSON","OBJ")
 ;W ! ZW OBJ
 ;B   check to see that the appropriate JSON objects exist
 Q
EXP1 ;; @TEST expanding fields in template
 N I,TAGS
 F I=2:1:5 S TAGS(I)="DATA"_I_"^VPRJTP03"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID)
 N JSON,OBJ
 M JSON=^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utestc:93EF:-7:23","unit-test-expand-1")
 D DECODE^VPRJSON("JSON","OBJ")
 D ASSERT(10,$D(OBJ("from")))
 D ASSERT(20111229103022,$G(OBJ("from","dateTime")))
 D ASSERT(1,$D(OBJ("from","dateTime","\s")))
 D ASSERT("urn:va:utesta:93EF:-7:2",$G(OBJ("from","uid")))
 Q
EXP2 ;; @TEST expanding fields in template
 N JSON,OBJ
 M JSON=^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utestc:93EF:-7:23","unit-test-expand-2")
 D DECODE^VPRJSON("JSON","OBJ")
 D ASSERT("urn:va:utesta:93EF:-7:1",$G(OBJ("items",1,"uid")))
 D ASSERT("urn:va:utestb:93EF:-7:3",$G(OBJ("items",2,"uid")))
 D ASSERT("a1",$G(OBJ("items",1,"localId")))
 D ASSERT("b3",$G(OBJ("items",2,"localId")))
 D ASSERT(0,$D(OBJ("items",3)))
 D ASSERT("urn:va:utestc:93EF:-7:23",$G(OBJ("uid")))
 Q
QUERY ;; @TEST query type template
 K ^TMP
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE",VPRJTPID,"urn:va:utestc:93EF:-7:23","unit-test-query")))
 N ROOT,OBJS,HTTPERR
 ; /vpr/{pid}/index/{indexName}/{template}
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest-c/unit-test-query")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.OBJS)
 D ASSERT("testRels",$G(OBJS("data","items",1,"name")))
 D ASSERT("testRelsB",$G(OBJS("data","items",2,"name")))
 D ASSERT(0,$D(OBJS("data","items",3,"name")))
 Q
