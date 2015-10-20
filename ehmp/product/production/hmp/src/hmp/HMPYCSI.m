HMPYCSI ;SLC/KCM -- Convert system identifier in UID's for HMP objects
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
EN ; Prompt for if the system should really convert
 N DIR,DTOUT,DUOUT,DIRUT,DIROUT,X,Y,DA,FROMSYS,TOSYS
 S DIR(0)="F:4:40",DIR("A")="Convert from (System ID or Domain Name)"
 S DIR("?")="Enter the four character system ID or the domain name."
 D ^DIR Q:$D(DIRUT)
 S Y=$$UP^XLFSTR(Y),TOSYS=$$SYS^HMPUTILS
 I $L(Y)'=4,Y["." S Y=$$CNV^XLFUTL($$CRC16^XLFCRC(Y),16)
 I Y=TOSYS W !,"Same ID as this system." Q
 W !,"This will (brute force) replace all instances of "":"_Y_":"""
 W !,"                               with instances of "":"_TOSYS_":"""
 W !,"Continue? NO//" R X:300 Q:$E($$UP^XLFSTR(X))'="Y"
 ;
 N FROMSYS
 S FROMSYS=Y
 W !,"File 800000.1:  "
 D CONV(FROMSYS,800000.1)
 W !,"File 800000.11: "
 D CONV(FROMSYS,800000.11)
 Q
CONV(FROMSYS,FILENUM) ; FROMSYS is the system id to be converted
 N TOSYS,FDAIEN
 S TOSYS=$$SYS^HMPUTILS
 S FDAIEN=0 F  S FDAIEN=$O(^HMP(FILENUM,FDAIEN)) Q:'FDAIEN  D CONV1(FILENUM,FDAIEN,FROMSYS,TOSYS)
 Q
CONV1(FILENUM,FDAIEN,FROMSYS,TOSYS) ; convert one record
 ; system id is assumed to be the fourth piece
 N X0,UID,SYS,WPORIG,WPNEW,VAL
 S X0=$G(^HMP(FILENUM,FDAIEN,0)),UID=$P(X0,"^",1),SYS=$P(UID,":",4)
 Q:SYS=TOSYS  ; already native to this account
 S $P(UID,":",4)=TOSYS
 M WPORIG=^HMP(FILENUM,FDAIEN,1)
 S VAL=$$WP2X(.WPORIG)
 S VAL=$$SWAP(VAL,":"_FROMSYS_":",":"_TOSYS_":")
 D X2WP(VAL,.WPNEW)
 D SAVE(FILENUM,FDAIEN,UID,.WPNEW)
 W "."
 Q
SWAP(X,FIND,REPLACE) ; swap string FIND with string REPLACE in X
 N Y,POS,SIZE
 S Y="",POS=0,SIZE=$L(FIND)
 F  S POS=$F(X,FIND,POS) Q:'POS  S $E(X,POS-SIZE,POS-1)=REPLACE
 Q X
 ;
WP2X(WP) ; Return a single string by concatenating the WP fields
 N I,X,ERR
 S X="",ERR=0
 S I=0 F  S I=$O(WP(I)) Q:'I  D  Q:ERR
 . I ($L(X)+$L(WP(I,0)))>32000 D  Q
 . . S ERR=1,X=""
 . . W !,"Can't convert documents longer than 32K",!
 . S X=X_WP(I,0)
 Q X
X2WP(X,WP,SIZE) ; Convert a string to WP field with strings no longer than SIZE
 N START,STOP,LINE,IDX
 S SIZE=$G(SIZE,245)-1 Q:'SIZE
 S START=1,IDX=0
 F  Q:START>$L(X)  D
 . S STOP=START+SIZE,LINE=$E(X,START,STOP),START=STOP+1
 . I $L(LINE) S IDX=IDX+1,WP(IDX,0)=LINE
 Q
SAVE(FILENUM,FDAIEN,UID,WP) ;
 N FDA,DIERR,ERR
 S FDA(FILENUM,FDAIEN_",",.01)=UID
 D FILE^DIE("","FDA","ERR")
 I $D(DIERR) W !,"Save failed for UID: ",UID,! D WOUT("ERR") Q
 I $D(WP) D WP^DIE(FILENUM,FDAIEN_",",1,"","WP","ERR")
 I $D(DIERR) W !,"Save failed for WP: ",UID,! D WOUT("ERR") Q
 D CLEAN^DILF
 Q
 ;
CHECK(FILENUM) ; Check JSON integrity of FILENUM
 S IEN=0 F  S IEN=$O(^HMP(FILENUM,IEN)) Q:'IEN  D CHECK1(FILENUM,IEN)
 Q
CHECK1(FILENUM,IEN) ;
 N JSON,OBJ,ERR,I
 S I=0 F  S I=$O(^HMP(FILENUM,IEN,1,I)) Q:'I  S JSON(I)=^HMP(FILENUM,IEN,1,I,0)
 I $D(JSON)'>1 W !,FILENUM,":",IEN,?20,"no JSON present" Q
 D DECODE^HMPJSON("JSON","OBJ","ERR")
 I $D(ERR) W !,FILENUM,":",IEN,?20,$G(ERR(1))
 W "."
 Q
 ;
TX2WP ;
 N INPUT,OUTPUT
 S INPUT="abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz"
 D X2WP(INPUT,.OUTPUT,5)  W ! D WOUT("OUTPUT") K OUTPUT
 D X2WP(INPUT,.OUTPUT,10) W ! D WOUT("OUTPUT") K OUTPUT
 S INPUT=$E(INPUT,1,25)
 D X2WP(INPUT,.OUTPUT,5)  W ! D WOUT("OUTPUT")
 Q
TSWAP ;
 ;;{"uid":"urn:va:personphoto:F484:1123","summary":"gov.va.cpe.hmp.PersonPhoto@266713c1","personUid":"urn:va:user:F484:1123"}
 N X
 S X=$P($T(TSWAP+1),";;",2,99)
 W !,X
 S X=$$SWAP(X,":F484:",":0F0F:")
 W !,X,!
 Q
TSAVE ;
 S IEN=$O(^HMP(800000.11,"B","urn:va:personphoto:2222:123",0)) Q:'IEN
 W !,"IEN:",IEN
 D CONV1(IEN,"2222","3333")
 Q
 ;
WOUT(ROOT) ; Write out a variable named by ROOT
 W !,ROOT," -----"
 N X
 S X=ROOT F  S X=$Q(@X) Q:'$L(X)  Q:$E(X,1,$L(ROOT))'=ROOT  W !,X,"=",@X
 Q
