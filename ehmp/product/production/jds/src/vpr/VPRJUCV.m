VPRJUCV ;SLC/KCM -- Unit tests for extracting values from objects
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
COLLATE ;; @TEST collation function
 N X
 S X=$$COLLATE^VPRJCV("","S")        D ASSERT(" ",X)
 S X=$$COLLATE^VPRJCV(20120919,"V")  D ASSERT("79879080=",X)
 S X=$$COLLATE^VPRJCV("ASPIRIN","S") D ASSERT("ASPIRIN ",X)
 S X=$$COLLATE^VPRJCV(3.1416,"N")    D ASSERT(3.1416,X)
 S X=$$COLLATE^VPRJCV("DIGOXIN","P") D ASSERT("DIGOXIN",X)
 Q
SETOBJ(OBJECT) ; set up a test object
 S OBJECT("top")="top value"
 S OBJECT("when")="201208121030"
 S OBJECT("how")="miracle"
 S OBJECT("mult",1,"sub")="sub1 value"
 S OBJECT("mult",2,"sub")="sub2 value"
 S OBJECT("mult",2,"provider","name")="Welby"
 S OBJECT("products",1,"drugClassCode")="urn:vadc:HS502"
 S OBJECT("ary1",4,"ary2",47,"val")="4-47"
 S OBJECT("ary1",4,"val")="4val"
 S OBJECT("ary1",5,"val")="5val"
 S OBJECT("ary1",15,"ary2",103,"val")="15-103"
 S OBJECT("ary1",15,"val")="15val"
 S OBJECT("list",1)="list 1"
 S OBJECT("list",2)="list 2"
 S OBJECT("list",3)="list 3"
 Q
BLD4TLT(OBJECT,VALUES,TAG) ; build instance values given lines of template
 N I,X,LINES,CLTN,SPEC
 S I=0 F  S I=I+1,X=$P($T(@TAG+I),";;",2,99) Q:X="zzzzz"  S LINES(I)=X
 D BLDSPEC^VPRJCD("template",.LINES,.SPEC,.CLTN)
 ;W ! ZW SPEC ZW CLTN
 ;D GETVALS^VPRJCV(.OBJECT,.VALUES,.CSPEC)
 Q
TLTVALS ;; TEST set values for templates
 ;;unit-test-instance
 ;;  collections: utesta
 ;;  directives: include, applyOnSave
 ;;  fields: uid, qualifiedName, dose=dosages[#].dose, start=dosages[#].start, stop=dosages[#].stop
 ;;zzzzz
 N OBJECT,VALUES
 D SETOBJ(.OBJECT)
 D BLD4TLT(.OBJECT,.VALUES,"TLTVALS")
 Q
BLD4IDX(OBJECT,VALUES,FIELDS) ; Build spec then set values given FIELDS
 N CLTNS,ATTR,SPEC,FULLSPEC,ERRORS,I
 S CLTNS("utesta")="",ATTR("metatype")="index",ATTR("style")="attr"
 D IDXSPEC^VPRJCD1(.CLTNS,.FIELDS,.ATTR,.FULLSPEC)
 D ASSERT(0,$D(ERRORS))
 M SPEC=FULLSPEC("collection","utesta")
 K VALUES
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.SPEC)
 Q
