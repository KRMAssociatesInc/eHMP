VPRJCF ;SLC/KCM -- query filter
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ; EVALAND is always called first since the default is to 'and'
 ; clauses together, so ERROR is newed in EVALAND.
 ;
EVALAND(CLAUSES,UID) ; evaluate object at UID against filter
 ; AND -- return true if ALL clauses are true
 N SEQ,RESULT,CLAUSE,ERROR
 S SEQ=0,RESULT=1 ;default true in case there are no clauses to evaluate
 F  S SEQ=$O(CLAUSES(SEQ)) Q:'SEQ  M CLAUSE=CLAUSES(SEQ) S RESULT=$$EVALEXPR(.CLAUSE,UID) Q:'RESULT  K CLAUSE
 Q RESULT
 ;
EVALOR(CLAUSES,UID) ; evaluate object at UID against filter
 ; OR -- return true if ANY clause is true
 N SEQ,RESULT,CLAUSE
 S SEQ=0,RESULT=1 ;default true in case there are no clauses to evaluate
 F  S SEQ=$O(CLAUSES(SEQ)) Q:'SEQ  M CLAUSE=CLAUSES(SEQ) S RESULT=$$EVALEXPR(.CLAUSE,UID) Q:RESULT  K CLAUSE
 Q RESULT
 ;
EVALNOT(CLAUSES,UID) ; evaluate object at UID against filter
 ; NOT -- return true if none of the clauses are true
 N SEQ,RESULT,CLAUSE
 S SEQ=0,RESULT=1 ;default true in case there are no clauses to evaluate
 F  S SEQ=$O(CLAUSES(SEQ)) Q:'SEQ  M CLAUSE=CLAUSES(SEQ) S RESULT=$$EVALEXPR(.CLAUSE,UID) Q:RESULT  K CLAUSE
 Q 'RESULT
 ;
EVALEXPR(CLAUSE,UID) ; evaluate expression in a clause
 ; handle conjunctions / disjunctions
 I CLAUSE="and" Q $$EVALAND(.CLAUSE,UID)
 I CLAUSE="or" Q $$EVALOR(.CLAUSE,UID)
 I CLAUSE="not" Q $$EVALNOT(.CLAUSE,UID)
 ;
 I $G(HTTPREQ("store"))="data" G EVALEXJD ; jump to different for non-patient globals
 I $G(HTTPREQ("store"))="xvpr" N PID S PID=$O(^VPRPTJ("KEY",UID,""))
 ;
 ; get the value or values to be evaluated & go to appropriate evaluator
 N VALUE
 ; get based latest stamp time
 N STAMP
 S STAMP=$O(^VPRPT(PID,UID,""),-1)
 ; case TYPE begin
 I CLAUSE("type")=1 S VALUE=$G(^VPRPT(PID,UID,STAMP,CLAUSE("field"))) Q $$EVALONE
 I CLAUSE("type")=2 S VALUE=$G(^VPRPT(PID,UID,STAMP,CLAUSE("field"),CLAUSE("sub"))) Q $$EVALONE
 N INST,RSLT
 S INST="",RSLT=0
 ; return try if -any- of the values evaluate to true
 F  S INST=$O(^VPRPT(PID,UID,STAMP,CLAUSE("mult"),INST)) Q:'INST  D  Q:RSLT
 . I CLAUSE("type")=3 S VALUE=$G(^VPRPT(PID,UID,STAMP,CLAUSE("mult"),INST,CLAUSE("field"))) S RSLT=$$EVALONE Q
 . I CLAUSE("type")=4 S VALUE=$G(^VPRPT(PID,UID,STAMP,CLAUSE("mult"),INST,CLAUSE("field"),CLAUSE("sub"))) S RSLT=$$EVALONE Q
 Q RSLT
 ;
