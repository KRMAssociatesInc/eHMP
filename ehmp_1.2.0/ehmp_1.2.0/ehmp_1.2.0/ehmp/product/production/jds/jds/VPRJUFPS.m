VPRJUFPS ;SLC/KCM -- Unit tests for index functions
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
 ;
CWAD ;; @TEST CWAD index
 N DOC
 S DOC("documentTypeCode")="D",DOC("status")="COMPLETED"
 D ASSERT(1,$$CWAD^VPRJFPS(.DOC))
 S DOC("documentTypeCode")="D",DOC("status")="RETRACTED"
 D ASSERT(0,$$CWAD^VPRJFPS(.DOC))
 S DOC("documentTypeCode")="",DOC("status")="COMPLETED"
 D ASSERT(0,$$CWAD^VPRJFPS(.DOC))
 Q
