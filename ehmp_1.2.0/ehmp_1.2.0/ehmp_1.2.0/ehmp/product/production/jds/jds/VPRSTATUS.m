VPRSTATUS ;KRM/CJE -- Handle Sync Status operations ; 12/10/2014
 ;;1.0;JSON DATA STORE;;Dec 10, 2014
 ; No entry from top
 Q
 ;
SET(ARGS,BODY) ; Store metastamps from a source
 N OBJECT,ERR,JID,JPID,JPID2,ICN,PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,EVENT,EVENTSTAMP,I,J,K,PREVSTAMP
 S OBJECT=$NA(^TMP($J,"OBJECT"))
 K @OBJECT
 D DECODE^VPRJSON("BODY",OBJECT,"ERR") ; Decode JSON to OBJECT array
 ; Ensure minimal required attributes exist
 S ICN=$G(@OBJECT@("icn"))
 ; Get the source (only one allowed per post)
 S SOURCE=""
 S SOURCE=$O(@OBJECT@("sourceMetaStamp",SOURCE))
 I SOURCE="""" D SETERROR^VPRJRER(227) Q ""
 S PID=$G(@OBJECT@("sourceMetaStamp",SOURCE,"pid"))
 I ICN="" D SETERROR^VPRJRER(211,"No ICN found in BODY") Q ""
 I PID="" D SETERROR^VPRJRER(211,"No PID found in BODY") Q ""
 ; Check to make sure we know this patient
 I '$D(^VPRPTJ("JPID",PID)) D SETERROR^VPRJRER(224) Q ""
 ; Get the JPID based on patient identifiers
 S JPID="",JPID2=""
 I $G(ICN)'="" S JPID2=$$JPID4PID^VPRJPR(ICN)
 I $G(PID)'="" S JPID=$$JPID4PID^VPRJPR(PID)
 ; Ensure that found JPIDs match, if not error as something went wrong
 ; Only run if JPID2 exists
 I JPID2'="",JPID'=JPID2 D SETERROR^VPRJRER(223,"JPID from ICN "_JPID2_" JPID from PID "_JPID) Q ""
 ; Ensure that we know JPID
 ; We can avoid the call to translate using ^VPRPTJ("JPID") since we have already done a lookup
 I JPID="" D SETERROR^VPPRJRER(224) Q ""
 ; Parse metastamps
 ; 1st wrapper is sourceMetaStamp
 S ERR=0
 N OLDOBJ
 ; Last change to construct PID
 S SOURCE=$O(@OBJECT@("sourceMetaStamp",""))
 I PID="" S PID=$G(@OBJECT@("sourceMetaStamp",SOURCE,"pid")) I PID="" D SETERROR^VPRJRER(211,"PID not passed in source") Q ""
 ; Metastamp has to be updated in a critical section.
 ; Use locking to ensure no one else is modifying the metastamp when we move forward a metastamp
 ; ** Begin Critical Section **
 L +^VPRSTATUS(PID,SOURCE):$G(^VPRCONFIG("timeout"),5) E  D SETERROR^VPRJRER(502) K @OBJECT Q ""
 ; Get the previous source stampTime
 S PREVSTAMP=$O(^VPRSTATUS(PID,SOURCE,""),-1)
 ; Store the source stampTime
 S SOURCESTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"stampTime"))
 ; Only set if source stamp exists (causes subscript errors if it doesn't)
 I $$ISSTMPTM^VPRSTMP(SOURCESTAMP) S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP)=""
 E  D SETERROR^VPRJRER(228,"Invalid Source stampTime passed") L -^VPRSTATUS(PID,SOURCE) Q ""
 ; See if there is an old metastamp to merge with
 I +PREVSTAMP D
 . ; Roll the old stamp forward
 . M ^VPRSTATUS(PID,SOURCE,SOURCESTAMP)=^VPRSTATUS(PID,SOURCE,PREVSTAMP)
 . ; Find UIDs in the new metastamp and kill them if they existed before
 . N DOMAIN,EVENT,DOMAINSTAMP
 . S (DOMAIN,EVENT)=""
 . F  S DOMAIN=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN)) Q:DOMAIN=""  D
 . . F  S EVENT=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"eventMetaStamp",EVENT)) Q:EVENT=""  D
 . . . ; Remove old event stamp and stored flags
 . . . K ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT)
 . . . ; Delete the Domain stamp (will be updated by new object
 . . . S DOMAINSTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,""))
 . . . ; Only run if DOMAINSTAMP exists
 . . . I DOMAINSTAMP K ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP)
 ; 2nd wrapper is domainMetaStamp
 S DOMAIN=""
 F  S DOMAIN=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN)) Q:DOMAIN=""  Q:ERR  D
 . ; Store the domain stampTime
 . S DOMAINSTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"stampTime"))
 . ; Only set if domain stamp exists (causes subscript errors if it doesn't)
 . I $$ISSTMPTM^VPRSTMP(DOMAINSTAMP) S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP)=""
 . ; If domainStamp doesn't exist delete this entire source metastamp as it is invalid
 . E  D SETERROR^VPRJRER(228,"Invalid Domain stampTime passed") S ERR=1 K ^VPRSTATUS(PID,SOURCE,SOURCESTAMP) Q
 . ; 3rd wrapper is eventMetaStamp
 . S EVENT=""
 . F  S EVENT=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"eventMetaStamp",EVENT)) Q:EVENT=""  Q:ERR  D
 . . ; Store the event stampTime
 . . ; Only set if event stamp exists (causes subscript errors if it doesn't)
 . . S EVENTSTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"eventMetaStamp",EVENT,"stampTime"))
 . . I $$ISSTMPTM^VPRSTMP(EVENTSTAMP) S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT,EVENTSTAMP)=""
 . . E  D SETERROR^VPRJRER(228,"Invalid event stampTime passed") S ERR=1 K ^VPRSTATUS(PID,SOURCE,SOURCESTAMP) Q
 . . ; check to see if the old data was stored
 . . I PREVSTAMP'="",$G(^VPRSTATUS(PID,SOURCE,PREVSTAMP,DOMAIN,EVENT,EVENTSTAMP,"stored"))=1 S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT,EVENTSTAMP,"stored")=1
 L -^VPRSTATUS(PID,SOURCE)
 ; ** End of Critical Section **
 K @OBJECT
 Q ""
 ;
GET(RETURN,ARGS) ; Return sync status based on metastamps
 N RESULT,DETAILED,JPID,PIDS,ID,RESULT,ERR
 S RESULT=$NA(^TMP($J,"RESULT"))
 ; Ensure we have all required arguments
 I $$UNKARGS^VPRJCU(.ARGS,"id,detailed") Q
 ; Set summary flag if passed
 S:$G(ARGS("detailed"))="true" DETAILED=1
 S DETAILED=$G(DETAILED)
 ; Get the JPID based on passed patient identifier
 S JPID=""
 S JPID=$$JPID4PID^VPRJPR(ARGS("id")) I JPID="" D SETERROR^VPRJRER(224) Q
 ; Get all PIDs for JPID
 D PID4JPID^VPRJPR(.PIDS,JPID)
 ; Generate Metastamp based on index
 ;
 ; Loop through patient identifiers for this JPID
 S ID=""
 F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . D PATIENT(RESULT,PIDS(ID),DETAILED)
 ;
 S RETURN=$NA(^TMP($J,"RETURN"))
 D ENCODE^VPRJSON(RESULT,RETURN,"ERR") ; From an array to JSON
 K @RESULT
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 Q
 ;
CLEAR(RESULT,ARGS) ; Delete all sync status data
 K ^VPRSTATUS
 Q ""
DELSS(PID) ; Delete a patient's sync status
 K ^VPRSTATUS(PID)
 Q
STORERECORD(RESULT,BODY)
 ; Testing endpoint
 N OBJECT,ERR,PID,SOURCE,SOURCESTAMP,DOMAIN,UID,EVENTSTAMP
 D DECODE^VPRJSON("BODY","OBJECT","ERR")
 S PID=$G(OBJECT("pid"))
 S SOURCE=$G(OBJECT("source"))
 S UID=$G(OBJECT("uid"))
 S DOMAIN=$G(OBJECT("domain"))
 S EVENTSTAMP=$G(OBJECT("eventStamp"))
 S SOURCESTAMP=""
 F K=1:1 S SOURCESTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP)) Q:SOURCESTAMP=""  D
 . I $D(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,EVENTSTAMP)) S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,UID,EVENTSTAMP,"stored")="1"
 Q ""
 ;
 ; Operational data sync status
 ;
SETOD(ARGS,BODY) ; Store operational data metastamp from a source
 N OBJECT,ERR,JID,JPID,JPID2,ICN,PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,ITEM,ITEMSTAMP,I,J,K,PREVSTAMP,OLDOBJ
 S OBJECT=$NA(^TMP($J,"OBJECT"))
 K @OBJECT
 D DECODE^VPRJSON("BODY",OBJECT,"ERR") ; Decode JSON to OBJECT array
 ; Ensure minimal required attributes exist
 S SOURCE=""
 ; Get the source (only one allowed per post)
 S SOURCE=$O(@OBJECT@("sourceMetaStamp",SOURCE))
 I SOURCE="""" D SETERROR^VPRJRER(227) K @OBJECT Q ""
 S ERR=0
 ; Parse metastamps
 ; Metastamp has to be updated in a critical section.
 ; Use locking to ensure no one else is modifying the metastamp when we move forward a metastamp
 ; ** Begin Critical Section **
 L +^VPRSTATUSOD(SOURCE):$G(^VPRCONFIG("timeout"),5) E  D SETERROR^VPRJRER(502) K @OBJECT Q ""
 ; See if there is an old metastamp to merge with
 S PREVSTAMP=$O(^VPRSTATUSOD(SOURCE,""),-1)
 ; Store the source stampTime
 ; Only set if the source stamp exists (causes subscript errors if it doesn't)
 S SOURCESTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"stampTime"))
 I $$ISSTMPTM^VPRSTMP(SOURCESTAMP) S ^VPRSTATUSOD(SOURCE,SOURCESTAMP)=""
 ; Need to remove the lock here as we are leaving this method
 E  D SETERROR^VPRJRER(228,"Invalid Source stampTime passed") L -^VPRSTATUSOD(SOURCE) Q ""
 ; See if there is an old metastamp to merge with
 I +PREVSTAMP D
 . ; Roll the old stamp forward
 . M ^VPRSTATUSOD(SOURCE,SOURCESTAMP)=^VPRSTATUSOD(SOURCE,PREVSTAMP)
 . ; Find UIDs in the new metastamp and kill them if they existed before
 . N DOMAIN,ITEM,DOMAINSTAMP
 . S (DOMAIN,ITEM)=""
 . F  S DOMAIN=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN)) Q:DOMAIN=""  D
 . . F  S ITEM=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"itemMetaStamp",ITEM)) Q:ITEM=""  D
 . . . ; Remove old event stamp and stored flags
 . . . K ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM)
 . . . ; Delete the Domain stamp (will be updated by new object
 . . . S DOMAINSTAMP=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,""))
 . . . ; Only run if DOMAINSTAMP exists
 . . . I DOMAINSTAMP K ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP)
 ;
 ; 2nd wrapper is domainMetaStamp
 S DOMAIN=""
 F  S DOMAIN=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN)) Q:DOMAIN=""  Q:ERR  D
 . ; Store the domain stampTime
 . ; Only set if the domain stamp exists (causes subscript errors if it doesn't)
 . S DOMAINSTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"stampTime"))
 . I $$ISSTMPTM^VPRSTMP(DOMAINSTAMP) S ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP)=""
 . E  D SETERROR^VPRJRER(228,"Invalid Domain stampTime passed") S ERR=1 K ^VPRSTATUSOD(SOURCE,SOURCESTAMP) Q
 . ; 3rd wrapper is itemMetaStamp
 . S ITEM=""
 . F  S ITEM=$O(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"itemMetaStamp",ITEM)) Q:ITEM=""  Q:ERR  D
 . . ; Store the item stampTime
 . . ; Only set if item stamp exists (causes subscript errors if it doesn't)
 . . S ITEMSTAMP=$G(@OBJECT@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"itemMetaStamp",ITEM,"stampTime"))
 . . I $$ISSTMPTM^VPRSTMP(ITEMSTAMP) S ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP)=""
 . . E  D SETERROR^VPRJRER(228,"Invalid item stampTime passed") S ERR=1 K ^VPRSTATUSOD(SOURCE,SOURCESTAMP) Q
 . . ; check to see if the old data was stored
 . . I PREVSTAMP'="",$G(^VPRSTATUSOD(SOURCE,PREVSTAMP,DOMAIN,ITEM,ITEMSTAMP,"stored"))=1 S ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP,"stored")=1
 ; Remove the lock since we are done
 L -^VPRSTATUSOD(SOURCE)
 ; ** End Critical Section **
 K @OBJECT
 Q ""
 ;
