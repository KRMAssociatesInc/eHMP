HMPDTIUX ;SLC/MKB -- TIU search utilities ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^TIU(8925.1              2321,5677
 ; ^TIU(8926.1                   5678
 ; DIQ                           2056
 ; TIUCNSLT                      5546
 ; TIUCP                         3568
 ; TIULQ                         2693
 ; TIULX                         3058
 ; TIUSROI                       5676
 ; XLFSTR                       10104
 ;
 ;
 ; ------------ Get/apply search criteria ------------
 ;                  [from EN^HMPDTIU]
 ;
SETUP ; -- convert FILTER("attribute") = value to TIU criteria
 ; Expects: FILTER("category") = code (see $$CATG)
 ;          FILTER("loinc")    = LOINC
 ;          FILTER("status")   = 'all','completed','unsigned'
 ; Returns: CLASS,[SUBCLASS,TITLE,SERVICE,SUBJECT,STATUS]
 ;
 N LOINC,TYPE,STS,CP
 S LOINC=+$G(FILTER("loinc")),TYPE=$$UP^XLFSTR($G(FILTER("category")))
 S CLASS="3^244",(SUBCLASS,TITLE,SERVICE,SUBJECT,NOTSUBJ,STATUS)=""
 ;
 ; status [default='complete']
 S STS=$$LOW^XLFSTR($G(FILTER("status")))
 S STATUS=$S(STS?1"unsig".E:2,STS="all":"5^2",1:5)  ;TIUSRVLO statuses
 ;
 ; all documents
 I TYPE="ALL" S CLASS="3^244^"_+$$CLASS^TIUSROI("SURGICAL REPORTS")_"^CP^LR^RA" Q
 I 'LOINC,TYPE="" S CLASS="3^244^"_+$$CLASS^TIUSROI("SURGICAL REPORTS")_"^CP^LR^RA" Q
 ;
 ; progress notes
 I TYPE="PN" S CLASS=3 Q
 I TYPE="CR"!(LOINC=11488) S CLASS=3,SUBCLASS=+$$CLASS^TIUCNSLT Q
 ; LOINC=26442 S CLASS=3,SUBJECT="^114^" Q         ;OB/GYN
 I LOINC=34117 S CLASS=3,SERVICE="^88^" Q          ;H&P
 I TYPE="CWAD" S CLASS=3,SUBCLASS="25^27^30^31" Q  ;CWAD
 I TYPE="C" S CLASS=3,SUBCLASS=30 Q                ;Crisis Note
 I TYPE="W" S CLASS=3,SUBCLASS=31 Q                ;Clinical Warning
 I TYPE="A" S CLASS=3,SUBCLASS=25 Q                ;Allergy Note
 I TYPE="D"!(LOINC=42348) S CLASS=3,SUBCLASS=27 Q  ;Advance Directive
 ;
 ; discharge summaries
 I TYPE="DS"!(LOINC=18842) S CLASS=244 Q
 ;
 ; procedures
 I TYPE="SR"!(LOINC=29752) S CLASS=+$$CLASS^TIUSROI("SURGICAL REPORTS") Q
 D CPCLASS^TIUCP(.CP)
 I TYPE="CP" S CLASS=$S(STATUS=2:CP,1:"CP") Q       ;CLINICAL PROCEDURES
 I LOINC=26441 D  Q                                 ;CARDIOLOGY
 . S CLASS=CP_"^3"
 . S SUBJECT="^18^142^174^",SERVICE="^75^76^115^"
 I LOINC=27896 D  Q                                 ;PULMONARY
 . S CLASS=CP_"^3"
 . S SUBJECT="^23^142^",SERVICE="^75^76^115^"
 I LOINC=27895 D  Q                                 ;GASTROENTEROLOGY
 . S CLASS=CP_"^3"
 . S SUBJECT="^20^",SERVICE="^75^76^115^"
 I LOINC=27897 D  Q                                 ;NEUROLOGY
 . S CLASS=CP_"^3"
 . S SUBJECT="^44^45^52^111^112^143^146^",SERVICE="^75^76^115^"
 I LOINC=28619 D  Q                                 ;OPHTH/OPTOMETRY
 . S CLASS=CP_"^3"
 . S SUBJECT="^13^14^103^",SERVICE="^75^76^115^"
 I LOINC=28634 D  Q                                 ;MISC/ALL OTHERS
 . S CLASS=CP_"^3",SERVICE="^75^76^115^"
 . S NOTSUBJ="^18^142^174^23^142^20^44^45^52^111^112^143^146^13^14^103^"
 I LOINC=28570 D  Q                                 ;UNSPECIFIED/ALL
 . S CLASS=CP_"^3"
 . S SERVICE="^75^76^115^"
 ;
 ; pathology/lab
 I TYPE="LR"!(LOINC=27898) S CLASS=$S(STATUS=2:$$LR,1:"LR") Q
 ;
 ; radiology
 I TYPE="RA"!(LOINC=18726) S CLASS="RA" Q
 ;
 ; unknown
 I $L(TYPE)!LOINC S CLASS=0
 Q
 ;
LR() ; -- Return ien of Lab class
 N Y S Y=+$O(^TIU(8925.1,"B","LR LABORATORY REPORTS",0))
 I Y>0,$S($P($G(^TIU(8925.1,Y,0)),U,4)="CL":0,$P($G(^(0)),U,4)="DC":0,1:1) S Y=0
 Q Y
 ;
MATCH(DOC,STS) ; -- Return 1 or 0, if document DA matches search criteria
 N Y,DA,LOCAL,NATL,X0,OK S Y=0
 S DA=+$G(DOC) G:DA<1 MQ
 ; include addenda if pulling only unsigned items
 I $P(DOC,U,2)?1"Addendum ".E,STATUS'=2 G MQ
 ; TIU unsigned list can include completed parent notes
 I $G(STS)=2,$P(DOC,U,7)'="unsigned" G MQ
 S LOCAL=$$GET1^DIQ(8925,DA_",",.01,"I") ;local Title 8925.1 ien
 I $L(SUBCLASS) D  G:'OK MQ
 . N I,X S OK=0
 . F I=1:1:$L(SUBCLASS,"^") S X=$P(SUBCLASS,U,I) I $$ISA^TIULX(LOCAL,X) S OK=1 Q
 S NATL=+$$GET1^DIQ(8925.1,LOCAL_",",1501,"I") ;Natl Title 8926.1 ien
 I $L(TITLE) G:TITLE'[(U_+NATL_U) MQ
 S X0=$G(^TIU(8926.1,NATL,0))
 I $L(SERVICE) G:SERVICE'[(U_+$P(X0,U,7)_U) MQ
 I $L(SUBJECT) G:SUBJECT'[(U_+$P(X0,U,4)_U) MQ
 I $L(NOTSUBJ) G:NOTSUBJ[(U_+$P(X0,U,4)_U) MQ
 S Y=1
MQ Q Y
 ;
TYPE(X) ; -- Return name of category type X
 S X=$G(X)
 I X="PN" Q "Progress Note"
 I X="DS" Q "Discharge Summary"
 I X="CP" Q "Clinical Procedure"
 I X="SR" Q "Surgery Report"
 I X="LR" Q "Laboratory Report"
 I X="RA" Q "Radiology Report"
 I X="CR" Q "Consult Report"
 I X="C"  Q "Crisis Note"
 I X="W"  Q "Clinical Warning"
 I X="A"  Q "Allergy/Adverse Reaction"
 I X="D"  Q "Advance Directive"
 Q ""