IDXVALS ;; @TEST set values procedure
 N OBJECT,VALUES,FIELDS
 D SETOBJ(.OBJECT)
 ;
 ;fields: top/S
 S FIELDS(0,1)="top/S"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("top value ",VALUES(1,1))
 ;fields: top/S, when/V/0
 S FIELDS(0,2)="when/V/0"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("798791878969=",VALUES(1,2))
 ;fields: mult[].sub/S, when/V/0
 S FIELDS(0,1)="mult[].sub/S"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("sub1 value ",VALUES("mult#1",1))
 D ASSERT("sub2 value ",VALUES("mult#2",1))
 D ASSERT("798791878969=",VALUES("mult#1",2))
 D ASSERT("798791878969=",VALUES("mult#2",2))
 ;fields: mult[].sub/S, when/V/0, mult[].provider.name/s
 S FIELDS(0,3)="mult[].provider.name/s"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT(0,$D(VALUES("mult#1")))
 D ASSERT("welby ",VALUES("mult#2",3))
 ;fields: mult[].sub/S, when/V/0, mult[].provider.name/s/?
 S FIELDS(0,3)="mult[].provider.name/s/?"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("? ",VALUES("mult#1",3))
 ;fields: mult[].sub/S, gone/V/0, mult[].provider.name/s/?
 S FIELDS(0,2)="gone/V/0"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("9=",VALUES("mult#1",2)) ; reverse time, so 0= becomes 9=
 D ASSERT("9=",VALUES("mult#2",2))
 ;fields: mult[].sub/S, gone/V/0, products[].drugClassCode/S
 S FIELDS(0,3)="products[].drugClassCode/S"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("urn:vadc:HS502 ",VALUES("mult#1|products#1",3))
 D ASSERT("urn:vadc:HS502 ",VALUES("mult#2|products#1",3))
 ;fields: top/s, how/s, when/V
 K FIELDS
 S FIELDS(0,1)="top/s",FIELDS(0,2)="how/s",FIELDS(0,3)="when/V"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("top value ",VALUES(1,1))
 D ASSERT("miracle ",VALUES(1,2))
 D ASSERT("798791878969=",VALUES(1,3))
 ; fields: mult[].sub/s
 K FIELDS
 S FIELDS(0,1)="mult[].sub/s"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 ;fields: ary1[].ary2[].val/P
 K FIELDS
 S FIELDS(0,1)="ary1[].ary2[].val/P"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("15-103",VALUES("ary1#15>ary1.ary2#103",1))
 ;fields: ary1[].ary2[].val/P, mult[].sub/s
 K FIELDS
 S FIELDS(0,1)="ary1[].ary2[].val/P"
 S FIELDS(0,2)="mult[].sub/s"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("15-103",VALUES("ary1#15>ary1.ary2#103|mult#2",1))
 D ASSERT("sub2 value ",VALUES("ary1#4>ary1.ary2#47|mult#2",2))
 D ASSERT(8,$$QCNT^VPRJTX("VALUES"))
 ;fields: list[]
 K FIELDS
 S FIELDS(0,1)="list[]"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("list 3 ",VALUES("list#3",1))
 ;fields: last4 (to test field missing from object)
 K FIELDS
 S FIELDS(0,1)="last4"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT(0,$D(VALUES))
 Q
IDXNEST ;; @TEST indexing values where there are descendent multiples
 N OBJECT,VALUES,FIELDS
 D SETOBJ(.OBJECT)
 ;
 ;fields: ary1[].val, ary1[].ary2[].val
 S FIELDS(0,1)="ary1[].val/P"
 S FIELDS(0,2)="ary1[].ary2[].val/P"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 ;W ! ZW VALUES
 Q
IDXNEST2 ;; @TEST indexing values with various ancestry paths
 N OBJECT,VALUES,FIELDS
 S OBJECT("one",1,"x")="1x"
 S OBJECT("one",1,"two",1,"y")="11y"
 S OBJECT("one",1,"two",1,"three",1,"z")="111z"
 S OBJECT("one",1,"two",1,"three",2,"z")="112z"
 S OBJECT("one",1,"two",1,"five",1,"w")="111w"
 S OBJECT("one",1,"two",2,"y")="12y"
 S OBJECT("one",2,"x")="2x"
 S OBJECT("one",2,"two",1,"y")="21y"
 S OBJECT("one",2,"two",1,"three",1,"z")="211z"
 S OBJECT("one",2,"two",1,"five",1,"w")="211w"
 S OBJECT("one",2,"two",1,"five",2,"w")="212w"
 S OBJECT("one",2,"two",2,"y")="22y"
 S OBJECT("one",2,"two",3,"y")="23y"
 S FIELDS(0,1)="one[].x/P"
 S FIELDS(0,2)="one[].two[].three[].z/P"
 S FIELDS(0,3)="one[].two[].y/P"
 S FIELDS(0,4)="one[].two[].five[].w/P"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 ;W ! ZW VALUES
 Q
