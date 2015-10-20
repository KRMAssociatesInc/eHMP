HMPWB ;;EJK/AGX - COMMON ENTRY POINT FOR ALL WRITEBACK ACTIVITY; 12/14/2014
 ;;1.0;COMMON ENTRY POINT FOR WRITEBACK FROM JDS TO VISTA;**1**;DEC 11 2014;Build 21
 ; INPUT PARAMETERS
 ;   IEN - existing allergy IEN or 0 if this is a new allergen. 
 ;   DFN - patient identifier
 ;   DATA(list) - array of related data
 ;      domain - used for determining the type of writeback data this is. 
 ;
 Q
 ;
API(RSLT,IEN,DFN,DATA) ; MAIN ENTRY POINT FROM RPC HMP PUT OPERATIONAL DATA
 M ^TMP("ZZHMPWB",$J,"DATA")=DATA
 S ^TMP("ZZHMPWB",$J,"DFN")=$G(DFN)
 S ^TMP("ZZHMPWB",$J,"IEN")=$G(IEN)
 N HMPAPI
 S HMP=$NA(^TMP("HMP",$J)),HMPI=0 K @HMP
 S HMPAPI=$G(DATA("domain"))
 I HMPAPI="allergy" D ALLERGY^HMPWB1(.RSLT,IEN,DFN,.DATA)
 I HMPAPI="demographics" D DEMOG^HMPWB2(.RSLT,IEN,OL,.DATA)
 I HMPAPI="vitals" D VMADD^HMPWB2(.RSLT,IEN,DFN,.DATA)
 I HMPAPI="vitals error" D VMERR^HMPWB2(.RSLT,IEN,DFN,.DATA)
 I HMPAPI="meds" D NVAMED^HMPWB3(.RSLT,IEN,DFN,.DATA)
 Q
