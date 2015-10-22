VPRJERR ;KRM/CJE -- Handle User error operations
 ;;1.0;JSON DATA STORE;;MAY 27, 2015
 ;
 Q
 ;
SET(ARGS,BODY)  ; Store error(s) based on the passed in id
 N OBJECT,ERR,ERRNUM,RESULT
 D DECODE^VPRJSON("BODY","OBJECT","ERR") ; From JSON to an array
 I $D(ERR) D SETERROR^VPRJRER(202) Q ""  ; 
 L +^VPRJERR(0):2 E  D SETERROR^VPRJRER(502) Q ""
 TSTART
 S ERRNUM=$G(^VPRJERR(0))+1
 S ^VPRJERR(0)=ERRNUM
 TCOMMIT
 L -^VPRJERR(0)
 S OBJECT("id")=ERRNUM
 M ^VPRJERR(ERRNUM)=OBJECT
 Q ""
 ;
CLR(RESULT,ARGS)  ; Clear ALL user data object!!!
 ;**** This operation is IRREVERSIBLE!!!!!! ****
 N VPRJA
 L +^VPRJERR:2 E  D SETERROR^VPRJRER(502) Q
 S VPRJA=0
 TSTART
 F  S VPRJA=$O(^VPRJERR(VPRJA)) Q:VPRJA']""  K ^VPRJERR(VPRJA)
 S ^VPRJERR(0)=0
 TCOMMIT
 L -^VPRJERR
 S RESULT="{}"
 Q
 ;
DEL(RESULT,ARGS)  ; Delete a given user data object
 I $G(ARGS("id"))="" D SETERROR^VPRJRER(111,"id is blank") Q 
 I $D(^VPRJERR(ARGS("id"))) D
 . L +^VPRJERR(0)
 . TSTART
 . K ^VPRJERR(ARGS("id"))
 . TCOMMIT
 . L -^VPRJERR(0)
 S RESULT="{}"
 Q
 ;
LEN(RESULT,ARGS)  ; Returns the total number of user data objects
 N VPRJA,VPRJB,VPRJQ
 S (VPRJA,VPRJB)=0
 L +^VPRJERR:2 E  D SETERROR^VPRJRER(502) Q
 F  S VPRJA=$O(^VPRJERR(VPRJA)) Q:VPRJA=""  D
 . S VPRJB=VPRJB+1
 L -^VPRJERR
 S VPRJQ=""""
 S RESULT="{"_VPRJQ_"length"_VPRJQ_":"_VPRJQ_+VPRJB_VPRJQ_"}"
 Q
 ;
GET(RESULT,ARGS) ; Returns user data object
 N OBJECT,FILTER,CLAUSES,CLAUSE,ERR,BODY,ITEM
 I $$UNKARGS^VPRJCU(.ARGS,"id,filter") Q
 ; Get any filters and parse them into CLAUSES
 S FILTER=$G(ARGS("filter"))
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 ; Set OBJECT into ^TMP($J)
 S OBJECT=$NA(^TMP($J,"OBJECT"))
 ; Ensure variables are cleaned out
 K @OBJECT
 ; Get single object
 I $G(ARGS("id"))'="" D
 . M ^TMP($J,"OBJECT","items",1)=^VPRJERR(ARGS("id"))
 . I '$D(@OBJECT) S ERR=1
 I $D(ERR) D SETERROR^VPRJRER(229,"id "_ARGS("id")_" doesn't exist") Q
 ; Eval filter if clauses exists
 ; This uses the basics of EVALEXPR^VPRJCF not a complete implementation
 ; If the clause evaluates to true add it to the return
 ; EVALONE requires CLAUSE and VALUE
 I $D(CLAUSES) D
 . N I
 . S I=""
 . ; Loop through all of the clauses we have
 . F  S I=$O(CLAUSES(I)) Q:I=""  D
 . . M CLAUSE=CLAUSES(I)
 . . I CLAUSE("type")=1 D
 . . ; Loop through all object to match the filter
 . . S ITEM=""
 . . F  S ITEM=$O(^VPRJERR(ITEM)) Q:ITEM=""  D
 . . . S:CLAUSE("type")=1 VALUE=$G(^VPRJERR(ITEM,CLAUSE("field")))
 . . . S:CLAUSE("type")=2 VALUE=$G(^VPRJERR(ITEM,CLAUSE("field"),CLAUSE("sub")))
 . . . M:$$EVALONE^VPRJCF ^TMP($J,"OBJECT","items",ITEM)=^VPRJERR(ITEM)
 ; Get all objects if no id passed or filter
 I '$D(@OBJECT)&'$D(CLAUSES) D
 . N ITEM
 . S ITEM=""
 . F  S ITEM=$O(^VPRJERR(ITEM)) Q:ITEM=""  D
 . . M ^TMP($J,"OBJECT","items",ITEM)=^VPRJERR(ITEM)
 ; Set Result variable to global
 S RESULT=$NA(^TMP($J,"RESULT"))
 K @RESULT
 ; Encode object into JSON return
 D ENCODE^VPRJSON(OBJECT,RESULT,"ERR") ; From an array to JSON
 ; Clean up staging variable
 K @OBJECT
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 Q
 ;
