VPRJRUT ;SLC/KCM -- Utilities for HTTP communications
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
LOW(X) Q $TR(X,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")
 ;
LTRIM(%X) ; Trim whitespace from left side of string
 ; derived from XLFSTR, but also removes tabs
 N %L,%R
 S %L=1,%R=$L(%X)
 F %L=1:1:$L(%X) Q:$A($E(%X,%L))>32
 Q $E(%X,%L,%R)
 ;
URLENC(X) ; Encode a string for use in a URL
 ; Q $ZCONVERT(X,"O","URL")  ; uncomment for fastest performance on Cache
 ; =, &, %, +, non-printable
 ; {, } added JC 7-24-2012
 N I,Y,Z,LAST
     S Y=$P(X,"%") F I=2:1:$L(X,"%") S Y=Y_"%25"_$P(X,"%",I)
 S X=Y,Y=$P(X,"&") F I=2:1:$L(X,"&") S Y=Y_"%26"_$P(X,"&",I)
 S X=Y,Y=$P(X,"=") F I=2:1:$L(X,"=") S Y=Y_"%3D"_$P(X,"=",I)
 S X=Y,Y=$P(X,"+") F I=2:1:$L(X,"+") S Y=Y_"%2B"_$P(X,"+",I)
 S X=Y,Y=$P(X,"{") F I=2:1:$L(X,"{") S Y=Y_"%7B"_$P(X,"{",I)
 S X=Y,Y=$P(X,"}") F I=2:1:$L(X,"}") S Y=Y_"%7D"_$P(X,"}",I)
 S Y=$TR(Y," ","+")
 S Z="",LAST=1
 F I=1:1:$L(Y) I $A(Y,I)<32 D
 . S CODE=$$DEC2HEX($A(Y,I)),CODE=$TR($J(CODE,2)," ","0")
 . S Z=Z_$E(Y,LAST,I-1)_"%"_CODE,LAST=I+1
 S Z=Z_$E(Y,LAST,$L(Y))
 Q Z
 ;
URLDEC(X,PATH) ; Decode a URL-encoded string
 ; Q $ZCONVERT(X,"I","URL")  ; uncomment for fastest performance on Cache
 ;
 N I,OUT,FRAG,ASC
 S:'$G(PATH) X=$TR(X,"+"," ") ; don't convert '+' in path fragment
 F I=1:1:$L(X,"%") D
 . I I=1 S OUT=$P(X,"%") Q
 . S FRAG=$P(X,"%",I),ASC=$E(FRAG,1,2),FRAG=$E(FRAG,3,$L(FRAG))
 . I $L(ASC) S OUT=OUT_$C($$HEX2DEC(ASC))
 . S OUT=OUT_FRAG
 Q OUT
 ;
REFSIZE(ROOT) ; return the size of glvn passed in ROOT
 Q:'$D(ROOT) 0 Q:'$L(ROOT) 0
 N SIZE,I
 S SIZE=0
 I $D(@ROOT)#2 S SIZE=$L(@ROOT)
 I $D(@ROOT)>1 S I=0 F  S I=$O(@ROOT@(I)) Q:'I  S SIZE=SIZE+$L(@ROOT@(I))
 Q SIZE
 ;
VARSIZE(V) ; return the size of a variable
 Q:'$D(V) 0
 N SIZE,I
 S SIZE=0
 I $D(V)#2 S SIZE=$L(V)
 I $D(V)>1 S I="" F  S I=$O(V(I)) Q:'I  S SIZE=SIZE+$L(V(I))
 Q SIZE
 ;
PAGE(ROOT,START,LIMIT,SIZE,PREAMBLE) ; create the size and preamble for a page of data
 Q:'$D(ROOT) 0 Q:'$L(ROOT) 0
 N I,J,KEY,KINST,COUNT,TEMPLATE,PID
 K @ROOT@($J)
 S SIZE=0,COUNT=0,TEMPLATE=$G(@ROOT@("template"),0) ;,PID=$G(@ROOT@("pid"))
 I $L(TEMPLATE) D LOADSPEC^VPRJCT1(.TEMPLATE)
 F I=START:1:(START+LIMIT-1) Q:'$D(@ROOT@("data",I))  S COUNT=COUNT+1 D
 . S KEY="" F  S KEY=$O(@ROOT@("data",I,KEY)) Q:KEY=""  D
 . . S KINST="" F  S KINST=$O(@ROOT@("data",I,KEY,KINST)) Q:KINST=""  D
 . . . S PID=^(KINST)  ; null if non-pt data
 . . . D TMPLT(ROOT,.TEMPLATE,I,KEY,KINST,PID)
 . . . S J="" F  S J=$O(@ROOT@($J,I,J)) Q:'J  S SIZE=SIZE+$L(@ROOT@($J,I,J))
 S PREAMBLE=$$BLDHEAD(@ROOT@("total"),COUNT,START,LIMIT)
 ; add 3 for "]}}", add COUNT-1 for commas
 S SIZE=SIZE+$L(PREAMBLE)+3+COUNT-$S('COUNT:0,1:1)
 Q
TMPLT(ROOT,TEMPLATE,ITEM,KEY,KINST,PID) ; set template
 I HTTPREQ("store")="vpr"  G TLT4VPR
 I HTTPREQ("store")="data" G TLT4DATA
 I HTTPREQ("store")="xvpr" G TLT4XVPR
 ; otherwise trigger error and quit
 Q
TLT4XVPR ;
 ; set PID for this object unless just getting UID
 I TEMPLATE'="uid" N PID S PID=$O(^VPRPTJ("KEY",KEY,0))
 ; then drop thru to regular VPR template
TLT4VPR ;
 ; called from PAGE
 N STAMP
 I TEMPLATE="uid" S @ROOT@($J,ITEM,1)="{""uid"":"""_KEY_"""}" Q
 I $E(TEMPLATE,1,4)="rel;" D RELTLTP^VPRJCT1($NA(@ROOT@($J,ITEM)),KEY,.TEMPLATE,PID) Q
 I $E(TEMPLATE,1,4)="rev;" D REVTLTP^VPRJCT1($NA(@ROOT@($J,ITEM)),KEY,.TEMPLATE,PID) Q
 ; query time template
 I $D(TEMPLATE)>1 D APPLYTLT Q
 ; saved template
 I $L(TEMPLATE),$D(^VPRPTJ("TEMPLATE",PID,KEY,TEMPLATE)) M @ROOT@($J,ITEM)=^(TEMPLATE) Q
 ; else full object
 ; Add the item to the return
 ; Get the bottom of the tree (latest record)
 S STAMP=$O(^VPRPTJ("JSON",PID,KEY,""),-1)
 M @ROOT@($J,ITEM)=^VPRPTJ("JSON",PID,KEY,STAMP)
 Q
TLT4DATA ;
 ; called from PAGE
 N STAMP
 I $G(TEMPLATE)="uid" S @ROOT@($J,ITEM,1)="{""uid"":"""_KEY_"""}" Q
 I $E(TEMPLATE,1,4)="rel;" D RELTLTD^VPRJCT1($NA(@ROOT@($J,ITEM)),KEY,.TEMPLATE) Q
 I $E(TEMPLATE,1,4)="rev;" D REVTLTD^VPRJCT1($NA(@ROOT@($J,ITEM)),KEY,.TEMPLATE) Q
 ; query time template
 I $D(TEMPLATE)>1 D APPLYTLT Q
 ; other template
 I $L(TEMPLATE),$D(^VPRJDJ("TEMPLATE",KEY,TEMPLATE)) M @ROOT@($J,ITEM)=^(TEMPLATE) Q
 ; else full object
 ; get based on stamp
 S STAMP=$O(^VPRJDJ("JSON",KEY,""),-1)
 M @ROOT@($J,ITEM)=^VPRJDJ("JSON",KEY,STAMP)
 Q
APPLYTLT ; apply query time template
 ; called from TLT4VPR, TLT4XVPR, TLT4DATA
 ; expects TEMPLATE, KEY, KINST, PID, ROOT, ITEM
 ; no PID means use data store
 N OBJECT,JSON,CLTN,SPEC
 I $L(PID) N STAMP S STAMP=$O(^VPRPT(PID,KEY,""),-1) M OBJECT=^VPRPT(PID,KEY,STAMP) S CLTN=$P(KEY,":",3) I 1
 E  N STAMP S STAMP=$O(^VPRJD(KEY,""),-1) M OBJECT=^VPRJD(KEY,STAMP) S CLTN=$P(KEY,":",3)
 M SPEC=TEMPLATE("collection",CLTN)
 I '$D(SPEC) D  QUIT  ; return whole object if template missing
 . ; Add support for metastamps
 . I $L(PID) N STAMP S STAMP=$O(^VPRPTJ("JSON",PID,KEY,""),-1) M @ROOT@($J,ITEM)=^VPRPTJ("JSON",PID,KEY,STAMP) I 1
 . E  N STAMP S STAMP=$O(VPRJDJ("JSON",KEY,"",-1)) M @ROOT@($J,ITEM)=^VPRJDJ("JSON",KEY,STAMP)
 D APPLY^VPRJCT(.SPEC,.OBJECT,.JSON,KINST)
 M @ROOT@($J,ITEM)=JSON
 Q
BLDHEAD(TOTAL,COUNT,START,LIMIT) ; Build the object header
 N X,UPDATED
 S UPDATED=$P($$FMTHL7^XLFDT($$NOW^XLFDT),"+")
 S X="{""apiVersion"":""1.0"",""data"":{""updated"":"_UPDATED_","
 S X=X_"""totalItems"":"_TOTAL_","
 S X=X_"""currentItemCount"":"_COUNT_","
 I LIMIT'=999999 D  ; only set thise if paging
 . S X=X_"""itemsPerPage"":"_LIMIT_","
 . S X=X_"""startIndex"":"_START_","
 . S X=X_"""pageIndex"":"_(START\LIMIT)_","
 . S X=X_"""totalPages"":"_(TOTAL\LIMIT+$S(TOTAL#LIMIT:1,1:0))_","
 S X=X_"""items"":["
 Q X
 ;
UUID() ; 
 N R,I,J,N 
 S N="",R="" F  S N=N_$R(100000) Q:$L(N)>64 
 F I=1:2:64 S R=R_$E("0123456789abcdef",($E(N,I,I+1)#16+1)) 
 Q $E(R,1,8)_"-"_$E(R,9,12)_"-4"_$E(R,14,16)_"-"_$E("89ab",$E(N,17)#4+1)_$E(R,18,20)_"-"_$E(R,21,32) 
 ;
 ;
 ; Cache specific functions
 ;
LCLHOST() ; return TRUE if the peer connection is localhost
 I $E($I,1,5)'="|TCP|" Q 0
 N VER,ADDR
 S VER=$P($P($ZV,") ",2),"(")
 I VER<2011 S ADDR=$ZU(111,0),ADDR=$A(ADDR,1)_"."_$A(ADDR,2)_"."_$A(ADDR,3)_"."_$A(ADDR,4) I 1
 E  S ADDR=$SYSTEM.TCPDevice.PeerAddr(0)
 I ADDR="127.0.0.1" Q 1
 I ADDR="0:0:0:0:0:0:0:1" Q 1
 I ADDR="::1" Q 1
 Q 0
 ;
HASH(X) ; return CRC-32 of string contained in X
 Q $ZCRC(X,7) ; return the CRC-32 value
 ;
GMT() ; return HTTP date string (this is really using UTC instead of GMT)
 N TM,DAY
 S TM=$ZTIMESTAMP,DAY=$ZDATETIME(TM,11)
 Q $P(DAY," ")_", "_$ZDATETIME(TM,2)_" GMT"
 ;
SYSID() ; return a likely unique system ID
 N X
 S X=$ZUTIL(110)_":"_$G(^VPRHTTP("port"),9080)
 Q $ZHEX($ZCRC(X,6))
 ;
DEC2HEX(NUM) ; return a decimal number as hex
 Q $ZHEX(NUM)
 ;
HEX2DEC(HEX) ; return a hex number as decimal
 Q $ZHEX(HEX_"H")
 ;
WR4HTTP ; open file to save HTTP response
 O "VPRJT.TXT":"WNS"  ; open for writing
 U "VPRJT.TXT"
 Q
RD4HTTP() ; read HTTP body from file and return as value
 N X
 O "VPRJT.TXT":"RSD" ; for reading and delete when done
 U "VPRJT.TXT"
 F  R X:1 Q:'$L(X)  ; read lines until there is an empty one
 R X:2              ; now read the JSON object
 D C4HTTP
 Q X
 ;
C4HTTP ; close file used for HTTP response
 C "VPRJT.TXT"
 U $P
 Q
LOADFILE(FILE,BODY) ; Read from file & put into ARY(line)
 N I,LINE,EOF
 K ARY
 O FILE
 S EOF=0,I=0
 F  D READLN(.LINE) Q:EOF  S I=I+1 S BODY(I)=LINE
 C FILE
 Q
READLN(LINE) ; Read file into array
 ; expects FILE as the file handle
 ; called from LOADFILE
 N $ES,$ET
 S $ET="D CHKEOF^VPRJRUT Q"
 U FILE R LINE:5
 Q
CHKEOF   ; Check for EOF
 I $ZE["ENDOFFILE" S EOF=1,$EC=""
 Q
