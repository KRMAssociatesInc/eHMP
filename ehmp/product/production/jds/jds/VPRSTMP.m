VPRSTMP ;KRM/CJE -- Utilities for Metastamps ; 02/04/2015
 ;;1.0;JSON DATA STORE;;Dec 10, 2014
 ; No entry from top
 Q
 ;
ISSTMPTM(STAMPTIME) ; Ensure passed stampTime is valid
 I STAMPTIME="" Q 0 ; Null not allowed
 I STAMPTIME["."  Q 0 ; Subsecond stampTime not allowed
 I STAMPTIME'=+STAMPTIME  Q 0 ; stampTime should be numberic
 Q 1
