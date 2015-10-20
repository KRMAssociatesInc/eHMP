HMPPXPR1 ;BL -- Proxy user creation for HMP ;06/23/2014 6:26pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ;This preprocessor is part of the VistAExchange eHMP project
 ;will create the proxy user HMPPROXY,USER1, using the 
 ;$$CREATE^XUSAP utility
 ;
 Q
CREATE  ;CREATE HMP PROXY USER
 K RETURN
 S RETURN=$$CREATE^XUSAP("HMPPROXY,USER","")
 ;Check for success
 I +RETURN>1 W !,"PROXY USER CREATION SUCCESSFUL. USER IEN: "_$P(RETURN,"^",1)
 ;If creation fail print reason if there is a reason
 I +RETURN=0 W !,"PROXY USER CREATION FAIL. REASON: "_$P(RETURN,"^",2)
 I +RETURN<0 W !,"PROXY USER CREATION FAIL. REASON: "_RETURN
 Q 
