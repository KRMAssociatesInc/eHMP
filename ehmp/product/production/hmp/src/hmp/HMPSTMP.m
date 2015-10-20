HMPSTMP ;JD/CNP -- MetaStamp ;12/29/14  16:11
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;; Returns the most recent date/time
 ;
 Q
 ;
EN(A) ;
 N C
 ; A is either "now" or a domain name (per PTDOMS^HMPDJFSD)
 ; B is the return value (stampTime)
 S C=$$UP^XLFSTR(A)
 I C="NOW" G NOW
 I C="ADM" G ADM
 I C="ALLERGY" G ALL
 I C="AUXILIARY" G AUX
 I C="APPOINTMENT" G APP
 I C="DIAGNOSIS" G DIA
 I C="DOCUMENT" G DOC
 I C="FACTOR" G FAC
 I C="IMMUNIZATION" G IMM
 I C="LAB" G LAB
 I C="MED" G MED
 I C="OBS" G OBS
 I C="ORDER" G ORD
 I C="PROBLEM" G PRO
 I C="PROCEDURE" G PRC
 I C="CONSULT" G CON
 I C="IMAGE" G IMA
 I C="SURGERY" G SUR
 I C="TASK" G TAS
 I C="VISIT" G VIS
 I C="VITAL" G VIT
 I C="PTF" G PTF
 I C="EXAM" G EXA
 I C="CPT" G CPT
 I C="EDUCATION" G EDU
 I C="POV" G POV
 I C="SKIN" G SKI
 I C="TREATMENT" G TRE
 I C="MH" G MH
 Q B
NOW ;
 ; Set stamptime in YYYYMMDDHHMMSS format (FMTHL7 will return time zone)
 S B=$P($$FMTHL7^XLFDT($$NOW^XLFDT),"-")
 Q B
ADM ; Admissions (these are visits whose ID starts with an "H").  JD - 1/126/15
 K DATA
 S DATE(1)=$G(ADM("dateTime"))
 S DATE(2)=$G(ADM("stay","dischargeDateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
ALL ; Allergy ; rhl 20141231
 K DATE
 S DATE(1)=$G(REAC("entered"))
 S DATE(2)=$G(REAC("verified"))
 ;  dates in observations array
 N I,J
 S J="",J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(REAC("observations",I)) Q:I=""  D
 . I $G(REAC("observations",I,"date"))]"" S J=J+1,DATE(J)=REAC("observations",I,"date")
 ;  dates in comment array
 N I,J
 S J="",J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(REAC("comments",I)) Q:I=""  D
 . I $G(REAC("comments",I,"entered"))]"" S J=J+1,DATE(J)=REAC("comments",I,"entered")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
