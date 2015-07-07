VPRJUCD1 ;SLC/KCM -- Unit tests for building templates
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
GETPTRN ;; @TEST parse pattern for a field
 D ASSERT("N",$$GETPTRN^VPRJCD1("top"))
 D ASSERT("AN",$$GETPTRN^VPRJCD1("top[].fld"))
 D ASSERT("AAN",$$GETPTRN^VPRJCD1("top[].next[].fld"))
 D ASSERT("AA",$$GETPTRN^VPRJCD1("top[].next[]"))
 D ASSERT("#N",$$GETPTRN^VPRJCD1("top[#].fld"))
 D ASSERT("*N",$$GETPTRN^VPRJCD1("top[*].fld"))
 D ASSERT("NM",$$GETPTRN^VPRJCD1("top.*"))
 D ASSERT("AM",$$GETPTRN^VPRJCD1("top[].*"))
 D ASSERT("NNN",$$GETPTRN^VPRJCD1("top.next.fld"))
 D ASSERT("*N",$$GETPTRN^VPRJCD1("top[* / ].fld"))
 D ASSERT("?N",$$GETPTRN^VPRJCD1("top[junk].fld"))
 D ASSERT("AN",$$GETPTRN^VPRJCD1("dosages[3].dose"))
 D ASSERT("AN",$$GETPTRN^VPRJCD1("dosages[-2].dose"))
 D ASSERT("AM",$$GETPTRN^VPRJCD1("a[-3].*"))
 D ASSERT("A",$$GETPTRN^VPRJCD1("x[]"))
 Q
GETMTHD ;; @TEST calculate assignment method
 D ASSERT(0,$$GETMTHD^VPRJCD1("src","dest"))
 D ASSERT(1,$$GETMTHD^VPRJCD1("src[].fld","dest[].val"))
 D ASSERT(2,$$GETMTHD^VPRJCD1("organism[].antibiotic[].value","dest[].sub[].val"))
 D ASSERT(10,$$GETMTHD^VPRJCD1("src[#].fld","dest"))
 D ASSERT(11,$$GETMTHD^VPRJCD1("src[#].fld","dest[].val"))
 D ASSERT(12,$$GETMTHD^VPRJCD1("src[#].*","dest"))
 D ASSERT(12,$$GETMTHD^VPRJCD1("src[#].*","dest.*"))
 D ASSERT(20,$$GETMTHD^VPRJCD1("src.*","dest"))
 D ASSERT(20,$$GETMTHD^VPRJCD1("src.*","dest.*"))
 D ASSERT(21,$$GETMTHD^VPRJCD1("src[].*","dest[]"))
 D ASSERT(21,$$GETMTHD^VPRJCD1("src[].*","dest[].*"))
 D ASSERT(22,$$GETMTHD^VPRJCD1("src[].sub[].*","dest[].other[]"))
 D ASSERT(50,$$GETMTHD^VPRJCD1("src[* / ].fld","dest"))
 D ASSERT(50,$$GETMTHD^VPRJCD1("src[*].fld","dest"))
 D ASSERT(99,$$GETMTHD^VPRJCD1("src.sub.fld","dest.other.val"))
 Q
COMBINE ;; TEST computation of combining fields
 N USED
 D ASSERT(1,$$COMBINE^VPRJCD1("one",.USED))
 D ASSERT(1,$$COMBINE^VPRJCD1("one.two.three",.USED))
 D ASSERT(1,$$COMBINE^VPRJCD1("one.two",.USED))
 D ASSERT(2,$$COMBINE^VPRJCD1("one.two.five",.USED))
 Q
TLTSPEC ;; @TEST build template information
 N CTNS,FLDS,ATTR,SPEC,ERRORS
 S CTNS("utest")=""
 S ATTR("metatype")="template",ATTR("name")="utest-template"
 S FLDS(0,"uid")="uid"
 S FLDS(0,"dose")="dose=dosages[#].dose"
 S FLDS(0,"fills")="fills=fills[* / ].fillDate"
 S FLDS("utest","qualifiedName")="qualifiedName"
 S FLDS("utest","products")="products[]=drugs[].*"
 D TLTSPEC^VPRJCD1(.CTNS,.FLDS,.ATTR,.SPEC)
 D ASSERT(0,$D(ERRORS))
 D ASSERT(10,SPEC("collection","utest","dose","assign"))
 D ASSERT("dose",SPEC("collection","utest","dose","srcPath",2))
 D ASSERT(50,SPEC("collection","utest","fills","assign"))
 D ASSERT(" / ",SPEC("collection","utest","fills","srcArrays",1,"collect"))
 D ASSERT("TARGET(""fills"")",SPEC("collection","utest","fills","tgtRef"))
 D ASSERT(0,SPEC("collection","utest","fills","addType"))
 D ASSERT(1,SPEC("collection","utest","products","addType"))
 D ASSERT(21,SPEC("collection","utest","products","assign"))
 D ASSERT("drugs",SPEC("collection","utest","products","srcPath",1))
 D ASSERT("products",SPEC("collection","utest","products","tgtPath",1))
 D ASSERT("OBJECT(""drugs"",I(1))",SPEC("collection","utest","products","srcRef"))
 D ASSERT("TARGET(""products"",J)",SPEC("collection","utest","products","tgtRef"))
 D ASSERT(0,SPEC("collection","utest","qualifiedName","assign"))
 D ASSERT("qualifiedName",SPEC("collection","utest","qualifiedName","srcPath"))
 D ASSERT("qualifiedName",SPEC("collection","utest","qualifiedName","tgtPath"))
 D ASSERT(0,+$G(SPEC("collection","utest","uid","tgtArrays")))
 Q