EVALEXJD ; come here to evaluate non-patient data
 ; get the value or values to be evaluated & go to appropriate evaluator
 N VALUE
 ; get based on latest stamp time
 N STAMP
 S STAMP=$O(^VPRJD(UID,""),-1)
 ; case TYPE begin
 I CLAUSE("type")=1 S VALUE=$G(^VPRJD(UID,STAMP,CLAUSE("field"))) Q $$EVALONE
 I CLAUSE("type")=2 S VALUE=$G(^VPRJD(UID,STAMP,CLAUSE("field"),CLAUSE("sub"))) Q $$EVALONE
 N INST,RSLT
 S INST="",RSLT=0
 ; return try if -any- of the values evaluate to true
 F  S INST=$O(^VPRJD(UID,STAMP,CLAUSE("mult"),INST)) Q:'INST  D  Q:RSLT
 . I CLAUSE("type")=3 S VALUE=$G(^VPRJD(UID,STAMP,CLAUSE("mult"),INST,CLAUSE("field"))) S RSLT=$$EVALONE Q
 . I CLAUSE("type")=4 S VALUE=$G(^VPRJD(UID,STAMP,CLAUSE("mult"),INST,CLAUSE("field"),CLAUSE("sub"))) S RSLT=$$EVALONE Q
 Q RSLT
 ;
EVALONE() ; perform operation on a single value
 I CLAUSE="eq" Q (VALUE=CLAUSE("value"))
 I CLAUSE="in" Q:'$L(VALUE) 0  Q $D(CLAUSE("list",VALUE))
 I CLAUSE="ne" Q (VALUE'=CLAUSE("value"))
 I CLAUSE="exists" Q (($L(VALUE)>0)=$G(CLAUSE("value"),1))
 I CLAUSE="nin" Q:'$L(VALUE) 0  Q '$D(CLAUSE("list",VALUE))
 ;
 I $L(VALUE),(+VALUE=VALUE),'$D(CLAUSE("asString")) G EVALNUM
EVALSTR ; use ] to evaluate string values
 I CLAUSE="gt" Q (VALUE]CLAUSE("value"))
 I CLAUSE="lt" Q (CLAUSE("value")]VALUE)
 I CLAUSE="gte" Q:VALUE=CLAUSE("value") 1  Q (VALUE]CLAUSE("value"))
 I CLAUSE="lte" Q:VALUE=CLAUSE("value") 1  Q (CLAUSE("value")]VALUE)
 I CLAUSE="between" Q:(CLAUSE("low")]VALUE) 0 Q:(VALUE]CLAUSE("high")) 0 Q 1
 I CLAUSE="like" Q VALUE?@CLAUSE("pattern")
 I CLAUSE="ilike" Q $$LOW^XLFSTR(VALUE)?@CLAUSE("pattern")
 D SETERR(106,"unsupported operator")
 Q 0
 ;
