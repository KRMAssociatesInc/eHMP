HMPTRPC1 ; SLC/AGP - Process Order Request from AVIVA System. ; 7/30/13 3:29pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 Q
 ;
GETFLDS(RESULT) ;
 N ARRAY,CNT,FCNT,FIELDS,NUM,TYPE,HMPP,HMPTYPE,X
 S CNT=0
 ;F TYPE="vs","prob","art","order","med","cons","proc","obs","lab","rad","surgery","tiu","mha","imm","pov","skin","exam","cpt","ed","factor","appt","visit","ptf" D
 S HMPTYPE=$$ALL^HMPDJ
 F HMPP=1:1:$L(HMPTYPE,";") S TYPE=$P(HMPTYPE,";",HMPP) I $L(TYPE) D
 .S CNT=CNT+1
 .S ARRAY("data",CNT,"type","name")=TYPE
 .S FIELDS=$$ATTR^HMPDCRC(TYPE)
 .S NUM=$L(FIELDS,U)
 .S FCNT=0
 .F X=1:1:NUM D
 ..I $P(FIELDS,U,X)="" Q
 ..S FCNT=FCNT+1
 ..S ARRAY("data",CNT,"type","fields",FCNT,"field")=$P(FIELDS,U,X)
 D ENCODE^HMPJSON("ARRAY","RESULT","ERROR")
 ;I $D(ERROR) ZW ERROR
 Q
 ;
TESTRPC(OUT,PARAMS) ;
 ;K ^XTMP("ZZHMP PARAMS"),^XTMP("ZZHMP JSON") ; KCM -- commented out for XINDEX
 ;M ^XTMP("ZZHMP JSON")=JSON
 ;M ^XTMP("ZZHMP PARAMS")=PARAMS ; KCM -- commented out for XINDEX
 Q
 ;
CLEARVAL(RESULT,SYS,PAT,BEG,END,JSON) ;
 N BDATE,BNUM,DATE,EDATE,ENUM,LAST,NODE,SUB,X,LAST
 D DELSYS(SYS)
 S BDATE=$P(BEG,":"),BNUM=$P(BEG,":",2)
 S EDATE=$P(END,":"),ENUM=$P(END,":",2)
 S SUB="HMP-"_BDATE
 ;handle cleaning out the ^xtmp for the same date range
 I BDATE=EDATE D  Q
 .F X=BNUM:1:ENUM I $P(^XTMP("HMP-"_BDATE,X),U)=PAT K ^XTMP("HMP-"_BDATE,X)
 ;
 F  S SUB=$O(^XTMP(SUB)) D  Q:SUB=""!($$END(SUB,EDATE)=1)
 .;handle date less then end date but date equal start date
 .S DATE=$P(SUB,"-",2) I DATE<EDATE,DATE=BDATE D  Q
 ..S LAST=$O(^XTMP(SUB,""),-1)
 ..F X=BNUM:1:LAST I $P(^XTMP(SUB,X),U)=PAT K ^XTMP(SUB,X)
 .;
 .;handle date greater then start date and less then end date
 .I DATE<EDATE,DATE>BDATE D  Q
 ..S LAST=$O(^XTMP(SUB,""),-1)
 ..F X=1:1:LAST I $P(^XTMP(SUB,X),U)=PAT K ^XTMP(SUB,X)
 .;
 .;S LAST=$O(^XTMP(SUB,""),-1)
 .;assume date equal stop date and greater then start date
 .F X=1:1:ENUM I $P(^XTMP(SUB,X),U)=PAT K ^XTMP(SUB,X)
 ;S LAST=$O(^XTMP("HMP-"_DATE,""),-1)
 ;F X=NUM:1:LAST K ^XTMP("HMP-"_DATE,X)
 ;Need to iterate json node and delete entries that were marked as entered in error (for example  Vitals)
 ;This reset the freshness XTMP. Should this be in it own RPC call?
 ;K ^XTMP("HMP-"_DT) M ^XTMP("HMP-"_DT)=^XTMP("HMP BACKUP") K ^XTMP("HMP BACKUP")
 Q
