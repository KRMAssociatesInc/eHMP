VPRJTCF ;SLC/KCM -- Integration tests for query filters
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 K ^TMP("HTTPERR",$J)
 D BLDPT^VPRJTX
 D MOCK1
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 Q
MOCK1 ; Create mock data to test filter against
 N PID,UID
 S PID=VPRJTPID,UID="urn:va:test:93EF:-7:1"
 S ^VPRPT(PID,UID,"999","topValue")=1
 S ^VPRPT(PID,UID,"999","strValue")="quick brown fox"
 S ^VPRPT(PID,UID,"999","valueA")="red"
 S ^VPRPT(PID,UID,"999","result")=7.6
 S ^VPRPT(PID,UID,"999","observed")=20110919
 S ^VPRPT(PID,UID,"999","facility","name")="VAMC"
 S ^VPRPT(PID,UID,"999","products",1,"ingredient")="aspirin"
 S ^VPRPT(PID,UID,"999","products",2,"ingredient")="codeine"
 S ^VPRPT(PID,UID,"999","orders",1,"clinician","name")="Welby"
 S ^VPRPT(PID,UID,"999","stampTime")=999
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
EVAL(LINE) ; return evaluation of statement
 N PID,UID,STMT,CLAUSES,HTTPERR
 S STMT=$P($T(@LINE),";;",2,99)
 D PARSE^VPRJCF(STMT,.CLAUSES)
 D ASSERT(0,$D(HTTPERR),"HTTP error:"_$G(HTTPERR))
 S PID=VPRJTPID,UID="urn:va:test:93EF:-7:1"
 K HTTPERR
 Q $$EVALAND^VPRJCF(.CLAUSES,UID)
 D ASSERT(0,$D(HTTPERR),"HTTP error:"_$G(HTTPERR))
 ;
SIMPLE ;; @TEST simple match
 ;; eq(topValue,1)
 ;; eq(topValue,42)
 ;; eq(missingValue,27)
 ;; eq("products[].ingredient","codeine")
 ;; eq("products[].ingredient","acetaminphen")
 ;; eq("facility.name","VAMC")
 ;; eq("facility.name","other")
 D ASSERT(1,$$EVAL("SIMPLE+1"))
 D ASSERT(0,$$EVAL("SIMPLE+2"))
 D ASSERT(0,$$EVAL("SIMPLE+3"))
 D ASSERT(1,$$EVAL("SIMPLE+4"))
 D ASSERT(0,$$EVAL("SIMPLE+5"))
 D ASSERT(1,$$EVAL("SIMPLE+6"))
 D ASSERT(0,$$EVAL("SIMPLE+7"))
 Q
FLTAND ;; @TEST filter with ands
 ;; eq(topValue,1) eq(strValue,"quick brown fox")
 ;; eq(topValue,1) eq(strValue,"wrong")
 ;; ne(topValue,2) eq("products[].ingredient","aspirin")
 ;; eq(topValue,1) ne("products[].ingredient","acetaminophen")
 ;; eq(topValue,1) eq("products[].ingredient","acetaminophen")
 D ASSERT(1,$$EVAL("FLTAND+1"))
 D ASSERT(0,$$EVAL("FLTAND+2"))
 D ASSERT(1,$$EVAL("FLTAND+3"))
 D ASSERT(1,$$EVAL("FLTAND+4"))
 D ASSERT(0,$$EVAL("FLTAND+5"))
 Q
FLTOR ;; @TEST filter with or's
 ;; eq(topValue,1) or(eq(valueA,"red") eq(valueA,"green"))
 ;; eq(topValue,1) or(eq(valueA,"blue") eq(valueA,"yellow"))
 ;; eq(topValue,1) or{eq(valueA,"red") eq(valueA,"green")}
 D ASSERT(1,$$EVAL("FLTOR+1"))
 D ASSERT(0,$$EVAL("FLTOR+2"))
 D ASSERT(1,$$EVAL("FLTOR+3"))
 Q
FLTNOT ;; @TEST filter with not's
 ;; eq(topValue,1) not(eq(valueA,"yellow") eq(valueA,"green") eq(valueA,"blue"))
 ;; eq(topValue,1) not(eq(valueA,"red") eq(valueA,"green") eq(valueA,"blue"))
 ;; eq(topValue,1) not{eq(valueA,"red") eq(valueA,"green") eq(valueA,"blue")}
 D ASSERT(1,$$EVAL("FLTNOT+1"))
 D ASSERT(0,$$EVAL("FLTNOT+2"))
 D ASSERT(0,$$EVAL("FLTNOT+3"))
 Q
FLTIN ;; @TEST filter in property
 ;; in(valueA,["red","green","blue"])
 ;; in(valueA,["orange","banana","peach"])
 D ASSERT(1,$$EVAL("FLTIN+1"))
 D ASSERT(0,$$EVAL("FLTIN+2"))
 Q
FLTNIN ;; @TEST filter not in array
 ;; nin(valueA,["red","green","blue"])
 ;; nin(valueA,["orange","banana","peach"])
 ;; nin("products[].ingredient",["acetiminophen","ibuprofin"])
 ;; nin("products[].ingredient",["aspirin","codeine"])
 D ASSERT(0,$$EVAL("FLTNIN+1"))
 D ASSERT(1,$$EVAL("FLTNIN+2"))
 D ASSERT(1,$$EVAL("FLTNIN+3"))
 D ASSERT(0,$$EVAL("FLTNIN+4"))
 Q
