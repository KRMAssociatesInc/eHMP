HMPDGMRC ;SLC/MKB -- Consult extract ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^TIU(8925.1                   5677
 ; DIQ                           2056
 ; GMRCGUIB                      2980
 ; GMRCSLM1,^TMP("GMRCR",$J)     2740
 ; TIULQ                         2693
 ; XUAF4                         2171
 ;
 ; ------------ Get consults from VistA ------------
 ;
EN(DFN,BEG,END,MAX,IFN) ; -- find patient's consults
 N HMPN,HMPX,HMPITM K ^TMP("GMRCR",$J,"CS")
 S DFN=+$G(DFN) Q:DFN<1
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 ;
 D OER^GMRCSLM1(DFN,"",BEG,END,"")
 S HMPN=0 F  S HMPN=$O(^TMP("GMRCR",$J,"CS",HMPN)) Q:HMPN<1!(HMPN>MAX)  S HMPX=$G(^(HMPN,0)) Q:$E(HMPX)="<"  D
 . I $G(IFN),IFN'=+HMPX Q
 . K HMPITM D EN1(+HMPX,.HMPITM),XML(.HMPITM)
 K ^TMP("GMRCR",$J,"CS"),^TMP("HMPTEXT",$J)
 Q
 ;
EN1(ID,CONS) ; -- return a consult in CONS("attribute")=value
 ;     Expects DFN, HMPX=^TMP("GMRCR",$J,"CS",HMPN,0) [from EN]
 N HMPD,X0,HMPJ,X,HMPTIU,LT,NT
 K CONS,^TMP("HMPTEXT",$J)
 S CONS("id")=ID,CONS("requested")=$P(HMPX,U,2)
 S CONS("status")=$P(HMPX,U,3),CONS("service")=$P(HMPX,U,4)
 S CONS("procedure")=$P(HMPX,U,5),CONS("name")=$P(HMPX,U,7)
 I $P(HMPX,U,6)="*" S CONS("result")="SIGNIFICANT FINDINGS"
 S CONS("orderID")=$P(HMPX,U,8),CONS("type")=$P(HMPX,U,9)
 D DOCLIST^GMRCGUIB(.HMPD,ID) S X0=$G(HMPD(0)) ;=^GMR(123,ID,0)
 S HMPJ=0 F  S HMPJ=$O(HMPD(50,HMPJ)) Q:HMPJ<1  S X=$G(HMPD(50,HMPJ)) D
 . Q:'$D(@(U_$P(X,";",2)_+X_")"))  ;text deleted
 . D EXTRACT^TIULQ(+X,"HMPTIU",,.01)
 . S LT=$G(HMPTIU(+X,.01,"E")) ;print name
 . S NT=$$GET1^DIQ(8925.1,+$G(HMPTIU(+X,.01,"I"))_",",1501)
 . S CONS("document",HMPJ)=+X_U_LT_U_NT
 . S:$G(HMPTEXT) CONS("document",HMPJ,"content")=$$TEXT^HMPDTIU(X)
 S X=$P(X0,U,21),CONS("facility")=$S(X:$$STA^XUAF4(X)_U_$P($$NS^XUAF4(X),U),1:$$FAC^HMPD)
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(CONS) ; -- Return patient consult as XML
 ;  as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,J,NAMES
 D ADD("<consult>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(CONS(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S NAMES=$S(ATT="document":"id^localTitle^nationalTitle^Z",1:"code^name^Z")
 . I $O(CONS(ATT,0)) D  S Y="" Q  ;multiples
 .. D ADD("<"_ATT_"s>")
 .. S I=0 F  S I=$O(CONS(ATT,I)) Q:I<1  D
 ... S X=$G(CONS(ATT,I)),Y="<"_ATT_" "_$$LOOP
 ... S X=$G(CONS(ATT,I,"content")) I '$L(X) S Y=Y_"/>" D ADD(Y) Q
 ... S Y=Y_">" D ADD(Y)
 ... S Y="<content xml:space='preserve'>" D ADD(Y)
 ... S J=0 F  S J=$O(@X@(J)) Q:J<1  S Y=$$ESC^HMPD(@X@(J)) D ADD(Y)
 ... D ADD("</content>"),ADD("</"_ATT_">")
 .. D ADD("</"_ATT_"s>")
 . S X=$G(CONS(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . I $L(X)>1 S Y="<"_ATT_" "_$$LOOP_"/>"
 D ADD("</consult>")
 Q
 ;
LOOP() ; -- build sub-items string from NAMES and X
 N STR,P,TAG S STR=""
 F P=1:1 S TAG=$P(NAMES,U,P) Q:TAG="Z"  I $L($P(X,U,P)) S STR=STR_TAG_"='"_$$ESC^HMPD($P(X,U,P))_"' "
 Q STR
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
