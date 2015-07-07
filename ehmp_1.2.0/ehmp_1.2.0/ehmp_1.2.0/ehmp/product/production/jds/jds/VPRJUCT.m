VPRJUCT ;SLC/KCM -- Unit tests for templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 K OBJ,ERRORS
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
 ;
SETOBJ(OBJ) ; Setup object
 S OBJ("fld")="f"
 S OBJ("cfld","suba")="fs"
 S OBJ("cfld","subb","subc")="fss"
 S OBJ("mult",1,"flda")="m1f"
 S OBJ("mult",1,"fldb","subc")="m1fs"
 S OBJ("mult",1,"fldc","subd","sube")="m1fss"
 S OBJ("mult",2,"flda")="m2f"
 S OBJ("mult",2,"fldb","subc")="m2fs"
 S OBJ("mult",2,"fldc","subd","sube")="m2fss"
 S OBJ("mult",2,"mult2",1,"sflda")="m2m1f"
 S OBJ("mult",2,"mult2",1,"sfldb","subf")="m2m1fs"
 S OBJ("mult",2,"mult2",1,"sfldc","subg","subh")="m2m1fss"
 S OBJ("mult",3,"mult2",1,"sflda")="m3m1f"
 S OBJ("mult",3,"mult2",2,"sflda")="m3m2f"
 S OBJ("mult",3,"mult2",3,"sflda")="m3m3f"
 S OBJ("mult",3,"mult2",4,"sflda")="m3m4f"
 S OBJ("mult",3,"mult2",5,"sflda")="m3m5f"
 S OBJ("mult",4,"flda")="m4f"
 S OBJ("mult",5,"flda")="m5f"
 S OBJ("more",1,"ma")="ma1"
 S OBJ("more",1,"mb")="mb1"
 S OBJ("more",2,"ma")="ma2"
 Q
BLDTLT(TAG,SPEC,CLTN) ;; return SPEC for template
 N I,X,LINES,FULLSPEC,FULLCLTN,NAME
 S I=0 F  S I=I+1,X=$P($T(@TAG+I),";;",2,99) Q:X="zzzzz"  S LINES(I)=X
 D BLDSPEC^VPRJCD("template",.LINES,.FULLSPEC,.FULLCLTN)
 S NAME=$O(FULLSPEC(""))
 M SPEC=FULLSPEC(NAME,"collection",CLTN)
 Q
 ;
