HMPEFSP ;SLC/KCM -- PUT/POST for Extract and Freshness Stream
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ;
 ; --- create a new patient subscription
 ;
PUTSUB(ARGS,BODY) ; return location after creating a new subscription
 ; PUT to: /hmp/subscription
 ;   JSON: {server:hmpXYZ,localId:229,icn:102324324,domains:[lab,med,...]}
 ;HMPFRSP: location:/hmp/subscription/{hmpSrvId}/patient/{dfn}
 ;
 N CNT,DOMAIN,ICN,OBJ,ERR,HMPSRV,HMPFDFN,HMPFDOM,HMPBATCH,HMPFERR,NEWSUB
 D DECODE^HMPJSON("BODY","OBJ","ERR")
 I $D(ERR) D SETERR^HMPDJFS("Unable to decode JSON") Q ""
 S HMPSRV=$TR($G(OBJ("server")),"~","=")
 I '$L(HMPSRV) D SETERR^HMPDJFS("Missing HMP Server ID") Q ""
 M HMPFDOM=OBJ("domains") I $D(HMPFDOM)<10 D DOMAINS(.HMPFDOM)
 S HMPBATCH="HMPFX~"_HMPSRV_"~OPD"
 ;;AGP check for domains already in process, remove domains that already in process.
 I $D(^XTMP(HMPBATCH,0,"status")) D
 .S CNT=0 F  S CNT=$O(HMPFDOM(CNT)) Q:CNT'>0  D
 ..S DOMAIN=$G(HMPFDOM(CNT)) I DOMAIN="" Q
 ..I $G(^XTMP(HMPBATCH,0,"status",DOMAIN))=0 K HMPFDOM(CNT)
 ;
 I '$$TM^%ZTLOAD D SETERR^HMPDJFS("Taskman not running") Q ""
 I '$D(^XTMP("HMPFP",0)) D NEWXTMP^HMPDJFS("HMPFP",9999,"HMP Subscriptions")
 ;
 ; ^XTMP("HMPFP",HMPFDFN,HMPSRV)=0 -- unsubscribed
 ; ^XTMP("HMPFP",HMPFDFN,HMPSRV)=1 -- subscribed
 ; ^XTMP("HMPFP",HMPFDFN,HMPSRV)=2 -- initialized (extracts complete)
 ; locks ensure only one process queues the extracts
 S NEWSUB=0
 ;
 L +^XTMP("HMPFP","OPD",HMPSRV):5 E  D SETERR^HMPDJFS("Unable to lock operational data for "_DOMAIN) Q
 ;I $G(^XTMP("HMPFP",DOMAIN,HMPSRV))'=1 S ^XTMP("HMPFP","OPD",HMPSRV)=1,NEWSUB=1
 S ^XTMP("HMPFP","OPD",HMPSRV)=1,NEWSUB=1
 L -^XTMP("HMPFP","OPD",HMPSRV)
 I NEWSUB D QUINIT(HMPBATCH,.HMPFDOM) Q:$G(HMPFERR) ""
 Q "/hmp/subscription/"_HMPSRV_"/operationalData"
 ;
QUINIT(HMPBATCH,HMPFDOM) ; Queue the initial extracts for a patient
 ; HMPBATCH="HMPFP~hmpsrvid~OPD"  example: HMPFX~hmpXYZ~229
 ; HMPFDOM(n)="domainName"
 ; 
 ; ^XTMP("HMPFX~hmpsrvid~OPD",0)=expires^created^HMP Operational Data Extract
 ;                           ,0,"status",domain)=extract status
 ;                           ,0,"task",taskIen)=""
 ;                           ,taskIen,domain,... (extract data)
 ;
 D NEWXTMP^HMPDJFS(HMPBATCH,1,"HMP Operational Data Extract")
 S ^XTMP(HMPBATCH,0,"time")=$H
 N I S I=0 F  S I=$O(HMPFDOM(I)) Q:'I  D SETDOM("status",HMPFDOM(I),0)
 D SETMARK("Start",HMPBATCH) ; sends full demographics
 ;
 N ZTRTN,ZTDESC,ZTDTH,ZTIO,ZTUCI,ZTCPU,ZTPRI,ZTSAVE,ZTKIL,ZTSYNC,ZTSK
 S ZTRTN="DQINIT^HMPEFSP",ZTIO="",ZTDTH=$H
 S ZTSAVE("HMPBATCH")="",ZTSAVE("HMPFDOM(")=""
 S ZTDESC="Build HMP operational data domains"
 D ^%ZTLOAD
 ;D DQINIT
 ;
 I $G(ZTSK) D
 .W !,"task: "_ZTSK
 .S ^XTMP(HMPBATCH,0,"task",ZTSK)="" I 1
 E  D SETERR^HMPDJFS("Task not created")
 Q
