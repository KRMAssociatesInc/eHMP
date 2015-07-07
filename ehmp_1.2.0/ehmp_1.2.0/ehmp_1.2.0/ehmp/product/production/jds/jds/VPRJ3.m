VPRJ3 ;SLC/KCM -- Display Log Entries
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
EN ; enter here -- list today's entries, otherwise prompt date or name
 Q
DATES ; list log entry totals by reverse chronological date
 Q
ENTRIES(DATE) ; list log entries for a selected date
 Q
 ;
 ; KEY is $Hday,$Job,Id  example: 62900,2985,851
 ; if IOM is available, use that as right margin
 ; if ScreenSize or IOSL is available, use that as screen length
 ;
ENTRY(KEY) ; show log entry for key, prompting for details
 Q
ALL(KEY) ; show all for key
 Q
HEADER(KEY) ; show header for key
 Q
BODY(KEY) ; show body for key
 Q
SYMBOLS(KEY) ; show symbols for key
 Q
STACK(KEY) ; show stack for key
 Q
