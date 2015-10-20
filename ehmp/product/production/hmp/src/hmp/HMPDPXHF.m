HMPDPXHF ;SLC/MKB -- PCE Health Factors ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^AUPNVSIT                     2028
 ; ^AUTTHF                       4295
 ; ^PXRMINDX                     4290
 ; DILFD                         2055
 ; DIQ                           2056
 ; PXPXRM                        4250
 ; XUAF4                         2171
 ;
 ; ------------ Get data from VistA ------------
 ;
EN(DFN,BEG,END,MAX,IFN) ; -- find a patient's health factors
 S DFN=+$G(DFN) Q:DFN<1  ;invalid patient
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 N HMPIDT,HMPN,HMPITM,HMPCNT
 ;
 ; get one health factor
 I $G(IFN) D  Q
 . N HF,DATE K ^TMP("HMPHF",$J)
 . S HF=0 F  S HF=$O(^PXRMINDX(9000010.23,"PI",+$G(DFN),HF)) Q:HF<1  D  Q:$D(HMPITM)
 .. S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.23,"PI",+$G(DFN),HF,DATE)) Q:DATE<1  I $D(^(DATE,IFN)) D  Q
 ... S HMPIDT=9999999-DATE,^TMP("HMPHF",$J,HMPIDT,IFN)=HF_U_DATE
 ... D EN1(IFN,.HMPITM),XML(.HMPITM)
 ;
 ; get all health factors
 D SORT(DFN,BEG,END) S HMPCNT=0
 S HMPIDT=0 F  S HMPIDT=$O(^TMP("HMPHF",$J,HMPIDT)) Q:HMPIDT<1  D  Q:HMPCNT'<MAX
 . S HMPN=0 F  S HMPN=$O(^TMP("HMPHF",$J,HMPIDT,HMPN)) Q:HMPN<1  D  Q:HMPCNT'<MAX
 .. K HMPITM D EN1(HMPN,.HMPITM) Q:'$D(HMPITM)
 .. D XML(.HMPITM) S HMPCNT=HMPCNT+1
 K ^TMP("HMPHF",$J)
 Q
 ;
SORT(DFN,START,STOP) ; -- build ^TMP("HMPHF",$J,9999999-DATE,DA)=HF^DATE in range
 ;  from ^PXRMINDX(9000010.23,"PI",DFN,HF,DATE,DA)
 N HF,DATE,DA,IDT K ^TMP("HMPHF",$J)
 S HF=0 F  S HF=$O(^PXRMINDX(9000010.23,"PI",+$G(DFN),HF)) Q:HF<1  D
 . S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.23,"PI",+$G(DFN),HF,DATE)) Q:DATE<1  D
 .. Q:DATE<START  Q:DATE>STOP  S IDT=9999999-DATE
 .. S DA=0 F  S DA=$O(^PXRMINDX(9000010.23,"PI",+$G(DFN),HF,DATE,DA)) Q:DA<1  S ^TMP("HMPHF",$J,IDT,DA)=HF_U_DATE
 Q
 ;
EN1(IEN,HF) ; -- return a health factor in HF("attribute")=value
 ;  from EN: expects ^TMP("HMPHF",$J,HMPIDT,IEN)=HF^DATE
 N HMPF,TMP,VISIT,X0,FAC,LOC,X K HF
 D VHF^PXPXRM(IEN,.HMPF)
 S HF("id")=IEN,HF("severity")=$G(HMPF("VALUE"))
 S TMP=$G(^TMP("HMPHF",$J,HMPIDT,IEN)),HF("recorded")=$P(TMP,U,2)
 S HF("name")=$$EXTERNAL^DILFD(9000010.23,.01,,+TMP)
 S HF("comment")=$G(HMPF("COMMENTS"))
 S VISIT=$G(HMPF("VISIT")),HF("encounter")=VISIT
 S X0=$G(^AUPNVSIT(+VISIT,0))
 S FAC=+$P(X0,U,6),LOC=+$P(X0,U,22)
 S:FAC HF("facility")=$$STA^XUAF4(FAC)_U_$P($$NS^XUAF4(FAC),U)
 S:'FAC HF("facility")=$$FAC^HMPD(LOC)
 S X=$$GET1^DIQ(9999999.64,+TMP_",",.03,"I")
 S:X HF("category")=X_U_$$GET1^DIQ(9999999.64,+TMP_",",.03)
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(HF) ; -- Return patient data as XML in @HMP@(n)
 ; as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,ID
 D ADD("<factor>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(HF(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S X=$G(HF(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . S Y="<"_ATT_" code='"_$P(X,U)_"' name='"_$$ESC^HMPD($P(X,U,2))_"' />"
 D ADD("</factor>")
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
