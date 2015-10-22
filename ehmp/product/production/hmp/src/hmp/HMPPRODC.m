HMPPRODC ;SLC/AGP - Environmental check for installations ;02/02/12
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ;This routine will check to see if the user is in a production account
 ;if they are then the user will not be allowed to install this
 ;patch/build/bundle
 ;
ENV ;
 I $$PROD^XUPROD D
 .W !,"You are attempting to install this software into your production account.",!,"At this time, this software is not ready for a production install."
 .W !!,"Please verify the account you're attempting to install into and",!,"if you believe you're correct, contact Ron Massey or Tana Defa.",!!,"INSTALLATION ABORTED!"
 .S XPDABORT=1
 Q
