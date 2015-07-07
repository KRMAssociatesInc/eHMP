VPRJUCD ;SLC/KCM -- Unit tests for building meta-data
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
LASTARY ;; @TEST finding last array node
 D ASSERT(0,$$LASTARY^VPRJCD("one.two.three"))
 D ASSERT(2,$$LASTARY^VPRJCD("one[].two[].three"))
 D ASSERT(3,$$LASTARY^VPRJCD("one.two.three[]"))
 D ASSERT(3,$$LASTARY^VPRJCD("one[].two.three[].four.five"))
 D ASSERT(2,$$LASTARY^VPRJCD("one[].two[#].three[].four","#"))
 Q
 ;
ARYCLCT ;; @TEST parsing for collection array modifier
 D ASSERT("",$$ARYCLCT^VPRJCD("ary[]"))
 D ASSERT(",",$$ARYCLCT^VPRJCD("ary[*]"))
 D ASSERT("",$$ARYCLCT^VPRJCD("ary[#]"))
 D ASSERT(" / ",$$ARYCLCT^VPRJCD("ary[* / ]"))
 Q
ARYDIR ;; @TEST parsing for direction array modifier
 D ASSERT(1,$$ARYDIR^VPRJCD("ary[]"))
 D ASSERT(-1,$$ARYDIR^VPRJCD("ary[-3]"))
 D ASSERT(1,$$ARYDIR^VPRJCD("ary[3]"))
 D ASSERT(1,$$ARYDIR^VPRJCD("ary[1]"))
 D ASSERT(0,$$ARYDIR^VPRJCD("ary[#]"))
 Q
ARYMAX ;; @TEST parsing for max array modifier
 D ASSERT(999999,$$ARYMAX^VPRJCD("ary[]"))
 D ASSERT(3,$$ARYMAX^VPRJCD("ary[-3]"))
 D ASSERT(1,$$ARYMAX^VPRJCD("ary[1]"))
 D ASSERT(1,$$ARYMAX^VPRJCD("ary[#]"))
 D ASSERT(999999,$$ARYMAX^VPRJCD("ary[*/]"))
 Q
GETTGT ;; @TEST getting a target field from a field spec
 D ASSERT("var",$$GETTGT^VPRJCD("var=othervar"))
 D ASSERT("items[].obj",$$GETTGT^VPRJCD("items[].obj>items[].uid;summary"))
 D ASSERT("ary1[].ary2[]",$$GETTGT^VPRJCD("ary1[].ary2[]"))
 D ASSERT("ary1[].field",$$GETTGT^VPRJCD("ary1[].field"))
 D ASSERT("ary1[]",$$GETTGT^VPRJCD("ary1[].*"))
 D ASSERT("ary1[].field",$$GETTGT^VPRJCD("ary1[#].field"))
 D ASSERT("ary1[].field",$$GETTGT^VPRJCD("ary1[*,].field"))
 D ASSERT("ary1[].ary2[].ary3[]",$$GETTGT^VPRJCD("ary1[#].ary2[-1].ary3[*].*"))
 Q
BLDREF ;; @TEST building a node reference from object notation
 N X
 S X=$$BLDREF^VPRJCD("results[].clinician.name")
 D ASSERT("OBJECT(""results"",I(1),""clinician"",""name"")",X)
 S X=$$BLDREF^VPRJCD("summary")
 D ASSERT("OBJECT(""summary"")",X)
 S X=$$BLDREF^VPRJCD("results[].units")
 D ASSERT("OBJECT(""results"",I(1),""units"")",X)
 S X=$$BLDREF^VPRJCD("clinician.name")
 D ASSERT("OBJECT(""clinician"",""name"")",X)
 S X=$$BLDREF^VPRJCD("clinicians[]")
 D ASSERT("OBJECT(""clinicians"",I(1))",X)
 S X=$$BLDREF^VPRJCD("test[].organism[].antibiotic[]")
 D ASSERT("OBJECT(""test"",I(1),""organism"",I(2),""antibiotic"",I(3))",X)
 S X=$$BLDREF^VPRJCD("test[].organism[].antibiotic[].sensitivity")
 D ASSERT("OBJECT(""test"",I(1),""organism"",I(2),""antibiotic"",I(3),""sensitivity"")",X)
 Q
