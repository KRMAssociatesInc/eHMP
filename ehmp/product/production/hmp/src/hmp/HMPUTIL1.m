HMPUTIL1 ;SLC/AGP -- HMP utilities routine ;8/14/13  11:22
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 11
 ;
ADHOC(HMPDOM1,HMPFCNT,DFN) ; Add syncStart metastamp and syncStatus to unsolicited updates
 Q:($G(HMPDOM1)="")!($G(DFN)="")
 ; Save delete date/time for later use.
 ;===JD START===
 N HMP96,HMP99,HMP100
 S (HMP99,HMP100,HMP96)=""
 ;I DFN'="OPD",$G(ACT)="@" D  ;;removed US5647
 I $G(ACT)="@" D
 .; Get the date from from fresh stream (HMPFS~<server>~<date>)
 .S HMP96=$$FMTH^XLFDT($P(HMPFSTRM,"~",3))
 .; Add delete time stored in ARGS("hmp-fst")
 .S HMP96=$$HTFM^XLFDT($P(HMP96,",")_","_$G(ARGS("hmp-fst"),0))
 .; Convert delete date/time into JSON format
 .S HMP96=$$JSONDT^HMPUTILS(HMP96)
 .; HMP100 = pid (pid = <sitehash>;<DFN>   e.g. C877;8
 .; HMP97 = UID = urn:va:<domain>:<sitehash>:DFN:<domain IEN>
 .; HMP97 is set in HMPDJFSG routine
 .S HMP100=$P($G(HMP97),":",4)_";"_$P($G(HMP97),":",5)
 .S HMP99="{""pid"":"""_HMP100_""",""removed"":""true"",""stampTime"":"_HMP96_",""uid"":"""_$G(HMP97)_"""}"
 ;===JD   END===
 ;Build SyncStart
 N HMPDAT,HMPDAT1,HMPDOM,HMPJSN,HMPSUB,HMPTOT,HMPTSK,HMPZ,HMPID,HMPQ,HMPY
 S HMPTSK=$J
 S HMPSUB=$O(^TMP("HMP",HMPTSK,0)) Q:'HMPSUB
 S HMPY=$$EN^HMPSTMP("NOW"),HMPID=$$SYS^HMPUTILS
 S HMPZ=0,HMPQ="""",HMPFCNT=$G(HMPFCNT)+1
 I DFN="OPD" S HMPJSN="{""collection"":"""_"OPDsyncStart"_""""_","""_"systemId"":"""_$P(HMPID,";")_""""_","
 E  S HMPJSN="{""collection"":"""_"syncStart"_""""_$$PIDS^HMPDJFS(DFN)_","
 S:HMPFCNT>1 HMPJSN="},"_HMPJSN
 S HMPJSN=HMPJSN_"""metaStamp"":"_"{"
 I DFN'="OPD" S HMPJSN=HMPJSN_$E($$PIDS^HMPDJFS(DFN),2,$L($$PIDS^HMPDJFS(DFN)))_","
 S HMPJSN=HMPJSN_"""stampTime"":"""_HMPY_""""_",""sourceMetaStamp"":"_"{"
 S HMPJSN=HMPJSN_""""_$P(HMPID,";")_""""_":{"
 I DFN'="OPD" S HMPJSN=HMPJSN_$E($$PIDS^HMPDJFS(DFN),2,$L($$PIDS^HMPDJFS(DFN)))_","
 S HMPJSN=HMPJSN_"""stampTime"":"""_HMPY_""""_","
 S HMPJSN=HMPJSN_"""domainMetaStamp"""_":"_"{"
 ; transform the domain name for quick orders to match the uid
 S HMPDOM=HMPDOM1 I HMPDOM="quick" S HMPDOM="qo"
 S HMPTOT=1
 S HMPJSN=HMPJSN_""""_HMPDOM_""""_":{"
 S HMPJSN=HMPJSN_"""domain"":"""_HMPDOM_""""_","
 S HMPJSN=HMPJSN_"""stampTime"":"""_HMPY_""""_","
 I DFN="OPD" S HMPJSN=HMPJSN_"""itemMetaStamp"""_":"_"{"
 E  S HMPJSN=HMPJSN_"""eventMetaStamp"""_":"_"{"
 D  ;Extract stampTime and/or UID from ^TMP("HMP",$J - US5859
 .N DONE,HMPN,I,NEXT,SRCH
 .S SRCH="""uid"""_":"_""""_"urn:va:"_HMPDOM_":"
 .;Search back from last record
 .S HMPN="",HMPDAT1="",DONE=""
 .F  S HMPN=$O(^TMP("HMP",$J,HMPSUB,HMPN),-1) Q:'HMPN  D  Q:DONE
 ..S HMPDAT=$G(^TMP("HMP",$J,HMPSUB,HMPN)) Q:HMPDAT="null"!(HMPDAT']"")
 ..;Search for last occurance of uid in record (this will be parent)
 ..I $F(HMPDAT,SRCH),'HMPDAT1 F I=2:1 S NEXT=$P($P(HMPDAT,SRCH,I),HMPQ) Q:NEXT=""  S HMPDAT1=NEXT
 ..;For OPD only search for UID
 ..I DFN="OPD" S:HMPDAT1 DONE=1 Q
 ..;Extract stamptime if present (patient data ONLY)
 ..I $F(HMPDAT,"stampTime") S HMPY=$P($P(HMPDAT,"""stampTime"":",2),",")
 ..;Patient data requires both UID and stampTime to be complete
 ..S:HMPDAT1&HMPY DONE=1
 I $L(HMPJSN)>1000 S HMPZ=HMPZ+1,^TMP("HMPF",$J,HMPFCNT,.3,HMPZ)=HMPJSN,HMPJSN=""
 I $G(ACT)="@" S HMPDAT1=$P($G(HMP97),":",4,99)
 S HMPJSN=HMPJSN_"""urn:va:"_HMPDOM_":"_HMPDAT1_""""_":{"
 S HMPJSN=HMPJSN_"""stampTime"":"""_$S($G(HMP96)]"":HMP96,1:HMPY)_""""_"}}"
 S HMPJSN=HMPJSN_"},"
 I $L(HMPJSN)>1000 S HMPZ=HMPZ+1,^TMP("HMPF",$J,HMPFCNT,.3,HMPZ)=HMPJSN,HMPJSN=""
 S HMPZ=HMPZ+1
 S HMPJSN=$E(HMPJSN,1,$L(HMPJSN)-1)_"}}}}},"
 ;Save syncStart
 S ^TMP("HMPF",$J,HMPFCNT,.3,HMPZ)=HMPJSN
 ;Merge in data section from FRESHITM^HMPDJFSG
 S HMPSUB=""
 F  S HMPSUB=$O(^TMP("HMP",HMPTSK,HMPSUB)) Q:'HMPSUB  D
 .N HMPX,HMPDAT
 .S HMPFCNT=HMPFCNT+1
 .I DFN'="OPD" S ^TMP("HMPF",HMPTSK,HMPFCNT,.3)="{""collection"":"""_HMPDOM_""""_$$PIDS^HMPDJFS(DFN)_",""seq"":1,""total"":1,""object"":"_$S($G(ACT)="@":HMP99,1:"")
 .I DFN="OPD",$G(ACT)="@" S ^TMP("HMPF",HMPTSK,HMPFCNT,.3)="{""collection"":"""_HMPDOM_""",""seq"":1,""total"":1,""object"":"_HMP99 ;;US5647
 .I DFN="OPD",$G(ACT)'="@"  D  ;US5859
 ..S ^TMP("HMPF",HMPTSK,HMPFCNT,.3)="{""collection"":"""_HMPDOM_""",""seq"":1,""total"":1,""object"":"
 ..S HMPX="""stampTime"":"_HMPQ_HMPY_HMPQ_","
 ..S HMPDAT=^TMP("HMP",HMPTSK,HMPSUB,1)
 ..S ^TMP("HMP",HMPTSK,HMPSUB,1)="{"_HMPX_$P(HMPDAT,"{",2,999)
 .M ^TMP("HMPF",HMPTSK,HMPFCNT,1)=^TMP("HMP",HMPTSK,HMPSUB,1)
 ;
 ; Build and add syncStatus
 N STS,STSJSON,X,ERR
 S STS("uid")="urn:va:syncStatus:"_HMPDAT1
 S STS("initialized")="true"
 S STS("domainTotals",HMPDOM)=1
 D ENCODE^HMPJSON("STS","STSJSON","ERR")
 I $D(ERR) S $EC=",UJSON encode error in unsolicited update," Q
 S HMPFCNT=HMPFCNT+1
 M ^TMP("HMPF",$J,HMPFCNT)=STSJSON
 S ^TMP("HMPF",$J,HMPFCNT,.3)=$$WRAP("syncStatus",$$PIDS^HMPDJFS(DFN),1,1,DFN)
 Q
 ;
WRAP(DOMAIN,PIDS,OFFSET,DOMSIZE,DFN) ; JSON wrapper
 N X S X=""
 S:$G(DOMAIN)'="syncStart" X="},{""collection"":"""_$P(DOMAIN,"#")_""""_PIDS
 S X=X_","
 I $G(OFFSET)>-1 S X=X_"""seq"":"_OFFSET_","
 I $G(DOMSIZE)>-1 S X=X_"""total"":"_DOMSIZE_","
 I $G(OFFSET)>-1 S X=X_"""object"":"
 Q X
