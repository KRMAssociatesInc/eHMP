HMPYFRP ;SLC/KCM -- Find recent patients and put on roster
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 14
 ;
EN ; Utilities for building roster lists
 W !,"D BLDMTHS to create lists"
 W !,"D SHOWCNT to see how many patients in each month"
 W !,"D XTRLST to get a single month"
 W !,"D GET4ALL to do extracts for all the patients"
 W !,"D SHOWSIZE to show sizes for each month"
 W !,"D SHOWSTS to show task status and any errors in extracts"
 W !,"D SHOWTOP to show the highest times and sizes"
 W !,"D STOP to stop processing of extracts"
 W !!,"Data stored in ^XTMP(""HMPYFRP"")",!
 Q
 ;
BLDMTHS ; Build patient lists for a range of months 
 ; ^XTMP("HMPYFRP","FOUND",DFN)=""         ; patients already found
 ; ^XTMP("HMPYFRP","MONTH",YYYYMM,DFN)=""  ; patients by month of last visit
 ; MONTHS(inverseMonth)=YYYMM^MmmYYYY      ; months to measure
 ;
 K ^XTMP("HMPYFRP")
 S ^XTMP("HMPYFRP",0)=$$HTFM^XLFDT(+$H+4)_"^"_$$HTFM^XLFDT(+$H)_"^HMP Build Rosters by Month"
 ;
 N MTHBEG,MTHEND,MONTH,MONTHS
 D PRMTMTHS(.MTHBEG,.MTHEND) Q:'MTHBEG
 I MTHBEG>MTHEND N X S X=MTHEND,MTHEND=MTHBEG,MTHBEG=X
 S MONTH=MTHBEG F  D  Q:MONTH>MTHEND
 . S MONTHS(MONTH)=MONTH_"^"_$$EXTMTH(MONTH)
 . S MONTH=$$INCMTH(MONTH)
 S MONTH=0 F  S MONTH=$O(MONTHS(MONTH)) Q:'MONTH  D BLDMTH(MONTHS(MONTH)) W "."
 W ! D SHOWCNT
 Q
BLDMTH(MONTH) ; Build list of patients for a month
 N NAME,START,STOP,VDATE,VISIT,X0,DFN,CAT
 S START=$P(MONTH,"^"),NAME=$P(MONTH,"^",2)
 S ^XTMP("HMPYFRP","SEQUENCE",START)=NAME
 S VDATE=+(START_"00"),STOP=+(START_"99")
 F  S VDATE=$O(^AUPNVSIT("B",VDATE))  Q:'VDATE  Q:VDATE>STOP  D
 . S VISIT=0 F  S VISIT=$O(^AUPNVSIT("B",VDATE,VISIT)) Q:'VISIT  D
 . . S X0=^AUPNVSIT(VISIT,0),DFN=$P(X0,"^",5),CAT=$P(X0,"^",7)
 . . Q:$D(^XTMP("HMPYFRP","FOUND",DFN))
 . . Q:CAT="E"  ; event (historical)
 . . Q:CAT="N"  ; not found
 . . S ^XTMP("HMPYFRP","MONTH",NAME,DFN)=""
 . . S ^XTMP("HMPYFRP","FOUND",DFN)=""
 Q
XTRLST ; Prompt for a list name and extract it interactively
 N DIR,DTOUT,DUOUT,DIRUT,DIROUT,X,Y,DA,FROMSYS,TOSYS
 S DIR(0)="D^::EMP",DIR("A")="Extract Month",DIR("?")="Enter the month to run an extract."
 D ^DIR I $D(DIRUT) Q
 N HMPYNAME S HMPYNAME=$$EXTMTH(Y)
 W !,"Running Extracts for "_HMPYNAME_".  Continue? NO// " R X:300
 I $E($$UP^XLFSTR(X))'="Y" Q
 W !
 D GET4LST
 Q
GET4ALL ; Extract data for all lists
 ; VARIABLES THAT CONTROL EXTRACT PROCESS
 ; HMPYNAME: name of month for which patients are being extracted
 ; HMPYDFN : current DFN in the month
 ; HMPYDOMS: domains for which extracts will be done
 ; HMPYDOM : current DOMAIN for extract
 ; these variables get saved before each extract so KILL^XUSCLEAN may be called
 N HMPYNAME,X
 W !,"Queue each list?  NO// " R X:300
 I $E($$UP^XLFSTR(X))="Y" N HMPYQ,LASTPT,HMPDTH S HMPYQ=1,LASTPT=0
 S HMPYNAME=""
 F  S HMPYNAME=$O(^XTMP("HMPYFRP","MONTH",HMPYNAME)) Q:HMPYNAME=""  D
 . I $G(HMPYQ) D  Q
 . . S HMPDTH=$$HADD^XLFDT($H,,LASTPT\1000)
 . . D QU4LST
 . . S LASTPT=LASTPT+^XTMP("HMPYFRP","count",HMPYNAME)
 . E  D
 . . W !,"Running extracts for "_HMPYNAME
 . . D GET4LST
 Q
