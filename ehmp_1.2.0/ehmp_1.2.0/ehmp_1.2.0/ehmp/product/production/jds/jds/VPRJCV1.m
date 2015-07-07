VPRJCV1 ;SLC/KCM -- Set values into objects for expanded links
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
SETJSON(TARGET,VALS,SPEC,LEVEL) ; using UID's in VALS, put JSON in TARGET
 ; expects PID if retrieving from patient globals
 ; switch
 I SPEC(LEVEL,"tgtMethod")=0  G SETJSON0
 I SPEC(LEVEL,"tgtMethod")=1  G SETJSON1
 I SPEC(LEVEL,"tgtMethod")=2  G SETJSON2
 I SPEC(LEVEL,"tgtMethod")=99 G SETJSONR
 Q
SETJSON0 ; add JSON from VALS(1)
 Q:'$L($G(VALS(LEVEL)))
 N JSON
 D UID2JSN(VALS(LEVEL),.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 M TARGET(SPEC(LEVEL,"tgtPath",1),":")=JSON
 Q
SETJSON1 ; add JSON from VALS(n) as .TARGET(x,i,y)
 N I
 S I=0 F  S I=$O(VALS(LEVEL,I)) Q:'I  I $L(VALS(LEVEL,I)) D
 . N JSON
 . D UID2JSN(VALS(LEVEL,I),.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 . K TARGET(SPEC(LEVEL,"tgtPath",1),I,SPEC(LEVEL,"tgtPath",2))
 . M TARGET(SPEC(LEVEL,"tgtPath",1),I,SPEC(LEVEL,"tgtPath",2),":")=JSON
 Q
SETJSON2 ; add JSON from VALS(n) as .TARGET(x,i,y,j,z)
 N I,J
 S I=0 F  S I=$O(VALS(LEVEL,I)) Q:'I  D
 . S J=0 F  S J=$O(VALS(LEVEL,I,J)) Q:'J  I $L(VALS(LEVEL,I,J)) D
 . . N JSON
 . . D UID2JSN(VALS(LEVEL,I,J),.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 . . K TARGET(SPEC(LEVEL,"tgtPath",1),I,SPEC(LEVEL,"tgtPath",2),J,SPEC(LEVEL,"tgtPath",3))
 . . M TARGET(SPEC(LEVEL,"tgtPath",1),I,SPEC(LEVEL,"tgtPath",2),J,SPEC(LEVEL,"tgtPath",3),":")=JSON
 Q
SETJSONR ; add JSON from VALS(n) into .TARGET based on .SPEC
 I +$G(SPEC(LEVEL,"tgtArrays"))=0,$L(VALS(LEVEL)) D  Q  ;no arrays
 . N JSON
 . D UID2JSN(VALS(LEVEL),.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 . M @SPEC(LEVEL,"tgtRef")@(":")=JSON
 ; otherwise start iterating the arrays
 N I,J,N
 D SJNXTLVL(1)
 Q
SJNXTLVL(N) ; loop on the next node
 ; expects SPEC and LEVEL
 ; recursive, initially from SETJSON where I and N are newed
 ; if more arrays in VALS than in target, use $QUERY
 I (N=SPEC(LEVEL,"tgtArrays")),(N<SPEC(LEVEL,"valArrays")) D SJQUERY(N) QUIT
 ;
 ;otherwise handle next array level normally
 S I(N)=0 F  S I(N)=$O(@SPEC(LEVEL,"valArrays",N)) Q:'I(N)  D
 . I N<SPEC(LEVEL,"valArrays") D SJNXTLVL(N+1) Q  ; not last array level
 . N JSON
 . D UID2JSN(@SPEC(LEVEL,"valRef"),.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 . S J=I(N)
 . M @SPEC(LEVEL,"tgtRef")@(":")=JSON
 Q
SJQUERY(N) ; use $QUERY to get the rest of the levels
 ; expects SPEC and LEVEL
 N ROOT,X
 S J=0
 S I(N)=0 F  S I(N)=$O(@SPEC(LEVEL,"valArrays",N)) Q:'I(N)  D
 . S ROOT=$NA(@SPEC(LEVEL,"valArrays",N)),X=ROOT,ROOT=$E(X,1,$L(X)-1)
 . F  S X=$Q(@X) Q:$E(X,1,$L(ROOT))'=ROOT  S J=J+1 D
 . . N JSON
 . . D UID2JSN(@X,.JSON,$G(SPEC(LEVEL,1,"srcTemplate")))
 . . M @SPEC(LEVEL,"tgtRef")@(":")=JSON  ; inside tgtRef I(N) is array index
 Q
UID2JSN(UID,JSON,TLTNM) ; get JSON for object using optional template
 ; expects PID for patient data
 ;
 I $G(HTTPREQ("store"))="data" G UID2JSND ; jump to use non-patient globals
 ;
 N STAMP,NAME
 S STAMP=$O(^VPRPTJ("JSON",PID,UID,""),-1)
 I STAMP'="" S NAME=$NA(^VPRPTJ("JSON",PID,UID,STAMP))
 I STAMP="" S NAME=$NA(^VPRPTJ("JSON",PID,UID))
 I '$L($G(TLTNM)) M JSON=@NAME I 1
 E  M JSON=^VPRPTJ("TEMPLATE",PID,UID,TLTNM) ; save-time template
 I '$D(JSON) S JSON="{""unknownUid"":"""_UID_"""}"
 ;TODO: handle query time templates here
 Q
UID2JSND ; branch here to use non-patient globals
 N STAMP
 S STAMP=$O(^VPRJDJ("JSON",UID,""),-1)
 I '$L($G(TLTNM)) M JSON=^VPRJDJ("JSON",UID,STAMP) I 1
 E  M JSON=^VPRJDJ("TEMPLATE",UID,TLTNM) ; save-time template
 I '$D(JSON) S JSON="{""unknownUid"":"""_UID_"""}"
 ;TODO: handle query time templates here
 Q
 ;
 ; based on GETVALS^VPRJCV
 ;
GETVALS(OBJECT,VALS,SPEC,FLD) ; put values defined by SPEC into VALS
 ;.VALS(FLD)=top level value
 ;.VALS(FLD,inst,inst,...)=value inside array(s)
 ;
 ; switch begin
 I SPEC(FLD,1,"srcMethod")=0  G IVAL0
 I SPEC(FLD,1,"srcMethod")=1  G IVAL1
 I SPEC(FLD,1,"srcMethod")=2  G IVAL2
 I SPEC(FLD,1,"srcMethod")=99 G GETVALR
 ; switch end
 Q
 ;
IVAL0 ; get single value with no arrays
 N X
 S X=$G(OBJECT(SPEC(FLD,1,"srcPath",1)))
 S VALS(FLD)=X
 Q
IVAL1 ; build VALS(n) for x[].y
 N I,X
 S I=0 F  S I=$O(OBJECT(SPEC(FLD,1,"srcPath",1),I)) Q:'I  D
 . S X=$G(OBJECT(SPEC(FLD,1,"srcPath",1),I,SPEC(FLD,1,"srcPath",2)))
 . Q:'$L(X)  S VALS(FLD,I)=X
 Q
IVAL2 ; build VALS(n) for x[].y[].z
 N I,J,X
 S I=0 F  S I=$O(OBJECT(SPEC(FLD,1,"srcPath",1),I)) Q:'I  D
 . S J=0 F  S J=$O(OBJECT(SPEC(FLD,1,"srcPath",1),I,SPEC(FLD,1,"srcPath",2),J)) Q:'J  D
 . . S X=$G(OBJECT(SPEC(FLD,1,"srcPath",1),I,SPEC(FLD,1,"srcPath",2),J,SPEC(FLD,1,"srcPath",3)))
 . . Q:'$L(X)  S VALS(FLD,I,J)=X
 Q
GETVALR ; build VALS(n) based on .SPEC
 ; VALS(n{,o,p,...})=values subscripted by path of instances
 N I,N
 I +$G(SPEC(FLD,1,"srcArrays"))=0 S VALS(FLD,1)=$G(@SPEC(FLD,1,"srcRef")) Q
 D NXTNODE(1)
 Q
NXTNODE(N) ; loop on the next node
 ; recursive, initially from GETVALR where I,N are newed
 S I(N)=0
 F  S I(N)=$O(@SPEC(FLD,1,"srcArrays",N,"ref")) Q:'I(N)  D
 . I N<SPEC(FLD,1,"srcArrays") D NXTNODE(N+1) Q  ; not last array level
 . S @SPEC(FLD,"valRef")=$G(@SPEC(FLD,1,"srcRef"))
 Q
