HMPATRG ;AGILEX/JS - Patient Appointment Trigger to HMP Activity File ;8/4/14  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;;Build 49
 ;
 ;8/5 - TEST OTHER SDAM APPT ACTIONS:  SDAM APPT CANCEL  (D EN^SDAMC)
 ;                                     SDAM APPT NO-SHOW (D EN^SDAMN)
 ;                                     SDAM APPT UNSCHEDULED (S SDWLLIST=1 D WI^SDAM2)
 ;
 ;8/6 - Add commas, change JSON message structure depending on dfn and icn exists
 ; 
APPT ; called from Protocol file #101 SDAM APPOINTMENT EVENT item HM PATIENT APPT TRIGGER
 NEW HMDFN,HMEDIT,HMERR,HMFILE,HMICN,HMAPTDT,HMSNODE,HMSITE,HMSTA,HMSTATUS,HMNOW,HMJSDFN,HMJSICN
 I $G(DFN)="" Q
 I $G(SDT)="" Q
 S HMDFN=DFN
 S HMSNODE=$G(^DPT(HMDFN,"S",SDT,0))
 S HMICN=$P($G(^DPT(HMDFN,"MPI")),"^",1)
 S HMSTATUS=$P(HMSNODE,"^",2)
 I HMSTATUS]"" I HMSTATUS'="I" S HMEDIT=1 ; APPT STATUS IS NOT INPATIENT/FUTURE OR FUTURE,IE, STATUS CHANGE
 S HMAPTDT=$G(SDT)
 S HMNOW=$$NOW^XLFDT()
 S HMSITE=$$GET^XPAR("SYS","HMP SYSTEM NAME") ; site hash value from XPAR parameter
 S HMSTA=$P($$SITE^VASITE,"^",3) ;              site station number from file 4
 ;
 ;JSON format example for multiple records:
 ;
 ;[{
 ;   "dfn": "9E7A;200",
 ;   "site": "500"
 ;},
 ;{
 ;   "icn": "10108",
 ;   "site": "500"
 ;},
 ;{
 ;   "icn": "10109",
 ;   "site": "500"
 ;}]
 ;
 ;per email on JSON message change 8/6:
 ;
 ;    { "dfn": "VA123;391", "site": "500" } , { "icn": "10130", "site": "500" },
 ;
 ;    Do this:
 ;    { "dfn": "VA123;391", "icn": "10130", "site": "500"},
 ;       -----HMJSON1-----  ---HMJSON2----  --HMJSON3------
 ;
 ;    In the case that the patient only has one of the ids, just include that
 ;    one type. 
 ;
 ; build JSON message component
 N HMJSON,HMJSON1,HMJSON2,HMJSON3
 S HMJSON1="{ "_"""dfn"""_": "_""""_HMSITE_";"_HMDFN_""""_", " ;                 <<<< DFN OBJECT
 I $G(HMICN)]"" N HMJSON2 S HMJSON2=" "_"""icn"""_": "_""""_HMICN_""""_", " ;    <<<< ICN OBJECT 
 S HMJSON3="""site"""_": "_""""_HMSTA_"""}," ;                                   <<<< SITE OBJECT
 S HMJSON=$G(HMJSON1)_$G(HMJSON2)_$G(HMJSON3)
 ;
UPDATE ; Add/edit entry to HMP Activity file #800001.5
 S HMFILE=800001.5
 K FDA($J)
 D:$G(HMEDIT)="" FDANEW
 D:$G(HMEDIT) FDAEDIT
 D FILE
 K FDA($J)
 Q
 ;
FDANEW ; Get IEN and set up FDA root file to add a new file entry.
 S FDA($J,HMFILE,"+1,",.01)=HMDFN ;               Patient Name [.01]
 S FDA($J,HMFILE,"+1,",2)=HMAPTDT ;               Appointment Date/Time [2]
 S FDA($J,HMFILE,"+1,",3)=HMSTATUS ;              Appointment Status [3]
 S FDA($J,HMFILE,"+1,",4)=HMNOW ;                 Date Record Created [4]
 S FDA($J,HMFILE,"+1,",6)=0 ;                     HMP Process Flag [6]
 S FDA($J,HMFILE,"+1,",7)=HMJSON ;                JSON Message [7]
 Q 
 ;
FDAEDIT ; Get IEN and set up FDA root file to edit existing file entry
 S FDA($J,HMFILE,"?+1,",.01)=HMDFN ;               Patient Name [.01]
 S FDA($J,HMFILE,"?+1,",2)=HMAPTDT ;               Appointment Date/Time [2]
 S FDA($J,HMFILE,"?+1,",3)=HMSTATUS ;              Appointment Status [3]
 S FDA($J,HMFILE,"?+1,",4)=HMNOW ;                 Date Record Created [4]
 S FDA($J,HMFILE,"?+1,",6)=0 ;                     HMP Process Flag [6]
 S FDA($J,HMFILE,"?+1,",7)=HMJSON ;                JSON Message [7]
 Q 
 ;
FILE ;-file entry add/edit
 K HMERR
 D UPDATE^DIE(,"FDA($J)",,"HMERR")
 I $G(HMERR("DIERR",1)) S RET=-HMERR("DIERR",1)_U_HMERR("DIERR",1,"TEXT",1)
 K HMERR
 Q
 ;
 ;call to delete the HMP Process Flag from RPC poll
 ;deleting HMP PROCESS FLAG fld #6 will trigger date 'NOW' in DATE RECORD RETREIVED fld #5
 ;S HMIEN=1
 ;S RET=$$DEL6^HMACTRG(,HMIEN) W RET
DEL6(RET,HMIEN) ;
 S RET=0
 I $G(HMIEN)="" Q RET
 K FDA($J)
 S FDA($J,800001.5,HMIEN_",",6)="@"
 K HMERR
 D FILE^DIE("","FDA($J)","HMERR")
 I $G(HMERR("DIERR",1)) S RET=-HMERR("DIERR",1)_U_HMERR("DIERR",1,"TEXT",1) K HMERR Q RET
 S RET=1
 Q RET
