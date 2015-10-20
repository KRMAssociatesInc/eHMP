VPRJTGC ;KRM/CJE -- Test Garbage Collection operations
 ;;1.0;JSON DATA STORE;;Apr 13, 2015
 ; No entry from top
 Q
 ;
 ; Endpoints tested
 ; GET tasks/gc/site/{site}/{type} SITE^VPRJGC
 ; GET tasks/gc/patient/{id} PATIENT^VPRJGC
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
SETUP    ; Run before each test
 K HTTPREQ,HTTPERR,HTTPRSP
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 Q
TEARDOWN ; Run after each test
 K HTTPREQ,HTTPERR,HTTPRSP
 D CLRPT^VPRJTX
 D ODSCLR^VPRJTX
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
MOCKP ; mock patient data (new last)
 N HTTPERR,HTTPREQ
 ; Set variables to be resuable
 S PID="93EF;-7"
 S UID="urn:va:med:93EF:-7:15231"
 S VPRJTPID=$G(^VPRPTJ("JPID",PID))
 ; 1st version of object
 S METASTAMP1=76
 D MOCKSS(PID,UID,METASTAMP1)
 D SETPUT^VPRJTX("/vpr/"_PID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 K HTTPERR,HTTPREQ
 ; 2nd version of object
 S METASTAMP2=77
 D MOCKSS(PID,UID,METASTAMP2)
 D SETPUT^VPRJTX("/vpr/"_PID,"MED6N","VPRJTP02")
 D RESPOND^VPRJRSP
 Q
MOCKSS(PID,UID,STAMP,STORED) ; mock patient sync status
 N SITE,DOMAIN
 S SITE=$P(PID,";",1)
 S DOMAIN=$P(UID,":",3)
 S ^VPRSTATUS(PID,SITE,STAMP)=""
 S ^VPRSTATUS(PID,SITE,STAMP,DOMAIN,STAMP)=""
 S ^VPRSTATUS(PID,SITE,STAMP,DOMAIN,UID,STAMP)=""
 ; Conditional for forcing stored flag
 I $G(STORED) S ^VPRSTATUS(PID,SITE,STAMP,DOMAIN,UID,STAMP,"stored")=1
 Q
MOCKSSD(UID,STAMP,STORED) ; mock operational data sync status
 ; ^VPRSTATUSOD(SITE,SOURCESTAMP,DOMAIN,ITEM,ITEMSTAMP)
 N SITE,DOMAIN
 S SITE=$P(UID,":",4)
 S DOMAIN=$P(UID,":",3)
 S ^VPRSTATUSOD(SITE,STAMP)=""
 S ^VPRSTATUSOD(SITE,STAMP,DOMAIN,STAMP)=""
 S ^VPRSTATUSOD(SITE,STAMP,DOMAIN,UID,STAMP)=""
 ; Conditional for forcing stored flag
 I $G(STORED) S ^VPRSTATUSOD(SITE,STAMP,DOMAIN,UID,STAMP,"stored")=1
 Q
 ;
MOCKP2 ; mock patient data reversed (new first)
 N HTTPERR,HTTPREQ
 ; Set variables to be resuable
 S PID="93EF;-7"
 S UID="urn:va:med:93EF:-7:15231"
 S VPRJTPID=$G(^VPRPTJ("JPID",PID))
 ; 2nd version of object
 S METASTAMP2=77
 D MOCKSS(PID,UID,METASTAMP2)
 D SETPUT^VPRJTX("/vpr/"_PID,"MED6N","VPRJTP02")
 D RESPOND^VPRJRSP
 K HTTPERR,HTTPREQ
 ; 1st version of object
 S METASTAMP1=76
 D SETPUT^VPRJTX("/vpr/"_PID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 Q
MOCKPM ; mock multiple patient data (new last)
 N HTTPERR,HTTPREQ,PID,UID,VPRJTPID
 ; Set variables to be resuable
 D ADDPT^VPRJTX("DEMOG8^VPRJTP01")
 F PID="93EF;-7","93EF;-8" D
 . S UID="urn:va:med:"_PID_":15231"
 . S VPRJTPID=$G(^VPRPTJ("JPID",PID))
 . ; 1st version of object
 . S METASTAMP1=76
 . D MOCKSS(PID,UID,METASTAMP1)
 . I PID["7" D SETPUT^VPRJTX("/vpr/"_PID,"MED6","VPRJTP02")
 . I PID["8" D SETPUT^VPRJTX("/vpr/"_PID,"MED8","VPRJTP02")
 . D RESPOND^VPRJRSP
 . K HTTPERR,HTTPREQ
 . ; 2nd version of object
 . S METASTAMP2=77
 . D MOCKSS(PID,UID,METASTAMP2)
 . I PID["7" D SETPUT^VPRJTX("/vpr/"_PID,"MED6N","VPRJTP02")
 . I PID["8" D SETPUT^VPRJTX("/vpr/"_PID,"MED8N","VPRJTP02")
 . D RESPOND^VPRJRSP
 Q
MOCKPM2 ; mock multiple patient data (new last)
 N HTTPERR,HTTPREQ,PID,UID,VPRJTPID
 ; Set variables to be resuable
 D ADDPT^VPRJTX("DEMOG8^VPRJTP01")
 F PID="93EF;-7","93EF;-8" D
 . S UID="urn:va:med:"_PID_":15231"
 . S VPRJTPID=$G(^VPRPTJ("JPID",PID))
 . ; 2nd version of object
 . S METASTAMP2=77
 . D MOCKSS(PID,UID,METASTAMP2)
 . I PID["7" D SETPUT^VPRJTX("/vpr/"_PID,"MED6N","VPRJTP02")
 . I PID["8" D SETPUT^VPRJTX("/vpr/"_PID,"MED8N","VPRJTP02")
 . D RESPOND^VPRJRSP
 . K HTTPERR,HTTPREQ
 . ; 1st version of object
 . S METASTAMP1=76
 . D MOCKSS(PID,UID,METASTAMP1)
 . I PID["7" D SETPUT^VPRJTX("/vpr/"_PID,"MED6","VPRJTP02")
 . I PID["8" D SETPUT^VPRJTX("/vpr/"_PID,"MED8","VPRJTP02")
 . D RESPOND^VPRJRSP
 Q
MOCKD ; mock operational data
 N HTTPERR,HTTPREQ
 ; Set variables to be resuable
 S SITE="F111"
 S UID="urn:va:test:F111:4"
 ; 1st version of object
 S METASTAMP1=24
 D MOCKSSD(UID,METASTAMP1)
 D SETPUT^VPRJTX("/data","SYS4","VPRJTD01")
 D RESPOND^VPRJRSP
 K HTTPERR,HTTPREQ
 ; 2nd version of object
 S METASTAMP2=25
 D MOCKSSD(UID,METASTAMP2)
 D SETPUT^VPRJTX("/data","SYS4NEW","VPRJTD01")
 D RESPOND^VPRJRSP
 Q
MOCKD2 ; mock operational data (new last)
 N HTTPERR,HTTPREQ
 ; Set variables to be resuable
 S SITE="F111"
 S UID="urn:va:test:F111:4"
 ; 2nd version of object
 S METASTAMP2=25
 D MOCKSSD(UID,METASTAMP2)
 D SETPUT^VPRJTX("/data","SYS4NEW","VPRJTD01")
 D RESPOND^VPRJRSP
 K HTTPERR,HTTPREQ
 ; 1st version of object
 S METASTAMP1=24
 D MOCKSSD(UID,METASTAMP1)
 D SETPUT^VPRJTX("/data","SYS4","VPRJTD01")
 D RESPOND^VPRJRSP
 Q
MOCKDM ; mock multiple operational data
 N HTTPERR,HTTPREQ,UID,SITE
 ; Set variables to be resuable
 F SITE="F111","F112" D
 . S UID="urn:va:test:"_SITE_":4"
 . ; 1st version of object
 . S METASTAMP1=24
 . D MOCKSSD(UID,METASTAMP1)
 . I SITE="F111" D SETPUT^VPRJTX("/data","SYS4","VPRJTD01")
 . I SITE="F112" D SETPUT^VPRJTX("/data","SYS5","VPRJTD01")
 . D RESPOND^VPRJRSP
 . K HTTPERR,HTTPREQ
 . ; 2nd version of object
 . S METASTAMP2=25
 . D MOCKSSD(UID,METASTAMP2)
 . I SITE="F111" D SETPUT^VPRJTX("/data","SYS4NEW","VPRJTD01")
 . I SITE="F112" D SETPUT^VPRJTX("/data","SYS5NEW","VPRJTD01")
 . D RESPOND^VPRJRSP
 Q
MOCKDM2 ; mock multiple operational data (new last)
 N HTTPERR,HTTPREQ,UID,SITE
 ; Set variables to be resuable
 F SITE="F111","F112" D
 . S UID="urn:va:test:"_SITE_":4"
 . ; 2nd version of object
 . S METASTAMP2=25
 . D MOCKSSD(UID,METASTAMP2)
 . I SITE="F111" D SETPUT^VPRJTX("/data","SYS4NEW","VPRJTD01")
 . I SITE="F112" D SETPUT^VPRJTX("/data","SYS5NEW","VPRJTD01")
 . D RESPOND^VPRJRSP
 . K HTTPERR,HTTPREQ
 . ; 1st version of object
 . S METASTAMP1=24
 . D MOCKSSD(UID,METASTAMP1)
 . I SITE="F111" D SETPUT^VPRJTX("/data","SYS4","VPRJTD01")
 . I SITE="F112" D SETPUT^VPRJTX("/data","SYS5","VPRJTD01")
 . D RESPOND^VPRJRSP
 Q
PATDATA ;; @TEST Ensure previous versions of patient data are garbage collected
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N PID,UID,VPRJTPID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKP
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/patient/"_PID)
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 ; Ensure previous version of object is gone
 D ASSERT(0,$D(^VPRPT(PID,UID,METASTAMP1)),"Previous medication ARRAY version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRPT(PID,UID,METASTAMP2)),"Current medication ARRAY version not found and it should be found")
 ; Ensure previous version of JSON string is gone
 D ASSERT(0,$D(^VPRPTJ("JSON",PID,UID,METASTAMP1)),"Previous medication JSON version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRPTJ("JSON",PID,UID,METASTAMP2)),"Current medication JSON version not found and it should be found")
 ; Ensure previous version of the KEY is gone
 D ASSERT(0,$D(^VPRPTJ("KEY",UID,PID,METASTAMP1)),"Previous medication KEY version found and it shouldn't be found")
 D ASSERT(1,$D(^VPRPTJ("KEY",UID,PID,METASTAMP2)),"Current medication KEY version not found and it should be found")
 ; Ensure previous version of the TEMPLATE is gone
 D ASSERT(1,$G(^VPRPTJ("TEMPLATE",PID,UID,"dose",1))["""dose"":""70 MG""","Current medication TEMPLATE version not found and it should be found")
 Q
PATDATA2 ;; @TEST Ensure previous versions of patient data are garbage collected (order reversed - new stored first)
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N PID,UID,VPRJTPID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKP2
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/patient/"_PID)
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 ; Ensure previous version of object is gone
 D ASSERT(0,$D(^VPRPT(PID,UID,METASTAMP1)),"Previous medication ARRAY version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRPT(PID,UID,METASTAMP2)),"Current medication ARRAY version not found and it should be found")
 ; Ensure previous version of JSON string is gone
 D ASSERT(0,$D(^VPRPTJ("JSON",PID,UID,METASTAMP1)),"Previous medication JSON version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRPTJ("JSON",PID,UID,METASTAMP2)),"Current medication JSON version not found and it should be found")
 ; Ensure previous version of the KEY is gone
 D ASSERT(0,$D(^VPRPTJ("KEY",UID,PID,METASTAMP1)),"Previous medication KEY version found and it shouldn't be found")
 D ASSERT(1,$D(^VPRPTJ("KEY",UID,PID,METASTAMP2)),"Current medication KEY version not found and it should be found")
 ; Ensure previous version of the TEMPLATE is gone
 D ASSERT(1,$G(^VPRPTJ("TEMPLATE",PID,UID,"dose",1))["""dose"":""70 MG""","Current medication TEMPLATE version not found and it should be found")
 Q
PATDATAll ;; @TEST Ensure previous versions of patient data are garbage collected (All Patients)
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N PID,UID,VPRJTPID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKPM
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/patient")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 F PID="93EF;-7","93EF;-8" D
 . S PID2=$TR(PID,";",":")
 . S UID="urn:va:med:"_PID2_":15231"
 . ; Ensure previous version of object is gone
 . D ASSERT(0,$D(^VPRPT(PID,UID,METASTAMP1)),"Previous medication ARRAY version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRPT(PID,UID,METASTAMP2)),"Current medication ARRAY version not found and it should be found")
 . ; Ensure previous version of JSON string is gone
 . D ASSERT(0,$D(^VPRPTJ("JSON",PID,UID,METASTAMP1)),"Previous medication JSON version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRPTJ("JSON",PID,UID,METASTAMP2)),"Current medication JSON version not found and it should be found")
 . ; Ensure previous version of the KEY is gone
 . D ASSERT(0,$D(^VPRPTJ("KEY",UID,PID,METASTAMP1)),"Previous medication KEY version found and it shouldn't be found")
 . D ASSERT(1,$D(^VPRPTJ("KEY",UID,PID,METASTAMP2)),"Current medication KEY version not found and it should be found")
 . ; Ensure previous version of the TEMPLATE is gone
 . D ASSERT(1,$G(^VPRPTJ("TEMPLATE",PID,UID,"dose",1))["""dose"":""70 MG""","Current medication TEMPLATE version not found and it should be found")
 Q
PATDATAll2 ;; @TEST Ensure previous versions of patient data are garbage collected (All Patients, order reversed - new stored first)
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N PID,UID,VPRJTPID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKPM2
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/patient")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 F PID="93EF;-7","93EF;-8" D
 . S PID2=$TR(PID,";",":")
 . S UID="urn:va:med:"_PID2_":15231"
 . ; Ensure previous version of object is gone
 . D ASSERT(0,$D(^VPRPT(PID,UID,METASTAMP1)),"Previous medication ARRAY version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRPT(PID,UID,METASTAMP2)),"Current medication ARRAY version not found and it should be found")
 . ; Ensure previous version of JSON string is gone
 . D ASSERT(0,$D(^VPRPTJ("JSON",PID,UID,METASTAMP1)),"Previous medication JSON version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRPTJ("JSON",PID,UID,METASTAMP2)),"Current medication JSON version not found and it should be found")
 . ; Ensure previous version of the KEY is gone
 . D ASSERT(0,$D(^VPRPTJ("KEY",UID,PID,METASTAMP1)),"Previous medication KEY version found and it shouldn't be found")
 . D ASSERT(1,$D(^VPRPTJ("KEY",UID,PID,METASTAMP2)),"Current medication KEY version not found and it should be found")
 . ; Ensure previous version of the TEMPLATE is gone
 . D ASSERT(1,$G(^VPRPTJ("TEMPLATE",PID,UID,"dose",1))["""dose"":""70 MG""","Current medication TEMPLATE version not found and it should be found")
 Q
OPDATA ;; @TEST  Ensure previous versions of operational data are garbage collected
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N SITE,UID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKD
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/data/"_SITE)
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 ; Ensure previous version of object is gone
 D ASSERT(0,$D(^VPRJD(UID,METASTAMP1)),"Previous test ARRAY version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRJD(UID,METASTAMP2)),"Current test ARRAY version not found and it should be found")
 ; Ensure previous version of JSON string is gone
 D ASSERT(0,$D(^VPRJDJ("JSON",UID,METASTAMP1)),"Previous test JSON version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRJDJ("JSON",UID,METASTAMP2)),"Current test JSON version not found and it should be found")
 ; Ensure previous version of the TEMPLATE is gone
 D ASSERT(1,$G(^VPRJDJ("TEMPLATE",UID,"unit-test-ods-summary",1))["""name"":""omega""","Current test TEMPLATE version not found and it should be found")
 Q
OPDATA2 ;; @TEST Ensure previous versions of operational data are garbage collected (order reversed - new stored first)
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N SITE,UID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKD2
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/data/"_SITE)
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 ; Ensure previous version of object is gone
 D ASSERT(0,$D(^VPRJD(UID,METASTAMP1)),"Previous test ARRAY version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRJD(UID,METASTAMP2)),"Current test ARRAY version not found and it should be found")
 ; Ensure previous version of JSON string is gone
 D ASSERT(0,$D(^VPRJDJ("JSON",UID,METASTAMP1)),"Previous test JSON version found and it shouldn't be found")
 D ASSERT(10,$D(^VPRJDJ("JSON",UID,METASTAMP2)),"Current test JSON version not found and it should be found")
 ; Ensure previous version of the TEMPLATE is gone
 D ASSERT(1,$G(^VPRJDJ("TEMPLATE",UID,"unit-test-ods-summary",1))["""name"":""omega""","Current test TEMPLATE version not found and it should be found")
 Q
OPDATAM ;; @TEST  Ensure previous versions of multipleoperational data are garbage collected
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N SITE,UID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKDM
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/data/")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 F SITE="F111","F112" D
 . S UID="urn:va:test:"_SITE_":4"
 . ; Ensure previous version of object is gone
 . D ASSERT(0,$D(^VPRJD(UID,METASTAMP1)),"Previous test ARRAY version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRJD(UID,METASTAMP2)),"Current test ARRAY version not found and it should be found")
 . ; Ensure previous version of JSON string is gone
 . D ASSERT(0,$D(^VPRJDJ("JSON",UID,METASTAMP1)),"Previous test JSON version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRJDJ("JSON",UID,METASTAMP2)),"Current test JSON version not found and it should be found")
 . ; Ensure previous version of the TEMPLATE is gone
 . D ASSERT(1,$G(^VPRJDJ("TEMPLATE",UID,"unit-test-ods-summary",1))["""name"":""omega""","Current test TEMPLATE version not found and it should be found")
 Q
OPDATA2M ;; @TEST Ensure previous versions of multiple operational data are garbage collected (order reversed - new stored first)
 ; Look at SAVE^VPRJPS to ensure all save actions are covered
 N SITE,UID,METASTAMP1,METASTAMP2
 N HTTPERR,HTTPREQ,HTTPRSP
 ; Stage Mock data
 D MOCKDM2
 ; Run algorithm
 ; Ensure variables from SETPUT are cleared
 K HTTPERR,HTTPREQ,HTTPRSP
 W ! D SETGET^VPRJTX("/tasks/gc/data/")
 D RESPOND^VPRJRSP
 D SENDATA^VPRJRSP
 ; Wait for job to finish
 H 1
 ; Ensure HTTP Request had no errors
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"Error during HTTP rquest")
 F SITE="F111","F112" D
 . S UID="urn:va:test:"_SITE_":4"
 . ; Ensure previous version of object is gone
 . D ASSERT(0,$D(^VPRJD(UID,METASTAMP1)),"Previous test ARRAY version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRJD(UID,METASTAMP2)),"Current test ARRAY version not found and it should be found")
 . ; Ensure previous version of JSON string is gone
 . D ASSERT(0,$D(^VPRJDJ("JSON",UID,METASTAMP1)),"Previous test JSON version found and it shouldn't be found")
 . D ASSERT(10,$D(^VPRJDJ("JSON",UID,METASTAMP2)),"Current test JSON version not found and it should be found")
 . ; Ensure previous version of the TEMPLATE is gone
 . D ASSERT(1,$G(^VPRJDJ("TEMPLATE",UID,"unit-test-ods-summary",1))["""name"":""omega""","Current test TEMPLATE version not found and it should be found")
 Q
