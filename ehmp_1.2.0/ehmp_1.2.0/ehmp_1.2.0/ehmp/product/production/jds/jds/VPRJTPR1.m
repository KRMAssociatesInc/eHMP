VPRJTPR1 ;SLC/KCM -- Integration tests for RESTful paging
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 Q
SETUP    ; Run before each test
 K HTTPREQ,HTTPERR,HTTPRSP
 Q
TEARDOWN ; Run after each test
 K HTTPREQ,HTTPERR,HTTPRSP
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
PAGE1 ;; @TEST query for first page
 N JSON,HTTPERR,HASH,VPRJTPID1
 S VPRJTPID1=$$JPID4PID^VPRJPR(VPRJTPID)
 ; Remove Caching support
 ;S HASH=$$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/medication////")
 ;D ASSERT(0,$D(^VPRTMP(HASH)))
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?start=0&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(2,$G(JSON("data","currentItemCount")))
 D ASSERT(5,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:17203",$G(JSON("data","items",2,"uid")))
 ; Remove Caching support
 ;S HASH=$$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/medication////")
 ;D ASSERT(10,$D(^VPRTMP(HASH)))
 Q
PAGE3 ;; @TEST query for last page
 N JSON,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?start=4&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","currentItemCount")))
 D ASSERT(5,$G(JSON("data","totalItems")))
 D ASSERT(4,$G(JSON("data","startIndex")))
 D ASSERT("urn:va:med:93EF:-7:18068",$G(JSON("data","items",1,"uid")))
 Q
PAGECHG ;; @TEST query when page changed
 W "(pause 1 sec)" H 1 ; wait long enough for the second to change
 N JSON,HTTPERR,HASH,VPRJTPID1
 S VPRJTPID1=$$JPID4PID^VPRJPR(VPRJTPID)
 S HASH=$$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/medication////")
 ; Check to ensure JSON response contains 5 items
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?start=0&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(5,$G(JSON("data","totalItems")),"JSON response did not contain correct number of total items")
 ;D ASSERT(5,$G(^VPRTMP(HASH,"total")),"^VPRTMP(HASH) did not contain correct number of total items")
 ; Add another item
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT("/vpr/"_VPRJTPID1_"/urn:va:med:93EF:-7:15231",HTTPREQ("location"))
 ; Check to ensure JSON response contains 6 items
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?start=0&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,$G(JSON("data","totalItems")),"JSON response did not contain correct number of total items")
 ;D ASSERT(6,$G(^VPRTMP(HASH,"total")),"^VPRTMP(HASH) did not contain correct number of total items")
 Q
LIMIT1 ;; @TEST query when order changed and want only 1 item
 N JSON,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication?order=overallStart asc&limit=1")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","currentItemCount")))
 D ASSERT(0,$G(JSON("data","startIndex")))
 D ASSERT("urn:va:med:93EF:-7:18068",$G(JSON("data","items",1,"uid")))
 Q
TEMPLATE ;; @TEST query using template
 N JSON,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication/uid?start=2&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("uid",$O(JSON("data","items",1,"")))
 D ASSERT("uid",$O(JSON("data","items",2,"")))
 D ASSERT(2,$G(JSON("data","currentItemCount")))
 D ASSERT(1,$G(JSON("data","pageIndex")))
 Q
SUMMTLT ;; @TEST query using summary template
 N JSON,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication/summary?start=2&limit=2")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("Camp Master",$G(JSON("data","items",1,"facilityName")))
 D ASSERT("not active",$G(JSON("data","items",1,"medStatusName")))
 D ASSERT(2,$G(JSON("data","currentItemCount")))
 D ASSERT(1,$G(JSON("data","pageIndex")))
 Q
NOLIMIT ;; @TEST query when no paging is requested
 N JSON,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/medication/uid")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("uid",$O(JSON("data","items",1,"")))
 D ASSERT("uid",$O(JSON("data","items",2,"")))
 D ASSERT(6,$G(JSON("data","currentItemCount")))
 D ASSERT(0,$D(JSON("data","pageIndex")))
 Q
