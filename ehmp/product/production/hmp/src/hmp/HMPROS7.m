HMPROS7 ;SLC/GRR -- Get Roster identification for patient(s) ;4/24/2012
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;AUG 17, 2011;Build 49
GET(HMP,HMPARRAY) ;; Previews what a roster would look like as defined
 ;;  Called by the GUI Roster Builder
 ;; Input - HMPARRAY - contains roster data entered thru GUI
 K HMPLIST,HMPLIST2
 N %,BEG,DA,DIDEL,DIE,DOB,SSN,DR,END,GENDER,ICN,NAME,HMPC,HMPCIEN,HMPDIS,HMPDNAME,HMPDOB,HMPDT,HMPIII,HMPLIEN,HMPOIEN,HMPOWNID
 N HMPOWNNM,HMPPAT,HMPPIEN,HMPPNME,HMPRCNT,HMPRID,HMPTEXT,HMPTIEN,HMPLST,HMPVAR,HMPVER,HMPWIEN,HMPWNAME,HMPZ,X,Y
 N HMPFILT,HMPI,HMPNLIST,HMPSRCID,HMPTAG,HMPTLST,HMPY,HMPTYPE,ZZ,DFN,IEN,VPERR,HMPICN,HMPOP,HMPPNAME,HMPRNAME
 N HMPSYS S HMPSYS=$$GET^XPAR("SYS","HMP SYSTEM NAME")
 S (HMPLIST,HMPFILT,HMPTYPE,HMPOP,HMPLIST2,VPERR)="",HMPI=0
 S HMP=$NA(^TMP($J,"HMPROSTR")) ; kcm -- moved this here so HMP gets defined
 K ^TMP($J,"HMPROSTR")
 I $O(HMPARRAY(""))="" S @HMP@(1)="0^No patient data passed" Q
 D NOW^%DTC S HMPDT=%
 S HMPVER="<results version='"_$P($T(HMPROS7+1),";",3)_"'>"
 D ADD(HMPVER)
 S HMPZ="" F  S HMPZ=$O(HMPARRAY(HMPZ)) Q:HMPZ=""  D
 . S DFN=$P(HMPARRAY(HMPZ),"^",1),HMPPNAME=$P(HMPARRAY(HMPZ),"^",2),HMPPNAME=$$ESC^HMPD(HMPPNAME),HMPICN=$P(HMPARRAY(HMPZ),"^",3)
 . S ICN=$$GETICN^MPIF001(DFN)
 . S NAME=$P(^DPT(DFN,0),"^",1),GENDER=$P(^DPT(DFN,0),"^",2),SSN=$P(^DPT(DFN,0),"^",9),DOB=$P(^DPT(DFN,0),"^",3),HMPDOB=$$FMTHL7^XLFDT(DOB)
 . S Y="<patient name='"_NAME_"' gender='"_GENDER_"' dob='"_HMPDOB_"' ssn='"_SSN_"' id='"_DFN_$S(ICN:"' icn='"_ICN,1:"")_"' />" D ADD(Y)
 . S IEN="" F  S IEN=$O(^HMPROSTR("AB",DFN,IEN)) Q:IEN=""  D
 . . S HMPRID=IEN,HMPRNAME=$P($G(^HMPROSTR(HMPRID,0)),"^",1),HMPRNAME=$$ESC^HMPD(HMPRNAME)
 . . S HMPTEXT="<roster ien='"_HMPRID_"' rosterName='"_HMPRNAME_"'/>" D ADD(HMPTEXT)
 S HMPTEXT="</results>" D ADD(HMPTEXT)
 Q
 ;
ADD(X) ; -- Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
 ;
TEST ;TEMPORARY
 S HMPARRAY(0)="100845^AVIVAPATIENT,FOUR^"
 S HMPARRAY(1)="100850^AVIVAPATIENT,TEN^"
 D GET(.HMP,.HMPARRAY)
 Q
 ;
TESTJ ;TEMPORARY
 S HMPARRAY(0)="100845^AVIVAPATIENT,FOUR^"
 S HMPARRAY(1)="100850^AVIVAPATIENT,TEN^"
 D GETJ(.HMP,.HMPARRAY)
 Q
 ;
