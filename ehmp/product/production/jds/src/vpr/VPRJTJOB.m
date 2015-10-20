VPRJTJOB ;KRM/CJE -- Unit Tests for GET/PUT Job Status
 ;;1.0;JSON DATA STORE;;Dec 16, 2014
 ;
 ; Endpoints tested
 ; GET job/{jpid}/{rootJobId}/{jobId} GET^VPRJOB
 ; GET job/{jpid}/{rootJobId} GET^VPRJOB
 ; GET job/{jpid} GET^VPRJOB
 ; DELETE job/{id} DELETE^VPRJOB
 ; DELETE job/jobid/{jobid} DELJID^VPRJOB
 ; API tested
 ; DEL(PID) - Delete all Jobs for a PID
STARTUP  ; Run once before all tests
 K ^VPRJOB
 K ^VPRPTJ("JPID")
 K HTTPERR
 D PATIDS
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRJOB
 K ^VPRPTJ("JPID")
 K ^TMP
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","ZZUT;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1ZZUT;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1234V4321")=""
 S ^VPRPTJ("JPID","ZZUT;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1ZZUT;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","ZZUT;4")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","1ZZUT;4")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","2345V5432")=""
 S ^VPRPTJ("JPID","ZZUT;4")="52833885-af7c-4899-90be-b3a6630b2370"
 S ^VPRPTJ("JPID","1ZZUT;4")="52833885-af7c-4899-90be-b3a6630b2370"
 S ^VPRPTJ("JPID","2345V5432")="52833885-af7c-4899-90be-b3a6630b2370"
 Q
 ;