AUX ; Auxiliary
 Q ""
 K DATE
 ;S DATE(1)=$G(
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
APP ; Appointment
 K DATE
 S DATE(1)=$G(APPT("dateTime"))
 S DATE(2)=$G(APPT("checkIn"))
 S DATE(3)=$G(APPT("checkOut"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
DIA ; Diagnosis
 Q ""
 K DATE
 ;S DATE(1)=$G(
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
DOC ; Document
 K DATE
 S DATE(1)=$G(DOC("referenceDateTime"))
 S DATE(2)=$G(DOC("entered"))
 ;go through HMPDJ array
 N I,II,J
 S J=""
 S J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(DOC("text",I)) Q:I=""  D
 . I $G(DOC("text",I,"dateTime"))]"" S J=J+1,DATE(J)=DOC("text",I,"dateTime")
 . S II=0 F  S II=$O(DOC("text",I,"clinicians",II)) Q:II=""  D
 . . I $G(DOC("text",I,"clinicians",II,"signedDateTime"))]"" S J=J+1,DATE(J)=DOC("text",I,"clinicians",II,"signedDateTime")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
FAC ; Factor
 K DATE
 S DATE(1)=$G(PCE("entered"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
IMM ; Immunization
 K DATE
 S DATE(1)=$G(PCE("administeredDateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
LAB ; Lab
 K DATE
 S DATE(1)=$G(LAB("observed"))
 S DATE(2)=$G(LAB("resulted"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
MED ; Med
 K DATE
 S DATE(1)=$G(MED("orders",1,"ordered"))
 S DATE(2)=$G(MED("overallStart"))
 S DATE(3)=$G(MED("overallStop"))
 S DATE(4)=$G(MED("stopped"))
 S DATE(5)=$G(MED("lastFilled"))
 ;go through value array
 N I,J
 S J="",J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(MED("dosages",I)) Q:I=""  D
 . I $G(MED("dosages",I,"start"))]"" S J=J+1,DATE(J)=MED("dosages",I,"start")
 . I $G(MED("dosages",I,"stop"))]"" S J=J+1,DATE(J)=MED("dosages",I,"stop")
 S J="",J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(MED("fills",I)) Q:I=""  D
 . I $G(MED("fills",I,"dispenseDate"))]"" S J=J+1,DATE(J)=MED("fills",I,"dispenseDate")
 . I $G(MED("fills",I,"releaseDate"))]"" S J=J+1,DATE(J)=MED("fills",I,"releaseDate")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
OBS ; Obs ; rhl 20141231
 K DATE
 S DATE(1)=$G(CLIO("entered"))
 S DATE(2)=$G(CLIO("observed"))
 S DATE(3)=$G(CLIO("setStart"))
 S DATE(4)=$G(CLIO("setStop"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
ORD ; Order ; RHL 20141231
 K DATE
 S DATE(1)=$G(ORDER("entered"))
 ;S DATE(2)=$G(ORDER("start"))
 ;S DATE(3)=$G(ORDER("stop"))
 ;these are dates in signature/verification dates
 I $G(ORDER("clinicians")) D
 . N I,J
 . S J="",J=$O(DATE(J),-1)
 . S I=0
 . F  S I=$O(ORDER("clinicians",I)) Q:I=""  D
 . . I $G(ORDER("clinicians",I,"signedDateTime"))]"" S J=J+1,DATE(J)=ORDER("clinicians",I,"signedDateTime")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
PRO ; Problem
 K DATE
 S DATE(1)=$G(PROB("entered"))
 S DATE(2)=$G(PROB("updated"))
 S DATE(3)=$G(PROB("onset"))
 S DATE(4)=$G(PROB("resolved"))
 ;these are dates in possible comments
 N I,J
 S J="",J=$O(DATE(J),-1)
 S I=0
 F  S I=$O(PROB("comments",I)) Q:I=""  D
 . I $G(PROB("comments",I,"entered"))]"" S J=J+1,DATE(J)=PROB("comments",I,"entered")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
PRC ; Procedure
 K DATE
 S DATE(1)=$G(PROC("dateTime"))
 S DATE(2)=$G(PROC("requested"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
CON ; Consult
 K DATE
 S DATE(1)=$G(CONS("dateTime"))
 S DATE(2)=$G(CONS("earliestDate"))
 S DATE(3)=$G(ACT("entered"))
 S DATE(4)=$G(ACT("dateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
IMA ; Image ; RHL 20150102
 K DATE
 S DATE(1)=$G(EXAM("dateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
SUR ; Surgery ; RHL 20150102
 K DATE
 S DATE(1)=$G(SURG("dateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
TAS ; Task
 Q ""
 K DATE
 ;S DATE(1)=$G(
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
VIS ; Visit
 K DATE
 S DATE(1)=$G(VST("dateTime"))
 S DATE(2)=$G(VST("checkOut"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
VIT ; Vital
 K DATE
 S DATE(1)=$G(VIT("observed"))
 S DATE(2)=$G(VIT("resulted"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
PTF ; Ptf ; RHL 20150102
 K DATE
 S DATE(1)=$G(PTF("arrivalDateTime"))
 S DATE(2)=$G(PTF("dischargeDateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
EXA ; Exam
 K DATE
 S DATE(1)=$G(PCE("entered"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
CPT ; CPT
 K DATE
 S DATE(1)=$G(PCE("entered"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
EDU ; Education
 K DATE
 S DATE(1)=$G(PCE("entered"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
POV ; Pov
 K DATE
 S DATE(1)=$G(PCE("entered"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
SKI ; Skin
 K DATE
 S DATE(1)=$G(PCE("entered"))
 S DATE(2)=$G(PCE("dateRead"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
TRE ; Treatment ; RHL 20150102
 K DATE
 S DATE(1)=$G(NTX("entered"))
 S DATE(2)=$G(NTX("start"))
 S DATE(3)=$G(NTX("stop"))
 ;these are dates in signature/verification dates; is this used for NTX orders
 I $G(NTX("clinicians")) D
 . N I,J
 . S J="",J=$O(DATE(J),-1)
 . S I=0
 . F  S I=$O(NTX("clinicians",I)) Q:I=""  D
 . . I $G(NTX("clinicians",I,"signedDateTime"))]"" S J=J+1,DATE(J)=NTX("clinicians",I,"signedDateTime")
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
MH ; Mh   ; RHL 20150103
 K DATE
 S DATE(1)=$G(MH("administeredDateTime"))
 ;DETERMINE WHICH ONE IS NEWER
 Q $$FINDNEW(.DATE)
FINDNEW(DATE)  ;Find the newest date from an array
 ;DATE array has the following format DATE(1)=DATE DATE(2)=DATE
 N X,ADATE,COMDATE
 S X=""
 F  S X=$O(DATE(X)) Q:X=""  D
 . ;S ADATE=$E(DATE(X),1,12) ; normalize dates to YYYYMMDDHHMM
 . S ADATE=$E(DATE(X)_"000000",1,14) ;Need padding down to the second (YYYYMMDDHHMM). JD-1/23/15
 . I $G(COMDATE)="" S COMDATE=ADATE
 . I ADATE>COMDATE S COMDATE=ADATE
 Q COMDATE
