VPRJTCT1 ;SLC/KCM -- Integration tests for rel/rev templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:5 S TAGS(I)="DATA"_I_"^VPRJTP03"
 D BLDPT^VPRJTX(.TAGS)
 K TAGS
 F I=1:1:6 S TAGS(I)="TEST"_I_"^VPRJTD01"
 S TAGS(7)="LINK1^VPRJTD01"
 D ODSBLD^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 D ODSCLR^VPRJTX
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
 ;
BLDTLT(TAG,RTN,TLT) ;; return spec in TLT
 N I,X,LINES,TEMPLATE,CLTN
 S I=0 F  S I=I+1,X=$P($T(@TAG+I^@RTN),";;",2,99) Q:X="zzzzz"  S LINES(I)=X
 D BLDSPEC^VPRJCD("link",.LINES,.TEMPLATE,.CLTN)
 S X=$O(TEMPLATE(""))
 M TLT=TEMPLATE(X)
 Q
METHOD1 ;; @TEST relationship with simple field assignment
 ;;utest-single
 ;;  collections: utestc
 ;;  ref: zdest>from
 ;;  rev: testFroms
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("METHOD1","VPRJTCT1",.TLT)
 D RELTLTP^VPRJCT1("RSLT","urn:va:utestc:93EF:-7:23",.TLT,VPRJTPID)
 D ASSERT(1,RSLT(5)["zdest")
 D ASSERT(1,RSLT(1)[$P($T(RSLT1A),";;",2,99))
 D ASSERT(1,RSLT(5)_RSLT(6)_RSLT(7)[$P($T(RSLT1B),";;",2,99))
 ; (fields end up alphabetic due to the insertion of PID by ^VPRJTX)
 Q
RSLT1A ;;,"from":"urn:va:utesta:93EF:-7:2",
RSLT1B ;;,"zdest":{"authors":[{"provider":{"initials":"MW","name":"Welby,Marcus"}},{"provider":{"initials":"TJ","name":"John,Trapper"}}],"content":"This is a
 ;
METHOD2 ;; @TEST relationship with array uids replaced by summary objects
 ;;utest-multiple
 ;;  collections: utestc
 ;;  ref: items[].uid;unit-test-summary
 ;;  rev: testItems
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("METHOD2","VPRJTCT1",.TLT)
 D RELTLTP^VPRJCT1("RSLT","urn:va:utestc:93EF:-7:23",.TLT,VPRJTPID)
 ;N I F I=1:1 Q:'$D(RSLT(I))  W !,RSLT(I)
 D ASSERT(1,RSLT(1)_RSLT(2)[$P($T(RSLT2A),";;",2,99))
 D ASSERT(1,RSLT(2)_RSLT(3)_RSLT(4)[$P($T(RSLT2B),";;",2,99))
 Q
RSLT2A ;;,"items":[{"uid":{"dateTime":"20121229103022","summary":"summary for uid utesta:1",
RSLT2B ;;,{"uid":{"dateTime":"20101229103022","summary":"summary for uid utestb:3",
 ;
METHOD3 ;; @TEST relationship with multiple nodes in field name
 ;;utest-single
 ;;  collections: utestc
 ;;  ref: za.zb>from;unit-test-summary
 ;;  rev: testFroms
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("METHOD3","VPRJTCT1",.TLT)
 D RELTLTP^VPRJCT1("RSLT","urn:va:utestc:93EF:-7:23",.TLT,VPRJTPID)
 D ASSERT(1,RSLT(5)_RSLT(6)[$P($T(RSLT3A),";;",2,99))
 Q
RSLT3A ;;,"za":{"zb":{"dateTime":"20111229103022","summary":"summary for uid utesta:2",
 ;
METHOD4 ;; @TEST relationship with unusual pattern for field name in arrays
 ;;utest-multiple
 ;;  collections: utestc
 ;;  ref: resolved.items[].obj>items[].uid;unit-test-summary
 ;;  rev: testItems
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("METHOD4","VPRJTCT1",.TLT)
 D RELTLTP^VPRJCT1("RSLT","urn:va:utestc:93EF:-7:23",.TLT,VPRJTPID)
 D ASSERT(1,RSLT(1)_RSLT(2)[$P($T(RSLT4A),";;",2,99))
 D ASSERT(1,RSLT(2)_RSLT(3)_RSLT(4)[$P($T(RSLT4B),";;",2,99))
 Q
RSLT4A ;;,"items":[{"uid":"urn:va:utesta:93EF:-7:1"},{"uid":"urn:va:utestb:93EF:-7:3"}],"localId":"c1",
RSLT4B ;;,"resolved":{"items":[{"obj":{"dateTime":"20121229103022","summary":"summary for uid utesta:1",
 ;
METHOD5 ;; @TEST relationship where $Q must be used to iterate values
 ;;utest-multiple
 ;;  collections: utestc
 ;;  ref: dest[].obj>subs[].members[].uid
 ;;  rev: testItems
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("METHOD5","VPRJTCT1",.TLT)
 D RELTLTP^VPRJCT1("RSLT","urn:va:utestc:93EF:-7:23",.TLT,VPRJTPID)
 D ASSERT(1,RSLT(1)_RSLT(2)_RSLT(3)[$P($T(RSLT5A),";;",2,99))
 D ASSERT(1,RSLT(9)_RSLT(10)[$P($T(RSLT5B),";;",2,99))
 D ASSERT(1,RSLT(18)_RSLT(19)[$P($T(RSLT5C),";;",2,99))
 D ASSERT(1,RSLT(27)_RSLT(28)[$P($T(RSLT5D),";;",2,99))
 ; (the fields end up alphabetically arranged because PID is now inserted)
 Q
RSLT5A ;;{"dest":[{"obj":{"authors":[{"provider":{"initials":"MW","name":"Welby,Marcus"}},{"provider":{"initials":"TJ","name":"John,Trapper"}}],"content"
RSLT5B ;;"qualifiedName":"Miracle Tonic","stampTime":"71","summary":"summary for uid utesta:1","uid":"urn:va:utesta:93EF:-7:1"
RSLT5C ;;"summary":"summary for uid utesta:2","uid":"urn:va:utesta:93EF:-7:2"
RSLT5D ;;"summary":"summary for uid utestb:3","uid":"urn:va:utestb:93EF:-7:3"
 ;
ODS1 ;; @TEST template for ODS data
 ;;utest-ods
 ;;  collections: utestods
 ;;  ref: from[]>items[].uid
 ;;zzzzz
 N TLT,RSLT
 D BLDTLT("ODS1","VPRJTCT1",.TLT)
 S HTTPREQ("store")="data"
 D RELTLTD^VPRJCT1("RSLT","urn:va:utestods:1",.TLT)
 K HTTPREQ("store")
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(1,RSLT(1)_RSLT(2)_RSLT(3)[$P($T(ODS1A),";;",2,99))
 Q
ODS1A ;;{"from":[{"name":"beta","updated": "201110201857","stampTime":"2","color":"red","uid":"urn:va:test:2"},{"name":"gamma",
 ;
REV1 ;; @TEST reverse template with uid's
 N TEMPLATE,RSLT
 S TEMPLATE="rev;utest-multiple;uid"
 D LOADSPEC^VPRJCT1(.TEMPLATE)
 D REVTLTP^VPRJCT1("RSLT","urn:va:utesta:93EF:-7:1",.TEMPLATE,VPRJTPID)
 D ASSERT(1,RSLT(10)[$P($T(REV1A),";;",2,99))
 Q
REV1A ;;,"testItems":[{"uid":"urn:va:utestc:93EF:-7:23"},{"uid":"urn:va:utestc:93EF:-7:42"}]
 ;
REV2 ;; @TEST reverse template with uid's replaced by summary objects
 N TEMPLATE,RSLT
 S TEMPLATE="rev;utest-multiple;unit-test-summary"
 D LOADSPEC^VPRJCT1(.TEMPLATE)
 D REVTLTP^VPRJCT1("RSLT","urn:va:utesta:93EF:-7:1",.TEMPLATE,VPRJTPID)
 D ASSERT(1,RSLT(10)_RSLT(11)[$P($T(REV2A),";;",2,99))
 Q
REV2A ;;,"testItems":[{"name":"testRels","uid":"urn:va:utestc:93EF:-7:23"},{"name":"testRelsB","uid":"urn:va:utestc:93EF:-7:42"}]
 ;
REV3 ;; @TEST full reverse template for odc
 N TEMPLATE,RSLT,HTTPREQ
 S HTTPREQ("store")="data"
 S TEMPLATE="rev;utest-ods"
 D LOADSPEC^VPRJCT1(.TEMPLATE)
 D REVTLTD^VPRJCT1("RSLT","urn:va:test:2",.TEMPLATE)
 D ASSERT(1,RSLT(1)_RSLT(2)[$P($T(REV3A),";;",2,99))
 N ERR,OBJ
 D DECODE^VPRJSON("RSLT","OBJ","ERR")
 D ASSERT(0,$D(ERR))
 Q
REV3A ;;"testFroms":[{"name":"container1","uid":"urn:va:utestods:1",
 ;
1 ; one test
 D STARTUP,REV2,SHUTDOWN
 Q
