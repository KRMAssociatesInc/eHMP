VPRJTPATID ;KRM/CJE -- Unit Tests for GET/PUT Patient Identifiers and JPID utils
 ;;1.0;JSON DATA STORE;;Dec 16, 2014
 ;
 ; Endpoints tested
 ;GET vpr/jpid/{jpid} PIDS^VPRJPR
 ;PUT vpr/jpid/{jpid} ASSOCIATE^VPRJPR
 ;PUT vpr/jpid ASSOCIATE^VPRJPR
 ;DELETE vpr/jpid/{jpid} DISASSOCIATE^VPRJPR
STARTUP  ; Run once before all tests
 K ^VPRPTJ
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTX("count","patient","patient")=1
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","9E7A;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","C877;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1234V4321")=""
 S ^VPRPTJ("JPID","9E7A;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","C877;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
 ;
PATIDSNICN ; Setup patient identifiers
 S ^VPRPTX("count","patient","patient")=1
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","9E7A;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","C877;3")=""
 S ^VPRPTJ("JPID","9E7A;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","C877;3")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
 ;
NEWJPID ;; @TEST Creating a new JPID
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S JPID=$$JPID^VPRJPR
 D NE^VPRJT("",$G(JPID),"JPID not created")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID)),"JPID existance index not created")
 D ASSERT(1,$G(^VPRPTX("count","patient","patient")),"Patient count index not created")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
IDXJPID ;; @TEST Index a new JPID with one identifier
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S JPID=$$JPID^VPRJPR
 D JPIDIDX^VPRJPR(JPID,"9E7A;3")
 D NE^VPRJT("",$G(JPID),"JPID not created")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID existance index not created")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"Patient identifier forward (JPID -> PID/ICN) index not updated correctly")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"Patient identifier reverse (PID/ICN -> JPID) index not updated correctly")
 D ASSERT(1,$G(^VPRPTX("count","patient","patient")),"Patient count index not created")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
