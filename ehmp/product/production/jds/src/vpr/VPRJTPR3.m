VPRJTPR3 ;SLC/KCM -- Integration tests for multi-patient RESTful queries
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N TAGS,I
 S VPRPID7=$$ADDPT^VPRJTX("DEMOG7^VPRJTP01")
 F I=1:1:3 S TAGS(I)="UTST"_I_"^VPRJTP01"
 D ADDDATA^VPRJTX(.TAGS,VPRPID7)
 K TAGS
 S VPRPID8=$$ADDPT^VPRJTX("DEMOG8^VPRJTP01")
 F I=4:1:5 S TAGS(I)="UTST"_I_"^VPRJTP01"
 D ADDDATA^VPRJTX(.TAGS,VPRPID8)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 K VPRPID7,VPRPID8
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
INDEX ;; @TEST index query for multiple patients
 N OBJ,HTTPERR
 ; Multiple patient syntax: PID,PID
 D SETGET^VPRJTX("/vpr/"_VPRPID7_","_VPRPID8_"/index/utest-c")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.OBJ)
 D ASSERT(5,$G(OBJ("data","totalItems")))
 D ASSERT(VPRPID7,$G(OBJ("data","items",1,"pid")))
 D ASSERT(VPRPID8,$G(OBJ("data","items",4,"pid")))
 Q
LAST ;; @TEST last query for multiple patients
 N OBJ,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRPID7_","_VPRPID8_"/last/utest-c")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.OBJ)
 D ASSERT(2,$G(OBJ("data","totalItems")))
 D ASSERT(VPRPID7,$G(OBJ("data","items",1,"pid")))
 D ASSERT(VPRPID8,$G(OBJ("data","items",2,"pid")))
 Q
FIND1 ;; @TEST find query with multiple patients (one match)
 N OBJ,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRPID7_","_VPRPID8_"/find/utestc?filter=eq(""color"",""purple"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.OBJ)
 D ASSERT(1,$G(OBJ("data","totalItems")))
 D ASSERT(VPRPID8,$G(OBJ("data","items",1,"pid")))
 Q
FIND2 ;; @TEST find query with multiple patients (multiple matches)
 N OBJ,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRPID7_","_VPRPID8_"/find/utestc?filter=eq(rate,3)")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.OBJ)
 D ASSERT(3,$G(OBJ("data","totalItems")))
 D ASSERT(VPRPID7,$G(OBJ("data","items",2,"pid")))
 D ASSERT(VPRPID8,$G(OBJ("data","items",3,"pid")))
 D ASSERT("urn:va:utestc:93EF:-7:1",$G(OBJ("data","items",1,"uid")))
 D ASSERT("urn:va:utestc:93EF:-7:3",$G(OBJ("data","items",2,"uid")))
 D ASSERT("urn:va:utestc:93EF:-8:5",$G(OBJ("data","items",3,"uid")))
 Q
