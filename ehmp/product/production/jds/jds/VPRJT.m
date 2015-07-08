VPRJT ;SLC/KCM -- Unit test driver
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ;with acknowlegements to XTMUNIT, Imitation is the sincerest form of flattery
 ;
1 ; Run one specific test
 D EN("VPRJTPS") ;
 ; D EN("VPRJTQF") ;"VPRJTJE,VPRJTJD,VPRJTQU,VPRJTU")
 Q
ALL ; Run all the tests
 N ZZLINE,ZZNAME,ZZLIST
 S ZZLINE=0,ZZLIST=""
 F  S ZZLINE=ZZLINE+1 S ZZNAME=$T(EACH+ZZLINE) Q:'$L(ZZNAME)  S ZZNAME=$P($P(ZZNAME,";;",2,99)," ") Q:ZZNAME="zzzzz"  D
 . S ZZLIST=ZZLIST_$S($L(ZZLIST):",",1:"")_ZZNAME
 D EN(ZZLIST)
 ;D EN("VPRJTJE,VPRJTJD")
 ;D EN("VPRJTJE,VPRJTJD,VPRJUCU,VPRJTU,VPRJTS,VPRJUCR,VPRJTCF,VPRJTQX,VPRJUCD,VPRJUCV,VPRJTL,VPRJTT,VPRJTR,VPRJTRP,VPRJTDS,VPRJTDR,VPRJTDM")
 ;D EN("VPRJTJE,VPRJTJD,VPRJTCD,VPRJTCV")
 Q
EN(ZZRSET) ; Run tests for set of routines passed in
 N ZZFAILED,ZZROU,ZZPIECE
 F ZZPIECE=1:1:$L(ZZRSET,",") D TEST($P(ZZRSET,",",ZZPIECE))
 W !,$S($G(ZZFAILED):"Tests FAILED",1:"Tests PASSED")
 Q
TEST(ZZROU) ; Run tests in a specific routine
 W !!,">> "_ZZROU,?10,$P($T(@(ZZROU_"^"_ZZROU)),"--",2,99)
 N ZZI,ZZK,ZZX,ZZLABEL,ZZCODE,ZZCMT,ZZSET,ZZTEAR
 S ZZK=$T(@("STARTUP^"_ZZROU)) I $L(ZZK) D @("STARTUP^"_ZZROU)
 ;
 F ZZI=1:1 S ZZX=$T(@("+"_ZZI_"^"_ZZROU)) Q:ZZX=""  D
 . S ZZLABEL=$P(ZZX," "),ZZCODE=$$LTRIM($P(ZZX," ",2,99))
 . I $L(ZZLABEL),($E(ZZCODE,1,2)=";;"),($$UP($E(ZZCODE,1,9))["@TEST") D
 . . S ZZCMT=$E($P(ZZCODE,"@",2,99),5,$L(ZZCODE))
 . . W !,"Testing"_ZZCMT_" ["_ZZLABEL_"^"_ZZROU_"]"
 . . S ZZK=$T(@("SETUP^"_ZZROU)) I $L(ZZK) D @("SETUP^"_ZZROU)
 . . D @(ZZLABEL_"^"_ZZROU) ; run the unit test
 . . S ZZK=$T(@("TEARDOWN^"_ZZROU)) I $L(ZZK) D @("TEARDOWN^"_ZZROU)
 . . ;W ! ZW ; normally comment out except when looking for non-newed variables
 ;
 S ZZK=$T(@("SHUTDOWN^"_ZZROU)) I $L(ZZK) D @("SHUTDOWN^"_ZZROU)
 Q
EQ(EXPECT,ACTUAL,MSG) ;
 I EXPECT=ACTUAL W "." Q
 S ZZFAILED=1
 W:$X>1 ! W "expected: ",EXPECT,"  actual: ",ACTUAL,"  ",$G(MSG),!
 Q
NE(EXPECT,ACTUAL,MSG) ;
 I EXPECT'=ACTUAL W "." Q
 S ZZFAILED=1
 W:$X>1 ! W "not equal failed, value: ",ACTUAL,"  ",$G(MSG),!
 Q
UP(X) ; return uppercase for X
 Q $TR(X,"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ")
 ;
LTRIM(X) ; remove spaces from left side
 N POS F POS=1:1:$L(X) Q:$E(X,POS)'=" "
 Q $E(X,POS,$L(X))
 ;
EACH ; run each test one at a time
 ;;VPRJUJD   -- Unit tests for JSON decoding
 ;;VPRJUJE   -- Unit tests for JSON encoding
 ;;VPRJUREQ  -- Unit tests for HTTP listener request handling
 ;;VPRJURSP  -- Unit tests for HTTP listener response handling
 ;;VPRJURUT  -- Unit tests for HTTP listener utilities
 ;;VPRJUCU   -- Unit tests for common utilities
 ;;VPRJUCV   -- Unit tests for extracting values from objects
 ;;VPRJUCD   -- Unit tests for building meta-data
 ;;VPRJUCD1  -- Unit tests for building templates
 ;;VPRJUCT   -- Unit tests for applying templates
 ;;VPRJUCF   -- Unit tests for filter parameter
 ;;VPRJUCR   -- Unit tests for range parameter parsing
 ;;VPRJUFPS  -- Unit tests for index functions
 ;;VPRJTCF   -- Integration tests for query filters
 ;;VPRJTCT   -- Integration tests for templates
 ;;VPRJTCT1  -- Integration tests for rel/rev templates
 ;;VPRJTDS   -- Integration tests for saving objects to ODC
 ;;VPRJTDR   -- Integration tests for ODS RESTful queries
 ;;VPRJTDR2  -- Integration tests for ODS RESTful templates
 ;;VPRJTDM   -- Integration tests for ODS management tools
 ;;VPRJTPS   -- Integration tests for saving patient objects
 ;;VPRJTPQ   -- Integration tests for query indexes
 ;;VPRJTPR   -- Integration tests for RESTful queries
 ;;VPRJTPR1  -- Integration tests for RESTful paging
 ;;VPRJTPR2  -- Integration tests for RESTful templates
 ;;VPRJTPR3  -- Integration tests for multi-patient RESTful queries
 ;;VPRJTSYST -- Unit tests for GET Patient Sync Status
 ;;VPRJTSYSS -- Unit tests for SET Patient Sync Status
 ;;VPRJTJOB  -- Unit tests for Job Status
 ;;VPRJTPATID -- Unit tests for Patient Indentifiers
 ;;VPRJTSES  -- Unit tests for Session Storage
 ;;VPRJTODM  -- Unit tests for Operational Data Mutable Storage
 ;;VPRJTSYNCOD -- Unit tests for Operational Sync Status
 ;;VPRJTGC   -- Unit tests for Garbage Collection
 ;;zzzzz
 ;;
 N ZZZ S ZZZ=0
 F  S ZZZ=ZZZ+1 Q:$P($P($T(EACH+ZZZ),";;",2,99)," ")="zzzzz"  D EN($P($P($T(EACH+ZZZ),";;",2,99)," ")) ;W ! ZW
 Q
