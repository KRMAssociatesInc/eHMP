HMPIDX ;SLC/MKB -- Create HMP triggers
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 Q
 ;
EN ; -- create index triggers
 ; GMPL              ;Problems -- GMPL*2*36 provides protocol event
 D GMRV              ;Vitals
 ; MDC               ;CLiO     -- MD*2*38 provides protocol event
 ; TIU               ;TIU      -- TIU*2*106 provides index event
 ;
 D EN^XPAR("PKG.VIRTUAL PATIENT RECORD","HMP TASK WAIT TIME",1,99)
 ;S ^XTMP("HMP",0)="3991231^3110101^HMP Patient Data Monitor"
 Q
 ;
GMPL ; -- create AHMP index on Problem file #9000011
 Q:$O(^DD("IX","BB",9000011,"AHMP",0))  ;exists
 N HMPX,HMPY
 S HMPX("FILE")=9000011,HMPX("NAME")="AHMP"
 S HMPX("TYPE")="MU",HMPX("USE")="A"
 S HMPX("EXECUTION")="R",HMPX("ACTIVITY")=""
 S HMPX("SHORT DESCR")="Event for HMP"
 S HMPX("DESCR",1)="This index invokes a HMP event point when problems are modified."
 S HMPX("DESCR",2)="No actual cross-reference nodes are set or killed."
 S HMPX("SET")="Q:$D(DIU(0))!($G(XDRDVALF)=1)  D GMPL^HMPEVNT(X,DA)"
 S HMPX("KILL")="Q",HMPX("WHOLE KILL")="Q"
 S HMPX("VAL",1)=.02            ;Patient
 S HMPX("VAL",2)=.03            ;Date Last Modified
 D CREIXN^DDMOD(.HMPX,"",.HMPY) ;HMPY=ien^name of index
 Q
 ;
GMRV ; -- create AHMP index on GMRV Measurement file #120.5
 Q:$O(^DD("IX","BB",120.5,"AHMP",0))  ;update
 N HMPX,HMPY
 S HMPX("FILE")=120.5,HMPX("NAME")="AHMP"
 S HMPX("TYPE")="MU",HMPX("USE")="A"
 S HMPX("EXECUTION")="R",HMPX("ACTIVITY")=""
 S HMPX("SHORT DESCR")="Event for HMP"
 S HMPX("DESCR",1)="This index invokes a HMP event point when vitals are modified."
 S HMPX("DESCR",2)="No actual cross-reference nodes are set or killed."
 S HMPX("SET")="Q:$D(DIU(0))!($G(XDRDVALF)=1)  D GMRV^HMPEVNT(X,DA,$G(X(3)))"
 S HMPX("KILL")="Q",HMPX("WHOLE KILL")="Q"
 S HMPX("VAL",1)=.02            ;Patient
 S HMPX("VAL",2)=1.2            ;Rate
 S HMPX("VAL",3)=2              ;Entered in Error
 D CREIXN^DDMOD(.HMPX,"",.HMPY) ;HMPY=ien^name of index
 Q
 ;
MDC ; -- create ASTATUS index on OBS file #704.117
 Q:$O(^DD("IX","BB",704.117,"ASTATUS",0))  ;exists
 N HMPX,HMPY
 S HMPX("FILE")=704.117,HMPX("NAME")="ASTATUS"
 S HMPX("TYPE")="MU",HMPX("USE")="A"
 S HMPX("EXECUTION")="F",HMPX("ACTIVITY")=""
 S HMPX("SHORT DESCR")="Used to trigger MD OBSERVATION UPDATE protocol"
 S HMPX("DESCR",1)="This index invokes the MD OBSERVATION UPDATE protocol when the"
 S HMPX("DESCR",2)="status of OBS data is changed to or from verified."
 S HMPX("DESCR",3)="No actual cross-reference nodes are set or killed."
 S HMPX("SET")="D:((X1=""1"")!(X2=""1"")) PROT^MDCPROTD Q"
 S HMPX("KILL")="Q",HMPX("WHOLE KILL")="Q"
 S HMPX("VAL",1)=.09            ;Status
 D CREIXN^DDMOD(.HMPX,"",.HMPY) ;HMPY=ien^name of index
 Q
 ;
TIU ; -- create AHMP index on TIU Document file #8925
 Q:$O(^DD("IX","BB",8925,"AHMP",0))  ;exists
 N HMPX,HMPY
 S HMPX("FILE")=8925,HMPX("NAME")="AHMP"
 S HMPX("TYPE")="MU",HMPX("USE")="A"
 S HMPX("EXECUTION")="R",HMPX("ACTIVITY")=""
 S HMPX("SHORT DESCR")="Event for HMP"
 S HMPX("DESCR",1)="This index invokes a HMP event point when documents are modified."
 S HMPX("DESCR",2)="No actual cross-reference nodes are set or killed."
 S HMPX("SET")="Q:$D(DIU(0))!($G(XDRDVALF)=1)  D:X(2)>5 TIU^HMPEVNT(X,DA)"
 S HMPX("KILL")="Q",HMPX("WHOLE KILL")="Q"
 S HMPX("VAL",1)=.02            ;Patient
 S HMPX("VAL",2)=.05            ;Status
 D CREIXN^DDMOD(.HMPX,"",.HMPY) ;HMPY=ien^name of index
 Q
