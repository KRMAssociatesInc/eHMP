VPRJPXA ;SLC/KCM -- Attribute Style Indexes for patient (VPR) objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ;
 ; ----- Index Logic: attributes by patient -----
 ;
ATTRIB ; ATTRIBUTE index (PID,"attr",group,value(s)...,key)
 D KATTRIB(.OLDOBJ)
 D SATTRIB(.NEWOBJ)
 S ^VPRPTI(PID,"attr",IDXNAME)=$H
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
 . S ^VPRPTI(PID,"review",KEY,IDXNAME)=REVTM
 . S ^VPRPTX("review",REVTM,PID,KEY,IDXNAME)=""
 . S ^VPRPTX("pidReview",PID,REVTM)=""
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
 . S REVTM=$G(^VPRPTI(PID,"review",KEY,IDXNAME)) Q:'$L(REVTM)
 . K ^VPRPTI(PID,"review",KEY,IDXNAME)
 . K ^VPRPTX("review",REVTM,PID,KEY,IDXNAME)
 . K ^VPRPTX("pidReview",PID,REVTM)
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
 S ^VPRPTI(PID,"attr",IDXNAME,KEY)=""
 Q
KA0 ; unsorted list kill logic
 K ^VPRPTI(PID,"attr",IDXNAME,KEY)
 Q
SA1 ; one attribute set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),KEY,I)=""
 Q
KA1 ; one attribute kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),KEY,I)
 Q
SA2 ; two attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)=""
 Q
KA2 ; two attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)
 Q
SA3 ; three attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)=""
 Q
KA3 ; three attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTI(PID,"attr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)
 Q
 ;
 ; ----- Index Logic: attributes across patients -----
 ;
XATTR ; ATTRIBUTE index ("xattr",group,value(s)...,key)
 D KXATTR(.OLDOBJ)
 D SXATTR(.NEWOBJ)
 S ^VPRPTX("xattr",IDXNAME)=$H
 Q
SXATTR(OBJECT) ; Set attribute based index
 Q:$D(OBJECT)<10
 ; SETIF conditional statement is in format "$$TAG^ROUTINE"
 N OK,SETIF
 S OK=1
 I $L(IDXMETA("setif")) S OK=0,SETIF=IDXMETA("setif")_"(.OBJECT)" I @SETIF S OK=1
 Q:'OK
 I $L(IDXMETA("review")) D
 . N REVIEW,REVTM
 . S REVIEW="S REVTM="_REVIEW_"(.OBJECT)" X REVIEW
 . S ^VPRPTI(PID,"review",KEY,IDXNAME)=REVTM
 . S ^VPRPTX("review",REVTM,PID,KEY,IDXNAME)=""
 . S ^VPRPTX("pidReview",PID,REVTM)=""
 ;
 I IDXMETA("levels")=0  D SXA0  Q
 ;
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 I IDXMETA("levels")=1  D SXA1  Q
 I IDXMETA("levels")=2  D SXA2  Q
 I IDXMETA("levels")=3  D SXA3  Q
 Q
KXATTR(OBJECT) ; Set attribute based index
 Q:$D(OBJECT)<10
 ;
 I $L(IDXMETA("review")) D
 . N REVTM
 . S REVTM=$G(^VPRPTI(PID,"review",KEY,IDXNAME)) Q:'$L(REVTM)
 . K ^VPRPTI(PID,"review",KEY,IDXNAME)
 . K ^VPRPTX("review",REVTM,PID,KEY,IDXNAME)
 . K ^VPRPTX("pidReview",PID,REVTM)
 ;
 I IDXMETA("levels")=0  D KXA0  Q
 ;
 N VALUES,I
 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.IDXMETA) Q:'$D(VALUES)
 I IDXMETA("levels")=1  D KXA1  Q
 I IDXMETA("levels")=2  D KXA2  Q
 I IDXMETA("levels")=3  D KXA3  Q
 Q
SXA0 ; unsorted list set logic
 S ^VPRPTX("xattr",IDXNAME,KEY)=""
 Q
KXA0 ; unsorted list kill logic
 K ^VPRPTX("xattr",IDXNAME,KEY)
 Q
SXA1 ; one attribute set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTX("xattr",IDXNAME,VALUES(I,1),KEY,I)=""
 Q
KXA1 ; one attribute kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTX("xattr",IDXNAME,VALUES(I,1),KEY,I)
 Q
SXA2 ; two attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTX("xattr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)=""
 Q
KXA2 ; two attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTX("xattr",IDXNAME,VALUES(I,1),VALUES(I,2),KEY,I)
 Q
SXA3 ; three attributes set logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  S ^VPRPTX("xattr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)=""
 Q
KXA3 ; three attributes kill logic
 S I="" F  S I=$O(VALUES(I)) Q:I=""  K ^VPRPTX("xattr",IDXNAME,VALUES(I,1),VALUES(I,2),VALUES(I,3),KEY,I)
 Q
