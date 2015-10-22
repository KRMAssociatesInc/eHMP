HMPDPXED ;SLC/MKB -- PCE V Patient Education ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^AUPNVSIT                     2028
 ; ^PXRMINDX                     4290
 ; DILFD                         2055
 ; PXPXRM                        4250
 ; XUAF4                         2171
 ;
 ; ------------ Get data from VistA ------------
 ;
EN(DFN,BEG,END,MAX,IFN) ; -- find a patient's education
 S DFN=+$G(DFN) Q:DFN<1  ;invalid patient
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 N HMPIDT,HMPN,HMPITM,HMPCNT
 ;
 ; get one item
 I $G(IFN) D  Q
 . N ITM,DATE K ^TMP("HMPPX",$J)
 . S ITM=0 F  S ITM=$O(^PXRMINDX(9000010.16,"PI",+$G(DFN),ITM)) Q:ITM<1  D  Q:$D(HMPITM)
 .. S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.16,"PI",+$G(DFN),ITM,DATE)) Q:DATE<1  I $D(^(DATE,IFN)) D  Q
 ... S HMPIDT=9999999-DATE,^TMP("HMPPX",$J,HMPIDT,IFN)=ITM_U_DATE
 ... D EN1(IFN,.HMPITM),XML(.HMPITM)
 ;
 ; get all items
 D SORT(DFN,BEG,END) S HMPCNT=0
 S HMPIDT=0 F  S HMPIDT=$O(^TMP("HMPPX",$J,HMPIDT)) Q:HMPIDT<1  D  Q:HMPCNT'<MAX
 . S HMPN=0 F  S HMPN=$O(^TMP("HMPPX",$J,HMPIDT,HMPN)) Q:HMPN<1  D  Q:HMPCNT'<MAX
 .. K HMPITM D EN1(HMPN,.HMPITM) Q:'$D(HMPITM)
 .. D XML(.HMPITM) S HMPCNT=HMPCNT+1
 K ^TMP("HMPPX",$J)
 Q
 ;
SORT(DFN,START,STOP) ; -- build ^TMP("HMPPX",$J,9999999-DATE,DA)=ITM^DATE in range
 ;  from ^PXRMINDX(9000010.16,"PI",DFN,ITM,DATE,DA)
 N ITM,DATE,DA,IDT K ^TMP("HMPPX",$J)
 S ITM=0 F  S ITM=$O(^PXRMINDX(9000010.16,"PI",+$G(DFN),ITM)) Q:ITM<1  D
 . S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.16,"PI",+$G(DFN),ITM,DATE)) Q:DATE<1  D
 .. Q:DATE<START  Q:DATE>STOP  S IDT=9999999-DATE
 .. S DA=0 F  S DA=$O(^PXRMINDX(9000010.16,"PI",+$G(DFN),ITM,DATE,DA)) Q:DA<1  S ^TMP("HMPPX",$J,IDT,DA)=ITM_U_DATE
 Q
 ;
EN1(IEN,PCE) ; -- return education in PCE("attribute")=value
 ;  from EN: expects ^TMP("HMPPX",$J,HMPIDT,IEN)=ITM^DATE
 N HMPF,TMP,VISIT,X0,FAC,LOC,X K PCE
 D VPEDU^PXPXRM(IEN,.HMPF)
 S PCE("id")=IEN,X=$G(HMPF("VALUE"))
 S PCE("result")=$$EXTERNAL^DILFD(9000010.16,.06,,X)
 S TMP=$G(^TMP("HMPPX",$J,HMPIDT,IEN)),PCE("dateTime")=$P(TMP,U,2)
 S PCE("name")=$$EXTERNAL^DILFD(9000010.16,.01,,+TMP)
 S PCE("comment")=$G(HMPF("COMMENTS"))
 S VISIT=$G(HMPF("VISIT")),PCE("encounter")=VISIT
 S X0=$G(^AUPNVSIT(+VISIT,0))
 S FAC=+$P(X0,U,6),LOC=+$P(X0,U,22)
 S:FAC PCE("facility")=$$STA^XUAF4(FAC)_U_$P($$NS^XUAF4(FAC),U)
 S:'FAC PCE("facility")=$$FAC^HMPD(LOC)
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(PCE) ; -- Return patient data as XML in @HMP@(n)
 ; as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,ID
 D ADD("<educationTopic>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(PCE(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S X=$G(PCE(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . S Y="<"_ATT_" code='"_$P(X,U)_"' name='"_$$ESC^HMPD($P(X,U,2))_"' />"
 D ADD("</educationTopic>")
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
