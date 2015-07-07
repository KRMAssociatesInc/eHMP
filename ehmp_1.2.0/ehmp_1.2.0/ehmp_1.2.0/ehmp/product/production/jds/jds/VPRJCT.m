VPRJCT ;SLC/KCM -- Apply Templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
APPLY(SPEC,OBJECT,JSON,INST) ; Apply template to object resulting in .JSON
 ;.SPEC:   the spec for this template (at the collection level)
 ;.OBJECT: object
 ;.JSON:   the returned JSON object
 ; INST:   the combined instance string for this template
 N TARGET,TINST,FLD,JSONERR
 I $D(SPEC)<10 D SETERROR^VPRJRER(105,SPEC) Q
 I $L($G(INST)) D EXPINST^VPRJCU(INST,.TINST)
 I SPEC(0,"exclude") D  ; exclude fields
 . M TARGET=OBJECT
 . S FLD=0 F  S FLD=$O(SPEC(FLD)) Q:FLD=""  D DELFLD(FLD)
 E  D                ; include fields
 . S FLD=0 F  S FLD=$O(SPEC(FLD)) Q:FLD=""  D ADDFLD(FLD,.TINST)
 K JSON ; Clear the output array, avoid subtle bugs
 D ENCODE^VPRJSON("TARGET","JSON","JSONERR")
 I $D(JSONERR) D SETERROR^VPRJRER(218,SPEC)
 Q
ADDFLD(LEVEL,TINST) ; Add node to TOBJ based on
 ; NOTE: merge is used for setting values so that the "\s" node is included
 N ASSIGN,SRC
 S ASSIGN=SPEC(LEVEL,"assign")
 I ASSIGN=0  G SETVAL0  ;   set x=a                    n=n
 I ASSIGN=1  G SETVAL1  ;   set x[].y=a[].b            an=an
 I ASSIGN=2  G SETVAL2  ;   set x[].y[].z=a[].b[].c    aan=aan
 ;
 I ASSIGN=10 G SETVAL10 ;   set x=a[#].b               n=#n
 I ASSIGN=11 G SETVAL11 ;   set x[].y=a[#].b           an=#n  or #n=#n
 I ASSIGN=12 G SETVAL12 ; merge x=a[#].*               n=#m   or nm=#m   (n=# +merge)
 ;
 I ASSIGN=20 G SETVAL20 ; merge x=a.*                  n=nm   or nm=nm   (n=n +merge)
 I ASSIGN=21 G SETVAL21 ; merge x[]=a[].*              a=am   or am=am   (a=a +merge)
 I ASSIGN=22 G SETVAL22 ; merge x[].y[]=a[].b[].*      aa=aam or aam=aam (aa=aa +merge)
 ;
 I ASSIGN=30 G SETVAL30 ; expand x>a
 I ASSIGN=31 G SETVAL31 ; expand x[]>a[].b
 ;
 I ASSIGN=50 G SETVAL50 ; collect x from a[].b         n=*n
 ;
 I ASSIGN=70 ; handle query
 I ASSIGN=71 ; handle function
 I ASSIGN=72 ; handle list procedure
 ;
 ;otherwise process recursively
 G SETVALUE
 Q
 ;
SETVAL0 ; set a single value with no arrays
 I '($D(OBJECT(SPEC(LEVEL,"srcPath",1)))#2) QUIT
 M TARGET(SPEC(LEVEL,"tgtPath",1))=OBJECT(SPEC(LEVEL,"srcPath",1))
 Q
SETVAL1 ; set a list of values with optional maximum and direction
 ; accomodates [], [n], [-n]
 N I,C
 S I="",C=0
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1
 . Q:'$L($G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))))
 . M TARGET(SPEC(LEVEL,"tgtPath",1),C,SPEC(LEVEL,"tgtPath",2))=OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))
 Q
SETVAL2 ; set double nested list of values with optional maximum and direction
 N I,J,C,D
 S I="",C=0
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1,J="",D=0
 . F  S J=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2),J),SPEC(LEVEL,"srcArrays",2,"dir")) Q:'J  D  Q:D'<SPEC(LEVEL,"srcArrays",2,"max")
 . . S D=D+1
 . . Q:'$L($G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2),J,SPEC(LEVEL,"srcPath",3))))
 . . M TARGET(SPEC(LEVEL,"tgtPath",1),C,SPEC(LEVEL,"tgtPath",2),D,SPEC(LEVEL,"tgtPath",3))=OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2),J,SPEC(LEVEL,"srcPath",3))
 Q
 ;
