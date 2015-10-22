VPRJPS ;SLC/KCM -- Save / Retrieve Patient-Related JSON objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
SAVE(JPID,JSON) ; Save a JSON encoded object
 N UID,COLL,KEY,OBJECT,OLDOBJ,VPRJERR,INDEXER,TLTARY,METASTAMP,PID,SOURCESTAMP,OLDSTAMP,STATUS,SOURCE,DOMAIN
 ;
 ; decode JSON into object and extract required fields
 D DECODE^VPRJSON("JSON","OBJECT","VPRJERR")
 I $L($G(VPRJERR)) D SETERROR^VPRJRER(202,VPRJERR) QUIT ""
 S UID=$G(OBJECT("uid"))
 ; If the uid >100 characters the JSON decoder will put it
 ; into an extension node. We'll manually set the UID to
 ; the vaule in the first extension node and force the
 ; object UID to be that value
 I '$L(UID) D
 . S UID=$G(OBJECT("uid","\",1))
 . S OBJECT("uid")=UID
 ; Still no UID defined? QUIT
 I '$L(UID) D SETERROR^VPRJRER(207) QUIT ""
 ;
 ; Parse out the collection, and key from the UID
 ; Currently assuming UID is urn:va:type:vistaAccount:localId...
 ; For example:  urn:va:med:93EF:34014
 N COLL S COLL=$P(UID,":",3)
 I '$L(COLL) D SETERROR^VPRJRER(210,UID) QUIT ""
 ;
 ; TODO: replace with a general facility for pre-actions based on collection?
 ; Next statement is special processing when patient demographics are updated
 ;   (DEMOG is defined if UPDPT has been called already)
 I COLL="patient",'$D(DEMOG) S JPID=$$UPDPT^VPRJPR(.OBJECT,JPID) Q:'$L(JPID) ""
 ;
 ; Get the PID from the object. Always store with the PID of the given object.
 ; PID is required
 S PID=$G(OBJECT("pid")) I '$L(PID) D SETERROR^VPRJRER(226) QUIT ""
 ; Ensure there is a JPID mapping for the PID
 I '$D(^VPRPTJ("JPID",PID)) D SETERROR^VPRJRER(224) QUIT ""
 ; Ensure the stampTime exists and is valid
 S METASTAMP=$G(OBJECT("stampTime")) I '$$ISSTMPTM^VPRSTMP(METASTAMP) D SETERROR^VPRJRER(221) QUIT ""
 ; kill the old indexes and object
 S OLDSTAMP=""
 S OLDSTAMP=$O(^VPRPT(PID,UID,""),-1)
 I OLDSTAMP'="",OLDSTAMP<METASTAMP S OLDOBJ="" M OLDOBJ=^VPRPT(PID,UID,OLDSTAMP)
 I METASTAMP>OLDSTAMP D BLDTLT^VPRJCT1(COLL,.OBJECT,.TLTARY) Q:$G(HTTPERR) ""
 K ^VPRPT(PID,UID,METASTAMP)
 K ^VPRPTJ("JSON",PID,UID,METASTAMP)
 ;
 S ^VPRPTJ("KEY",UID,PID,METASTAMP)=""
 M ^VPRPTJ("JSON",PID,UID,METASTAMP)=JSON
 I METASTAMP>OLDSTAMP M ^VPRPTJ("TEMPLATE",PID,UID)=TLTARY
 M ^VPRPT(PID,UID,METASTAMP)=OBJECT
 ; Set stored flags
 S SOURCE=$P(PID,";",1)
 S SOURCESTAMP=""
 S DOMAIN=COLL
 F  S SOURCESTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP)) Q:SOURCESTAMP=""  D
 . ; ** Begin Critical Section **
 . L +^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,METASTAMP):$G(^VPRCONFIG("timeout"),5) E  D SETERROR^VPRJRER(502) Q
 . I $D(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,METASTAMP)) S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,METASTAMP,"stored")="1"
 . L -^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,METASTAMP)
 . ; ** End Critical Section **
 D INDEX^VPRJPX(PID,UID,.OLDOBJ,.OBJECT)
 ; End store using metastamps
 S ^VPRPTI(PID,"every","every")=$H  ; timestamps latest update for this PID
 ;
 Q $$URLENC^VPRJRUT(UID)  ; no errors
 ;
DELETE(PID,KEY,SITEDEL) ; Delete an object given its UID
 ; Setting the SITEDEL flag means we are deleting a site, so it
 ; is okay to delete just a patient UID, and not the whole patient
 N OLDOBJ,OBJECT,COLL,STAMP
 S COLL=$P(KEY,":",3)
 I '$L(COLL) D SETERROR^VPRJRER(210,KEY) QUIT
 ; must delete entire patient instead, if the SITEDEL flag is not set
 I '$G(SITEDEL,0),COLL="patient" D SETERROR^VPRJRER(213,KEY) QUIT
 ;
 L +^VPRPT(PID,KEY):2 E  D SETERROR^VPRJRER(502) QUIT
 ; kill the old indexes and object
 S OBJECT=""
 S STAMP=""
 S STAMP=$O(^VPRPT(PID,KEY,STAMP),-1)
 S OLDOBJ="" M OLDOBJ=^VPRPT(PID,KEY,STAMP)
 TSTART
 K ^VPRPT(PID,KEY)
 K ^VPRPTJ("KEY",KEY,PID)
 K ^VPRPTJ("JSON",PID,KEY)
 K ^VPRPTJ("TEMPLATE",PID,KEY)
 D INDEX^VPRJPX(PID,KEY,.OLDOBJ,.OBJECT)
 TCOMMIT
 L -^VPRPT(PID,KEY)
 S ^VPRPTI(PID,"every","every")=$H ; timestamps latest update for the PID
 Q