GETOD(RETURN,ARGS) ; Return operational data sync status based on metastamps
 N RESULT,BUILD,OBJECT,ERR,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,ITEM,ITEMSTAMP,I,J,K
 N ID,DOMAINCOMPLETE,DOMAINSTORED,ITEMSCOMPLETE,ITEMSTORED,DETAILED
 S RESULT=$NA(^TMP($J,"RESULT"))
 K @RESULT
 ; Ensure we have all required arguments
 I $$UNKARGS^VPRJCU(.ARGS,"id,detailed") Q
 ; Set summary flag if passed
 S:$G(ARGS("detailed"))="true" DETAILED=1
 S DETAILED=$G(DETAILED)
 ; If there are no sync statuses on file quit
 I $O(^VPRSTATUSOD(""))="" D SETERROR^VPRJRER(229) Q
 I $G(ARGS("id"))="" D SETERROR^VPRJRER(241) Q
 ;
 D DATA(RESULT,ARGS("id"),DETAILED)
 S RETURN=$NA(^TMP($J,"RETURN"))
 K @RETURN ; Clear the output global array, avoid subtle bugs
 D ENCODE^VPRJSON(RESULT,RETURN,"ERR") ; From an array to JSON
 K @RESULT
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 Q
DELOD(RESULT,ARGS) ; Delete all sync status data
 ; If we are passed an id only kill that site's sync status
 I $G(ARGS("id"))'="" K ^VPRSTATUSOD(ARGS("id")) Q
 ; If no id passed kill the whole thing
 I $G(ARGS("id"))="" K ^VPRSTATUSOD
 Q ""
