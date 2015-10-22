HMPYFRP2 ;SLC/KCM -- Find recent patients by day and test extracts
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
EN ; Utilities for building roster lists
 W !,"D BLDDAYS to create lists of new patients by day"
 W !,"D EXTRACT to start queuing extracts"
 W !,"D SHOWCNT to see how many new patients in each day"
 W !,"D SHOWSIZE to show size & elapsed time for each day"
 W !,"D SHOWSTS to show task status and any errors in extracts"
 W !,"D SHOWTOP to show the highest times and sizes"
 W !,"D STOP to stop processing of extracts"
 W !!,"Data is stored in ^XTMP(""HMPYFRP"")",!
 Q
 ;
 ; ^XTMP("HMPYFRP",dfn,domain,...extract data...) 
 ; ^XTMP("HMPYFRP","FOUND",dfn)
 ; ^XTMP("HMPYFRP","MEASURE",type,size,dfn,{domain})
 ; ^XTMP("HMPYFRP","TASKS",taskId,...)
 ; ^XTMP("HMPYFRP","TOTALS","patients")
 ; ^XTMP("HMPYFRP","DAY",date,dfn)=byteCount
 ;
BLDDAYS ; Build patient lists for a range of weeks
 ; ^XTMP("HMPYFRP","FOUND",DFN)=""         ; patients already found
 ; ^XTMP("HMPYFRP","DAY",FMDate,DFN)=""    ; patients by day of visit
 D NEWXTMP^HMPDJFS("HMPYFRP",90,"HMP Extract Patients by Day")
 S ^XTMP("HMPYFRP","TOTALS","patients")=0
 ;
 N BEG,END,DAY
 D PRMTDAYS(.BEG,.END) Q:'BEG  Q:'END
 S DAY=BEG F  W "." D BLDDAY(DAY) S DAY=$$FMADD^XLFDT(DAY,1) Q:DAY>END
 D SHOWCNT
 Q
BLDDAY(DAY) ; Build list of patients for the day
 N VDATE,EOD,IEN,X0,CAT,COUNT
 S COUNT=0
 S EOD=DAY_".9999"                      ; to include all day
 S VDATE=$$FMADD^XLFDT(DAY,-1)_".9999"  ; to get entries with no time
 F  S VDATE=$O(^AUPNVSIT("B",VDATE)) Q:'VDATE  Q:VDATE>EOD  D
 . S IEN=0 F  S IEN=$O(^AUPNVSIT("B",VDATE,IEN)) Q:'IEN  D
 . . S X0=^AUPNVSIT(IEN,0),DFN=$P(X0,"^",5),CAT=$P(X0,"^",7)
 . . I 'DFN W !,"Missing DFN for:",IEN QUIT
 . . Q:$D(^XTMP("HMPYFRP","FOUND",DFN))
 . . Q:CAT="E"  ; event (historical)
 . . Q:CAT="N"  ; not found
 . . S COUNT=COUNT+1
 . . S ^XTMP("HMPYFRP","FOUND",DFN)=""
 . . S ^XTMP("HMPYFRP","DAY",DAY,DFN)=""
 S ^XTMP("HMPYFRP","DAY",DAY,"count")=COUNT
 S ^XTMP("HMPYFRP","TOTALS","patients")=^XTMP("HMPYFRP","TOTALS","patients")+COUNT
 Q
EXTRACT ; Begin first extract by day
 N TASK,HMPYDAY
 S HMPYDAY=$O(^XTMP("HMPYFRP","DAY",0))
 I 'HMPYDAY W !,"No lists by day" QUIT
 W !,"Queuing day ",$$FMTE^XLFDT(HMPYDAY)
 S TASK=$$QDAY(HMPYDAY) W " task ",TASK
 Q
STOP ; Stop queued jobs
 S ^XTMP("HMPYFRP","STOP")=1
 Q
QDAY(HMPYDAY) ; Queue extracts for HMPYDAY
 N ZTRTN,ZTDESC,ZTDTH,ZTIO,ZTUCI,ZTCPU,ZTPRI,ZTSAVE,ZTKIL,ZTSYNC,ZTSK
 S ZTRTN="GET4LST^HMPYFRP2",ZTIO="",ZTSAVE("HMPYDAY")="",ZTDTH=$H
 S ZTDESC="Measure extract sizes for patients with visits in a day"
 D ^%ZTLOAD I '$G(ZTSK) W !,"Error queuing "_HMPYDAY
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY)="Task #"_ZTSK
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"status")="Queued"
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"count")=0
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"result")=""
 Q ZTSK
 ;
GET4LST ; Extract data for a list & measure size
 ; expects HMPYDAY (date to extract)
 N HMPYDFN,HMPYH,HMPYDOMS,PTSIZE,HMPFZTSK
 D BLDDOMS^HMPYFRP(.HMPYDOMS)
 S HMPYH=$H
 S HMPFZTSK=$G(ZTSK) ; if tasked, HMPDJ expects HMPFZTSK to be task id
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"status")="Started"
 S HMPYDFN=0 F  S HMPYDFN=$O(^XTMP("HMPYFRP","DAY",HMPYDAY,HMPYDFN)) Q:'HMPYDFN  D
 . S PTSIZE=$$SIZEPT(HMPYDFN)
 . S ^XTMP("HMPYFRP","DAY",HMPYDAY,HMPYDFN)=PTSIZE
 . D TOPSIZE^HMPYFRP(HMPYDFN,"",PTSIZE,"PatientSize")
 S ^XTMP("HMPYFRP","DAY",HMPYDAY)=$$HDIFF^XLFDT($H,HMPYH,2) ; elapsed time for day
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"status")="Finished"
 S HMPYDAY=$O(^XTMP("HMPYFRP","DAY",HMPYDAY))
 I HMPYDAY,'$G(^XTMP("HMPYFRP","STOP")) D QDAY(HMPYDAY)
 Q
