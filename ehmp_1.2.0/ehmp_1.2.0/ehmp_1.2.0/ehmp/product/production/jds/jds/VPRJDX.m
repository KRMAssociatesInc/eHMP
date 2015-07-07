VPRJDX ;SLC/KCM -- Index a JSON object
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
INDEX(KEY,OLDOBJ,NEWOBJ) ; Index this object identified by its KEY
 N IDXCOLL,IDXNAME
 ; Currently assuming UID is urn:va:collection:vistaAccount:...
 ; For example:  urn:va:fresh:93EF
 S IDXCOLL=$P(KEY,":",3)
 S IDXNAME="" F  S IDXNAME=$O(^VPRMETA("collection",IDXCOLL,"index",IDXNAME)) Q:IDXNAME=""  D
 . N IDXMETA
 . M IDXMETA=^VPRMETA("index",IDXNAME,"collection",IDXCOLL)
 . I IDXMETA("method")="tally" D TALLY Q
 . I IDXMETA("method")="attr"  D ATTRIB Q
 S IDXNAME="" F  S IDXNAME=$O(^VPRMETA("collection",IDXCOLL,"link",IDXNAME)) Q:IDXNAME=""  D
 . N IDXMETA
 . M IDXMETA=^VPRMETA("link",IDXNAME,"collection",IDXCOLL)
 . D REVERSE
 D COUNTS
 Q
 ;
 ; ----- Maintain counts of objects -----
 ;
COUNTS ; set counts for different collection types
 N DOMAIN
 D KCOUNT("collection",IDXCOLL,.OLDOBJ)
 D SCOUNT("collection",IDXCOLL,.NEWOBJ)
 Q
SCOUNT(GROUP,TOPIC,OBJECT) ; Increment a count index
 Q:$D(OBJECT)<10
 N TALLY
 S TALLY=+$G(^VPRJDX("tally",GROUP,TOPIC))
 S ^VPRJDX("tally",GROUP,TOPIC)=TALLY+1 ; incr count for collection
 ;
 L +^VPRJDX("count",GROUP,TOPIC):1 E  D SETERROR^VPRJRER(502,GROUP_" "_TOPIC) QUIT
 S TALLY=+$G(^VPRJDX("count",GROUP,TOPIC))
 S ^VPRJDX("count",GROUP,TOPIC)=TALLY+1 ; incr count across patients
 L -^VPRJDX("count",GROUP,TOPIC)
 Q
KCOUNT(GROUP,TOPIC,OBJECT) ; Decrement a count index
 Q:$D(OBJECT)<10
 N TALLY
 S TALLY=+$G(^VPRJDX("tally",GROUP,TOPIC))
 S ^VPRJDX("tally",GROUP,TOPIC)=TALLY-1 ; decr count for collection
 ;
 L +^VPRJDX("count",GROUP,TOPIC):1 E  D SETERROR^VPRJRER(502,GROUP_" "_TOPIC) QUIT
 S TALLY=+$G(^VPRJDX("count",GROUP,TOPIC))
 S ^VPRJDX("count",GROUP,TOPIC)=TALLY-1 ; decr count across patients
 L -^VPRJDX("count",GROUP,TOPIC)
 Q
 ;
 ; ----- Index Logic: tally by attribute value -----
 ;
TALLY ; TALLY index ("tally",group,value)=tally
 ; if FIELD has no value, count is not changed
 D KTALLY(.OLDOBJ)
 D STALLY(.NEWOBJ)
 S ^VPRJDX("tally",IDXNAME)=$H
 Q
STALLY(OBJECT) ; Increment a tally index
 Q:$D(OBJECT)<10
 N VALUES,I,TALLY
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . S TALLY=+$G(^VPRJDX("tally",IDXNAME,VALUES(I,1)))
 . S ^VPRJDX("tally",IDXNAME,VALUES(I,1))=TALLY+1
 Q
