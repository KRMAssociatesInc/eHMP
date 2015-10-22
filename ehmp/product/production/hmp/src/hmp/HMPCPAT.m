HMPCPAT ;SLC/AGP - Patient Information Controller for HMP ; 12/12/13 8:52pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
ADD(X) ; Add a line @NHIN@(n)=X
 S HMPCNT=$G(HMPCNT)+1
 S @HMPXML@(HMPCNT)=X
 Q
 ;
RPC(HMPXML,PARAMS) ; Process request via RPC instead of CSP
 N X,REQ,HMPCNT,HMPSITE,HMPUSER,HMPDBUG,HMPSTA
 S HMPXML=$NA(^TMP($J,"HMP RESULTS")) K @HMPXML
 S HMPCNT=0
 S HMPUSER=DUZ,HMPSITE=DUZ(2),HMPSTA=$$STA^XUAF4(DUZ(2))
 S X="" F  S X=$O(PARAMS(X)) Q:X=""  S REQ(X,1)=PARAMS(X)
 ;
COMMON ; Come here for both CSP and RPC Mode
 ;
 N CMD
 S CMD=$G(REQ("command",1))
 D ADD("<results>")
 ;
 I CMD="getPatPcmmInfo" D  G OUT
 . D GETPCMM^HMPCPAT1($$VAL("patient"))
 ;
OUT ; output the XML
 D ADD("</results>")
 ;I EDPDBUG D PUTXML^EDPCDBG(EDPDBUG,.EDPXML)
 ;I $L($G(EDPHTTP)) D        ; if in CSP mode
 ;. U EDPHTTP
 ;. W "<results>",!
 ;. N I S I=0 F  S I=$O(EDPXML(I)) Q:'I  W EDPXML(I),!
 ;. W "</results>",!
END Q
 ;
VAL(X) ; return value from request
 Q $G(REQ(X,1))
