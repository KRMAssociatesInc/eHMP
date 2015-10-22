VPRJ1 ;SLC/KCM -- Menu Handling for JSON Store Utilities
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
DOMENU ; display menu and execute choice
 N SEL
 D HEADER
 F  D SHOWMENU S SEL=$$CHOICE() Q:SEL=""  D
 . D @SEL
 . D PAUSE
 . I SEL="START^VPRJ" D HEADER
 . I SEL="LOG^VPRJ" D HEADER
 . I SEL="PORT^VPRJ" D HEADER
 . I SEL="DELPID^VPRJ" D HEADER
 Q
HEADER ; display header information
 W !
 W "Listener Port: ",$$PORT^VPRJRCL,"   "
 W "Status: ",$$STATUS^VPRJRCL,"   "
 W "Log Level: ",$$LOG^VPRJRCL,"   "
 W "VPR Patients: ",$G(^VPRPTX("count","patient","patient"))
 W !
 Q
SHOWMENU ; display menu
 N X,I
 S I=0 F  S I=I+1,X=$P($T(MENULST+I),";;",2,99) Q:X="zzzzz"  W !,X
 W !
 Q
CHOICE() ; prompt for menu choice
 N X,I,MENU,DONE
 S I=0 F  S I=I+1,X=$P($T(MENUNUM+I),";;",2,99) Q:X="zzzzz"  S MENU($P(X,";"))=$P(X,";",2)
 F  D  Q:$G(DONE)
 . S X=$$PROMPT("Enter Selection","","N","Enter a number from the menu above")
 . I X="" S DONE=1 Q
 . I '$D(MENU(X)) W !,X," is not a valid selection." Q
 . I $D(MENU(X)) S X=MENU(X),DONE=1
 Q X
 ;
PROMPT(PROMPT,DEFAULT,TYPE,HELP) ; Return value for a prompt
 N X
 S DEFAULT=$G(DEFAULT),HELP=$G(HELP)
RETRY ;
 W !,PROMPT,": ",$S($L(DEFAULT):" "_DEFAULT_"//",1:" ")
 R X:300
 I X="?",$L(HELP) W !,HELP,! G RETRY
 I X="" S X=DEFAULT
 I TYPE="N",$L(X),'X W !,"Numeric input required."
 Q X
 ;
PAUSE ; Pause for a return
 N X
 W !,"Press return to continue"
 R X:300
 Q
MENULST ;; menu display list
 ;;-- Listener --                          -- Logging --
 ;; 1 Start HTTP Listener on Port 9080      4 Change Logging Level
 ;; 2 Stop HTTP Listener                    5 Clear Logs
 ;; 3 Change HTTP Listener Port             6 List Errors
 ;;
 ;;-- VPR Info --                          -- ODC Info --
 ;;11 List Synced Patients (alpha)         21 List Collections (ODC)
 ;;12 List Synced Patients (by PID)        22 Statistics (ODC)
 ;;13 Statistics for PID
 ;;14 Statistics for VPR (may be slow)
 ;;
 ;;-- VPR Tools --                         -- ODC Tools --
 ;;31 Re-index VPR                         41 Re-index ODC
 ;;32 Rebuild VPR                          42 Rebuild ODC
 ;;33 Delete Patient from VPR              43 Delete Collection
 ;;34 Reset VPR (deletes VPR data)         44 Reset ODC (deletes data)
 ;;
 ;;50 Rebuild All (VPR and ODC)            70 Reset All (VPR and ODC)
 ;;zzzzz
MENUNUM ;; menu selection numbers
 ;;1;START^VPRJ
 ;;2;STOP^VPRJ
 ;;3;PORT^VPRJ
 ;;4;LOG^VPRJ
 ;;5;CLEAR^VPRJ
 ;;6;ERROR^VPRJ
 ;;11;LISTPTA^VPRJ
 ;;12;LISTPTP^VPRJ
 ;;13;PIDSTAT^VPRJ
 ;;14;STATUS^VPRJ2P
 ;;21;LSTCTN^VPRJ2D
 ;;22;STATUS^VPRJ2D
 ;;31;RIDXALL^VPRJ2P
 ;;32;RBLDALL^VPRJ2P
 ;;33;DELPID^VPRJ
 ;;34;RESET^VPRJ
 ;;41;RIDXALL^VPRJ2D
 ;;42;RBLDALL^VPRJ2D
 ;;43;DELCTN^VPRJ2D
 ;;44;RESET^VPRJ2D
 ;;50;ASKFRBLD^VPRJ
 ;;70;ASKFRSET^VPRJ
 ;;zzzzz
 ;
