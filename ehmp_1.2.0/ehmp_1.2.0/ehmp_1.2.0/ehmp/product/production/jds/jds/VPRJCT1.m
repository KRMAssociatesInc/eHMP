VPRJCT1 ;SLC/KCM -- Apply Rel and Rev Templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
RELTLTP(ROOT,KEY,TLT,PID) ; apply rel template for VPR and put in ROOT
 N CTN,OBJECT,STAMP
 ; Get latest object stamp
 S STAMP=$O(^VPRPT(PID,KEY,""),-1)
 ; TODO: check to see if PID is defined here for xvpr queries
 S CTN=$P(KEY,":",3) M OBJECT=^VPRPT(PID,KEY,STAMP)
 G RELTLT
 ;
RELTLTD(ROOT,KEY,TLT) ; apply rel template for DATA and put in ROOT
 N CTN,OBJECT,STAMP
 ; Get latest object stamp
 S STAMP=$O(^VPRJD(KEY,""),-1)
 S CTN=$P(KEY,":",3) M OBJECT=^VPRJD(KEY,STAMP)
 G RELTLT
 ;
RELTLT ; common entry point for rel template
 ; from: RELTLTP, RELTLTD  expects: CTN, OBJECT
 ; ROOT: closed global reference like ^TMP($J)
 ; ITEM: item or record number
 ; KEY: KEY in the ^VPRPT or ^VPRJD
 ; .TLT: rel,relname
 ; .TLT(collection,...): information for template based on collection
 N SPEC,VALS,ERRS
 M SPEC=TLT("collection",CTN)
 ; just return UID if there is not template defined for this collection
 I '$D(SPEC) S @ROOT@(1)="{""uid"":"""_$G(OBJECT("uid"))_"""}" Q
 D GETVALS^VPRJCV1(.OBJECT,.VALS,.SPEC,1)
 D SETJSON^VPRJCV1(.OBJECT,.VALS,.SPEC,1)
 D ENCODE^VPRJSON("OBJECT",ROOT,"ERRS")
 ; TODO: figure out how to throw an error at this point (writing out response)
 Q
 ;
REVTLTP(ROOT,KEY,TLT,PID) ; add multiple for rev template and put in ROOT
 N OBJECT,REVFLD,REL,UID,CNT
 S REVFLD=TLT("common","rev"),REL=TLT("common","rel"),CNT=0
 ; TODO: check to see if PID is defined here for xvpr queries
 M OBJECT=^VPRPT(PID,KEY)
 S UID="" F  S UID=$O(^VPRPTI(PID,"rev",KEY,REL,UID)) Q:UID=""  D REVTLT
 D ENCODE^VPRJSON("OBJECT",ROOT,"ERRS")
 ; TODO: figure out how to throw an error at this point (writing out response)
 Q
 ;
REVTLTD(ROOT,KEY,TLT) ; apply rev template for DATA and put in ROOT
 N OBJECT,REVFLD,REL,UID,CNT,STAMP
 S STAMP=$O(^VPRJD(KEY,""),-1)
 S REVFLD=TLT("common","rev"),REL=TLT("common","rel"),CNT=0
 M OBJECT=^VPRJD(KEY,STAMP)
 S UID="" F  S UID=$O(^VPRJDX("rev",KEY,REL,UID)) Q:UID=""  D REVTLT
 D ENCODE^VPRJSON("OBJECT",ROOT,"ERRS")
 ; TODO: figure out how to throw an error at this point (writing out response)
 Q
 ;
REVTLT ; common entry point for rev template
 ; from: REVTLTP, REVTLTD  expects: CTN, OBJECT
 S CNT=CNT+1
 I $G(TLT("common","revTemplate"))="uid" S OBJECT(REVFLD,CNT,"uid")=UID Q
 ; otherwise apply template
 N JSON
 D UID2JSN^VPRJCV1(UID,.JSON,TLT("common","revTemplate"))
 M OBJECT(REVFLD,CNT,":")=JSON
 Q
 ;
BLDTLT(CLTN,OBJECT,TLTARY) ; Build JSON objects for associated templates
 ; from: ^VPRJDS, ^VPRJPS
 ; CLTN identifies the collection
 ; OBJECT is the decoded JSON object as a MUMPS array
 ; TLTARY is the array of JSON objects that get built based on templates
 N TLTNM,TJSON
 S TLTNM="" F  S TLTNM=$O(^VPRMETA("collection",CLTN,"template",TLTNM)) Q:TLTNM=""  D  Q:$G(HTTPERR)
 . I $D(^VPRMETA("template",TLTNM,"collection",CLTN))<10 D SETERROR^VPRJRER(219,TLTNM) Q
 . I $G(^VPRMETA("template",TLTNM,"common","applyOn"))'="S" Q  ; skip applyOnQuery
 . N SPEC
 . S SPEC=TLTNM
 . M SPEC=^VPRMETA("template",TLTNM,"collection",CLTN)
 . D APPLY^VPRJCT(.SPEC,.OBJECT,.TJSON) Q:$G(HTTPERR)
 . M TLTARY(TLTNM)=TJSON
 Q
QRYTLT(ROOT,KEY,TLT,PID,INST) ; apply template at query time and put in ROOT
 Q
LOADSPEC(TEMPLATE) ; load the specification for a template
 ;  TEMPLATE contains the template name
 ; .TEMPLATE(collection,...): returned information
 Q:TEMPLATE="uid"  ; special case - uid is hard coded template
 N TYPE,NAME,RELTLT
 S TYPE="template",NAME=TEMPLATE
 I $E(TEMPLATE,1,4)="rel;" S TYPE="link",NAME=$P(TEMPLATE,";",2),RELTLT=$P(TEMPLATE,";",3)
 I $E(TEMPLATE,1,4)="rev;" S TYPE="link",NAME=$P(TEMPLATE,";",2),RELTLT=$P(TEMPLATE,";",3)
 I '$D(^VPRMETA(TYPE,NAME)) D SETERROR^VPRJRER(105,NAME) Q
 I TYPE="template",($G(^VPRMETA("template",NAME,"common","applyOn"))'="Q") Q  ; only merge query type
 M TEMPLATE=^VPRMETA(TYPE,NAME)
 I $P(TEMPLATE,";")="rev",'$L($G(TEMPLATE("common","rev"))) D SETERROR^VPRJRER(113,TEMPLATE) Q
 I $L($G(RELTLT)) D
 . I $P(TEMPLATE,";")="rev" S TEMPLATE("common","revTemplate")=RELTLT Q
 . N CTN
 . S CTN="" F  S CTN=$O(TEMPLATE("collection",CTN)) Q:'$L(CTN)  S TEMPLATE("collection",CTN,1,1,"srcTemplate")=RELTLT
 Q