STOP ; Stop queued jobs
 S ^XTMP("HMPYFRP","STOP")=1
 Q
 ;
QU4LST ; Queue extract of a month
 ; expects HMPYNAME from GET4ALL
 N ZTRTN,ZTDESC,ZTDTH,ZTIO,ZTUCI,ZTCPU,ZTPRI,ZTSAVE,ZTKIL,ZTSYNC,ZTSK
 S ZTRTN="GET4LST^HMPYFRP",ZTIO="",ZTSAVE("HMPYNAME")="",ZTDTH=HMPDTH
 S ZTDESC="Measure extract sizes for patients with visits in a month"
 D ^%ZTLOAD I '$G(ZTSK) W !,"Error queuing "_HMPYNAME
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME)="Task #"_ZTSK
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"status")="Queued"
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"count")=0
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"result")=""
 W !,HMPYNAME,", task #"_ZTSK_" queued for "_$$HTE^XLFDT(HMPDTH)
 Q
GET4LST ; Extract data for a list & measure size
 ; expects HMPYNAME from GET4ALL or XTRLST or Queued Job
 N HMPYDFN,HMPYH,HMPYDOMS,PTSIZE,HMPFZTSK
 D BLDDOMS(.HMPYDOMS)
 S HMPYH=$H
 S HMPFZTSK=$G(ZTSK) ; if tasked, HMPDJ expects HMPFZTSK to be task
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"status")="Started"
 S HMPYDFN=0 F  S HMPYDFN=$O(^XTMP("HMPYFRP","MONTH",HMPYNAME,HMPYDFN)) Q:'HMPYDFN  D
 . S PTSIZE=$$SIZEPT(HMPYDFN)
 . S ^XTMP("HMPYFRP","MONTH",HMPYNAME,HMPYDFN)=PTSIZE
 . D TOPSIZE(HMPYDFN,"",PTSIZE,"PatientSize")
 S ^XTMP("HMPYFRP","MONTH",HMPYNAME)=$$HDIFF^XLFDT($H,HMPYH,2)
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"status")="Finished"
 Q
SIZEPT(HMPYDFN) ; Extract data for a patient and return size
 I '$D(ZTQUEUED) W "."
 N HMPYSIZE,HMPYDOM,HMPBATCH,HMPYET,DOMSIZE
 S HMPYSIZE=0,HMPBATCH="HMPYFRP"
 S HMPYDOM="" F  S HMPYDOM=$O(HMPYDOMS(HMPYDOM)) Q:HMPYDOM=""  D
 . D CLEANDOM
 . S HMPYET=$H
 . S DOMSIZE=$$SIZEDOM(HMPYDFN,HMPYDOM)
 . S HMPYET=$$HDIFF^XLFDT($H,HMPYET,2)
 . S HMPYSIZE=HMPYSIZE+DOMSIZE
 . D TOPSIZE(HMPYDFN,HMPYDOM,HMPYET,"ExtractTime")
 . D TOPSIZE(HMPYDFN,HMPYDOM,DOMSIZE,"ExtractSize")
 Q HMPYSIZE
 ;
SIZEDOM(DFN,DOMAIN) ; Extract 1 domain and return size
 N $ESTACK,$ETRAP S $ETRAP="D EXTERR^HMPYFRP"
 Q:$G(^XTMP("HMPYFRP","STOP"))=1 0
 N FILTER,RSLT,SIZE
 S FILTER("patientId")=DFN
 S FILTER("domain")=DOMAIN
 D GET^HMPDJ(.RSLT,.FILTER)
 S SIZE=$$SIZEREF(RSLT)
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"count")=$G(^XTMP("HMPYFRP","TASKS",HMPYNAME,"count"))+1
 S ^XTMP("HMPYFRP","TASKS",HMPYNAME,"result")=RSLT
 K @RSLT ;^XTMP("HMPYFRP",HMPYDFN,HMPYDOM)
 Q SIZE
 ;
