HMPENSZ1 ;SLC/KCM - Measure data sizes
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
DOMAINS(LST) ; RPC - list of domains for which sizing information is available
 N I,X,TAG,NAME
 S LST=1,LST(LST)="<domains>"
 F I=2:1 S X=$T(@("+"_I_"^HMPENSZ")) Q:'$L(X)  I (X?1.7U1" ;".E),(X["@name ") D
 . S TAG=$P(X," ") S NAME=$E(X,$F(X,"@name "),$L(X))
 . S LST=LST+1,LST(LST)="<domain tag='"_TAG_"'>"_NAME_"</domain>"
 S LST=LST+1,LST(LST)="</domains>"
 Q
STATS(LST,TAG) ; RPC - list stats, patients, & raw data for a domain
 N X,STATS,FREQ,DOMAIN
 S X=$T(@(TAG_"^HMPENSZ"))
 S DOMAIN=$E(X,$F(X,"@name "),$L(X))
 S TYPE=$P(X,"@type ",2),TYPE=$P(TYPE," ")
 S LST=0
 I '$D(^XTMP("HMPENSZ-DOMAINS",TAG)) D ERRMSG(DOMAIN_"("_TAG_") size measurements unavailable.") Q
 ;
 M STATS=^XTMP("HMPENSZ-DOMAINS",TAG,"STATS")
 ; M FREQ=^XTMP("HMPENSZ-DOMAINS",TAG,"FREQ") - DON'T NEED THIS... 
 ;
 S X="<stats domain='"_DOMAIN_"' tag='"_TAG_"' type='"_TYPE_"' "
 S X=X_"patients='"_STATS("TotalPatients")_"' "
 S X=X_"records='"_STATS("TotalRecords")_"' >"
 S LST=LST+1,LST(LST)=X
 ;
 S LST=LST+1,LST(LST)="<mean value='"_STATS("MEAN")_"' >"
 D PTS2XML("MEAN")
 S LST=LST+1,LST(LST)="</mean>"
 ;
 S LST=LST+1,LST(LST)="<median value='"_STATS("MEDIAN")_"' >"
 D PTS2XML("MEDIAN")
 S LST=LST+1,LST(LST)="</median>"
 ;
 S LST=LST+1,LST(LST)="<mode value='"_STATS("MODE")_"' >"
 D PTS2XML("MODE")
 S LST=LST+1,LST(LST)="</mode>"
 ;
 S LST=LST+1,LST(LST)="<max value='"_STATS("MAX")_"' >"
 D PTS2XML("MAX")
 S LST=LST+1,LST(LST)="</max>"
 ;
 D FREQ
 S LST=LST+1,LST(LST)="</stats>"
 Q
PTS2XML(STAT) ; add patients to the return XML
 ; expects: LST, STATS
 ; <patient dfn=4323423 count=342234 icn=3424324243>doe,john</patient>
 N I,X,NM,DFN,CNT,ICN
 S I=0 F  S I=$O(STATS(STAT,I)) Q:'I  D
 . S X=STATS(STAT,I)
 . S NM=$P(X,U),DFN=$P(X,U,2),CNT=$P(X,U,3)
 . S ICN=$$GETICN^MPIF001(DFN) S:+ICN<0 ICN=""
 . S LST=LST+1
 . S LST(LST)="<patient dfn='"_DFN_"' count='"_CNT_"' icn='"_ICN_"' >"_NM_"</patient>"
 Q
FREQ ; add RecordCount=PatientCount strings
 N X,I
 S LST=LST+1,LST(LST)="<recordCount>"
 S X="",I=0 F  S I=$O(^XTMP("HMPENSZ-DOMAINS",TAG,"FREQ",I)) Q:'I  D
 . S X=X_I_"," I $L(X)>72 S LST=LST+1,LST(LST)=X,X=""
 I $L(X) S LST=LST+1,LST(LST)=X
 D NOCOMMA
 S LST=LST+1,LST(LST)="</recordCount>"
 ; 
 S LST=LST+1,LST(LST)="<patientCount>"
 S X="",I=0 F  S I=$O(^XTMP("HMPENSZ-DOMAINS",TAG,"FREQ",I)) Q:'I  D
 . S X=X_^XTMP("HMPENSZ-DOMAINS",TAG,"FREQ",I)_","
 . I $L(X)>72 S LST=LST+1,LST(LST)=X,X=""
 I $L(X) S LST=LST+1,LST(LST)=X
 D NOCOMMA
 S LST=LST+1,LST(LST)="</patientCount>"
 Q
NOCOMMA ;
 I $E(LST(LST),$L(LST(LST)))="," S LST(LST)=$E(LST(LST),1,$L(LST(LST))-1)
 Q
ERRMSG(X) ; build error message
 S LST=LST+1,LST(LST)="<error msg='"_X_"' />"
 Q
CF ; Count frequencies
 S DOM="" F  S DOM=$O(^XTMP("HMPENSZ-DOMAINS",DOM)) Q:DOM=""  D
 . S (I,T)=0 F  S I=$O(^XTMP("HMPENSZ-DOMAINS",DOM,"FREQ",I)) Q:'I  S T=T+1
 . W !,DOM,"=",T
 Q
