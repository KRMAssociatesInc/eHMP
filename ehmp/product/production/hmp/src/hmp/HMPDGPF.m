HMPDGPF ;SLC/MKB -- Patient Record Flags ;8/2/11  15:29
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; DGPFAPI                       3860
 ; XUAF4                         2171
 ;
 ; ------------ Get data from VistA ------------
 ;
EN(DFN,BEG,END,MAX,ID) ; -- find active flags
 ; [BEG,END,MAX not currently used]
 S DFN=+$G(DFN) Q:DFN<1  ;invalid patient
 N NUM,HMPF,HMPN,X,TEXT,HMPITM
 S NUM=$$GETACT^DGPFAPI(DFN,"HMPF")
 ;
 S HMPN=0 F  S HMPN=$O(HMPF(HMPN)) Q:HMPN<1  D  D:$D(HMPITM) XML(.HMPITM)
 . K HMPITM S X=$G(HMPF(HMPN,"FLAG"))
 . I $G(ID),$P(ID,"~",2)'=$P(X,U) Q
 . S HMPITM("id")=DFN_"~"_$P(X,U),HMPITM("name")=$P(X,U,2)
 . S HMPITM("approvedBy")=$G(HMPF(HMPN,"APPRVBY"))
 . S HMPITM("assigned")=$P($G(HMPF(HMPN,"ASSIGNDT")),U)
 . S HMPITM("reviewDue")=$P($G(HMPF(HMPN,"REVIEWDT")),U)
 . S HMPITM("type")=$P($G(HMPF(HMPN,"FLAGTYPE")),U,2)
 . S HMPITM("category")=$P($G(HMPF(HMPN,"CATEGORY")),U,2)
 . S X=$G(HMPF(HMPN,"ORIGSITE"))
 . S:X HMPITM("origSite")=$$STA^XUAF4(+X)_U_$P(X,U,2)
 . S X=$G(HMPF(HMPN,"OWNER"))
 . S:X HMPITM("ownSite")=$$STA^XUAF4(+X)_U_$P(X,U,2)
 . S X=$G(HMPF(HMPN,"TIULINK")) S:X HMPITM("document")=X
 . M TEXT=HMPF(HMPN,"NARR") S HMPITM("content")=$$STRING^HMPD(.TEXT)
 I $G(ID),'$D(HMPITM) D INACT(ID)
 Q
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(FLAG) ; -- Return patient data as XML in @HMP@(n)
 ; as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,ID
 D ADD("<flag>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(FLAG(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . S X=$G(FLAG(ATT)),Y="" Q:'$L(X)
 . I ATT="content" S Y="<"_ATT_" xml:space='preserve'>"_$$ESC^HMPD(X)_"</"_ATT_">" Q
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . S Y="<"_ATT_" code='"_$P(X,U)_"' name='"_$$ESC^HMPD($P(X,U,2))_"' />"
 D ADD("</flag>")
 Q
 ;
INACT(ID) ; -- inactivated flag
 D ADD("<flag id='"_ID_"' inactivated='1' />")
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
