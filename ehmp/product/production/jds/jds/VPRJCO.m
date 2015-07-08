VPRJCO ;SLC/KCM -- Common Utilities for handling sorting (order parameter)
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
SETORDER(ORDER) ; set up the order subscripts
 ; expects INDEX for /index/indexname queries, otherwise INDEX undefined
 ; expects TEMPLATE (may be empty)
 ; INDEX, if defined, is from ^VPRMETA("index",name,"common")
 ; returns:
 ;   ORDER(0)=#                ; sort levels
 ;   ORDER(#)=#|name           ; level # or field name
 ;   ORDER(#,"dir")=1 or -1    ; asc or desc
 ;   ; if the field is not part of the subscripts
 ;   ORDER(#,0,fieldSpecInfo)
 ;   ORDER(#,collection,fieldSpecInfo)
 ;   ORDER(#,"ftype")=1|2|3|4  ; field name structure
 ;   ORDER(#,"field")=name     ; field name
 ;   ORDER(#,"mult")=name      ; multiple name
 ;   ORDER(#,"sub")=name       ; subfield name
 ;   ORDER(#,"instance")=level ; which field to use for multiple instance
 ;
 N I,X,F,D,S                             ; F=field, D=direction
 S S=0                                   ; S=number of sort levels
 S X=$$LOW^XLFSTR($$TRIM^XLFSTR(ORDER))  ; if only "asc" or "desc" passed
 I X="asc"!(X="desc") S ORDER=$P($G(INDEX("order"))," ")_" "_X
 S X=$P(ORDER," ")
 I X="asc"!(X="desc") D SETERROR^VPRJRER(110) Q  ; missing order field
 I '$L(ORDER) S ORDER=$G(INDEX("order")) ; use default if no ORDER parameter
 I '$L(ORDER) S ORDER(0)=0 Q             ; no sorting
 ; loop through the sorting levels (delimited by commas)
 F I=1:1:$L(ORDER,",") S X=$$TRIM^XLFSTR($P(ORDER,",",I)) Q:'$L(X)  D  Q:$G(HTTPERR)
 . S S=S+1
 . S F=$$TRIM^XLFSTR($P(X," "))
 . S D=$$LOW^XLFSTR($$TRIM^XLFSTR($P(X," ",2))) S:'$L(D) D="asc"
 . ; if sorting on something already in the index, use the index value
 . S ORDER(I)=$S($D(INDEX("alias",F)):INDEX("alias",F),1:F)
 . I +ORDER(I),$G(INDEX("collate",ORDER(I)))="V" S D=$S(D="asc":"desc",1:"asc")
 . S ORDER(I,"dir")=$S(D="desc":-1,1:1)
 . Q:+ORDER(I)
 . I F["[" D SETERROR^VPRJRER(109,F) Q  ; arrays have to be indexed for sorting
 . N SPEC
 . D FLDSPEC^VPRJCD(F,.SPEC,$S(HTTPREQ("store")="data":"data",1:"vpr"))
 . M ORDER(I,0)=SPEC
 . Q:'$L(TEMPLATE)
 . ; TODO: iterate through template aliases and build a spec for each collection
 S ORDER(0)=S
 Q
 ;
