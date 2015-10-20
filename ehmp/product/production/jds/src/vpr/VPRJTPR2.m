VPRJTPR2 ;SLC/KCM -- Integration tests for RESTful templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,DATALST
 F I=1:1:5 S DATALST(I)="DATA"_I_"^VPRJTP03"
 D BLDPT^VPRJTX(.DATALST)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
RELSING ;; @TEST loading patient with REL template - single value
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest-c/rel;utest-single")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D SENDATA^VPRJRSP
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("a2",$G(RSP("data","items",1,"from","localId")))
 D ASSERT(10,$D(RSP("data","items",1,"from","dosages")))
 D ASSERT(10,$D(RSP("data","items",1,"from","fills")))
 Q
RELMULT ;; @TEST loading patient with REL template - multiple values
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest-c/rel;utest-multiple")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("a1",$G(RSP("data","items",1,"dest",1,"obj","localId")))
 D ASSERT("b3",$G(RSP("data","items",1,"dest",2,"obj","localId")))
 Q
RELSUMM ;; @TEST loading patient with REL template -- summary
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest-c/rel;utest-multiple;unit-test-summary")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT(20121229103022,$G(RSP("data","items",1,"dest",1,"obj","dateTime")))
 D ASSERT(20101229103022,$G(RSP("data","items",1,"dest",2,"obj","dateTime")))
 D ASSERT(0,$D(RSP("data","items",1,"dest",1,"obj","localId")))
 D ASSERT(0,$D(RSP("data","items",1,"dest",2,"obj","localId")))
 Q
REVUID ;; @TEST loading UID only using the REV template
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest/rev;utest-multiple;uid?order=uid asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("urn:va:utestc:93EF:-7:23",$G(RSP("data","items",1,"testItems",1,"uid")))
 D ASSERT("urn:va:utestc:93EF:-7:42",$G(RSP("data","items",1,"testItems",2,"uid")))
 D ASSERT("urn:va:utestc:93EF:-7:23",$G(RSP("data","items",3,"testItems",1,"uid")))
 D ASSERT(0,$D(RSP("data","items",1,"testItems",1,"localId")))
 D ASSERT(0,$D(RSP("data","items",2,"testItems")))
 Q
REVFULL ;; @TEST loading using the REV template
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest/rev;utest-multiple?order=uid asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("urn:va:utestc:93EF:-7:23",$G(RSP("data","items",1,"testItems",1,"uid")))
 D ASSERT("urn:va:utestc:93EF:-7:42",$G(RSP("data","items",1,"testItems",2,"uid")))
 D ASSERT("urn:va:utestc:93EF:-7:23",$G(RSP("data","items",3,"testItems",1,"uid")))
 D ASSERT("c1",$G(RSP("data","items",1,"testItems",1,"localId")))
 D ASSERT("urn:va:utesta:93EF:-7:2",$G(RSP("data","items",3,"testItems",1,"from")))
 D ASSERT(0,$D(RSP("data","items",2,"testItems")))
 Q
REVSUMM ;; @TEST loading using the REV template -- summary
 N RSP
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/utest/rev;utest-multiple;unit-test-summary?order=uid asc")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.RSP)
 D ASSERT("testRels",$G(RSP("data","items",1,"testItems",1,"name")))
 D ASSERT("testRelsB",$G(RSP("data","items",1,"testItems",2,"name")))
 D ASSERT("testRels",$G(RSP("data","items",3,"testItems",1,"name")))
 D ASSERT(0,$D(RSP("data","items",2,"testItems")))
 Q
RELTEST ;; add the link spec below to test this
 ;;team-category-link
 ;;  collections: team
 ;;  ref: categoriesDeux[]>categories[].uid
 N RSP
 D SETGET^VPRJTX("/data/find/team/rel;team-category-link")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 Q
1 ; do one test
 D STARTUP,RELSUMM,SHUTDOWN
 Q