GETJ(HMP,HMPARRAY) ;Get Rosters which are in selected patient(s)
 ;output in JSON object contains patient information and all rosters patient is currently in
 S HMP=$NA(^TMP($J,"HMPROSTR")) ; kcm -- moved this here so HMP gets defined
 N HMPI,HMPDT,HMPZ,DFN,HMPRNAME,HMPICN,NAME,SSN,DOB,HMPDOB,PAT,HMPRID,X,Y
 K ^TMP($J,"HMPROSTR")
 I $O(HMPARRAY(""))="" S @HMP@(1)="0^No patient data passed" Q
 D NOW^%DTC S HMPDT=%
 S HMPI=0
 S HMPZ="" F  S HMPZ=$O(HMPARRAY(HMPZ)) Q:HMPZ=""  D
 . S DFN=$P(HMPARRAY(HMPZ),"^",1),HMPPNAME=$P(HMPARRAY(HMPZ),"^",2),HMPPNAME=$$ESC^HMPD(HMPPNAME),HMPICN=$P(HMPARRAY(HMPZ),"^",3)
 . S ICN=$$GETICN^MPIF001(DFN)
 . S NAME=$P(^DPT(DFN,0),"^",1),GENDER=$P(^DPT(DFN,0),"^",2),SSN=$P(^DPT(DFN,0),"^",9),DOB=$P(^DPT(DFN,0),"^",3),HMPDOB=$$JSONDT^HMPUTILS(DOB)
 . S PAT("familyName")=$P(NAME,",",1),PAT("givenNames")=$P(NAME,",",2,99),PAT("ssn")=SSN,PAT("localId")=DFN
 . S X=GENDER S PAT("genderCode")="urn:va:pat-gender:"_X,PAT("genderName")=$$NAME^HMPDJ00(X,"gender")
 . S PAT("dateOfBirth")=HMPDOB,PAT("uid")=$$SETUID^HMPUTILS("pat",DFN,DFN,"")
 . S IEN="" F  S IEN=$O(^HMPROSTR("AB",DFN,IEN)) Q:IEN=""  D
 . . S HMPRID=IEN,HMPRNAME=$P($G(^HMPROSTR(HMPRID,0)),"^",1),HMPRNAME=$$ESC^HMPD(HMPRNAME)
 . . S PAT("roster",IEN,"localId")=IEN,PAT("roster",IEN,"uid")=$$SETUID^HMPUTILS("roster","",IEN,"")
 . . S PAT("roster",IEN,"rosterName")=HMPRNAME
 I $D(PAT)>9 D ADDJ
 Q
 ;
ADDJ ;
 N HMPY,ERR
 D ENCODE^HMPJSON("PAT","HMPY","ERR")
 I $D(HMPY) D
 . D:HMPI COMMA(HMPI)
 . S HMPI=HMPI+1 M @HMP@(HMPI)=HMPY
 Q
 ;
COMMA(I) ;; -- add comma between items
 N J S J=+$O(@HMP@(I,"A"),-1) ;last sub-node for item I
 S J=J+1,@HMP@(I,J)=","
 Q
 ;
SUBS(HMP,SYS,ON,LIST) ; -- Un/Subscribe to Patient Data Monitor
 ; RPC = HMP SUBSCRIBE ROSTERS
 N DA,I,ID,HDR,HMPI
 S SYS=$G(SYS),ON=+$G(ON) Q:'$L(SYS)
 S DA=$$FIND^HMPPATS(SYS) Q:DA<1
 S HMP=$NA(^TMP("HMP",$J)) K @HMP
 ;S:'$D(^XTMP("HMPOS")) ^XTMP("HMPOS",0)="3991231^"_DT_"^HMP Patient Data Monitor"
 ;
 ; loop through LIST(n) = 'id'
 D ADD("<rosters>")
 S I="" F  S I=$O(LIST(I)) Q:I=""  S ID=LIST(I) D
 . I ID<1!'$D(^HMPROSTR(ID)) D RET(ID,"error") Q
 . I ON D  Q
 .. S:'$D(^HMP(800000,DA,2,ID,0)) HDR=$G(^HMP(800000,DA,2,0)),^(0)="^800000.02P^"_ID_U_($P(HDR,U,4)+1)
 .. S ^HMP(800000,DA,2,ID,0)=ID_U_ON,^HMP(800000,"AROS",ID,DA)=""
 .. D RET(ID,"on") ;S ^XTMP("HMPOS",ID)=ON
 . ; else, remove patient tracking info from ^XTMP
 . S:$D(^HMP(800000,DA,2,ID,0)) $P(^(0),U,2)=0
 . K ^HMP(800000,"AROS",ID,DA) ;I '$D(^HMP(800000,"AROS",ID)) K ^XTMP("HMPOS",ID)
 . D RET(ID,"off")
 D ADD("</rosters>")
 Q
 ;
RET(ID,STS) ; -- add XML node for roster ID update subscription
 N Y S Y="<roster id='"_$G(ID)
 S Y=Y_"' subscribe='"_$G(STS)_"' />"
 D ADD(Y)
 Q
