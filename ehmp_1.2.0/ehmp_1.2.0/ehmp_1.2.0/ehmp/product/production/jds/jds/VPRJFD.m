VPRJFD ;SLC/KCM -- Set/Kill Indexes for Operational Data
 ;;1.0;JSON DATA STORE;;Jan 25, 2013
 ;
ACT(PERSON) ; Return true if active person
 I $G(PERSON("disuser"),"false")="true" Q 0
 Q 1
