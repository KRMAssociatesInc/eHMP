HMPYFRP1 ;SLC/KCM -- Find recent patients by week and test extracts
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
EN ; Utilities for building roster lists
 W !,"D BLDWKS to create lists of new patients by week"
 W !,"D EXTRACT to start queuing extracts"
 W !,"D SHOWCNT to see how many new patients in each week"
 W !,"D SHOWSIZE to show size & elapsed time for each week"
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
 ; ^XTMP("HMPYFRP","WEEK",date,dfn)=byteCount
 ;
BLDWKS ; Build patient lists for a range of weeks
 ; ^XTMP("HMPYFRP","FOUND",DFN)=""         ; patients already found
 ; ^XTMP("HMPYFRP","WEEK",FMDate,DFN)=""   ; patients by week of visit
 D NEWXTMP^HMPDJFS("HMPYFRP",90,"HMP Extract Patients by Week")
 S ^XTMP("HMPYFRP","TOTALS","patients")=0
 ;
 N BEG,END,WEEK
 D PRMTWKS(.BEG,.END) Q:'BEG  Q:'END
 S WEEK=BEG F  W "." D BLDWEEK(WEEK) S WEEK=$$FMADD^XLFDT(WEEK,7) Q:WEEK>END
 D SHOWCNT
 Q
BLDWEEK(SUNDAY) ; Build list of patients for the week starting SUNDAY
 N VDATE,EOW,IEN,X0,CAT,COUNT
 S COUNT=0
 S EOW=$$FMADD^XLFDT(SUNDAY,7)_".9999"     ; to include all Saturday
 S VDATE=$$FMADD^XLFDT(SUNDAY,-1)_".9999"  ; to get entries with no time
 F  S VDATE=$O(^AUPNVSIT("B",VDATE)) Q:'VDATE  Q:VDATE>EOW  D
 . S IEN=0 F  S IEN=$O(^AUPNVSIT("B",VDATE,IEN)) Q:'IEN  D
 . . S X0=^AUPNVSIT(IEN,0),DFN=$P(X0,"^",5),CAT=$P(X0,"^",7)
 . . I 'DFN W !,"Missing DFN for:",IEN QUIT
 . . Q:$D(^XTMP("HMPYFRP","FOUND",DFN))
 . . Q:CAT="E"  ; event (historical)
 . . Q:CAT="N"  ; not found
 . . S COUNT=COUNT+1
 . . S ^XTMP("HMPYFRP","FOUND",DFN)=""
 . . S ^XTMP("HMPYFRP","WEEK",SUNDAY,DFN)=""
 S ^XTMP("HMPYFRP","WEEK",SUNDAY,"count")=COUNT
 S ^XTMP("HMPYFRP","TOTALS","patients")=^XTMP("HMPYFRP","TOTALS","patients")+COUNT
 Q
EXTRACT ; Begin first extract by week
 N TASK,HMPYWEEK
 S HMPYWEEK=$O(^XTMP("HMPYFRP","WEEK",0))
 I 'HMPYWEEK W !,"No lists by week" QUIT
 W !,"Queuing week ",$$FMTE^XLFDT(HMPYWEEK)
 S TASK=$$QWEEK(HMPYWEEK) W " task ",TASK
 Q
STOP ; Stop queued jobs
 S ^XTMP("HMPYFRP","STOP")=1
 Q
QWEEK(HMPYWEEK) ; Queue extracts for HMPYWEEK
 N ZTRTN,ZTDESC,ZTDTH,ZTIO,ZTUCI,ZTCPU,ZTPRI,ZTSAVE,ZTKIL,ZTSYNC,ZTSK
 S ZTRTN="GET4LST^HMPYFRP1",ZTIO="",ZTSAVE("HMPYWEEK")="",ZTDTH=$H
 S ZTDESC="Measure extract sizes for patients with visits in a week"
 D ^%ZTLOAD I '$G(ZTSK) W !,"Error queuing "_HMPYWEEK
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK)="Task #"_ZTSK
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"status")="Queued"
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"count")=0
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"result")=""
 Q ZTSK