BLDIPATH ;; @TEST building an instance path reference
 D ASSERT("one",$$BLDIPATH^VPRJCD("one[]"))
 D ASSERT("test.one.two",$$BLDIPATH^VPRJCD("test.one[].two[]"))
 D ASSERT("one.two.three",$$BLDIPATH^VPRJCD("one[].two[].three[]"))
 D ASSERT("one.two",$$BLDIPATH^VPRJCD("one.two[]"))
 D ASSERT("top.list.next.list",$$BLDIPATH^VPRJCD("top.list[].next.list[]"))
 Q
FLDSPEC ;; @TEST building a field spec
 N SPEC
 D FLDSPEC^VPRJCD("uid",.SPEC,"src")
 D ASSERT("uid",SPEC("srcPath",1))
 D ASSERT(0,$D(SPEC("srcArrays")))
 D ASSERT(6,$$QCNT^VPRJTX("SPEC"))
 K SPEC
 D FLDSPEC^VPRJCD("clinicians[].name",.SPEC,"src")
 D ASSERT("clinicians",SPEC("srcPath",1))
 D ASSERT("OBJECT(""clinicians"",I(1))",SPEC("srcArrays",1,"ref"))
 D ASSERT(1,SPEC("srcArrays"))
 D ASSERT("OBJECT(""clinicians"",I(1),""name"")",SPEC("srcRef"))
 D ASSERT(14,$$QCNT^VPRJTX("SPEC"))
 K SPEC
 D FLDSPEC^VPRJCD("top.mult[].person.name",.SPEC,"src")
 D ASSERT(1,SPEC("srcArrays"))
 D ASSERT("OBJECT(""top"",""mult"",I(1))",SPEC("srcArrays",1,"ref"))
 D ASSERT("OBJECT(""top"",""mult"",I(1),""person"",""name"")",SPEC("srcRef"))
 K SPEC
 D FLDSPEC^VPRJCD("top.middle.terminal",.SPEC,"src")
 D ASSERT(0,$D(SPEC("srcArrays")))
 D ASSERT("OBJECT(""top"",""middle"",""terminal"")",SPEC("srcRef"))
 K SPEC
 D FLDSPEC^VPRJCD("top.mult[]",.SPEC,"src")
 D ASSERT("OBJECT(""top"",""mult"",I(1))",SPEC("srcRef"))
 K SPEC
 D FLDSPEC^VPRJCD("top[].middle[].bottom[].field",.SPEC,"tgt")
 D ASSERT(3,SPEC("tgtArrays"))
 D ASSERT("TARGET(""top"",I(1),""middle"",J)",SPEC("tgtArrays",2,"ref"))
 D ASSERT("TARGET(""top"",I(1),""middle"",I(2),""bottom"",J,""field"")",SPEC("tgtRef"))
 K SPEC
 D FLDSPEC^VPRJCD("top[].*",.SPEC,"src")
 D ASSERT(1,SPEC("merge"))
 D ASSERT("OBJECT(""top"",I(1))",SPEC("srcRef"))
 Q
FLDERR ;; @TEST field spec with errors
 N SPEC,ERRORS
 D FLDSPEC^VPRJCD("one.[].two",.SPEC,"src") D ASSERT(11,$D(ERRORS)) K ERRORS
 D FLDSPEC^VPRJCD("one[abc].two",.SPEC,"src") D ASSERT(11,$D(ERRORS)) K ERRORS
 D FLDSPEC^VPRJCD("one.",.SPEC,"src") D ASSERT(11,$D(ERRORS)) K ERRORS
 Q
BLDLINK ;; @TEST build linkage metadata
 N LINES,META,COLL
 S LINES=4
 S LINES(1)="test-multiple"
 S LINES(2)="  collections: testa,testb"
 S LINES(3)="  ref: items[].obj>items[].uid;summary"
 S LINES(4)="  rev: testItems"
 D BLDSPEC^VPRJCD("link",.LINES,.META,.COLL)
 D ASSERT(1,META("test-multiple","collection","testa",1,1,"srcMethod"))
 D ASSERT("uid",META("test-multiple","collection","testa",1,1,"srcPath",2))
 D ASSERT("items",META("test-multiple","collection","testa",1,"tgtPath",1))
 D ASSERT("summary",META("test-multiple","collection","testb",1,1,"srcTemplate"))
 D ASSERT("VALS(1,I(1))",META("test-multiple","collection","testb",1,"valRef"))
 D ASSERT("TARGET(""items"",J,""obj"")",META("test-multiple","collection","testb",1,"tgtRef"))
 D ASSERT(1,$D(COLL("testb","link","test-multiple")))
 Q