SETVAL10 ; set a single value to an instance
 N I
 S I=$G(TINST(SPEC(LEVEL,"srcArrays",1,"path"))) Q:'I
 Q:'$L($G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))))
 M TARGET(SPEC(LEVEL,"tgtPath",1))=OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))
 Q
SETVAL11 ; set a list value to an instance
 N I
 S I=$G(TINST(SPEC(LEVEL,"srcArrays",1,"path"))) Q:'I
 Q:'$L($G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))))
 M TARGET(SPEC(LEVEL,"tgtPath",1),I,SPEC(LEVEL,"tgtPath",2))=OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))
 Q
SETVAL12 ; merge a single value to an instance
 N I S I=$G(TINST(SPEC(LEVEL,"srcArrays",1,"path"))) Q:'I
 M TARGET(SPEC(LEVEL,"tgtPath",1))=OBJECT(SPEC(LEVEL,"srcPath",1),I)
 Q
 ;
SETVAL20 ; merge a single value with no arrays
 M TARGET(SPEC(LEVEL,"tgtPath",1))=OBJECT(SPEC(LEVEL,"srcPath",1))
 Q
SETVAL21 ; merge a list of values with optional maximum and direction
 ; accomodates [], [n], [-n]
 N I,C
 S I="",C=0
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1
 . M TARGET(SPEC(LEVEL,"tgtPath",1),C)=OBJECT(SPEC(LEVEL,"srcPath",1),I)
 Q
SETVAL22 ; set double nested list of values with optional maximum and direction
 N I,J,C,D
 S I="",C=0
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1,J="",D=0
 . F  S J=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2),J),SPEC(LEVEL,"srcArrays",2,"dir")) Q:'J  D  Q:D'<SPEC(LEVEL,"srcArrays",2,"max")
 . . S D=D+1
 . . M TARGET(SPEC(LEVEL,"tgtPath",1),C,SPEC(LEVEL,"tgtPath",2),D)=OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2),J)
 Q
 ;
SETVAL30 ; expand a single value
 N X,JSON
 S X=$G(OBJECT(SPEC(LEVEL,"srcPath",1))) Q:'$L(X)
 D UID2JSN^VPRJCV1(X,.JSON,$G(SPEC(LEVEL,"srcTemplate")))
 M TARGET(SPEC(LEVEL,"tgtPath",1),":")=JSON
 Q
SETVAL31 ; expand a list of values with optional maximum and direction
 ; accomodates [], [n], [-n]
 N I,C,X,JSON
 S I="",C=0
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1
 . S X=$G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2))) Q:'$L(X)
 . D UID2JSN^VPRJCV1(X,.JSON,$G(SPEC(LEVEL,"srcTemplate")))
 . M TARGET(SPEC(LEVEL,"tgtPath",1),C,":")=JSON
 Q
SETVAL50 ; set a collection from a list into a value
 N I,X,C,V
 S I="",C=0,V=""
 F  S I=$O(OBJECT(SPEC(LEVEL,"srcPath",1),I),SPEC(LEVEL,"srcArrays",1,"dir")) Q:'I  D  Q:C'<SPEC(LEVEL,"srcArrays",1,"max")
 . S C=C+1
 . S X=$G(OBJECT(SPEC(LEVEL,"srcPath",1),I,SPEC(LEVEL,"srcPath",2)))
 . I $L(X) S V=V_$S($L(V):SPEC(LEVEL,"srcArrays",1,"collect"),1:"")_X
 I $L(V) S TARGET(SPEC(LEVEL,"tgtPath",1))=V
 Q
 ;
SETVALUE ; set values in TARGET based on SPEC
 N J S J=0
 ; assign top level fields
 I $G(SPEC(LEVEL,"srcArrays"),0)=0 D  Q
 . I SPEC(LEVEL,"addType")=0 G ADDVALUE
 . I SPEC(LEVEL,"addType")=1 G MRGVALUE
 . I SPEC(LEVEL,"addType")=2 G EXPVALUE
 ; otherwise recursively iterate each array position
 N I,C
 D NXTNODE(1)
 Q
