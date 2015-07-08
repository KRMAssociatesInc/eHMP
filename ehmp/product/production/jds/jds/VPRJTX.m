VPRJTX ;SLC/KCM -- Utilities for unit tests
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
BLDPT(TAGS) ; Build test patient for integration tests with data in TAGS
 ; TAGS(n)=TAG^RTN  ; entry point for each JSON object, zzzzz terminated
 N DATA
 S VPRJTPID=$G(^VPRPTJ("JPID","93EF;-7"))
 I $L(VPRJTPID) D CLEARPT^VPRJPS(VPRJTPID)
 D PATIDS
 S VPRJTPID=$$ADDPT("DEMOG7^VPRJTP01")
 I $D(TAGS) D ADDDATA(.TAGS,VPRJTPID)
 Q
PATIDS ; Setup patient identifiers
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","93EF;-7")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","-777V123777")=""
 S ^VPRPTJ("JPID","93EF;-7")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","-777V123777")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","93EF;-8")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","-888V123888")=""
 S ^VPRPTJ("JPID","93EF;-8")="52833885-af7c-4899-90be-b3a6630b2370"
 S ^VPRPTJ("JPID","-888V123888")="52833885-af7c-4899-90be-b3a6630b2370"
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2371")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2371","93EF;-9")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2371","-999V123999")=""
 S ^VPRPTJ("JPID","93EF;-9")="52833885-af7c-4899-90be-b3a6630b2371"
 S ^VPRPTJ("JPID","-999V123999")="52833885-af7c-4899-90be-b3a6630b2371"
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2372")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2372","4321;-1")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2372","-111V123111")=""
 S ^VPRPTJ("JPID","4321;-1")="52833885-af7c-4899-90be-b3a6630b2372"
 S ^VPRPTJ("JPID","-111V123111")="52833885-af7c-4899-90be-b3a6630b2372"
 Q
 ;
ADDPT(TAG) ; Build a test patient and return the PID
 N VPRPID,DATA
 D PATIDS
 D GETDATA($P(TAG,"^"),$P(TAG,"^",2),.DATA)
 S VPRPID=$P($$PUTPT^VPRJPR("",.DATA),"/",3)
 Q VPRPID
 ;
ADDDATA(TAGS,VPRPID) ; Add data for the patient identified in VPRJTPID
 N I,JSON,OBJ,LOC,HTTPERR
 Q:'$D(TAGS)
 S I="" F  S I=$O(TAGS(I)) Q:'I  D
 . N JSON,OBJ
 . D GETDATA($P(TAGS(I),"^"),$P(TAGS(I),"^",2),.JSON)
 . D DECODE^VPRJSON("JSON","OBJ")
 . K JSON
 . S OBJ("pid")=VPRPID
 . D ENCODE^VPRJSON("OBJ","JSON")
 . S LOC=$$SAVE^VPRJPS(VPRPID,.JSON)
 . D EQ^VPRJT("",$G(HTTPERR),"HTTPERR IN ADDDATA^VPRJTX")
 Q
CLRPT ; Clear test patients
 N DFN,VPRPID,ICN
 S DFN="93EF;-" F  S DFN=$O(^VPRPTJ("JPID",DFN)) Q:$E(DFN,1,6)'="93EF;-"  D
 . ;S VPRPID=^VPRPTJ("JPID",DFN)
 . ; W !,"Clearing: "_DFN_"  pid="_VPRPID
 . D CLEARPT^VPRJPS(DFN)
 S ICN="-777" F  S ICN=$O(^VPRPTJ("JPID",ICN)) Q:$E(ICN,1,4)'="-777"  D
 . D CLEARPT^VPRJPS(ICN)
 K VPRJTPID
 K HTTPREQ,HTTPERR,HTTPRSP
 K ^TMP($J),^TMP("HTTPERR",$J)
 Q
ODSBLD(TAGS) ; Build sample data in non-patient data store
 ; TAGS(n)=TAG^RTN  ; entry point for each JSON object, zzzzz terminated
 N DATA,I,LOC,HTTPREQ
 S HTTPREQ("store")="data"
 D ODSCLR
 S I="" F  S I=$O(TAGS(I)) Q:'I  D
 . D GETDATA($P(TAGS(I),"^"),$P(TAGS(I),"^",2),.DATA)
 . S LOC=$$SAVE^VPRJDS(.DATA)
 . K DATA
 Q
ODSCLR ; Clear sample data from non-patient data store
 D DELCTN^VPRJDS("test")
 D DELCTN^VPRJDS("testb")
 D DELCTN^VPRJDS("utestods")
 K ^TMP($J),^TMP("HTTPERR",$J)
 Q
GETDATA(TAG,RTN,DATA) ; load data from TAG^RTN into .DATA until zzzzz
 N I,L,X,OBJ
 F I=1:1 S L=$T(@TAG+I^@RTN) Q:'$L(L)  S X=$P(L,";;",2,999) Q:X="zzzzz"  S DATA(I)=X
 Q
DATA2ARY(ARY) ; call SENDATA to write out response and read back into ARY
 ; cause TCP data to be written to file
 D WR4HTTP^VPRJRUT
 D SENDATA^VPRJRSP
 D C4HTTP^VPRJRUT
 ;
 ; read TCP data from file into variable and delete file
 N X,ERR
 S X=$$RD4HTTP^VPRJRUT
 D DECODE^VPRJSON("X","ARY","ERR")
 D EQ^VPRJT(0,$D(ERR))
 Q
SETGET(URL) ; set up a request (to emulate HTTP call)
 S HTTPERR=0
 S HTTPREQ("method")="GET"
 S HTTPREQ("path")=$P(URL,"?")
 S HTTPREQ("query")=$P(URL,"?",2,999)
 Q
SETPUT(URL,TAG,RTN) ; set up a PUT request based on data in TAG^RTN
 N DATA
 D PATIDS
 S HTTPERR=0
 S HTTPREQ("method")="PUT"
 S HTTPREQ("path")=$P(URL,"?")
 S HTTPREQ("query")=$P(URL,"?",2,999)
 D GETDATA(TAG,RTN,.DATA)
 M HTTPREQ("body")=DATA
 Q
SETDEL(URL) ; set up a delete request
 S HTTPERR=0
 S HTTPREQ("method")="DELETE"
 S HTTPREQ("path")=$P(URL,"?")
 S HTTPREQ("query")=$P(URL,"?",2,999)
 Q
SHOWRSP(ROOT) ; write out response
 N I
 I $D(@ROOT)#2 W !,@ROOT
 S I=0 F  S I=$O(@ROOT@(I)) Q:'I  W !,@ROOT@(I)
 Q
 ;
QCNT(REF) ; return count of nodes in a variable
 N X,CNT,ROOT
 S CNT=0
 S ROOT=$S($E($RE(REF))=")":$E(REF,1,$L(REF)-1),1:REF)
 I $D(@REF)=1 S CNT=CNT+1
 S X=REF F  S X=$Q(@X) Q:$E(X,1,$L(ROOT))'=ROOT  S CNT=CNT+1
 Q CNT
 ;
WO(TAG,RTN) ; Write out JSON as single line
 W !
 N I,X
 F I=1:1 S X=$P($T(@TAG+I^@RTN),";;",2,999) Q:X="zzzzz"  W X
 Q
