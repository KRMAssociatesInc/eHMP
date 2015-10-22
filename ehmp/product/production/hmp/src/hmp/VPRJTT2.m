VPRJTT2 ;SLC/KCM -- Unit tests for precompile of OPD metastamp
 ;;1.0;JSON DATA STORE;;Sep 01, 2012;Build 11
 ;
STARTUP  ; Run once before all tests
 S HMPDFN="OPD"
 S HMPBATCH="HMPFX~hmp-development-box~"_HMPDFN
 ;Build ^XTMP and ^TMP("HMPMETA")
 D EN^HMPMETA(HMPDFN)
 Q
SHUTDOWN ; Run once after all tests
 K HMPDFN,HMPBATCH
 Q
SETUP    ; Run before each test
 S VALUE=""
 Q
TEARDOWN ; Run after each test
 K VALUE
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
 ;
1 ;; @TEST -- Check that counts on metastamp match XTMP cache
 N MTOTAL,CTOTAL,HMPDMNM,CGLOB,MGLOB
 S CGLOB=$NA(^XTMP(HMPBATCH,0)),MGLOB=$NA(^XTMP(HMPBATCH,0,"META"))
 ;For each domain
 W !,"Checking counts"
 S HMPDMNM="PATIENT"
 F  S HMPDMNM=$O(@MGLOB@(HMPDMNM)) Q:HMPDMNM=""  D
 .N MVAL,CVAL
 .S MVAL=$G(@MGLOB@(HMPDMNM))
 .S CVAL=$G(^XTMP(HMPBATCH,0,"count",$S(HMPDMNM="qo":"quick",1:HMPDMNM)))
 .W !,?5,HMPDMNM,?20,MVAL
 .D ASSERT(CVAL,MVAL)
 Q
 ;
2 ;; @TEST -- Check that all domains are initialized
 N HMPDMNM,CGLOB,MGLOB
 S CGLOB=$NA(^XTMP(HMPBATCH,0)),MGLOB=$NA(^XTMP(HMPBATCH,0,"META"))
 ;For each domain
 W !,"Checking status"
 S HMPDMNM="PATIENT"
 F  S HMPDMNM=$O(@MGLOB@(HMPDMNM)) Q:HMPDMNM=""  D
 .N CSTATUS
 .S CSTATUS=$G(^XTMP(HMPBATCH,0,"status",$S(HMPDMNM="qo":"quick",1:HMPDMNM)))
 .W !,?5,HMPDMNM
 .D ASSERT(CSTATUS,1)
 Q
 ;
3 ;; @TEST -- Check that all XTMP cache domains are in metastamp
 N MTOTAL,CTOTAL,HMPDMNM,CGLOB,MGLOB
 S CGLOB=$NA(^XTMP(HMPBATCH,0,"count")),MGLOB=$NA(^XTMP(HMPBATCH,0,"META"))
 ;For each domain
 W !,"Checking match"
 S HMPDMNM=""
 F  S HMPDMNM=$O(@CGLOB@(HMPDMNM)) Q:HMPDMNM=""  D
 .;Ignore 0 counts - no records found
 .W !,?5,HMPDMNM
 .I +@CGLOB@(HMPDMNM)=0 W ?20," - zero count" Q 
 .D ASSERT(11,$D(@MGLOB@($S(HMPDMNM="quick":"qo",1:HMPDMNM))))
 Q
 ;