NXTNODE(N) ; iterate array at position N
 ; from SETVALSR, NXTNODR
 I SPEC(LEVEL,"srcArrays",N,"dir")=0 D  Q        ; just one instance
 . S I(N)=$G(TINST(SPEC(LEVEL,"srcArrays",N,"path"))) Q:'I(N)
 . D CHKNODE
 ;
 S I(N)="",C(N)=0                                ; multiple instances
 F  S I(N)=$O(@SPEC(LEVEL,"srcArrays",N,"ref"),SPEC(LEVEL,"srcArrays",N,"dir")) Q:'I(N)  D  Q:C(N)'<SPEC(LEVEL,"srcArrays",N,"max")
 . S C(N)=C(N)+1
 . D CHKNODE
 Q
CHKNODE ; recurse to next position if not last
 I N<SPEC(LEVEL,"srcArrays") D NXTNODE(N+1) Q    ; recurse to next array position
 I SPEC(LEVEL,"addType")=0 G ADDVALUE
 I SPEC(LEVEL,"addType")=1 G MRGVALUE
 I SPEC(LEVEL,"addType")=2 G EXPVALUE
 Q
ADDVALUE ; add single value if last position
 S J=J+1                                         ; J used for last array position (if any)
 N VALUE                                         ; otherwise assign value
 M VALUE=@SPEC(LEVEL,"srcRef")
 Q:'$L($G(VALUE))
 ; if collecting, keep appending to value using delimiter stored in "collect" node
 ; N is only present if there are arrays to collect from
 I $G(N),$L(SPEC(LEVEL,"srcArrays",N,"collect")) D
 . N X
 . S X=$G(@SPEC(LEVEL,"tgtRef"))
 . S VALUE=X_$S($L(X):SPEC(LEVEL,"srcArrays",N,"collect"),1:"")_VALUE
 ;
 M @SPEC(LEVEL,"tgtRef")=VALUE                   ; arrays are I(1)..I(N),J
 Q
MRGVALUE ; merge value if last position
 S J=J+1
 M @SPEC(LEVEL,"tgtRef")=@SPEC(LEVEL,"srcRef")
 Q
EXPVALUE ; expand value if last position
 S J=J+1
 N VALUE,JSON
 S VALUE=$G(@SPEC(LEVEL,"srcRef"))
 Q:'$L(VALUE)
 D UID2JSN^VPRJCV1(VALUE,.JSON,$G(SPEC(LEVEL,"srcTemplate")))
 M @SPEC(LEVEL,"tgtRef")@(":")=JSON
 Q
 ;
DELFLD(LEVEL) ; delete fields from TARGET
 I SPEC(LEVEL,"assign")=80 K TARGET(SPEC(LEVEL,"tgtPath",1)) QUIT
 ; kill top level field
 I $G(SPEC(LEVEL,"srcArrays"),0)=0 K @SPEC(LEVEL,"tgtRef") QUIT
 ; otherwise recursively iterate each array position
 N I,C,J
 D NXTNODD(1)
 Q
NXTNODD(N) ; iterate array at position N
 ; from MRGVALSR, NXTNODM
 I SPEC(LEVEL,"srcArrays",N,"dir")=0 D  Q        ; just one instance
 . S I(N)=$G(TINST(SPEC(LEVEL,"srcArrays",N,"path"))) Q:'I(N)
 . D DELVAL
 ;
 S I(N)="",C(N)=0                                ; multiple instances
 F  S I(N)=$O(@SPEC(LEVEL,"srcArrays",N,"ref"),SPEC(LEVEL,"srcArrays",N,"dir")) Q:'I(N)  D  Q:C(N)'<SPEC(LEVEL,"srcArrays",N,"max")
 . S C(N)=C(N)+1
 . D DELVAL
 Q
DELVAL ; delete value if last position, otherwise recurse to next
 I N<SPEC(LEVEL,"srcArrays") D NXTNODD(N+1) Q  ; recurse to next
 S J=I(N) ; incase were at the last level and J is used instead of I(N)
 K @SPEC(LEVEL,"tgtRef")
 Q
