VPRJDQ ;SLC/KCM -- Query for JSON objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
QKEY(KEY,TEMPLATE) ; Return an object given the key (i.e., urn:va:fresh:93EF:10076)
 N VPRDATA,ORDER
 S TEMPLATE=$G(TEMPLATE)
 I '$D(^VPRJDJ("JSON",KEY)) D SETERROR^VPRJRER(104,"UID:"_KEY) Q
 K ^TMP("VPRDATA",$J)
 S ^TMP("VPRDATA",$J,KEY,0)="",VPRDATA=1,ORDER(0)=0
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
 ;
QCOUNT(CNTNM) ; Return a set of counts across patients
 ; return tallies as data:{items:[{"topic":"med","count":4}
 N BUFFER S BUFFER=""
 K ^TMP($J)
 ;
 N TOPIC,DATA,COUNT,X
 S DATA=0,TOPIC=""
 F  S TOPIC=$O(^VPRJDX("count",CNTNM,TOPIC)) Q:TOPIC=""  D
 . S COUNT=+^VPRJDX("count",CNTNM,TOPIC)
 . S X=$S('DATA:"",1:",")_"{""topic"":"""_TOPIC_""",""count"":"_COUNT_"}"
 . S DATA=DATA+1,DATA(DATA)=X
 S X=$$BLDHEAD^VPRJCB(DATA) D STAGE^VPRJCB(X)
 S DATA=0 F  S DATA=$O(DATA(DATA)) Q:'DATA  D STAGE^VPRJCB(DATA(DATA))
 D STAGE^VPRJCB("]}}"),OUT^VPRJCB
 Q
QTALLY(CNTNM) ; Return a set of counts
 ; return tallies as data:{items:[{"topic":"MEDICATION,INPT","count":4}
 I '$L(CNTNM) D SETERROR^VPRJRER(101) Q
 N BUFFER S BUFFER=""
 ;
 N TOPIC,DATA,COUNT,X
 S DATA=0,TOPIC=""
 F  S TOPIC=$O(^VPRJDX("tally",CNTNM,TOPIC)) Q:TOPIC=""  D
 . S COUNT=+^VPRJDX("tally",CNTNM,TOPIC)
 . S X=$S('DATA:"",1:",")_"{""topic"":"""_TOPIC_""",""count"":"_COUNT_"}"
 . S DATA=DATA+1,DATA(DATA)=X
 S X=$$BLDHEAD^VPRJCB(DATA) D STAGE^VPRJCB(X)
 S DATA=0 F  S DATA=$O(DATA(DATA)) Q:'DATA  D STAGE^VPRJCB(DATA(DATA))
 D STAGE^VPRJCB("]}}"),OUT^VPRJCB
 Q
 ;
 ;defined at the QINDEX level:
 ;   INDEX:  Name of the index
 ;   RANGE:  range of values, examples:  A..Z, GLUCOSE*>2010..2013, A,C,E
 ;   ORDER:  sequece of the returned valuse, examples:  desc | facilityName asc
 ;    BAIL:  maximum number of matches to return
 ;  METHOD:  style of index, "attr", "time"
 ;  FILTER:  criteria statement to further limit returned results
 ; CLAUSES:  clauses to apply filter to each object
 ;
QINDEX(INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER) ; query based on index
 I '$L($G(INDEX)) D SETERROR^VPRJRER(101) Q
 N VPRDATA,METHOD,CLAUSES
 S RANGE=$G(RANGE),ORDER=$G(ORDER),BAIL=$G(BAIL),TEMPLATE=$G(TEMPLATE),FILTER=$G(FILTER)
 S VPRDATA=0 S:'BAIL BAIL=999999
 M INDEX=^VPRMETA("index",INDEX,"common")
 S METHOD=$G(INDEX("method")) I '$L(METHOD) D SETERROR^VPRJRER(102,INDEX) Q
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 D SETORDER^VPRJCO(.ORDER) Q:$G(HTTPERR)
 K ^TMP("VPRDATA",$J)
 I METHOD="attr" D QATTR^VPRJDQA
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
QLAST(INDEX,RANGE,ORDER,BAIL,TEMPLATE,FILTER) ; return most recent item in the list
 N IDXLAST S IDXLAST=1
 D QINDEX(INDEX,$G(RANGE),$G(ORDER),$G(BAIL),$G(TEMPLATE),$G(FILTER))
 Q
QFIND(COLL,ORDER,BAIL,TEMPLATE,FILTER) ; return items from collection without index
 N VPRDATA,CLAUSES,PREFIX,KEY
 S ORDER=$G(ORDER),BAIL=$G(BAIL),TEMPLATE=$G(TEMPLATE),FILTER=$G(FILTER)
 S VPRDATA=0 S:'BAIL BAIL=999999
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 D SETORDER^VPRJCO(.ORDER) Q:$G(HTTPERR)
 K ^TMP("VPRDATA",$J)
 S PREFIX="urn:va:"_COLL_":",KEY=PREFIX
 F  S KEY=$O(^VPRJD(KEY)) Q:$E(KEY,1,$L(PREFIX))'=PREFIX  D ADDONE^VPRJDQA(KEY,0)
 D BUILD^VPRJCB
 K ^TMP("VPRDATA",$J)
 Q