FLTGTLT ;; @TEST filter gt and lt (value of result is 7.6)
 ;; gt(result,7.0)
 ;; gt(result,8)
 ;; gte(result,7.5)
 ;; gte(result,7.6)
 ;; gte(result,7.7)
 ;; lt(result,8)
 ;; lte(result,6)
 ;; lte(result,7.6)
 ;; lte(result,7.5)
 ;; lt(result,5)
 D ASSERT(1,$$EVAL("FLTGTLT+1"))
 D ASSERT(0,$$EVAL("FLTGTLT+2"))
 D ASSERT(1,$$EVAL("FLTGTLT+3"))
 D ASSERT(1,$$EVAL("FLTGTLT+4"))
 D ASSERT(0,$$EVAL("FLTGTLT+5"))
 D ASSERT(1,$$EVAL("FLTGTLT+6"))
 D ASSERT(0,$$EVAL("FLTGTLT+7"))
 D ASSERT(1,$$EVAL("FLTGTLT+8"))
 D ASSERT(0,$$EVAL("FLTGTLT+9"))
 D ASSERT(0,$$EVAL("FLTGTLT+10"))
 Q
FLTGTLTS ;; @TEST filter gt and lt with strings
 ;; gt(valueA,"blue")
 ;; gt(valueA,"TAN")
 ;; gte(valueA,"record")
 ;; gte(valueA,"red")
 ;; gte(valueA,"reddish")
 ;; lt(valueA,"TAN")
 ;; lte(valueA,"reddish")
 ;; lte(valueA,"red")
 ;; lte(valueA,"blue")
 ;; lt(valueA,"brown")
 D ASSERT(1,$$EVAL("FLTGTLTS+1"))
 D ASSERT(1,$$EVAL("FLTGTLTS+2")) ; lowercase sorts after upper
 D ASSERT(1,$$EVAL("FLTGTLTS+3"))
 D ASSERT(1,$$EVAL("FLTGTLTS+4"))
 D ASSERT(0,$$EVAL("FLTGTLTS+5"))
 D ASSERT(0,$$EVAL("FLTGTLTS+6")) ; uppercase is less than lowercase
 D ASSERT(1,$$EVAL("FLTGTLTS+7"))
 D ASSERT(1,$$EVAL("FLTGTLTS+8"))
 D ASSERT(0,$$EVAL("FLTGTLTS+9"))
 D ASSERT(0,$$EVAL("FLTGTLTS+10"))
 Q
FLTWEEN ;; @TEST between for numerics
 ;; between(result,7,8)
 ;; between(result,6,7)
 ;; between(result,8,9)
 D ASSERT(1,$$EVAL("FLTWEEN+1"))
 D ASSERT(0,$$EVAL("FLTWEEN+2"))
 D ASSERT(0,$$EVAL("FLTWEEN+3"))
 Q
FLTWEENS ;; @TEST between for strings
 ;; between(valueA,"rat","rot")
 ;; between(valueA,"RAT","ROT")
 ;; between(valueA,"reddish","tan")
 D ASSERT(1,$$EVAL("FLTWEENS+1"))
 D ASSERT(0,$$EVAL("FLTWEENS+2"))
 D ASSERT(0,$$EVAL("FLTWEENS+3"))
 Q
FLTLIKE ;; @TEST like for strings
 ;; like(strValue,"%brown%")
 ;; like(strValue,"%red%")
 ;; like(strValue,"%fox")
 ;; like("products[].ingredient","asp%")
 ;; like("products[].ingredient","ace%")
 ;; like("products[].ingredient","%C%")
 D ASSERT(1,$$EVAL("FLTLIKE+1"))
 D ASSERT(0,$$EVAL("FLTLIKE+2"))
 D ASSERT(1,$$EVAL("FLTLIKE+3"))
 D ASSERT(1,$$EVAL("FLTLIKE+4"))
 D ASSERT(0,$$EVAL("FLTLIKE+5"))
 D ASSERT(0,$$EVAL("FLTLIKE+5"))
 Q
FLTILIKE ;; @TEST ilike (case insensitive) for string
 ;; ilike("products[].ingredient","ACE%")
 ;; ilike("products[].ingredient","%C%")
 D ASSERT(0,$$EVAL("FLTILIKE+1"))
 D ASSERT(1,$$EVAL("FLTILIKE+2"))
 Q
FLTEXIST ;; @TEST exist for values
 ;; exists(result)
 ;; exists(absent)
 ;; exists("orders[].clinician.name")
 ;; exists(absent,false)
 D ASSERT(1,$$EVAL("FLTEXIST+1"))
 D ASSERT(0,$$EVAL("FLTEXIST+2"))
 D ASSERT(1,$$EVAL("FLTEXIST+3"))
 D ASSERT(1,$$EVAL("FLTEXIST+4"))
 Q
FLTDATES ;; @TEST dates represented as strings
 ;; between(observed,"2008","2012")
 ;; lt(observed,"201110")
 ;; gte(observed,"20110919")
 ;; lt(observed,"20080919103426")
 D ASSERT(1,$$EVAL("FLTDATES+1"))
 D ASSERT(1,$$EVAL("FLTDATES+2"))
 D ASSERT(1,$$EVAL("FLTDATES+3"))
 D ASSERT(0,$$EVAL("FLTDATES+4"))
 Q
