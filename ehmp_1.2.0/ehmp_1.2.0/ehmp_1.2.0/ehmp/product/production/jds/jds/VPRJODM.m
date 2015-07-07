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
 N OBJECT,ERR,SID
 I $$UNKARGS^VPRJCU(.ARGS,"_id") Q
 I $G(ARGS("_id"))="" D SETERROR^VPRJRER(111,"_id is blank") Q
 S SID=ARGS("_id")
 M OBJECT=^VPRJODM(SID)
 D ENCODE^VPRJSON("OBJECT","BODY","ERR") ; From an array to JSON
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 M RESULT=BODY
 Q
