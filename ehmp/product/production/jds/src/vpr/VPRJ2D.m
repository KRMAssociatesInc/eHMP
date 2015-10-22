VPRJ2D ;SLC/KCM -- Management utilities for JSON objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
RIDXALL ; Reindex data
 N OK,KEY
 K ^XTMP("VPRJVUP","odc")
 S ^XTMP("VPRJVUP","odc","total")=$$TOTCTNI()
 D LOGMSG^VPRJ("odc","Re-indexing all non-patient data")
 L +^VPRJD:5 E  D LOGMSG^VPRJ("odc","Unable to lock all operational data") Q
 D SUSPEND^VPRJ
 D CLRINDEX(.OK) Q:'OK
 S KEY="" F  S KEY=$O(^VPRJD(KEY)) Q:KEY=""  D
 . D RIDXOBJ(KEY)
 . D LOGCNT^VPRJ("odc")
 D RESUME^VPRJ
 L -^VPRJD
 S ^XTMP("VPRJVUP","odc","complete")=1
 Q
RIDXCTN(CTN) ; Reindex a collection
 ; Can't re-index an object at a time without corrupting the tallys
 ; We don't know which tallies to kill.
 Q
RBLDALL ; Rebuild all objects (includes templates)
 N OK,KEY
 K ^XTMP("VPRJVUP","odc")
 S ^XTMP("VPRJVUP","odc","total")=$$TOTCTNI()
 D LOGMSG^VPRJ("odc","Rebuild ALL non-patient data (including templates)")
 L +^VPRJD:5 E  D LOGMSG^VPRJ("odc","Unable to lock ALL operational data")
 D SUSPEND^VPRJ
 D CLRINDEX(.OK) Q:'OK  ; clears VPRJDX,VPRTMP
 D CLRDATA(.OK) Q:'OK   ; clears VPRJD,VPRJDJ except VPRJDJ("JSON")
 S KEY="" F  S KEY=$O(^VPRJDJ("JSON",KEY)) Q:KEY=""  D
 . D RBLDOBJ(KEY)
 . D LOGCNT^VPRJ("odc")
 D RESUME^VPRJ
 L -^VPRJD
 D LOGMSG^VPRJ("odc","ODC rebuild complete")
 S ^XTMP("VPRJVUP","odc","complete")=1
 Q
RBLDCTN(CTN) ; Rebuild single collection (includes templates)
 ; Can't re-buld an object at a time without corrupting the tallys
 ; We don't know which tallies to kill.
 Q
RIDXOBJ(KEY) ; Re-index a single object
 L +^VPRJD(KEY):2 E  D LOGMSG^VPRJ("odc","Unable to obtain lock for "_KEY) QUIT
 N OBJECT,STAMP
 S STAMP=$O(^VPRJD(KEY,""),-1)
 M OBJECT=^VPRJD(KEY,STAMP)
 TSTART
 D INDEX^VPRJDX(KEY,"",.OBJECT)
 TCOMMIT
 L -^VPRJD(KEY)
 Q
RBLDOBJ(KEY) ; Re-build a single object
 L +^VPRJD(KEY):2 E  D LOGMSG^VPRJ("odc","Unable to obtain lock for "_KEY) QUIT
 N LINE,JSON,STAMP
 S STAMP=$O(^VPRJDJ("JSON",KEY,""),-1)
 ; get the original JSON object without the templates
 S LINE=0 F  S LINE=$O(^VPRJDJ("JSON",KEY,STAMP,LINE)) Q:'LINE  S JSON(LINE)=^VPRJDJ("JSON",KEY,STAMP,LINE)
 ; indexes have been killed for whole patient, so remove the original object
 K ^VPRJD(KEY)
 K ^VPRJDJ("JSON",KEY)
 K ^VPRJDJ("TEMPLATE",KEY)
 ; call save the replace the object & reset indexes
 D SAVE^VPRJDS(.JSON)
 L -^VPRJD(KEY)
 Q
