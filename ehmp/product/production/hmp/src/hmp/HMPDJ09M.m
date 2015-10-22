HMPDJ09M ;SLC/MKB -- Mental Health ;9/9/13 4:51pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 11
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; All tags expect DFN, ID, [HMPSTART, HMPSTOP, HMPMAX, HMPTEXT]
 ;
 ;
MH ; -- Mental Health Administrations [from ^HMPDJ0]
 I $G(HMPID) D MH1(HMPID) Q
 N CNT,HMPIDT,ID,FNUM,TOTAL,HMPOUT,HMPYS,IEN
 ;
 S IEN=0 F  S IEN=$O(^YTT(601.71,IEN)) Q:IEN'>0  D
 .S HMPYS("CODE")=IEN,HMPYS("DFN")=+$G(DFN),HMPYS("LIMIT")=999
 .K HMPOUT
 .D PTTEST^YTQPXRM2(.HMPOUT,.HMPYS)
 .I HMPOUT(1)["[ERROR]" Q
 .S TOTAL=$P(HMPOUT(1),U,2)+1
 .I $P(HMPOUT(1),U,2)<1 Q
 .;S CNT=1 F  S CNT=$O(HMPOUT(CNT)) Q:CNT'>0  D
 .F CNT=2:1:TOTAL D
 ..I $G(HMPOUT(CNT))="" Q
 ..S ID=$P(HMPOUT(CNT),U)
 ..D MH1(ID,IEN)
 ;handle old MH test before the lastest revision to their package
 ;S FNUM=601.2 D SORT^HMPDJ09 ;sort ^PXRMINDX into ^TMP("HMPPX",$J,IDT)
 ;S HMPIDT=0 F  S HMPIDT=$O(^TMP("HMPPX",$J,HMPIDT)) Q:HMPIDT<1  D  Q:HMPI'<HMPMAX
 ;. S ID=0 F  S ID=$O(^TMP("HMPPX",$J,HMPIDT,ID)) Q:ID<1  D YT1^HMPDJ09(ID) Q:HMPI'<HMPMAX
 ;I HMPI'<HMPMAX Q
 ;handle new MH test  after revision to their package
 ;S FNUM=601.84 D SORT^HMPDJ09 ;sort ^PXRMINDX into ^TMP("HMPPX",$J,IDT)
 ;S HMPIDT=0 F  S HMPIDT=$O(^TMP("HMPPX",$J,HMPIDT)) Q:HMPIDT<1  D  Q:HMPI'<HMPMAX
 ;. S ID=0 F  S ID=$O(^TMP("HMPPX",$J,HMPIDT,ID)) Q:ID<1  D YT1^HMPDJ09(ID) Q:HMPI'<HMPMAX
 K ^TMP("HMPPX",$J)
 Q
 ;
MH1(ID,IEN) ; -- MH Administration
 N HMPY,COPY,GBL,ISCOPY,MH,NAME,NODE,CNT,I,X2,X,Y,TEMP,TEXT
 D ENDAS71^YTQPXRM6(.HMPY,ID)
 ;
 S NAME=$P($G(^YTT(601.71,IEN,0)),U)
 S COPY=$G(^YTT(601.71,IEN,7))
 S ISCOPY=+$P($G(^YTT(601.71,IEN,8)),U,5)
 S MH("localId")=ID,X2=$G(HMPY(2))
 S MH("uid")=$$SETUID^HMPUTILS("mh",DFN,ID)
 S MH("displayName")=$P(X2,U,2),MH("name")=$S(NAME'="":NAME,1:$P(X2,U,3))
 S MH("administeredDateTime")=$$JSONDT^HMPUTILS($P(X2,U,4))
 S X=$P(X2,U,6) I $L(X) D  ;ordered by
 . S Y=+$O(^VA(200,"B",X,0)),MH("providerName")=X
 . S:Y MH("providerUid")=$$SETUID^HMPUTILS("user",,Y)
 ;get questions/answers for test
 S I=0,CNT=0 F  S I=$O(HMPY("R",I)) Q:I'>0  D
 .S NODE=$G(HMPY("R",I))
 .S CNT=CNT+1
 .K TEMP,^TMP($J,"HMP MH TEXT")
 .;answers
 .S TEMP=$P(NODE,U,2) I TEMP>0 D
 ..S MH("responses",CNT,"answer","uid")=$$SETVURN^HMPUTILS("mha-answer",TEMP)
 ..S MH("responses",CNT,"answer","text")=$P(NODE,U,6)
 .;questions
 .S TEMP=$P(NODE,U,3) I TEMP>0 D
 ..S MH("responses",CNT,"question","uid")=$$SETVURN^HMPUTILS("mha-question",TEMP)
 ..S GBL=$NA(^YTT(601.72,TEMP,1))
 ..D SETTEXT^HMPUTILS(GBL,$NA(^TMP($J,"HMP MH TEXT")))
 ..M MH("responses",CNT,"question","text","\")=^TMP($J,"HMP MH TEXT")
 ; get scale(s) for test
 S I=0,CNT=0 F  S I=$O(HMPY("SI",I)) Q:I'>0  D
 .S NODE=$G(HMPY("SI",I))
 .S CNT=CNT+1
 .S MH("scales",CNT,"scale","uid")=$$SETVURN^HMPUTILS("mha-scale",I)
 .S MH("scales",CNT,"scale","name")=$P(NODE,U,2)
 .S MH("scales",CNT,"scale","rawScore")=$P(NODE,U,3)
 .I $P(NODE,U,4)'="" S MH("scales",CNT,"scale","transformScore")=$P(NODE,U,4)
 S MH("isCopyright")=$S(ISCOPY=1:"true",1:"false")
 I ISCOPY=1 S MH("copyrightText")=COPY
 S MH("lastUpdateTime")=$$EN^HMPSTMP("mh") ;RHL 20150103
 S MH("stampTime")=MH("lastUpdateTime") ; RHL 20150103
 ;US6734 - pre-compile metastamp
 I $G(HMPMETA)=1 D ADD^HMPMETA("mh",MH("uid"),MH("stampTime")) Q  ;US6734
 D ADD^HMPDJ("MH","mh")
 Q