SETVALM ;; @TEST set values for deeper hierarchies like microbiology
 N OBJECT,VALUES,FIELDS
 S OBJECT("test")="susceptibility"
 S OBJECT("observed")="201208121030"
 S OBJECT("organisms",1,"name")="e coli"
 S OBJECT("organisms",1,"antibiotics",1,"name")="penicillin"
 S OBJECT("organisms",1,"antibiotics",1,"resistance")="R"
 S OBJECT("organisms",1,"antibiotics",2,"name")="ampicillin"
 S OBJECT("organisms",1,"antibiotics",2,"resistance")="R"
 S OBJECT("organisms",1,"antibiotics",3,"name")="azithromycin"
 S OBJECT("organisms",1,"antibiotics",3,"resistance")="S"
 S OBJECT("organisms",2,"name")="staphylococcus"
 S OBJECT("organisms",2,"antibiotics",1,"name")="penicillin"
 S OBJECT("organisms",2,"antibiotics",1,"resistance")="R"
 S OBJECT("organisms",2,"antibiotics",2,"name")="ampicillin"
 S OBJECT("organisms",2,"antibiotics",2,"resistance")="S"
 S OBJECT("organisms",2,"antibiotics",3,"name")="azithromycin"
 S OBJECT("organisms",2,"antibiotics",3,"resistance")="S"
 S OBJECT("organisms",3,"name")="streptococcus"
 S OBJECT("organisms",3,"antibiotics",1,"name")="penicillin"
 S OBJECT("organisms",3,"antibiotics",1,"resistance")="S"
 S OBJECT("organisms",3,"antibiotics",2,"name")="ampicillin"
 S OBJECT("organisms",3,"antibiotics",2,"resistance")="S"
 S OBJECT("organisms",3,"antibiotics",3,"name")="azithromycin"
 S OBJECT("organisms",3,"antibiotics",3,"resistance")="S"
 ;
 ;fields: organisms[].antibiotics[].name/s
 S FIELDS(0,1)="organisms[].antibiotics[].name/s"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 D ASSERT("azithromycin ",VALUES("organisms#1>organisms.antibiotics#3",1))
 D ASSERT("ampicillin ",VALUES("organisms#2>organisms.antibiotics#2",1))
 D ASSERT("penicillin ",VALUES("organisms#3>organisms.antibiotics#1",1))
 Q
SUBNAME ;; @TEST set values with same subordinate array name
 ;;{"a": [{"b":{"c":[1,2,3]},"d":{"c":[7,8,9]}}]}
 N OBJECT,VALUES,FIELDS,JSON,ERR
 S JSON=$P($T(SUBNAME+1),";;",2,99)
 D DECODE^VPRJSON("JSON","OBJECT","ERR")
 D ASSERT(0,$D(ERR))
 S FIELDS(0,1)="a[].b.c[]"
 S FIELDS(0,2)="a[].d.c[]"
 D BLD4IDX(.OBJECT,.VALUES,.FIELDS)
 ; combinations returned should be (1,7),(1,8),(1,9),(2,7),(2,8),(2,9),(3,7),(3,8),(3,9)
 D ASSERT(18,$$QCNT^VPRJTX("VALUES"))
 D ASSERT("1 ",VALUES("a#1>a.b.c#1|a#1>a.d.c#1",1))
 D ASSERT("2 ",VALUES("a#1>a.b.c#2|a#1>a.d.c#2",1))
 D ASSERT("9 ",VALUES("a#1>a.b.c#3|a#1>a.d.c#3",2))
 Q
