HMPEF ;SLC/MKB -- Serve VistA operational data as JSON via RPC ;Apr 16, 2015@17:37:39
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 1
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
GET(HMP,FILTER) ; -- Return search results as JSON in @HMP@(n)
 ; RPC = HMP GET OPERATIONAL DATA
 ; where FILTER("domain")  = name of desired data type (see $$TAG)
 ;       FILTER("limit")   = maximum number of items to return [opt]
 ;       FILTER("start")   = ien to start search from          [opt]
 ;       FILTER("id")      = single item id to return          [opt]
 ;
 ; HMPLAST - last record processed
 N HMPSYS,TYPE,HMPMAX,HMPI,HMPID,HMPERR,HMPTN,HMPLAST,HMPCNT,HMPFINI
 S HMP=$NA(^TMP("HMP",$J)),HMPI=0 K @HMP
 S HMPSYS=$$GET^XPAR("SYS","HMP SYSTEM NAME")
 ;
 ; parse & validate input parameters
 S TYPE=$P($G(FILTER("domain")),"#") ;,TYPE=$$LOW^XLFSTR(TYPE)
 S HMPMAX=+$G(FILTER("limit")),HMPCNT=0
 S HMPLAST=+$G(FILTER("start"))
 S HMPID=$G(FILTER("id"))
 ;
 ;set error trap
 K ^TMP($J,"HMP ERROR")
 ;
 ; extract data
 I TYPE="" S HMPERR="Missing or invalid reference type" G GTQ
 I $D(ZTQUEUED) S HMP=$NA(^XTMP(HMPBATCH,HMPFZTSK,FILTER("domain"))) K @HMP
 I TYPE="new",$L($T(EN^HMPEFX)) D EN^HMPEFX(HMPID,HMPMAX) Q
 S HMPTN=$$TAG(TYPE) Q:'$L(HMPTN)  ;D ERR(2) Q
 ;N $ES,$ET,ERRMSG
 ;S $ET="D ERRHDLR^HMPDERRH",ERRMSG="A MUMPS error occurred while extracting "_TYPE_" data"
 D @HMPTN
 ;
GTQ ; add item count and terminating characters
 N ERROR I $D(^TMP($J,"HMP ERROR"))>0 D BUILDERR(.ERROR) S ERROR(1)=ERROR(1)_"}"
 I +$G(FILTER("noHead"))=1 D  Q
 .S @HMP@("total")=+$G(HMPI)
 .S @HMP@("last")=HMPLAST
 .S @HMP@("finished")=+$G(HMPFINI)
 .I $L($G(ERROR(1)))>1 S @HMP@("error")=ERROR(1)
 I '$D(@HMP)!'$G(HMPI) D  Q
 .I '$D(^TMP($J,"HMP ERROR")) S @HMP@(1)="""data"":{""totalItems"":0,""items"":[]}}" Q
 .S @HMP@(1)="""data"":{""totalItems"":0,""items"":[]},"
 .M @HMP@(2)=ERROR
 ;
 I $D(@HMP),$G(HMPI) D
 . S @HMP@(.5)="{""apiVersion"":""1.01"",""data"":{""updated"":"""_$$HL7NOW_""",""currentItemCount"":"_HMPI
 . S:$G(HMPCNT) @HMP@(.5)=@HMP@(.5)_",""totalItems"":"_HMPCNT
 . S:$G(HMPLAST) @HMP@(.5)=@HMP@(.5)_",""last"":"_HMPLAST
 . S @HMP@(.5)=@HMP@(.5)_",""items"":["
 . S HMPI=HMPI+1,@HMP@(HMPI)=$S($D(^TMP($J,"HMP ERROR"))>0:"]}",1:"]}}")
 I $D(^TMP($J,"HMP ERROR"))>0 S HMPI=HMPI+1,@HMP@(HMPI,.3)="," M @HMP@(HMPI)=ERROR ;S HMPI=HMPI+1,@HMP@(HMPI)="}"
 K ^TMP($J,"HMP ERROR")
 Q
 ;
BUILDERR(RESULT) ; -- build error array
 N CNT,COUNT,DOM,DOMCNT,ERRMSG,ERROR,FIELD,MESSAGE,MSG,MSGCNT,T,TEMP
 S COUNT=$G(^TMP($J,"HMP ERROR","# of Errors"))
 S MESSAGE="A mumps error occurred when extracting data. A total of "_COUNT_" occurred.\n\r"
 S CNT=1,ERROR("error","message","\",CNT)="A mumps error occurred when extracting patient data. A total of "_COUNT_" occurred.\n\r"
 S MSGCNT=0 F  S MSGCNT=$O(^TMP($J,"HMP ERROR","ERROR MESSAGE",MSGCNT)) Q:MSGCNT'>0  D
 . S CNT=CNT+1,MESSAGE=MESSAGE_$G(^TMP($J,"HMP ERROR","ERROR MESSAGE",MSGCNT))_"\n\r"
 S RESULT(1)="""error"":{""message"":"_""""_MESSAGE_""""_"}"
 Q
 ;