END(NODE,EDATE) ;
 N DATE
 S DATE=$P(NODE,"-",2)
 I DATE'>EDATE Q 0
 Q 1
 ;
DELETE(RESULT,PAT,SYS,JSON) ;
 N CNT,DA,DIK,ERROR,FILENUM,GLOBAL
 D DECODE^HMPJSON("JSON","IN","ERROR")
 S FILENUM=IN("FILENUM")
 ;Handle files that are not deleted need to check with Mel/Jerry about the action
 ;I FILENUM="NOT DELETE NODES" D NODELETE D POST^HMPEVNT(PAT,DOMAIN,DA,"") Q
 S GLOBAL=$$GET1^DID(FILENUM,"","","GLOBAL NAME")
 S DIK=GLOBAL
 S CNT=0 F  S CNT=$O(IN("ITEMS",CNT)) Q:CNT'>0  D
 .S DA=$G(IN("ITEMS",CNT,"IEN"))
 .D ^DIK
 .D POST^HMPEVNT(PAT,"factor",DA,"@")
 ;This reset the freshness XTMP. Should this be in it own RPC call?
 ;K ^XTMP("HMP-"_DT) M ^XTMP("HMP-"_DT)=^XTMP("HMP BACKUP") K ^XTMP("HMP BACKUP")
 Q
 ;
DELAY(OUT,PARAMS) ;
 N ARRAY,DELAY
 S DELAY=$G(PARAMS("delay"))
 H DELAY
 S ARRAY("success")="true"
 D ENCODE^HMPJSON("ARRAY","OUT","ERROR")
 I $D(ERROR) D
 .N RESULT,TXT K OUT
 .S TXT(1)="Problem encoding json output"
 .D SETERROR^HMPUTILS(.RESULT,.ERROR,.TXT,.ARRAY)
 .D ENCODE^HMPJSON("RESULT","OUT","ERROR")
 Q
 ;
DELSYS(SYS) ;
 N DA,DIK
 S DA=$O(^HMP(800000,"B",SYS,"")) I +DA'>0 Q
 S DIK="^HMP(800000," D ^DIK
 Q
 ;
IMPJSON(OUT,PARAMS) ;
 N GBL,JSONI,DOMAIN,PATIENT,ERROR
 S JSONI=PARAMS("value"),DOMAIN=PARAMS("domain"),PATIENT=PARAMS("patientId")
 S GBL=$NA(^TMP($J,"JSON",DOMAIN,PATIENT)) ; KCM -- changed from ^XTMP("JSON") to pass XINDEX
 D DECODE^HMPJSON("JSONI",GBL,"ERROR")
 I $D(ERROR) D  Q
 .N RESULT,TXT K OUT
 .S TXT(1)="Problem decoding json input"
 .D SETERROR^HMPUTILS(.RESULT,.ERROR,.TXT,.JSONI)
 .D ENCODE^HMPJSON("RESULT","OUT","ERROR")
 D ENCODE^HMPJSON("ARRAY","OUT","ERROR")
 Q
 ;
GETTEAMS(OUT) ;
 N ACTPRIM,ARRAY,CNT,ERROR,NODE,NUM,NAME,PATS,SER
 S NUM=0,CNT=0 F  S NUM=$O(^SCTM(404.51,NUM)) Q:NUM'>0  D
 .S NODE=$G(^SCTM(404.51,NUM,0)),CNT=CNT+1
 .S NAME=$P(NODE,U),ACTPRIM=$S($P(NODE,U,5)=1:"true",1:"false")
 .S SER=""
 .I $P(NODE,U,6)>6 S SER=$P($G(^DIC(49,$P(NODE,U,6),0)),U)
 .S PATS=$$TEAMCNT^SCAPMCU1(NUM,DT)
 .S ARRAY("data",CNT,"name")=NAME
 .I SER'="" S ARRAY("data",CNT,"service")=SER
 .S ARRAY("data",CNT,"patients")=PATS
 D ENCODE^HMPJSON("ARRAY","OUT","ERROR")
 I $D(ERROR) D
 .N RESULT,TXT K OUT
 .S TXT(1)="Problem encoding json output"
 .D SETERROR^HMPUTILS(.RESULT,.ERROR,.TXT,.ARRAY)
 .D ENCODE^HMPJSON("RESULT","OUT","ERROR")
 Q
 ;
