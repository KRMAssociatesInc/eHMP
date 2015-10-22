VPRJFPS ;SLC/KCM -- Set/Kill Indexes for Medications
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
VALID(MED) ; Return true if required fields for indexing are present
 I '$L($G(MED("facility"))) Q 0
 Q 1
 ;
IACT(MED) ; Return true if active inpatient med
 Q:'$L($G(MED("medStatus"))) 0
 Q:MED("medStatus")'=VPRCONST("SCT_MED_STATUS_ACTIVE") 0
 Q:$G(MED("IMO")) 0 ; inpatient med for outpatient
 Q:$G(MED("medType"))'=VPRCONST("SCT_MED_TYPE_GENERAL") 0
 Q 1
 ;
OACT(MED) ; Return true if active outpatient med
 Q:'$L($G(MED("medStatus"))) 0
 Q:MED("medStatus")'=VPRCONST("SCT_MED_STATUS_ACTIVE") 0
 Q:$G(MED("IMO"))!($G(MED("medType"))=VPRCONST("SCT_MED_TYPE_GENERAL")) 0
 Q 1
 ;
MICRO(LAB) ; Return true if microbiology test
 ;Q:$G(LAB("kind"))="Microbiology" 1  ; can't do this easily -- kind is buried in result
 Q:$E($G(LAB("localId")),1,2)="MI" 1  ; need to change since this is VA-specific
 Q 0
 ;
PATH(LAB) ; Return true if pathology test
 N X S X=$E($G(LAB("localId")),1,2)
 I (X'="CH"),(X'="MI") Q 1            ; temporary work-around -- this is VA-specific
 Q 0
RSLT(LAB) ; Return true if lab result
 I $D(LAB("typeName")) Q 1
 Q 0
ACC(LAB) ; Return true if accession
 I $G(LAB("organizerType"))="accession" Q 1
 Q 0
VS(VITAL) ; Return true if vital sign result
 I $D(VITAL("typeName")) Q 1
 Q 0
CWAD(DOC) ; Return true if CWAD document
 I $G(DOC("uid"))'="" I $P(DOC("uid"),":",3)="allergy" Q 1
 ;
 N C,S
 S C=$G(DOC("documentTypeCode"))
 S S=$G(DOC("status"))
 I ((C="C")!(C="D")!(C="W")),((S="COMPLETED")!(S="AMENDED")) Q 1
 Q 0
PRNTDOCS(DOC) ; Return if the docment does NOT have a child, ensuring this index only contains parent documents
 I $D(DOC("parentUid")) Q 0
 Q 1
CURVISIT(VISIT) ; Return true if checked-in, and not checked-out.
 I $G(VISIT("current"))="true" Q 1
 Q 0
SYNCERR(PT) ; Return true if the patient has sync errors > 0.
 I +$G(PT("syncErrorCount"))>0 Q 1
 Q 0
IO(OBS) ; return true if obs is an I/O - Fortunately, all I/O worthy term names start with INTAKE or OUTPUT
 Q:(OBS("typeName")?1"OUTPUT -".E)!(OBS("typeName")?1"INTAKE -".E) 1
 Q 0
WARDLOC(LOC) ;
 Q:LOC("type")="W" 1
 Q 0
CLINLOC(LOC) ;
 Q:LOC("type")="C" 1
 Q 0
PTLOADNG(STAT) ;
 N RSLT,I S RSLT=0,I="" F  S I=$O(STAT("syncStatusByVistaSystemId",I)) Q:I=""  D
 . I STAT("syncStatusByVistaSystemId",I,"syncComplete")="false" S RSLT=1
 Q RSLT
PTLOADED(STAT) ;
 N CMPLT,INCMPLT,I S CMPLT=0,INCMPLT=0,I="" F  S I=$O(STAT("syncStatusByVistaSystemId",I)) Q:I=""  D
 . I STAT("syncStatusByVistaSystemId",I,"syncComplete")="true" S CMPLT=1 E  S INCMPLT=1
 Q CMPLT&'INCMPLT
PTSYNCSTATUS(STAT) ; return true if syncstatus object has forOperational=false
 Q:STAT("forOperational")="false" 1
 Q 0
TASKPND(TASK) ;
 I $G(TASK("completed"))="true" Q 0
 Q 1
PACT(PROB) ; return true if active problem and not removed
 I $G(PROB("removed"))="true" Q 0
 I $G(PROB("statusCode"))="urn:sct:55561003" Q 1
 Q 0
PIACT(PROB) ; return true if inactive problem and not removed
 I $G(PROB("removed"))="true" Q 0
 I $G(PROB("statusCode"))="urn:sct:73425007" Q 1
 Q 0
PBOTH(PROB) ; return true if either active or inactive problem and not removed
 I $G(PROB("removed"))="true" Q 0
 I $G(PROB("statusCode"))="urn:sct:55561003" Q 1
 I $G(PROB("statusCode"))="urn:sct:73425007" Q 1
 Q 0
PRMVD(PROB) ; return true if removed problem
 I $G(PROB("removed"))="true" Q 1
 Q 0
NOOS(VISIT) ; return true if visit is not Occasion of Service (OOS)
 I $G(VISIT("locationOos"),"false")="true" Q 0
 Q 1
NEWS(ITEM) ; return true to include the item in the news-feed index
 I $P(ITEM("uid"),":",3)="visit",($G(ITEM("locationOos"),"false")="true") Q 0
 Q 1
ALLDOC(OBJ) ; return true to include in the all document index
 I $P(OBJ("uid"),":",3)'="document" Q 1     ; include consult, proc, surgery, imaging
 I $D(OBJ("parentUid")) Q 0                 ; skip child documents
 N C S C=$G(OBJ("documentTypeCode"))
 I (C="RA")!(C="CR")!(C="CP")!(C="SR") Q 0  ; skip imaging,consult,proc,surgery
 Q 1                                        ; include other documents
 ;
