HMPTRPC ;SLC/AGP - Generic RPC controller for HMP ; 7/30/13 3:29pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ;
RPC(HMPRES,PARAMS) ; Process request via RPC instead of CSP
 N X,REQ,HMPCNT,HMPSITE,HMPUSER,HMPDBUG,HMPSTA
 ;S HMPXML=$NA(^TMP($J,"HMP RESULTS")) K @HMPXML
 S HMPCNT=0
 ;S HMPUSER=DUZ,HMPSITE=DUZ(2),HMPSTA=$$STA^XUAF4(DUZ(2))
 S X="" F  S X=$O(PARAMS(X)) Q:X=""  S REQ(X,1)=PARAMS(X)
 ;
COMMON ; Come here for both CSP and RPC Mode
 ; 
 N CMD
 S CMD=$G(REQ("command",1))
 ;
 I CMD="testRPC" D  G OUT
 . D TESTRPC(.HMPRES,$$VAL("value"))
 ;
 I CMD="importJson" D IMPJSON^HMPTRPC1(.HMPRES,.PARAMS)
 ;
 I CMD="testDelay" D DELAY^HMPTRPC1(.HMPRES,.PARAMS)
 ;
 I CMD="saveData" D SAVE^HMPTRPC1(.HMPRES,$$VAL("patient"),$$VAL("user"),$$VAL("domain"),$$VAL("num"),$$VAL("system"),$$VAL("json"))
 ;
 I CMD="deleteData" D DELETE^HMPTRPC1(.HMPRES,$$VAL("patient"),$$VAL("system"),$$VAL("json"))
 ;
 ;M ^XTMP("AGP TEST","PARAMS")=PARAMS
 I CMD="clearData" D CLEARVAL^HMPTRPC1(.HMPRES,$$VAL("system"),$$VAL("patient"),$$VAL("beg"),$$VAL("end"),$$VAL("json"))
 ;
 I CMD="getFields" D GETFLDS^HMPTRPC1(.HMPRES)
 ;
OUT ;
 I '$D(HMPRES) S HMPRES=""
END Q
 ;
VAL(X) ; return value from request
 Q $G(REQ(X,1))
 ;
TESTRPC(RESULT,VALUE) ;
 S RESULT="result"
 I VALUE="error" D APPERROR^%ZTER("test RPC Error") Q
 I VALUE="wait" H 60
 Q
 ;