BLDIDX(TAG,STYLE,IDX) ;; return spec in IDX
 N I,X,LINES,SPEC,CLTN
 S I=0 F  S I=I+1,X=$P($T(@TAG+I),";;",2,99) Q:X="zzzzz"  S LINES(I)=X
 D BLDSPEC^VPRJCD("index:"_STYLE,.LINES,.SPEC,.CLTN)
 S X=$O(SPEC(""))
 M IDX=SPEC(X)
 Q
 ;
ATTR ;; @TEST setting up attribute index meta data
 ;;utest-attributes
 ;;    collections: utesta,utestb
 ;;    fields: products[].ingredientName/s, overallStop/V/0
 ;;    fields.utestb: ingredients[].product.name, current.datetime
 ;;    sort: overallStop desc
 ;;    setif: $$READY^MYFUN
 ;;    review:  $$CALCTM^MYFUN
 ;;zzzzz
 N SPEC
 D BLDIDX("ATTR","attr",.SPEC)
 D ASSERT("attr",SPEC("common","method"))
 D ASSERT(2,SPEC("common","alias","overallStop"))
 D ASSERT(2,SPEC("common","levels"))
 D ASSERT(1,SPEC("collection","utesta",1,1,"srcMethod"))
 D ASSERT(99,SPEC("collection","utestb",1,1,"srcMethod"))
 D ASSERT("ingredientName",SPEC("collection","utesta",1,1,"srcPath",2))
 D ASSERT("name",SPEC("collection","utestb",1,1,"srcPath",3))
 D ASSERT("OBJECT(""ingredients"",I(1))",SPEC("collection","utestb",1,1,"srcArrays",1,"ref"))
 D ASSERT("$$READY^MYFUN",SPEC("collection","utesta","setif"))
 D ASSERT("$$CALCTM^MYFUN",SPEC("collection","utestb","review"))
 D ASSERT("V",SPEC("collection","utestb",2,"collate"))
 Q
LIST ;; @TEST setting up list index meta data
 ;;utest-none
 ;;    collections: utest
 ;;    fields: <none>
 ;;zzzzz
 N SPEC
 D BLDIDX("LIST","attr",.SPEC)
 D ASSERT(0,SPEC("common","levels"))
 D ASSERT(0,$D(SPEC("collection","utest",1)))
 Q
TIME ;; @TEST setting up time index meta data
 ;;utest-time
 ;;    collections: utesta,utestb
 ;;    fields: start/V/0,stop/V/9
 ;;    fields.utesta: observed
 ;;    fields.utestb: overallStart, overallStop
 ;;    sort: observed desc
 ;;zzzzz
 N SPEC
 D BLDIDX("TIME","time",.SPEC)
 D ASSERT(1,SPEC("common","alias","start"))
 D ASSERT(2,SPEC("common","alias","stop"))
 D ASSERT("observed",SPEC("collection","utesta",1,1,"srcPath",1))
 D ASSERT("overallStart",SPEC("collection","utestb",1,1,"srcPath",1))
 D ASSERT(0,$D(SPEC("collection","utesta",2)))
 D ASSERT(10,$D(SPEC("collection","utestb",2)))
 Q
