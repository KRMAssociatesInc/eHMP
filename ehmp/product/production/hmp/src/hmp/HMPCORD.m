HMPCORD ;SLC/AGP - Ordering Controller for HMP ; 9/21/12 5:57pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ;
RPC(HMPOUT,PARAMS) ; Process request via RPC instead of CSP
 N X,REQ,HMPCNT,HMPSITE,HMPUSER,HMPDBUG,HMPSTA
 S HMPCNT=0
 S HMPUSER=DUZ,HMPSITE=DUZ(2),HMPSTA=$$STA^XUAF4(DUZ(2))
 S X="" F  S X=$O(PARAMS(X)) Q:X=""  S REQ(X,1)=PARAMS(X)
 ;
COMMON ; Come here for both CSP and RPC Mode
 ;
 N CMD
 S CMD=$G(REQ("command",1))
 ;
 ; returns an order structure for change orders
 ; or places an order if auto-accept QO
 I CMD="ordering" D  G OUT
 . D ORDERING^HMPCORD1(.HMPOUT,$$VAL("uid"),$$VAL("qoIen"),$$VAL("patient"),$$VAL("location"),$$VAL("provider"),$$VAL("orderAction"),0,$$VAL("snippet"),$$VAL("name"))
 ;
 ;
 I CMD="listQuickOrders" D  G OUT
 . D QOL^HMPCORD1(.HMPOUT,$$VAL("location"),$$VAL("provider"),$$VAL("panelNumber"),$$VAL("patient"))
 ;
 I CMD="renewOrder" D  G OUT
 . D RENEW^HMPCORD1(.HMPOUT,$$VAL("uid"),$$VAL("provider"),0,$$VAL("snippet"),$$VAL("name"))
 ;
 I CMD="dcReasonsList" D  G OUT
 . D DCLREAS^HMPCORD1(.HMPOUT,$$VAL("uid"),$$VAL("provider"))
 ;
 I CMD="discontinue" D  G OUT
 . D DC^HMPCORD1(.HMPOUT,$$VAL("uid"),$$VAL("provider"),$$VAL("location"),$$VAL("patient"),$$VAL("snippet"),$$VAL("name"))
 ;
 I CMD="cancel" D  G OUT
 . D CANCEL^HMPCORD1(.HMPOUT,$$VAL("uid"))
 ;
 I CMD="performOrderChecks" D  G OUT
 . D ORDERING^HMPCORD1(.HMPOUT,$$VAL("uid"),$$VAL("qoIen"),$$VAL("patient"),$$VAL("location"),$$VAL("provider"),$$VAL("orderAction"),1)
 ;
 I CMD="getSnippets" D  G OUT
 .D GETSNIPS^HMPCORD1(.HMPOUT,$$VAL("patient"),$$VAL("provider"))
 ;
 I CMD="saveOrder" D  G OUT
 .;M ^XTMP("AGP INFO","PARAMS")=PARAMS
 .D EN^HMPCORD3(.HMPOUT,.PARAMS)
 ;
 I CMD="orderAction" D  G OUT
 .N INFO
 .;M ^XTMP("AGP PARAMS")=REQ
 .D BLDINFO(.INFO)
 .D ORDERUID^HMPCORD1(.HMPOUT,.INFO)
 ;
OUT ;
END ;
 ;
BLDINFO(INFO) ;
 N X
 S X="" F  S X=$O(REQ(X)) Q:X=""  D
 .S INFO(X)=REQ(X,1)
 Q
 ;
VAL(X) ; return value from request
 Q $G(REQ(X,1))
 ;