SETDOM(ATTRIB,DOMAIN,VALUE) ; Set value for a domain
 ; expects: HMPBATCH
 ; ATTRIB: "status" or "count" attribute
 ; DOMAIN: name of domain
 ; if status, VALUE: 0=waiting, 1=ready
 ; if count,  VALUE: count of items
 S ^XTMP(HMPBATCH,0,ATTRIB,DOMAIN)=VALUE
 Q
DQINIT ; Dequeue initial extracts
 ; expects:  HMPBATCH, HMPFDFN, HMPFDOM, ZTSK
 I '$D(^XTMP(HMPBATCH,0,"task",ZTSK)) Q  ; extract was superceded
 N HMPFDOMI,HMPFSYS,HMPFZTSK
 S HMPFSYS=$$GET^XPAR("SYS","HMP SYSTEM NAME")
 S HMPFZTSK=ZTSK ; just in case the unexpected happens to ZTSK
 S HMPFDOMI="" F  S HMPFDOMI=$O(HMPFDOM(HMPFDOMI)) Q:'HMPFDOMI  D
 . N FILTER,RSLT
 . S FILTER("domain")=HMPFDOM(HMPFDOMI)
 . D GET^HMPEF(.RSLT,.FILTER)
 . D MOD4STRM(HMPFDOM(HMPFDOMI))
 . ; if superceded, stop processing domains
 . I '$D(^XTMP(HMPBATCH,0,"task",HMPFZTSK)) S HMPFDOMI=999 Q
 . D SETDOM("status",HMPFDOM(HMPFDOMI),1) ; ready
 ; if superceded, remove extracts produced by this task
 I '$D(^XTMP(HMPBATCH,0,"task",HMPFZTSK)) K ^XTMP(HMPBATCH,HMPFZTSK) Q
 ; don't assume initialized, since we may split domains to other tasks
 I $$INITDONE(HMPBATCH) D             ; if all domains extracted
 . D SETMARK("Done",HMPBATCH) ; - add updated syncStatus
 . D MVFRUPD(HMPBATCH)        ; - move freshness updates over
 Q
SETMARK(TYPE,HMPBATCH) ; Post markers for begin and end of initial synch
 N HPMSRV,NODES,X
 S HMPSRV=$P(HMPBATCH,"~",2)
 D POST^HMPDJFS("OPD","sync"_TYPE,HMPBATCH,"",HMPSRV,.NODES)
 Q:TYPE="Start"
 S X="" F  S X=$O(NODES(X)) Q:X=""  D  ; iterate hmp servers
 . S ^XTMP("HMPFP","tidy",X,$P(NODES(X),U),$P(NODES(X),U,2))=HMPBATCH
 Q
MVFRUPD(HMPBATCH) ; Move freshness updates over active stream
 N I,X,FROM,HMPSRV,TYPE,ID,ACT
 S HMPSRV=$P(HMPBATCH,"~",2)
 S ^XTMP("HMPFP","OPD",HMPSRV)=2       ; now initialized
 S FROM="HMPFH~"_HMPSRV_"~OPD"
 S I=0 F  S I=$O(^XTMP(FROM,I)) Q:'I  D  ; move over held updates
 . S X=^XTMP(FROM,I)
 . S TYPE=$P(X,U,2),ID=$P(X,U,3),ACT=$P(X,U,4)
 . D POST^HMPDJFS("OPD",TYPE,ID,ACT,HMPSRV)
 K ^XTMP(FROM)
 Q
