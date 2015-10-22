HMPWB1 ; Agilex/EJK - WRITE BACK ACTIVITY;Jun 10, 2015@15:13:03
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 2
 ;Per VA Directive 6402, this routine should not be modified.
 ;
 Q
 ; allergy write back from eHMP-UI to VistA
ALLERGY(RSLT,IEN,DFN,DATA) ;file allergy data
 ; RSLT - result, passed by reference
 ; IEN - zero for new allergy, or IEN for edit
 ; DFN - patient identifier
 ; DATA - array of allergy data. Subscript names are required. 
 ;	("GMRACHT",0)=1 - Chart Marked indicator
 ;	("GMRACHT",1)=3150603.0905 - Date/Time Chart Marked
 ;	("GMRAGNT")="DIGITOXIN^9;PSNDF(50.6," - Allergy and Pointer to Allergen File
 ;	("GMRAOBHX")="o^OBSERVED" - (O)bserved or (H)istorical
 ;	("GMRAORIG")=10000000224 - Pointer to VA DRUG CLASS File (50.605)
 ;	("GMRAORDT")=3150603.0805 - Allergy assessmant date and time. 
 ;	("GMRASEVR")=2 - Severity of Allergy. 1=Mild, 2=Moderate, 3=Severe
 ;	("GMRATYPE")="D^Drug" - Type of Allergen (F)ood or (D)rug
 ;	("GMRANATR")="A^Allergy" - Mechanism of Allergy (A)llergy, (P)harmacologic, (U)nknown.
 ;	("GMRASYMP",0)=2 - Number of Symptoms
 ;	("GMRASYMP",1)="2^ITCHING,WATERING EYES" - IEN and Description of Symptom 1
 ;	("GMRASYMP",2)="133^RASH" - IEN and Description of Symptom 2
 ;
 I $G(DFN)'>0 D MSG^HMPTOOLS("DFN",1) Q
 I '$D(DATA) D MSG^HMPTOOLS("DATA Array",1) Q
 N CMMT,FILTER,GMR0,GMRA,GMRIEN,HMPALRGY,HMPDATA,HMPSITE,I,ORY,REAC,STMPTM,USER,VPRI,X,XWBOS,Y
 ;
 N $ES,$ET,ERRPAT,ERRMSG,D0
 S $ET="D ERRHDLR^HMPDERRH",ERRPAT=DFN
 S ERRMSG="A problem occurred in the allergy domain, routine: "_$T(+0)
 S XWBOS=$$NOW^XLFDT  ; indicate that we're in the RPC broker, prevent interactive calls
 D EDITSAVE^ORWDAL32(.ORY,IEN,DFN,.DATA)  ; update ADVERSE REACTION ASSESSMENT (#120.86)
 ; ejk US3232 if failure to file, send error message as result. 
 I $P(ORY,"^",1)=-1 D MSG^HMPTOOLS("Failure to File",2,"The Allergy did not file correctly.") Q
 ; return value in RSLT
 S RSLT=$NA(^TMP("HMP",$J)) K @RSLT
 S FILTER("id")=D0 ;ien for the entry into the allergy file
 S FILTER("patientId")=DFN ;patient identifier
 S FILTER("domain")="allergy" ;domain name for write back and freshness stream staging
 S FILTER("noHead")=1 ;no header record required.
 D GET^HMPDJ(.RSLT,.FILTER) ;build the JSON array in the ^TMP global
 ;do not need the 'total' node
 K ^TMP("HMP",$J,"total")
 ;return everything else. 
 S RSLT=$NA(^TMP("HMP",$J))
 Q
