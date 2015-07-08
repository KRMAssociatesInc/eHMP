VPRJUCF ;SLC/KCM -- Unit tests for filter parameter
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
ERRPARS ;; @TEST erroneous input
 N CLAUSES,HTTPERR
 D PARSE^VPRJCF("eq(statusName,""ACTIVE",.CLAUSES) ; missing close quote
 D ASSERT(1,$D(HTTPERR))
 Q
FLDTYP ;; @TEST filter with various field types
 ;;eq("summary", 1) eq(facility.name, 2) eq("products[].ingredient", 3) eq("products[].ingredient.name", 4) eq(noquote, 0)
 ;;NOTE: fields with [] must be quoted
 N FILTER,CLAUSES
 S FILTER=$P($T(FLDTYP+1),";;",2,99)
 D PARSE^VPRJCF(FILTER,.CLAUSES)
 D ASSERT(1,CLAUSES(1,"type"))
 D ASSERT(2,CLAUSES(2,"type"))
 D ASSERT(3,CLAUSES(3,"type"))
 D ASSERT(4,CLAUSES(4,"type"))
 D ASSERT("summary",CLAUSES(1,"field"))
 D ASSERT("ingredient",CLAUSES(3,"field"))
 D ASSERT("products",CLAUSES(4,"mult"))
 D ASSERT("name",CLAUSES(4,"sub"))
 Q
CONJ ;; @TEST nested conjunctions
 ;;or( eq(tobe, 1) eq(notobe, 2) and(eq(unrelated, 3), eq(another, 4)))
 ;;eq(status,7) gt(observed,"2011") in("products[].code",[20,30,40]) or(eq(a,7) eq(b,8) lt(c,500)) and(eq(w,200) gt(x,7) eq(z,50)) eq(milk,"fresh") and(eq(h,1) eq(j,2))
 N FILTER,CLAUSES
 S FILTER=$P($T(CONJ+1),";;",2,99)
 D PARSE^VPRJCF(FILTER,.CLAUSES)
 D ASSERT(0,$D(HTTPERR))
 D ASSERT("tobe",CLAUSES(1,2,"field"))
 D ASSERT("and",CLAUSES(1,4))
 D ASSERT("another",CLAUSES(1,4,2,"field"))
 K CLAUSES
 S FILTER=$P($T(CONJ+2),";;",2,99)
 D PARSE^VPRJCF(FILTER,.CLAUSES)
 D ASSERT(0,$D(HTTPERR))
 D ASSERT(1,$D(CLAUSES(2,"asString")))
 Q
VALUES ;; @TEST types of values
 ;; eq(astr, "this is a string") gt(anum, 123) in(alist, ["alpha","beta","gamma"]) eq(funnyStr, "123")
 N FILTER,CLAUSES
 S FILTER=$P($T(VALUES+1),";;",2,99)
 D PARSE^VPRJCF(FILTER,.CLAUSES)
 D ASSERT("this is a string",CLAUSES(2,"value"))
 D ASSERT(123,+CLAUSES(3,"value"))
 D ASSERT(1,$D(CLAUSES(4,"list","gamma")))
 D ASSERT(1,$D(CLAUSES(5,"asString")))
 Q
MAKEPAT ;; @TEST converting SQL Like statements into M patterns
 N X,TV ; TV = test value -- to get around XINDEX problem
 S X=$$MAKEPAT^VPRJCF("%ing")
 D ASSERT(".E1""ing""",X)
 S TV="reindexing" D ASSERT(1,TV?@X)
 S TV="indexing" D ASSERT(1,TV?@X)
 S X=$$MAKEPAT^VPRJCF("re%ing")
 D ASSERT("1""re"".E1""ing""",X)
 S TV="reindexing" D ASSERT(1,TV?@X)
 S TV="indexing" D ASSERT(0,TV?@X)
 S X=$$MAKEPAT^VPRJCF("re%")
 D ASSERT("1""re"".E",X)
 S X=$$MAKEPAT^VPRJCF("%ING")
 D ASSERT(".E1""ING""",X)
 S TV="reindexing" D ASSERT(0,TV?@X)
 S X=$$MAKEPAT^VPRJCF("RE%")
 D ASSERT("1""RE"".E",X)
 S X=$$MAKEPAT^VPRJCF("%ING",1)
 D ASSERT(".E1""ing""",X)
 S X=$$MAKEPAT^VPRJCF("RE%",1)
 D ASSERT("1""re"".E",X)
 S TV="reindexing" D ASSERT(1,TV?@X)
 S TV="indexing" D ASSERT(0,TV?@X)
 S X=$$MAKEPAT^VPRJCF("%")
 D ASSERT(".E",X)
 S X=$$MAKEPAT^VPRJCF("REINDEXING",1)
 D ASSERT("1""reindexing""",X)
 S TV="reindexing" D ASSERT(1,TV?@X)
 S TV="indexing" D ASSERT(0,TV?@X)
 Q
