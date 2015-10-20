HMPDIB ;SLC/MKB -- Integrated Billing (insurance) ;3/14/12  09:01
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01,2011;Build 49
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ;   IBBAPI                      4419
 ;
 ;
 ; ------------ Get data from VistA ------------
 ;
EN(DFN,BEG,END,MAX,ID) ; -- find patient's insurance data
 N X,I,HMPX,HMPITM,HMPCNT,HMPINS
 S DFN=+$G(DFN) Q:DFN<1
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999)
 ;
 ; get one policy
 ;I $G(ID) D EN1(ID,.HMPITM),XML(.HMPITM) Q
 ;
 ; get all policies
 S X=$$INSUR^IBBAPI(DFN,,,.HMPX,"*") Q:X<1
 S (I,HMPCNT)=0 F  S I=$O(HMPX("IBBAPI","INSUR",I)) Q:I<1  D  Q:HMPCNT'<MAX
 . M HMPINS=HMPX("IBBAPI","INSUR",I) K HMPITM
 . I $G(ID),DFN'=+ID!(+HMPINS(1)'=$P(ID,";",2))!(+HMPINS(8)'=$P(ID,";",3)) Q
 . S HMPITM("id")=DFN_";"_+HMPINS(1)_";"_+HMPINS(8) ; = DFN;COMPANY;POLICY
 . S HMPITM("company")=HMPINS(1),X=HMPINS(2)
 . F J=23,24,3,4,5 S X=X_U_HMPINS(J)
 . S HMPITM("company","address")=X
 . S X=HMPINS(6) S:$L(X) HMPITM("company","telecom")=$$FORMAT(X)
 . S HMPITM("effectiveDate")=HMPINS(10)
 . S HMPITM("expirationDate")=HMPINS(11)
 . S HMPITM("groupName")=$P(HMPINS(8),U,2)
 . S HMPITM("groupNumber")=HMPINS(18)
 . S X=HMPINS(21),HMPITM("insuranceType")=X
 . ; HMPITM("insuranceType")=$$GET^XPAR(355.1,+X_",",.03) ;Maj Catg
 . S HMPITM("relationship")=$P(HMPINS(19),U,2)
 . S HMPITM("subscriber")=HMPINS(14)_U_HMPINS(13)
 . ; HMPITM("subscriber","address")
 . ; HMPITM("subscriber","telecom")
 . ; HMPITM("memberID")
 . S HMPITM("facility")=$$FAC^HMPD ;local stn#^name
 . D XML(.HMPITM) S HMPCNT=HMPCNT+1
 Q
 ;
FORMAT(X) ; -- enforce (xxx)xxx-xxxx phone format
 S X=$G(X) I X?1"("3N1")"3N1"-"4N.E Q X
 N P,N,I,Y S P=""
 F I=1:1:$L(X) S N=$E(X,I) I N=+N S P=P_N
 S:$L(P)<10 P=$E("0000000000",1,10-$L(P))_P
 S Y=$S(P:"("_$E(P,1,3)_")"_$E(P,4,6)_"-"_$E(P,7,10),1:"")
 Q Y
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(ITEM) ; -- Return patient data as XML in @HMP@(n)
 ; as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,SUB
 D ADD("<insurancePolicy>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(ITEM(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S X=$G(ITEM(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)
 . I $L(X,"^")>1 S Y="<"_ATT_" code='"_$P(X,U)_"' name='"_$$ESC^HMPD($P(X,U,2))
 . S SUB=$O(ITEM(ATT,"")) I SUB="" S Y=Y_"' />" Q
 . S Y=Y_"' >" D ADD(Y) S X=$G(ITEM(ATT,SUB))
 . I SUB="address" D ADDR(X)
 . I SUB="telecom" D PHONE(X)
 . S Y="</"_ATT_">"
 D ADD("</insurancePolicy>")
 Q
 ;
ADDR(X) ; -- XML address node from X=street1^st2^st3^city^state^zip
 N I,Y Q:$L(X)'>5  ;no data
 S Y="<address"
 F I=1,2,3 I $L($P(X,U,I)) S Y=Y_" streetLine"_I_"='"_$$ESC^HMPD($P(X,U,I))_"'"
 I $L($P(X,U,4)) S Y=Y_" city='"_$$ESC^HMPD($P(X,U,4))_"'"
 I $L($P(X,U,5)) S Y=Y_" stateProvince='"_$P(X,U,5)_"'"
 I $L($P(X,U,6)) S Y=Y_" postalCode='"_$P(X,U,6)_"'"
 S Y=Y_" />" D ADD(Y)
 Q
 ;
PHONE(X) ; -- XML telecom node from X=home^cell^work numbers
 N I,Y Q:$L(X)'>2  ;no data
 D ADD("<telecomList>")
 I $L($P(X,U,1)) S Y="<telecom usageType='H' value='"_$P(X,U,1)_"' />" D ADD(Y)
 I $L($P(X,U,2)) S Y="<telecom usageType='MC' value='"_$P(X,U,2)_"' />" D ADD(Y)
 I $L($P(X,U,3)) S Y="<telecom usageType='WP' value='"_$P(X,U,3)_"' />" D ADD(Y)
 D ADD("</telecomList>")
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