CLEANDOM ; Clean up partition for domain extract
 N X
 K ^TMP("HMPY",$J)
 F X="HMPYNAME","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M ^TMP("HMPY",$J,X)=@X
 D KILL^XUSCLEAN
 F X="HMPYNAME","HMPYDOMS","HMPYDFN","HMPYDOM","HMPYSIZE","HMPYH","HMPBATCH","HMPFZTSK" M @X=^TMP("HMPY",$J,X)
 K ^TMP("HMPY",$J)
 Q
TOPSIZE(DFN,DOMAIN,SIZE,MEASURE) ; Record the highest measures (time, size)
 Q:SIZE<1
 N LOW,NUM,MAX,DFNS,DOMS
 S MAX=30
 S LOW=+$O(^XTMP("HMPYFRP","MEASURE",MEASURE,"")),NUM=$G(^XTMP("HMPYFRP","MEASURE",MEASURE),0)
 I SIZE>LOW S ^XTMP("HMPYFRP","MEASURE",MEASURE,SIZE,DFN,$S($L(DOMAIN):DOMAIN,1:0))="",NUM=NUM+1
 I NUM>MAX D
 . S LOW="" F  S LOW=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,LOW)) Q:'LOW  D  Q:NUM'>MAX
 . . S DFNS="" F  S DFNS=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,LOW,DFNS)) Q:'DFNS  D  Q:NUM'>MAX
 . . . S DOMS="" F  S DOMS=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,LOW,DFNS,DOMS)) Q:DOMS=""  D  Q:NUM'>MAX
 . . . . S NUM=NUM-1 K ^XTMP("HMPYFRP","MEASURE",MEASURE,LOW,DFNS,DOMS)
 S ^XTMP("HMPYFRP","MEASURE",MEASURE)=NUM
 Q
EXTERR ; Come here in case of error during extract
 S ^XTMP("HMPYFRP","ERRORS",$G(HMPYDFN,0),$G(HMPYDOM,0))=$H
 I $D(ZTQUEUED),$L($G(HMPYDFN)),$L($G(HMPYDOM)) K ^XTMP("HMPYFRP",HMPYDFN,HMPYDOM)
 D ^%ZTER
 G UNWIND^%ZTER
 ;
SIZEREF(REF) ; Return size of date in ref
 N X,SIZE,ROOT,LROOT
 S SIZE=0
 S ROOT=$RE($P($RE(REF),")",2,99)),LROOT=$L(ROOT)
 S X=REF F  S X=$Q(@X) Q:$E(X,1,LROOT)'=ROOT  S SIZE=SIZE+$L(@X)
 Q SIZE
 ;
SHOWCNT ; Show counts of unique patients by month
 N NAME,IMONTH,CNT,DFN,TOTAL
 S TOTAL=0
 S IMONTH=0 F  S IMONTH=$O(^XTMP("HMPYFRP","SEQUENCE",IMONTH)) Q:'IMONTH  D
 . S NAME=^XTMP("HMPYFRP","SEQUENCE",IMONTH)
 . S CNT=0
 . S DFN=0 F  S DFN=$O(^XTMP("HMPYFRP","MONTH",NAME,DFN)) Q:'DFN  S CNT=CNT+1
 . W !,NAME,?12,CNT," patients"
 . S ^XTMP("HMPYFRP","count",NAME)=CNT
 . S TOTAL=TOTAL+CNT
 W !!,"Total",?11,TOTAL," patients"
 Q
SHOWSIZE ; Show extract sizes by month
 N NAME,IMONTH,SIZE,DFN,SECS
 S IMONTH=0 F  S IMONTH=$O(^XTMP("HMPYFRP","SEQUENCE",IMONTH)) Q:'IMONTH  D
 . S NAME=^XTMP("HMPYFRP","SEQUENCE",IMONTH)
 . S SIZE=0
 . S DFN=0 F  S DFN=$O(^XTMP("HMPYFRP","MONTH",NAME,DFN)) Q:'DFN  S SIZE=SIZE+^XTMP("HMPYFRP","MONTH",NAME,DFN)
 . S SECS=$G(^XTMP("HMPYFRP","MONTH",NAME),0)
 . W !,NAME,?12,SIZE," bytes",?30,SECS\60," minutes ",SECS#60," seconds"
 Q
