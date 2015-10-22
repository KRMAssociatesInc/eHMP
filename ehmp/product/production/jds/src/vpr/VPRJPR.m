VPRJPR ;SLC/KCM -- Handle RESTful operations for patient objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
PUTPT(ARGS,BODY) ; PUTs patient demographics into the database
 N DEMOG,ERR,JPID,PID
 D DECODE^VPRJSON("BODY","DEMOG","ERR") I $D(ERR) D SETERROR^VPRJRER(202) QUIT ""
 I '$D(^VPRPTJ("JPID",$G(DEMOG("pid")))) D SETERROR^VPRJRER(224) QUIT ""
 I $G(DEMOG("uid"))="" D SETERROR^VPRJRER(211) QUIT ""
 S JPID=$$UPDPT(.DEMOG) I '$L(JPID) QUIT ""
 S PID=$G(DEMOG("pid"))
 K BODY
 D ENCODE^VPRJSON("DEMOG","BODY","ERR") I $D(ERR) D SETERROR^VPRJRER(202) QUIT ""
 Q "/vpr/"_PID_"/"_$$SAVE^VPRJPS(JPID,.BODY)
 ;
UPDPT(PD,JPID) ; updates JPID indexes, returns JPID
 ; TODO -- just make sure that
 ;         the demographics object is parsed for ICN & added or updated if necessary
 ;         the patient count is updated if we are adding the patient
 ;         the proper pid is returned
 ;  .PD: patient demographics object (decoded JSON)
 ; JPID: optional, passed in if known, empty for new patient
 N UID,PID,ICN,NEWPID
 ; uid is required to exist
 S UID=$G(PD("uid")) I '$L("uid") D SETERROR^VPRJRER(207) Q ""
 ; Ensure JPID variable exists
 S JPID=$G(JPID)
 ;
 ; Check to see if we have a JPID for the given data
 ; Try using the pid (it should always exist)
 I '$L(JPID) S JPID=$$JPID4PID($G(PD("pid")))
 ; Try using the icn to get a JPID
 I '$L(JPID) S JPID=$$JPID4PID($G(PD("icn")))
 ; If JPID is still null it is a new patient
 I '$L(JPID) S NEWPID=1
 ;
 ; Retrieve the PID and ICN from the patient demographics
 S PID=$G(PD("pid"))
 S ICN=$G(PD("icn"))
 ;
 ; If an ICN exists ensure it passes basic validation checks
 I '$G(NEWPID),ICN'="" I $$CHKCONFLICT(JPID,ICN) Q ""
 I '$G(NEWPID),PID'="" I $$CHKCONFLICT(JPID,PID) Q ""
 ;
 ; Update the indexes
 L +^VPRPTJ("JPID"):2 E  D SETERROR^VPRJRER(502) Q ""
 ; Update the Patient count index if it is a new patient
 I $G(NEWPID) D
 . ; Generate a JPID for the new patient
 . S JPID=$$JPID
 ; Add patient to JPID index
 TSTART
 ; Set the JPID Indexes for the given pid and icn
 I $L(PID) D JPIDIDX(JPID,PID)
 I $L(ICN) D JPIDIDX(JPID,ICN)
 TCOMMIT
 L -^VPRPTJ("JPID")
 Q JPID
 ;
NXTPID() ; Return the next available generated PID
 N PID
 L +^VPRPTJ("PID"):2 E  D SETERROR^VPRJRER(502) Q ""
 S ^VPRPTJ("PID")=$G(^VPRPTJ("PID"))+1,PID=";"_^VPRPTJ("PID")
 L -^VPRPTJ("PID")
 Q PID
 ;
DFN4OBJ(OBJNM) ; Return DFN given object named in OBJNM
 Q $TR($P($G(@OBJNM@("uid")),":",4,5),":",";")
 ;
ICN4OBJ(OBJNM) ; Return ICN given object named in OBJNM
 Q $P($G(@OBJNM@("icn")),"V") ; strip off checksum
 ;
ICV4OBJ(OBJNM) ; Return full ICN (with checksum) from OBJNM
 Q $G(@OBJNM@("icn"))
 ;
