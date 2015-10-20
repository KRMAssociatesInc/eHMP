VPRJODM ;KRM/CJE -- Handle Operational Data Mutable storage
 ;;1.0;JSON DATA STORE;;Jan 27, 2015
 ;
 ; No entry from top
 Q
 ;
SET(ARGS,BODY)	; Store or update a operational data mutable item based on the passed in site id (sid)
 N OBJECT,ERR,SID
 D DECODE^VPRJSON("BODY","OBJECT","ERR") ; From JSON to an array
 I $D(ERR) D SETERROR^VPRJRER(202) Q ""
 ; _id is a required field
 I $G(OBJECT("_id"))="" D SETERROR^VPRJRER(220) Q ""
 S SID=OBJECT("_id")
 L +^VPRJODM(SID):2 E  D SETERROR^VPRJRER(502) Q ""
 TSTART
 I $O(^VPRJODM(SID,""))']"" S ^VPRJODM(0)=$G(^VPRJODM(0))+1
 K ^VPRJODM(SID)
 M ^VPRJODM(SID)=OBJECT
 TCOMMIT
 L -^VPRJODM(SID)
 Q ""
 ;
CLR(RESULT,ARGS)	; Clear ALL OPERATIONAL DATA MUTABLE!!!
 ;**** This operation is IRREVERSIBLE!!!!!! ****
 N VPRJA
 L +^VPRJODM:2 E  D SETERROR^VPRJRER(502) Q
 S VPRJA=0
 TSTART
 F  S VPRJA=$O(^VPRJODM(VPRJA)) Q:VPRJA']""  K ^VPRJODM(VPRJA)
 S ^VPRJODM(0)=0
 TCOMMIT
 L -^VPRJODM
 S RESULT="{}"
 Q
 ;
DEL(RESULT,ARGS)	; Delete a given operational data mutable
 I $$UNKARGS^VPRJCU(.ARGS,"_id") Q
 I $G(ARGS("_id"))="" D SETERROR^VPRJRER(111,"_id is blank") Q
 I $D(^VPRJODM(ARGS("_id"))) D
 .L +^VPRJODM(ARGS("_id"))
 .TSTART
 .K ^VPRJODM(ARGS("_id"))
 .S ^VPRJODM(0)=$G(^VPRJODM(0))-1
 .TCOMMIT
 .L -^VPRJODM(ARGS("_id"))
 S RESULT="{}"
 Q
 ;
LEN(RESULT,ARGS)	; Returns the total number of operational data mutable items
 N VPRJA,VPRJB,VPRJQ
 ; Start global iterator (VPRJA) at 0 to skip zero node
 ; VPRJB is the count
 S (VPRJA,VPRJB)=0
 L +^VPRJODM:2 E  D SETERROR^VPRJRER(502) Q
 F  S VPRJA=$O(^VPRJODM(VPRJA)) Q:VPRJA']""  S VPRJB=VPRJB+1
 S ^VPRJODM(0)=VPRJB
 L -^VPRJODM
 S VPRJQ=""""
 S RESULT="{"_VPRJQ_"length"_VPRJQ_":"_VPRJQ_+$G(^VPRJODM(0))_VPRJQ_"}"
 Q
 ;
GET(RESULT,ARGS) ; Returns operational data mutable info
 N OBJECT,ERR,SID,ID,BODY,FILTER,CLAUSES,CLAUSE,INC
 I $$UNKARGS^VPRJCU(.ARGS,"_id,filter") Q
 I $G(ARGS("_id"))=""&($G(ARGS("filter"))="") D SETERROR^VPRJRER(111,"_id is blank") Q
 ;
 ; Parse any filters we got
 ; this will only be supported for get all
 S FILTER=$G(ARGS("filter"))
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 ;
 ; Build requested data array
 I $G(ARGS("_id"))'="" D
 . ; The client requested specific data
 . S SID=ARGS("_id")
 . M OBJECT=^VPRJODM(SID)
 E  D
 . ; The client requested all data
 . S ID=0 ; Skip 0 node
 . F INC=1:1 S ID=$O(^VPRJODM(ID)) Q:ID=""  D
 . . ; Eval filter if clauses exists
 . . ; This uses the basics of EVALEXPR^VPRJCF not a complete implementation
 . . ; If the clause evaluates to true add it to the return
 . . ; EVALONE requires CLAUSE and VALUE
 . . I $D(CLAUSES) D  Q
 . . . N I
 . . . S I=""
 . . . ; Loop through all of the clauses we have
 . . . F  S I=$O(CLAUSES(I)) Q:I=""  D
 . . . . M CLAUSE=CLAUSES(I)
 . . . . I CLAUSE("type")=1 S VALUE=$G(^VPRJODM(ID,CLAUSE("field")))
 . . . . I CLAUSE("type")=2 S VALUE=$G(^VPRJODM(ID,CLAUSE("field"),CLAUSE("sub")))
 . . . . M:$$EVALONE^VPRJCF OBJECT("items",INC)=^VPRJODM(ID)
 . . E  M OBJECT("items",INC)=^VPRJODM(ID)
 ;
 ; Encode requested data array into JSON
 D ENCODE^VPRJSON("OBJECT","BODY","ERR") ; From an array to JSON
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 m ^KBBO("OUTPUT")=OBJECT
 M RESULT=BODY
 Q
