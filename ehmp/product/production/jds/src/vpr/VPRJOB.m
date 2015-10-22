VPRJOB ;CNP/JD -- Handle Job operations ;2015-04-15  8:33 PM
 ;;1.0;JSON DATA STORE;;Dec 02, 2014
 ;;Dec 09, 2014
 ;
 Q
 ;
 ; Global Structure
 ; ^VPRJOB(0)=Sequential counter
 ; ^VPRJOB("A",JPID,Type,Root Job ID,Job ID,TimeStamp,Status)=Sequential Counter
 ; ^VPRJOB("B",Sequential counter)=JPID^Type^Root Job ID^Job ID^TimeStamp^Status
 ; ^VPRJOB("C",Job ID,Root Job ID)=""
 ; ^VPRJOB("D",JPID,Type,TimeStamp,Sequential counter)=Sequential counter
 ; ^VPRJOB(Sequential counter)=Passed JSON Object
SET(ARGS,BODY) ; Store job info
 N DEMOG,ERR,JID,JPID,RJID,JSTAT,VPRA,VPRCNT,VPRTS,U,PID,ICN
 S U="^"
 D DECODE^VPRJSON("BODY","DEMOG","ERR") ; From JSON to an array
 ; Ensure required variables exist
 I $D(ERR) D SETERROR^VPRJRER(202) Q ""
 S RJID=$G(DEMOG("rootJobId"))
 I $G(RJID)="" D SETERROR^VPRJRER(232) Q ""
 S JID=$G(DEMOG("jobId"))
 I $G(JID)="" D SETERROR^VPRJRER(233) Q ""
 S JTYPE=$G(DEMOG("type"))
 I $G(JTYPE)="" D SETERROR^VPRJRER(234) Q ""
 S JSTAT=$G(DEMOG("status"))
 I $G(JSTAT)="" D SETERROR^VPRJRER(234) Q ""
 S VPRTS=$G(DEMOG("timestamp"))
 I VPRTS="" D SETERROR^VPRJRER(235) Q ""
 ;
 ; Make sure we have a patient identifier
 S JPID=$G(DEMOG("jpid"))
 I $G(DEMOG("patientIdentifier","type"))="pid" S PID=$G(DEMOG("patientIdentifier","value"))
 I $G(DEMOG("patientIdentifier","type"))="icn" S ICN=$G(DEMOG("patientIdentifier","value"))
 ; If what we are passed isn't a JPID get a JPID
 I $G(ICN)'="" S JPID=$$JPID4PID^VPRJPR(ICN)
 I $G(PID)'="" S JPID=$$JPID4PID^VPRJPR(PID)
 ; A JPID should exist by now if not error out
 I $G(JPID)="" D SETERROR^VPRJRER(231) Q ""
 ; Ensure we know jpid
 I '$$JPIDEXISTS^VPRJPR(JPID) D SETERROR^VPRJRER(224) Q ""
 ;
 ; Validate the rootJobId, jobId pair
 ; If (1,2) exists, then for (n,2), n can only be 1
 S VPRA=$O(^VPRJOB("C",JID,""))
 I VPRA,(RJID'=VPRA) D SETERROR^VPRJRER(236) Q ""
 L +^VPRJOB:2 E  D SETERROR^VPRJRER(502) Q ""
 TSTART
 S ^VPRJOB(0)=$G(^VPRJOB(0))+1
 S VPRCNT=^VPRJOB(0)
 S ^VPRJOB("A",JPID,JTYPE,RJID,JID,VPRTS,JSTAT)=VPRCNT
 S ^VPRJOB("B",VPRCNT)=JPID_U_JTYPE_U_RJID_U_JID_U_VPRTS_U_JSTAT
 S ^VPRJOB("C",JID,RJID)=""
 S ^VPRJOB("D",JPID,JTYPE,VPRTS,VPRCNT)=VPRCNT
 M ^VPRJOB(VPRCNT)=DEMOG
 TCOMMIT
 L -^VPRJOB
 Q ""
 ;
GET(RESULT,ARGS) ; Return job info
 N DEMOG,ERR,JID,JPID,JTYPE,RJID,VPRA,VPRB,VPRC,VPRD,VPRE,VPRF,VPRJQ,U,FILTER,CLAUSES,CLAUSE,VALUE,BODY,HTTPERR,I
 S VPRJQ=""""
 S U="^"
 ; Verify required arguments exist
 I $$UNKARGS^VPRJCU(.ARGS,"jpid,rootJobId,jobId,filter") Q
 S JPID=$G(ARGS("jpid"))
 S RJID=$G(ARGS("rootJobId"))
 S JID=$G(ARGS("jobId"))
 S FILTER=$G(ARGS("filter"))
 I $L(FILTER) D PARSE^VPRJCF(FILTER,.CLAUSES) Q:$G(HTTPERR)
 ; If what we are passed isn't a JPID get a JPID
 I '$$ISJPID^VPRJPR(JPID) S JPID=$$JPID4PID^VPRJPR(JPID)
 ; No JPID
 I $G(JPID)']"" D  Q
 .S RESULT="{"_VPRJQ_"message"_VPRJQ_":"_VPRJQ_"JPID is a required field"_VPRJQ_"}"
 ; Ensure jobs exist for a JPID
 I $O(^VPRJOB("A",JPID,""))']"" D  Q
 .S RESULT="[]"
 ; Ensure result variable is empty
 K DEMOG
 ; VPRD=rootJobId-1 or 0
 S VPRD=$S(RJID]"":RJID-1,1:0)
 ; Setup JTYPE for $Order
 S JTYPE=""
 ; Loop through A index
 ; ^VPRJOB("A",JPID,Job Type,Root Job ID,Job ID,TimeStamp,Status)=Sequential Counter
 F  S JTYPE=$O(^VPRJOB("A",JPID,JTYPE)) Q:JTYPE=""  D
 .; VPRD=Root Job Id
 .F  S VPRD=$O(^VPRJOB("A",JPID,JTYPE,VPRD)) Q:VPRD=""  Q:(VPRD'=VPRD)  D
 ..;VPRE=JobId-1 or 0
 ..S VPRE=$S(JID]"":JID-1,1:0)
 ..F  S VPRE=$O(^VPRJOB("A",JPID,JTYPE,VPRD,VPRE)) Q:VPRE=""  Q:(VPRE'=VPRE)  D
 ...;VPRC=TimeStamp
 ...S VPRC=$O(^VPRJOB("A",JPID,JTYPE,VPRD,VPRE,""),-1)  ; Most recent
 ...;VPRF=Status
 ...S VPRF=$O(^VPRJOB("A",JPID,JTYPE,VPRD,VPRE,VPRC,""))
 ...;VPRA=Sequential Counter for Job
 ...S VPRA=^VPRJOB("A",JPID,JTYPE,VPRD,VPRE,VPRC,VPRF)
 ...;VPRB=JPID^Job Type^Root Job ID^Job ID^TimeStamp^Status
 ...S VPRB=$G(^VPRJOB("B",VPRA))
 ...; Eval filter if clauses exists
 ...; This uses the basics of EVALEXPR^VPRJCF not a complete implementation
 ...; If the clause evaluates to true add it to the return
 ...; EVALONE requires CLAUSE and VALUE
 ...I $D(CLAUSES) D  Q
 ....; Ensure we only run this for the last timestamp for the JPID and job type
 ....I VPRC'=$O(^VPRJOB("D",JPID,JTYPE,""),-1) Q
 ....N I
 ....S I=""
 ....; Loop through all of the clauses we have
 ....F  S I=$O(CLAUSES(I)) Q:I=""  D
 .....M CLAUSE=CLAUSES(I)
 .....I CLAUSE("type")=1 S VALUE=$G(^VPRJOB(VPRA,CLAUSE("field"))) M:$$EVALONE^VPRJCF DEMOG("items",VPRA)=^VPRJOB(VPRA)
 ...; If we have a rootJobId and JobId and TimeStamp and they match return the Job
 ...I $G(RJID)]"",$G(JID)]"",$P(VPRB,U)=JPID,$P(VPRB,U,3)=RJID,$P(VPRB,U,4)=JID,$P(VPRB,U,5)=VPRC M DEMOG("items",VPRA)=^VPRJOB(VPRA) Q
 ...; If we have a rootJobId and TimeStamp and they match return the Job
 ...I $G(RJID)]"",$G(JID)']"",$P(VPRB,U)=JPID,$P(VPRB,U,3)=RJID,$P(VPRB,U,5)=VPRC M DEMOG("items",VPRA)=^VPRJOB(VPRA) Q
 ...; If we have neither just return the latest Job
 ...I $G(RJID)']"",$G(JID)']"",$P(VPRB,U)=JPID,$P(VPRB,U,5)=VPRC M DEMOG("items",VPRA)=^VPRJOB(VPRA) Q
 I '$D(DEMOG) D  Q
 .; nothing to return
 .S RESULT="{"_VPRJQ_"message"_VPRJQ_":"_VPRJQ_"Nothing to return!"_VPRJQ_"}"
 ; Encode JSON
 D ENCODE^VPRJSON("DEMOG","BODY","ERR") ; From an array to JSON
 ; If we can't encode the JSON error out
 I $D(ERR) D SETERROR^VPRJRER(202) Q
 M RESULT=BODY
 Q
CLEAR(RESULT,ARGS) ; Delete all job state data
 K ^VPRJOB
 Q ""
DEL(PID) ; Delete all job statuses for a PID
 ; Get the JPID for a PID as Job status depends on JPID
 N JPID,JTYPE,RJID,JID,TS,SC,STATUS
 I '$$ISJPID^VPRJPR(PID) S JPID=$$JPID4PID^VPRJPR(PID)
 E  S JPID=PID
 ; If JPID is blank we are unable to convert the PID to a JPID and need to quit
 I JPID="" Q
 ; Loop through A index to get Sequential counter and Job IDs
 S JTYPE=""
 F  S JTYPE=$O(^VPRJOB("A",JPID,JTYPE)) Q:JTYPE=""  D
 . S RJID=""
 . F  S RJID=$O(^VPRJOB("A",JPID,JTYPE,RJID)) Q:RJID=""  D
 . . S JID=""
 . . F  S JID=$O(^VPRJOB("A",JPID,JTYPE,RJID,JID)) Q:JID=""  D
 . . . S TS=""
 . . . F  S TS=$O(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS)) Q:TS=""  D
 . . . . S STATUS=""
 . . . . F  S STATUS=$O(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS,STATUS)) Q:STATUS=""  D
 . . . . . ; Get the sequential counter
 . . . . . S SC=$G(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS,STATUS))
 . . . . . ; Kill the data
 . . . . . K ^VPRJOB(SC)
 . . . . . ; Kill the D index
 . . . . . K ^VPRJOB("D",JPID,JTYPE)
 . . . . . ; Kill the C index
 . . . . . K ^VPRJOB("C",JID,RJID)
 . . . . . ; Kill the B index
 . . . . . K ^VPRJOB("B",SC)
 . . . . . ; Kill the A index
 . . . . . K ^VPRJOB("A",JPID,JTYPE,RJID,JID,TS,STATUS)
 Q
 ;
DELJID(RESULT,ARGS) ; REST entry point to delete a job id
 N JID,JPID,JTYPE,RJID,TS,SC,STATUS
 S JID=$G(ARGS("jobid"))
 ; quit if job id is not valid
 I $G(JID)="",$G(JID)'?.N Q
 ; Loop through A index to get sequential counter
 S JPID=""
 F  S JPID=$O(^VPRJOB("A",JPID)) Q:JPID=""  D
 . S JTYPE=""
 . F  S JTYPE=$O(^VPRJOB("A",JPID,JTYPE)) Q:JTYPE=""  D
 . . S RJID=""
 . . F  S RJID=$O(^VPRJOB("A",JPID,JTYPE,RJID)) Q:RJID=""  D
 . . . Q:'$D(^VPRJOB("A",JPID,JTYPE,RJID,JID))
 . . . S TS=""
 . . . F  S TS=$O(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS)) Q:TS=""  D
 . . . . S STATUS=""
 . . . . F  S STATUS=$O(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS,STATUS)) Q:STATUS=""  D
 . . . . . ; Get the sequential counter
 . . . . . S SC=$G(^VPRJOB("A",JPID,JTYPE,RJID,JID,TS,STATUS))
 . . . . . ; Kill the data
 . . . . . K ^VPRJOB(SC)
 . . . . . ; Kill the B index
 . . . . . K ^VPRJOB("B",SC)
 . . . . . ; Kill the D index
 . . . . . K ^VPRJOB("D",JPID,JTYPE,TS,SC)
 . . . ; Needs to be killed outside the inner two loops, as it is being iterated
 . . . ; Kill the A index
 . . . K ^VPRJOB("A",JPID,JTYPE,RJID,JID)
 ; Don't keep killing the same nodes over and over in all the inner loops
 ; Kill the C index
 K ^VPRJOB("C",JID)
 S RESULT="{}"
 Q
 ;
DELSITE(PID) ; Delete the job status for a site
 ; No site info in ^VPRJOB, so need to use PID
 I '$L(PID) D SETERROR^VPRJRER(208) QUIT
 ;
 N VPRJOB,JPID,RJID,JID,SC,STAMP,TYPE
 ;
 S SC=0
 F  S SC=$O(^VPRJOB(SC)) Q:SC=""!(+SC'=SC)  D
 . Q:^VPRJOB(SC,"patientIdentifier","type")'="pid"
 . I ^VPRJOB(SC,"patientIdentifier","value")=PID D
 . . S JPID=^VPRJOB(SC,"jpid")
 . . S TYPE=^VPRJOB(SC,"type")
 . . S RJID=^VPRJOB(SC,"rootJobId")
 . . S JID=^VPRJOB(SC,"jobId")
 . . S STAMP=^VPRJOB(SC,"timestamp")
 . . ;
 . . K ^VPRJOB("A",JPID,TYPE,RJID,JID,STAMP)
 . . K ^VPRJOB("B",SC)
 . . K ^VPRJOB("C",JID,RJID)
 . . K ^VPRJOB("D",JPID,TYPE,STAMP)
 . . K ^VPRJOB(SC)
 Q
DELETE(RESULT,ARGS) ; REST entry point wrapper for DEL^VPRJOB
 N PID
 S PID=$G(ARGS("id"))
 D DEL(PID)
 S RESULT="{}"
 Q