KTALLY(OBJECT) ; Decrement a tally index
 Q:$D(OBJECT)<10
 N VALUES,I,TALLY
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  D
 . S TALLY=+$G(^VPRJDX("tally",IDXNAME,VALUES(I,1)))
 . S ^VPRJDX("tally",IDXNAME,VALUES(I,1))=TALLY-1
 . I ^VPRJDX("tally",IDXNAME,VALUES(I,1))=0 K ^VPRJDX("tally",IDXNAME,VALUES(I,1))
 Q
 ;
 ; ----- Index Logic: attributes -----
 ;
ATTRIB ; ATTRIBUTE index ("attr",group,value,sort,key)
 D KATTRIB(.OLDOBJ)
 D SATTRIB(.NEWOBJ)
 S ^VPRJDX("attr",IDXNAME)=$H
 Q
SATTRIB(OBJECT) ; Set attribute based index
 Q:$D(OBJECT)<10
 ; SETIF conditional statement is in format "$$TAG^ROUTINE"
 N OK,SETIF
 S OK=1
 I $L(IDXMETA("setif")) S OK=0,SETIF=IDXMETA("setif")_"(.OBJECT)" I @SETIF S OK=1
 Q:'OK
 I $L(IDXMETA("review")) D
 . N REVIEW,REVTM
 . S REVIEW="S REVTM="_REVIEW_"(.OBJECT)" X REVIEW
 . S ^VPRJDX("keyReview",KEY,IDXNAME)=REVTM
 . S ^VPRJDX("review",REVTM,KEY,IDXNAME)=""
 ;
 I IDXMETA("levels")=0  D SA0  Q
 ;
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 I IDXMETA("levels")=1  D SA1  Q
 I IDXMETA("levels")=2  D SA2  Q
 I IDXMETA("levels")=3  D SA3  Q
 Q
KATTRIB(OBJECT) ; Kill attribute based index
 Q:$D(OBJECT)<10
 ;
 I $L(IDXMETA("review")) D
 . N REVTM
 . S REVTM=$G(^VPRJDX("keyReview",KEY,IDXNAME)) Q:'$L(REVTM)
 . K ^VPRJDX("keyReview",KEY,IDXNAME)
 . K ^VPRJDX("review",REVTM,KEY,IDXNAME)
 ;
 I IDXMETA("levels")=0  D KA0  Q
 ;
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 I IDXMETA("levels")=1  D KA1  Q
 I IDXMETA("levels")=2  D KA2  Q
 I IDXMETA("levels")=3  D KA3  Q
 Q
SA0 ; unsorted list set logic
 S ^VPRJDX("attr",IDXNAME,KEY)=""
 Q
KA0 ; unsorted list kill logic
 K ^VPRJDX("attr",IDXNAME,KEY)
 Q
SA1 ; one attribute set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRJDX("attr",IDXNAME,VALUES(I,1),KEY,I)=""
 Q
KA1 ; one attribute kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRJDX("attr",IDXNAME,VALUES(I,1),KEY,I)
 Q
SA2 ; two attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRJDX("attr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)=""
 Q
KA2 ; two attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRJDX("attr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)
 Q
SA3 ; three attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRJDX("attr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)=""
 Q
KA3 ; three attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRJDX("attr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)
 Q
 ;
REVERSE ; REV index
 ; ("rev",pointedToURN,relName,thisURN)
 D KREVERSE(.OLDOBJ)
 D SREVERSE(.NEWOBJ)
 S ^VPRJDX("rev",IDXNAME)=$H
 Q
SREVERSE(OBJECT) ; Set a relation link index
 Q:$D(OBJECT)<10
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRJDX("rev",VALUES(I,1),IDXNAME,KEY,I)=""
 Q
KREVERSE(OBJECT) ; Kill a relation link index
 Q:$D(OBJECT)<10
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRJDX("rev",VALUES(I,1),IDXNAME,KEY,I)
 Q
