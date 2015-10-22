VPRJCR ;SLC/KCM -- Parse values from range parameter
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
PARSERNG ; Parse range value
 ; expects: INDEX, RANGE
 ; updates: START, STOP, DIR
 ; returned structures:
 ;   START(level)=beginning of range    ;defaults to ""
 ;   START(level,#)="value"             ;for comma delimited range
 ;   START(level,"collation")=V|S|s...  ;"L" for list
 ;   STOP(level)=end of range           ;defaults to $C(255)
 ;   DIR(level)=1                       ;direction to traverse subscript
 ;
 ; @see unit test in PARSERNG^VPRJTQX
 N I,CLTN,RANGES
 D XRANGES(.RANGE,.RANGES)
 F I=1:1:INDEX("levels") D
 . N TMPSTRT,TMPSTOP
 . S CLTN=INDEX("collate",I) S:'$L(CLTN) CLTN="P"
 . D RNG2VAL(.RANGES,I,.TMPSTRT,.TMPSTOP,CLTN)
 . M START(I)=TMPSTRT,STOP(I)=TMPSTOP
 . S START(I,"collate")=CLTN,DIR(I)=1
 . I $D(START(I,"list")) S START(I,"collate")="L"
 Q
XRANGES(RANGE,RANGES) ; extract values for each level by parsing RANGE
 ; returns
 ; .RANGES(level,#)     :  string or value for each item in a specific range
 ; .RANGES(level,"type"):  R if a range or L if a list of items
 ; .RANGES(level,"ends"):  inclusive/exclusive endpoints for range
 N TOKEN,LEVEL,IDX,ITEM,S,ERROR
 S LEVEL=0,IDX=1,ERROR=0
 D NEWLVL
 F  Q:IDX>$L(RANGE)  S TOKEN=$E(RANGE,IDX) D  Q:ERROR
 . I TOKEN=">" D NEWLVL S IDX=IDX+1 Q
 . I TOKEN="," S RANGES(LEVEL,"type")="L",IDX=IDX+1 Q
 . I TOKEN=".",($E(RANGE,IDX+1)=".") S RANGES(LEVEL,"type")="R",IDX=IDX+2 Q
 . I TOKEN="[" S:ITEM>1 $E(RANGES(LEVEL,"ends"),2)=")" S IDX=IDX+1 Q
 . I TOKEN="]" S:ITEM=1 $E(RANGES(LEVEL,"ends"),1)="(" S IDX=IDX+1 Q
 . I TOKEN="*" S $E(RANGES(LEVEL,"ends"),2)="*" S IDX=IDX+1 Q
 . I TOKEN="""" D NXTSTR^VPRJCU(.RANGE,.IDX,.S) S RANGES(LEVEL,ITEM)=S,ITEM=ITEM+1 Q
 . I TOKEN="'" D NXTSTR^VPRJCU(.RANGE,.IDX,.S,"'") S RANGES(LEVEL,ITEM)=S,ITEM=ITEM+1 Q
 . ;otherwise
 . D NXTVAL^VPRJCU(.RANGE,.IDX,.S,",>.[]()*") S RANGES(LEVEL,ITEM)=S,ITEM=ITEM+1
 Q
NEWLVL ; initializes new level in RANGES
 ;expects: RANGE,LEVEL  from: PRNG
 S LEVEL=LEVEL+1,ITEM=1
 S RANGES(LEVEL,"type")="R"
 S RANGES(LEVEL,"ends")="[]"
 Q
RNG2VAL(RANGES,LEVEL,START,STOP,CTYPE) ; Parse start and stop from range
 ;@see unit tests in RNG2VAL^VPRJTQU and RNG2VAL2^VPRJTQU
 ;RANGE is a single ">" part of the range parameter
 ; .START              start value modified for $O
 ; .START("list",item) list of items if range is comma delimited
 ; .STOP               stop value modified for $O
 ;
 S START="",STOP=$C(255,255,255)
 I '$D(RANGES(LEVEL,1)) Q
 I $A(CTYPE)>96 D   ; lowercase for case-insensitive
 . N I S I=0
 . F  S I=$O(RANGES(LEVEL,I)) Q:'I  S RANGES(LEVEL,I)=$$LOW^XLFSTR(RANGES(LEVEL,I))
 S CTYPE=$$UP^XLFSTR(CTYPE)
 I RANGES(LEVEL,"type")="L" D  Q  ; build list of search items and return
 . N I,S
 . S I=0 F  S I=$O(RANGES(LEVEL,I)) Q:'I  D
 . . S S=$$TRIM^XLFSTR(RANGES(LEVEL,I))
 . . I CTYPE="V" S S=S_"="
 . . I CTYPE="T" S S=S_" "
 . . I CTYPE="S"!(CTYPE="s") S S=S_" "
 . . I CTYPE="N" S S=+S
 . . S START("list",S)=""
 ;
 N ENDPOINT,NUMERIC,X
 ; figure out the endpoints (include, exclusive, startswith)
 S ENDPOINT=RANGES(LEVEL,"ends")
 ; get start, stop and make sure stop is after start
 S START=$G(RANGES(LEVEL,1)),STOP=$G(RANGES(LEVEL,2)),NUMERIC=$$NUMERIC^VPRJSONE(START)
 I STOP="" S STOP=START
 I (NUMERIC&(START>STOP))!('NUMERIC&(START]STOP)) S X=STOP,STOP=START,START=X
 ;
 ; adjust start/stop for String and Time indexes
 I (CTYPE="S")!(CTYPE="T") D  Q
 . I ENDPOINT["[",+START,(CTYPE="S"),(+START=START) S START=$$ADJSTR(START,"-")
 . I ENDPOINT["(" S START=START_" "
 . I ENDPOINT["*" S STOP=STOP_$C(255)
 . I ENDPOINT["]" S STOP=STOP_" "
 . I ENDPOINT[")",+STOP,(CTYPE="S"),(+STOP=STOP) S STOP=$$ADJSTR(STOP,"-")
 ; adjust start/stop for Inverse Time index
 I CTYPE="V" D  Q
 . ; get complement for each time and swap the times
 . S START=$TR(START,"0123456789","9876543210"),STOP=$TR(STOP,"0123456789","9876543210")
 . S X=STOP,STOP=START,START=X
 . I ENDPOINT["[" S STOP=STOP_"="
 . I ENDPOINT["(" S STOP=STOP_":"
 . I ENDPOINT["*" S START=START_" "
 . I ENDPOINT["]" S START=START_":"
 . I ENDPOINT[")" S START=START_"="
 ; adjust start/stop for Numeric index
 I CTYPE="N" D  Q
 . I ENDPOINT["[" S START=$$ADJNUM(START,"-")
 . I ENDPOINT[")" S STOP=$$ADJNUM(STOP,"-")
 Q
ADJNUM(N,SIGN) ; adjusted a number in a positive or negative direction
 ;@see unit test in ADJNUM^VPRJTQU
 I N'=+N Q N              ; not a number, leave it as is
 N P S P=$L($P(N,".",2))  ; get precision
 N D S D=$S('P:1,1:"."_$E("000000000000000",1,P-1)_"1")
 S D=$S($G(SIGN)="-":-D,1:D)
 Q N+D
 ;
ADJSTR(S,SIGN) ; bump a string ahead or behind in collation sequence
 ;@see unit test in ADJSTR^VPRJTQU
 I S="" Q S
 I $G(SIGN)="-" S $E(S,$L(S))=$C($A($E(S,$L(S)))-1),S=S_$C(255) Q S
 Q S_$C(255)
 ;
