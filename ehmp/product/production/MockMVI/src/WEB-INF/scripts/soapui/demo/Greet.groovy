/*
 *  SoapUI Pro, copyright (C) 2007-2011 eviware software ab
 */

package soapui.demo

class Greet 
{
   def name
   def log
   
   Greet(who, log) 
   { 
   	  name = who;
      this.log = log 
   }
 
   def salute() { log.info "Hello $name" }
 
   def static salute( who, log ) { log.info "Hello again $who!" }
}
