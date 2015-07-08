VPRJPX ;SLC/KCM -- Index a JSON object
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
INDEX(PID,KEY,OLDOBJ,NEWOBJ) ; Index this object identified by its KEY
 N IDXCOLL,IDXNAME
 ; Currently assuming UID is urn:va:type:vistaAccount:localId...
 ; For example:  urn:va:med:93EF:34014
 N VPRCONST D CONST
 S IDXCOLL=$P(KEY,":",3)
 S IDXNAME="" F  S IDXNAME=$O(^VPRMETA("collection",IDXCOLL,"index",IDXNAME)) Q:IDXNAME=""  D
 . N IDXMETA
 . M IDXMETA=^VPRMETA("index",IDXNAME,"collection",IDXCOLL)
 . I IDXMETA("method")="tally" D TALLY Q
 . I IDXMETA("method")="time"  D TIME Q
 . I IDXMETA("method")="attr"  D ATTRIB^VPRJPXA Q
 . I IDXMETA("method")="xattr" D XATTR^VPRJPXA Q
 S IDXNAME="" F  S IDXNAME=$O(^VPRMETA("collection",IDXCOLL,"link",IDXNAME)) Q:IDXNAME=""  D
 . N IDXMETA
 . M IDXMETA=^VPRMETA("link",IDXNAME,"collection",IDXCOLL)
 . D REVERSE
 ;D CODES (do this later -- when we add in support for matches)
 D COUNTS
 Q
 ;
 ; ----- Maintain counts of objects -----
 ;
COUNTS ; set counts for different collection types
 N DOMAIN
 D KCOUNT("collection",IDXCOLL,.OLDOBJ)
 D SCOUNT("collection",IDXCOLL,.NEWOBJ)
 S DOMAIN=$G(^VPRMETA("collection",IDXCOLL,"domain")) Q:DOMAIN=""
 D KCOUNT("domain",DOMAIN,.OLDOBJ)
 D SCOUNT("domain",DOMAIN,.NEWOBJ)
 Q
SCOUNT(GROUP,TOPIC,OBJECT) ; Increment a count index
 Q:$D(OBJECT)<10
 N TALLY
 S TALLY=+$G(^VPRPTI(PID,"tally",GROUP,TOPIC))
 S ^VPRPTI(PID,"tally",GROUP,TOPIC)=TALLY+1 ; incr count for patient
 ;
 L +^VPRPTX("count",GROUP,TOPIC):1 E  D SETERROR^VPRJRER(502,GROUP_" "_TOPIC) QUIT
 S TALLY=+$G(^VPRPTX("count",GROUP,TOPIC))
 S ^VPRPTX("count",GROUP,TOPIC)=TALLY+1 ; incr count across patients
 L -^VPRPTX("count",GROUP,TOPIC)
 Q
KCOUNT(GROUP,TOPIC,OBJECT) ; Decrement a count index
 Q:$D(OBJECT)<10
 N TALLY
 S TALLY=+$G(^VPRPTI(PID,"tally",GROUP,TOPIC))
 S ^VPRPTI(PID,"tally",GROUP,TOPIC)=TALLY-1 ; decr count for patient
 ;
 L +^VPRPTX("count",GROUP,TOPIC):1 E  D SETERROR^VPRJRER(502,GROUP_" "_TOPIC) QUIT
 S TALLY=+$G(^VPRPTX("count",GROUP,TOPIC))
 S ^VPRPTX("count",GROUP,TOPIC)=TALLY-1 ; decr count across patients
 L -^VPRPTX("count",GROUP,TOPIC)
 Q
 ;
 ; ----- Index Logic: tally by attribute value -----
 ;
TALLY ; TALLY index (PID,"tally",group,value)=tally
 ; if FIELD has no value, count is not changed
 D KTALLY(.OLDOBJ)
 D STALLY(.NEWOBJ)
 S ^VPRPTI(PID,"tally",IDXNAME)=$H
 Q
STALLY(OBJECT) ; Increment a tally index
 Q:$D(OBJECT)<10
 N VALUES,I,TALLY
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . S TALLY=+$G(^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1)))
 . S ^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1))=TALLY+1
 Q
KTALLY(OBJECT) ; Decrement a tally index
 Q:$D(OBJECT)<10
 N VALUES,I,TALLY
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . S TALLY=+$G(^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1)))
 . S ^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1))=TALLY-1
 . I ^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1))=0 K ^VPRPTI(PID,"tally",IDXNAME,VALUES(I,1))
 Q
 ;
 ; ----- Index Logic: time ranges -----
 ;
TIME ; TIME index   (PID,"time",group,start,key)=stop
 ; -- if time range (PID,"stop",group,stop,key)=start
 ; expects start to always be something (0 if null), stop is optional
 D KTIME(.OLDOBJ)
 D STIME(.NEWOBJ)
 S ^VPRPTI(PID,"time",IDXNAME)=$H
 Q
