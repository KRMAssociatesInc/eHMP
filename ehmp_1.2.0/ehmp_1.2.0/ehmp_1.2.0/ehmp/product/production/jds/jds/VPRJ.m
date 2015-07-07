VPRJ ;SLC/KCM -- Menu for JSON data store utilities
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ; Menu to run various utilities for the JSON data store:  D ^VPRJ
 ;
MENU ; Allow utilities to be selected from a menu
 G DOMENU^VPRJ1
 ;
START ; Start the HTTP listener
 I $$STATUS^VPRJRCL="running" W !,"Listener is already running.",! Q
 ;
 W !,"Starting listener on port ",$$PORT^VPRJRCL
 D GO^VPRJRCL
 H 1
 W !,"Listener status:  ",$$STATUS^VPRJRCL,!
 Q
STOP ; Stop the HTTP listener
 N X
 I $G(^VPRHTTP(0,"listener"))="stopped" W !,"Listener is already stopped.",! Q
 D STOPW^VPRJRCL
 Q
WAIT ;
 N I,X
 S X=$$STATUS^VPRJRCL
 W !,"Listener status: ",X
 F I=1:1:12 Q:X="stopped"  D
 . H 1
 . S X=$$STATUS^VPRJRCL
 . W "."
 . I X="stopped" W X
 Q
PORT ; Change the listening port number
 N PORT
 W !,"Enter port number: "
 R PORT:300 E  Q
 I '$L(PORT) Q
 I (PORT<1024)!(PORT>65000) W " ??" G PORT
 D STOP
 D SPORT^VPRJRCL(PORT)
 D START
 Q
LOG ; Set the logging level
 N X
 W !,"Log level will be changed on the next connection.",!
 W !,"0: no logging except errors"
 W !,"1: log http errors"
 W !,"2: log requests by pattern"
 W !,"3: log all requests"
 W !,"4: log raw input"
 W !
 W !,"Enter log level: "
 R X:300 E  Q
 I '$L(X) Q
 I X'?1N W " ??" G LOG
 I X>4 W " ??" G LOG
 D SLOG^VPRJRCL(X)
 I X=2 D
 . N PATH,HELP,CURRENT
 . S CURRENT=$G(^VPRHTTP(0,"logging","path"))
 . S HELP="* is wild card, ... matches rest of path.  Example: /vpr/*/index/myidx/..."
 . S PATH=$$PROMPT^VPRJ1("  Path Pattern",CURRENT,"S",HELP)
 . S ^VPRHTTP(0,"logging","path")=PATH
 Q
CLEAR ; Clear the current logs
 W !,"Clearing all logs",!
 D CLEAR^VPRJRCL
 Q
ERROR ; List errors
  N DT,JOB,ID
  S DT=0 F  S DT=$O(^VPRHTTP("log",DT)) Q:'DT  D
  . S JOB=0 F  S JOB=$O(^VPRHTTP("log",DT,JOB)) Q:'JOB  D
  . . S ID=0 F  S ID=$O(^VPRHTTP("log",DT,JOB,ID)) Q:'ID  D
  . . . S X=$G(^VPRHTTP("log",DT,JOB,ID,"error"))
  . . . Q:'$L(X)
  . . . W !,ID,?10,$$HTE^XLFDT(DT),?14,X
  Q
VPRSTAT ; VPR statistics
 D STATUS^VPRJ2P
 Q
PIDSTAT ; PID statistics
 N PID S PID=$$ASKPID^VPRJ2P Q:'$L(PID)
 S PID=""""_PID_""""
 D STATUS^VPRJ2P(PID)
 Q
RIDXALL ; Re-index entire VPR
 D RIDXALL^VPRJ2P
 Q
RIDXPID ; Re-index by PID
 N PID S PID=$$ASKPID^VPRJ2P Q:'$L(PID)
 D RIDXPID^VPRJ2P(PID)
 Q
RIDXONE ; Build a single index
 Q
RBLDALL ; Re-build entire VPR
 D RBLDALL^VPRJ2P
 Q
RBLDPID ; Re-build by PID
 N PID S PID=$$ASKPID^VPRJ2P Q:'$L(PID)
 D RBLDPID^VPRJ2P(PID)
 Q
LISTPTA ; List patients alphabetically
 D LISTPTS(1)
 Q
LISTPTP ; List patients by PID
 D LISTPTS(0)
 Q
