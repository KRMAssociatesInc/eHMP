HMPPATS ;SLC/MKB -- Patient Management Utilities
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^DGS(41.1                     3796
 ; ^DPT                         10035
 ; ^OR(100.21
 ; ^PXRMXP(810.5
 ; ^SC                          10040
 ; ^SCTM(404.51                 +2936? >>or use FIND^DIC?
 ; DICN                         10009
 ; MPIF001                       2701
 ; SCAPMC                        1916
 ; SDAMA301                      4433
 ; XLFDT                        10103
 ; XPAR                          2263
 ; XUAF4                         2171
 ;
APPT ; -- Return patients w/appointments tomorrow
 ; OPT = HMP APPOINTMENTS
 N NOW,NOW1,HMPX,HMPL,HMPN,DFN,DA,TOKEN,NEW,X
 S NOW=$$NOW^XLFDT,NOW1=$$FMADD^XLFDT(NOW,1)
 S HMPX(1)=NOW_";"_NOW1 ;next 24hours
 S HMPX("FLDS")=1,HMPX("SORT")="P",HMPX(3)="R;I;NT"
 ; ck parameter for desired location(s): HMPX(2)="loc1;loc2;...;loc#"
 D GETLST^XPAR(.HMPL,"ALL","HMP LOCATIONS") I +$G(HMPL) D
 . S X=+$G(HMPL(1)),HMPX(2)=$S($D(^SC(X,0)):X,1:"")
 . F I=2:1:+HMPL S X=+$G(HMPL(I)) S:$D(^SC(X,0)) HMPX(2)=HMPX(2)_";"_X
 S HMPN=$$SDAPI^SDAMA301(.HMPX) Q:HMPN<1
 S DFN=0 F  S DFN=$O(^TMP($J,"SDAMA301",DFN)) Q:DFN<1  D
 . S DA=0 F  S DA=$O(^HMP(800000,DA)) Q:DA<1  I $P($G(^(DA,0)),U,2) D
 .. Q:$D(^HMP(800000,"ADFN",DFN,DA))  ;already subscribed
 .. S TOKEN=DA_"~"_NOW,NEW(TOKEN)=""
 .. S ^XTMP("HMPX",TOKEN,DFN)=""
 I $D(NEW) D SEND^HMPHTTP(.NEW) ;send poke to each URL with list TOKEN
 Q
 ;
ADM(DFN) ; -- Return new inpatient [from DGPM^HMPEVNT]
 N NOW,DA,TOKEN,NEW
 S NOW=$$NOW^XLFDT,DFN=+$G(DFN)
 S DA=0 F  S DA=$O(^HMP(800000,DA)) Q:DA<1  I $P($G(^(DA,0)),U,3) D
 . Q:$D(^HMP(800000,"ADFN",DFN,DA))  ;already subscribed
 . S TOKEN=DA_"~"_NOW,NEW(TOKEN)=""
 . S ^XTMP("HMPX",TOKEN,DFN)=""
 I $D(NEW) D SEND^HMPHTTP(.NEW) ;send poke to each URL with list TOKEN
 Q
 ;
GTALLLST(HMP,HMPTYPE) ;
 S HMP=$NA(^TMP($J,"HMP")) K @HMP
 N HMPI,HMPSITE,HMPUSER,HMPSTA
 S HMPUSER=DUZ,HMPSITE=DUZ(2),HMPSTA=$$STA^XUAF4(DUZ(2)),HMPI=0
 D ADD("<results>")
 I $D(HMPTYPE("ALL"))>0 S (HMPTYPE("OR"),HMPTYPE("PXRM"),HMPTYPE("PCMM"))=""
 D ADD("<lists>")
 I $D(HMPTYPE("OR"))>0 D GETOERRL
 I $D(HMPTYPE("PXRM"))>0 D GETPXRML
 I $D(HMPTYPE("PCMM"))>0 D GETPCMML
 D ADD("</lists>")
 D ADD("</results>")
 Q
 ;
GETLSTPT(HMP,HMPLIST) ;
 S HMP=$NA(^TMP($J,"HMP")) K @HMP
 N GBL,IEN,TAG,HMPI,HMPSITE,HMPUSER,HMPSTA
 S HMPUSER=DUZ,HMPSITE=DUZ(2),HMPSTA=$$STA^XUAF4(DUZ(2)),HMPI=0
 D ADD("<results>")
 S GBL=HMPLIST("global"),IEN=HMPLIST("ien")
 S TAG=$S(GBL="OR":"GETOERRP",GBL="PXRMXP":"GETPXRMP",GBL="PCMM":"GETPCMMP",1:"")
 I TAG'="",IEN'="" D @(TAG_"(IEN)")
 D ADD("</results>")
 Q
 Q
 ;
GETPCMML ;
 N NAME,IEN
 S NAME="" F  S NAME=$O(^SCTM(404.51,"B",NAME)) Q:NAME=""  D
 .S IEN=$O(^SCTM(404.51,"B",NAME,"")) Q:IEN'>0
 .D ADD("<list value='"_NAME_"' id='"_IEN_"' global='PCMM'/>")
 Q
 ;
GETPCMMP(IEN) ;
 N DFN,OK,HMPERR,HMPX
 K ^TMP($J,"PCM")
 S OK=$$PTTM^SCAPMC(IEN,"SCDT","^TMP($J,""PCM"")",.HMPERR)
 I OK'>0 Q
 S DFN=0 F  S DFN=$O(^TMP($J,"PCM","SCPTA",DFN)) Q:DFN'>0  D
 .S HMPX(DFN)=""
 D XML(.HMPX)
 Q
 ;
GETPXRML ;
 N NAME,IEN
 S NAME="" F  S NAME=$O(^PXRMXP(810.5,"B",NAME)) Q:NAME=""  D
 .S IEN=$O(^PXRMXP(810.5,"B",NAME,"")) Q:IEN'>0
 .D ADD("<list value='"_NAME_"' id='"_IEN_"' global='PXRMXP'/>")
 Q
 ;
GETPXRMP(IEN) ;
 N CNT,HMPX
 S CNT=0 F  S CNT=$O(^PXRMXP(810.5,IEN,30,CNT)) Q:CNT'>0  D
 .S HMPX(+$G(^PXRMXP(810.5,IEN,30,CNT,0)))=""
 D XML(.HMPX)
 Q
 ;
GETOERRL ;
 N NAME,IEN
 S NAME="" F  S NAME=$O(^OR(100.21,"B",NAME)) Q:NAME=""  D
 .S IEN=$O(^OR(100.21,"B",NAME,"")) Q:IEN'>0
 .D ADD("<list value='"_NAME_"' id='"_IEN_"' global='OR'/>")
 Q
 ;
GETOERRP(IEN) ;
 N CNT,HMPX
 S CNT=0 F  S CNT=$O(^OR(100.21,IEN,10,CNT)) Q:CNT'>0  D
 .S HMPX(+$G(^OR(100.21,IEN,10,CNT,0)))=""
 D XML(.HMPX)
 Q
 ;
IN(HMP) ; -- Return current inpatients
 ; RPC = HMP INPATIENTS
 N WARD,DFN,HMPX,HMPI
 S WARD="" F  S WARD=$O(^DPT("CN",WARD)) Q:WARD=""  D
 . S DFN=0 F  S DFN=$O(^DPT("CN",WARD,DFN)) Q:DFN<1  S HMPX(DFN)=""
 S HMP=$NA(^TMP($J,"HMP")) K @HMP
 D XML(.HMPX)
 Q
 ;
OUT(HMP,BEG,END) ; -- Return patients w/appointments [tomorrow]
 ; RPC = HMP APPOINTMENTS
 N HMPX,HMPN,DFN,HMPDT,HMPI,HMPA
 I '$G(BEG) D   ;default = tomorrow, if not passed in
 . S BEG=$$FMADD^XLFDT(DT,1),END=BEG
 ; find patients with appointments
 S END=$G(END,BEG),HMPX(1)=BEG_";"_END
 S HMPX("SORT")="P",HMPX("FLDS")=1,HMPX(3)="R;I;NT"
 S HMPN=$$SDAPI^SDAMA301(.HMPX) Q:HMPN<1  K HMPX
 S DFN=0 F  S DFN=$O(^TMP($J,"SDAMA301",DFN)) Q:DFN<1  S HMPX(DFN)=""
 ; find patients scheduled for admission
 S HMPDT=0 F  S HMPDT=$O(^DGS(41.1,"C",HMPDT)) Q:HMPDT<1!(HMPDT>END)  D
 . S HMPI=0 F  S HMPI=$O(^DGS(41.1,"C",HMPDT,HMPI)) Q:HMPI<1  D
 .. S HMPA=$G(^DGS(41.1,HMPI))
 .. Q:$P(HMPA,U,13)  Q:$P(HMPA,U,17)  ;cancelled or admitted
 .. S DFN=+HMPA S:DFN HMPX(DFN)=""
 ; return list
 S HMP=$NA(^TMP($J,"HMP")) K @HMP
 D XML(.HMPX)
 Q
 ;
XML(PATIENT) ; -- Return patient list as XML
 N DFN,ICN,Y
 D ADD("<patients>")
 S DFN=0 F  S DFN=$O(PATIENT(DFN)) Q:DFN<1  D
 . S ICN=$$GETICN^MPIF001(DFN)
 . S Y="<patient id='"_DFN_$S(ICN:"' icn='"_ICN,1:"")_"' />" D ADD(Y)
 D ADD("</patients>")
 Q
 ;
SUBS(HMP,SYS,ON,LIST) ; -- Un/Subscribe to Patient Data Monitor
 ; RPC = HMP SUBSCRIBE
 N DA,I,ICN,DFN,HDR,HMPI
 S SYS=$G(SYS),ON=+$G(ON) Q:'$L(SYS)
 S DA=$$FIND(SYS) Q:DA<1
 S HMP=$NA(^TMP("HMP",$J)) K @HMP
 S:'$D(^XTMP("HMP")) ^XTMP("HMP",0)="3991231^"_DT_"^HMP Patient Data Monitor"
 ;
 ; loop through LIST(n) = 'dfn;icn'
 D ADD("<patients>")
 S I="" F  S I=$O(LIST(I)) Q:I=""  S DFN=LIST(I) D
 . S ICN=+$P(DFN,";",2),DFN=+$G(DFN)
 . I 'DFN S DFN=+$$GETDFN^MPIF001(ICN)
 . I DFN<1!'$D(^DPT(DFN)) D RET(DFN,"error") Q
 . I ON D  Q
 .. S:'$D(^HMP(800000,DA,1,DFN,0)) HDR=$G(^HMP(800000,DA,1,0)),^(0)="^800000.01P^"_DFN_U_($P(HDR,U,4)+1)
 .. S ^HMP(800000,DA,1,DFN,0)=DFN_U_ON,^HMP(800000,"ADFN",DFN,DA)=""
 .. D RET(DFN,"on")
 . ; else, remove patient tracking info from ^XTMP
 . S:$D(^HMP(800000,DA,1,DFN,0)) $P(^(0),U,2)=0
 . K ^HMP(800000,"ADFN",DFN,DA)
 . D RET(DFN,"off")
 D ADD("</patients>")
 Q
 ;
FIND(ID) ; -- Return ien of system ID in ^HMP
 N DA,DO,DIC,X,Y
 I $G(ID)="" Q 0                        ;error
 S DA=+$O(^HMP(800000,"B",ID,0)) I DA<1 D  ;add
 . S DIC="^HMP(800000,",DIC(0)="F",X=ID
 . D FILE^DICN S DA=+Y
 Q DA
 ;
ZFIND(URL) ; -- Return ien of URL in ^HMP
 N NAME,DA S NAME=$G(URL)
 S:NAME?1"http".E NAME=$P(NAME,"/",3) S:NAME[":" NAME=$P(NAME,":")
 S DA=0 F  S DA=$O(^HMP(800000,"B",NAME,DA)) Q:DA<1  I $G(^HMP(800000,DA,.1))=URL Q
 I DA<1 D  ;add
 . N DO,DIC,X,Y
 . S DIC="^HMP(800000,",DIC(0)="F",X=NAME
 . D FILE^DICN S DA=+Y
 . S:DA>0 ^HMP(800000,DA,.1)=URL
 Q DA
 ;
RET(DFN,STS) ; -- add XML node for patient DFN update subscription
 N Y S Y="<patient dfn='"_$G(DFN)
 S Y=Y_"' subscribe='"_$G(STS)_"' />"
 D ADD(Y)
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
