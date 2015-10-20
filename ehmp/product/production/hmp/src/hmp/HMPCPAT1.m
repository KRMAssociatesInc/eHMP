HMPCPAT1 ; SLC/AGP,JLC - Process Patient Request from AVIVA System. ; 05/27/2011
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 Q
 ;
ADD(X) ; Add a line @NHIN@(n)=X
 S HMPCNT=$G(HMPCNT)+1
 S @HMPXML@(HMPCNT)=X
 Q
 ;
AE(TEXT) ;
 S HMPERCNT=HMPERCNT+1
 S HMPERARR(HMPERCNT)=TEXT
 Q
 ;
AEM(TEXT) ;
 N NUM
 S NUM=0 F  S NUM=$O(TEXT(NUM)) Q:NUM'>0  D
 .S HMPERCNT=HMPERCNT+1
 .S HMPERARR(HMPERCNT)=TEXT(NUM)
 Q
 ;
GETPCMM(ICN) ;
 N DFN,HMPDATA,HMPDCNT,HMPERARR,HMPERCNT
 S HMPERCNT=0,HMPDCNT=0
 S DFN=$$GETDFN^MPIF001(ICN) I DFN'>0 D AE("Cannot find patient dfn from ICN") G EXIT
 N PCT,PCP,ATT,ASS
 S PCT=$$OUTPTTM^SDUTL3(DFN,DT) I $P(PCT,U)>0 S HMPDCNT=HMPDCNT+1,HMPDATA(HMPDCNT)="<team id='"_$P(PCT,U)_"' value='"_$$ESC^HMPD($P(PCT,U,2))_"'/>"
 S PCP=$$OUTPTPR^SDUTL3(DFN,DT) I $P(PCP,U)>0 S HMPDCNT=HMPDCNT+1,HMPDATA(HMPDCNT)="<primaryProvider id='"_$P(PCP,U)_"' value='"_$$ESC^HMPD($P(PCP,U,2))_"'/>"
 S ATT=$G(^DPT(DFN,.1041)) I ATT S HMPDCNT=HMPDCNT+1,HMPDATA(HMPDCNT)="<attendingProvider id='"_ATT_"' value='"_$$ESC^HMPD($P($G(^VA(200,ATT,0)),U))_"'/>"
 S ASS=$$OUTPTAP^SDUTL3(DFN,DT) I $P(ASS,U)>0 S HMPDCNT=HMPDCNT+1,HMPDATA(HMPDCNT)="<associateProvider id='"_$P(ASS,U)_"' value='"_$$ESC^HMPD($P(ASS,U,2))_"'/>"
 G EXIT
 Q
 ;
EXIT ;
 N CNT
 I $D(HMPERARR) D  Q
 .D ADD("<success>false</success>")
 .D ADD("<error>")
 .D ADD("<message xml:space='preserve'/>")
 .S CNT=0 F  S CNT=$O(HMPERARR(CNT)) Q:CNT'>0  D
 ..D ADD($$ESC^HMPD(HMPERARR(CNT)))
 .D ADD("</error>")
 D ADD("<success>true</success>")
 D ADD("<data>")
 S CNT=0 F  S CNT=$O(HMPDATA(CNT)) Q:CNT'>0  D
 .D ADD(HMPDATA(CNT))
 D ADD("</data>")
 Q
