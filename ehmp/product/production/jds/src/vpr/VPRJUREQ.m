VPRJUREQ ;SLC/KCM -- Unit tests for HTTP listener request handling
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
PMATCH ;; @TEST matching path patterns for logging
 D ASSERT(1,$$MATCH^VPRJREQ("/vpr/-7/index/utesta","/vpr/*/index/utesta"))
 D ASSERT(0,$$MATCH^VPRJREQ("/vpr/-7/index/utestb","/vpr/*/index/utesta"))
 D ASSERT(0,$$MATCH^VPRJREQ("/vpr/-7/index/utesta","/vpr/*/index/utesta/summary"))
 D ASSERT(1,$$MATCH^VPRJREQ("/vpr/-7/index/utesta/summary","/vpr/*/index/utesta/..."))
 D ASSERT(1,$$MATCH^VPRJREQ("/vpr/-7/index/utesta","/vpr/*/index/utesta/..."))
 D ASSERT(0,$$MATCH^VPRJREQ("/vpr/-7/index/utesta/...","/vpr/*/index/utesta/summary"))
 D ASSERT(0,$$MATCH^VPRJREQ("/vpr/-7/index/utesta",""))
 D ASSERT(0,$$MATCH^VPRJREQ("/vpr/-7/index/utesta","/vpr"))
 D ASSERT(1,$$MATCH^VPRJREQ("/vpr/-7/index/utesta","/vpr/..."))
 Q