GET4LST ; Extract data for a list & measure size
 ; expects HMPYWEEK (date of Sunday for the week)
 N HMPYDFN,HMPYH,HMPYDOMS,PTSIZE,HMPFZTSK
 D BLDDOMS^HMPYFRP(.HMPYDOMS)
 S HMPYH=$H
 S HMPFZTSK=$G(ZTSK) ; if tasked, HMPDJ expects HMPFZTSK to be task id
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"status")="Started"
 S HMPYDFN=0 F  S HMPYDFN=$O(^XTMP("HMPYFRP","WEEK",HMPYWEEK,HMPYDFN)) Q:'HMPYDFN  D
 . S PTSIZE=$$SIZEPT(HMPYDFN)
 . S ^XTMP("HMPYFRP","WEEK",HMPYWEEK,HMPYDFN)=PTSIZE
 . D TOPSIZE^HMPYFRP(HMPYDFN,"",PTSIZE,"PatientSize")
 S ^XTMP("HMPYFRP","WEEK",HMPYWEEK)=$$HDIFF^XLFDT($H,HMPYH,2) ; elapsed time for week
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"status")="Finished"
 S HMPYWEEK=$O(^XTMP("HMPYFRP","WEEK",HMPYWEEK))
 I HMPYWEEK,'$G(^XTMP("HMPYFRP","STOP")) D QWEEK(HMPYWEEK)
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
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"count")=$G(^XTMP("HMPYFRP","TASKS",HMPYWEEK,"count"))+1
 S ^XTMP("HMPYFRP","TASKS",HMPYWEEK,"result")=RSLT
 K @RSLT ;^XTMP("HMPYFRP",HMPYDFN,HMPYDOM)
 Q SIZE
 ;
CLEANDOM ; Clean up partition for domain extract
 N X
 K ^TMP("HMPY",$J)
 F X="HMPYWEEK","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M ^TMP("HMPY",$J,X)=@X
 D KILL^XUSCLEAN
 F X="HMPYWEEK","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M @X=^TMP("HMPY",$J,X)
 K ^TMP("HMPY",$J)
 Q
 ; 
SHOWCNT ; Show counts of unique patients by week
 N WEEK
 S WEEK=0 F  S WEEK=$O(^XTMP("HMPYFRP","WEEK",WEEK)) Q:'WEEK  D
 . W !,"Week beginning "_$$FMTE^XLFDT(WEEK,8)_":"
 . W ?26,$J(^XTMP("HMPYFRP","WEEK",WEEK,"count"),7)," patients"
 W !!,?10,"Total patients:",?26,$J(^XTMP("HMPYFRP","TOTALS","patients"),7)
 Q
SHOWSIZE ; Show extract sizes by week
 N NAME,WEEK,SIZE,DFN,SECS,TOTSIZE,TOTSECS
 S TOTSIZE=0,TOTSECS=0
 S WEEK=0 F  S WEEK=$O(^XTMP("HMPYFRP","WEEK",WEEK)) Q:'WEEK  D
 . I $G(^XTMP("HMPYFRP","TASKS",WEEK,"status"))'="Finished" QUIT
 . S SIZE=0
 . S DFN=0 F  S DFN=$O(^XTMP("HMPYFRP","WEEK",WEEK,DFN)) Q:'DFN  D
 . . S SIZE=SIZE+^XTMP("HMPYFRP","WEEK",WEEK,DFN)
 . S SECS=$G(^XTMP("HMPYFRP","WEEK",WEEK),0)
 . S TOTSIZE=TOTSIZE+SIZE,TOTSECS=TOTSECS+SECS
 . W !,$$FMTE^XLFDT(WEEK),?15,$J(SIZE,15)," bytes",?40,SECS\60," minutes ",SECS#60," seconds"
 W !!,"Totals:",?15,$J(TOTSIZE,15)," bytes",?40,TOTSECS\60," minutes ",TOTSECS#60," seconds"
 Q
SHOWSTS ; Show task status and errors
 G SHOWSTS^HMPYFRP
 ;
SHOWTOP ; Show largest sizes and times
 G SHOWTOP^HMPYFRP
 ;
 ;
PRMTWKS(BEG,END) ; prompt for date range of weeks
 S BEG="",END=""
 S BEG=$$ASKDT("Beginning Date","Enter beginning visit date to evaluate.") Q:'BEG
 S END=$$ASKDT("Ending Date","Enter latest date to evaluate.") Q:'END
 S BEG=$$FMADD^XLFDT(BEG,-$$DOW^XLFDT(BEG,1))    ; get previous Sunday
 S END=$$FMADD^XLFDT(END,(6-$$DOW^XLFDT(END,1))) ; get following Saturday
 S BEG=$P(BEG,"."),END=$P(END,".")               ; only dates
 I BEG>END N X S X=BEG,BEG=END,END=X             ; swap if entered backwards
 W !,"Searching visits from Sunday ",$$FMTE^XLFDT(BEG)
 W !,"            through Saturday ",$$FMTE^XLFDT(END)
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
