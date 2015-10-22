HMPEFSG ;SLC/KCM -- GET for Extract and Freshness Stream
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ;
DOMITMS ; loop thru extract items, OFFSET is last sent
 ; expects HMPFSTRM,HMPFIDX,HMPFHMP
 ; changes HMPFSEQ,HMPFCNT as each item added
 N X,OFFSET,DOMAIN,TASK,BATCH,TOTAL
 S X=^XTMP(HMPFSTRM,HMPFIDX)
 S X=$P(X,U,3),DOMAIN=$P(X,":"),TASK=$P(X,":",2),TOTAL=$P(X,":",4)
 S BATCH="HMPFX~"_HMPFHMP_"~OPD"       ; extract node in ^XTMP
 S OFFSET=TOTAL-(HMPFIDX-HMPFSEQ)
 F  S OFFSET=$O(^XTMP(BATCH,TASK,DOMAIN,OFFSET)) Q:'OFFSET  D  Q:HMPFCNT'<HMPFLIM
 . S HMPFCNT=HMPFCNT+1 ; increment the count of returned items
 . S HMPFSEQ=HMPFSEQ+1 ; increment the sequence number in the stream
 . M ^TMP("HMPF",$J,HMPFCNT)=^XTMP(BATCH,TASK,DOMAIN,OFFSET)
 . I DOMAIN="patient" I $$PATIENT(HMPFCNT,DOMAIN,$G(TOTAL),OFFSET)=1 Q
 . S ^TMP("HMPF",$J,HMPFCNT,.3)=$$WRAPPER(DOMAIN,$S('TOTAL:0,1:OFFSET),+TOTAL)
 Q
 ;
SYNCSTRT(SEQNODE) ; Build syncStart object with demograhics
 S HMPFCNT=HMPFCNT+1
 S ^TMP("HMPF",$J,HMPFCNT,.3)=$$WRAPPER("syncStart",1,0)
 Q
SYNCDONE(SEQNODE) ; Build syncStatus object and stick in ^TMP
 ;  expects: HMPFSYS,HMPFCNT
 N HMPBATCH,DFN,HMPBATCH,STS,STSJSON,X,ERR
 S HMPBATCH=$P(SEQNODE,U,3) ; HMPFX~hmpSrvId~dfn
 S STS("uid")="urn:va:syncStatus:"_HMPFSYS_":OPD"
 S STS("initialized")="true"
 S X="" F  S X=$O(^XTMP(HMPBATCH,0,"count",X)) Q:'$L(X)  D
 . S STS("domainTotals",X)=^XTMP(HMPBATCH,0,"count",X)
 D ENCODE^HMPJSON("STS","STSJSON","ERR")
 I $D(ERR) S $EC=",UJSON encode error," Q
 S HMPFCNT=HMPFCNT+1
 M ^TMP("HMPF",$J,HMPFCNT)=STSJSON
 S ^TMP("HMPF",$J,HMPFCNT,.3)=$$WRAPPER("syncStatus","",-1)
 Q
 ;
WRAPPER(DOMAIN,OFFSET,TOTAL) ; return JSON wrapper for each item
 ; add object tag if extract total not zero or if total passed as -1
 ; seq and total tags only added if non-zero
 N X
 S X="},{""collection"":"""_DOMAIN_""""
 I $G(OFFSET)>0 S X=X_",""seq"":"_OFFSET
 I $G(TOTAL)>0 S X=X_",""total"":"_TOTAL
 I $G(TOTAL) S X=X_",""object"":"
 Q X
 ;
PATIENT(HMPFCNT,DOMAIN,TOTAL,OFFSET) ;
 N DFN,PIDS,TEMP,ERROR,PTJSON
 M PTJSON=^TMP("HMPF",$J,HMPFCNT)
 K PTJSON(.3)
 D DECODE^HMPJSON("PTJSON","TEMP","ERROR")
 ;D DECODE^HMPJSON($NA(^TMP("HMPF",$J,HMPFCNT,1)),"TEMP","ERROR")
 I '$D(TEMP) Q 0
 S DFN=TEMP("localId") I DFN'>0 Q 0
 S PIDS=$$PIDS^HMPDJFS(DFN)
 S ^TMP("HMPF",$J,HMPFCNT,.3)=$$WRAPPER^HMPDJFSG(DOMAIN,PIDS,$S('TOTAL:0,1:OFFSET),+TOTAL)
 Q 1
 ;
