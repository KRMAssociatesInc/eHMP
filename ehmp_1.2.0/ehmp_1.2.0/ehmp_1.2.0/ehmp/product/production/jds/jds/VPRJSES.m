VPRJSES ;CNP/JD -- Handle Session operations
 ;;1.0;JSON DATA STORE;;Nov 04, 2014
 ;
 Q
 ;
SET(ARGS,BODY) ; Store or update a session based on the passed in session id (sid)
 N DEMOG,ERR,SID
 D DECODE^VPRJSON("BODY","DEMOG","ERR") ; From JSON to an array
 I $D(ERR) D SETERROR^VPRJRER(202) Q ""
 I $G(DEMOG("_id"))="" D SETERROR^VPRJRER(220) Q ""
 S SID=DEMOG("_id")
 L +^VPRJSES(SID):2 E  D SETERROR^VPRJRER(502) Q ""
 TSTART
 I $O(^VPRJSES(SID,""))']"" S ^VPRJSES(0)=$G(^VPRJSES(0))+1
 K ^VPRJSES(SID)
 M ^VPRJSES(SID)=DEMOG
 TCOMMIT
 L -^VPRJSES(SID)
 Q ""
 ;
CLR(RESULT,ARGS) ; Clear ALL sessions!!!
 ;**** This operation is IRREVERSIBLE!!!!!! ****
 N VPRJA
 L +^VPRJSES:2 E  D SETERROR^VPRJRER(502) Q
 S VPRJA=0
 TSTART
 F  S VPRJA=$O(^VPRJSES(VPRJA)) Q:VPRJA']""  K ^VPRJSES(VPRJA)
 S ^VPRJSES(0)=0
 TCOMMIT
 L -^VPRJSES
 S RESULT="{}"
 Q
 ;
DEL(RESULT,ARGS) ; Delete a given session
 I $$UNKARGS^VPRJCU(.ARGS,"_id") Q
 I $G(ARGS("_id"))="" D SETERROR^VPRJRER(111,"_id is blank") Q
 I $D(^VPRJSES(ARGS("_id"))) D
 .L +^VPRJSES(ARGS("_id"))
 .TSTART
 .K ^VPRJSES(ARGS("_id"))
 .S ^VPRJSES(0)=$G(^VPRJSES(0))-1
 .TCOMMIT
 .L -^VPRJSES(ARGS("_id"))
 S RESULT="{}"
 Q
 ;
LEN(RESULT,ARGS) ; Returns the total number of sessions
 N VPRJA,VPRJB,VPRJQ
 S (VPRJA,VPRJB)=0
 L +^VPRJSES:2 E  D SETERROR^VPRJRER(502) Q
 F  S VPRJA=$O(^VPRJSES(VPRJA)) Q:VPRJA']""  S VPRJB=VPRJB+1
 S ^VPRJSES(0)=VPRJB
 L -^VPRJSES
 S VPRJQ=""""
 S RESULT="{"_VPRJQ_"length"_VPRJQ_":"_VPRJQ_+$G(^VPRJSES(0))_VPRJQ_"}"
 Q
 ;
GET(RESULT,ARGS) ; Returns session info
 N DEMOG,ERR,SID
 I $$UNKARGS^VPRJCU(.ARGS,"_id") Q
 I $G(ARGS("_id"))="" D SETERROR^VPRJRER(111,"_id is blank") Q
 S SID=ARGS("_id")
 M DEMOG=^VPRJSES(SID)
 D ENCODE^VPRJSON("DEMOG","BODY","ERR") ; From an array to JSON
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 M RESULT=BODY
 Q
