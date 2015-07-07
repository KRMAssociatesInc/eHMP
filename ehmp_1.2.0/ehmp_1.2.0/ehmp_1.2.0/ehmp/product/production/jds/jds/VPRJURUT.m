VPRJURUT ;SLC/KCM -- Unit tests for HTTP listener utilities
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
URLENC ;; @TEST test encoding string for use in a URL
 N X
 S X=$$URLENC^VPRJRUT("VALUES=20%&60% + or -")
 D ASSERT("VALUES%3D20%25%2660%25+%2B+or+-",X)
 Q
URLDEC ;; @TEST test decoding URL back into string
 N X
 S X=$$URLDEC^VPRJRUT("VALUES%3D20%25%2660%25+%2B+or+-")
 D ASSERT("VALUES=20%&60% + or -",X)
 S X=$$URLDEC^VPRJRUT("piece+of+path",1) ; '+' may be part of path
 D ASSERT("piece+of+path",X)
 Q
