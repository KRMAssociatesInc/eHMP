VPRJTSYNCOD ;KRM/CJE -- Unit Tests for SET Operational Sync Status
 ;;1.0;JSON DATA STORE;;Dec 16, 2014
 ; No Entry from top
 Q
 ; Endpoints tested
 ; POST/PUT statusod{id} SETOD^VPRSTATUS
 ; GET statusod/{id} GETOD^VPRSTATUS
 ; DELETE statusod/{id} DELOD^VPRJSTATUS
 ; DELETE statusod/clear DELOD^VPRJSTATUS
STARTUP  ; Run once before all tests
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT") 
 K ^TMP("HTTPERR",$J)
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
SYNCSTAT(RETURN,SITE) ; Sync status for a site
 S RETURN(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { """_SITE_""": { ""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:"_SITE_":1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:"_SITE_":1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:"_SITE_":1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:"_SITE_":1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 Q
SETNSITE ;; @TEST Error code is set if no site
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null Site
 D SYNCSTAT(.BODY,"")
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(227,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 227 error should exist")
 ; Non-existant Site
 K BODY,ARG,RETURN
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"")
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(227,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 227 error should exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 Q
SETNSRCST ;; @TEST Error code is set if no source stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null source stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": """",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K RETURN,ARG,BODY
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Non-existant source stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K RETURN,ARG,BODY
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 Q
SETNDOMST ;; @TEST Error code is set if no domain stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null domain stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": """",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Non-existant domain stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": ""20141031094926"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 Q
SETNITMST ;; @TEST Error code is set if no item stampTime
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null item stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""stampTime"": """" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Non-existant item stampTime
 S BODY(1)=" { ""stampTime"": ""20141031094920"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094921"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094923"" }, ""urn:va:allergy:ZZUT:1002"": { ""stampTime"": ""20141031094924"" } } },""vitals"": { ""domain"": ""vitals"",""stampTime"": ""20141031094925"",""itemMetaStamp"": { ""urn:va:vitals:ZZUT:1001"": { ""something"":""test"" },""urn:va:vitals:ZZUT:1002"": { ""stampTime"": ""20141031094927"" } } } } }"
 S ARG("id")=""
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"An Operational Sync Status exists and there should not be")
 D ASSERT(400,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 400 should exist")
 D ASSERT(228,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 228 error should exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 Q
SETONE ;; @TEST SET one site operational Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 ; Cleanup Vars
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Run single test again with 1ZZUT
 D SYNCSTAT(.BODY,"1ZZUT")
 S ARG("id")="1ZZUT"
 S ARG("detailed")="true"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("1ZZUT",20141031094921)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 Q
SETTWO ;; @TEST SET two site Operational Data Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 ; ZZUT
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921))#10,"Source ZZUT metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist (ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist (ZZUT)")
 ; 1ZZUT
 D SYNCSTAT(.BODY,"1ZZUT")
 S ARG("id")="1ZZUT"
 S ARG("detailed")="true"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("1ZZUT",20141031094921)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921))#10,"Source 1ZZUT metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist (1ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist (1ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist (1ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist (1ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist (1ZZUT)")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist (1ZZUT)")
 Q
GETNSITE ;; @TEST Error code is set if no site data
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null Site
 S ARG("id")=""
 D GETOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"A Operational Data Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(229,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 229 error should exist")
 ; Non-existant Site
 K ARG,BODY
 K ^TMP("HTTPERR",$J)
 D GETOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"A Operational Data Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(229,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 229 error should exist")
 Q
GETBJSONE ;;  Error code is set if JSON can't be encoded
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Null Site
 S ARG("id")=""
 D GETOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"A Operational Data Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(211,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 211 error should exist")
 ; Non-existant Site
 D SYNCSTAT(.BODY,"")
 S ARG("id")=""
 D GETOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"A Operational Data Sync Status exists and there should not be")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"An HTTP 404 should exist")
 D ASSERT(211,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 211 error should exist")
 Q
BLANK ; basic sync status
 K ^VPRSTATUSOD
 S ^VPRSTATUSOD("ZZUT",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920)=""
 Q
 ;
BLANK2 ; basic sync status
 K ^VPRSTATUSOD
 S ^VPRSTATUSOD("ZZUT",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy",20141031094933)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1001",20141031094931)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1002",20141031094931)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals",20141031094933)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1001",20141031094932)=""
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1002",20141031094932)=""
 Q
 ;
BLANK2DIFF ; basic sync status
 K ^VPRSTATUSOD
 S ^VPRSTATUSOD("ZZUT",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920)=""
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"allergy",20141031094933)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"allergy","urn:va:allergy:1ZZUT:1001",20141031094931)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"allergy","urn:va:allergy:1ZZUT:1002",20141031094931)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"vitals",20141031094933)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"vitals","urn:va:vitals:1ZZUT:1001",20141031094932)=""
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"vitals","urn:va:vitals:1ZZUT:1002",20141031094932)=""
 Q
 ;
GETINITIAL ;; @TEST Get Initial Operational Data Sync Status
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; Ensure that the JSON matches what we expect
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; ensure all elements of inProgress exist
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","stampTime")),"source stampTime doesn't exist")
 ; ensure allergy domain and Item stamps exist correctly
 D ASSERT("allergy",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","domain")),"allergy domain doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stampTime")),"Allergy ZZUT:1001 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 shouldn't be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stampTime")),"Allergy ZZUT:1002 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 shouldn't be stored")
 ; ensure vitals domain and Item stamps exist correctly
 D ASSERT("vitals",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","domain")),"vitals domain doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stampTime")),"Vital ZZUT:1001 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 shouldn't be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stampTime")),"Vital ZZUT:1002 stampTime doesn't exist")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 shouldn't be stored")
 Q
GETLASTVITAL ;; @TEST Get Operational Data Sync Status - Last Vital Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 ; Last Vital should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 Q
GETLASTALLERGY ;; @TEST Get Operational Data Sync Status - Last Allergy Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
  ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should not be stored")
 ; Last Allergy should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored")
 Q
GETLASTALLERGYVITAL;; @TEST Get Operational Data Sync Status - Last Vital & Allergy Stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 ; Last Allergy & Vital should be stored
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 Q
GETALLERGY ;; @TEST Get Operational Data Sync Status - Both Allergies Stored. Test complete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should not be stored")
 Q
GETVITAL ;; @TEST Get Operational Data Sync Status - Both Vitals Stored. Test complete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be in progress
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not inProgress")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not inProgress")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 Q
GETBOTH ;; @TEST Get Operational Data Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be completed
 D ASSERT(0,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(10,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 Q
GET2SAMESOURCE ;; @TEST Get Operational Data Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set for 2 metaStamps for the same source
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK2
 ; Setup to make sure the old object doesn't appear
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should not be stored")
 ; Setup to make sure the new object completes
 K ARG,DATA,OBJECT,ERR
 ; Set complete flags - allergy uses incorrect times
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1001",20141031094932,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1002",20141031094932,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1001",20141031094932,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1002",20141031094932,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 ; Setup to make sure the new object completes
 K ARG,DATA,OBJECT,ERR
 ; Set complete flags - allergy uses correct times
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1001",20141031094932,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"vitals","urn:va:vitals:ZZUT:1002",20141031094932,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1001",20141031094931,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094930,"allergy","urn:va:allergy:ZZUT:1002",20141031094931,"stored")=1
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 D ASSERT(0,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(10,$D(OBJECT("completedStamp")),"Sync status is completed")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored")
 Q
GET2DIFFSOURCE ;; @TEST Get Operational Data Sync Status - Allergy and Vitals Stored. Test SyncComplete flag being set for 2 metaStamps for different sources
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BLANK2DIFF
 ; ZZUT
 ; Setup to make sure both objects are inProgress
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is completed")
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","ZZUT")),"Source ZZUT should exist")
 ; Allergy domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should not be stored")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should not be stored")
 ; 1ZZUT
 K DATA,ARG,OBJECT,ERR
 ; Setup to make sure both objects are inProgress
 S ARG("id")="1ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is completed")
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","1ZZUT")),"Source 1ZZUT should exist")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1001","stored")),"Allergy 1ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1002","stored")),"Allergy 1ZZUT:1002 should not be stored")
 ; Vitals domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1001","stored")),"Vital 1ZZUT:1001 should not be stored")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1002","stored")),"Vital 1ZZUT:1002 should not be stored")
 ; Setup to make sure one source is complete
 ; Set complete flags
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"vitals","urn:va:vitals:ZZUT:1002",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1001",20141031094920,"stored")=1
 S ^VPRSTATUSOD("ZZUT",20141031094920,"allergy","urn:va:allergy:ZZUT:1002",20141031094920,"stored")=1
 ; ZZUT
 K ARG,DATA,OBJECT,ERR
 ; Setup to make sure both objects are inProgress
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","ZZUT")),"Source ZZUT should exist and be complete (ZZUT)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (ZZUT)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should be stored (ZZUT)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored (ZZUT)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete (ZZUT)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored (ZZUT)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored (ZZUT)")
 ; 1ZZUT
 K ARG,DATA,OBJECT,ERR
 ; Setup to make sure both objects are inProgress
 S ARG("id")="1ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; Source should exist
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","1ZZUT")),"Source 1ZZUT should exist and not be complete (1ZZUT)")
 ; Allergy domain should be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should not be complete (1ZZUT)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1001","stored")),"Allergy 1ZZUT:1001 should not be stored (1ZZUT)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1002","stored")),"Allergy 1ZZUT:1002 should not be stored (1ZZUT)")
 ; Vitals domain should not be complete
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete (1ZZUT)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1001","stored")),"Vital 1ZZUT:1001 should not be stored (1ZZUT)")
 D ASSERT("",$G(OBJECT("inProgress","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1002","stored")),"Vital 1ZZUT:1002 should not be stored (1ZZUT)")
 ; Setup to make sure both sources are complete
 ; Set complete flags 1ZZUT
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"vitals","urn:va:vitals:1ZZUT:1001",20141031094932,"stored")=1
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"vitals","urn:va:vitals:1ZZUT:1002",20141031094932,"stored")=1
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"allergy","urn:va:allergy:1ZZUT:1001",20141031094931,"stored")=1
 S ^VPRSTATUSOD("1ZZUT",20141031094930,"allergy","urn:va:allergy:1ZZUT:1002",20141031094931,"stored")=1
 ; ZZUT
 K ARG,DATA,OBJECT,ERR
 S ARG("id")="ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should now be completed
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","ZZUT")),"Source ZZUT should exist and be complete (All)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1001","stored")),"Allergy ZZUT:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:ZZUT:1002","stored")),"Allergy ZZUT:1002 should be stored (All)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1001","stored")),"Vital ZZUT:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:ZZUT:1002","stored")),"Vital ZZUT:1002 should be stored (All)")
 ; 1ZZUT
 K ARG,DATA,OBJECT,ERR
 ; Setup to make sure both objects are inProgress
 S ARG("id")="1ZZUT"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; Source should exist
 D ASSERT(10,$D(OBJECT("completedStamp","sourceMetaStamp","1ZZUT")),"Source 1ZZUT should exist and be complete (All)")
 ; Allergy domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","syncCompleted")),"allergy domain should be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1001","stored")),"Allergy 1ZZUT:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","allergy","itemMetaStamp","urn:va:allergy:1ZZUT:1002","stored")),"Allergy 1ZZUT:1002 should be stored (All)")
 ; Vitals domain should be complete
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","syncCompleted")),"vitals domain should not be complete (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1001","stored")),"Vital 1ZZUT:1001 should be stored (All)")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","1ZZUT","domainMetaStamp","vitals","itemMetaStamp","urn:va:vitals:1ZZUT:1002","stored")),"Vital 1ZZUT:1002 should be stored (All)")
 Q
DELONE ;; @TEST DELETE one site operational Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Store some data so we can delete it
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 K ARG,BODY,RETURN
 D SYNCSTAT(.BODY,"1ZZUT")
 S ARG("id")="1ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 ; Let's delete one site's sync status
 K ARG,BODY,RETURN
 S ARG("id")="ZZUT"
 D DELOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 ; Ensure 1ZZUT data still exists
 D ASSERT(11,$D(^VPRSTATUSOD("1ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 Q
DELALL ;; @TEST DELETE ALL site operational Sync Status
 N RETURN,BODY,ARG,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^VPRSTATUSOD("1ZZUT")
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 K ARG,BODY,RETURN
 D SYNCSTAT(.BODY,"1ZZUT")
 S ARG("id")="1ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 K ARG,BODY,RETURN
 D DELOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921))#10,"Source metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1001",20141031094923)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"allergy","urn:va:allergy:1ZZUT:1002",20141031094924)),"Item metastamp 'urn:va:allergy:1ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1001",20141031094926)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 D ASSERT(0,$D(^VPRSTATUSOD("1ZZUT",20141031094921,"vitals","urn:va:vitals:1ZZUT:1002",20141031094927)),"Item metastamp 'urn:va:vitals:1ZZUT:1001' doesn't exist")
 Q
SETGET ;; @TEST with realistic data for setting and retrieving an site operational Sync Status
 N DATA,ARG,ERR,OBJECT,RETURN,BODY,HTTPERR
 ; Store the data
 K ^VPRSTATUSOD("DBCA")
 K ^TMP("HTTPERR",$J)
 S BODY(1)="{""stampTime"": ""20141031094920"",""sourceMetaStamp"": {""DCBA"": {""stampTime"": ""20141031094920"",""domainMetaStamp"": {""doc-def"": {""domain"": ""doc-def"",""stampTime"": ""20141031094920"",""itemMetaStamp"": {""urn:va:doc-def:DCBA:1001"": {""stampTime"": ""20141031094920"" },""urn:va:doc-def:DCBA:1002"": {""stampTime"": ""20141031094920"",}}},""pt-select"": {""domain"": ""pt-select"",""stampTime"": ""20141031094920"",""itemMetaStamp"": {""urn:va:pt-select:DCBA:1001"": {""stampTime"": ""20141031094920"",},""urn:va:pt-select:DCBA:1002"": {""stampTime"": ""20141031094920"",}}}}}}}"
 S ARG("id")="DBCA"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("DCBA",20141031094920)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def",20141031094920)),"Domain: doc-def metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def","urn:va:doc-def:DCBA:1001",20141031094920)),"Item metastamp 'urn:va:doc-def:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def","urn:va:doc-def:DCBA:1002",20141031094920)),"Item metastamp 'urn:va:doc-def:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select",20141031094920)),"Domain: pt-select metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select","urn:va:pt-select:DCBA:1001",20141031094920)),"Item metastamp 'urn:va:pt-select:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select","urn:va:pt-select:DCBA:1002",20141031094920)),"Item metastamp 'urn:va:pt-select:DCBA:1001' doesn't exist")
 ; Retrieve the data
 S ARG("id")="DCBA"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","syncCompleted")),"doc-def domain should not be complete")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1001","stored")),"doc-def DCBA:1001 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1002","stored")),"doc-def DCBA:1002 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","syncCompleted")),"pt-select domain should not be complete")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1001","stored")),"pt-select DCBA:1001 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1002","stored")),"pt-select DCBA:1002 should not be stored")
 ; check data is correct
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def")),"doc-def domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1001","stampTime")),"doc-def DCBA:1001 should not be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1002","stampTime")),"doc-def DCBA:1002 should not be stored")
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select")),"pt-select domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1001","stampTime")),"pt-select DCBA:1001 should not be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1002","stampTime")),"pt-select DCBA:1002 should not be stored")
 ; Delete all of the data
 K ARG,BODY,RETURN
 D DELOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 Q
SETGET2 ;; @TEST with realistic data for setting and retrieving an site operational Sync Status with sync complete
 N DATA,ARG,ERR,OBJECT,RETURN,BODY,JSON,RSLT,HTTPERR
 ; Store the data
 K ^VPRSTATUSOD("DBCA")
 K ^TMP("HTTPERR",$J)
 S BODY(1)="{""stampTime"": ""20141031094920"",""sourceMetaStamp"": {""DCBA"": {""stampTime"": ""20141031094920"",""domainMetaStamp"": {""doc-def"": {""domain"": ""doc-def"",""stampTime"": ""20141031094920"",""itemMetaStamp"": {""urn:va:doc-def:DCBA:1001"": {""stampTime"": ""20141031094920"" },""urn:va:doc-def:DCBA:1002"": {""stampTime"": ""20141031094920"",}}},""pt-select"": {""domain"": ""pt-select"",""stampTime"": ""20141031094920"",""itemMetaStamp"": {""urn:va:pt-select:DCBA:1001"": {""stampTime"": ""20141031094920"",},""urn:va:pt-select:DCBA:1002"": {""stampTime"": ""20141031094920"",}}}}}}}"
 S ARG("id")="DBCA"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 D ASSERT(11,$D(^VPRSTATUSOD("DCBA",20141031094920)),"CALL TO SETOD^VPRSTATUS FAILED WITH AN ERROR")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920))#10,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def",20141031094920)),"Domain: doc-def metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def","urn:va:doc-def:DCBA:1001",20141031094920)),"Item metastamp 'urn:va:doc-def:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"doc-def","urn:va:doc-def:DCBA:1002",20141031094920)),"Item metastamp 'urn:va:doc-def:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select",20141031094920)),"Domain: pt-select metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select","urn:va:pt-select:DCBA:1001",20141031094920)),"Item metastamp 'urn:va:pt-select:DCBA:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUSOD("DCBA",20141031094920,"pt-select","urn:va:pt-select:DCBA:1002",20141031094920)),"Item metastamp 'urn:va:pt-select:DCBA:1001' doesn't exist")
 ; Retrieve the data
 S ARG("id")="DCBA"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","syncCompleted")),"doc-def domain should not be complete")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1001","stored")),"doc-def DCBA:1001 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1002","stored")),"doc-def DCBA:1002 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","syncCompleted")),"pt-select domain should not be complete")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1001","stored")),"pt-select DCBA:1001 should not be stored")
 D ASSERT(0,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1002","stored")),"pt-select DCBA:1002 should not be stored")
 ; check data is correct
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def")),"doc-def domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1001","stampTime")),"doc-def DCBA:1001 should not be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1002","stampTime")),"doc-def DCBA:1002 should not be stored")
 D ASSERT(10,$D(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select")),"pt-select domain should not be complete")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1001","stampTime")),"pt-select DCBA:1001 should not be stored")
 D ASSERT(20141031094920,$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1002","stampTime")),"pt-select DCBA:1002 should not be stored")
 ; Store doc-def objects
 S JSON="{""stampTime"":""20141031094920"",""abbreviation"":"""",""displayName"":""MAMMOGRAM FREQUENCY"",""name"":""MAMMOGRAM FREQUENCY"",""statusName"":""ACTIVE"",""statusUid"":""urn:va:doc-status:DCBA:1001"",""typeName"":""OBJECT"",""typeUid"":""urn:va:doc-type:DCBA:0"",""uid"":""urn:va:doc-def:DCBA:1001""}"
 S RSLT=$$SAVE^VPRJDS(JSON)
 K JSON,RSLT
 S JSON="{""stampTime"":""20141031094920"",""abbreviation"":"""",""displayName"":""MAMMOGRAM FREQUENCY"",""name"":""MAMMOGRAM FREQUENCY"",""statusName"":""ACTIVE"",""statusUid"":""urn:va:doc-status:DCBA:1002"",""typeName"":""OBJECT"",""typeUid"":""urn:va:doc-type:DCBA:0"",""uid"":""urn:va:doc-def:DCBA:1002""}"
 S RSLT=$$SAVE^VPRJDS(JSON)
 K JSON
 ; Retrieve the data
 S ARG("id")="DCBA"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(10,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(0,$D(OBJECT("completedStamp")),"Sync status is not completed")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1001","stored")),"Expected item is not stored")
 D ASSERT("true",$G(OBJECT("inProgress","sourceMetaStamp","DCBA","domainMetaStamp","doc-def","itemMetaStamp","urn:va:doc-def:DCBA:1002","stored")),"Expected item is not stored")
 ; Store pt-select objects
 K JSON,OBJECT,ERR,DATA
 S JSON="{""stampTime"":""20141031094920"",""birthDate"": ""20150224"",""familyName"":""ZZTEST"",""fullName"":""ZZTEST,E ONE"",""genderCode"":""urn:va:pat-gender:M"",""genderName"":""Male"",""givenNames"":""E ONE"",""icn"":""1234V4321"",""localId"":1001,""pid"":""DCBA;1001"",""sensitive"":false,""ssn"": ""000000001"",""uid"":""urn:va:pt-select:DCBA:1001""}"
 S RSLT=$$SAVE^VPRJDS(JSON)
 K JSON,RSLT
 S JSON="{""stampTime"":""20141031094920"",""birthDate"": ""20150225"",""familyName"":""ZZTEST"",""fullName"":""ZZTEST,E TWO"",""genderCode"":""urn:va:pat-gender:F"",""genderName"":""Female"",""givenNames"":""E TWO"",""icn"":""2345V5432"",""localId"":1002,""pid"":""DCBA;1002"",""sensitive"":false,""ssn"": ""000000002"",""uid"":""urn:va:pt-select:DCBA:1002""}"
 S RSLT=$$SAVE^VPRJDS(JSON)
 K JSON
 ; Retrieve the data
 S ARG("id")="DCBA"
 S ARG("detailed")="true"
 D GETOD^VPRSTATUS(.DATA,.ARG)
 ; If data is blank force error and quit
 I $D(DATA)=0 D ASSERT(0,1,"Return variable is blank") Q
 D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; this Sync Status should always be inProgress (completed stamp should not appear as it is older)
 D ASSERT(0,$D(OBJECT("inProgress")),"Sync status is not completed")
 D ASSERT(10,$D(OBJECT("completedStamp")),"Sync status is not completed")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1001","stored")),"Expected item is not stored")
 D ASSERT("true",$G(OBJECT("completedStamp","sourceMetaStamp","DCBA","domainMetaStamp","pt-select","itemMetaStamp","urn:va:pt-select:DCBA:1002","stored")),"Expected item is not stored")
 ; Delete all of the data
 K ARG,BODY,RETURN
 D DELOD^VPRSTATUS(.BODY,.ARG)
 D ASSERT(0,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"CALL TO DELOD^VPRSTATUS FAILED WITH AN ERROR")
 K ^VPRJDJ("JSON","urn:va:doc-def:DCBA:1001")
 K ^VPRJD("urn:va:doc-def:DCBA:1001")
 K ^VPRJDJ("JSON","urn:va:doc-def:DCBA:1002")
 K ^VPRJD("urn:va:doc-def:DCBA:1002")
 K ^VPRJDJ("JSON","urn:va:pt-select:DCBA:1001")
 K ^VPRJD("urn:va:pt-select:DCBA:1001")
 K ^VPRJDJ("JSON","urn:va:pt-select:DCBA:1002")
 K ^VPRJD("urn:va:pt-select:DCBA:1002")
 Q
SETERRLCK ;; @TEST Error due locked event (2 second wait)
 N RETURN,BODY,ARG,TIMEOUT,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Temporaraily reset timeout value to a low number so unit tests don't take forever
 S TIMEOUT=^VPRCONFIG("timeout")
 S ^VPRCONFIG("timeout")=1
 ; Setup initial metastamp
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 ; Begin storing a record
 L +^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923):$G(^VPRCONFIG("timeout"),5) E  S ^TMP("ZZUT","LOCK")=1 Q
 S ^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923,"stored")=1
 ; Attempt to store new metastamp while record is still in progress
 J STORE
 H 2
 ; Ensure error codition exists
 D ASSERT("",$G(^TMP("ZZUT","LOCK")),"Record lock not acquired")
 D ASSERT(500,$G(^TMP("HTTPERR",$G(^TMP("ZZUT","STOREJOB")),1,"error","code")),"An HTTP 500 should exist")
 D ASSERT(502,$G(^TMP("HTTPERR",$G(^TMP("ZZUT","STOREJOB")),1,"error","errors",1,"reason")),"A 502 error should exist")
 ; Ensure locks are removed
 L -^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923)
 ; Ensure temp global is cleaned up
 K ^TMP("ZZUT","LOCK")
 K ^TMP("ZZUT","STOREJOB")
 ; Reset timeout value back to what it was
 S ^VPRCONFIG("timeout")=TIMEOUT
 Q
STORE
 S BODY(1)=" { ""stampTime"": ""20141031094922"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094922"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094927"" } } } } } } }"
 S ^TMP("ZZUT","STOREJOB")=$J
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 Q
STAMPMRG ;; @TEST Merge of metaStamps
 N RETURN,BODY,ARG,TIMEOUT,HTTPERR
 K ^VPRSTATUSOD("ZZUT")
 K ^TMP("HTTPERR",$J)
 ; Setup initial metastamp
 D SYNCSTAT(.BODY,"ZZUT")
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 ; Set a stored flag on old data to be overwritten
 S ^VPRSTATUSOD("ZZUT",20141031094921,"allergy","urn:va:allergy:ZZUT:1001",20141031094923,"stored")=1
 ; Set a stored flag on old data not to be overwritten
 S ^VPRSTATUSOD("ZZUT",20141031094921,"vitals","urn:va:vitals:ZZUT:1001",20141031094926,"stored")=1
 ; Attempt to store new metastamp to be merged with old
 S BODY(1)=" { ""stampTime"": ""20141031094922"",""sourceMetaStamp"": { ""ZZUT"": { ""stampTime"": ""20141031094922"",""domainMetaStamp"": { ""allergy"": { ""domain"": ""allergy"",""stampTime"": ""20141031094922"",""itemMetaStamp"": {  ""urn:va:allergy:ZZUT:1001"": { ""stampTime"": ""20141031094927"" } } } } } } }"
 S ARG("id")="ZZUT"
 S RETURN=$$SETOD^VPRSTATUS(.ARG,.BODY)
 ; Ensure metastamp was merged correctly
 D ASSERT(11,$D(^VPRSTATUSOD("ZZUT",20141031094921)),"Old metaStamp was erased")
 D ASSERT(11,$D(^VPRSTATUSOD("ZZUT",20141031094922)),"New metaStamp was not stored")
 ; old items
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:1001",20141031094927)),"New Allergy doesn't exist")
 D ASSERT("",$G(^VPRSTATUSOD("ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:1001",20141031094927,"stored")),"New Allergy shouldn't be stored")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094922,"allergy","urn:va:allergy:ZZUT:1002",20141031094924)),"Old Allergy doesn't exist")
 D ASSERT(11,$D(^VPRSTATUSOD("ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:1001",20141031094926)),"Old Vital doesn't exist")
 D ASSERT(1,$G(^VPRSTATUSOD("ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:1001",20141031094926,"stored")),"Old Vital isn't stored")
 D ASSERT(1,$D(^VPRSTATUSOD("ZZUT",20141031094922,"vitals","urn:va:vitals:ZZUT:1002",20141031094927)),"Old Vital doesn't exist")
 Q