IDXJPID2 ;; @TEST Index a new JPID with two identifiers
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S JPID=$$JPID^VPRJPR
 D JPIDIDX^VPRJPR(JPID,"9E7A;3")
 D JPIDIDX^VPRJPR(JPID,"1234V4321")
 D NE^VPRJT("",$G(JPID),"JPID not created")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID existance index not created")
 D ASSERT(1,$G(^VPRPTX("count","patient","patient")),"Patient count index not created")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"Patient identifier forward (JPID -> PID/ICN) index not updated correctly")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"Patient identifier reverse (PID/ICN -> JPID) index not updated correctly")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"Patient identifier forward (JPID -> PID/ICN) index not updated correctly")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"Patient identifier reverse (PID/ICN -> JPID) index not updated correctly")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DELJPID ;; @TEST Delete one Patient identifier from JPID Index
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 D JPIDDIDX^VPRJPR(JPID,"9E7A;3")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID existance does not exist and should")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","9E7A;3")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(1,$G(^VPRPTX("count","patient","patient")),"Patient count index incorrect")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DELJPID2 ;; @TEST Delete two Patient identifiers from JPID Index
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 D JPIDDIDX^VPRJPR(JPID,"9E7A;3")
 D JPIDDIDX^VPRJPR(JPID,"1234V4321")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID existance index does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","9E7A;3")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","1234v4321")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(1,$G(^VPRPTX("count","patient","patient")),"Patient count index incorrect")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DELJPIDA ;; @TEST Delete all Patient identifiers from JPID Index
 N JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 D JPIDDIDX^VPRJPR(JPID,"9E7A;3")
 D JPIDDIDX^VPRJPR(JPID,"1234V4321")
 D JPIDDIDX^VPRJPR(JPID,"C877;3")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID)),"JPID existance index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","9E7A;3")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","1234v4321")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"C877;3")),"Patient identifier forward (JPID -> PID/ICN index exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","C877;3")),"Patient identifier reverse (PID/ICN -> JPID index exists")
 D ASSERT(0,$G(^VPRPTX("count","patient","patient")),"Patient count index incorrect")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
JPID4PID ;; @TEST Retrieving a JPID for a PID/ICN
 N JPID,GJPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S GJPID="52833885-af7c-4899-90be-b3a6630b2369"
 S JPID=$$JPID4PID^VPRJPR("9E7A;3")
 D ASSERT(GJPID,JPID,"JPIDs do not match (PID1)")
 S JPID=$$JPID4PID^VPRJPR("C877;3")
 D ASSERT(GJPID,JPID,"JPIDs do not match (PID2)")
 S JPID=$$JPID4PID^VPRJPR("1234V4321")
 D ASSERT(GJPID,JPID,"JPIDs do not match (ICN)")
 S JPID=$$JPID4PID^VPRJPR("")
 D ASSERT("",JPID,"JPID found when it shoudn't be")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PID4JPID ;; @TEST Retrieving a list of PIDs for a JPID
 N JPID,PIDS
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 D PID4JPID^VPRJPR(.PIDS,JPID)
 D ASSERT("1234V4321",$G(PIDS(1)),"ICN not found")
 D ASSERT("9E7A;3",$G(PIDS(2)),"9E7A;3 PID not found")
 D ASSERT("C877;3",$G(PIDS(3)),"C877;3 PID not found")
 D ASSERT("",$G(PIDS(4)),"Too many PIDS returned")
 D PID4JPID^VPRJPR(.PIDS,"")
 D ASSERT(0,$D(PIDS),"PIDS array exists")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ICN4JPID ;; @TEST Retrieving an ICN for a JPID
 N JPID,ICN
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ICN=$$ICN4JPID^VPRJPR(JPID)
 D ASSERT("1234V4321",$G(ICN),"ICN not found")
 S ICN=$$ICN4JPID^VPRJPR("")
 D ASSERT("",$G(ICN),"ICN found")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PIDSNJPID ;; @TEST Error code is set if no jpid passed
 N DATA,ARG,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S ARG("jpid")=""
 D PIDS^VPRJPR(.DATA,.ARG)
 D ASSERT(0,$D(DATA),"Return from PIDS^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(222,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 222 reason code should have occurred")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PIDSNFJPID ;; @TEST Error code is set if no jpid found
 N DATA,ARG,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S ARG("jpid")="DOD;1234V4321"
 D PIDS^VPRJPR(.DATA,.ARG)
 D ASSERT(0,$D(DATA),"Return from PIDS^VPRJPR and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 error should have occured")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 224 reason code should have occurred")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PIDSJPID ;; @TEST GET PIDs for a JPID
 N DATA,OBJECT,ARG,ERR,HTTPERR,JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ARG("jpid")=JPID
 D PIDS^VPRJPR(.DATA,.ARG)
 D DECODE^VPRJSON("^TMP($J)","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(1,$D(DATA),"No return from PIDS^VPRJPR and there should be")
 D ASSERT(JPID,$G(OBJECT("jpid")),"JPID doesn't exist")
 D ASSERT("1234V4321",$G(OBJECT("patientIdentifiers",1)),"ICN 1234V4321 does not exit")
 D ASSERT("9E7A;3",$G(OBJECT("patientIdentifiers",2)),"PID 9E7A;3 does not exit")
 D ASSERT("C877;3",$G(OBJECT("patientIdentifiers",3)),"PID C877;3 does not exit")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PIDSPID ;; @TEST GET PIDs for a PID
 N DATA,OBJECT,ARG,ERR,HTTPERR,JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ARG("jpid")="9E7A;3"
 D PIDS^VPRJPR(.DATA,.ARG)
 D DECODE^VPRJSON("^TMP($J)","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(1,$D(DATA),"No return from PIDS^VPRJPR and there should be")
 D ASSERT(JPID,$G(OBJECT("jpid")),"JPID doesn't exist")
 D ASSERT("1234V4321",$G(OBJECT("patientIdentifiers",1)),"ICN 1234V4321 does not exit")
 D ASSERT("9E7A;3",$G(OBJECT("patientIdentifiers",2)),"PID 9E7A;3 does not exit")
 D ASSERT("C877;3",$G(OBJECT("patientIdentifiers",3)),"PID C877;3 does not exit")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
PIDSICN ;; @TEST GET PIDs for an ICN
 N DATA,OBJECT,ARG,ERR,HTTPERR,JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ARG("jpid")="1234V4321"
 D PIDS^VPRJPR(.DATA,.ARG)
 D DECODE^VPRJSON("^TMP($J)","OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 D ASSERT(1,$D(DATA),"No return from PIDS^VPRJPR and there should be")
 D ASSERT(JPID,$G(OBJECT("jpid")),"JPID doesn't exist")
 D ASSERT("1234V4321",$G(OBJECT("patientIdentifiers",1)),"ICN 1234V4321 does not exit")
 D ASSERT("9E7A;3",$G(OBJECT("patientIdentifiers",2)),"PID 9E7A;3 does not exit")
 D ASSERT("C877;3",$G(OBJECT("patientIdentifiers",3)),"PID C877;3 does not exit")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCEJSON ;; @TEST Associate JSON decode error
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""ASDF;123""],""test}"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT("",JPID,"Return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"Error code does not exist")
 D ASSERT(202,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"Error reason does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCEMISMATCH ;; @TEST Associate Mismatch JPID between body and passed argument error
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""ASDF;123""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 S ARG("jpid")="52833885-af7c-4899-90be-b3a6630b2370"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT("",JPID,"Return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"Error code does not exist")
 D ASSERT(205,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"Error reason does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCENOID ;; @TEST Associate no patIdentifiers Object error
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT("",JPID,"Return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"Error code does not exist")
 D ASSERT(211,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"Error reason does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCEASSOCP ;; @TEST Associate JPID with PID already known error
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""9E7A;3""]}"
 D PATIDS
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT("",JPID,"Return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"Error code does not exist")
 D ASSERT(223,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"Error reason does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCEASSOCI ;; @TEST Associate JPID with ICN already known error
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321""]}"
 D PATIDS
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT("",JPID,"Return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"Error code does not exist")
 D ASSERT(223,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"Error reason does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCNPID ;; @TEST Associate PID with new JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""9E7A;3""]}"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCNICN ;; @TEST Associate ICN with new JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321""]}"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCNALL ;; @TEST Associate array of Patient Identifiers with new JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321"",""9E7A;3"",""C877;3"",""DOD;1234V4321""]}"
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"DOD;1234V4321")),"JPID index for DOD;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","DOD;1234V4321")),"PID index for DOD;1234V4321 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCPID ;; @TEST Associate PID with existing JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""DOD;1234V4321""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 D PATIDS
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"DOD;1234V4321")),"JPID index for DOD;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","DOD;1234V4321")),"PID index for DOD;1234V4321 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCICN ;; @TEST Associate ICN with existing JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 D PATIDSNICN
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCBID ;; @TEST Associate a Bad patient identifer with existing JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""000000003""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 D PATIDSNICN
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"A 400 error should have occurred")
 D ASSERT(230,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 230 reason code should have occurred")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"000000003")),"JPID index for 000000003 does not exist")
 D ASSERT("",$G(^VPRPTJ("JPID","000000003")),"PID index for 000000003 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCBID2 ;; @TEST Associate a Bad patient identifer with existing JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""ASDF123"",""112233""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 D PATIDSNICN
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"A 400 error should have occurred")
 D ASSERT(230,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 230 reason code should have occurred")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"ASDF123")),"JPID index for ASDF123 does not exist")
 D ASSERT("",$G(^VPRPTJ("JPID","ASDF123")),"PID index for ASDF123 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCALL ;; @TEST Associate array of Patient Identifiers with existing JPID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321"",""DOD;1234V4321"",""VLER;1234V4321""],""jpid"": ""52833885-af7c-4899-90be-b3a6630b2369""}"
 D PATIDSNICN
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"DOD;1234V4321")),"JPID index for DOD;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","DOD;1234V4321")),"PID index for DOD;1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"VLER;1234V4321")),"JPID index for VLER;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","VLER;1234V4321")),"PID index for VLER;1234V4321 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
ASSOCALLP ;; @TEST Associate array of Patient Identifiers with existing JPID using a PID
 N BODY,ARG,ERR,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 S BODY(1)="{""patientIdentifiers"": [""1234V4321"",""DOD;1234V4321"",""VLER;1234V4321""]}"
 S ARG("jpid")="9E7A;3"
 D PATIDSNICN
 S JPID=$$ASSOCIATE^VPRJPR(.ARG,.BODY)
 D ASSERT(1,$D(JPID),"No return from ASSOCIATE^VPRJPR and there should be")
 D ASSERT(10,$D(^VPRPTJ("JPID")),"JPID index does not exist")
 D ASSERT(11,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"DOD;1234V4321")),"JPID index for DOD;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","DOD;1234V4321")),"PID index for DOD;1234V4321 does not exist")
 D ASSERT(1,$D(^VPRPTJ("JPID",JPID,"VLER;1234V4321")),"JPID index for VLER;1234V4321 does not exist")
 D ASSERT(JPID,$G(^VPRPTJ("JPID","VLER;1234V4321")),"PID index for VLER;1234V4321 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DISAPID
DISAICN
 ; not implemented
 Q
DISAALL ;; @TEST Disassociate JPID (Delete JPID and Patient Data)
 N BODY,ARG,ERR,RETURN,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ARG("jpid")=JPID
 S RETURN=$$DISASSOCIATE^VPRJPR(.BODY,.ARG)
 D ASSERT("",RETURN,"No return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error returned from DISASSOCIATE^VPRJPR")
 D ASSERT(0,$D(^VPRPTJ("JPID")),"JPID index exists")
 D ASSERT(0,$D(^VPRPTJ("JSON")),"Patient data JSON exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DISAALLP ;; @TEST Disassociate JPID (Delete JPID and Patient Data) using PID
 N BODY,ARG,ERR,RETURN,JPID,HTTPERR
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S ARG("jpid")="9E7A;3"
 S RETURN=$$DISASSOCIATE^VPRJPR(.BODY,.ARG)
 D ASSERT("",RETURN,"No return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error returned from DISASSOCIATE^VPRJPR")
 D ASSERT(0,$D(^VPRPTJ("JPID")),"JPID index exists")
 D ASSERT(0,$D(^VPRPTJ("JSON")),"Patient data JSON exists")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID)),"JPID does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"1234V4321")),"JPID index for 1234V4321 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","1234V4321")),"PID index for 1234V4321 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"9E7A;3")),"JPID index for 9E7A;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","9E7A;3")),"PID index for 9E7A;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID",JPID,"C877;3")),"JPID index for C877;3 does not exist")
 D ASSERT(0,$D(^VPRPTJ("JPID","C877;3")),"PID index for C877;3 does not exist")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DISAEJPID ;; @TEST Disassociate No JPID passed error
 N BODY,ARG,ERR,HTTPERR,JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S ARG("jpid")=""
 S JPID=$$DISASSOCIATE^VPRJPR(.BODY,.ARG)
 D ASSERT("",JPID,"No return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(222,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 222 reason code should have occurred")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
DISAEJPIDU ;; @TEST Disassociate JPID Unknown error
 N BODY,ARG,ERR,HTTPERR,JPID
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 D PATIDS
 S ARG("jpid")="52833885-af7c-4899-90be-b3a6630b2370"
 S JPID=$$DISASSOCIATE^VPRJPR(.BODY,.ARG)
 D ASSERT("",JPID,"No return from ASSOCIATE^VPRJPR and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 error should have occured")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"An 224 reason code should have occurred")
 K ^VPRPTJ("JPID")
 K ^VPRPTX("count","patient","patient")
 K ^TMP
 Q