TAG(X) ; -- Return linetag for reference domain X
 N Y S Y="HMP",X=$G(X)
 ; default = HMP Object (various types)
 I X="location"      S Y="LOC"
 I X="pt-select"     S Y="PAT"
 I X="person"        S Y="NP"
 I X="user"          S Y="NP"
 I X="roster"        S Y="ROS"
 I X="labgroup"      S Y="LABGRP"
 I X="labpanel"      S Y="LABPNL"
 I X["orderable"     S Y="OI"
 I X["schedule"      S Y="SCHEDULE"
 I X["route"         S Y="ROUTE"
 I X["quick"         S Y="QO"
 I X="displayGroup"  S Y="ODG"
 I X["asu-"          S Y="ASU"
 I X["doc-"          S Y="ASU"
 I X="immunization"    S Y="IMMTYPE"   ;immunizations
 I X="allergy-list"         S Y="ALLTYPE"   ;allergies
 ;I X="problem-list"        S Y="PROB"      ;problems
 I X="sign-symptom"   S Y="SIGNS"     ;signs and symptoms
 I X="vital-type"      S Y="VTYPE"     ;vital type
 I X="vital-qualifier"  S Y="VQUAL"     ;vital qualifiers
 I X="vital-category"   S Y="VCAT"      ;vital categories
 I X["clioterm"      S Y="MDTERMS" ;blj
 Q Y
 ;
ERR(X,VAL) ; -- return error message
 N MSG  S MSG="Error"
 I X=2  S MSG="Domain type '"_$G(VAL)_"' not recognized"
 I X=3  S MSG="UID '"_$G(VAL)_"' not found"
 I X=99 S MSG="Unknown request"
 Q MSG
 ;
ERRMSG(X,VAL) ; -- return error message, if needed
 N Y S Y="A MUMPS error occurred while extracting "_X_" data"
 S:$G(VAL) Y=Y_", ien "_VAL
 Q Y
 ;
ERRQ ; -- Quit for error handling
 Q
 ;
HL7NOW() ; -- Return current time in HL7 format
 Q $P($$FMTHL7^XLFDT($$NOW^XLFDT),"-")
 ;
ALL() ;
 ;Q "location;patient;person;orderable;schedule;route;quick;displayGroup;asu-class;asu-rule;asu-role;doc-action ;BL;LINE TOO LONG WRAPPING
 ;doc-status;clioterm;immunization;allergy-list;problem-list;sign-symptom;vital-type;vital-qualifier;vital-category"
 Q "location;patient;person;orderable;schedule;route;quick;displayGroup;asu-class;asu-rule;asu-role;doc-action;doc-status;clioterm;immunization;allergy-list;sign-symptom;vital-type;vital-qualifier;vital-category"
 ;
ADD(ITEM) ; -- add ITEM to @HMP@(HMPI)
 N HMPY,HMPERR
 I $G(HMPSTMP)]"" S @ITEM@("stampTime")=HMPSTMP ; US6734
 D ENCODE^HMPJSON(ITEM,"HMPY","HMPERR")
 I $D(HMPERR) D  ;return ERRor instead of ITEM
 . N HMPTMP,HMPTXT,HMPITM
 . M HMPITM=@ITEM K HMPY
 . S HMPTXT(1)="Problem encoding json output."
 . D SETERROR^HMPUTILS(.HMPTMP,.HMPERR,.HMPTXT,.HMPITM)
 . K HMPERR D ENCODE^HMPJSON("HMPTMP","HMPY","HMPERR")
 I $D(HMPY) D
 . I $G(HMPMETA)=1 D ADD^HMPMETA($P(HMPFADOM,"#"),@ITEM@("uid"),HMPSTMP) Q  ;US6734
 . I HMPI D COMMA(HMPI)
 . ;I HMPI,'$G(FILTER("noHead")) D COMMA(HMPI)
 . S HMPI=HMPI+1 M @HMP@(HMPI)=HMPY
 Q
 ;
COMMA(I) ; -- add comma between items
 I $D(ZTQUEUED) Q
 N J S J=+$O(@HMP@(I,"A"),-1) ;last sub-node for item I
 S J=J+1,@HMP@(I,J)=","
 Q
 ;
TOTAL(ROOT) ; -- Return total #items in @ROOT@(n)
 Q $P($G(@ROOT@(0)),U,4)
 ;
 N I,Y S (I,Y)=0
 F  S I=$O(@ROOT@(I)) Q:I<1  S Y=Y+1
 Q Y
 ;
TEST(TYPE,ID,IN) ; -- test GET, write results to screen
 N OUT,IDX
 S U="^"
 S IN("domain")=$G(TYPE)
 S:$D(ID) IN("id")=ID
 D GET(.OUT,.IN)
 ;
 S IDX=OUT
 F  S IDX=$Q(@IDX) Q:IDX'?1"^TMP(""HMP"","1.N.E  Q:+$P(IDX,",",2)'=$J  W !,@IDX
 Q
 ;
 ; ** Reference file searches, using FILTER("parameter")
 ;
PAT ; -- Return Patients
 N DFN,PAT,HMPPOPD
 S HMPPOPD=1
 S HMPCNT=$$TOTAL("^DPT")
 I $G(HMPID) S DFN=+HMPID D LKUP^HMPDJ00 Q
 N ERRMSG S ERRMSG="A mumps error occurred while extracting patients."
 ;Q:HMPI'<HMPMAX
 S DFN=+$G(HMPLAST) F  S DFN=$O(^DPT(DFN)) Q:DFN<1  D  I HMPMAX>0,HMPI'<HMPMAX Q
 . N $ES,$ET
 . S $ET="D ERRHDLR^HMPDERRH"
 . I $P($G(^DPT(DFN,0)),U)="" Q
 . S ERRMSG=$$ERRMSG("Patient",DFN)
 . K PAT D LKUP^HMPDJ00
 . S HMPLAST=DFN
 I DFN<1 S HMPFINI=1
 Q
LOC ; -- Return Hospital Locations
 S HMPCNT=$$TOTAL("^SC")
 I $G(HMPID) D LOC1(HMPID) Q
 N HL S HL=+$G(HMPLAST)
 F  S HL=$O(^SC(HL)) Q:HL<1  D LOC1(HL) I HMPMAX>0,HMPI'<HMPMAX Q
 I HL<1 S HMPFINI=1
 Q
 ;
LOC1(IEN) ; -- get one location
 N $ES,$ET,ERRMSG
 S ERRMSG=$$ERRMSG("Location",IEN)
 S $ET="D ERRHDLR^HMPDERRH"
 N LOC,X0,X,Y
 ; if location is a WARD and pointer to WARD LOCATION exists, handle it differently
 ; the ward info will be used for the ORWPT BYWARD remote procedure call 
 S X0=$G(^SC(IEN,0))  I $P(X0,U,3)="W" S X=+$P($G(^SC(IEN,42)),U) I X,$D(^DIC(42,X)) D LOC42(X,X0) Q
 S LOC("name")=$P(X0,U)
 S LOC("localId")=IEN,LOC("uid")=$$SETUID^HMPUTILS("location",,IEN)
 S X=$P(X0,U,2) S:$L(X) LOC("shortName")=X S LOC("type")=$P(X0,U,3)
 S LOC("refId")=IEN,LOC("oos")=$S(+$G(^SC(IEN,"OOS")):"true",1:"false")
 S X=+$P(X0,U,4) I X D
 . S Y=$$NS^XUAF4(X),X=$P(Y,U,2)_U_$P(Y,U)
 . D FACILITY^HMPUTILS(X,"LOC")
 I '$$ACTLOC(IEN) S LOC("inactive")="true"
 D ADD("LOC") S HMPLAST=IEN
 Q
 ;
LOC42(IEN,FL44ZRO) ; -- get WARD LOCATION (file #42), (defect 862 HRUB)
 ; IEN - file 42 IEN
 ; FL44ZRO - zero node from HOSPITAL LOCATION entry that points to file 42
 ;    note: back-pointer is also in ^DIC(42,D0,44)= (#44) HOSPITAL LOCATION FILE POINTER [1P:44]
 ;
 ; references to ^DIC(42) via IA #10039
 ;
 N $ES,$ET,ERRMSG
 S ERRMSG=$$ERRMSG("Ward Location",IEN)
 S $ET="D ERRHDLR^HMPDERRH"
 N LOC,X,X0,Y
 S X0=$G(^DIC(42,IEN,0)),LOC("name")=$P(X0,U)
 S LOC("localId")=IEN,LOC("uid")=$$SETUID^HMPUTILS("location",,"w"_IEN)  ; wards have a "w"
 S X=$P($G(FL44ZRO),U,2) S:$L(X) LOC("shortName")=X ; file 44, field 1 ABBREVIATION  
 S LOC("type")="W"  ; always 'W' for ward
 S LOC("refId")=IEN
 S X=+$P($G(FL44ZRO),U,4) I X D  ; INSTITUTION [4P:4] pointer from file #44
 . S Y=$$NS^XUAF4(X),X=$P(Y,U,2)_U_$P(Y,U)
 . D FACILITY^HMPUTILS(X,"LOC")
 ; out-of-service flag
 S LOC("oos")=$S($$ACTWRD(IEN):"false",1:"true")
 D ADD("LOC") S HMPLAST=IEN
 Q
 ;
ACTWRD(WLNTRY) ; Boolean Function TRUE if active WARD LOCATION
 ; WLNTRY - IEN in file 42 - ^DIC(42) refs. via IA 10039 (defect 862 HRUB)
 N W0,WRDIEN S WRDIEN=+$G(WLNTRY)  ; need an IEN
 S W0=$G(^DIC(42,WRDIEN,0))
 Q:'$L(W0) "^"  ; something's wrong
 ; OUT-OF-SERVICE DATE SUB-FIELD
 S W0=+$O(^DIC(42,WRDIEN,"OOS","AINV",9999998.9-DT))  ; check inverse cross-ref.
 S W0=$S($D(^DIC(42,WRDIEN,"OOS",+$O(^(+W0,0)),0)):^(0),1:"")  ; entry in sub-file or null
 I '$P(W0,"^",6) Q 1     ; IS ENTIRE WARD OUT OF SERVICE?
 I $P(W0,"^",6),'$P(W0,"^",4) Q 0    ; RETURN TO SERVICE DATE null
 I $P(W0,"^",6) Q ($P(W0,"^",4)<DT)  ; RETURN TO SERVICE DATE in the past?
 Q 1   ;  must be active
 ;
ACTLOC(LOC) ; Function: returns TRUE if active hospital location
 ; IA# 10040.
 N D0,X I +$G(^SC(LOC,"OOS")) Q 0                ; screen out OOS entry
 S D0=+$G(^SC(LOC,42)) I D0 D WIN^DGPMDDCF Q 'X  ; chk out of svc wards
 S X=$G(^SC(LOC,"I")) I +X=0 Q 1                 ; no inactivate date
 I DT>$P(X,U)&($P(X,U,2)=""!(DT<$P(X,U,2))) Q 0  ; chk reactivate date
 Q 1                                             ; must still be active
 ;
NP ; -- Return New Persons
 N PRV
 S HMPCNT=$$TOTAL("^VA(200)")
 I $G(HMPID) D NP1(HMPID) Q
 S PRV=+$G(HMPLAST) ;$S(HMPLAST:HMPLAST,1:.9)
 I PRV=0 S PRV=.9
 F  S PRV=$O(^VA(200,PRV)) Q:PRV<1  D NP1(PRV) I HMPMAX>0,HMPI'<HMPMAX Q
 I PRV<1 S HMPFINI=1
 Q
 ;
NP1(IEN) ; -- get one person
 N $ES,$ET,ERRMSG
 S ERRMSG=$$ERRMSG("person",IEN)
 S $ET="D ERRHDLR^HMPDERRH"
 N HMPV,FLDS,USER,X,Y
 I $$ISPROXY(IEN)=1 Q
 K HMPV S FLDS=".01;4:9.2;9.5*;19:53.8;654.3;.132:.138"
 D GETS^DIQ(200,IEN_",",FLDS,"IEN","HMPV")
 S Y=$NA(HMPV(200,IEN_","))
 S USER("name")=$G(@Y@(.01,"E"))
 S USER("localId")=IEN,USER("uid")=$$SETUID^HMPUTILS("user",,IEN)
 S:$D(@Y@(4)) USER("genderCode")="urn:va:gender:"_@Y@(4,"I"),USER("genderName")=@Y@(4,"E")
 S X=+$P($G(@Y@(5,"I")),".") S:X USER("dateOfBirth")=$$JSONDT^HMPUTILS(X)
 S X=$G(@Y@(7,"I")) S:$L(X) USER("disuser")=$S(X:"true",1:"false")
 S X=$G(@Y@(8,"E")) S:$L(X) USER("title")=X
 S X=$G(@Y@(9,"E")) S:$L(X) USER("ssn")=X
 S X=$G(@Y@(9.2,"I")) S:$L(X) USER("terminated")=$$JSONDT^HMPUTILS(X)
 S X=+$G(@Y@(19,"I")) S:X USER("delegateCode")=$$SETUID^HMPUTILS("user",,X),USER("delegateName")=$G(@Y@(19,"E"))
 S X=$G(@Y@(29,"E")) S:$L(X) USER("service")=X
 S X=$G(@Y@(53.5,"E")) S:$L(X) USER("providerClass")=X
 S X=$G(@Y@(53.6,"E")) S:$L(X) USER("providerType")=X
 S X=+$G(@Y@(654.3,"I")) S:X USER("surrogateCode")=$$SETUID^HMPUTILS("user",,X),USER("surrogateName")=$G(@Y@(654.3,"E"))
 S X=$G(@Y@(.132,"E")) S:$L(X) USER("officePhone")=X
 S X=$G(@Y@(.133,"E")) S:$L(X) USER("phone3")=X
 S X=$G(@Y@(.134,"E")) S:$L(X) USER("phone4")=X
 S X=$G(@Y@(.135,"E")) S:$L(X) USER("commercialPhone")=X
 S X=$G(@Y@(.136,"E")) S:$L(X) USER("fax")=X
 S X=$G(@Y@(.137,"E")) S:$L(X) USER("voicePager")=X
 S X=$G(@Y@(.138,"E")) S:$L(X) USER("digitalPager")=X
 D KEYS(IEN)
 D ADD("USER") S HMPLAST=IEN
 Q
 ;
KEYS(IEN) ; -- get user's keys
 N HMPKEY,IENS,X,CNT
 D GETS^DIQ(200,IEN_",","51*","IE","HMPKEY") S CNT=0
 S IENS="" F  S IENS=$O(HMPKEY(200.051,IENS)) Q:IENS=""  D
 . S X=$G(HMPKEY(200.051,IENS,.01,"E")),CNT=CNT+1
 . S USER("vistaKeys",CNT,"name")=X
 . S X=$G(HMPKEY(200.051,IENS,3,"I"))
 . S:X USER("vistaKeys",CNT,"reviewDate")=$$JSONDT^HMPUTILS(X)
 Q
 ;
ODG ;
 D ADDODG^HMPCORD4
 Q
 ;
OI ;
 ;I 1/0
 D OI^HMPCORD4("PS^RAP^LRT")
 Q
 ;
PROB ;get problem list operational data store
 N ORAPP,ORDT,ORELEM,IEN,ELEMENT,PLIST,HMPCNT,HMPLAST
 S (ORWLST,ORDT,ORELEM)=""
 S ORDT=DT
 S IEN=0,HMPCNT=0
 S LST=$NA(^TMP("ORLEX",$J))
 S APP="GMPX"
 D CONFIG^LEXSET(APP,"PLS",ORDT)
 S (HMPCNT,HMPLAST)=0
 F  S IEN=$O(^LEX(757.01,IEN)) Q:IEN=""!(IEN'?1N.N)  D
 . S ORELEM=$G(^LEX(757.01,IEN,0))
 . Q:'$D(^LEX(757.01,IEN,1))
 . D LOOK^LEXA(ORELEM,,1,,ORDT)
 . S ELEMENT=$G(LEX("LIST",1))
 . Q:ELEMENT=""
 . S ELEMENT=$$LEXXFRM^ORQQPL4(ELEMENT,ORDT,"GMPX")
 . S PLIST("uid")=$$SETUID^HMPUTILS("problem-list","",IEN)
 . S PLIST("lexIen")=$P(ELEMENT,"^",1)
 . S PLIST("lexName")=$P(ELEMENT,"^",2)
 . S PLIST("icd")=$P(ELEMENT,"^",3)
 . S PLIST("icdIen")=$P(ELEMENT,"^",4)
 . S PLIST("codeSys")=$P(ELEMENT,"^",5)
 . S PLIST("cCode")=$P(ELEMENT,"^",6)
 . S PLIST("dCode")=$P(ELEMENT,"^",7)
 . S PLIST("impDt")=$P(ELEMENT,"^",8)
 . S HMPCNT=HMPCNT+1 D ADD("PLIST") S HMPLAST=HMPCNT
 . Q
 S HMPFINI=1
 Q
 ;
QO ;
 D QO^HMPCORD4
 Q
 ;
SCHEDULE ;
 N RESULT
 D ADDSCH^HMPCORD4
 ;D ADD("RESULT")
 Q
 ;
ROUTE ;
 N RESULT
 D ADDROUTE^HMPCORD4
 ;D ADD("RESULT")
 Q
 ;
HMP ; -- Return HMP Objects
 N IEN
 S HMPCNT=$$TOTAL("^HMP(800000.11)")
 I $L(HMPID) D  Q
 . I HMPID=+HMPID S IEN=HMPID
 . E  S IEN=+$O(^HMP(800000.11,"B",HMPID,0))
 . S ERRMSG=$$ERRMSG("HMP Object",IEN)
 . D:IEN HMP1^HMPDJ02(800000.11,IEN)
 S IEN=+$G(HMPLAST) F  S IEN=$O(^HMP(800000.11,"C",TYPE,IEN)) Q:IEN<1  D  I HMPMAX>0,HMPI'<HMPMAX Q
 . S ERRMSG=$$ERRMSG("HMP Object",IEN)
 . D HMP1^HMPDJ02(800000.11,IEN) S HMPLAST=IEN
 I IEN<1 S HMPFINI=1
 Q
 ;
ROS ; -- Return rosters
 N PRV
 S HMPCNT=$$TOTAL("^HMPROSTR")
 I $L(HMPID) D:$D(^HMPROSTR(HMPID,0)) ROS1(HMPID) Q
 S PRV=+$G(HMPLAST)
 I PRV=0 S PRV=.9
 F  S PRV=$O(^HMPROSTR(PRV)) Q:PRV'>0  D ROS1(PRV) I HMPMAX,HMPI'<HMPMAX Q
 I PRV'>0 S HMPFINI=1
 Q
 ;
ROS1(IEN) ; -- get one roster
 N ERRMSG
 S ERRMSG="A mumps error occurred while extaracting roster."
 ;S ERRMSG=$$ERRMSG("roster",IEN)
 ;S $ET="D ERRHDLR^HMPDERRH"
 N HMPLIST,HMPLIST2 ; these get defined by HMPROS6
 D GET^HMPROS6(IEN)
 N ROSTER,GBL,FLDS,RESULT,HMPZ,X,Y,HMPSEQ,HMPACT,HMPSOURCE,HMPV,NODE,HMPPAT,ID
 K HMPV S FLDS=".01:.06;1*;2;3*;99",ID=IEN
 D GETS^DIQ(800001.2,IEN_",",FLDS,"IEN","HMPV")
 S Y=$NA(HMPV(800001.2,IEN_","))
 S ROSTER("name")=$G(@Y@(.01,"E"))
 S ROSTER("localId")=ID,ROSTER("uid")=$$SETUID^HMPUTILS("roster",,ID)
 S X=$G(@Y@(99,"I")) S:X ROSTER("dateUpdated")=$$JSONDT^HMPUTILS(X)
 S X=$G(@Y@(.04,"I")) S:X ROSTER("ownerLocalId")=X,ROSTER("ownerUid")=$$SETUID^HMPUTILS("user",,X)
 S X=$G(@Y@(.06,"E")) S:X ROSTER("patientListName")=X
 S X=$G(@Y@(.03,"I")) S ROSTER("disabled")=$S(X=1:"true",1:"false")
 S X=$G(@Y@(.05,"I")) S ROSTER("private")=$S(X="PR":"true",1:"false")
 S X=$G(@Y@(2,"E")) S:X ROSTER("specialHandling")=X
 I $D(HMPV(800001.21)) S NODE="",HMPZ=0 D
 . F  S NODE=$O(HMPV(800001.21,NODE)) Q:NODE=""  D
 . . S HMPSEQ=HMPV(800001.21,NODE,.01,"I") S ROSTER("sources",HMPSEQ,"sequence")=HMPSEQ
 . . S HMPACT=HMPV(800001.21,NODE,.03,"E") S ROSTER("sources",HMPSEQ,"action")=HMPACT
 . . S HMPSOURCE=HMPV(800001.21,NODE,.02,"I"),ROSTER("sources",HMPSEQ,"source")=$$SOURCE(HMPSOURCE)
 . . S ROSTER("sources",HMPSEQ,"localId")=+HMPSOURCE
 . . S GBL=U_$$CREF^DILF($P(HMPSOURCE,";",2)) S ROSTER("sources",HMPSEQ,"name")=$P($G(@GBL@(+HMPSOURCE,0)),U)
 I $D(HMPV(800001.23)) S NODE="",HMPZ=0 D
 . F  S NODE=$O(HMPV(800001.23,NODE)) Q:NODE=""  D
 . . S HMPZ=HMPZ+1,HMPPAT=HMPV(800001.23,NODE,.01,"E"),DFN=HMPV(800001.23,NODE,.01,"I"),ICN=$$GETICN^MPIF001(DFN)
 . . S ROSTER("patients",HMPZ,"name")=HMPPAT,ROSTER("patients",HMPZ,"localId")=DFN
 . . S ROSTER("patients",HMPZ,"uid")=$$SETUID^HMPUTILS("patient",DFN,DFN)
 . . I $D(HMPV(800001.23,NODE,.02)) S ROSTER("patients",HMPZ,"sourceSequence")=HMPV(800001.23,NODE,.02,"I")
 . . I ICN>0 S ROSTER("patients",HMPZ,"icn")=ICN
 . . S ROSTER("patients",HMPZ,"pid")=$$PID^HMPDJFS(DFN)
 D ADD("ROSTER") S HMPLAST=ID
 Q
 ;
SOURCE(SRC) ;
 N X S X=""
 I SRC["SC("        S X="clinic"
 I SRC["DPT("       S X="patient"
 I SRC["DIC(42"     S X="ward"
 I SRC["SCTM"       S X="pcmm"
 I SRC["OR(100.21"  S X="cprs"
 I SRC["HMPROSTR"    S X="roster"
 I SRC["DIC(45.7"   S X="specialty"
 I SRC["VA(200"     S X="provider"
 I SRC["PXRM(810.4" S X="pxrm"
 Q X
 ;
TESTROS ; TEMPORARY FOR TESTING
 S FILT("domain")="roster"
 S FILT("id")=277
 D GET^HMPEF(.ZZ,.FILT)
 Q
 ;
ASU ; -- ASU files
 N X,RTN S X=$P($G(TYPE),"-",2)
 S RTN=$$UP^XLFSTR(X)_"^HMPEASU"
 I X'="",$L($T(@RTN)) D @RTN
 Q
 ;
MDTERMS ; -- CP Terminology
 D:$L($T(TERM^HMPMDUTL)) TERM^HMPMDUTL
 Q
LABGRP ;
 D SHWCUMR2^HMPELAB
 Q
LABPNL ;
 D SHWORPNL^HMPELAB
 Q
 ;
ISPROXY(IEN) ;
 N APP
 S APP=$O(^VA(201,"B","APPLICATION PROXY","")) I APP'>0 Q 0
 I $D(^VA(200,IEN,"USC3","B",APP)) Q 1
 Q 0
 ;
IMMTYPE ;get immunization types
 D IMMTYPE^HMPCORD5
 Q
 ;
SIGNS ;extract data from SIGNS/SYMPTONS file
 D SIGNS^HMPCORD5
 Q
 ;
ALLTYPE ;get allergy-list types
 ;BL;REMOVE ALLERGY FROM ODS
 ;D ALLTYPE^HMPCORD5
 Q
 ;
VTYPE ;get vital types
 D VTYPE^HMPCORD5
 Q
 ;
VQUAL ;get vital qualifiers
 D VQUAL^HMPCORD5
 Q
 ;
VCAT ;get vital categories
 D VCAT^HMPCORD5
 Q
 ;
FILENAME ;display text of filenames for search treeview
 ;;VA Allergies File
 ;;VA Allergies File (Synonyms)  SPACER ONLY - NOT DISPLAYED
 ;;National Drug File - Generic Drug Name
 ;;National Drug file - Trade Name
 ;;Local Drug File
 ;;Local Drug File (Synonyms)  SPACER ONLY - NOT DISPLAYED
 ;;Drug Ingredients File
 ;;VA Drug Class File
 ;;