CHKCODE(SRC,TGT,CODE,DIR,MAX,DELIM) ; build SPEC and check assign code
 N CTNS,ATTR,FLDS,SPEC,ERRORS
 S CTNS("utest")="",ATTR("metatype")="template",ATTR("name")="utest-tlt"
 S FLDS(0,TGT)=TGT_"="_SRC
 D TLTSPEC^VPRJCD1(.CTNS,.FLDS,.ATTR,.SPEC)
 D ASSERT(0,$D(ERRORS))
 D ASSERT(CODE,SPEC("collection","utest",TGT,"assign"))
 D ASSERT(DIR,$G(SPEC("collection","utest",TGT,"srcArrays",1,"dir")))
 D ASSERT(MAX,$G(SPEC("collection","utest",TGT,"srcArrays",1,"max")))
 D ASSERT(DELIM,$G(SPEC("collection","utest",TGT,"srcArrays",1,"collect")))
 Q
TLTASSGN ;; @TEST assignment types for fields
 ;B  D CHKCODE("a[].b.c[#].d","x[].y",99,0,999999,"")
 D CHKCODE("overallStart","start",0,"","","")
 D CHKCODE("dosages[#].dose","dose",10,0,1,"")
 D CHKCODE("dosages[1].dose","dose",99,1,1,"")
 D CHKCODE("dosages[-1].dose","dose",99,-1,1,"")
 D CHKCODE("dosages[*].dose","dose",50,1,999999,",")
 D CHKCODE("dosages[].dose","mydoses[].dose",1,1,999999,"")
 D CHKCODE("dosages[3].dose","initial[].dose",1,1,3,"")
 D CHKCODE("dosages[-2].dose","recent[].dose",1,-1,2,"")
 D CHKCODE("dosages[].*","mylist[].*",21,1,999999,"")
 D CHKCODE("dosages[3].*","mylist[].*",21,1,3,"")
 D CHKCODE("a.*","x.*",20,"","","")
 D CHKCODE("dosages[#].*","x",12,0,1,"")
 D CHKCODE("dosages[1].*","x",99,1,1,"")
 D CHKCODE("a.b.dosages[#].dose","x",99,0,1,"")
 D CHKCODE("a.b.c[#].d","x[].y",99,0,1,"")
 Q
CHKERR(SRC,TGT) ; build SPEC and check erroneous assignments
 N CTNS,ATTR,FLDS,SPEC,ERRORS
 S CTNS("utest")="",ATTR("metatype")="template",ATTR("name")="utest-tlt"
 S FLDS(0,TGT)=TGT_"="_SRC
 D TLTSPEC^VPRJCD1(.CTNS,.FLDS,.ATTR,.SPEC)
 D ASSERT(11,$D(ERRORS))
 Q
TLTERRS ;; @TEST assignments with errors
 D CHKERR("dosages[-2].dose","dose")   ; list to value not ok
 D CHKERR("a[].b[].c","w[].x[].y[].z") ; target has too many arrays
 D CHKERR("a[*/].b[].*","x[].*")       ; can't collect and merge
 Q
LINKSPEC ;; @TEST build link information
 N LINK,CTNS,FIELDS,ATTR
 S CTNS("test")=""
 S ATTR("rev")="testItems",ATTR("metatype")="link",ATTR("name")="link-test"
 S FIELDS(0,1)="items[].obj>items[].sub[].uid;summary"
 D LINKSPEC^VPRJCD1(.CTNS,.FIELDS,.ATTR,.LINK)
 D ASSERT(2,LINK("collection","test",1,1,"srcMethod"))
 D ASSERT(99,LINK("collection","test",1,"tgtMethod"))
 D ASSERT("testItems",LINK("common","rev"))
 D ASSERT("summary",LINK("collection","test",1,1,"srcTemplate"))
 D ASSERT("OBJECT(""items"",I(1),""sub"",I(2))",LINK("collection","test",1,1,"srcArrays",2,"ref"))
 D ASSERT("TARGET(""items"",J,""obj"")",LINK("collection","test",1,"tgtRef"))
 D ASSERT("VALS(1,I(1),I(2))",LINK("collection","test",1,"valRef"))
 Q
