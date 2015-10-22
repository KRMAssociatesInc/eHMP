VPRJURSP ;SLC/KCM -- Unit tests for HTTP listener response handling
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
QSPLIT ;; @TEST splitting query parameters
 N QRY,HTTPERR
 S HTTPREQ("query")="range=20060101..20061231"
 D QSPLIT^VPRJRSP(.QRY)
 D ASSERT($D(QRY("range")),1)
 D ASSERT("20060101..20061231",QRY("range"))
 K QRY
 S HTTPREQ("query")="range=20060101..20061231&order=desc&limit=5"
 D QSPLIT^VPRJRSP(.QRY)
 D ASSERT("desc",QRY("order"))
 D ASSERT(5,QRY("limit"))
 Q
 ;
SETREQ(METHOD,URL) ; set up a request (to emulate HTTP call)
 S HTTPREQ("method")=METHOD
 S HTTPREQ("path")=$P(URL,"?")
 S HTTPREQ("query")=$P(URL,"?",2,999)
 Q
MATCH ;; @TEST matching for URLs
 N ROU,ARGS
 D SETREQ("GET","/vpr/48/urn:va:9E3C:229:med:33246") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("GETOBJ^VPRJPR",ROU)
 D ASSERT("urn:va:9E3C:229:med:33246",ARGS("uid"))
 D SETREQ("PUT","/vpr") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("PUTPT^VPRJPR",ROU)
 D ASSERT(0,$D(ARGS))
 D SETREQ("PUT","/vpr/42") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("PUTOBJ^VPRJPR",ROU)
 D ASSERT(42,ARGS("pid"))
 D SETREQ("GET","/vpr/42/index/med-outpt") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("INDEX^VPRJPR",ROU)
 D ASSERT(42,ARGS("pid"))
 D ASSERT("med-outpt",ARGS("indexName"))
 D SETREQ("GET","/vpr/42/index/med-outpt/simple") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("INDEX^VPRJPR",ROU)
 D ASSERT(42,ARGS("pid"))
 D ASSERT("med-outpt",ARGS("indexName"))
 D ASSERT("simple",ARGS("template"))
 D SETREQ("GET","/vpr/all/count/med-outpt") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("ALLCOUNT^VPRJPR",ROU)
 D ASSERT("med-outpt",ARGS("countName"))
 D SETREQ("DELETE","/vpr/42") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT("DELPT^VPRJPR",ROU)
 K HTTPREQ,HTTPERR
 Q
NOMATCH ;; @TEST error codes when no match found
 ;;GET vpr/{patient?1.N}/find/{collection} FIND^VPRJPR
 N ROU,ARGS
 D SETREQ("DELETE","/vpr/42/find/med") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT(405,HTTPERR)
 D ASSERT(0,$D(ARGS))
 D ASSERT("",ROU)
 D SETREQ("GET","vpr/42/bogus") D MATCH^VPRJRSP(.ROU,.ARGS)
 D ASSERT(404,HTTPERR)
 D ASSERT(0,$D(ARGS))
 D ASSERT("",ROU)
 K HTTPREQ,HTTPERR
 Q
