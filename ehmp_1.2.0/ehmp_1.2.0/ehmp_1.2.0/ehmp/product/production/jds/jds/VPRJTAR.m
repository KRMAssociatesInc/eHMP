VPRJTAR ;SLC/KCM -- Special tests for RESTful queries across patients
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 K ^TMP($J),^TMP("HTTPERR",$J)
 Q
SHUTDOWN ; Run once after all tests
 K ^TMP($J),^TMP("HTTPERR",$J)
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
 ; these should not be run like the other tests
 ; they cannot produce the same results each time since they work across patients
 ;
ALLFIND ;; test find across patients
 D SETGET^VPRJTX("/vpr/all/find/med/uid?filter=like(""products[].ingredientName"",""ASPIRIN%25"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(1,($G(^TMP($J,"total"))>0))
 Q
ALLINDEX ;; test index across patients
 D SETGET^VPRJTX("/vpr/all/index/pt-name")
 D RESPOND^VPRJRSP
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(1,($G(^TMP($J,"total"))>0))
 D ASSERT(1,$D(HTTPRSP("pageable")))
 Q
ALLPID ;; test getting all patient PID's
 D SETGET^VPRJTX("/vpr/all/index/pid/pid")
 D RESPOND^VPRJRSP
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(0,$D(HTTPRSP("pageable")))
 D ASSERT(1,$P(^TMP($J,1),"""totalItems"":",2)>0)
 Q
ALLIDX2 ;; test index across patients
 D SETGET^VPRJTX("/vpr/all/index/xlab-lnc?range=urn:lnc:13955-0")
 D RESPOND^VPRJRSP
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(1,($G(^TMP($J,"total"))>0))
 D ASSERT(1,$D(HTTPRSP("pageable")))
 Q
ALL ;; run all tests
 D STARTUP
 D SETUP,ALLFIND,TEARDOWN
 D SETUP,ALLINDEX,TEARDOWN
 D SETUP,ALLPID,TEARDOWN
 D SHUTDOWN
 Q
1 ; run just one test
 D STARTUP,SETUP,ALLIDX2,TEARDOWN,SHUTDOWN
 Q
