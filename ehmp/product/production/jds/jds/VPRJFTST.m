VPRJFTST ;SLC/KCM -- Test Index Functions
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
NOTORNG(OBJ) ; true if not orange
 I $G(OBJ("color"))="yellow" Q 0
 Q 1
