VPRJTZ ;SLC/KCM -- Miscellaneous Experiments
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
C2D ; Compare collections to domains
 N PID,UID,CLTN,CNT
 S CNT=0
 S PID="" F  S PID=$O(^VPRPT(PID)) Q:'$L(PID)  D
 . S UID="" F  S UID=$O(^VPRPT(PID,UID)) Q:'$L(UID)  D
 . . S CLTN=$P(UID,":",3)
 . . Q:$D(^VPRMETA("collection",CLTN,"domain"))
 . . W !,PID,?20,CLTN S CNT=CNT+1
 W !!,CNT
 Q
SUBINDIR ; Compare subscript indirection
 N PID,KEY,UID,START
 S START=$ZH
 S PID="" F  S PID=$O(^VPRPT(PID)) Q:'$L(PID)  D
 . S KEY="" F  S KEY=$O(^VPRPT(PID,KEY)) Q:KEY=""  D
 . . S UID=$G(^VPRPT(PID,KEY,"uid"))
 W !,"Direct:",$ZH-START
 ;
 S START=$ZH
 S PID="" F  S PID=$O(^VPRPT(PID)) Q:'$L(PID)  D
 . S KEY="" F  S KEY=$O(^VPRPT(PID,KEY)) Q:KEY=""  D
 . . S REF=$NA(^VPRPT(PID,KEY)),UID=$G(@REF@("uid"))
 W !,"Indirect:",$ZH-START
 Q
BLDSPEC(FIELDS,SPEC) ; Build spec then set values given FIELDS
 N CLTNS,ATTR,FULLSPEC
 S CLTNS("utesta")="",ATTR("metatype")="index",ATTR("style")="attr"
 D IDXSPEC^VPRJCD1(.CLTNS,.FIELDS,.ATTR,.FULLSPEC)
 M SPEC=FULLSPEC("collection","utesta")
 Q
IDXVALS ; Compare amount of time for indexing values for indexes .721 -> .815
 N OBJECT,VALUES,FIELDS,SPEC
 S OBJECT("top")="top value"
 S OBJECT("when")="201208121030"
 S OBJECT("how")="miracle"
 S OBJECT("mult",1,"sub")="sub1 value"
 S OBJECT("mult",2,"sub")="sub2 value"
 S OBJECT("mult",2,"provider","name")="Welby"
 S OBJECT("products",1,"drugClassCode")="urn:vadc:HS502"
 S OBJECT("ary1",4,"ary2",47,"val")="4-47"
 S OBJECT("ary1",15,"ary2",103,"val")="15-103"
 S OBJECT("list",1)="list 1"
 S OBJECT("list",2)="list 2"
 S OBJECT("list",3)="list 3"
 ;fields: ary1[].ary2[].val/P, mult[].sub/s
 S FIELDS(0,1)="ary1[].ary2[].val/P",FIELDS(0,2)="mult[].sub/s"
 D BLDSPEC(.FIELDS,.SPEC)
 ;
 N START,I
 S START=$ZH
 F I=1:1:10000 D IDXVALS^VPRJCV(.OBJECT,.VALUES,.SPEC)
 W !,$ZH-START
 Q
