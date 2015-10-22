VPRJPQ ;SLC/KCM -- Query for JSON patient objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ;TODO: if desc order, make sure limit starts at the right end
 ;
QKEY(PID,KEY,TEMPLATE) ; Return an object given the key
 N VPRDATA,ORDER
 S TEMPLATE=$G(TEMPLATE)
 I '$D(^VPRPTJ("JSON",PID,KEY)) D SETERROR^VPRJRER(104,"Pid:"_PID_" Key:"_KEY) Q
 K ^TMP("VPRDATA",$J)
 S ^TMP("VPRDATA",$J,KEY,0)=PID,VPRDATA=1,ORDER(0)=0
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
 ;
QTALLY(PID,CNTNM) ; Return a set of counts
 ; return tallies as data:{items:[{"topic":"MEDICATION,INPT","count":4}
 I '$L(CNTNM) D SETERROR^VPRJRER(101) Q
 N BUFFER S BUFFER=""
 ;
 N TOPIC,DATA,COUNT,X
 S DATA=0,TOPIC=""
 F  S TOPIC=$O(^VPRPTI(PID,"tally",CNTNM,TOPIC)) Q:TOPIC=""  D
 . S COUNT=+^VPRPTI(PID,"tally",CNTNM,TOPIC)
 . S X=$S('DATA:"",1:",")_"{""topic"":"""_TOPIC_""",""count"":"_COUNT_"}"
 . S DATA=DATA+1,DATA(DATA)=X
 S X=$$BLDHEAD^VPRJCB(DATA) D STAGE^VPRJCB(X)
 S DATA=0 F  S DATA=$O(DATA(DATA)) Q:'DATA  D STAGE^VPRJCB(DATA(DATA))
 D STAGE^VPRJCB("]}}"),OUT^VPRJCB
 Q
 ;
 ;defined at the QINDEX level:
 ;     PID:  VPR patient identifier
 ;   INDEX:  Name of the index
 ;   RANGE:  range of values, examples:  A..Z, GLUCOSE*>2010..2013, A,C,E
 ;   ORDER:  sequece of the returned valuse, examples:  desc | facilityName asc
 ;    BAIL:  maximum number of matches to return
 ;  METHOD:  style of index, "attr", "time"
 ;  FILTER:  criteria statement to further limit returned results
 ; CLAUSES:  clauses to apply filter to each object
 ;
QINDEX(PID,INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER) ; query based on index
 I '$L($G(INDEX)) D SETERROR^VPRJRER(101) Q
 N VPRDATA,METHOD,CLAUSES
 S RANGE=$G(RANGE),ORDER=$G(ORDER),BAIL=$G(BAIL),TEMPLATE=$G(TEMPLATE),FILTER=$G(FILTER)
 S VPRDATA=+$G(^TMP($J,"total")) S:'BAIL BAIL=999999
 M INDEX=^VPRMETA("index",INDEX,"common")
 S METHOD=$G(INDEX("method")) I '$L(METHOD) D SETERROR^VPRJRER(102,INDEX) Q
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 D SETORDER^VPRJCO(.ORDER) Q:$G(HTTPERR)
 K ^TMP("VPRDATA",$J)
 I $$ISJPID^VPRJPR(PID) D
 . ; We were handed a JPID convert to PID(s) and add to result
 . N PIDS,ID
 . D PID4JPID^VPRJPR(.PIDS,PID)
 . S ID=""
 . F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . . ; Overwrite PID with a real PID instead of a JPID
 . . S PID=PIDS(ID)
 . . I METHOD="time" D QTIME^VPRJPQA
 . . I METHOD="attr" D QATTR^VPRJPQA
 . . I METHOD="every" D QEVERY^VPRJPQA
 E  D
 . ; We were handed a real PID
 . I METHOD="time" D QTIME^VPRJPQA
 . I METHOD="attr" D QATTR^VPRJPQA
 . I METHOD="every" D QEVERY^VPRJPQA
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
QFIND(PID,COLL,ORDER,BAIL,TEMPLATE,FILTER) ; return items from collection without index
 N VPRDATA,CLAUSES,PREFIX,KEY
 S ORDER=$G(ORDER),BAIL=$G(BAIL),TEMPLATE=$G(TEMPLATE),FILTER=$G(FILTER)
 S VPRDATA=+$G(^TMP($J,"total")) S:'BAIL BAIL=999999
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 D SETORDER^VPRJCO(.ORDER) Q:$G(HTTPERR)
 K ^TMP("VPRDATA",$J)
 S PREFIX="urn:va:"_COLL_":",KEY=PREFIX
 I $$ISJPID^VPRJPR(PID) D
 . ; We were handed a JPID convert to PID(s) and add to result
 . N PIDS,ID
 . D PID4JPID^VPRJPR(.PIDS,PID)
 . N PID
 . S ID=""
 . F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . . ; Overwrite PID with a real PID instead of a JPID
 . . S PID=PIDS(ID)
 . . ; Re-initialize KEY with proper value as it gets overwritten in the next loop
 . . S KEY=PREFIX
 . . F  S KEY=$O(^VPRPT(PID,KEY)) Q:$E(KEY,1,$L(PREFIX))'=PREFIX  D
 . . . D ADDONE^VPRJPQA(KEY,0)
 E  D
 . ; We were handed a real PID
 . F  S KEY=$O(^VPRPT(PID,KEY)) Q:$E(KEY,1,$L(PREFIX))'=PREFIX  D ADDONE^VPRJPQA(KEY,0)
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
QLAST(PID,INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER) ; return most recent item in the list
 N IDXLAST S IDXLAST=1
 D QINDEX(PID,INDEX,$G(RANGE),$G(ORDER),$G(BAIL),$G(TEMPLATE),$G(FILTER))
 Q
