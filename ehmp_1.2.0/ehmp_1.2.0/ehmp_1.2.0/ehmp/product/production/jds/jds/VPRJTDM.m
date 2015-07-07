VPRJTDM ;SLC/KCM -- Integration tests for ODC management tools
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:6 S TAGS(I)="TEST"_I_"^VPRJTD01"
 S TAGS(7)="OTHER^VPRJTD01"
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
OBJCTN ;; @TEST count objects in collection
 N COUNT
 S COUNT=$$OBJCTN^VPRJ2D("test")
 D ASSERT(6,COUNT)
 Q