CLRINDEX(OK) ; Clear all the indexes
 L +^VPRJD:2 E  D LOGMSG^VPRJ("odc","Unable to get lock for indexes.") S OK=0 Q
 K ^VPRJDX,^VPRTMP
 L -^VPRJD
 D SETUP^VPRJPMD
 S OK=1
 Q
CLRDATA(OK) ; Clear data except for original JSON
 L +^VPRJD:2 E  D LOGMSG^VPRJ("odc","Unable to get lock for data.") S OK=0 Q
 K ^VPRJD,^VPRJDJ("TEMPLATE")
 L -^VPRJD
 S OK=1
 Q
LSTCTN ; List collections
 N CTN
 W !,"Collections   Items     (UIDs) --"
 S CTN="" F  S CTN=$O(^VPRJDX("count","collection",CTN)) Q:CTN=""  D
 . W !,?2,CTN,?14,$G(^VPRJDX("count","collection",CTN)),?24,"(",$$OBJCTN(CTN),")"
 Q
STATUS ; Show statistics for non-patient data
 W !,"Statistics for non-patient data --"
 W !,?4," Data Nodes: ",$$NODECNT^VPRJ2P("^VPRJD")
 W !,?4,"Index Nodes: ",$$NODECNT^VPRJ2P("^VPRJDX")
 W !,?4,"Collections: ",$$TOTCTN()
 W !,?4,"Total Items: ",$$TOTCTNI()
 W !,?4,"Unique ID's: ",$$OBJCNT()
 Q
TOTCTN() ; Return the number of collections
 N CTN,COUNT
 S COUNT=0,CTN=""
 F  S CTN=$O(^VPRJDX("count","collection",CTN)) Q:CTN=""  D
 . I $G(^VPRJDX("count","collection",CTN)) S COUNT=COUNT+1
 Q COUNT
 ;
TOTCTNI() ; Return the total number of items in all collections
 N CTN,COUNT
 S COUNT=0,CTN=""
 F  S CTN=$O(^VPRJDX("count","collection",CTN)) Q:CTN=""  D
 . S COUNT=COUNT+$G(^VPRJDX("count","collection",CTN))
 Q COUNT
 ;
OBJCNT() ; Return a count of objects by UID
 N COUNT,UID
 S COUNT=0,UID="urn:" ; to skip "JSON" and "TEMPLATE" nodes
 F  S UID=$O(^VPRJD(UID)) Q:UID=""  S COUNT=COUNT+1
 Q COUNT
 ;
OBJCTN(CTN) ; Return a count of objects by UID for a collection
 N COUNT,PREFIX,UID
 S COUNT=0,PREFIX="urn:va:"_CTN_":",UID=PREFIX
 F  S UID=$O(^VPRJD(UID)) Q:$E(UID,1,$L(PREFIX))'=PREFIX  S COUNT=COUNT+1
 Q COUNT
DELCTN ; Delete a collection
 N HTTPERR,CTN
 S CTN=$$PROMPT^VPRJ1("Collection","","S","Enter string that identifies collection in the UID.")
 Q:CTN=""
 I '$D(^VPRJDX("count","collection",CTN)) W !,"Collection not found." Q
 D DELCTN^VPRJDS(CTN)
 I $G(HTTPERR) W !,"Error while deleting collection: ",HTTPERR
 Q
RESET ; Reset the non-patient data store (kill the data and re-initialize)
 N X
 W !,"Are you sure you want to delete the database? "
 R X:300 E  Q
 I $$UP^XLFSTR($E(X))'="Y" Q
 D SUSPEND^VPRJ
 D KILLDB
 D RESUME^VPRJ
 Q
KILLDB ; -- Delete and reset the globals for the database
 K ^VPRJD
 K ^VPRJDJ
 K ^VPRJDX
 K ^VPRTMP
 D SETUP^VPRJPMD
 Q