SIZEPT(HMPYDFN) ; Extract data for a patient and return size
 N HMPYSIZE,HMPYDOM,HMPBATCH,HMPYET,DOMSIZE
 S HMPYSIZE=0,HMPBATCH="HMPYFRP"
 S HMPYDOM="" F  S HMPYDOM=$O(HMPYDOMS(HMPYDOM)) Q:HMPYDOM=""  D
 . D CLEANDOM
 . S HMPYET=$H
 . S DOMSIZE=$$SIZEDOM(HMPYDFN,HMPYDOM)
 . S HMPYET=$$HDIFF^XLFDT($H,HMPYET,2)
 . S HMPYSIZE=HMPYSIZE+DOMSIZE
 . D TOPSIZE^HMPYFRP(HMPYDFN,HMPYDOM,HMPYET,"ExtractTime")
 . D TOPSIZE^HMPYFRP(HMPYDFN,HMPYDOM,DOMSIZE,"ExtractSize")
 Q HMPYSIZE
 ;
SIZEDOM(DFN,DOMAIN) ; Extract 1 domain and return size
 N $ESTACK,$ETRAP S $ETRAP="D EXTERR^HMPYFRP"
 Q:$G(^XTMP("HMPYFRP","STOP"))=1 0
 N FILTER,RSLT,SIZE
 S FILTER("patientId")=DFN
 S FILTER("domain")=DOMAIN
 D GET^HMPDJ(.RSLT,.FILTER)
 S SIZE=$$SIZEREF^HMPYFRP(RSLT)
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"count")=$G(^XTMP("HMPYFRP","TASKS",HMPYDAY,"count"))+1
 S ^XTMP("HMPYFRP","TASKS",HMPYDAY,"result")=RSLT
 K @RSLT ;^XTMP("HMPYFRP",HMPYDFN,HMPYDOM)
 Q SIZE
 ;
CLEANDOM ; Clean up partition for domain extract
 N X
 K ^TMP("HMPY",$J)
 F X="HMPYDAY","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M ^TMP("HMPY",$J,X)=@X
 D KILL^XUSCLEAN
 F X="HMPYDAY","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M @X=^TMP("HMPY",$J,X)
 K ^TMP("HMPY",$J)
 Q
 ; 
SHOWCNT ; Show counts of unique patients by day
 N DAY
 S DAY=0 F  S DAY=$O(^XTMP("HMPYFRP","DAY",DAY)) Q:'DAY  D
 . W !,$$FMTE^XLFDT(DAY,8)_":"
 . W ?26,$J(^XTMP("HMPYFRP","DAY",DAY,"count"),7)," patients"
 W !!,?10,"Total patients:",?26,$J(^XTMP("HMPYFRP","TOTALS","patients"),7)
 Q
SHOWSIZE ; Show extract sizes by week
 N NAME,DAY,SIZE,DFN,SECS,TOTSIZE,TOTSECS
 S TOTSIZE=0,TOTSECS=0
 S DAY=0 F  S DAY=$O(^XTMP("HMPYFRP","DAY",DAY)) Q:'DAY  D
 . I $G(^XTMP("HMPYFRP","TASKS",DAY,"status"))'="Finished" QUIT
 . S SIZE=0
 . S DFN=0 F  S DFN=$O(^XTMP("HMPYFRP","DAY",DAY,DFN)) Q:'DFN  D
 . . S SIZE=SIZE+^XTMP("HMPYFRP","DAY",DAY,DFN)
 . S SECS=$G(^XTMP("HMPYFRP","DAY",DAY),0)
 . S TOTSIZE=TOTSIZE+SIZE,TOTSECS=TOTSECS+SECS
 . W !,$$FMTE^XLFDT(DAY),?15,$J(SIZE,15)," bytes",?40,SECS\60," minutes ",SECS#60," seconds"
 W !!,"Totals:",?15,$J(TOTSIZE,15)," bytes",?40,TOTSECS\60," minutes ",TOTSECS#60," seconds"
 Q
SHOWSTS ; Show task status and errors
 G SHOWSTS^HMPYFRP
 ;
SHOWTOP ; Show largest sizes and times
 G SHOWTOP^HMPYFRP
 ;
 ;
PRMTDAYS(BEG,END) ; prompt for date range
 S BEG="",END=""
 S BEG=$$ASKDT("Beginning Date","Enter beginning visit date to evaluate.") Q:'BEG
 S END=$$ASKDT("Ending Date","Enter latest date to evaluate.") Q:'END
 S BEG=$P(BEG,"."),END=$P(END,".")               ; only dates
 I BEG>END N X S X=BEG,BEG=END,END=X             ; swap if entered backwards
 W !,"Searching visits from ",$$FMTE^XLFDT(BEG)
 W !,"              through ",$$FMTE^XLFDT(END)
 I '$$ASKYN("Continue","No") S BEG="",END=""
 Q
ASKDT(ASK,HELP) ; prompt for a date in the past
 N DIR,DTOUT,DUOUT,DIRUT,DIROUT,Y
 S DIR(0)="D^::EP",DIR("A")=ASK,DIR("?")=HELP
 D ^DIR I $D(DIRUT) Q ""
 Q Y
 ;
ASKYN(ASK,DFLT) ; prompt for yes/no
 N DIR,DTOUT,DUOUT,DIRUT,DIROUT,Y
 S DIR(0)="Y",DIR("A")=ASK,DIR("B")=DFLT
 D ^DIR
 Q Y
 ;