DELCLTN(PID,CLTN,SYSID) ; Delete a collection for a patient
 I '$L(CLTN) D SETERROR^VPRJRER(215) QUIT
 N ROOT,LROOT,UID
 S ROOT="urn:va:"_CLTN_":"
 I $L($G(SYSID)) S ROOT=ROOT_SYSID_":"
 S LROOT=$L(ROOT)
 L +^VPRPT(PID,ROOT):5 E  D SETERROR^VPRJRER() QUIT
 S UID=ROOT F  S UID=$O(^VPRPT(PID,UID)) Q:$E(UID,1,LROOT)'=ROOT  D DELETE(PID,UID)
 L -^VPRPT(PID,ROOT)
 Q
DELSITE(SITE) ; Delete a site's patient data
 I '$L(SITE) D SETERROR^VPRJRER(208) Q
 ;
 N PID,JPID,UID,PIDS,HASH,KEY,ID,ICN
 D DELSITE^VPRSTATUS(SITE) ; Delete sync status for site
 S PID=SITE ; Speed up the $O, since a PID starts with the site
 S UID=""
 F  S PID=$O(^VPRPT(PID)) Q:PID=""!($P(PID,";")'=SITE)  D
 . F  S UID=$O(^VPRPT(PID,UID)) Q:UID=""  D
 . . D DELETE(PID,UID,1) ; Delete the patient UIDs (pass 1 to delete by site)
 . ;
 . S JPID=$$JPID4PID^VPRJPR(PID)
 . D JPIDDIDX^VPRJPR(JPID,PID) ; Remove JPID indexes for PID
 . ;
 . S HASH="" ; Remove cached queries
 . F  S HASH=$O(^VPRTMP("PID",PID,HASH)) Q:HASH=""  D
 . . K ^VPRTMP(HASH)
 . K ^VPRTMP("PID",PID)
 . ;
 . S KEY="" ; Remove the XREF for UIDs
 . F  S KEY=$O(^VPRPT(PID,KEY)) Q:KEY=""  D
 . . K ^VPRPTJ("KEY",KEY,PID)
 . ;
 . D CLRCODES^VPRJ2P(PID) ; Delete codes in VPRPTX
 . D CLREVIEW^VPRJ2P(PID) ; Delete review dates in VPRPTX
 . D CLRCOUNT^VPRJ2P(PID) ; Decrement the cross-patient totals for PID
 . D CLRXIDX^VPRJ2P(PID) ; Remove cross-patient indexes for PID
 . D DELSITE^VPRJOB(PID) ; Delete job status for site by PID
 . ;
 . D PID4JPID^VPRJPR(.PIDS,JPID)
 . S ID=$O(PIDS(""),-1)
 . I ID=1,$$ISICN^VPRJPR(PIDS(ID)) D  ; Down to ICN only
 . . S ICN=PIDS(ID) ; 
 . . D JPIDDIDX^VPRJPR(JPID,ICN) ; Remove ICN and JPID if no more PIDs exist
 Q
CLEARPT(PID) ; -- Clear data for patient
 N PIDS,JPID,ID
 ; go through with cleanup even if PID not used
 N PIDUSED
 S PIDUSED=($D(^VPRPTJ("JPID",PID))>0)
 S JPID=$$JPID4PID^VPRJPR(PID)
 ; Get the PIDS for a JPID
 I $$ISJPID^VPRJPR(JPID) D
 . D PID4JPID^VPRJPR(.PIDS,JPID)
 ; If we aren't a JPID delete the patient by PID
 E  D
 . S PIDS(1)=PID
 S PID=""
 S ID=""
 ; Loop through all PIDs associated with a JPID
 F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . S PID=PIDS(ID)
 . L +^VPRPT(PID):5 E  D SETERROR^VPRJRER(502) QUIT
 . ; Begin Remove JPID
 . S JPID=$$JPID4PID^VPRJPR(PID)
 . ; Remove JPID indexes
 . D JPIDDIDX^VPRJPR(JPID,PID)
 . ; End Remove JPID
 . ;
 . N HASH ; remove cached queries
 . S HASH="" F  S HASH=$O(^VPRTMP("PID",PID,HASH)) Q:HASH=""  K ^VPRTMP(HASH)
 . K ^VPRTMP("PID",PID)
 . ;
 . N KEY ; remove the xref for UID's
 . S KEY="" F  S KEY=$O(^VPRPT(PID,KEY)) Q:KEY=""  K ^VPRPTJ("KEY",KEY,PID)
 . ;
 . ;D CLRXIDX^VPRJ2P(PID)  ; clear indexes of type xattr
 . D CLRCODES^VPRJ2P(PID) ; clear codes in VPRPTX
 . D CLREVIEW^VPRJ2P(PID) ; clear review dates in VPRPTX
 . D CLRCOUNT^VPRJ2P(PID) ; decrement the cross patient counts
 . D DELSS^VPRSTATUS(PID) ; Clear Sync Status for PID
 . D DEL^VPRJOB(JPID) ; Clear Job Status for JPID
 . ;
 . K ^VPRPTI(PID)           ; kill all indexes for the patient
 . K ^VPRPT(PID)            ; kill all the data for the patient
 . K ^VPRPTJ("JSON",PID)     ; kill original JSON objects for the patient
 . K ^VPRPTJ("TEMPLATE",PID) ; kill the pre-compiled JSON objects for the patient
 . L -^VPRPT(PID)
 Q