SHOWSTS ; Show task status and errors
 N DFN,DOMAIN,X
 S X="" F  S X=$O(^XTMP("HMPYFRP","TASKS",X)) Q:X=""  D
 . W !,X
 . W ?9,$G(^XTMP("HMPYFRP","TASKS",X))
 . W ?25,$G(^XTMP("HMPYFRP","TASKS",X,"status"))
 . W ?35,$G(^XTMP("HMPYFRP","TASKS",X,"count"))
 . ; W ?40,$G(^XTMP("HMPYFRP","TASKS",X,"result"))
 ;
 W !,"Errors (if any) --"
 S DFN="" F  S DFN=$O(^XTMP("HMPYFRP","ERRORS",DFN)) Q:'DFN  D
 . S DOMAIN="" F  S DOMAIN=$O(^XTMP("HMPYFRP","ERRORS",DFN,DOMAIN)) Q:DOMAIN=""  D
 . . W !,DFN,?20,DOMAIN,?45,$$HTE^XLFDT(^XTMP("HMPYFRP","ERRORS",DFN,DOMAIN))
 Q
SHOWTOP ; Show largest sizes and times
 N MEASURE,SIZE,DFN,DOMAIN,I
 F MEASURE="PatientSize","ExtractSize","ExtractTime" D
 . W !,MEASURE," " F I=1:1:24 W "-"
 . W !,"DFN",?15,$S(MEASURE["Time":"Seconds",1:"Bytes")
 . I MEASURE'="PatientSize" W ?30,"Domain"
 . S SIZE=0 F  S SIZE=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,SIZE)) Q:'SIZE  D
 . . S DFN=0 F  S DFN=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,SIZE,DFN)) Q:'DFN  D
 . . . S DOMAIN="" F  S DOMAIN=$O(^XTMP("HMPYFRP","MEASURE",MEASURE,SIZE,DFN,DOMAIN)) Q:DOMAIN=""  D
 . . . . W !,DFN,?15,SIZE
 . . . . I DOMAIN'=0 W ?30,DOMAIN
 . W !
 Q
EXTMTH(DT) ; Return external MmmYYYY format
 N M,Y
 S M=$E(DT,4,5),Y=$E(DT,1,3)
 S Y=Y+1700
 S M=$P($P($T(MNAMES),";;",2,99),";",M)
 Q M_Y
 ;
INCMTH(DT) ; Return incremented month
 N M,Y
 S M=$E(DT,4,5),Y=$E(DT,1,3)
 S M=M+1
 I M>12 S M=1,Y=Y+1
 I $L(Y)'=3 W !,"error in year" Q 99999
 S M="00"_M,M=$E(M,$L(M)-1,$L(M))
 Q Y_M
 ;
PRMTMTHS(BEG,END) ; prompt for the month range
 N DIR,DTOUT,DUOUT,DIRUT,DIROUT,X,Y,DA,FROMSYS,TOSYS
 S DIR(0)="D^::EMP",DIR("A")="Beginning Month",DIR("?")="Enter the earliest month of visits to evaluate."
 D ^DIR I $D(DIRUT) S BEG="",END="" Q
 S BEG=Y
 S DIR(0)="D^::EMP",DIR("A")="Ending Month",DIR("?")="Enter the latest month of visits to evaluate."
 D ^DIR I $D(DIRUT) S BEG="",END="" Q
 S END=Y
 W !,"Searching visits from ",$$FMTE^XLFDT(BEG)," through ",$$FMTE^XLFDT(END),".  Continue? NO// " R X:300
 I $E($$UP^XLFSTR(X))'="Y" S BEG="",END="" Q
 S BEG=$E(BEG,1,5),END=$E(END,1,5)
 Q
BLDDOMS(DOMAINS) ; Build a list of domains
 N X
 F I=1:1 S X=$P($T(DOMAINS+I),";;",2) Q:X="zzzzz"  S DOMAINS(X)=""
 Q
MNAMES ;;Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec
 ;
DOMAINS ;
 ;;allergy
 ;;auxiliary
 ;;appointment
 ;;diagnosis
 ;;document
 ;;factor
 ;;immunization
 ;;lab
 ;;med
 ;;obs
 ;;order
 ;;problem
 ;;procedure
 ;;consult
 ;;image
 ;;surgery
 ;;task
 ;;visit
 ;;vital
 ;;ptf
 ;;exam
 ;;cpt
 ;;education
 ;;pov
 ;;skin
 ;;treatment
 ;;roadtrip
 ;;zzzzz
 ;;
 ;;mh
 ; *S68-JCH* Blank line above mh