ATTRERR ;; @TEST setting up attribute index with errors
 ;;utest-attributes
 ;;    collections: utesta,utestb
 ;;    fields: products[].ingredientName/s, overallStop/V/0
 ;;    fields.utestb: ingredients[].product.name
 ;;zzzzz
 N SPEC
 D BLDIDX("ATTRERR","attr",.SPEC)
 D ASSERT(11,$D(SPEC("errors",1)))
 D ASSERT(1,SPEC("errors",1)["override")
 Q
BLDTLT(TAG,SPEC) ;; return SPEC for template
 N I,X,LINES,CLTN
 S I=0 F  S I=I+1,X=$P($T(@TAG+I),";;",2,99) Q:X="zzzzz"  S LINES(I)=X
 D BLDSPEC^VPRJCD("template",.LINES,.SPEC,.CLTN)
 Q
TLT1 ;; @TEST building template with instance
 ;;dose
 ;;  collections: med
 ;;  directives: include, applyOnSave
 ;;  fields: uid, qualifiedName, dose=dosages[#].dose, start=dosages[#].start, stop=dosages[#].stop
 ;;zzzzz
 N TLT
 D BLDTLT("TLT1",.TLT)
 D ASSERT(0,$D(TLT("errors")))
 D ASSERT("S",TLT("dose","collection","med",0,"applyOn"))
 D ASSERT(0,TLT("dose","collection","med",0,"exclude"))
 D ASSERT("dosages",TLT("dose","collection","med","start","srcArrayPath"))
 D ASSERT("TARGET(""stop"")",TLT("dose","collection","med","stop","tgtRef"))
 D ASSERT(0,TLT("dose","collection","med","stop","srcArrays",1,"dir"))
 Q
TLT2 ;; @TEST building template with erroneous list assignment
 ;;dose
 ;;  collections: med
 ;;  directives: include, applyOnSave
 ;;  fields: uid, dose=dosages[].dose
 ;;zzzzz
 N TLT
 D BLDTLT("TLT2",.TLT)
 D ASSERT(11,$D(TLT("errors","errors")))
 Q
TLT3 ;; @TEST building template with complex field names
 ;;test
 ;;  collections: testa, testb
 ;;  directives: include, applyOnQuery
 ;;  fields: uid, top.y=a.b[#].c.d, list[].y=a[].b.c, q.r.s[].t.v=a[].b, tree[].*=g[].*
 ;;  fields.testb: top.y=w
 ;;zzzzz
 N TLT
 D BLDTLT("TLT3",.TLT)
 D ASSERT(0,$D(TLT("errors")))
 D ASSERT(0,TLT("test","collection","testa","uid","assign"))
 D ASSERT(99,TLT("test","collection","testa","q.r.s[].t.v","assign"))
 D ASSERT("TARGET(""q"",""r"",""s"",J,""t"",""v"")",TLT("test","collection","testa","q.r.s[].t.v","tgtRef"))
 D ASSERT(21,TLT("test","collection","testa","tree[]","assign"))
 D ASSERT("TARGET(""tree"",J)",TLT("test","collection","testa","tree[]","tgtRef"))
 D ASSERT(0,TLT("test","collection","testa","top.y","srcArrays",1,"dir"))
 D ASSERT("OBJECT(""a"",""b"",I(1),""c"",""d"")",TLT("test","collection","testa","top.y","srcRef"))
 D ASSERT("OBJECT(""w"")",TLT("test","collection","testb","top.y","srcRef"))
 Q
TLT4 ;; @TEST building template with complex field names
 ;;test
 ;;  collections: testa
 ;;  directives: include, applyOnQuery
 ;;  fields: uid, top[].y=a.b[].c.d, a[].b=q.r.s[].t.v, list[]=g[].h.j[].k[].m
 ;;  fields.testb: top.y=w
 ;;zzzzz
 N TLT
 D BLDTLT("TLT4",.TLT)
 D ASSERT(0,$D(TLT("errors")))
 D ASSERT("OBJECT(""a"",""b"",I(1),""c"",""d"")",TLT("test","collection","testa","top[].y","srcRef"))
 D ASSERT("TARGET(""top"",J,""y"")",TLT("test","collection","testa","top[].y","tgtRef"))
 D ASSERT("OBJECT(""q"",""r"",""s"",I(1),""t"",""v"")",TLT("test","collection","testa","a[].b","srcRef"))
 D ASSERT("TARGET(""a"",J,""b"")",TLT("test","collection","testa","a[].b","tgtRef"))
 D ASSERT("OBJECT(""g"",I(1),""h"",""j"",I(2),""k"",I(3),""m"")",TLT("test","collection","testa","list[]","srcRef"))
 D ASSERT("TARGET(""list"",J)",TLT("test","collection","testa","list[]","tgtRef"))
 Q
TLT5 ;; @TEST building template with instances
 ;;test
 ;;  collections: testa
 ;;  directives: include, applyOnQuery
 ;;  fields: x=dosages[#].dose, y=dosages[#].units, a[#].b[#].c[#].d, z=q[#].r[#].s[#], list[]=dosages[].mult[#].fld
 ;;zzzzz
 N TLT
 D BLDTLT("TLT5",.TLT)
 D ASSERT(0,$D(TLT("errors")))
 ;W ! ZW TLT
 Q