EVALNUM ; use >,< to evaluate numeric values
 I CLAUSE="gt" Q (VALUE>CLAUSE("value"))
 I CLAUSE="lt" Q (VALUE<CLAUSE("value"))
 I CLAUSE="gte" Q (VALUE'<CLAUSE("value"))
 I CLAUSE="lte" Q (VALUE'>CLAUSE("value"))
 I CLAUSE="between" Q:(VALUE<CLAUSE("low")) 0 Q:(VALUE>CLAUSE("high")) 0 Q 1
 D SETERR(106,"unsupported operator")
 Q 0
 ;
 ;
PARSE(IN,OUT) ; parse filter syntax
 ; A:argument,C:conjunction,O:operation,L:list
 N LEVEL,STACK,PTR,TOKEN,ITEM,ERROR
 S LEVEL=1,PTR=1,STACK(LEVEL)=1,STACK(LEVEL,"mode")="O",ERROR=0
 F  Q:PTR>$L(IN)  S TOKEN=$E(IN,PTR) D  Q:ERROR
 . I TOKEN="(" D PUSH("A") Q
 . I TOKEN=")" D POP Q
 . I TOKEN="{" D PUSH("C") Q  ; deprecated -- use paranthesis
 . I TOKEN="}" D POP Q        ; deprecated -- use paranthesis
 . I TOKEN="[" D PUSH("L") Q
 . I TOKEN="]" D POP Q
 . I TOKEN="," S STACK(LEVEL)=STACK(LEVEL)+1,PTR=PTR+1 D LTRIM^VPRJCU(.IN,.PTR) Q
 . I TOKEN=" " S STACK(LEVEL)=STACK(LEVEL)+1,PTR=PTR+1 D LTRIM^VPRJCU(.IN,.PTR) Q
 . S ITEM=$S(TOKEN="""":$$NXTSTRF,1:$$NXTVALF) Q:ERROR  ;increment PTR to next token
 . I '$L(ITEM) D SETERR(106,"empty value") Q
 . I STACK(LEVEL,"mode")="O"!(STACK(LEVEL,"mode")="C") D SETOPER(ITEM) Q
 . I STACK(LEVEL,"mode")="A" D  Q
 . . I STACK(LEVEL)=1 D SETFLD(ITEM) Q
 . . I STACK(LEVEL)=2 D
 . . . I TOKEN="""" S @$$CURREF(LEVEL-1,"asString")=""
 . . . I @$$CURREF(LEVEL-1)="between" S @$$CURREF(LEVEL-1,"low")=ITEM Q
 . . . I @$$CURREF(LEVEL-1)="like" S @$$CURREF(LEVEL-1,"pattern")=$$MAKEPAT(ITEM,0) Q
 . . . I @$$CURREF(LEVEL-1)="ilike" S @$$CURREF(LEVEL-1,"pattern")=$$MAKEPAT(ITEM,1) Q
 . . . I @$$CURREF(LEVEL-1)="exists" S @$$CURREF(LEVEL-1,"value")=$S(ITEM="false":0,1:1) Q
 . . . E  S @$$CURREF(LEVEL-1,"value")=ITEM
 . . I STACK(LEVEL)=3 S @$$CURREF(LEVEL-1,"high")=ITEM
 . I STACK(LEVEL,"mode")="L" S @$$CURREF(LEVEL-2,"list",ITEM)="" Q
 I LEVEL'=1,'ERROR D SETERR(106,"mismatch of braces")
 I '$$CHKOUT(.OUT) Q
 Q
PUSH(MODE) ; new stack level
 I ",or,and,not,"[(","_$G(ITEM)_",") S MODE="C" ; conjunction, otherwise leave as A
 S LEVEL=LEVEL+1,STACK(LEVEL)=1,STACK(LEVEL,"mode")=MODE,PTR=PTR+1
 Q
POP ; remove stack level
 K STACK(LEVEL) S LEVEL=LEVEL-1,PTR=PTR+1
 Q
CURREF(TO,PROP,ITEM) ; Set current global reference based on stack
 N LEVEL,REF
 S REF="",LEVEL=1
 F  Q:LEVEL>TO  S REF=REF_$S(LEVEL=1:"",1:",")_STACK(LEVEL),LEVEL=LEVEL+1
 I $L($G(PROP)) S REF=REF_","""_PROP_""""
 I $L($G(ITEM)) S REF=REF_","""_ITEM_""""
 Q "OUT("_REF_")"
 ;
SETOPER(ITEM) ; Set operation
 S ITEM=$$LOW^XLFSTR(ITEM)
 I ",or,and,not,eq,ne,gt,lt,gte,lte,in,between,like,ilike,exists,nin,"[(","_ITEM_",") S @$$CURREF(LEVEL)=ITEM I 1
 E  D SETERR(106,"unsupported operator")
 Q
SETFLD(FIELD) ; Classify the field into its type and parts
 N PARTS
 ; TODO: consider supporting "_" in names
 ; case begin
 I FIELD?1A.AN D  G XSETFLD
 . S PARTS("type")=1,PARTS("field")=FIELD
 I FIELD?1A.AN1"."1A.AN D  G XSETFLD
 . S PARTS("type")=2,PARTS("field")=$P(FIELD,"."),PARTS("sub")=$P(FIELD,".",2)
 I FIELD?1A.AN1"[]."1A.AN D  G XSETFLD
 . S PARTS("type")=3,PARTS("mult")=$P(FIELD,"[]."),PARTS("field")=$P(FIELD,".",2)
 I FIELD?1A.AN1"[]."1A.AN1"."1A.AN D  G XSETFLD
 . S PARTS("type")=4,PARTS("mult")=$P(FIELD,"[]."),PARTS("field")=$P(FIELD,".",2),PARTS("sub")=$P(FIELD,".",3)
 ; else
 D SETERR(107,"unsupported field type")
 ; case end
XSETFLD ;
 Q:ERROR
 M @$$CURREF(LEVEL-1)=PARTS
 Q
NXTSTRF() ; function returns the next string from IN based on PTR
 ; expects: IN,PTR
 ; may set: ERROR
 N STR
 D NXTSTR^VPRJCU(.IN,.PTR,.STR)
 Q STR
 ;
NXTVALF() ; function returns the next value from IN based on PTR
 ; expects IN,PTR
 N VAL
 D NXTVAL^VPRJCU(.IN,.PTR,.VAL," ,(){}[]")
 Q VAL
 ;
MAKEPAT(MATCH,CI) ; switch LIKE pattern into M pattern match
 I '$L(MATCH) D SETERR(106,"missing LIKE argument") Q ""
 ;
 I $G(CI) S MATCH=$$LOW^XLFSTR(MATCH) ; case insensitive match
 N I,X,LAST,PATTERN
 S PATTERN="",LAST=1
 F  S I=$F(MATCH,"%",LAST) D  Q:'I  Q:I>$L(MATCH)
 . S X=$E(MATCH,LAST,$S(I:I-2,1:$L(MATCH))),LAST=I
 . I $L(X) S PATTERN=PATTERN_"1"""_X_""""
 . I $E(MATCH,I-1)="%" S PATTERN=PATTERN_".E"
 Q PATTERN
 ;
CHKOUT(CLAUSES) ; check the output of parse for errors in initial statement
 N SEQ,OK,CLAUSE
 S SEQ=0,OK=1
 F  S SEQ=$O(CLAUSES(SEQ)) Q:'SEQ  M CLAUSE=CLAUSES(SEQ) S OK=$$CHKONE(.CLAUSE) Q:'OK  K CLAUSE
 Q OK
 ;
CHKONE(CLAUSE) ; check and individual clause for errors
 I ",and,or,not,"[(","_CLAUSE_",")  Q $$CHKOUT(.CLAUSE)
 I ",or,and,not,eq,ne,gt,lt,gte,lte,in,between,like,ilike,exists,nin,"'[(","_CLAUSE_",") D SETERR(106,"unsupported operator") Q 0
 I CLAUSE="between",('$D(CLAUSE("low"))!'$D(CLAUSE("high"))) D SETERR(106,"missing low or high") Q 0
 I (CLAUSE="in"!(CLAUSE="nin")),($D(CLAUSE("list"))'>1) D SETERR(106,"missing list for in operation") Q 0
 I ",eq,ne,gt,lt,gte,lte,"[(","_CLAUSE_","),'$D(CLAUSE("value")) D SETERR(106,"missing value") Q 0
 I (CLAUSE="like"!(CLAUSE="ilike")),'$D(CLAUSE("pattern")) D SETERR(106,"missing like pattern") Q 0
 I '$D(CLAUSE("field")) D SETERR(106,"missing field") Q 0
 I CLAUSE("type")=2,'$D(CLAUSE("sub")) D SETERR(106,"missing sub-field") Q 0
 I CLAUSE("type")=3,'$D(CLAUSE("mult")) D SETERR(106,"missing multiple") Q 0
 I CLAUSE("type")=4,('$D(CLAUSE("mult"))!'$D(CLAUSE("sub"))) D SETERR(106,"incomplete field name") Q 0
 Q 1
 ;
SETERR(ERR,MSG) ; set error state
 S ERROR=ERR
 D SETERROR^VPRJRER(ERR,$G(MSG))
 Q
