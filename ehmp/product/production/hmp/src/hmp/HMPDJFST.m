HMPDJFST ;SLC/KCM -- Tests for extract and freshness stream
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ; Test Operational Synchronization
 ;
TESTOPD(NUM) ; Test operational data for server NUM
 Q:'NUM
 N SERVER
 S SERVER="Test-Server-"_NUM
 D RUNOPD(SERVER)
 Q
RUNOPD(SERVER) ; Test operational data
 K ^TMP("HMPF",$J)
 N LASTUP,COLLECT,DOMTOT,TOTAL,DONE,STRTERR
 S LASTUP=0,TOTAL=0,DONE=0
 D ADDSRVR(SERVER)
 D RSETSRV(SERVER)
 D OPDSTRT(SERVER) Q:$G(STRTERR)
 F  H 2 D GETUPDS(SERVER,.LASTUP) Q:DONE
 D GETUPDS(SERVER,.LASTUP) ; one last time to clear ^XTMP
 ; Write out the collection counts and domain totals.
 ; They should be the same unless 1 item, which may be just the wrapper.
 N NM
 W !!!,"Collection",?20,"Objects",?30,"Domain Totals",!
 S NM="" F  S NM=$O(COLLECT(NM)) Q:NM=""  D
 . W !,NM,?20,$J($G(COLLECT(NM)),7),?30,$J($G(COLLECT(NM,"total")),13)
 W !!,"Total Objects: ",TOTAL
 K ^TMP("HMPF",$J)
 Q
ADDSRVR(SERVER) ; add a SERVER if not there
 Q:$D(^HMP(800000,"B",SERVER))
 N FDA,FDAIEN,DIERR,ERR
 S FDA(800000,"+1,",.01)=SERVER
 D UPDATE^DIE("","FDA","FDAIEN","ERR")
 I $D(DIERR) W !,"Error saving server"
 D CLEAN^DILF
 Q
RSETSRV(SERVER) ; Reset subscriptions for named SERVER
 N ARGS,RSP
 S ARGS("command")="resetAllSubscriptions"
 S ARGS("server")=SERVER
 D API^HMPDJFS(.RSP,.ARGS)
 W !,"Reset",?10,@RSP@(1) ;{"apiVersion":"1.0","removed":"true"}
 Q