PID(ARGS) ; Returns a JPID for PID
 I '$L($G(ARGS("pid"))) D SETERROR^VPRJRER(211) Q ""
 N PID,I,X
 S PID=""
 F I=1:1:$L(ARGS("pid"),",") S X=$P(ARGS("pid"),",",I) D
 . I $G(X)[":" S X=$TR(X,":",";")
 . S X=$G(^VPRPTJ("JPID",$G(X,0)))
 . S PID=PID_$S($L(PID):",",1:"")_X
 I '$L(PID) D SETERROR^VPRJRER(211)
 Q PID
 ;
GETPT(RESULT,ARGS) ; Returns patient demographics
 ; Requirements
 ; If PID=ICN/ICV return all demographics from sites
 ; If PID=SITE;DFN return demographics from given site
 ; We require pid, icndfn, and template
 I $$UNKARGS^VPRJCU(.ARGS,"pid,icndfn,template") Q
 ; Data is stored according to the master PID aka icndfn
 I $L($G(ARGS("icndfn"))) S ARGS("pid")=ARGS("icndfn")
 ; set the icndfn to the pid if icndfn doesn't exist
 I '$L($G(ARGS("icndfn"))) S ARGS("icndfn")=ARGS("pid")
 N UID,PID,JPID
 ; Are we given an ICN?
 I $G(ARGS("icndfn"))'[";" D ; All PIDs contain a ";"
 . ; We need to get the JPID so we can see all associations with the given ICN
 . S JPID=$$JPID4PID(ARGS("icndfn"))
 . I JPID="" D SETERROR^VPRJRER(224,"Identifier "_$G(ARGS("icndfn"))) Q
 . S PID=""
 . F  S PID=$O(^VPRPTJ("JPID",JPID,PID)) Q:PID=""  D
 . . ; If the PID is an ICN skip it
 . . I PID'[";" Q
 . . ; Create a UID
 . . S UID="urn:va:patient:"_$P(PID,";",1)_":"_$P(PID,";",2)_":"_$P(PID,";",2)
 . . ; Check to see if the demographics exist before getting them
 . . I '$D(^VPRPTJ("JSON",PID,UID)) I '$D(^VPRPT(PID,UID)) Q
 . . ; Add demographics to result
 . . D QKEY^VPRJPQ(PID,UID)
 E  D
 . ; We are a PID get the requested demographic objects
 . ; Attempt to get the demographic object directly, If not found error
 . ; Format of ^VPRPT(PID): ^VPRPT(PID,"urn:va:patient:site:DFN:DFN")
 . ; Set the PID to the icndfn, which is what is passed in
 . S PID=$G(ARGS("icndfn"))
 . S UID="urn:va:patient:"_$TR(PID,";",":")_":"_$P(PID,";",2)
 . ; Check to see if the demographics exist before getting them
 . I '$D(^VPRPTJ("JSON",PID)) I '$D(^VPRPT(PID,UID)) D SETERROR^VPRJRER(225,"Identifier "_PID) Q
 . ; Add demographics to result
 . D QKEY^VPRJPQ(PID,UID)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
PUTOBJ(ARGS,BODY) ; PUTs an object for a patient into the database
 N PID S PID=$$PID(.ARGS) Q:'$L(PID) ""
 Q "/vpr/"_PID_"/"_$$SAVE^VPRJPS(PID,.BODY)
 ;
GETOBJ(RESULT,ARGS) ; gets an object given a UID
 I $$UNKARGS^VPRJCU(.ARGS,"pid,uid,template") Q
 I '$L(ARGS("uid")) D SETERROR^VPRJRER(207) Q
 ; Get the list of patient identifiers
 N ID,PID,PIDS,JPID
 S PID=""
 S ID=""
 N TEMPLATE S TEMPLATE=$G(ARGS("template"))
 S JPID=$$JPID4PID(ARGS("pid")) ; Get JPID based on passed PID
 D PID4JPID(.PIDS,JPID) ; Get all associations for the JPID
 ; Loop through all patient identifiers and ensure patient identifier is associated with the UID
 ; If patient identifier is not associated quit without returning the object
 F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . F  S PID=$O(^VPRPTJ("KEY",ARGS("uid"),PID)) Q:PID=""  D
 . . ; Now actually get the data requested
 . . I PIDS(ID)=PID D QKEY^VPRJPQ(PID,$G(ARGS("uid")),TEMPLATE)
 ; If the data isn't set in the loop we know the key won't exist
 ; Return the message clients expect based on prior behavior (Bad Key)
 I '$D(^TMP($J)) D SETERROR^VPRJRER(104,"Pid:"_ARGS("pid")_" Key:"_ARGS("uid")) Q
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
 ;
GETUID(RESULT,ARGS) ; gets an object given a UID only (no PID)
 I $$UNKARGS^VPRJCU(.ARGS,"uid,template") Q
 I '$L(ARGS("uid")) D SETERROR^VPRJRER(207) Q
 N PIDS D PID4UID(.PIDS,ARGS("uid"))
 I '($D(PIDS)\10) D SETERROR^VPRJRER(203) Q
 N TEMPLATE S TEMPLATE=$G(ARGS("template"))
 N PID S PID=""
 F  S PID=$O(PIDS(PID)) Q:PID=""  D
 . D QKEY^VPRJPQ(PIDS(PID),ARGS("uid"),TEMPLATE)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
INDEX(RESULT,ARGS) ; GET for objects by index
 I $$UNKARGS^VPRJCU(.ARGS,"pid,indexName,range,order,bail,template,filter") Q
 N PID,PIDS,ID,INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER,IDXPID
 S PID=$$PID(.ARGS) Q:'$L(PID)
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
 S HASHSTR="vpr/index/"_PID_"/"_INDEX_"/"_RANGE_"/"_ORDER_"/"_TEMPLATE_"/"_FILTER
 I $$CACHED(PID,INDEX,HASHSTR,.HASH,.HASHTS) D  Q
 . S RESULT=$NA(^VPRTMP(HASH)),RESULT("pageable")=""
 ;
 ; otherwise prepare cache and do the regular query
 ; ^TMP($J) is killed at the beginning of each request in VPRJREQ
 S ^TMP($J,"query")=HASHSTR,^TMP($J,"timestamp")=HASHTS
 S ^TMP($J,"pid")=PID,^TMP($J,"index")=INDEX,^TMP($J,"hash")=HASH
 S ^TMP($J,"template")=TEMPLATE,^TMP($J,"total")=0
 ; original line
 ;F IDXPID=1:1:$L(PID,",") D QINDEX^VPRJPQ($P(PID,",",IDXPID),INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 ; Deal with multiple pid syntax
 F IDXPID=1:1:$L(PID,",") D
 . D QINDEX^VPRJPQ($P(PID,",",IDXPID),INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
CACHED(PID,INDEX,HASHSTR,HASH,HASHTS) ; return TRUE if query cached and the cache is current
 ; .HASH returns the hashed value of HASHSTR
 ; .HASHTS returns the current $H of the index used
 Q 0 ; Bypass caching CJE 01/13/2015
 ; Quit if Index or PID are null. Also quit if we have multiple PID syntax (can't cache that)
 Q:'$L(INDEX) 0  Q:'$L(PID) 0  Q:(PID[",") 0
 ; Convert JPID TO PID
 ; RPID is real PID
 ;N PIDS,ID,CNT,RPID
 ;I $$ISJPID(PID) D PID4JPID(.PIDS,PID)
 ;S ID="",CNT=0
 ;F  S ID=$O(PIDS(ID)) Q:ID=""  D
 ;. I $$ISPID(PIDS(ID)) S CNT=CNT+1 S RPID=PIDS(ID)
 ; Ensure we only have one PID as cross patient isn't supported
 ;Q:CNT>1 0
 N MTHD
 S MTHD=$G(^VPRMETA("index",INDEX,"common","method")) Q:'$L(MTHD) 0
 S HASHTS=$G(^VPRPTI(PID,MTHD,INDEX))
 S HASH=$$HASH^VPRJRUT(HASHSTR)
 I '$D(^VPRTMP(HASH,"query"))!'$D(^VPRTMP(HASH,"timestamp")) Q 0  ; no cached data
 I ^VPRTMP(HASH,"query")'=HASHSTR Q 0    ; hash matched, but not original string
 I ^VPRTMP(HASH,"timestamp")=HASHTS Q 1  ; timestamps match, quit true
 Q 0                                     ; default to no cached data
 ;
LAST(RESULT,ARGS) ; GET for objects by index
 I $$UNKARGS^VPRJCU(.ARGS,"pid,indexName,range,order,bail,template,filter") Q
 N PID,PIDS,ID,INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER,IDXPID
 S PID=$$PID(.ARGS) Q:'$L(PID)
 S INDEX=$G(ARGS("indexName"))
 S RANGE=$G(ARGS("range"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 ; Original line
 ;F IDXPID=1:1:$L(PID,",") D QLAST^VPRJPQ($P(PID,",",IDXPID),INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 ; Deal with multiple pid syntax
 F IDXPID=1:1:$L(PID,",") D
 . D QLAST^VPRJPQ($P(PID,",",IDXPID),INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
FIND(RESULT,ARGS) ; GET for objects using 'where' criteria
 I $$UNKARGS^VPRJCU(.ARGS,"pid,collection,order,bail,template,filter") Q
 N PID,PIDS,ID,COLL,ORDER,BAIL,TEMPLATE,FILTER,IDXPID
 S PID=$$PID(.ARGS) Q:'$L(PID)
 S COLL=$G(ARGS("collection"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 ; Original line
 ;F IDXPID=1:1:$L(PID,",") D QFIND^VPRJPQ($P(PID,",",IDXPID),COLL,ORDER,BAIL,TEMPLATE,FILTER)
 ; Deal with multiple pid syntax
 F IDXPID=1:1:$L(PID,",") D
 . D QFIND^VPRJPQ($P(PID,",",IDXPID),COLL,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
COUNT(RESULT,ARGS) ; GET for count of domain objects
 I $$UNKARGS^VPRJCU(.ARGS,"pid,countName") Q
 N PID S PID=$$PID(.ARGS) Q:'$L(PID)
 D QTALLY^VPRJPQ(PID,ARGS("countName"))
 S RESULT=$NA(^TMP($J))
 Q
ALLCOUNT(RESULT,ARGS) ; GET for count of objects across patients
 I $$UNKARGS^VPRJCU(.ARGS,"countName") Q
 D QCOUNT^VPRJAQ(ARGS("countName"))
 S RESULT=$NA(^TMP($J))
 Q
ALLPID(RESULT,ARGS) ; GET all PID's
 I $$UNKARGS^VPRJCU(.ARGS,"indexName,template") Q
 D QPID^VPRJAQ
 S RESULT=$NA(^TMP($J))
 Q
ALLINDEX(RESULT,ARGS) ; GET for index across patients
 I $$UNKARGS^VPRJCU(.ARGS,"indexName,range,order,bail,template,filter") Q
 N INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER
 S INDEX=$G(ARGS("indexName"))
 S RANGE=$G(ARGS("range"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 D QINDEX^VPRJAQ(INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
ALLFIND(RESULT,ARGS) ; GET using filter across all patients
 I $$UNKARGS^VPRJCU(.ARGS,"collection,order,bail,template,filter") Q
 N COLL,ORDER,BAIL,TEMPLATE,FILTER
 S COLL=$G(ARGS("collection"))
 S ORDER=$G(ARGS("order"))
 S BAIL=$G(ARGS("bail"))
 S TEMPLATE=$G(ARGS("template"))
 S FILTER=$G(ARGS("filter"))
 I '$L(FILTER) D SETERROR^VPRJRER(112) Q
 D QFIND^VPRJAQ(COLL,ORDER,BAIL,TEMPLATE,FILTER)
 S RESULT=$NA(^TMP($J)),RESULT("pageable")=""
 Q
CHKSUM(RESULT,ARGS) ; Get checksum for a patient
 N PID,SYSTEM
 S SYSTEM=$G(ARGS("system"))
 S PID=$$PID(.ARGS) Q:'$L(PID)
 D EN^VPRJCRC(.RESULT,SYSTEM,PID)
 Q
DELUID(RESULT,ARGS) ; DELETE an object
 I $$UNKARGS^VPRJCU(.ARGS,"pid,uid") Q
 N UID S UID=$G(ARGS("uid"))
 ; If UID is not supplied quit without returning the object
 I '$L(UID) D SETERROR^VPRJRER(211) QUIT ""
 S PID=""
 F  S PID=$O(^VPRPTJ("KEY",UID,PID)) Q:PID=""  D
 . D DELETE^VPRJPS(PID,UID)
 S RESULT=$NA(^TMP($J))
 Q
 ;
DELCLTN(RESULT,ARGS) ; Delete a collection
 I $$UNKARGS^VPRJCU(.ARGS,"pid,collectionName,system") Q
 N PID S PID=$G(ARGS("pid")) Q:'$L(PID)  Q:'$D(^VPRPTJ("JPID",PID))
 D DELCLTN^VPRJPS(PID,$G(ARGS("collectionName")),$G(ARGS("system")))
 S RESULT=""
 Q
DELPT(RESULT,ARGS) ; DELETE a patient
 I $$UNKARGS^VPRJCU(.ARGS,"pid") Q
 N PID S PID=$$PID(.ARGS) Q:'$L(PID)
 D CLEARPT^VPRJPS(PID)
 S RESULT=""
 Q
DELSITE(RESULT,ARGS) ; DELETE a site's patient data
 I $$UNKARGS^VPRJCU(.ARGS,"site") Q
 D DELSITE^VPRJPS(ARGS("site"))
 S RESULT=""
 Q
DELALL(RESULT,ARGS) ; DELETE the entire VPR store
 I $$UNKARGS^VPRJCU(.ARGS,"confirm") Q
 I $G(ARGS("confirm"))'="true" D SETERROR^VPRJRER(405) Q
 D KILLDB^VPRJ2P
 S RESULT=""
 Q
 ;
CHKCONFLICT(JPID,PID)
 ; TODO: Make this work
 ; Check for conflicting ICN's
 ; TODO: ensure this logic still works (I doubt it currently works right)
 ;N XUID,ROOT,LROOT,XICN,XDFN,DFNS
 ;S ROOT="urn:va:patient:",LROOT=$L(ROOT)
 ;S XUID=ROOT F  S XUID=$O(^VPRPT(PID,XUID)) Q:$E(XUID,1,LROOT)'=ROOT  I XUID'=UID D
 ;. S XICN=$$ICN4OBJ($NA(^VPRPT(PID,XUID)))
 ;. I $L(ICN),$L(XICN),ICN'=XICN D SETERROR^VPRJRER(205,"ICNs:"_ICN_","_XICN) Q
 ;I $G(HTTPERR) Q 1
 N EJPID
 ; Check to make sure we don't know these patient IDs on another patient
 ; Check to see if we have a mismatch for a JPID for the given data
 S EJPID=$$JPID4PID(PID)
 ; If EJPID is blank we don't know this PID it is ok
 I EJPID="" Q 0
 ; If we have an EJPID we know this PID, ensure it matches the one on file, if it doesn't match error
 I JPID'=EJPID D SETERROR^VPRJRER(223,"Identifier "_ICN_" Associated with "_EJPID) Q 1
 Q 0
 ; ** JPID implementations **
 ; ** Internal APIs **
JPID() ; Generate a new JPID
 N JPID
 S JPID=$$UUID^VPRJRUT
 ; If the JPID already exists keep trying to get a UUID that doesn't exist
 I $D(^VPRPTJ("JPID",JPID)) F  Q:'$D(^VPRPTJ("JPID",JPID))  D
 . S JPID=$$UUID^VPRJRUT
 ; Set the JPID existance index
 S ^VPRPTJ("JPID",JPID)=""
 ; Update patient count
 N PCNT
 S PCNT=$G(^VPRPTX("count","patient","patient"),0)
 S ^VPRPTX("count","patient","patient")=PCNT+1
 Q JPID
ISJPID(JPID) ; is the passed string a JPID
 I JPID["-4" Q 1
 Q 0
ISICN(ICN) ; is the passed string an ICN
 I ICN["V",ICN'[";" Q 1
 Q 0
ISPID(PID) ; is the passed string a PID
 I PID[";" Q 1
 Q 0
JPIDIDX(JPID,ID) ; Add passed identifier to JPID index
 ; Set the JPID forward lookup index (JPID -> PID/ICN)
 S ^VPRPTJ("JPID",JPID,ID)=""
 ; Set the JPID reverse lookup index (PID/ICN -> JPID)
 S ^VPRPTJ("JPID",ID)=JPID
 Q
JPIDDIDX(JPID,ID) ; Remove passed identifier from JPID index
 I JPID="" Q
 I ID="" Q
 N PCNT
 ; Kill the JPID forward lookup index (JPID -> PID/ICN)
 K ^VPRPTJ("JPID",JPID,ID)
 ; Kill the JPID reverse lookup index (PID/ICN -> JPID)
 K ^VPRPTJ("JPID",ID)
JPIDCLN
 ; Remove the existance of the JPID if no children remain
 N PCNT
 I $D(^VPRPTJ("JPID",JPID))=1 D
 . K ^VPRPTJ("JPID",JPID)
 . S PCNT=$G(^VPRPTX("count","patient","patient"),0)
 . I PCNT'=0 S ^VPRPTX("count","patient","patient")=PCNT-1
 Q
JPID4PID(PID) ; Return JPID for a PID
 I $G(PID)="" Q "" ; Quit if PID is empty
 I $$ISJPID(PID) Q PID ; Passed PID is a JPID
 Q $G(^VPRPTJ("JPID",PID))
 ;
JPIDEXISTS(JPID) ; Return true if we have a JPID, false if not
 I $D(^VPRPTJ("JPID",JPID))#2 Q 1
 Q 0
 ;
PID4JPID(RESULT,JPID) ; Return an array of PIDs for a JPID
 K RESULT
 I $G(JPID)="" Q
 N I,PID
 S PID=""
 F I=1:1 S PID=$O(^VPRPTJ("JPID",JPID,PID)) Q:PID=""  D
 .S RESULT(I)=PID
 Q
 ;
PID4UID(RESULT,UID) ; Return an array of PIDs for a UID
 K RESULT
 I $G(UID)="" Q
 N I,PID
 S PID=""
 F I=1:1 S PID=$O(^VPRPTJ("KEY",UID,PID)) Q:PID=""  D
 . S RESULT(I)=PID
 Q
 ;
ICN4JPID(JPID) ; Return an ICN for a JPID
 I JPID="" Q ""
 N I,PID,ICN
 S PID=""
 S ICN=""
 F I=1:1 S PID=$O(^VPRPTJ("JPID",JPID,PID)) Q:PID=""  Q:ICN  D
 .I PID'[";" S ICN=PID
 Q ICN
 ; ** REST APIs **
PIDS(RESULT,ARGS) ; Return all patient Identifiers for a JPID
 N PIDS,PID,BODY,JPID,I
 ; ensure we have a JPID argument
 S JPID=$G(ARGS("jpid")) I '$L(JPID) D SETERROR^VPRJRER(222) Q ""
 ; Perform JPID lookup on passed argument if we aren't handed a JPID
 I JPID'["-" S JPID=$$JPID4PID(JPID)
 I JPID="" D SETERROR^VPRJRER(224) Q ""
 ; Get the PIDS using internal API
 D PID4JPID(.PIDS,JPID)
 S PID=""
 F I=1:1 S PID=$O(PIDS(PID)) Q:PID=""  D
 . S BODY("patientIdentifiers",I)=PIDS(PID)
 S BODY("jpid")=JPID
 ; Encode the response
 D ENCODE^VPRJSON("BODY","^TMP($J)","ERR") I $D(ERR) D SETERROR^VPRJRER(202) QUIT ""
 ; return results global
 S RESULT=$NA(^TMP($J))
 Q
ASSOCIATE(ARGS,BODY) ; Associate a PID/ICN with a JPID
 ; Similar logic to PUTPT^VPRJPR
 N OBJECT,ERR,JPID,UID,PID,ICN,EPID,EJPID,NEWJPID,I,HTTPERR,CONFLICTICN,ERR
 ; Decode Body JSON to M object
 D DECODE^VPRJSON("BODY","OBJECT","ERR") I $D(ERR) D SETERROR^VPRJRER(202) Q ""
 ; Ensure JPID variable exists
 S JPID=$G(ARGS("jpid")) ; get from argument
 I JPID=""  S JPID=$G(OBJECT("jpid")) ; get from body
 ; Check to see if we we passed a real JPID if not translate the identifier to a JPID
 ; If a JPID doesn't exist for the identifier on file it will be JPID will null
 I '$$ISJPID(JPID) S JPID=$$JPID4PID(JPID)
 ; If JPID is still blank at this point assume we want a new JPID
 ; We will check the identifiers given later to check for collisions
 I JPID=""  S JPID=$$JPID
 ; Sanity check - if a client posts to a jpid and includes a different one in the body error
 I $G(ARGS("jpid"))'="",$G(OBJECT("jpid"))'="" I $G(ARGS("jpid"))'=$G(OBJECT("jpid")) D SETERROR^VPRJRER(205) Q ""
 ; Sanity check - make sure we know jpid
 I $G(^VPRPTJ("JPID",JPID)) D SETERROR^VPRJRER(224) Q ""
 ; Ensure required attributes are defined
 I '$D(OBJECT("patientIdentifiers")) D SETERROR^VPRJRER(211) Q ""
 ; Check to make sure we don't know these patient IDs on another patient
 S EPID=""
 F I=1:1 S EPID=$O(OBJECT("patientIdentifiers",EPID)) Q:EPID=""  D
 . ; Check to see if we have a mismatch for a JPID for the given data
 . S EJPID=$$JPID4PID(OBJECT("patientIdentifiers",EPID))
 . ; If EJPID is blank we don't know this PID it is ok
 . I EJPID="" Q
 . ; If we have an EJPID we know this PID, ensure it matches the one on file, if it doesn't match error
 . I JPID'=EJPID D SETERROR^VPRJRER(223,"Identifier "_OBJECT("patientIdentifiers",EPID)_" Associated with "_EJPID) D JPIDCLN Q
 ; Found a collision Error out
 I $G(HTTPERR) Q ""
 ;
 ; Update the indexes
 L +^VPRPTJ("JPID"):2 E  D SETERROR^VPRJRER(502) Q ""
 ; Add patient to JPID index
 TSTART
 S EPID=""
 F I=1:1 S EPID=$O(OBJECT("patientIdentifiers",EPID)) Q:EPID=""  Q:$G(ERR)  D
 . I ($$ISPID(OBJECT("patientIdentifiers",EPID))!$$ISICN(OBJECT("patientIdentifiers",EPID))) D JPIDIDX(JPID,OBJECT("patientIdentifiers",EPID))
 . E  D SETERROR^VPRJRER(230,"Identifier "_OBJECT("patientIdentifiers",EPID)_" is invalid") S ERR=1
 TCOMMIT
 L -^VPRPTJ("JPID")
 Q JPID
DISASSOCIATE(RESULT,ARGS) ;Deassociate a PID/ICN with a JPID
 N JPID,PID,PIDS,HTTPERR
 ; Ensure JPID variable exists
 S JPID=$G(ARGS("jpid")) ; get from argument
 I JPID="" D SETERROR^VPRJRER(222) Q ""
 ; If the JPID parameter is the special "clear" value, dissociate and delete all JPID data
 I JPID="clear" D CLEAR() Q ""
 ; If we are passed a PID get the JPID so we can continue
 I '$$ISJPID(JPID) S JPID=$$JPID4PID(JPID)
 ; Sanity check - make sure we know jpid
 I '$D(^VPRPTJ("JPID",JPID)) D SETERROR^VPRJRER(224) Q ""
 ; Let CLEARPT deal with JPID/PID conversion
 D CLEARPT^VPRJPS(JPID)
 Q ""
CLEAR() ;Clear all patient identifiers and delete all JPIDs
 K ^VPRPTJ("JPID")
 Q ""
