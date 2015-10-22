HMPENSZ ;SLC/KCM - Measure data sizes
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
EN ; Find Max, Mean, Median for each TAG
 K ^XTMP("HMPENSZ-DOMAINS")
 D ALG,PRB,DOC,ENC,ACC,LAB,MIC,RAD,VIT,RXI,RXO,NVA,ORD,OBS
 Q
ALG ;@type ALLERGY @name Allergies
 D REPORT(120.8,"ALG")
 Q
PRB ;@type PROBLEM @name Problems
 D REPORT(9000011,"PRB")
 Q
DOC ;@type DOCUMENT @name Documents
 D REPORT(8925,"DOC")
 Q
ENC ;@type VISIT @name Encounters
 D REPORT(9000010,"ENC")
 Q
ACC ;@type ACCESSION @name Accessions
 D REPORT("63ACC","ACC")
 Q
LAB ;@type LAB @name Lab Results
 D REPORT(63,"LAB")
 Q
MIC ;@name Micro/AP Collections
 D REPORT("63MI","MIC")
 Q
RAD ;@type RADIOLOGY @name Radiology Procedures
 D REPORT(70,"RAD")
 Q
VIT ;@type VITAL @name Vital Measurements
 D REPORT(120.5,"VIT")
 Q
RXI ;@type MED @name Inpatient Medications
 D REPORT(55,"RXI")
 Q
RXO ;@type RX @name Outpatient Medications
 D REPORT(52,"RXO")
 Q
NVA ;@type MED @name Non-VA Medications
 D REPORT("55NVA","NVA")
 Q
ORD ;@name Orders
 D REPORT(100,"ORD")
 Q
OBS ;@name Observations
 D REPORT(704.117,"OBS")
 Q
REPORT(FILE,TAG) ; loop thru reminder index, calulate stats & show report
 D ILOOP(FILE,TAG),CALC(TAG),SAVE(TAG),SHOW(TAG)
 K ^TMP($J)
 Q