MOD4STRM(DOMAIN) ; modify extract to be ready for stream
 ; expects: HMPBATCH, HMPFSYS, HMPFZTSK
 ; results are in ^XTMP("HMPFX~hmpsrv~dfn",DFN,DOMAIN,...)
 ; syncError: {uid,collection,error}  uid=urn:va:syncError:sysId:dfn:extract
 N DFN,HMPSRV,COUNT,LNODE
 S HMPSRV=$P(HMPBATCH,"~",2)
 ; no items -- COUNT is in 1 node, otherwise COUNT is in the .5 node
 S COUNT=0
 I $D(^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,.5)) S COUNT=+$P(^(.5),"""totalItems"":",2)
 ; remove headers (.5,.6) and closing braces (at COUNT+1)
 K ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,.5)
 K ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,.6)
 K ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,COUNT+1)
 S LNODE=$O(^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,""),-1)
 I LNODE>0,$G(^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,LNODE))="]}}" K ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,LNODE)
 ; if no items -- return empty object to be wrapped
 I COUNT=0 S ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,1,1)=""
 ; if error, add syncError object (from COUNT+2)
 I $D(^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,COUNT+2)) D
 . N JSON
 . D BLDSERR(COUNT+2,DOMAIN,.JSON) Q:'$D(JSON)
 . S COUNT=COUNT+1
 . M ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,COUNT)=JSON
 ; set .7 node to total count (including error)
 ;S ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,.7)=COUNT
 D SETDOM("count",DOMAIN,COUNT)
 ; if count 0 -- still return wrapper object so we know the domain had nothing
 D POST^HMPDJFS("OPD","syncDomain",DOMAIN_":"_HMPFZTSK_":"_($S(COUNT=0:1,1:COUNT))_":"_COUNT,"",HMPSRV)
 Q
BLDSERR(NODE,DOMAIN,ERRJSON) ; Create syncError object in ERRJSON
 ; expects: HMPBATCH, HMPFSYS, HMPFZTSK
 N ERRJSON,ERROBJ,ERR,ERRMSG,SYNCERR
 S ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,NODE,.3)="{"  ; replace , with { for decoding JSON
 M ERRJSON=^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,NODE)
 D DECODE^HMPJSON("ERRJSON","ERROBJ","ERR") I $D(ERR) S $EC=",UJSON decode error,"
 K ^XTMP(HMPBATCH,HMPFZTSK,DOMAIN,NODE)
 S ERRMSG=ERROBJ("error","message")
 Q:'$L(ERRMSG)
 S SYNCERR("uid")="urn:va:syncError:"_HMPFSYS_":"_DOMAIN
 S SYNCERR("collection")=DOMAIN
 S SYNCERR("error")=ERRMSG
 D ENCODE^HMPJSON("SYNCERR","ERRJSON","ERR") I $D(ERR) S $EC=",UJSON encode error,"
 Q
INITDONE(HMPBATCH) ; Return 1 if all domains are done
 N X,DONE
 S X="",DONE=1
 F  S X=$O(^XTMP(HMPBATCH,0,"status",X)) Q:'$L(X)  I '^(X) S DONE=0
 Q DONE
 ;
DOMAINS(LIST) ; load default domains (put in parameter?)
 ;;asu-class
 ;;asu-rule
 ;;category
 ;;charttab
 ;;displaygroup
 ;;doc-def
 ;;labgroup
 ;;labpanel
 ;;location
 ;;orderable
 ;;page
 ;;patient
 ;;personphoto
 ;;pointofcare
 ;;quick
 ;;roster
 ;;route
 ;;schedule
 ;;team
 ;;teamposition
 ;;user
 ;;usertabprefs
 ;;viewdefdef
 ;;viewdefdefcoldefconfigtemplate
 ;;zzzzz
 ;;clioterminology
 ;;doc-action
 ;;doc-status
 N I,X
 F I=1:1 S X=$P($T(DOMAINS+I),";;",2,99) Q:X="zzzzz"  S LIST(I)=X
 Q
 ;