URLMAP ;
 N I,J,X,SEG,SUBS,MAP,CNT,PTRN,PTRNS,PTRNVAL
 S CNT=0,PTRNS=0
 F I=1:1 S X=$P($T(URLMAP+I^VPRJRSP),";;",2,99) Q:X="zzzzz"  D
 . S PATH=$P(X," ",2),MTHD=$P(X," "),SUBS="MAP("""_MTHD_"""",PTRNVAL=""
 . F J=1:1:$L(PATH,"/") D
 . . S SEG=$P(PATH,"/",J),PTRN=$S($E(SEG)="{":$P(SEG,"?",2),1:"")
 . . I $L(PTRN),'$D(PTRNS(PTRN)) S PTRNS=PTRNS+1,PTRNS(PTRN)=PTRNS
 . . I $L(PTRN) S $P(PTRNVAL,":",J)=PTRNS(PTRN)
 . . S SUBS=SUBS_","_$S($E(SEG)="{":"""?""",+SEG=SEG:SEG,1:""""_SEG_"""")
 . S CNT=CNT+1,SUBS=SUBS_",""/"","_CNT_")",@SUBS=PTRNVAL
 W ! ZW MAP
 W ! ZW PTRNS
 Q
MATCH(METHOD,PATH,ROUTINE,ARGS) ; Given method and path return routine and arguments
 N ISEG,SEG,URLSIG,TRYSIG,FAIL
 S URLSIG="MAP("_METHOD,FAIL=0
 F ISEG=1:1:$L(PATH,"/") D  Q:FAIL
 . S SEG=$$LOW^XLFSTR($P(PATH,"/",ISEG))
 . S TRYSIG=URLSIG_","_SEG
 . I $D(@(TRYSIG_")")) S URLSIG=TRYSIG Q
 . S TRYSIG=URLSIG_","_"""?"""
 . I $D(@(TRYSIG_")")) S URLSIG=TRYSIG Q
 . S FAIL=1
 ; now loop thru @URLSIG@("/",ID) and execute the pattern matches
 ; for the first one that is true, grab the routine and set the arguments
 I 'FAIL W !,URLSIG
 Q
SRCHLOG ; Search VPRHTTP log
 N D,S,I
 S D=0 F  S D=$O(^VPRHTTP("log",D)) Q:'D  D
 . S S=0 F  S S=$O(^VPRHTTP("log",D,S)) Q:'S  D
 . . S I=0 F  S I=$O(^VPRHTTP("log",D,S,I)) Q:'I  D
 . . . S X=$G(^VPRHTTP("log",D,S,I,"line1"))
 . . . I X'["\vpr" Q
 . . . W !,X
 Q
POSTVPR ; test a post to VPR
 ;;{"uid":"urn:va:patient:F484:8:8","summary":"gov.va.cpe.vpr.PatientDemographics{pids=[10110V004877, 500;8, 666000010, F484;8]}","dateOfBirth":"19450407","ssn":"666000010","last4":"0010","last5":"H0010","icn":"10110V004877","familyName":"HMP-PATIENT","g
 ;;ivenNames":"THIRTY","fullName":"HMP-PATIENT,THIRTY","displayName":"Hmp-Patient,Thirty","genderCode":"urn:va:pat-gender:M","genderName":"Male","briefId":"H0010","sensitive":false,"loading":true,"domainTotals":{},"syncErrorCount":0,"religionCode":"urn:v
 ;;a:pat-religion:24","religionName":"PROTESTANT","veteran":{"summary":"gov.va.cpe.vpr.Veteran@54b057d5","lrdfn":24,"serviceConnected":"true","serviceConnectionPercent":"20"},"lastUpdated":"20131112205833.202","addresses":[{"city":"Any Town","postalCode"
 ;;:"99998-0071","stateProvince":"WEST VIRGINIA","streetLine1":"Any Street"}],"facilities":[{"summary":"CAMP MASTER","code":"500","name":"CAMP MASTER","systemId":"F484","localPatientId":"8","latestDate":"20131011","homeSite":false}],"flags":[{"summary":"
 ;;BEHAVIORAL","name":"BEHAVIORAL","text":"Patient has threatened violence in the past.  You must have at least one other staff member with you to ensure safety."}],"telecoms":[{"telecom":"(222)555-7720","usageCode":"WP","usageName":"work place"},{"telec
 ;;om":"(222)555-8235","usageCode":"H","usageName":"home address"}],"ethnicities":[{"summary":"gov.va.cpe.vpr.PatientEthnicity@569b1e0f","ethnicity":"9999-4"}],"races":[{"summary":"gov.va.cpe.vpr.PatientRace@722f6194","race":"2106-3"}],"maritalStatuses":
 ;;[{"summary":"Never Married","code":"urn:va:pat-maritalStatus:S","name":"Never Married"}],"exposures":[{"uid":"urn:va:combat-vet:N","name":"No"},{"uid":"urn:va:agent-orange:N","name":"No"},{"uid":"urn:va:mst:U","name":"Unknown"},{"uid":"urn:va:head-nec
 ;;k-cancer:U","name":"Unknown"},{"uid":"urn:va:ionizing-radiation:N","name":"No"},{"uid":"urn:va:sw-asia:N","name":"No"}],"supports":[{"summary":"VETERAN,BROTHER","name":"VETERAN,BROTHER","contactTypeCode":"urn:va:pat-contact:NOK","contactTypeName":"Nex
 ;;t of Kin"}],"pcTeamUid":"urn:va:team:F484:5","disability":["AUDITORY CANAL DISEASE^10^1","SUPRAVENTRICULAR ARRHYTHMIAS^30^1"],"localId":8,"pcTeamName":"PRIMARY CARE TEAM2"}
 ;;zzzzz
 ;
 N HTTPREQ,HTTPERR,JSON
 D SETPUT^VPRJTX("/vpr","POSTVPR","VPRJTZ")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 Q
CLRPOST ;
 D CLEARPT^VPRJPS(10110)
 Q
