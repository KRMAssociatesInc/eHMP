VPRJTSYSS ;KRM/CJE -- Unit Tests for SET Patient Sync Status
 ;;1.0;JSON DATA STORE;;Dec 16, 2014
 ;
STARTUP  ; Run once before all tests
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 K ^VPRPTJ("JPID","ZZUT;3")
 K ^VPRPTJ("JPID","ZZUT1;3")
 K ^VPRPTJ("JPID","1234V4321")
 K ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")
 K ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370")
 D PATIDS
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 K ^VPRPTJ("JPID","ZZUT;3")
 K ^VPRPTJ("JPID","ZZUT1;3")
 K ^VPRPTJ("JPID","1234V4321")
 K ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")
 K ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370")
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","ZZUT;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","ZZUT1;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1234V4321")=""
 S ^VPRPTJ("JPID","ZZUT;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","ZZUT1;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
 ;
BADPATIDS ; Used to test error conditions ICN is a different PID
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","ZZUT;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","ZZUT1;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2370","1234V4321")=""
 S ^VPRPTJ("JPID","ZZUT;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","ZZUT1;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2370"
 Q
 ;
SYNCSTAT(RETURN,PID,ICN) ; Sync status for a site
 N PID2
 S PID2=$TR(PID,";",":")
 S RETURN(1)=" { ""icn"": """_ICN_""",""stampTime"": ""20141031094920"",""sourceMetaStamp"": { """_$P(PID,";",1)_""": { ""pid"": """_PID_""",""localId"": """_$P(PID,";",2)_""",""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:"_PID2_":1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:"_PID2_":1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:"_PID2_":1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:"_PID2_":1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 Q
SYNCSTATNS(RETURN,PID,ICN) ; Sync status for a site No source timestamp
 N PID2
 S PID2=$TR(PID,";",":")
 S RETURN(1)=" { ""icn"": """_ICN_""",""stampTime"": ""20141031094920"",""sourceMetaStamp"": { """_$P(PID,";",1)_""": { ""pid"": """_PID_""",""localId"": """_$P(PID,";",2)_""",""stampTime"": """",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:"_PID2_":1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:"_PID2_":1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:"_PID2_":1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:"_PID2_":1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 Q
SYNCSTATND(RETURN,PID,ICN) ; Sync status for a site No Domain timeStamp
 N PID2
 S PID2=$TR(PID,";",":")
 S RETURN(1)=" { ""icn"": """_ICN_""",""stampTime"": ""20141031094920"",""sourceMetaStamp"": { """_$P(PID,";",1)_""": { ""pid"": """_PID_""",""localId"": """_$P(PID,";",2)_""",""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""eventMetaStamp"": {  ""urn:va:allergy:"_PID2_":1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:"_PID2_":1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:"_PID2_":1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:"_PID2_":1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 Q
SYNCSTATNE(RETURN,PID,ICN) ; Sync status for a site No Event timeStamp
 N PID2
 S PID2=$TR(PID,";",":")
 S RETURN(1)=" { ""icn"": """_ICN_""",""stampTime"": ""20141031094920"",""sourceMetaStamp"": { """_$P(PID,";",1)_""": { ""pid"": """_PID_""",""localId"": """_$P(PID,";",2)_""",""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:"_PID2_":1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:"_PID2_":1002"": { ""stampTime"": """" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:"_PID2_":1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:"_PID2_":1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 Q
ERRORICN ;; @TEST Error code is set if no ICN
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"ZZUT;3","")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(211,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 211 error should exist")
 Q
ERRORPID ;; @TEST Error code is set if no PID
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"","1234v4321")
 S ARG("id")=""
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(227,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 227 error should exist")
 Q
ERRORBPID ;;  Error code is set if BAD PID
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"undefined","undefined")
 S ARG("id")=""
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(211,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 211 error should exist")
 Q
ERRORCONF ;; @TEST Error code is set if ICN and PID conflict
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 ; Set up Bad Patient IDs
 D SHUTDOWN
 D BADPATIDS
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(223,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 223 error should exist")
 ; Reset Patient IDs
 D SHUTDOWN
 D PATIDS
 Q
ERRUNKPID ;; @TEST Error code is set if JPID is unknown
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 ; Kill existing Patient ids and try to set a sync status
 D SHUTDOWN
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 224 error should exist")
 ; Reset Patient IDs
 D SHUTDOWN
 D PATIDS
 Q
SETONE ;; @TEST Set one site Patient Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"CALL TO SET^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1002",20141031094924)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:3:1001",20141031094926)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:3:1002",20141031094927)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist")
 Q
SETTWO ;; @TEST Set two site Patient Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^VPRSTATUS("ZZUT1;3")
 K ^TMP("HTTPERR",$J)
 ; ZZUT
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"CALL TO SET^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921))#10,"Source ZZUT metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1002",20141031094924)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:3:1001",20141031094926)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:3:1002",20141031094927)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist (ZZUT)")
 ; ZZUT1
 D SYNCSTAT(.BODY,"ZZUT1;3","1234V4321")
 S ARG("id")="ZZUT1;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921)),"CALL TO SET^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921))#10,"Source ZZUT1 metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist (ZZUT1)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"allergy","urn:va:allergy:ZZUT1:3:1001",20141031094923)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist (ZZUT1)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"allergy","urn:va:allergy:ZZUT1:3:1002",20141031094924)),"Event metastamp 'urn:va:allergy:ZZUT:3:1001' doesn't exist (ZZUT1)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist (ZZUT1)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"vitals","urn:va:vitals:ZZUT1:3:1001",20141031094926)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist (ZZUT1)")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT1;3","ZZUT1",20141031094921,"vitals","urn:va:vitals:ZZUT1:3:1002",20141031094927)),"Event metastamp 'urn:va:vitals:ZZUT:3:1001' doesn't exist (ZZUT1)")
 Q
