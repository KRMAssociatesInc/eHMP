VPRJTDS ;SLC/KCM -- Integration tests for saving objects to ODC
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 D ODSCLR^VPRJTX
 Q
SHUTDOWN ; Run once after all tests
 D ODSCLR^VPRJTX
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
ADDOBJ ;; @TEST adding an object
 N DATA,LOC
 D GETDATA^VPRJTX("TEST1","VPRJTD01",.DATA)
 S LOC=$$SAVE^VPRJDS(.DATA)
 D ASSERT(10,$D(^VPRJD("urn:va:test:1",1)))
 D ASSERT("blue",^VPRJD("urn:va:test:1",1,"color"))
 D ASSERT(1,$D(^VPRJDJ("JSON","urn:va:test:1",1,1)))
 ; TODO: add test for summary json
 Q
CHKIDX ;; @TEST indexes that were built after adding object
 D ASSERT(1,$D(^VPRJDX("attr","test-name","alpha ","798789799542=","urn:va:test:1",1)))
 D ASSERT(1,^VPRJDX("tally","test-name-count","alpha"))
 D ASSERT(1,^VPRJDX("count","collection","test"))
 Q
GETOBJ ;; @TEST getting an object
 D QKEY^VPRJDQ("urn:va:test:1")
 D ASSERT(1,$D(^TMP($J,"data",0,"urn:va:test:1",0)))
 D ASSERT(1,$G(^TMP($J,"total")))
 Q
DELOBJ ;; @TEST deletion of object
 D DELETE^VPRJDS("urn:va:test:1")
 D ASSERT(0,$D(^VPRJD("urn:va:test:1")))
 D ASSERT(0,$D(^VPRJDJ("JSON","urn:va:test:1")))
 D ASSERT(0,$D(^VPRJDX("attr","test-name","alpha")))
 D ASSERT(0,$G(^VPRJDX("count","collection","test")))
 Q
ADDLNK ;; @TEST adding object with links defined
 ; link defined in VPRJPMR, data in VPRJTD01
 N DATA,LOC
 D GETDATA^VPRJTX("LINK1","VPRJTD01",.DATA)
 S LOC=$$SAVE^VPRJDS(.DATA)
 D ASSERT(10,$D(^VPRJD("urn:va:utestods:1")))
 D ASSERT(1,$D(^VPRJDX("rev","urn:va:test:2","utest-ods","urn:va:utestods:1","items#1")))
 D ASSERT(1,$D(^VPRJDX("rev","urn:va:test:3","utest-ods","urn:va:utestods:1","items#2")))
 Q
DELCLTN ;; @TEST deleting a collection from a specific server
 N I,TAGS
 F I=1:1:4 S TAGS(I)="SYS"_I_"^VPRJTD01"
 D ODSBLD^VPRJTX(.TAGS)
 D ASSERT(1,$D(^VPRJD("urn:va:test:F111:4"))>0)
 D DELCTN^VPRJDS("test","F111")
 D ASSERT(0,$D(^VPRJD("urn:va:test:F111:4")))
 D ASSERT(1,$D(^VPRJD("urn:va:test:F000:2"))>0)
 Q
DELSITE ;; @TEST deletion of all objects for a site
 N I,TAGS
 F I=1:1:4 S TAGS(I)="SYS"_I_"^VPRJTD01"
 D ODSBLD^VPRJTX(.TAGS)
 D ASSERT(1,$D(^VPRJD("urn:va:test:F000:1"))>0)
 D ASSERT(1,$D(^VPRJDJ("JSON","urn:va:test:F000:1"))>0)
 D ASSERT(1,$D(^VPRJDJ("TEMPLATE","urn:va:test:F000:1"))>0)
 D ASSERT(1,$D(^VPRJD("urn:va:test:F111:4"))>0)
 D ASSERT(1,$D(^VPRJDJ("JSON","urn:va:test:F111:4"))>0)
 D ASSERT(1,$D(^VPRJDJ("TEMPLATE","urn:va:test:F111:4"))>0)
 D DELSITE^VPRJDS("F000")
 D ASSERT(0,$D(^VPRJD("urn:va:test:F000:1")))
 D ASSERT(0,$D(^VPRJDJ("JSON","urn:va:test:F000:1")))
 D ASSERT(0,$D(^VPRJDJ("TEMPLATE","urn:va:test:F000:1")))
 D ASSERT(1,$D(^VPRJD("urn:va:test:F111:4"))>0)
 D ASSERT(1,$D(^VPRJDJ("JSON","urn:va:test:F111:4"))>0)
 D ASSERT(1,$D(^VPRJDJ("TEMPLATE","urn:va:test:F111:4"))>0)
 Q
