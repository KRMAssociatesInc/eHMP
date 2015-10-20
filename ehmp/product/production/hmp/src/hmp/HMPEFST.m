HMPEFST ;SLC/KCM -- Tests for extract and freshness stream
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
TEST ; Test synchronization process
 N LASTUPD,TOTPTS,DONE,START,GTOTAL
 S LASTUPD=0,TOTPTS=0,DONE=0,GTOTAL=0
 S START=$P($H,",",2)
 ;D KILL^HMPDJFS
 D STRTSYNC
 F  H 2 D LOADUPD Q:DONE=1
 ;D LOADUPD ; one last time to clear the last patient
 W !,"Elapsed Seconds: ",$P($H,",",2)-START
 Q
STRTSYNC ; Add patients for synchronization
 ; expects TOTPTS
 N ARGS,RSP
 S ARGS("command")="startOperationalDataExtract"
 S ARGS("server")="hmpTest"
 D API^HMPDJFS(.RSP,.ARGS)
 ;ZW ^TMP("HMPF",$J)
 Q
LOADUPD ; Load updates
 ; expects LASTUPD
 N RSP,ARGS,ERR,CNT,LNODE
 ;S ARGS("command")="getOperationalDataUpdates"
 S ARGS("command")="getPtUpdates"
 S ARGS("server")="hmpTest"
 S ARGS("lastUpdate")=LASTUPD
 S ARGS("max")=1000
 D API^HMPDJFS(.RSP,.ARGS)
 D SCANHDRS
 S LASTUPD=$$GETLUPD
 S CNT=$$CNTOBJS,GTOTAL=GTOTAL+CNT
 W !,"lastUpdate: ",LASTUPD,"  items: ",CNT_"/"_GTOTAL,?50
 Q
SCANHDRS ; Scan headers for syncDone objects
 ; expects DONEPTS
 N I
 W !
 ;ZW ^TMP("HMPF",$J)
 S I=0 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . I $G(^TMP("HMPF",$J,I,.3))["syncStatus" S DONE=1
 Q
SHOWHDRS ; Show object header info
 N I
 S I=0 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  D
 . W !,"Hdr: ",$G(^TMP("HMPF",$J,I,.3))
 Q
CNTOBJS() ; Return count of objects returned
 N I,C
 S C=0
 S I=.9 ; skip .5 header node
 W !
 ;ZW ^TMP("HMPF",$J)
 F  S I=$O(^TMP("HMPF",$J,I)) Q:'I  I $L($G(^TMP("HMPF",$J,I,1))) S C=C+1 W !,^TMP("HMPF",$J,I,1)
 Q C
 ;
GETLUPD() ; Return last update value
 N X
 W !
 ;ZW ^TMP("HMPF",$J)
 S X=^TMP("HMPF",$J,.5),X=$P(X,"""lastUpdate"":""",2),X=$P(X,""",")
 Q X
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
