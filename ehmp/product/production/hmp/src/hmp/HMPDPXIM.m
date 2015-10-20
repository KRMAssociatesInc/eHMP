HMPDPXIM ;SLC/MKB -- Immunizations extract ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^PXRMINDX                     4290
 ; ^SC                          10040
 ; ^VA(200                      10060
 ; DILFD                         2055
 ; DIQ                           2056
 ; PXAPI                         1894
 ; PXPXRM                        4250
 ; XUAF4                         2171
 ; 
 ; ------------ Get immunizations from VistA ------------
 ;
EN(DFN,BEG,END,MAX,IFN) ; -- find patient's immunizations
 S DFN=+$G(DFN) Q:DFN<1  ;invalid patient
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999),HMPCNT=0
 N HMPIDT,HMPN,HMPITM,HMPCNT
 ;
 ; get one immunization
 I $G(IFN) D  Q
 . N IMZ,DATE K ^TMP("HMPIMM",$J)
 . S IMZ=0 F  S IMZ=$O(^PXRMINDX(9000010.11,"PI",+$G(DFN),IMZ)) Q:IMZ<1  D  Q:$D(HMPITM)
 .. S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.11,"PI",+$G(DFN),IMZ,DATE)) Q:DATE<1  I $D(^(DATE,IFN)) D  Q
 ... S HMPIDT=9999999-DATE,HMPN=IFN
 ... S ^TMP("HMPIMM",$J,HMPIDT,IFN)=IMZ_U_DATE ;SORT node
 ... D EN1(IFN,.HMPITM),XML(.HMPITM)
 . K ^TMP("HMPIMM",$J),^TMP("PXKENC",$J)
 ;
 ; get all immunizations
 D SORT(DFN,BEG,END) S HMPCNT=0
 S HMPIDT=0 F  S HMPIDT=$O(^TMP("HMPIMM",$J,HMPIDT)) Q:HMPIDT<1  D  Q:HMPCNT'<MAX
 . S HMPN=0 F  S HMPN=$O(^TMP("HMPIMM",$J,HMPIDT,HMPN)) Q:HMPN<1  D  Q:HMPCNT'<MAX
 .. K HMPITM D EN1(HMPN,.HMPITM) Q:'$D(HMPITM)
 .. D XML(.HMPITM) S HMPCNT=HMPCNT+1
 K ^TMP("HMPIMM",$J),^TMP("PXKENC",$J)
 Q
 ;
SORT(DFN,START,STOP) ; -- build ^TMP("HMPIMM",$J,9999999-DATE,DA)=IMM^DATE in range
 ;  from ^PXRMINDX(9000010.11,"PI",DFN,IMM,DATE,DA)
 N IMZ,DATE,DA,IDT K ^TMP("HMPIMM",$J)
 S IMZ=0 F  S IMZ=$O(^PXRMINDX(9000010.11,"PI",+$G(DFN),IMZ)) Q:IMZ<1  D
 . S DATE=0 F  S DATE=$O(^PXRMINDX(9000010.11,"PI",+$G(DFN),IMZ,DATE)) Q:DATE<1  D
 .. Q:DATE<START  Q:DATE>STOP  S IDT=9999999-DATE
 .. S DA=0 F  S DA=$O(^PXRMINDX(9000010.11,"PI",+$G(DFN),IMZ,DATE,DA)) Q:DA<1  S ^TMP("HMPIMM",$J,IDT,DA)=IMZ_U_DATE
 Q
 ;
EN1(IEN,IMM) ; -- return an immunization in IMM("attribute")=value
 ; Expects ^TMP("HMPIMM",$J,HMPIDT,HMPN)=IMM^DATE from EN/SORT
 N TMP,HMPM,VISIT,X0,FAC,LOC,X12,X,I K IMM
 S TMP=$G(^TMP("HMPIMM",$J,HMPIDT,HMPN))
 S IMM("id")=IEN,IMM("administered")=+$P(TMP,U,2)
 S IMM("name")=$$EXTERNAL^DILFD(9000010.11,.01,,+TMP)
 D VIMM^PXPXRM(IEN,.HMPM)
 S X=$G(HMPM("SERIES")),IMM("series")=$$EXTERNAL^DILFD(9000010.11,.04,,X)
 S X=$G(HMPM("REACTION")),IMM("reaction")=$$EXTERNAL^DILFD(9000010.11,.06,,X)
 S IMM("contraindicated")=+$G(HMPM("CONTRAINDICATED"))
 S IMM("comment")=$G(HMPM("COMMENTS"))
 S VISIT=+$G(HMPM("VISIT")),IMM("encounter")=VISIT
 I '$D(^TMP("PXKENC",$J,VISIT)) D ENCEVENT^PXAPI(VISIT,1)
 S X0=$G(^TMP("PXKENC",$J,VISIT,"VST",VISIT,0))
 S FAC=+$P(X0,U,6),LOC=+$P(X0,U,22)
 S:FAC IMM("facility")=$$STA^XUAF4(FAC)_U_$P($$NS^XUAF4(FAC),U)
 S:'FAC IMM("facility")=$$FAC^HMPD(LOC)
 S IMM("location")=$P($G(^SC(LOC,0)),U)
 S X12=$G(^TMP("PXKENC",$J,VISIT,"IMM",IEN,12))
 S X=$P(X12,U,4) S:'X X=$P(X12,U,2)
 I 'X S I=0 F  S I=$O(^TMP("PXKENC",$J,VISIT,"PRV",I)) Q:I<1  I $P($G(^(I,0)),U,4)="P" S X=+^(0) Q
 S:X IMM("provider")=X_U_$P($G(^VA(200,X,0)),U)
 ; CPT mapping
 S X=+$$FIND1^DIC(811.1,,"QX",IEN_";AUTTIMM(","B") I X>0 D
 . S Y=$$GET1^DIQ(811.1,X_",",.02,"I") Q:Y<1
 . N CPT S CPT=$G(@(U_$P(Y,";",2)_+Y_",0)"))
 . S IMM("cpt")=$P(CPT,U,1,2)
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(IMM) ; -- Return immunizations as XML
 N ATT,X,Y,I,P,NAMES,TAG
 D ADD("<immunization>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(IMM(ATT)) Q:ATT=""  D
 . S X=$G(IMM(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" D ADD(Y) Q
 . I $L(X)>1 D
 .. S Y="<"_ATT_" "
 .. F P=1:1 S TAG=$P("code^name^Z",U,P) Q:TAG="Z"  I $L($P(X,U,P)) S Y=Y_TAG_"='"_$$ESC^HMPD($P(X,U,P))_"' "
 .. S Y=Y_"/>" D ADD(Y)
 D ADD("</immunization>")
 Q
 ;
ADD(X) ; -- Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