STORERECORDOD(RESULT,BODY)
 ; Testing endpoint
 N OBJECT,ERR,SOURCE,SOURCESTAMP,DOMAIN,UID,ITEMSTAMP,K
 D DECODE^VPRJSON("BODY","OBJECT","ERR")
 S SOURCE=$G(OBJECT("source"))
 S UID=$G(OBJECT("uid"))
 S DOMAIN=$G(OBJECT("domain"))
 S ITEMSTAMP=$G(OBJECT("itemStamp"))
 S SOURCESTAMP=""
 F K=1:1 S SOURCESTAMP=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP)) Q:SOURCESTAMP=""  D
 . I $D(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,UID,ITEMSTAMP)) S ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,UID,ITEMSTAMP,"stored")="1"
 Q ""
 ;
 ;
 ; Get algorithm section
 ;
 ;
PATIENT(RESULT,PID,DETAILED) ; GET Patient Sync Status algorithm
 N SOURCE,DOMAINCOMPLETE,SOURCESTAMP,BUILD,DOMAIN,DOMAINSTAMP,EVENTSCOMPLETE,EVENT,EVENTSTORED,EVENTSTAMP
 ; Ensure Detailed flag exists
 S DETAILED=$G(DETAILED)
 ; Quit if PID doesn't exist
 I $G(PID)="" Q
 ; We'll start by getting the latest source metastamp (we need it anyway)
 ; if it is completed we don't need to do anything more
 ; If the latest isn't completed get the latest one that is
 ; TODO: create index of completed metastamps (only gets set here)
 S SOURCE=$P(PID,";",1)
 S DOMAINCOMPLETE=1
 S SOURCESTAMP=""
 S SOURCESTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP),-1) I SOURCESTAMP="complete" Q ; Latest is at bottom of tree
 ; Check to see if we have a metastamp for this source
 I '$D(^VPRSTATUS(PID,SOURCE)) Q
 ; Check to see if it is complete
 ; Set BUILD up to use as a target for indirection (since no matter what we want to know the status of the latest)
 S BUILD=$NA(^TMP($J,"RESULT","temp"))
 K @BUILD
 S @BUILD@("icn")=$$ICN4JPID^VPRJPR(JPID) ; This may be blank if no ICN is on file, if it is blank only primary site data is on file
 ; sourceMetaStamp
 S @BUILD@("sourceMetaStamp",SOURCE,"pid")=PID
 S @BUILD@("sourceMetaStamp",SOURCE,"localId")=$P(PID,";",2)
 S @BUILD@("sourceMetaStamp",SOURCE,"stampTime")=SOURCESTAMP
 ; domainMetaStamp
 S DOMAIN=""
 F  S DOMAIN=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN)) Q:DOMAIN=""  D
 . ; complete isn't a domain - skip it
 . I DOMAIN="complete" Q
 . ; Flag if all domains are complete
 . I DOMAINCOMPLETE'=0 S DOMAINCOMPLETE=1 ; be optimistic
 . S DOMAINSTORED=0
 . ; Send the domain stampTime
 . S DOMAINSTAMP=""
 . S DOMAINSTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP))
 . S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"domain")=DOMAIN
 . S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"stampTime")=DOMAINSTAMP
 . ; eventMetaStamp
 . S EVENTSCOMPLETE=1
 . ; All events begin with urn
 . S EVENT="urn"
 . F  S EVENT=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT)) Q:EVENT=""  D
 . . ; Flag if all events are complete within a domain
 . . I EVENTSCOMPLETE'=0 S EVENTSCOMPLETE=1 ; be optimistic
 . . S EVENTSTORED=0
 . . ; Store the event stampTime
 . . S EVENTSTAMP=""
 . . F  S EVENTSTAMP=$O(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT,EVENTSTAMP),-1) Q:EVENTSTAMP=""  Q:$D(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT,EVENTSTAMP))#10
 . . I DETAILED S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"eventMetaStamp",EVENT,"stampTime")=EVENTSTAMP
 . . I $G(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,EVENT,EVENTSTAMP,"stored")) S EVENTSTORED=1 E  S EVENTCOMPLETE=0
 . . I DETAILED I EVENTSTORED S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"eventMetaStamp",EVENT,"stored")="true" 
 . . ; If the stored flag is still zero AND EVENTSCOMPLETE 1: Set EVENTSCOMPLETE 0
 . . I 'EVENTSTORED I EVENTSCOMPLETE S EVENTSCOMPLETE=0
 . ; Set the stored flag if all of the events were complete
 . I EVENTSCOMPLETE S ^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,"stored")=1
 . I $G(^VPRSTATUS(PID,SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,"stored")) S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"syncCompleted")="true" S DOMAINSTORED=1 E  S DOMAINCOMPLETE=0
 . ; If the stored flag is still zero AND DOMAINCOMPLETE 1: Set DOMAINCOMPLETE 0
 . I 'DOMAINSTORED I DOMAINCOMPLETE S DOMAINCOMPLETE=0
 ; Set the complete flag if all of the domains were complete
 I $G(DOMAINCOMPLETE) S @BUILD@("sourceMetaStamp",SOURCE,"syncCompleted")="true" M @RESULT@("completedStamp")=@BUILD
 E  M @RESULT@("inProgress")=@BUILD
 K @BUILD
 Q
 ;
