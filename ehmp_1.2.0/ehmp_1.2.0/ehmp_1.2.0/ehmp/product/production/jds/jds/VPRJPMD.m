VPRJPMD ;SLC/KCM -- Set up Meta Data for VPR Indexing
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
SETUP ;
 K ^VPRMETA
 S ^VPRMETA("system")=$$SYSID^VPRJRUT()
 S ^VPRMETA("version")=$P($T(VERSION^VPRJVER),";;",2)
 S ^VPRMETA("version","build")=$P($T(BUILD^VPRJVER),";;",2)
 ;
 D INDEXES
 D DOMAINS
 D BLDMETA^VPRJCD("template","TLT","VPRJPMT")  ; VPR templates
 D BLDMETA^VPRJCD("template","TLT","VPRJDMT")  ; ODC templates
 D BLDMETA^VPRJCD("link","LINKED","VPRJPMR")   ; VPR and ODC linkages
 ;
 ; "every" index is special index that references all the UID's for a patient
 S ^VPRMETA("index","every")="every"
 S ^VPRMETA("index","every","common","levels")=0
 S ^VPRMETA("index","every","common","method")="every"
 ;
 S ^VPRMETA("codes","med","productFormCode")=""
 S ^VPRMETA("codes","med","medStatus")=""
 S ^VPRMETA("codes","med","medType")=""
 S ^VPRMETA("codes","med","products[]","ingredientCode")=""
 S ^VPRMETA("codes","med","products[]","drugClassCode")=""
 S ^VPRMETA("codes","med","products[]","suppliedCode")=""
 S ^VPRMETA("codes","med","products[]","ingredientRole")=""
 S ^VPRMETA("codes","med","dosages[]","routeCode")=""
 S ^VPRMETA("codes","med","dosages[]","bodySite")=""
 S ^VPRMETA("codes","med","fills[]","fillStatus")=""
 ;
 L +^VPRPTJ("JPID"):2 E  QUIT
 I '$G(^VPRPTJ("JPID")) S ^VPRPTJ("JPID")=0 ; initialize PID counter
 I '$D(^VPRPTX("count","patient","patient")) S ^VPRPTX("count","patient","patient")=0
 L -^VPRPTJ("JPID")
 S ^VPRCONFIG("timeout")=30
 Q
INDEXES ; -- build meta data for all indexes
 K ^VPRMETA("index")
 K ^VPRMETA("collection")
 ;
 ; Patient Indexes
 D BLDMETA^VPRJCD("index:attr","IDXLIST","VPRJPMX")
 D BLDMETA^VPRJCD("index:tally","IDXTALLY","VPRJPMX")
 D BLDMETA^VPRJCD("index:time","IDXTIME","VPRJPMX")
 D BLDMETA^VPRJCD("index:attr","IDXATTR","VPRJPMX")
 D BLDMETA^VPRJCD("index:xattr","XIDXATTR","VPRJPMX")
 ; D BLDMETA^VPRJCD("index:match","IDXMATCH","VPRJPMX")
 ;
 ; Non-Patient Data Indexes
 D BLDMETA^VPRJCD("index:tally","IDXTALLY","VPRJDMX")
 D BLDMETA^VPRJCD("index:attr","IDXATTR","VPRJDMX")
 Q
 ;
 ;
DOMAINS ; -- Map collections to domains
 N I,X,COLL,DOMAIN
 S I=0 F  S I=I+1,X=$P($T(DOMAIN+I^VPRJPMX),";;",2,99) Q:X="zzzzz"  D
 . S COLL=$P(X,":"),DOMAIN=$P(X,":",2)
 . S ^VPRMETA("collection",COLL,"domain")=DOMAIN
 Q
