HMPSR ;SLC/MKB -- Surgery interface
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ; Supported by DBIA #4750
 ;
 ; ---------------- Update Triggers ----------------
 ;
NEW(IEN,DFN,STS) ; -- new surgery request [from SROERR]
 S IEN=+$G(IEN),DFN=+$G(DFN) Q:DFN<1
 D SR^HMPEVNT(DFN,IEN)
 Q
 ;
UPD(IEN,DFN,STS) ; -- updated surgery request [from SROERR0]
 S IEN=+$G(IEN),DFN=+$G(DFN) Q:DFN<1
 D SR^HMPEVNT(DFN,IEN)
 Q
 ;
DEL(IEN,DFN) ; -- delete surgery request [from SROERR]
 S IEN=+$G(IEN),DFN=+$G(DFN) Q:DFN<1
 D SR^HMPEVNT(DFN,IEN,"@")
 Q