SAVE(RESULT,PAT,USER,DOMAIN,NUM,SYS,JSON) ;
 N ERROR,IENARRAY,LDATE,LNUM,VALUE
 D SETSYS(SYS,PAT)
 D DECODE^HMPJSON("JSON","VALUE","ERROR")
 K ^XTMP("HMP BACKUP")
 S LDATE="HMP-"_DT,LNUM=0
 I '$D(^XTMP("HMP-"_DT)) S LDATE=$O(^XTMP("HMP-A"),-1)
 S LNUM=$O(^XTMP(LDATE,""),-1)
 S IENARRAY("lastUpdate")=$P(LDATE,"-",2)_":"_LNUM
 M ^XTMP("HMP BACKUP")=^XTMP("HMP-"_DT)
 I DOMAIN="factor" D HF(PAT,USER,NUM,.VALUE,.IENARRAY)
 ;M RESULT=IENARRAY
 D ENCODE^HMPJSON("IENARRAY","RESULT","ERROR")
 Q
 ;
SETSYS(SYS,PAT) ;
 N FDA,MSG,NAME
 S NAME=$P($G(^DPT(PAT,0)),U) I NAME="" Q
 S FDA(800000,"?+1,",.01)=SYS
 S FDA(800000.01,"?+2,?+1,",.01)=PAT
 S FDA(800000.01,"?+2,?+1,",2)=1
 D UPDATE^DIE("","FDA","","MSG")
 I $D(MSG) D  Q
 .D EN^DDIOL("Update failed, UPDATE^DIE returned the following error message.")
 .S IC="MSG"
 .F  S IC=$Q(@IC) Q:IC=""  W !,IC,"=",@IC
 .D EN^DDIOL("Examine the above error message for the reason.")
 .H 2
 Q
 ;
HF(PAT,USER,NUM,VALUE,IENARRAY) ;
 N CNT,ENCIEN,FDA,FM,FSEC,IEN,LNUM,MSG,NAME,UID,X
 S FSEC=$P(VALUE("uid"),":",1,5)
 S FM=$$HL7TFM^XLFDT(VALUE("entered"))
 S LNUM=$O(^AUPNVHF("A"),-1)
 S NAME=$G(VALUE("name"))
 S IEN=$O(^AUTTHF("B",NAME,""))
 S ENCIEN=$P($G(VALUE("encounterUid")),":",6)
 S CNT=0
 F X=1:1:NUM D
 .S IENS=LNUM+X
 .S CNT=CNT+1
 .S FDA(9000010.23,"+"_IENS_",",.01)=IEN
 .S FDA(9000010.23,"+"_IENS_",",.03)=ENCIEN
 .S FDA(9000010.23,"+"_IENS_",",1201)=FM
 .S FDA(9000010.23,"+"_IENS_",",.02)=PAT
 .D UPDATE^DIE("","FDA","","MSG")
 .I $D(MSG) D  Q
 ..D EN^DDIOL("Update failed, UPDATE^DIE returned the following error message.")
 ..S IC="MSG"
 ..F  S IC=$Q(@IC) Q:IC=""  W !,IC,"=",@IC
 ..D EN^DDIOL("Examine the above error message for the reason.")
 ..H 2
 .D POST^HMPEVNT(PAT,"factor",IENS)
 .S IENARRAY("FILENUM")="9000010.23"
 .S IENARRAY("ITEMS",X,"IEN")=IENS
 Q
 ;
