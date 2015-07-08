VPRJTDR ;SLC/KCM -- Integration tests for ODC RESTful queries
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:6 S TAGS(I)="TEST"_I_"^VPRJTD01"
 D ODSBLD^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D ODSCLR^VPRJTX
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
INDEX ;; @TEST query using an index
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/index/test-name?range=alpha..delta")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(4,JSON("data","totalItems"))
 D ASSERT(201110201857,JSON("data","items",4,"updated")) ; sorted reverse updated date
 Q
LAST ;; @TEST query for last instance of items in list
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/last/test-name?range=alpha..delta")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(3,JSON("data","totalItems"))
 D ASSERT("urn:va:test:6",JSON("data","items",1,"uid"))
 Q
ORDASC ;; @TEST query to return in different order
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/index/test-name?order=name asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("gamma",JSON("data","items",6,"name"))
 Q
ORDDESC ;; @TEST query to return in different order
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/index/test-name?order=name DESC")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("gamma",JSON("data","items",1,"name"))
 Q
ORDEMPTY ;; @TEST query where 'order by' field contains empty string
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/index/test-name?order=type DESC")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("vegatable",JSON("data","items",1,"type"))
 Q
FILTER ;; @TEST filter to return based on criteria
 N ROOT,JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/index/test-name?filter=eq(""color"",""orange"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(2,JSON("data","totalItems"))
 D ASSERT("epsilon",JSON("data","items",1,"name"))
 Q
GETUID ;; @TEST getting an object by UID only
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/urn:va:test:5")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("epsilon",JSON("data","items",1,"name"))
 Q
GETNONE ;; @TEST getting an object that does not exist
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/urn:test:bogus:54321")
 D RESPOND^VPRJRSP
 D ASSERT(1,$G(HTTPERR)>0)
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")))
 K ^TMP("HTTPERR",$J)
 Q
EVERY ;; TEST retrieving every object in a collection
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,JSON("data","totalItems"))
 D ASSERT(0,$D(^TMP($J,$J)))
 D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID_"/every////"))))
 D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID_"/every////"),$J)))
 K JSON
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every?start=3&limit=3")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(3,JSON("data","currentItemCount"))
 D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID_"/every////"))))
 D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID_"/every////"),$J)))
 Q
FINDALL ;; @TEST finding every object in collection
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/find/test")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,JSON("data","totalItems"))
 Q
FINDPAR ;; @TEST finding with parameters
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/data/find/test?filter=eq(""color"",""orange"")&order=name")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(2,JSON("data","totalItems"))
 D ASSERT("urn:va:test:5",JSON("data","items",1,"uid"))
 Q
FINDTLT ;; @TEST finding with template (applyOnSave)
 N JSON,ERR,HTTPERR
 D ASSERT(10,$D(^VPRJDJ("TEMPLATE","urn:va:test:5","unit-test-ods-summary")))
 D SETGET^VPRJTX("/data/find/test/unit-test-ods-summary")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,JSON("data","totalItems"))
 D ASSERT("epsilon",JSON("data","items",5,"name"))
 D ASSERT("urn:va:test:5",JSON("data","items",5,"uid"))
 D ASSERT(0,$D(JSON("data","items",5,"color")))
 Q
ADDOBJ ;; @TEST adding object to store
 N HTTPERR
 D SETPUT^VPRJTX("/data","TEST7","VPRJTD01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/data/urn:va:test:7",HTTPREQ("location"))
 D ASSERT(10,$D(^VPRJD("urn:va:test:7")))
 D ASSERT(7,$G(^VPRJDX("count","collection","test")))
 D ASSERT(1,$D(^VPRJDX("attr","test-name","omega ","798789768244=","urn:va:test:7",1)))
 Q
DELOBJ ;; @TEST remove object from store
 N HTTPERR
 D SETDEL^VPRJTX("/data/urn:va:test:7")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(0,$D(^VPRJD("urn:va:test:7")))
 D ASSERT(6,$G(^VPRJDX("count","collection","test")))
 D ASSERT(0,$D(^VPRJDX("attr","test-name","omega ","798789768244=","urn:va:test:7",0)))
 Q
 ;
NEWOBJ ;; @TEST add a new object, returning a new UID
 N HTTPERR,LASTID
 S LASTID=$G(^VPRJD("COLLECTION","testb"))
 D SETPUT^VPRJTX("/data/testb","NOUID1","VPRJTD01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/data/urn:va:testb:"_$G(^VPRMETA("system"))_":"_(LASTID+1),HTTPREQ("location"))
 D SETPUT^VPRJTX("/data/testb","NOUID2","VPRJTD01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/data/urn:va:testb:"_$G(^VPRMETA("system"))_":"_(LASTID+2),HTTPREQ("location"))
 D SETPUT^VPRJTX("/data/testb","HASUID","VPRJTD01")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/data/urn:va:testb:42",HTTPREQ("location"))
 Q
DELCTN ;; @TEST delete collection
 N HTTPERR
 D SETPUT^VPRJTX("/data","OTHER","VPRJTD01") ; add something from another collection
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(4,$G(^VPRJDX("count","collection","testb")))
 D ASSERT(6,$G(^VPRJDX("count","collection","test")))
 D SETDEL^VPRJTX("/data/collection/test")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(4,$G(^VPRJDX("count","collection","testb")))
 D ASSERT(10,$D(^VPRJD("urn:va:testb:29")))
 D ASSERT(0,+$G(^VPRJDX("count","collection","test")))
 Q
1 ; run just one test
 D STARTUP,SETUP,GETNONE,TEARDOWN,SHUTDOWN
 Q
