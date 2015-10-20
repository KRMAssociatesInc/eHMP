HMPDJ04E ;SLC/MKB -- EDIS ;6/25/12  16:11
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 11
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; All tags expect DFN, ID, [HMPSTART, HMPSTOP, HMPMAX, HMPTEXT]
 ;
 ;
EDP1(ID) ; -- ED visit
 N DA,EDP,X0,VST,FAC,LOC,LOC0,X,I,ICD
 S DA=+$O(^EDP(230,"V",+$G(ID),0)) Q:DA<1
 S EDP=$G(^EDP(230,DA,0)),X0=$G(^AUPNVSIT(ID,0))
 ;
 S VST("localId")=ID,VST("uid")=$$SETUID^HMPUTILS("visit",DFN,ID)
 S VST("dateTime")=$$JSONDT^HMPUTILS(+X0)
 S:$P(EDP,U,8) VST("stay","arrivalDateTime")=$$JSONDT^HMPUTILS($P(EDP,U,8))
 S:$P(EDP,U,9) VST("stay","dischargeDateTime")=$$JSONDT^HMPUTILS($P(EDP,U,9))
 S FAC=+$P(EDP,U,2),LOC=+$P(EDP,U,14),LOC0=$S(LOC:$G(^SC(LOC,0)),1:"")
 S:FAC X=$$STA^XUAF4(FAC)_U_$P($$NS^XUAF4(FAC),U)
 S:'FAC X=$$FAC^HMPD(LOC) D FACILITY^HMPUTILS(X,"VST")
 S VST("categoryCode")="urn:va:encounter-category:OV"
 S VST("categoryName")="Outpatient Visit"
 S VST("patientClassCode")="urn:va:patient-class:EMER"
 S VST("patientClassName")="Emergency"
 ;
 S X=$$CPT^HMPDJ04(ID) S:X VST("typeName")=$P($$CPT^ICPTCOD(X),U,3)
 I 'X S VST("typeName")=$S(LOC:$P(LOC0,U)_" VISIT",1:"EMERGENCY")
 S X=$P(X0,U,8) S:X AMIS=$$AMIS^HMPDVSIT(X) I LOC D
 . I 'X S AMIS=$$AMIS^HMPDVSIT($P(LOC0,U,7))
 . S VST("locationUid")=$$SETUID^HMPUTILS("location",,+LOC)
 . S VST("locationName")=$P(LOC0,U)
 . S X=$$SERV^HMPDVSIT($P(LOC0,U,20)) Q:X=""
 . S:$L(X) VST("service")=X,VST("summary")="${"_VST("service")_"}:"_$P(LOC0,U)
 S:$G(AMIS) VST("stopCodeUid")="urn:va:stop-code:"_$P(AMIS,U),VST("stopCodeName")=$P(AMIS,U,2)
 ; X=$$POV^HMPDJ04(ID) S:$L(X) VST("reasonUid")=$$SETNCS^HMPUTILS("icd",$P(X,U)),VST("reasonName")=$P(X,U,2)
 ;
 S VST("reasonName")=$P($G(^EDP(230,+DA,1)),U)
 S I=0 F  S I=$O(^EDP(230,+DA,4,I)) Q:I<1  I $P($G(^(I,0)),U,3) D  ;primary Dx
 . S X=$G(^EDP(230,+DA,4,I,0)),VST("reasonName")=$P(X,U) Q:'$P(X,U,2)
 . S ICD=$$ICD^HMPDVSIT($P(X,U,2)) Q:$L(ICD)'>1
 . S VST("reasonUid")=$$SETNCS^HMPUTILS("icd",$P(ICD,U)),VST("reasonName")=$P(ICD,U,2)
 ;
 ; provider(s)
 S EDP=$G(^EDP(230,DA,3)),I=0
 I $P(EDP,U,5) S I=I+1 D PROV("VST",I,+$P(EDP,U,5),"P",1) ;primary/MD
 I $P(EDP,U,6) S I=I+1 D PROV("VST",I,+$P(EDP,U,6),"N")   ;nurse
 I $P(EDP,U,7) S I=I+1 D PROV("VST",I,+$P(EDP,U,7),"R")   ;resident
 S:$L($P(EDP,U,8)) VST("comment")=$P(EDP,U,8)
 S:$P(EDP,U,2) VST("appointmentStatus")=$$NAME(+$P(EDP,U,2))
 ;
 ; note(s)
 ; TIU^HMPDJ04A(ID,.VST)
 K ^TMP("PXKENC",$J,ID)
 S VST("lastUpdateTime")=$$EN^HMPSTMP("visit") ;RHL 20150102
 S VST("stampTime")=VST("lastUpdateTime") ; RHL 20150102
 ;US6734 - pre-compile metastamp
 I $G(HMPMETA)=1 D ADD^HMPMETA("visit",VST("uid"),VST("stampTime")) Q  ;US6734
 D ADD^HMPDJ("VST","visit")
 Q
 ;
PROV(ARR,I,IEN,ROLE,PRIM) ; -- add providers
 S @ARR@("providers",I,"providerUid")=$$SETUID^HMPUTILS("user",,+IEN)
 S @ARR@("providers",I,"providerName")=$P($G(^VA(200,+IEN,0)),U)
 S @ARR@("providers",I,"role")=ROLE
 S:$G(PRIM) @ARR@("providers",I,"primary")="true"
 Q
 ;
NAME(X) ; -- name of a code in #233.1
 N Y S Y=$P($G(^EDPB(233.1,+$G(X),0)),U,2)
 Q Y
