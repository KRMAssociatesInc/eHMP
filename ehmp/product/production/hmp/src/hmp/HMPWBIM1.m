HMPWBIM1 ;;OB/JD/CNP - Write back entry points for Notes, and Encounters;Jul 8, 2015@08:31:16
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 1
 ;Per VA Directive 6402, this routine should not be modified.
 ;
 Q
 ;
IMMUN(RSLT,IEN,DFN,DATA) ; Encounters
 ;
 ;RPC: HMP WRITEBACK ENCOUNTERS
 ;Output
 ; RSLT = JSON format string for encounters
 ;Input
 ; IEN  = record to be updated
 ; DFN  = patient IEN
 ; DATA("domain")="IMMUNIZATION"
 ; DATA("data") - input format - string
 ;   Piece 1: DFN - Patient IEN
 ;   Piece 2: Inpatient flag - 1 = inpatient, 0 = otherwise
 ;   Piece 3: Hospital location IEN
 ;   Piece 4: Visit/episode date
 ;   Piece 5: Service category
 ;   Piece 6: Author/dictator IEN (i.e. Provider)
 ;   Piece 7: Encounter type - A 2- or 3-character string as follows:
 ;               CPT for CPT (^AUPNVCPT; #9000010.18)
 ;               HF      Health Factor (^AUPNVHF; #9000010.23)
 ;               IMM     Immunization (^AUPNVIMM; #9000010.11)
 ;               PED     Patient Education (^AUPNVPED; #9000010.16)
 ;               POV     POV - Purpose of Visit; a.k.a Diagnosis - (^AUPNVPOV; #9000010.07)
 ;               SK      Skin (^AUPNVSK; #9000010.12)
 ;               XAM     Exam (^AUPNVXAM; #9000010.13)
 ;   Piece 8: Encoounter ID - As follows:
 ;               CPT     ^ICPT
 ;               HF      ^AUTTHF
 ;               IMM     ^AUTTIMM
 ;               PED     ^AUTTEDT
 ;               POV     ^ICD9
 ;               SK      ^AUTTSK
 ;               XAM     ^AUTTEXAM
 ;   Piece 9: Encounter result CODE
 ;  Piece 10: Encounter comment number
 ;  Piece 11: Encounter comment text
 ;
 N ERRMSG,JSONERR
 I '$G(DFN) D MSG^HMPTOOLS("DFN",1) Q  ; DFN is required
 N ENC,ENCNM,ENCTL,ENCTYP,ENCGLB,GLB,HMP,HMPA,HMPFCNT,HMPE
 N HMPUID,INFO,NOTE,NOTEIEN,OK,ORLOC,PCELIST,PRVNM,STMPTM
 S INFO=$G(DATA("data"))
 ;Check for required fields
 I '$P(INFO,U) D MSG^HMPTOOLS("DFN",1) Q  ; DFN is required
 I $D(^DPT($P(INFO,U)))'>0 D MSG^HMPTOOLS("DFN",2,$P(INFO,U)) Q  ; Invalid DFN
 I '$P(INFO,U,3) D MSG^HMPTOOLS("Location",1) Q  ; Location is required
 I '$P(INFO,U,4) D MSG^HMPTOOLS("Visit",1) Q  ; Visit is required
 I $L($P(INFO,U,5))=0 D MSG^HMPTOOLS("Service category",1) Q  ; Service category is required
 I $L($P(INFO,U,7))=0 D MSG^HMPTOOLS("Encounter type",1) Q  ; Encounter type is required
 ;
 ;- EJK - U will be set up when they log in through the broker, no need to purposely set it.
 ;
 S U="^"
 S DFN=$P(INFO,U),OK="",NOTEIEN=0,ORLOC=$P(INFO,U,3)
 S ENCTYP=$$UP^XLFSTR($P(INFO,U,7))
 S ENCGLB=$S(ENCTYP="CPT":"^ICPT",ENCTYP="POV":"^ICD9",1:"MORE")
 I ENCGLB="MORE" S ENCGLB=$S(ENCTYP="PED":"^AUTTEDT",ENCTYP="XAM":"^AUTTEXAM",1:"MORE")
 I ENCGLB="MORE" S ENCGLB="^AUTT"_ENCTYP
 I $D(@ENCGLB)'>0 D MSG^HMPTOOLS("Encounter typ",2,ENCTYP) Q  ; Invalid encounter type
 S ENCNM=$P($G(@ENCGLB@($P(INFO,U,8),0)),U)  ; Encounter name
 S PRVNM=$P($G(^VA(200,$P(INFO,U,6),0)),U)   ; Provider name
 ;Prepare the encounter array for the RPC
 S PCELIST(1)="HDR^"_$P(INFO,U,2)_"^^"_$P(INFO,U,3)_";"_$P(INFO,U,4)_";"_$P(INFO,U,5)
 S PCELIST(2)="VST^DT^"_$P(INFO,U,4)
 S PCELIST(3)="VST^PT^"_$P(INFO,U)
 S PCELIST(4)="VST^HL^"_$P(INFO,U,3)
 S PCELIST(5)="VST^VC^"_$P(INFO,U,5)
 S PCELIST(6)="PRV^"_$P(INFO,U,6)_"^^^"_PRVNM_"^1"
 S PCELIST(7)=ENCTYP_"+^"_$P(INFO,U,8)_"^^"_ENCNM_U_$P(INFO,U,9)_U_$P(INFO,U,6)_"^^^0^"
 S PCELIST(7)=PCELIST(7)_$P(INFO,U,10)
 S PCELIST(8)="COM^"_$P(INFO,U,10)_U_$S($P(INFO,U,11)]"":$P(INFO,U,11),1:"@")
 ;Invoke the already existing RPC (ORWPCE1 DQSAVE)
 D DQSAVE^ORWPCE1
 ;
 ;- EJK - There is no gaurantee you will get the correct visit this way. 
 ; D0 will have the visit number when the call comes back from DQSAVE^ORWPCE1
 ;
 S VISIT=$O(^AUPNVSIT("B",$P(INFO,U,4),""))
 I VISIT>0 D
 .K FILTER
 .S FILTER("noHead")=1
 .S FILTER("patientId")=DFN
 .S FILTER("domain")="visit"
 .S FILTER("id")=VISIT
 .D GET^HMPDJ(.HMP,.FILTER)
 .;
 .;- EJK - There can be multiple notes per visit. How do you know this is the right one?
 .; Should all notes related to a visit be sent (meaning you will need a For Loop), or
 .; just the note sent with this visit? The method below gets the first note, not the last
 .; note. 
 .; 
 .; Your test data sends in COMMENT TEXT with a date concatenated to it, but I do not see
 .; it filed anywhere. It is not in the VISIT file and it is not in the 8925 file.
 .;
 .S NOTE=$O(^TIU(8925,"V",VISIT,""))
 .I NOTE>0 D
 ..K FILTER
 ..S FILTER("noHead")=1
 ..S FILTER("patientId")=DFN
 ..S FILTER("domain")="document"
 ..S FILTER("id")=OK
 ..D GET^HMPDJ(.HMP,.FILTER)
 .S GLB="^AUPNV"_ENCTYP
 .S ENC=$O(@GLB@("AD",VISIT,""))
 .I ENC>0 D
 ..; Get the full domain name so it matches the tags in HMPDJ0
 ..S ENCTL=$S(ENCTYP="CPT":"cpt",ENCTYP="HF":"factor",ENCTYP="IMM":"immuniza",1:"MORE")
 ..I ENCTL="MORE" S ENCTL=$S(ENCTYP="PED":"educatio",ENCTYP="POV":"pov",1:"MORE")
 ..I ENCTL="MORE" S ENCTL=$S(ENCTYP="SK":"skin",ENCTYP="XAM":"exam",1:"")
 ..K FILTER
 ..S FILTER("noHead")=1
 ..S FILTER("patientId")=DFN
 ..S FILTER("domain")=ENCTL
 ..S FILTER("id")=ENC
 ..D GET^HMPDJ(.HMP,.FILTER)
 ..;Build Metastamp and Syncstatus
 ..;S HMPFCNT=$G(^TMP("HMPF",$J,"total"))
 ..;S HMPUID=$$SETUID^HMPUTILS(ENCTL,DFN,ENC)
 ..;S HMPE=$G(^TMP("HMP",$J,1,1))
 ..;S STMPTM=$TR($P($P(HMPE,"stampTime",2),","),""":")
 ..;D ADHOC^HMPUTIL2(ENCTL,HMPFCNT,DFN,HMPUID,STMPTM) ; Removed METASTAMP and SYNCSTART /SYNCSTOP
 ..K ^TMP("HMPIMM",$J)
 ..M ^TMP("HMPIMM",$J)=^TMP("HMP",$J)
 ..K ^TMP("HMPIMM",$J,"total")
 ..K RSLT
 ..S RSLT=$NA(^TMP("HMPIMM",$J))
 Q
