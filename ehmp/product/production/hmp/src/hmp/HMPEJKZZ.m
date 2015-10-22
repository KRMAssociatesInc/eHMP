OPTRPC ;
 D DT^DICRW
 W !,"List an OPTION and the RPC list in collating sequence",!
 ;
 K DIC,J,LST,OPT,P,X,Y S DIC=19,DIC(0)="AEMQZ",DIC("A")="Select OPTION to list: "
 D ^DIC Q:'(Y>0)  S OPT=+Y,OPT(0)=Y(0)
 ; save all the RPC entries in LST
 S J=0
 F  S J=$O(^DIC(19,OPT,"RPC",J)) Q:'J  S X=$G(^(J,0)),P=+$P(X,U),Y=$G(^XWB(8994,P,0)),LST($P(Y,U),P)=Y
 ;
 W !!!,$$HTE^XLFDT($H),!!,"Option NAME: "_$P(OPT(0),U)_"    MENU TEXT: "_$P(OPT(0),U,2)
 W !!,"       RPC"_$J("tag^routine",39),!
 ; use $QUERY to list them with a counter and tag^routine, blank line after every 5th RPC
 S V="LST",J=0
 F  S V=$Q(@V) Q:V=""  S J=J+1,X=$P(@V,U) W !,"   "_$J(J,2)_". "_X_$J(" ",31-$L(X))_$P(@V,U,2,3) W:'(J#5) !
 W !!,"   RPC total: "_J,!!
 Q
 ;
