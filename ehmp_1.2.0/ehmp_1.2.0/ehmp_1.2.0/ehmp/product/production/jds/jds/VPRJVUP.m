VPRJVUP ;SLC/KCM -- Upgrade database
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ; Steps to do before calling UPGRADE^VPRJVUP:
 ;
 ; I $T(STOPW^VPRJRCL) D STOPW^VPRJRCL             ; -- stop listener
 ; W $system.OBJ.Load(quoted_path_to_jds.ro,"ck")  ; -- load routines
 ;
UPGRADE ; upgrade JDS (assume new routines are loaded)
 N LASTVER,THISVER
 K ^XTMP("VPRJVUP")                          ; -- reset upgrade log for
 S ^XTMP("VPRJVUP","odc")=""                 ;    rebuild status calls
 S ^XTMP("VPRJVUP","vpr")=""
 S ^VPRHTTP(0,"updating")=1                  ; -- set upgrade flag
 D STOPW^VPRJRCL                             ; -- stop listener
 S LASTVER=$G(^VPRMETA("version"))           ; -- last installed version
 S THISVER=$P($T(VERSION^VPRJVER),";;",2,99) ; -- new version
 I $$INTVER(LASTVER)<700460 D TASK1          ; -- previous to 0.7-S46
 I $$INTVER(LASTVER)<700610 D CNVRT61        ; -- previous to 0.7-S61
 J UPGBACK^VPRJVUP                           ; -- do rebuild in background
 W !,"Upgrading from "_LASTVER_" to "_THISVER,!
 Q
UPGBACK ; upgrade as background process
 D FULLRBLD^VPRJ                             ; -- full rebuild of VPR and ODC
 K ^VPRHTTP(0,"updating")                    ; -- clear upgrade flag
 D GO^VPRJRCL                                ; -- start listener
 Q
WATCH ; watch the progress of the upgrade
 N X
 F  H 2 S X=$$RBLDSTS^VPRJ() W !,X Q:X["done"
 Q
UPGVIEW ; perform upgrade and watch progress
 D UPGRADE,WATCH
 Q
INTVER(X) ; Return integer representation of version
 Q (1000000*X+($P(X,"-S",2)*10)) ; main*1000000 + sprint*10
 ;
 ;
TASK1 ; move JSON, template, indexing nodes out of main data global
 ; move the JSON and Templates into ^VPRPTJ global
 I '$D(^VPRPTJ("JSON")),$D(^VPRPT("JSON")) D
 . M ^VPRPTJ("JSON")=^VPRPT("JSON")  ; preserve patient data
 . K ^VPRPT("JSON")
 . K ^VPRPT("TEMPLATE")              ; we'll rebuild the rest
 . K ^VPRPT("KEY")
 . K ^VPRPT("PID")
 ;
 ; move the JSON into the ^VPRJDJ global
 I '$D(^VPRJDJ("JSON")),$D(^VPRJD("JSON")) D
 . M ^VPRJDJ("JSON")=^VPRJD("JSON")  ; preserve operational data
 . K ^VPRJD("JSON")
 . K ^VPRJD("TEMPLATE")
 Q
CNVRT61 ; Convert syncstatus objects for version 0.7-S61
 N ROOT,JSON,UID,LROOT,DFN,SITE,PID,DNM,PITER,PTUID,LOCIDS
 S ROOT="urn:va:syncstatus:",LROOT=$L(ROOT)
 S UID=ROOT F  S UID=$O(^VPRJDJ("JSON",UID)) Q:$E(UID,1,LROOT)'=ROOT  D
 . W UID,!
 . M JSON=^VPRJDJ("JSON",UID)
 . D DECODE^VPRJSON("JSON","OBJ","ERR")
 . S SITE=$P(UID,":",4),DFN=$P(UID,":",5)
 . I SITE'="OPD",$D(DFN) D
 . . S PTUID="urn:va:patient:"_SITE_":"_DFN_":"_DFN
 . . S PID=SITE_";"_DFN
 . . S DNM=^VPRPT(PID,PTUID,"displayName")
 . . S LOCIDS="",PITER=""
 . . F  S PITER=$O(^VPRPT(PID,PTUID,"facilities",PITER)) Q:PITER=""  D
 . . . I $D(^VPRPT(PID,PTUID,"facilities",PITER,"code")),$D(^VPRPT(PID,PTUID,"facilities",PITER,"localPatientId"))  D
 . . . . I LOCIDS'=""  S LOCIDS=LOCIDS_","
 . . . . S LOCIDS=LOCIDS_","_^VPRPT(PID,PTUID,"facilities",PITER,"code")_";"_^VPRPT(PID,PTUID,"facilities",PITER,"localPatientId")
 . . S OBJ("displayName")=DNM,OBJ("localPatientIds")=LOCIDS
 . . K JSON
 . . D ENCODE^VPRJSON("OBJ","JSON","ERR")
 . . M ^VPRJDJ("JSON",UID)=JSON
 Q