JOBSTAT(JOB,ROOT,JPID,TYPE,STAMP,STATUS) ; Setup Job status JSON
 Q "{""jobId"": """_JOB_""",""rootJobId"": """_ROOT_""",""jpid"": """_JPID_""",""type"": """_TYPE_""",""timestamp"": """_STAMP_""",""payload"": { ""test"": ""true"" },""status"": """_STATUS_"""}"
JOBSTATG(JOB,ROOT,JPID,TYPE,STAMP,STATUS) ; Setup Job status Global
 N VPRCNT
 S ^VPRJOB(0)=$G(^VPRJOB(0))+1
 S VPRCNT=^VPRJOB(0)
 S ^VPRJOB(VPRCNT,"jobId")=JOB
 S ^VPRJOB(VPRCNT,"jobId","\s")=""
 S ^VPRJOB(VPRCNT,"type")=TYPE
 S ^VPRJOB(VPRCNT,"jpid")=JPID
 S ^VPRJOB(VPRCNT,"payload","test")="true"
 S ^VPRJOB(VPRCNT,"payload","test","\s")=""
 S ^VPRJOB(VPRCNT,"rootJobId")=ROOT
 S ^VPRJOB(VPRCNT,"rootJobId","\s")=""
 S ^VPRJOB(VPRCNT,"status")=STATUS
 S ^VPRJOB(VPRCNT,"timestamp")=STAMP
 S ^VPRJOB(VPRCNT,"timestamp","\s")=""
 S ^VPRJOB("A",JPID,TYPE,ROOT,JOB,STAMP,STATUS)=VPRCNT
 S ^VPRJOB("B",VPRCNT)=JPID_"^"_TYPE_"^"_ROOT_"^"_JOB_"^"_STAMP_"^"_STATUS
 S ^VPRJOB("C",JOB,ROOT)=""
 S ^VPRJOB("D",JPID,TYPE,STAMP)=""
 Q
JSONERR ;; @TEST Error code is set if JSON is mangled
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S BODY(1)=BODY(1)_":"
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 202 reason code should have occurred")
 K ^TMP
 Q
JPIDERR ;; @TEST Error code is set if no JPID
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID=""
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(231,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 231 reason code should have occurred")
 K ^TMP
 Q
UNKJPIDERR ;; @TEST Error code is set if JPID is unknown
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2371"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 224 reason code should have occurred")
 K ^TMP
 Q
ROOTERR ;; @TEST Error code is set if no rootJobId
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,"",JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(232,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 232 reason code should have occurred")
 K ^TMP
 Q
JOBERR ;; @TEST Error code is set if no jobId
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT("",1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(233,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 233 reason code should have occurred")
 K ^TMP
 Q
STATUSERR ;; @TEST Error code is set if no status
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(234,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 234 reason code should have occurred")
 K ^TMP
 Q
STAMPERR ;; @TEST Error code is set if no timestamp
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=""
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(0,$D(^VPRJOB),"A Job Status exists and it should not")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(235,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 235 reason code should have occurred")
 K ^TMP
 Q
VALIDERR ;; @TEST Error code is set if no the jobId and rootJobId pair doesn't match
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,2,JPID,TYPE,STAMP,"created")
 ; Create a collision
 S ^VPRJOB("C",2,1)=""
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 ; Remove collision global to ensure check is valid
 K ^VPRJOB("C",2,1)
 D ASSERT(0,$D(^VPRJOB),"A Job Status does exists and it should not")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(236,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 236 reason code should have occurred")
 K ^TMP
 Q
SET1 ;; @TEST Storing one Job Status
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJOB),"A Job Status does not exist and it should")
 D ASSERT(10,$D(^VPRJOB(1)),"rootJobId does not exist")
 D ASSERT(2,$G(^VPRJOB(1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(^VPRJOB(1,"type")),"jobType is incorrect")
 D ASSERT("true",$G(^VPRJOB(1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(^VPRJOB(1,"rootJobId")),"rootJobId does not exist in data")
 D ASSERT("created",$G(^VPRJOB(1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(^VPRJOB(1,"timestamp")),"timestamp does not exist")
 D ASSERT(1,$G(^VPRJOB("A",JPID,TYPE,1,2,STAMP,"created")),"A index does not exist correctly")
 D ASSERT(JPID_U_TYPE_U_1_U_2_U_STAMP_U_"created",$G(^VPRJOB("B",1)),"B index does not exist correctly")
 D ASSERT(1,$D(^VPRJOB("C",2,1)),"C index does not exist correctly")
 Q
SETPID ;; @TEST Storing one Job Status (with PID as identifier)
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)="{""jobId"": ""2"",""patientIdentifier"": {""type"": ""pid"",""value"":""ZZUT;3""},""rootJobId"": ""1"",""status"": ""created"",""timestamp"": ""201412180711200"",""type"": ""jmeadows-lab-sync-request""}"
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJOB),"A Job Status does not exist and it should")
 D ASSERT(10,$D(^VPRJOB(1)),"rootJobId does not exist")
 D ASSERT(2,$G(^VPRJOB(1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(^VPRJOB(1,"type")),"type is incorrect")
 D ASSERT(1,$G(^VPRJOB(1,"rootJobId")),"rootJobId does not exist in data")
 D ASSERT("created",$G(^VPRJOB(1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(^VPRJOB(1,"timestamp")),"timestamp does not exist")
 D ASSERT(1,$G(^VPRJOB("A",JPID,TYPE,1,2,STAMP,"created")),"A index does not exist correctly")
 D ASSERT(JPID_U_TYPE_U_1_U_2_U_STAMP_U_"created",$G(^VPRJOB("B",1)),"B index does not exist correctly")
 D ASSERT(1,$D(^VPRJOB("C",2,1)),"C index does not exist correctly")
 Q
SET2 ;; @TEST Storing two Job Status
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 S BODY(1)=$$JOBSTAT(2,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJOB),"A Job Status does not exist and it should")
 D ASSERT(10,$D(^VPRJOB(1)),"rootJobId does not exist")
 D ASSERT(2,$G(^VPRJOB(1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(^VPRJOB(1,"type")),"jobType is incorrect")
 D ASSERT("true",$G(^VPRJOB(1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(^VPRJOB(1,"rootJobId")),"rootJobId does not exist in data")
 D ASSERT("created",$G(^VPRJOB(1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(^VPRJOB(1,"timestamp")),"timestamp does not exist")
 D ASSERT(1,$G(^VPRJOB("A",JPID,TYPE,1,2,STAMP,"created")),"A index does not exist correctly")
 D ASSERT(JPID_U_TYPE_U_1_U_2_U_STAMP_U_"created",$G(^VPRJOB("B",1)),"B index does not exist correctly")
 D ASSERT(1,$D(^VPRJOB("C",2,1)),"C index does not exist correctly")
 S TYPE="jmeadows-vitals-sync-request"
 S STAMP=201412180711201
 S BODY(1)=$$JOBSTAT(3,1,JPID,TYPE,STAMP,"created")
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJOB),"A Job Status does not exist and it should")
 D ASSERT(10,$D(^VPRJOB(2)),"rootJobId does not exist")
 D ASSERT(3,$G(^VPRJOB(2,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(^VPRJOB(2,"type")),"jobType is incorrect")
 D ASSERT("true",$G(^VPRJOB(2,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(^VPRJOB(2,"rootJobId")),"rootJobId does not exist in data")
 D ASSERT("created",$G(^VPRJOB(2,"status")),"status does not exist")
 D ASSERT(STAMP,$G(^VPRJOB(2,"timestamp")),"timestamp does not exist")
 D ASSERT(2,$G(^VPRJOB("A",JPID,TYPE,1,3,STAMP,"created")),"A index does not exist correctly")
 D ASSERT(JPID_U_TYPE_U_1_U_3_U_STAMP_U_"created",$G(^VPRJOB("B",2)),"B index does not exist correctly")
 D ASSERT(1,$D(^VPRJOB("C",3,1)),"C index does not exist correctly")
 Q
GETJPID ;; @TEST retrieve one job status by JPID
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")=JPID
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETICN ;; @TEST retrieve one job status by ICN
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="1234V4321"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETPID ;; @TEST retrieve one job status by PID
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="ZZUT;3"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETPIDA ;; @TEST retrieve one job status by PID (1ZZUT)
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="1ZZUT;3"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETJPIDROOT ;; @TEST retrieve one job status by JPID and rootJobId
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETICNROOT ;; @TEST retrieve one job status by ICN and rootJobId
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="1234V4321"
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETPIDROOT ;; @TEST retrieve one job status by PID and rootJobId
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="ZZUT;3"
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETPIDAROOT ;; @TEST retrieve one job status by PID and rootJobId (1ZZUT)
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 S ARG("jpid")="1ZZUT;3"
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETJPIDROOT2 ;; @TEST retrieve one job status by JPID and rootJobId with two on file
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 ; we should see the inprogress one
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"inprogress")
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("inprogress",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP+1,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETJPIDROOT2D ;; @TEST retrieve one job status by JPID and rootJobId with two different jobs on file
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,TYPE2,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vitals-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(3,1,JPID,TYPE2,STAMP+1,"created")
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 ; Second item
 D ASSERT(3,$G(OBJECT("items",2,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",2,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",2,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",2,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",2,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",2,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",2,"timestamp")),"timestamp is not correct")
 Q
GETJPIDROOTC ;; @TEST retrieve one job status by JPID and rootJobId with job in completed state
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 ; we should see the completed one
 D JOBSTATG(2,1,JPID,TYPE,STAMP+5,"completed")
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("completed",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP+5,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETJPIDROOTJOB ;; @TEST retrieve one job status by JPID and rootJobId and JobId
 N OBJECT,DATA,ARG,U,TYPE,JPID,STAMP,TYPE2,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vitals-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(3,1,JPID,TYPE2,STAMP+1,"created")
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 S ARG("jobId")=3
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(3,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 Q
SG1UUID ;; @TEST Store/Get one realistic Job Status with a jobId with a UUID
 N RETURN,BODY,ARG,U,TYPE,JPID,STAMP,DATA,OBJECT,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="vista-ZZUT-data-poller"
 S STAMP=1422485662841
 ; JSON from Les
 ; Blows up decoding
 ;S BODY(1)="{ type: 'vista-ZZUT-data-poller',patientIdentifier: { type: 'pid', value: 'ZZUT;3' },jpid: '52833885-af7c-4899-90be-b3a6630b2369',rootJobId: '1',jobId: '520f4e0c-84e8-4d92-9793-23277ea357a6',status: 'completed',timestamp: '1422485662841' }"
 ; Quoted strings
 ; Blows up decoding
 ;S BODY(1)="{ type: ""vista-ZZUT-data-poller"",patientIdentifier: { type: ""pid"", value: ""ZZUT;3"" },jpid: ""52833885-af7c-4899-90be-b3a6630b2369"",rootJobId: ""1"",jobId: ""520f4e0c-84e8-4d92-9793-23277ea357a6"",status: ""completed"",timestamp: ""1422485662841"" }"
 ; Quoted attributes
 ; ERR from deoding
 ;S BODY(1)="{ ""type"": 'vista-ZZUT-data-poller',""patientIdentifier"": { ""type"": 'pid', ""value"": 'ZZUT;3' },""jpid"": '52833885-af7c-4899-90be-b3a6630b2369',""rootJobId"": '1',""jobId"": '520f4e0c-84e8-4d92-9793-23277ea357a6',""status"": 'completed',""timestamp"": '1422485662841' }"
 ; Quoted attributes and strings
 S BODY(1)="{ ""type"": ""vista-ZZUT-data-poller"",""patientIdentifier"": { ""type"": ""pid"", ""value"": ""ZZUT;3"" },""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369"",""rootJobId"": ""1"",""jobId"": ""520f4e0c-84e8-4d92-9793-23277ea357a6"",""status"": ""completed"",""timestamp"": ""1422485662841"" }"
 S RETURN=$$SET^VPRJOB(.ARG,.BODY)
 D ASSERT(10,$D(^VPRJOB),"A Job Status does not exist and it should")
 D ASSERT(10,$D(^VPRJOB(1)),"rootJobId does not exist")
 D ASSERT("520f4e0c-84e8-4d92-9793-23277ea357a6",$G(^VPRJOB(1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE,$G(^VPRJOB(1,"type")),"jobType is incorrect")
 D ASSERT(1,$G(^VPRJOB(1,"rootJobId")),"rootJobId does not exist in data")
 D ASSERT("completed",$G(^VPRJOB(1,"status")),"status does not exist")
 D ASSERT(STAMP,$G(^VPRJOB(1,"timestamp")),"timestamp does not exist")
 D ASSERT(1,$G(^VPRJOB("A",JPID,TYPE,1,"520f4e0c-84e8-4d92-9793-23277ea357a6",STAMP,"completed")),"A index does not exist correctly")
 D ASSERT(JPID_U_TYPE_U_1_U_"520f4e0c-84e8-4d92-9793-23277ea357a6"_U_STAMP_U_"completed",$G(^VPRJOB("B",1)),"B index does not exist correctly")
 D ASSERT(1,$D(^VPRJOB("C","520f4e0c-84e8-4d92-9793-23277ea357a6",1)),"C index does not exist correctly")
 ; Cleanup variables
 K BODY,ARG,RETURN
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 S ARG("jobId")="520f4e0c-84e8-4d92-9793-23277ea357a6"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(ARG("jobId"),$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("completed",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 Q
DELPID ;; @TEST all jobs deleted for a JPID
 N OBJECT,DATA,ARG,U,TYPE,JPID,JPID2,STAMP,TYPE2
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vitals-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(3,1,JPID,TYPE2,STAMP+1,"created")
 ; create data for 2nd patient
 S JPID2="52833885-af7c-4899-90be-b3a6630b2370"
 D JOBSTATG(4,2,JPID2,TYPE,STAMP,"created")
 D JOBSTATG(5,2,JPID2,TYPE2,STAMP+1,"created")
 ; Ensure data for the first patient exists
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 ; Second item
 D ASSERT(3,$G(OBJECT("items",2,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",2,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",2,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",2,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",2,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",2,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",2,"timestamp")),"timestamp is not correct")
 ; Ensure data for the second patient exists
 K ARG,DATA
 S ARG("jpid")=JPID2
 S ARG("rootJobId")=2
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(4,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID2,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(2,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 ; Second item
 D ASSERT(5,$G(OBJECT("items",2,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",2,"type")),"jobType is not correct")
 D ASSERT(JPID2,$G(OBJECT("items",2,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",2,"payload","test")),"payload attribute is not correct")
 D ASSERT(2,$G(OBJECT("items",2,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",2,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",2,"timestamp")),"timestamp is not correct")
 ; Delete data for the first patient
 D DEL^VPRJOB("ZZUT;3")
 D ASSERT(0,$D(^VPRJOB(1)),"Data for Sequential Counter 1 does exist and should not")
 D ASSERT(0,$D(^VPRJOB(2)),"Data for Sequential Counter 2 does exist and should not")
 D ASSERT(10,$D(^VPRJOB(3)),"Data for Sequential Counter 3 does not exist and should")
 D ASSERT(10,$D(^VPRJOB(4)),"Data for Sequential Counter 4 does not exist and should")
 ; Delete data for the first patient
 D DEL^VPRJOB("1ZZUT;4")
 D ASSERT(0,$D(^VPRJOB(1)),"Data for Sequential Counter 1 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(2)),"Data for Sequential Counter 2 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(3)),"Data for Sequential Counter 3 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(4)),"Data for Sequential Counter 4 does not exist and should not")
 ; Ensure data can stil be added sanely
 ; create data for 1st patient
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vitals-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(3,1,JPID,TYPE2,STAMP+1,"created")
 ; create data for 2nd patient
 S JPID2="52833885-af7c-4899-90be-b3a6630b2370"
 D JOBSTATG(4,2,JPID2,TYPE,STAMP,"created")
 D JOBSTATG(5,2,JPID2,TYPE2,STAMP+1,"created")
 ; Ensure data for the first patient exists
 S ARG("jpid")=JPID
 S ARG("rootJobId")=1
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(2,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 ; Second item
 D ASSERT(3,$G(OBJECT("items",2,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",2,"type")),"jobType is not correct")
 D ASSERT(JPID,$G(OBJECT("items",2,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",2,"payload","test")),"payload attribute is not correct")
 D ASSERT(1,$G(OBJECT("items",2,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",2,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",2,"timestamp")),"timestamp is not correct")
 ; Ensure data for the second patient exists
 K ARG,DATA
 S ARG("jpid")=JPID2
 S ARG("rootJobId")=2
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(4,$G(OBJECT("items",1,"jobId")),"jobId is not correct")
 D ASSERT(TYPE,$G(OBJECT("items",1,"type")),"jobType is not correct")
 D ASSERT(JPID2,$G(OBJECT("items",1,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute is not correct")
 D ASSERT(2,$G(OBJECT("items",1,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",1,"status")),"status is not correct")
 D ASSERT(STAMP,$G(OBJECT("items",1,"timestamp")),"timestamp is not correct")
 ; Second item
 D ASSERT(5,$G(OBJECT("items",2,"jobId")),"jobId is not correct")
 D ASSERT(TYPE2,$G(OBJECT("items",2,"type")),"jobType is not correct")
 D ASSERT(JPID2,$G(OBJECT("items",2,"jpid")),"jpid is not correct")
 D ASSERT("true",$G(OBJECT("items",2,"payload","test")),"payload attribute is not correct")
 D ASSERT(2,$G(OBJECT("items",2,"rootJobId")),"rootJobId is not correct")
 D ASSERT("created",$G(OBJECT("items",2,"status")),"status is not correct")
 D ASSERT(STAMP+1,$G(OBJECT("items",2,"timestamp")),"timestamp is not correct")
 ; Clear the whole thing out again
 ; Delete data for the first patient
 D DEL^VPRJOB("ZZUT;3")
 D ASSERT(0,$D(^VPRJOB(5)),"Data for Sequential Counter 5 does exist and should not")
 D ASSERT(0,$D(^VPRJOB(6)),"Data for Sequential Counter 6 does exist and should not")
 D ASSERT(10,$D(^VPRJOB(7)),"Data for Sequential Counter 7 does not exist and should")
 D ASSERT(10,$D(^VPRJOB(8)),"Data for Sequential Counter 8 does not exist and should")
 ; Delete data for the first patient
 D DEL^VPRJOB("1ZZUT;4")
 D ASSERT(0,$D(^VPRJOB(5)),"Data for Sequential Counter 5 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(6)),"Data for Sequential Counter 6 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(7)),"Data for Sequential Counter 7 does not exist and should not")
 D ASSERT(0,$D(^VPRJOB(8)),"Data for Sequential Counter 8 does not exist and should not")
 Q
 ;
DELETEJPID ;; @TEST REST endpoint to delete all job statuses by JPID
 N ARG,JPID,JPID2,STAMP,TYPE
 K ^VPRJOB
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S JPID2="52833885-af7c-4899-90be-b3a6630b2370"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(1,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"created")
 D JOBSTATG(3,2,JPID2,TYPE,STAMP,"created")
 D JOBSTATG(4,2,JPID2,TYPE,STAMP+1,"created")
 D ASSERT(10,$D(^VPRJOB("A",JPID)),"No jobs exist to test endpoint")
 S ARG("id")=JPID
 D DELETE^VPRJOB(.RESULT,.ARG)
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,1,STAMP,"created")),"jobId 1 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,2,STAMP+1,"created")),"jobId 2 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,3,STAMP,"created")),"jobId 3 for JPID: "_JPID2_" was deleted, and should not have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,4,STAMP+1,"created")),"jobId 4 for JPID: "_JPID2_" was deleted, and should not have been")
 Q
DELETEICN ;; @TEST REST endpoint to delete all job statuses by ICN
 N ARG,JPID,JPID2,STAMP,TYPE
 K ^VPRJOB
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S JPID2="52833885-af7c-4899-90be-b3a6630b2370"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(1,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"created")
 D JOBSTATG(3,2,JPID2,TYPE,STAMP,"created")
 D JOBSTATG(4,2,JPID2,TYPE,STAMP+1,"created")
 D ASSERT(10,$D(^VPRJOB("A",JPID)),"No jobs exist to test endpoint")
 S ARG("id")="1234V4321"
 D DELETE^VPRJOB(.RESULT,.ARG)
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,1,STAMP,"created")),"jobId 1 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,2,STAMP+1,"created")),"jobId 2 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,3,STAMP,"created")),"jobId 3 for JPID: "_JPID2_" was deleted, and should not have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,4,STAMP+1,"created")),"jobId 4 for JPID: "_JPID2_" was deleted, and should not have been")
 Q
DELETEPID ;; @TEST REST endpoint to delete all job statuses by PID
 N ARG,JPID,JPID2,STAMP,TYPE
 K ^VPRJOB
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S JPID2="52833885-af7c-4899-90be-b3a6630b2370"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(1,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"created")
 D JOBSTATG(3,2,JPID2,TYPE,STAMP,"created")
 D JOBSTATG(4,2,JPID2,TYPE,STAMP+1,"created")
 D ASSERT(10,$D(^VPRJOB("A",JPID)),"No jobs exist to test endpoint")
 S ARG("id")="ZZUT;3"
 D DELETE^VPRJOB(.RESULT,.ARG)
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,1,STAMP,"created")),"jobId 1 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,2,STAMP+1,"created")),"jobId 2 for JPID: "_JPID_" was not deleted, and should have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,3,STAMP,"created")),"jobId 3 for JPID: "_JPID2_" was deleted, and should not have been")
 D ASSERT(1,$D(^VPRJOB("A",JPID2,TYPE,2,4,STAMP+1,"created")),"jobId 4 for JPID: "_JPID2_" was deleted, and should not have been")
 Q
 ;
DELJID ;; @TEST REST endpoint to delete a Job by ID
 N ARG,JPID,STAMP,TYPE
 K ^VPRJOB
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(1,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"completed")
 D JOBSTATG(3,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(4,1,JPID,TYPE,STAMP+1,"completed")
 D ASSERT(10,$D(^VPRJOB("A",JPID,TYPE,1)),"No jobs exist to test endpoint")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,1,STAMP,"created")),"jobId 1 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",1,1)),"jobId 1 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,2,STAMP+1,"completed")),"jobId 2 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",2,1)),"jobId 2 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,3,STAMP,"created")),"jobId 3 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",3,1)),"jobId 3 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,4,STAMP+1,"completed")),"jobId 4 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",4,1)),"jobId 4 does not exist, but it should")
 S ARG("jobid")="2"
 D DELJID^VPRJOB(.RESULT,.ARG)
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,1,STAMP,"created")),"jobId 1 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",1,1)),"jobId 1 does not exist, but it should")
 D ASSERT(0,$D(^VPRJOB("A",JPID,TYPE,1,2,STAMP+1,"completed")),"jobId 2 exists, but it shouldn't")
 D ASSERT(0,$D(^VPRJOB("C",2,1)),"jobId 2 exists, but it shouldn't")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,3,STAMP,"created")),"jobId 3 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",3,1)),"jobId 3 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("A",JPID,TYPE,1,4,STAMP+1,"completed")),"jobId 4 does not exist, but it should")
 D ASSERT(1,$D(^VPRJOB("C",4,1)),"jobId 4 does not exist, but it should")
 Q
 ;
GETPIDFIL ;; @TEST retrieve non-completed job status by PID (uses filter)
 N OBJECT,DATA,ARG,U,TYPE,TYPE2,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vital-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"complete")
 D JOBSTATG(3,2,JPID,TYPE2,STAMP,"created")
 D JOBSTATG(3,2,JPID,TYPE2,STAMP+1,"error")
 S ARG("jpid")="ZZUT;3"
 S ARG("filter")="ne(status,complete)"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT(3,$G(OBJECT("items",1,"jobId")),"jobId does not exist")
 D ASSERT(TYPE2,$G(OBJECT("items",1,"type")),"jobType does not exist")
 D ASSERT(JPID,$G(OBJECT("items",1,"jpid")),"jpid does not exist")
 D ASSERT("true",$G(OBJECT("items",1,"payload","test")),"payload attribute doesn't exist")
 D ASSERT(2,$G(OBJECT("items",1,"rootJobId")),"rootJobId does not exist")
 D ASSERT("error",$G(OBJECT("items",1,"status")),"status does not exist")
 D ASSERT(STAMP+1,$G(OBJECT("items",1,"timestamp")),"timestamp does not exist")
 Q
GETPIDFILNEW ;; @TEST retrieve non-completed job status by PID (uses filter) ensure newest object
 N OBJECT,DATA,ARG,U,TYPE,TYPE2,JPID,STAMP,HTTPERR
 K ^VPRJOB
 S U="^"
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S STAMP=201412180711200
 D JOBSTATG(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG(2,1,JPID,TYPE,STAMP+1,"error")
 D JOBSTATG(3,2,JPID,TYPE,STAMP+4,"created")
 D JOBSTATG(3,2,JPID,TYPE,STAMP+5,"complete")
 S ARG("jpid")="ZZUT;3"
 S ARG("filter")="ne(status,complete)"
 D GET^VPRJOB(.DATA,.ARG)
 D DECODE^VPRJSON("DATA","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(10,$D(OBJECT),"No return from GET^VPRJOB and there sould be")
 D ASSERT("Nothing to return!",$G(OBJECT("message")),"No Jobs should be returned and there are")
 Q
