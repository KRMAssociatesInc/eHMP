HMPDPROC ;SLC/MKB -- Procedure extract ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; RAO7PC1                       2043
 ; SROESTV                       3533
 ;
 ; ------------ Get procedure(s) from VistA ------------
 ;
EN(DFN,BEG,END,MAX,ID) ; -- find patient's procedures
 S DFN=+$G(DFN) Q:DFN<1
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 ;
 N HMPN,HMPCNT,HMPITM,HMPY,HMPCATG
 S HMPCATG=$G(FILTER("category"),"SR;RA") ;NwHIN default
 ;
 ; get one procedure
 I $G(ID),ID'[";" D  D:$D(HMPITM) XML(.HMPITM) Q
 . I ID'["-" D EN1^HMPDSR(ID,.HMPITM) Q    ;Surgery
 . S (BEG,END)=9999999.9999=+ID D EN1^RAO7PC1(DFN,BEG,END,"1P")
 . D EN1^HMPDRA(ID,.HMPITM)                ;Radiology
 . K ^TMP($J,"RAE1")
 I $G(ID),ID[";" D EN^HMPDMC(DFN,,,,ID) Q  ;CP/Medicine
 ;
SR ; get all surgeries
 I HMPCATG'["SR" G RA
 N SHOWADD S SHOWADD=1 ;to omit leading '+' with note titles
 D LIST^SROESTV(.HMPY,DFN,BEG,END,MAX,1)
 S HMPN=0 F  S HMPN=$O(@HMPY@(HMPN)) Q:HMPN<1  D
 . K HMPITM D ONE^HMPDSR(HMPN,.HMPITM) Q:'$D(HMPITM)
 . ;Q:$G(HMPITM("status"))'?1"COMP".E
 . D XML(.HMPITM)
 K @HMPY
 ;
RA ; get all radiology exams
 I HMPCATG'["RA" G CP
 K ^TMP($J,"RAE1") D EN1^RAO7PC1(DFN,BEG,END,MAX)
 S HMPCNT=+$G(HMPTOTL),HMPN=""
 F  S HMPN=$O(^TMP($J,"RAE1",DFN,HMPN)) Q:HMPN=""   D  Q:HMPCNT'<MAX  ;I $P($P($G(^(HMPN)),U,6),"~",2)?1"COMP".E
 . K HMPITM D EN1^HMPDRA(HMPN,.HMPITM) Q:'$D(HMPITM)
 . D XML(.HMPITM) S HMPCNT=HMPCNT+1
 K ^TMP($J,"RAE1")
 ;
CP ; get CP procedures
 D:HMPCATG["CP" EN^HMPDMC(DFN,BEG,END,MAX)
 ;
 ; V-CPT
 ;
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(PROC) ; -- Return procedures as XML
 N ATT,X,Y,I,J,NAMES
 D ADD("<procedure>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(PROC(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S NAMES=$S(ATT="document"!(ATT="opReport"):"id^localTitle^nationalTitle^status^Z",1:"code^name^Z")
 . I $O(PROC(ATT,0)) D  S Y="" Q  ;multiples
 .. D ADD("<"_ATT_"s>")
 .. S I=0 F  S I=$O(PROC(ATT,I)) Q:I<1  D
 ... S X=$G(PROC(ATT,I))
 ... S Y="<"_ATT_" "_$$LOOP ;_"/>" D ADD(Y)
 ... S X=$G(PROC(ATT,I,"content")) I '$L(X) S Y=Y_"/>" D ADD(Y) Q
 ... S Y=Y_">" D ADD(Y)
 ... S Y="<content xml:space='preserve'>" D ADD(Y)
 ... S J=0 F  S J=$O(@X@(J)) Q:J<1  S Y=$$ESC^HMPD(@X@(J)) D ADD(Y)
 ... D ADD("</content>"),ADD("</"_ATT_">")
 .. D ADD("</"_ATT_"s>")
 . S X=$G(PROC(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . I $L(X)>1 S Y="<"_ATT_" "_$$LOOP_"/>"
 D ADD("</procedure>")
 Q
 ;
LOOP() ; -- build sub-items string from NAMES and X
 N STR,P,TAG S STR=""
 F P=1:1 S TAG=$P(NAMES,U,P) Q:TAG="Z"  I $L($P(X,U,P)) S STR=STR_TAG_"='"_$$ESC^HMPD($P(X,U,P))_"' "
 Q STR
 ;
ADD(X) ; -- Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