SETNOSOURCE ;; @TEST Error with no source stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTATNS(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 Q
SETNODOMAIN ;; @TEST Error with no domain stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTATND(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 Q
SETNOEVENT ;; @TEST Error with no event stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 D SYNCSTATNE(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 Q
SETNONNUM ;; @TEST Error with a non-numeric stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 S BODY(1)=" { ""icn"": ""1234V4321"",""stampTime"": ""ASDF"",""sourceMetaStamp"": { ""ZZUT"": { ""pid"": ""ZZUT;3"",""localId"": ""3"",""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""ASDF"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 Q
SETSUBSEC ;; @TEST Error with a non-numeric stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 S BODY(1)=" { ""icn"": ""1234V4321"",""stampTime"": ""20141031094921"",""sourceMetaStamp"": { ""ZZUT"": { ""pid"": ""ZZUT;3"",""localId"": ""3"",""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""ASDF"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""eventMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927.123"" } } } } }"
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"A Patient Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 Q
SETERRLCK ;; @TEST Error due locked event (2 second wait)
 N RETURN,BODY,ARG,TIMEOUT,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^VPRSTATUS("ZZUT1;3")
 K ^TMP("HTTPERR",$J)
 ; Temporaraily reset timeout value to a low number so unit tests don't take forever
 S TIMEOUT=^VPRCONFIG("timeout")
 S ^VPRCONFIG("timeout")=1
 ; Setup initial metastamp
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 ; Begin storing a record
 L +^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923):$G(^VPRCONFIG("timeout"),5) E  S ^TMP("ZZUT","LOCK")=1 Q
 S ^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923,"stored")=1
 ; Attempt to store new metastamp while record is still in progress
 J STORE
 H 2
 ; Ensure error codition exists
 D ASSERT("",$G(^TMP("ZZUT","LOCK")),"Record lock not acquired")
 D ASSERT(500,$G(^TMP("HTTPERR",$G(^TMP("ZZUT","STOREJOB")),1,"error","code")),"An HTTP 500 should exist")
 D ASSERT(502,$G(^TMP("HTTPERR",$G(^TMP("ZZUT","STOREJOB")),1,"error","errors",1,"reason")),"A 502 error should exist")
 ; Ensure locks are removed
 L -^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923)
 ; Ensure temp global is cleaned up
 K ^TMP("HTTPERR",$J)
 K ^TMP("HTTPERR",^TMP("ZZUT","STOREJOB"))
 K ^TMP("VPRJERR",$J)
 K ^TMP("ZZUT","LOCK")
 K ^TMP("ZZUT","STOREJOB")
 ; Reset timeout value back to what it was
 S ^VPRCONFIG("timeout")=TIMEOUT
 Q
SETFLG
 L +^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923):$G(^VPRCONFIG("timeout"),5) E  S ^TMP("ZZUT","LOCK")=1 Q
 S ^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923,"stored")=1
 Q
STORE
 S BODY(1)=" { ""icn"": ""1234V4321"",""stampTime"": ""20141031094922"",""sourceMetaStamp"": { ""ZZUT"": { ""pid"": ""ZZUT;3"",""localId"": ""3"",""stampTime"": ""20141031094922"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:ZZUT:3:1001"": { ""stampTime"": ""20141031094927"" } } } } } } }"
 S ^TMP("ZZUT","STOREJOB")=$J
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 Q
STAMPMRG ;; @TEST Merge of metaStamps
 N RETURN,BODY,ARG,TIMEOUT,HTTPERR
 K ^VPRSTATUS("ZZUT;3")
 K ^TMP("HTTPERR",$J)
 ; Setup initial metastamp
 D SYNCSTAT(.BODY,"ZZUT;3","1234V4321")
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 ; Set a stored flag on old data to be overwritten
 S ^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094923,"stored")=1
 ; Set a stored flag on old data not to be overwritten
 S ^VPRSTATUS("ZZUT;3","ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:3:1002",20141031094927,"stored")=1
 ; Attempt to store new metastamp to be merged with old
 S BODY(1)=" { ""icn"": ""1234V4321"",""stampTime"": ""20141031094922"",""sourceMetaStamp"": { ""ZZUT"": { ""pid"": ""ZZUT;3"",""localId"": ""3"",""stampTime"": ""20141031094922"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""eventMetaStamp"": {  ""urn:va:allergy:ZZUT:3:1001"": { ""stampTime"": ""20141031094927"" } } } } } } }"
 S ARG("id")="ZZUT;3"
 S RETURN=$$SET^VPRSTATUS(.ARG,.BODY)
 ; Ensure metastamp was merged correctly
 D ASSERT(11,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094921)),"Old metaStamp was erased")
 D ASSERT(11,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922)),"New metaStamp was not stored")
 ; old items
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094927)),"New Allergy doesn't exist")
 D ASSERT("",$G(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:3:1001",20141031094927,"stored")),"New Allergy shouldn't be stored")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:3:1002",20141031094924)),"Old Allergy doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:3:1001",20141031094926)),"Old Vital doesn't exist")
 D ASSERT(11,$D(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:3:1002",20141031094927)),"Old Vital doesn't exist")
 D ASSERT(1,$G(^VPRSTATUS("ZZUT;3","ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:3:1002",20141031094927,"stored")),"Old Vital isn't stored")
 Q
