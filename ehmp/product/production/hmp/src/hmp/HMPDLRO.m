HMPDLRO ;SLC/MKB -- Laboratory extract by order/panel ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^DPT                         10035
 ; ^LAB(60                      10054
 ; ^LAB(61                        524
 ; ^LRO(69                       2407
 ; ^LR                            525
 ; DIQ                           2056
 ; LR7OR1,^TMP("LRRR",$J)        2503
 ; LR7OU1                        2955
 ; ORX8                          3071
 ; XUAF4                         2171
 ;
 ; ------------ Get results from VistA ------------
 ;
EN(DFN,BEG,END,MAX,ID) ; -- find patient's lab results
 N HMPSUB,HMPIDT,HMPN,HMPLRO,HMPT,HMPITM,CMMT,LRDFN,LR0,X
 S DFN=+$G(DFN) Q:$G(DFN)<1
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 S LRDFN=$G(^DPT(DFN,"LR")),HMPSUB="CH"
 K ^TMP("LRRR",$J,DFN)
 ;
 ; get result(s)
 I $G(ID)  D RR^LR7OR1(DFN,ID)
 I '$G(ID) D  ;no id, or accession format (no lab order)
 . S:$G(ID)'="" HMPSUB=$P(ID,";"),(BEG,END)=9999999-$P(ID,";",2)
 . D RR^LR7OR1(DFN,,BEG,END,HMPSUB,,,MAX)
 ;
 S HMPSUB="" F  S HMPSUB=$O(^TMP("LRRR",$J,DFN,HMPSUB)) Q:HMPSUB=""  D
 . S HMPIDT=0 F  S HMPIDT=$O(^TMP("LRRR",$J,DFN,HMPSUB,HMPIDT)) Q:HMPIDT<1  I $O(^(HMPIDT,0)) D
 .. I "CH^MI"'[HMPSUB Q
 .. D SORT ;group accession by lab orders > HMPLRO(panel,HMPN)=data node
 .. S HMPT="" F  S HMPT=$O(HMPLRO(HMPT)) Q:HMPT=""  D
 ... K HMPITM,CMMT S X=$G(HMPLRO(HMPT))
 ... I $G(ID),$P(ID,";",1,3)'=$P($P(X,U,3),";",1,3) Q  ;single order/specimen
 ... S HMPITM("id")=$P(X,U,3),HMPITM("order")=$P(X,U,1,2)
 ... S HMPITM("type")=HMPSUB,HMPITM("status")="completed"
 ... S HMPITM("collected")=9999999-HMPIDT
 ... S LR0=$G(^LR(LRDFN,HMPSUB,HMPIDT,0))
 ... S HMPITM("resulted")=$P(LR0,U,3),X=+$P(LR0,U,5) I X D  ;specimen
 .... N IENS,HMPY S IENS=X_","
 .... D GETS^DIQ(61,IENS,".01:2",,"HMPY")
 .... S HMPITM("specimen")=$G(HMPY(61,IENS,2))_U_$G(HMPY(61,IENS,.01)) ;SNOMED^name
 .... S HMPITM("sample")=$$GET1^DIQ(61,X_",",4.1) ;name
 ... S HMPITM("groupName")=$P(LR0,U,6),X=+$P(LR0,U,14)
 ... S:X HMPITM("facility")=$$STA^XUAF4(X)_U_$P($$NS^XUAF4(X),U)
 ... I 'X S HMPITM("facility")=$$FAC^HMPD ;local stn#^name
 ... S HMPN=0 F  S HMPN=$O(HMPLRO(HMPT,HMPN)) Q:HMPN<1  D
 .... S X=$G(HMPLRO(HMPT,HMPN))
 .... S:HMPSUB="CH" HMPITM("value",HMPN)=$$CH(X)
 .... S:HMPSUB="MI" HMPITM("value",HMPN)=$$MI(X)
 ... I $D(^TMP("LRRR",$J,DFN,HMPSUB,HMPIDT,"N")) M CMMT=^("N") S HMPITM("comment")=$$STRING^HMPD(.CMMT)
 ... D XML(.HMPITM)
 K ^TMP("LRRR",$J,DFN)
 Q
 ;
SORT ; -- return HMPLRO(PANEL) = CPRS order# ^ panel/test name ^ Lab Order string
 ;               HMPLRO(PANEL,HMPN) = result node
 N X0,NUM,ORD,ODT,SN,T,T0,ORIFN,I,HMPY,HMPLRT K HMPLRO
 S HMPN=$O(^TMP("LRRR",$J,DFN,HMPSUB,HMPIDT,0)),X0=$G(^(HMPN)) ;first
 S NUM=$P(X0,U,16),ORD=$P(X0,U,17),ODT=+$P(9999999-HMPIDT,".")
 ; - build HMPLRT list of result nodes for each test/panel
 I ORD S SN=0 F  S SN=$O(^LRO(69,"C",ORD,ODT,SN)) Q:SN<1  D  Q:$D(HMPLRT)
 . I $G(ID),$P(ID,";",3)'=SN Q
 . S T=0 F  S T=+$O(^LRO(69,ODT,1,SN,2,T)) Q:T<1  D
 .. I $G(ID),$P(ID,";",4),T'=$P(ID,";",4) Q
 .. S T0=$G(^LRO(69,ODT,1,SN,2,T,0))
 .. ; is test/panel part of same accession?
 .. S ORIFN=+$P(T0,U,7)
 .. Q:HMPIDT'=$P($$PKGID^ORX8(ORIFN),";",5)
 .. ; expand panel into unit tests
 .. K HMPY D EXPAND^LR7OU1(+T0,.HMPY)
 .. S I=0 F  S I=$O(HMPY(I)) Q:I<1  S HMPLRT(I,+T0)="" ;HMPLRT(test,panel)=""
 .. S HMPLRO(+T0)=$P(T0,U,7)_U_$P($G(^LAB(60,+T0,0)),U)_U_ORD_";"_ODT_";"_SN_";"_T
 S:'$D(HMPLRO) HMPLRO(0)=$S(HMPSUB="MI":"^MICROBIOLOGY^MI;",1:"^ACCESSION^CH;")_HMPIDT ;no Lab Order
 ; - build HMPLRO(panel#,HMPN) = ^TMP node
 S HMPN=0 F  S HMPN=$O(^TMP("LRRR",$J,DFN,"CH",HMPIDT,HMPN)) Q:HMPN<1  S X0=$G(^(HMPN)) D
 . I '$D(HMPLRT(+X0)) S HMPLRO(0,HMPN)=X0 Q  ;no Lab Order
 . S T=0 F  S T=$O(HMPLRT(+X0,T)) Q:T<1  S HMPLRO(T,HMPN)=X0
 Q
 ;
CH(X0) ; -- return a Chemistry result as:
 ;   id^test^result^interpretation^units^low^high^loinc^vuid
 ;   Expects X0=^TMP("LRRR",$J,DFN,"CH",HMPIDT,HMPN),LRDFN
 N X,Y,NODE,LOINC
 S NODE=$G(^LR(LRDFN,"CH",HMPIDT,HMPN))
 S X=$P($G(^LAB(60,+X0,0)),U)
 S Y="CH;"_HMPIDT_";"_HMPN_U_X_U_$P(X0,U,2,4)
 S X=$P(X0,U,5) I $L(X),X["-" S X=$TR(X,"- ","^"),$P(Y,U,6,7)=X
 S X=$P($P(NODE,U,3),"!",3) S:X LOINC=$$GET1^DIQ(95.3,X_",",.01)
 S:$G(LOINC) $P(Y,U,8,9)=LOINC_U_$$VUID^HMPD(+LOINC,95.3)
 Q Y
 ;
MI(X0) ; -- return a Microbiology result as:
 ;   id^test^result^interpretation^units
 ;   Expects X0=^TMP("LRRR",$J,DFN,"MI",HMPIDT,HMPN)
 N Y S Y=""
 S:$L($P(X0,U))>1 Y="MI;"_HMPIDT_";"_HMPN_U_$P(X0,U,1,4)
 Q Y
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(LAB) ; -- Return result as XML in @HMP@(#)
 N ATT,X,Y,I,J,P,NAMES,TAG
 D ADD("<panel>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(LAB(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . I $O(LAB(ATT,0)) D  S Y="" Q
 .. D ADD("<"_ATT_"s>")
 .. I ATT="value" S NAMES="id^test^result^interpretation^units^low^high^loinc^vuid^Z"
 .. E  S NAMES="code^name^Z"
 .. S I=0 F  S I=$O(LAB(ATT,I)) Q:I<1  D
 ... S X=$G(LAB(ATT,I)),Y="<"_ATT_" "_$$LOOP_"/>" D ADD(Y)
 .. D ADD("</"_ATT_"s>")
 . S X=$G(LAB(ATT)),Y="" Q:'$L(X)
 . I ATT="comment" S Y="<"_ATT_" xml:space='preserve'>"_$$ESC^HMPD(X)_"</"_ATT_">" Q
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . I $L(X)>1 S NAMES="code^name^Z",Y="<"_ATT_" "_$$LOOP_"/>"
 D ADD("</panel>")
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