STIME(OBJECT) ; Set a time based index
 Q:$D(OBJECT)<10
 Q:'$$SETIF(.OBJECT)
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . S ^VPRPTI(PID,"time",IDXNAME,VALUES(I,1),KEY,I)=$G(VALUES(I,2))
 . Q:'$L($G(VALUES(I,2)))
 . S ^VPRPTI(PID,"stop",IDXNAME,VALUES(I,2),KEY,I)=VALUES(I,1)
 Q
KTIME(OBJECT) ; Kill a time based index
 Q:$D(OBJECT)<10
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . K ^VPRPTI(PID,"time",IDXNAME,VALUES(I,1),KEY,I)
 . Q:'$L($G(VALUES(I,2)))
 . K ^VPRPTI(PID,"stop",IDXNAME,VALUES(I,2),KEY,I)
 Q
 ;
REVERSE ; REV index
 ; (PID,"rev",pointedToURN,relName,thisURN)
 D KREVERSE(.OLDOBJ)
 D SREVERSE(.NEWOBJ)
 S ^VPRPTI(PID,"rev",IDXNAME)=$H
 Q
SREVERSE(OBJECT) ; Set a relation link index
 Q:$D(OBJECT)<10
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTI(PID,"rev",VALUES(I,1),IDXNAME,KEY,I)=""
 Q
KREVERSE(OBJECT) ; Kill a relation link index
 Q:$D(OBJECT)<10
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTI(PID,"rev",VALUES(I,1),IDXNAME,KEY,I)
 Q
CODES ; code indexes
 D KCODES(.OLDOBJ)
 D SCODES(.NEWOBJ)
 Q
SCODES(OBJECT) ; set indexed codes
 Q:$D(OBJECT)<10
 N FIELD,SUB,LIST,I  ; assume max of 2 levels for now
 S FIELD="" F  S FIELD=$O(^VPRMETA("codes",IDXCOLL,FIELD)) Q:FIELD=""  D
 . I FIELD'["[]" D SETCODE(PID,KEY,$G(OBJECT(FIELD)),FIELD) Q
 . S LIST=$P(FIELD,"[]")
 . S I=0 F  S I=$O(OBJECT(LIST,I)) Q:'I  D
 . . S SUB="" F  S SUB=$O(^VPRMETA("codes",IDXCOLL,LIST,SUB)) Q:SUB=""  D SETCODE(PID,KEY,$G(OBJECT(LIST,I,SUB)),SUB)
 Q
KCODES(OBJECT) ; kill indexed codes
 Q:$D(OBJECT)<10
 N FIELD,SUB,LIST,I  ; assume max of 2 levels for now
 S FIELD="" F  S FIELD=$O(^VPRMETA("codes",IDXCOLL,FIELD)) Q:FIELD=""  D
 . I FIELD'["[]" D KILLCODE(PID,KEY,$G(OBJECT(FIELD)),FIELD) Q
 . S LIST=$P(FIELD,"[]")
 . S I=0 F  S I=$O(OBJECT(LIST,I)) Q:'I  D
 . . S SUB="" F  S SUB=$O(^VPRMETA("codes",IDXCOLL,LIST,SUB)) Q:SUB=""  D KILLCODE(PID,KEY,$G(OBJECT(LIST,I,SUB)),SUB)
 Q
SETCODE(PID,KEY,CODE,FIELD) ; Set index of all codes
 Q:'$L($G(CODE))
 S ^VPRPTX("allCodes",CODE,FIELD,PID,KEY)=""
 S ^VPRPTX("pidCodes",PID,FIELD,CODE,KEY)=""
 Q
KILLCODE(PID,KEY,CODE,FIELD) ; Kill index of all codes
 Q:'$L($G(CODE))
 K ^VPRPTX("allCodes",CODE,FIELD,PID,KEY)
 K ^VPRPTX("pidCodes",PID,FIELD,CODE,KEY)
 Q
CONST ; Set up constants for use
 S VPRCONST("SCT_MED_STATUS_ACTIVE")="urn:sct:55561003"
 S VPRCONST("SCT_MED_TYPE_OTC")="urn:sct:329505003"
 S VPRCONST("SCT_MED_TYPE_PRESCRIBED")="urn:sct:73639000"
 S VPRCONST("SCT_MED_TYPE_GENERAL")="urn:sct:105903003"
 Q
SETIF(OBJECT) ; return evaluated setif statement, otherwise return true
 ; expects IDXMETA
 ; SETIF conditional statement is in format "$$TAG^ROUTINE"
 N OK,SETIF
 S OK=1
 I $L(IDXMETA("setif")) S OK=0,SETIF=IDXMETA("setif")_"(.OBJECT)" I @SETIF S OK=1
 Q OK
 ;