DATA(RESULT,ID,DETAILED) ; GET Operational Data Sync Status algorithm
 N DOMAINCOMPLETE,SOURCESTAMP,BUILD,DOMAIN,DOMAINSTAMP,ITEMSCOMPLETE,ITEM,ITEMSTORED,ITEMSTAMP,SOURCE
 ; Ensure Detailed flag exists
 S DETAILED=$G(DETAILED)
 ; Quit if source isn't passed
 I '$L(ID) Q
 S SOURCE=""
 ; Set BUILD up to use as a target for indirection (since no matter what we want to know the status of the latest)
 S BUILD=$NA(^TMP($J,"RESULT","temp"))
 F  S SOURCE=$O(^VPRSTATUSOD(SOURCE)) Q:SOURCE=""  D ; for each source
 . S DOMAINCOMPLETE=1
 . ; We'll start by getting the latest source metastamp (we need it anyway)
 . ; if it is completed we don't need to do anything more
 . ; If the latest isn't completed get the latest one that is
 . ; TODO: create index of completed metastamps (only gets set here)
 . ; Control if we were passed a specific site for status
 . ; Only run if id is not null
 . I ID'="",SOURCE'=ID Q
 . S SOURCESTAMP=""
 . F  S SOURCESTAMP=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP),-1) Q:SOURCESTAMP="complete"  Q:SOURCESTAMP'="" ; Latest is at bottom of tree
 . ; Check to see if we have a metastamp for this source
 . I '$D(^VPRSTATUSOD(SOURCE)) Q
 . ; sourceMetaStamp
 . S @BUILD@("sourceMetaStamp",SOURCE,"stampTime")=SOURCESTAMP
 . ; domainMetaStamp
 . S DOMAIN=""
 . F  S DOMAIN=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN)) Q:DOMAIN=""  D
 . . ; complete isn't a domain - skip it
 . . I DOMAIN="complete" Q
 . . ; Flag if all domains are complete
 . . I DOMAINCOMPLETE'=0 S DOMAINCOMPLETE=1 ; be optimistic
 . . S DOMAINSTORED=0
 . . ; Send the domain stampTime
 . . S DOMAINSTAMP=""
 . . S DOMAINSTAMP=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP))
 . . S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"domain")=DOMAIN
 . . S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"stampTime")=DOMAINSTAMP
 . . ; itemMetaStamp
 . . S ITEMSCOMPLETE=1
 . . ; All items begin with urn
 . . S ITEM="urn"
 . . F K=1:1 S ITEM=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM)) Q:ITEM=""  D
 . . . ; Flag if all items are complete within a domain
 . . . I ITEMSCOMPLETE'=0 S ITEMSCOMPLETE=1 ; be optimistic
 . . . S ITEMSTORED=0
 . . . ; Store the item stampTime
 . . . S ITEMSTAMP=""
 . . . F  S ITEMSTAMP=$O(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP),-1) Q:ITEMSTAMP=""  Q:$D(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP))#10
 . . . I DETAILED S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"itemMetaStamp",ITEM,"stampTime")=ITEMSTAMP
 . . . I $G(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP,"stored")) S ITEMSTORED=1 E  S ITEMCOMPLETE=0
 . . . I DETAILED I ITEMSTORED S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"itemMetaStamp",ITEM,"stored")="true"
 . . . ; If the stored flag is still zero AND ITEMSCOMPLETE 1: Set ITEMSCOMPLETE 0
 . . . I 'ITEMSTORED I ITEMSCOMPLETE S ITEMSCOMPLETE=0
 . . ; Set the stored flag if all of the items were complete
 . . I ITEMSCOMPLETE S ^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,"stored")=1
 . . I $G(^VPRSTATUSOD(SOURCE,SOURCESTAMP,DOMAIN,DOMAINSTAMP,"stored")) S @BUILD@("sourceMetaStamp",SOURCE,"domainMetaStamp",DOMAIN,"syncCompleted")="true" S DOMAINSTORED=1 E  S DOMAINCOMPLETE=0
 . . ; If the stored flag is still zero AND DOMAINCOMPLETE 1: Set DOMAINCOMPLETE 0
 . . I 'DOMAINSTORED I DOMAINCOMPLETE S DOMAINCOMPLETE=0
 . ; Set the complete flag if all of the domains were complete
 . I $G(DOMAINCOMPLETE) S @BUILD@("sourceMetaStamp",SOURCE,"syncCompleted")="true" M @RESULT@("completedStamp")=@BUILD
 . E  M @RESULT@("inProgress")=@BUILD
 K @BUILD
 Q