ILOOP(FN,TAG) ;
 K ^TMP($J)
 N PT,PTDFN,CNT,TOTPT,HIGHCNT,TOTREC
 S TOTPT=0,TOTREC=0,HIGHCNT=0
 S PT=0 F  S PT=$$NEXTPT(FN,PT) Q:'PT  D
 . S TOTPT=TOTPT+1 W:TOTPT#100=0 "."
 . I "^55^55NVA^52^100^"[("^"_FN_"^") S CNT=$$LP1(PT,FN)
 . I "^63^70^120.5^"[("^"_FN_"^") S CNT=$$LP2(PT,FN)
 . I "63MI"=FN S CNT=$$LPMI(PT)
 . I "63ACC"=FN S CNT=$$LPACC(PT)
 . I 8925=FN S CNT=$$LPDOC(PT)
 . I 120.8=FN S CNT=$$LPALG(PT)
 . I 9000011=FN S CNT=$$LPROB(PT)
 . I 9000010=FN S CNT=$$LPVST(PT)
 . I FN=704.117 S CNT=$$MDC^HMPENSZ(PT)
 . Q:'CNT
 . I (FN="63ACC"),($P(^LR(PT,0),"^",2)'=2) Q  ;non-patient collection
 . S PTDFN=$S(FN="63ACC":$P(^LR(PT,0),"^",3),1:PT)
 . I CNT>HIGHCNT S HIGHCNT=CNT
 . S ^TMP($J,TAG,"FREQ",CNT)=+$G(^TMP($J,TAG,"FREQ",CNT))+1
 . S ^TMP($J,TAG,"COUNT",CNT,PTDFN)="",TOTREC=TOTREC+CNT
 S ^TMP($J,TAG,"STATS","HighestCount")=HIGHCNT
 S ^TMP($J,TAG,"STATS","TotalRecords")=TOTREC
 S ^TMP($J,TAG,"STATS","TotalPatients")=TOTPT
 Q
NEXTPT(FN,PT) ; Returns the next patient based on PT passed in
 I FN="63MI" Q $O(^PXRMINDX(63,"PDI",PT))
 I FN="63ACC" Q $O(^LR(PT))
 I FN=8925 Q $O(^TIU(8925,"C",PT))
 I FN=120.8 Q $O(^GMR(120.8,"B",PT))
 I FN=9000011 Q $O(^AUPNPROB("AC",PT))
 I FN=9000010 Q $O(^AUPNVSIT("C",PT))
 I FN=704.117 Q $O(^MDC(704.117,"PT",PT))
 Q $O(^PXRMINDX(FN,"PI",PT))
 ;
LP1(PT,FN) ; return count for indexes with start/stop dates
 N CNT S CNT=0
 N ITM,STRT,STOP,DAS
 S ITM="" F  S ITM=$O(^PXRMINDX(FN,"PI",PT,ITM)) Q:ITM=""  D
 . S STRT="" F  S STRT=$O(^PXRMINDX(FN,"PI",PT,ITM,STRT)) Q:STRT=""  D
 . . S STOP="" F  S STOP=$O(^PXRMINDX(FN,"PI",PT,ITM,STRT,STOP)) Q:STOP=""  D
 . . . S DAS="" F  S DAS=$O(^PXRMINDX(FN,"PI",PT,ITM,STRT,STOP,DAS)) Q:DAS=""  S CNT=CNT+1
 Q CNT
 ;
LP2(PT,FN) ; return count for indexes with date only
 N CNT S CNT=0
 N ITM,DATE,DAS
 S ITM="" F  S ITM=$O(^PXRMINDX(FN,"PI",PT,ITM)) Q:ITM=""  D
 . S DATE="" F  S DATE=$O(^PXRMINDX(FN,"PI",PT,ITM,DATE)) Q:DATE=""  D
 . . S DAS="" F  S DAS=$O(^PXRMINDX(FN,"PI",PT,ITM,DATE,DAS)) Q:DAS=""  S CNT=CNT+1
 Q CNT
 ;
LPMI(PT) ; return count for micro/anatomic path collections
 N CNT S CNT=0
 N DATE
 S DATE="" F  S DATE=$O(^PXRMINDX(63,"PDI",PT,DATE)) Q:DATE=""  S CNT=CNT+1
 Q CNT
 ;
LPDOC(PT) ; return count for TIU documents
 N CNT S CNT=0
 N DA
 S DA=0 F  S DA=$O(^TIU(8925,"C",PT,DA)) Q:'DA  S CNT=CNT+1
 Q CNT
 ;
 ;N CNT S CNT=0
 ;N CLS,TM,DA
 ;S CLS=0 F  S CLS=$O(^TIU(8925,"ACLPT",CLS)) Q:'CLS  D
 ;. S TM=0 F  S TM=$O(^TIU(8925,"ACLPT",CLS,PT,TM)) Q:'TM  D
 ;. . S DA=0 F  S DA=$O(^TIU(8925,"ACLPT",CLS,PT,TM,DA)) Q:'DA  S CNT=CNT+1
 ;Q CNT
 ;
 ;N CNT S CNT=0
 ;N DOC,TM
 ;S DOC=0 F  S DOC=$O(^TIU(8925,"AA",PT,DOC)) Q:'DOC  D
 ;. S TM=0 F  S TM=$O(^TIU(8925,"AA",PT,DOC,TM)) Q:'TM  D
 ;. . S DA=0 F  S DA=$O(^TIU(8925,"AA",PT,DOC,TM,DA)) Q:'DA  S CNT=CNT+1
 ;Q CNT
 ;
LPALG(PT) ; return count for allergies
 N CNT S CNT=0
 N DA S DA=0
 F  S DA=$O(^GMR(120.8,"B",PT,DA)) Q:'DA  S CNT=CNT+1
 Q CNT
 ;
LPROB(PT) ; return count for problems
 N CNT S CNT=0
 N DA S DA=0
 F  S DA=$O(^AUPNPROB("AC",PT,DA)) Q:'DA  S CNT=CNT+1
 Q CNT
 ;
LPVST(PT) ; return count for visits
 N CNT S CNT=0
 N DA S DA=0
 F  S DA=$O(^AUPNVSIT("C",PT,DA)) Q:'DA  D
 . I "AHSR"[$P(^AUPNVSIT(DA,0),"^",7) S CNT=CNT+1
 . ; (only include ambulatory, hospitalization, surgery, and nursing home)
 Q CNT
 ;
LPACC(PT) ; return count of accessions
 N CNT S CNT=0
 N ACC S ACC=0
 F  S ACC=$O(^LR(PT,"CH",ACC)) Q:'ACC  S CNT=CNT+1
 Q CNT
 ; 
CALC(TAG) ; calculate statistics for a TAG
 ; find the highest item coun
 N MAX S MAX=^TMP($J,TAG,"STATS","HighestCount")
 D MAXPTS(TAG,MAX)
 ;
 ; find the average item count
 N PTS,MEAN
 S PTS=^TMP($J,TAG,"STATS","TotalPatients"),MEAN=0
 I PTS S MEAN=^TMP($J,TAG,"STATS","TotalRecords")\PTS
 D ADDPTS(TAG,"MEAN",MEAN)
 ;
 ; find the median item count
 N POS,CNT,PT,I
 S:PTS#2 PTS=PTS+1 S POS=PTS\2
 S I=0
 S CNT=0 F  S CNT=$O(^TMP($J,TAG,"COUNT",CNT)) Q:'CNT  D  Q:I'<POS
 . S PT=0 F  S PT=$O(^TMP($J,TAG,"COUNT",CNT,PT)) Q:'PT  S I=I+1 Q:I'<POS
 D ADDPTS(TAG,"MEDIAN",CNT)
 ;
 N HIGH,MODE S HIGH=0,MODE=0,CNT=0
 F  S CNT=+$O(^TMP($J,TAG,"COUNT",CNT)) Q:'CNT  D
 . I ^TMP($J,TAG,"FREQ",CNT)>HIGH S HIGH=^(CNT),MODE=CNT
 D ADDPTS(TAG,"MODE",MODE)
 ;
 D MINPTS(TAG)
 ;
 K ^TMP($J,TAG,"COUNT") ; release space
 ;S CNT=0 F  S CNT=$O(^TMP($J,TAG,"FREQ",CNT)) Q:'CNT  W !,CNT_"="_^(CNT)
 ;
 Q
ADDPTS(TAG,STAT,CNT) ; add patients that represent this measurement
 S ^TMP($J,TAG,"STATS",STAT)=CNT
 Q:CNT=""
 N PT,TOTPT,MAXPT
 S TOTPT=0,MAXPT=5
 S PT="" ; since we are reverse ordering...
 F  S PT=$O(^TMP($J,TAG,"COUNT",CNT,PT),-1) Q:'PT  D  Q:TOTPT'<MAXPT
 . S TOTPT=TOTPT+1
 . S ^TMP($J,TAG,"STATS",STAT,TOTPT)=$P(^DPT(PT,0),"^")_"^"_PT
 Q
MINPTS(TAG) ; store the top 10 patients with the highest counts
 N PT,TOTPT,MAXPT
 S CNT=0,TOTPT=0,MAXPT=10
 F  S CNT=$O(^TMP($J,TAG,"COUNT",CNT)) Q:'CNT  D  Q:TOTPT'<MAXPT
 .I $G(^TMP($J,TAG,"STATS","MIN"))="" S ^TMP($J,TAG,"STATS","MIN")=CNT
 . S PT=0 F  S PT=$O(^TMP($J,TAG,"COUNT",CNT,PT)) Q:'PT  D  Q:TOTPT'<MAXPT
 . . S TOTPT=TOTPT+1
 . . S ^TMP($J,TAG,"STATS","MIN",TOTPT)=$P(^DPT(PT,0),"^")_"^"_PT_"^"_CNT
 I $G(^TMP($J,TAG,"STATS","MIN"))="" S ^TMP($J,TAG,"STATS","MIN")=0
 Q
MAXPTS(TAG,CNT) ; store the top 10 patients with the highest counts
 S ^TMP($J,TAG,"STATS","MAX")=CNT
 N PT,TOTPT,MAXPT
 S CNT=CNT+1,TOTPT=0,MAXPT=10
 F  S CNT=$O(^TMP($J,TAG,"COUNT",CNT),-1) Q:'CNT  D  Q:TOTPT'<MAXPT
 . S PT=0 F  S PT=$O(^TMP($J,TAG,"COUNT",CNT,PT)) Q:'PT  D  Q:TOTPT'<MAXPT
 . . S TOTPT=TOTPT+1
 . . S ^TMP($J,TAG,"STATS","MAX",TOTPT)=$P(^DPT(PT,0),"^")_"^"_PT_"^"_CNT
 Q
SAVE(TAG) ; save the TAG measurements in ^XTMP
 S ^XTMP("HMPENSZ-DOMAINS",0)=$$FMADD^XLFDT(DT,30)_U_DT
 K ^XTMP("HMPENSZ-DOMAINS",TAG)
 M ^XTMP("HMPENSZ-DOMAINS",TAG,"FREQ")=^TMP($J,TAG,"FREQ")
 M ^XTMP("HMPENSZ-DOMAINS",TAG,"STATS")=^TMP($J,TAG,"STATS")
 Q
SHOW(TAG) ; show information about sizes
 N STATS M STATS=^TMP($J,TAG,"STATS")
 N DOMAIN S DOMAIN=$$DOMNAME(TAG)
 W !!,DOMAIN,", Patients Searched: ",STATS("TotalPatients")
 W "    Total Records: ",STATS("TotalRecords"),"  "
 N I F I=$X:1:76 W "-"
 W !!,DOMAIN," Maximum (top ten):  ",STATS("MAX") D LSTPT(TAG,"MAX")
 W !!,DOMAIN," Mean (average):  ",STATS("MEAN") D LSTPT(TAG,"MEAN")
 W !!,DOMAIN," Median (middle):  ",STATS("MEDIAN") D LSTPT(TAG,"MEDIAN")
 W !!,DOMAIN," Mode (most common):  ",STATS("MODE") D LSTPT(TAG,"MODE")
 W !!,DOMAIN," Smallest (top ten):  ",STATS("MIN") D LSTPT(TAG,"MIN")
 Q
LSTPT(TAG,STAT) ; list sample patients matching criteria
 N I,X,CNT S CNT=0
 S I=0 F  S I=$O(^TMP($J,TAG,"STATS",STAT,I)) Q:'I  D
 . S X=^TMP($J,TAG,"STATS",STAT,I),CNT=CNT+1
 . W !,?2,$P(X,"^"),?44,$P(X,"^",2)
 . I $P(X,"^",3) W ?62,$P(X,"^",3)," records"
 Q
DOMNAME(TAG) ; return full TAG name given tag
 N X,NAME
 S X=$T(@(TAG_"^HMPENSZ")),NAME=$E(X,$F(X,"@name "),$L(X))
 Q NAME
 ;
VTYPES ; dump visit types
 S DFN=0 F  S DFN=$O(^AUPNVSIT("C",DFN)) Q:'DFN  D
 . S DA=0 F  S DA=$O(^AUPNVSIT("C",DFN,DA)) Q:'DA  D
 .. W !,DFN,?10,$P(^AUPNVSIT(DA,0),"^",7)
 Q
TCOMP ; test compilation
 W !,"This compiles on VDEV"
 Q
MDC(PT) ; Observations in clio for a pt.
 ; Run the PT XREF on the OBS file (704.117)
 N CNT,OBSDT,OBSIFN S OBSDT="",OBSIFN="",CNT=0
 F  S OBSDT=$O(^MDC(704.117,"PT",PT,OBSDT)) Q:OBSDT=""  D
 .F  S OBSIFN=$O(^MDC(704.117,"PT",PT,OBSDT,OBSIFN)) Q:OBSIFN=""  D
 ..S CNT=CNT+1
 Q CNT
