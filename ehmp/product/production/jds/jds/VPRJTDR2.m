VPRJTDR2 ;SLC/KCM -- Integration tests for ODC RESTful templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:6 S TAGS(I)="TEST"_I_"^VPRJTD01"
 S TAGS(7)="LINK1^VPRJTD01"
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
RELMULT ;; @TEST loading objects with REL template - multiple values
 N RSP
 D SETGET^VPRJTX("/data/index/utest-name/rel;utest-ods")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("beta",RSP("data","items",3,"from",1,"name"))
 D ASSERT("gamma",RSP("data","items",3,"from",2,"name"))
 Q
REVUID ;; @TEST loading using the REV template
 N RSP
 D SETGET^VPRJTX("/data/index/test-name/rev;utest-ods?order=uid asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT(0,$D(RSP("data","items",1,"testFroms")))
 D ASSERT("urn:va:test:2",RSP("data","items",2,"uid"))
 D ASSERT("urn:va:utestods:1",RSP("data","items",2,"testFroms",1,"uid"))
 D ASSERT("urn:va:test:3",RSP("data","items",3,"uid"))
 D ASSERT("urn:va:utestods:1",RSP("data","items",3,"testFroms",1,"uid"))
 Q
EXPTLT ;; @TEST loading object with expanded uid
 N RSP
 D ASSERT(0,$D(^VPRJDJ("TEMPLATE","urn:va:utestods:1","unit-test-ods-expand")))
 D SETGET^VPRJTX("/data/find/utestods/unit-test-ods-expand")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("beta",RSP("data","items",1,"fullItems",1,"name"))
 D ASSERT("gamma",RSP("data","items",1,"fullItems",2,"name"))
 Q
BADIDX ;; @TEST bad index name
 N RSP
 D SETGET^VPRJTX("/data/index/bad-index")
 D RESPOND^VPRJRSP
 D ASSERT(1,$G(HTTPERR)>0)
 K ^TMP("HTTPERR",$J)
 Q
