VPRJDR ;SLC/KCM -- Handle RESTful operations for data objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
PUTOBJ(ARGS,BODY) ; PUTs an object into the database
 Q "/data/"_$$SAVE^VPRJDS(.BODY)
 ;
NEWOBJ(ARGS,BODY) ; PUTs an object into the database, returning UID
 N OBJECT,ERR,UID,CTN
 S CTN=ARGS("collectionName")
 I '$L(CTN) D SETERROR^VPRJRER(215) QUIT ""
 D DECODE^VPRJSON("BODY","OBJECT","ERR") I $D(ERR) D SETERROR^VPRJRER(202) QUIT ""
 I $G(OBJECT("uid"))="" S OBJECT("uid")=$$BLDUID(CTN) I '$L(OBJECT("uid")) QUIT ""
 K BODY
 D ENCODE^VPRJSON("OBJECT","BODY","ERR") I $D(ERR) D SETERROR^VPRJRER(202) QUIT ""
 Q "/data/"_$$SAVE^VPRJDS(.BODY)
 ;
BLDUID(CTN) ; build the uid for a new item in a collection
 N UID
 I '$L(CTN) Q ""
 L +^VPRJD("COLLECTION",CTN):2 E  D SETERROR^VPRJRER(502) Q ""
 S UID=$G(^VPRJD("COLLECTION",CTN))+1,^VPRJD("COLLECTION",CTN)=UID
 L -^VPRJD("COLLECTION",CTN)
 Q "urn:va:"_CTN_":"_$G(^VPRMETA("system"))_":"_UID
 ;
GETOBJ(RESULT,ARGS) ; gets an object given a UID
 I $$UNKARGS^VPRJCU(.ARGS,"uid,template") Q
 D QKEY^VPRJDQ($G(ARGS("uid")),$G(ARGS("template")))
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
INDEX(RESULT,ARGS) ; GET for objects by index
 I $$UNKARGS^VPRJCU(.ARGS,"indexName,range,order,bail,template,filter,start") Q
 N INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER
 S INDEX=$G(ARGS("indexName"))
 S RANGE=$G(ARGS("range"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 I '$D(^VPRMETA("index",INDEX)) D SETERROR^VPRJRER(102,INDEX) Q
 ;
 ; check to see if we can return a cached result
 N HASHSTR,HASHTS,HASH S (HASHSTR,HASHTS,HASH)=""
 S HASHSTR="data/index/"_INDEX_"/"_RANGE_"/"_ORDER_"/"_TEMPLATE_"/"_FILTER
 I $$CACHED(INDEX,HASHSTR,.HASH,.HASHTS) D  Q
 . S RESULT=$NA(^VPRTMP(HASH)),RESULT("pageable")=""
 ;
 ; otherwise prepare cache and do the regular query
 S ^TMP($J,"query")=HASHSTR,^TMP($J,"timestamp")=HASHTS
 S ^TMP($J,"index")=INDEX,^TMP($J,"hash")=HASH
 D QINDEX^VPRJDQ(INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
CACHED(INDEX,HASHSTR,HASH,HASHTS) ; return TRUE if query cached and the cache is current
 ; .HASH returns the hashed value of HASHSTR
 ; .HASHTS returns the current $H of the index used
 Q 0 ; Bypass caching CJE 02/02/2015
 Q:'$L(INDEX) 0
 N MTHD
 S MTHD=$G(^VPRMETA("index",INDEX,"common","method"))
 S HASHTS=$G(^VPRJDX(MTHD,INDEX))
 S HASH=$$HASH^VPRJRUT(HASHSTR)
 ; KRM/CJE - Begin Mod
 ; If it is the status-pt index never use cached data
 ; This can cause issues if the sync status is updated in the same second due to $H resolution
 I INDEX="status-pt" Q 0
 ; KRM/CJE - End Mod
 I '$D(^VPRTMP(HASH,"query"))!'$D(^VPRTMP(HASH,"timestamp")) Q 0  ; no cached data
 I ^VPRTMP(HASH,"query")'=HASHSTR Q 0    ; hash matched, but not original string
 I ^VPRTMP(HASH,"timestamp")=HASHTS Q 1  ; timestamps match, quit true
 Q 0                                     ; default to no cached data
 ;
LAST(RESULT,ARGS) ; GET for objects by index
 I $$UNKARGS^VPRJCU(.ARGS,"indexName,range,order,bail,template,filter") Q
 N INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER
 S INDEX=$G(ARGS("indexName"))
 S RANGE=$G(ARGS("range"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 D QLAST^VPRJDQ(INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
FIND(RESULT,ARGS) ; GET for objects using 'where' criteria
 I $$UNKARGS^VPRJCU(.ARGS,"collection,order,bail,template,filter") Q
 N COLL,ORDER,BAIL,TEMPLATE,FILTER
 S COLL=$G(ARGS("collection"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 D QFIND^VPRJDQ(COLL,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
ALLCOUNT(RESULT,ARGS) ; GET for count of objects across patients
 I $$UNKARGS^VPRJCU(.ARGS,"countName") Q
 D QCOUNT^VPRJDQ(ARGS("countName"))
 S RESULT=$NA(^TMP($J))
 Q
COUNT(RESULT,ARGS) ; GET for count of domain objects
 I $$UNKARGS^VPRJCU(.ARGS,"countName") Q
 D QTALLY^VPRJDQ(ARGS("countName"))
 S RESULT=$NA(^TMP($J))
 Q
DELUID(RESULT,ARGS) ; DELETE an object
 I $$UNKARGS^VPRJCU(.ARGS,"uid") Q
 D DELETE^VPRJDS(ARGS("uid"))
 S RESULT=$NA(^TMP($J))
 Q
DELCTN(RESULT,ARGS) ; DELETE an entire collection
 I $$UNKARGS^VPRJCU(.ARGS,"collectionName,system") Q
 D DELCTN^VPRJDS(ARGS("collectionName"),$G(ARGS("system")))
 S RESULT=$NA(^TMP($J))
 Q
DELSITE(RESULT,ARGS) ; DELETE an entire site
 I $$UNKARGS^VPRJCU(.ARGS,"site") Q
 D DELSITE^VPRJDS(ARGS("site"))
 S RESULT=$NA(^TMP($J))
 Q
DELALL(RESULT,ARGS) ; DELETE the entire non-patient data store
 I $$UNKARGS^VPRJCU(.ARGS,"confirm") Q
 I $G(ARGS("confirm"))'="true" D SETERROR^VPRJRER(405) Q
 D KILLDB^VPRJ2D
 S RESULT=""
 Q