SVAL ;; @TEST single value assignments
 ;;template-test
 ;;  collections: test
 ;;  directives: include, applyOnSave
 ;;  fields: vx=fld, vi=mult[#].flda, vf=mult[1].flda, vl=mult[-1].flda, vc=mult[*].flda
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("SVAL",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(0,TLT("vx","assign"))
 D ASSERT(10,TLT("vi","assign"))
 D ASSERT(99,TLT("vl","assign"))
 D ASSERT(50,TLT("vc","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON,"mult#2")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT("f",TOBJ("vx"))
 D ASSERT("m2f",TOBJ("vi"))
 D ASSERT("m1f",TOBJ("vf"))
 D ASSERT("m5f",TOBJ("vl"))
 D ASSERT("m1f,m2f,m4f,m5f",TOBJ("vc"))
 Q
SLST ;; @TEST list assignments
 ;;template-test
 ;;  collections: test
 ;;  directives: include, applyOnSave
 ;;  fields: la[].val=mult[].flda, lf2[].val=mult[2].flda, ll2[].val=mult[-2].flda, a[].b[].c=mult[].mult2[].sflda
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("SLST",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(1,TLT("la[].val","assign"))
 D ASSERT(1,TLT("ll2[].val","assign"))
 D ASSERT(2,TLT("a[].b[].c","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON)
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT(4,$$QCNT^VPRJTX("TOBJ(""la"")"))
 D ASSERT("m1f",TOBJ("la",1,"val"))
 D ASSERT("m5f",TOBJ("la",4,"val"))
 D ASSERT(2,$$QCNT^VPRJTX("TOBJ(""lf2"")"))
 D ASSERT("m1f",TOBJ("lf2",1,"val"))
 D ASSERT(2,$$QCNT^VPRJTX("TOBJ(""ll2"")"))
 D ASSERT("m4f",TOBJ("ll2",2,"val"))
 D ASSERT(6,$$QCNT^VPRJTX("TOBJ(""a"")"))
 Q
MVAL ;; @TEST merge value assignments
 ;;template-test
 ;;  collections: test
 ;;  directives: include, applyOnSave
 ;;  fields: mv=cfld.*, mi.*=mult[#].*, mf=mult[1].*, ml=mult[-1].*, a[].b=mult[#].flda
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("MVAL",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(20,TLT("mv","assign"))
 D ASSERT(12,TLT("mi","assign"))
 D ASSERT(99,TLT("mf","assign"))
 D ASSERT(11,TLT("a[].b","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON,"mult#2")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT("fss",TOBJ("mv","subb","subc"))
 D ASSERT(1,$D(TOBJ("mv","suba")))
 D ASSERT(10,$D(TOBJ("mv","subb")))
 D ASSERT("m2fs",TOBJ("mi","fldb","subc"))
 D ASSERT("m1fss",TOBJ("mf","fldc","subd","sube"))
 D ASSERT("m5f",TOBJ("ml","flda"))
 D ASSERT(1,$D(TOBJ("ml","flda")))
 D ASSERT("m2f",TOBJ("a",1,"b"))
 Q
MLST ;; @TEST merge list assignments
 ;;template-test
 ;;  collections: test
 ;;  directives: include, applyOnSave
 ;;  fields: mv[]=mult[].*, mf[].*=mult[2].*, ml[]=mult[-2].*, a[].b[]=mult[].mult2[].*, d[].e[].*=mult[].mult2[].*
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("MLST",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(21,TLT("mv[]","assign"))
 D ASSERT(21,TLT("ml[]","assign"))
 D ASSERT(22,TLT("a[].b[]","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON,"mult#2")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D ASSERT("m2m1fss",TOBJ("mv",2,"mult2",1,"sfldc","subg","subh"))
 D ASSERT(9,$$QCNT^VPRJTX("TOBJ(""mf"")"))
 D ASSERT("m2fs",TOBJ("mf",2,"fldb","subc"))
 D ASSERT(2,$$QCNT^VPRJTX("TOBJ(""ml"")"))
 D ASSERT("m4f",TOBJ("ml",2,"flda"))
 D ASSERT("m2m1fss",TOBJ("a",1,"b",1,"sfldc","subg","subh"))
 D ASSERT("m3m5f",TOBJ("a",2,"b",5,"sflda"))
 D ASSERT("m2m1fss",TOBJ("d",1,"e",1,"sfldc","subg","subh"))
 D ASSERT(1,$$QCNT^VPRJTX("TOBJ(""a"")")=$$QCNT^VPRJTX("TOBJ(""d"")"))
 Q
C99 ;; @TEST assignments on complex object references
 ;;template-test
 ;;  collections: test
 ;;  directives: include, applyOnSave
 ;;  fields: myval=cfld.subb.subc, l[].v=mult[#].mult2[].sflda, a[].v=mult[].mult2[].sflda
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("C99",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(99,TLT("myval","assign"))
 D ASSERT(99,TLT("l[].v","assign"))
 D ASSERT(99,TLT("a[].v","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON,"mult#2")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT(0,$D(TEMPLATE("errors")))
 D ASSERT("fss",TOBJ("myval"))
 D ASSERT("m2m1f",TOBJ("l",1,"v"))
 D ASSERT(6,$$QCNT^VPRJTX("TOBJ(""a"")"))
 D ASSERT("m2m1f",TOBJ("a",1,"v"))
 D ASSERT("m3m5f",TOBJ("a",6,"v"))
 K JSON,TOBJ
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON,"mult#3")
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT(5,$$QCNT^VPRJTX("TOBJ(""l"")"))
 D ASSERT("m3m1f",TOBJ("l",1,"v"))
 D ASSERT("m3m5f",TOBJ("l",5,"v"))
 Q
DEL ;; @TEST excluding fields
 ;;template-test
 ;;  collections: test
 ;;  directives: exclude, applyOnSave
 ;;  fields: cfld.subb.subc, mult[].mult2, fld, more[].*
 ;;zzzzz
 N TLT,JSON,OBJ,TOBJ
 D BLDTLT("DEL",.TLT,"test"),SETOBJ(.OBJ)
 D ASSERT(1,$D(OBJ("fld")))
 D ASSERT(1,$D(OBJ("cfld","subb","subc")))
 D ASSERT(10,$D(OBJ("mult",2,"mult2")))
 D ASSERT(10,$D(OBJ("more")))
 D ASSERT(80,TLT("fld","assign"))
 D ASSERT(80,TLT("more[]","assign"))
 D APPLY^VPRJCT(.TLT,.OBJ,.JSON)
 D ASSERT(0,$D(TEMPLATE("errors")))
 D DECODE^VPRJSON("JSON","TOBJ")
 D ASSERT(0,$D(TOBJ("fld")))
 D ASSERT(0,$D(TOBJ("cfld","subb","subc")))
 D ASSERT(0,$D(TOBJ("mult",2,"mult2")))
 D ASSERT(0,$D(TOBJ("more")))
 D ASSERT("fs",TOBJ("cfld","suba"))
 D ASSERT("m2f",TOBJ("mult",2,"flda"))
 Q
