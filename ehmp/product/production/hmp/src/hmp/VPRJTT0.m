VPRJTT0 ;SLC/PJH -- Unit test driver for US6734
 ;;1.0;JSON DATA STORE;;Sep 01, 2012;Build 11
 ;
 ; **** IMPORTANT - VXSYNC MUST BE STOPPED OTHERWISE CACHE WILL BE CLEARED BEFORE IT CAN BE CHECKED ****
 ;                  ALSO MAKE SURE DUZ(2) IS SET TO DIVISION BY LOGGING INTO ^XUP
 ;
1 ; Run one specific test
 D EN("VPRJTT2")
 Q
ALL ; Run all the tests
 N ZZLINE,ZZNAME,ZZLIST
 S ZZLINE=0,ZZLIST=""
 F  S ZZLINE=ZZLINE+1 S ZZNAME=$T(EACH+ZZLINE) Q:'$L(ZZNAME)  S ZZNAME=$P($P(ZZNAME,";;",2,99)," ") Q:ZZNAME="zzzzz"  D
 . S ZZLIST=ZZLIST_$S($L(ZZLIST):",",1:"")_ZZNAME
 D EN(ZZLIST)
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
 ;;VPRJTT1   -- Unit tests - precompile metastamp for patient
 ;;VPRJTT2   -- Unit tests - precompile metastamp for OPD
 ;;zzzzz
 ;;
 N ZZZ S ZZZ=0
 F  S ZZZ=ZZZ+1 Q:$P($P($T(EACH+ZZZ),";;",2,99)," ")="zzzzz"  D EN($P($P($T(EACH+ZZZ),";;",2,99)," ")) ;W ! ZW
 Q
