HMPP2I ;SLC/MKB -- HMP patch 2 post install ;8/14/13  11:22
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; XPAR                          2263
 ;
PRE ; -- pre init
 Q
 ;
POST ; -- post init
 D PUT^XPAR("PKG","HMP VERSION",1,"1.02")
 D PUT^XPAR("SYS","HMP SYSTEM NAME",1,$$SYS^HMPUTILS)
 Q