OPDSTRT(SERVER) ; Start operational data extracts for SERVER
 N ARGS,RSP
 S ARGS("command")="startOperationalDataExtract"
 S ARGS("server")=SERVER
 D API^HMPDJFS(.RSP,.ARGS) ;SHOULD THIS RETURN TASK #?
 W !,"Start",?10,@RSP@(1) ;{"apiVersion":"1.0","location":"/hmp/subscription/Test-Server-1/patient/"}
 I @RSP@(1)["""error"":" S STRTERR=1
 Q
GETUPDS(SERVER,LASTUP) ; Get updates for the named SERVER
 ; expects COLLECT,DOMTOT,TOTAL,DONE
 N ARGS,RSP,CNT
 S ARGS("command")="getPtUpdates"
 S ARGS("server")=SERVER
 S ARGS("lastUpdate")=LASTUP
 S ARGS("extractSchema")=2.001
 S ARGS("max")=1000
 D API^HMPDJFS(.RSP,.ARGS)
 S LASTUP=$$GETLUPD(),CNT=$$CNTOBJS(),TOTAL=TOTAL+CNT
 W !,^TMP("HMPF",$J,.5)
 W !,"Fetch",?10,"Object Count: ",$J(CNT,7),"   Last Update: ",LASTUP
 D CNTCOLL(.COLLECT,.DONE) ; count collections
 D VALOBJS
 ;D SHOWHDRS
 ;D SHOWDATA("pt-select^displaygroup^")
 Q
CNTCOLL(COLL,DONE) ; add collection counts
 N I,NM
 S I=.9 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . S NM=$P($P($G(^TMP("HMPF",$J,I,.3)),"""collection"":""",2),"""")
 . Q:'$L(NM)
 . I NM="syncStatus" D DOMTOT(.COLL,I) S DONE=1 Q
 . S COLL(NM)=$G(COLL(NM))+1
 Q
DOMTOT(COLL,I) ; add domain totals to collection array
 N JSON,OBJ,ERR
 M JSON=^TMP("HMPF",$J,I)
 K JSON(.3)
 D DECODE^HMPJSON("JSON","OBJ","ERR")
 I $D(ERR) W !,"ERROR:  decoding syncStatus object"
 S NM="" F  S NM=$O(OBJ("domainTotals",NM)) Q:NM=""  S COLL(NM,"total")=OBJ("domainTotals",NM)
 Q
 ;
 ; Test Patient Syncronization
 ;
TESTPT(NUM) ; Test operational data for server NUM
 Q:'NUM
 N SERVER
 S SERVER="Test-Server-"_NUM
 D RUNPT(SERVER)
 Q
RUNPT(SERVER) ; Test operational data
 K ^TMP("HMPF",$J)
 N LASTUPD,COLLECT,DOMTOT,TOTAL,TOTPTS,DONEPTS,START
 S LASTUPD=0,TOTPTS=0,DONEPTS=0,START=$P($H,",",2)
 D ADDSRVR(SERVER)
 D RSETSRV(SERVER)
 D ADDPTS(SERVER,.TOTPTS)
 F  H 2 D LOADUPD(SERVER,.LASTUPD,.DONEPTS,.TOTPTS) Q:DONEPTS'<TOTPTS
 D LOADUPD(SERVER,.LASTUPD,.DONEPTS,.TOTPTS) ; one moreto clear ^XTMP
 W !,"Elapsed Seconds: ",$P($H,",",2)-START
 Q
ADDPTS(SERVER,TOTPTS) ; Add patients for synchronization
 F I=1:1 S X=$P($T(PATIENTS+I),";;",2,999) Q:X="zzzzz"  D
 . N ARGS,RSP
 . S ARGS("command")="putPtSubscription"
 . S ARGS("server")=SERVER
 . S ARGS("localId")=+X
 . D API^HMPDJFS(.RSP,.ARGS)
 . W !,$S(@RSP@(1)["""error"":":"ERROR",1:"Start"),?10,@RSP@(1)
 . S TOTPTS=TOTPTS+1
 Q
LOADUPD(SERVER,LASTUPD,DONEPTS,TOTPTS) ; Load updates
 ; expects LASTUPD
 N RSP,ARGS,ERR,CNT,LNODE
 S ARGS("command")="getPtUpdates"
 S ARGS("server")=SERVER
 S ARGS("version")=$$GET^XPAR("PKG","HMP BUILD")
 S ARGS("extractSchema")=2.001
 S ARGS("lastUpdate")=LASTUPD
 S ARGS("max")=1000
 D API^HMPDJFS(.RSP,.ARGS)
 S DONEPTS=DONEPTS+$$SCAN4STS
 S LASTUPD=$$GETLUPD
 S CNT=$$CNTOBJS
 D VALOBJS
 W !,^TMP("HMPF",$J,.5)
 W !,"lastUpdate: ",LASTUPD,"  items: ",CNT,?50,"loaded: ",DONEPTS_"/"_TOTPTS Q
 ;
 ; Common functions
 ;
SCAN4STS() ; Scan headers for syncDone objects
 N I,STSCNT
 S STSCNT=0,I=0 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . I $G(^TMP("HMPF",$J,I,.3))["syncStatus" S STSCNT=STSCNT+1
 Q STSCNT
 ;
GETLUPD() ; Return last update value
 N X
 S X=^TMP("HMPF",$J,.5),X=$P(X,"""lastUpdate"":""",2),X=$P(X,""",")
 Q X
 ;
SHOWHDRS ; Show object header info
 N I,X
 S I=0 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . S X=$G(^TMP("HMPF",$J,I,.3))
 . Q:'$L(X)
 . W !,"Hdr: ",X
 Q
SHOWDATA(COLL) ; Show the JSON objects being returned
 N I,X
 S I=.5 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . S X=$G(^TMP("HMPF",$J,I,.3))
 . S X=$P($P(X,"collection"":""",2),"""")
 . Q:'$L(X)  Q:'(COLL[X)
 . W !,"Hdr:",$G(^TMP("HMPF",$J,I,.3))
 . W !,"Dta:",$G(^TMP("HMPF",$J,I,1))
 Q
VALOBJS ; Validate objects
 N I,HDR
 S I=.5 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . S HDR=$G(^TMP("HMPF",$J,I,.3))
 . Q:'$L(HDR)
 . ;W !,"Hdr: ",HDR
 . N OBJ,JSON,LAST,ERROR
 . M JSON=^TMP("HMPF",$J,I)
 . I $E(JSON(.3))="}" S JSON(.3)=$E(JSON(.3),3,$L(JSON(.3)))
 . S LAST=$O(JSON(""),-1),LAST=LAST+1 S JSON(LAST)="}"
 . D DECODE^HMPJSON("JSON","OBJ","ERROR")
 . ;W:'$D(ERROR) " ok"
 . I $D(ERROR) W !,"  >>> ERROR:  ",HDR
 Q
CNTOBJS() ; Return count of objects returned
 N I,C
 S C=0
 S I=.9 ; skip .5 header node
 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  I $L($G(^TMP("HMPF",$J,I,1))) S C=C+1
 Q C
 ;
TOTALS ;
 N P,T
 S T=0
 S P=0 F  S P=$O(^XTMP("HMPFP",P)) Q:'P  S T=T+^XTMP("HMPFP",P,"hmpTest","total")
 W !,"TOTAL: ",T
 Q
GETFEW ;
 S ARGS("command")="getPtUpdates"
 S ARGS("server")="hmpTest"
 S ARGS("lastUpdate")="3140115-251"
 S ARGS("max")=10
 D API^HMPDJFS(.RSP,.ARGS)
 Q
PATIENTS ; list of patients
 ;;25     AVIVAPATIENT,TWENTYTHREE
 ;;100848 AVIVAPATIENT,EIGHT
 ;;100851 AVIVAPATIENT,ELEVEN
 ;;100846 AVIVAPATIENT,FIVE
 ;;100845 AVIVAPATIENT,FOUR
 ;;100849 AVIVAPATIENT,NINE
 ;;100842 AVIVAPATIENT,ONE
 ;;100841 AVIVAPATIENT,SEVEN
 ;;100847 AVIVAPATIENT,SIX
 ;;100850 AVIVAPATIENT,TEN
 ;;8      AVIVAPATIENT,THIRTY
 ;;100844 AVIVAPATIENT,THREE
 ;;100852 AVIVAPATIENT,TWELVE
 ;;3      AVIVAPATIENT,TWENTYEIGHT
 ;;231    AVIVAPATIENT,TWENTYFIVE
 ;;229    AVIVAPATIENT,TWENTYFOUR
 ;;217    AVIVAPATIENT,TWENTYNINE
 ;;237    AVIVAPATIENT,TWENTYONE
 ;;253    AVIVAPATIENT,TWENTYSEVEN
 ;;418    AVIVAPATIENT,TWENTYSIX
 ;;205    AVIVAPATIENT,TWENTYTWO
 ;;100843 AVIVAPATIENT,TWO
 ;;zzzzz