LISTPTS(ALPHA) ; List all the patients in the VPR
 N PID,DFN,UID,NAME,ICN,SSN,LIST,X,STAMP
 S ALPHA=$G(ALPHA)
 S PID="" F  S PID=$O(^VPRPT(PID)) Q:'$L(PID)  D
 . S UID=$O(^VPRPT(PID,"urn:va:patient:"))
 . S STAMP=$O(^VPRPT(PID,UID,""),-1)
 . I $P(UID,":",3)'="patient" W !,"Missing demographics: ",PID Q
 . S NAME=^VPRPT(PID,UID,STAMP,"fullName"),ICN=$G(^("icn")),SSN=$G(^("ssn"))
 . I ALPHA S LIST(NAME,PID)=SSN_"^"_ICN_"^"_PID Q
 . S LIST(PID,NAME)=SSN_"^"_ICN_"^"_PID
 I ALPHA D
 . W !,"Name",?30,"SSN",?40,"ICN",?60,"DFN/PID"
 . S NAME="" F  S NAME=$O(LIST(NAME)) Q:NAME=""  D
 . . S PID="" F  S PID=$O(LIST(NAME,PID)) Q:'$L(PID)  D
 . . . S X=LIST(NAME,PID)
 . . . W !,NAME,?30,$P(X,"^"),?40,$P(X,"^",2),?60,$P(X,"^",3)
 E  D
 . W !,"Name",?30,"SSN",?40,"ICN",?60,"DFN/PID"
 . S PID="" F  S PID=$O(LIST(PID)) Q:'$L(PID)  D
 . . S NAME="" F  S NAME=$O(LIST(PID,NAME)) Q:NAME=""  D
 . . . S X=LIST(PID,NAME)
 . . . W !,NAME,?30,$P(X,"^"),?40,$P(X,"^",2),?60,$P(X,"^",3)
 Q
DELPID ; Delete a patient from the VPR
 N PID S PID=$$ASKPID^VPRJ2P Q:'$L(PID)
 D CLEARPT^VPRJPS(PID)
 Q
RESET ; Reset the VPR (kill the database an re-initialize)
 I '$$ISYES("Are you sure you want to delete the database? ") Q
 D SUSPEND
 D KILLDB^VPRJ2P
 D RESUME
 Q
 ;
ASKFRBLD ; ask first before rebuilding everything
 I '$$ISYES("Are you sure you want rebuild all data stores? ") Q
 D FULLRBLD
 Q
ASKFRSET ; ask first before deleting all data
 I '$$ISYES("Are you sure you want to delete all data stores? ") Q
 D FULLRSET
 Q
FULLRBLD ; do a full rebuild of VPR and non-patient data
 D SUSPEND
 K ^TMP($J)
 D RBLDALL^VPRJ2P
 D RBLDALL^VPRJ2D
 D RESUME
 Q
FULLRSET ; reset (delete data and re-init) for VPR and non-patient data
 N NMPORT
 D SUSPEND
 K ^TMP($J)
 D KILLDB^VPRJ2P
 D KILLDB^VPRJ2D
 D RESUME
 ;BL eHMP may require multiple ports. Store ports in VPRHTTP(X,"port") and restart
 I $G(^VPRHTTP(1,"port")) D
 . N PORT
 . S NMPORT=0
 . F  S NMPORT=$O(^VPRHTTP(NMPORT)) Q:NMPORT'=+NMPORT  D
 . . S PORT=^VPRHTTP(NMPORT,"port")
 . . W !,"Restarting HTTP Listener on Port "_PORT
 . . D GO^VPRJRCL(PORT)
 Q
SUSPEND ; suspend listener and set updating flag
 S ^VPRHTTP(0,"updating")=1
 I $E($G(^VPRHTTP(0,"listener")),1,4)'="stop" D
 . S ^VPRHTTP(0,"updating","resume")=1
 . W !,"Suspending HTTP Listener..."
 D STOPW^VPRJRCL
 Q
RESUME ; resume listener if it was running before and reset updating flag
 N RESUME
 S RESUME=$G(^VPRHTTP(0,"updating","resume"),0)
 K ^VPRHTTP(0,"updating")
 I RESUME D
 . W !,"Restarting HTTP Listener..."
 . D GO^VPRJRCL
 Q
ISYES(MSG) ; returns 1 if user answers yes to message, otherwise 0
 N X
 W !,MSG
 R X:300 E  Q 0
 I $$UP^XLFSTR($E(X))="Y" Q 1
 Q 0
 ;
LOGMSG(TYPE,MSG) ; log a new message
 N IDX
 W !,MSG,!
 S IDX=$G(^XTMP("VPRJVUP",TYPE,"msg"),0)+1,^XTMP("VPRJVUP",TYPE,"msg")=IDX
 S ^XTMP("VPRJVUP",TYPE,"msg",IDX)=MSG
 Q
LOGCNT(TYPE) ; increment a count
 N CNT
 S CNT=$G(^XTMP("VPRJVUP",TYPE,"count"),0)+1,^XTMP("VPRJVUP",TYPE,"count")=CNT
 I TYPE="odc" W:CNT#100=0 "." Q
 W "."
 Q
RBLDSTS() ; show status
 N DONE,TYPE,X
 S DONE=1
 S TYPE="" F  S TYPE=$O(^XTMP("VPRJVUP",TYPE)) Q:TYPE=""  I '$G(^XTMP("VPRJVUP",TYPE,"complete")) S DONE=0
 S X="Rebuild Status: "_$S(DONE:"done",1:"processing")
 S TYPE="" F  S TYPE=$O(^XTMP("VPRJVUP",TYPE)) Q:TYPE=""  D
 . S X=X_"   "_TYPE_": "_$G(^XTMP("VPRJVUP",TYPE,"count"))_"/"_$G(^XTMP("VPRJVUP",TYPE,"total"))
 Q X
