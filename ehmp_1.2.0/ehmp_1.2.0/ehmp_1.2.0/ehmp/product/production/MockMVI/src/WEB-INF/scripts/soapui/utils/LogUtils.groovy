/*
 *  SoapUI Pro, copyright (C) 2007-2011 eviware software ab
 */

package soapui.utils

import com.eviware.soapui.SoapUI
import com.eviware.soapui.impl.wsdl.testcase.WsdlTestCaseRunner
import org.apache.log4j.Logger

/**
 * Various utility methods related to logging.
 * 
 * @author <a href="mailto:ole@eviware.com">Ole Matzura</a>
 * @author <a href="mailto:nenadn@eviware.com">Nenad V. Nikolic</a>
 */
class LogUtils
{
   def static clearLog( title ) 
   { 
      def logArea = SoapUI.logMonitor
      if( logArea != null )
      {
         def ix = logArea.indexOfTab( title );
         if( ix >= 0 )
         {
            def logPanel = logArea.getComponentAt( ix )
            logPanel.logList.model.clear()
         }
      }
   }
   
   /**
    * Internal helper for 
    * {@link LogUtils#saveResponseAsFile(Logger log, WsdlTestCaseRunner testRunner, String testStepName).
    * 
    * @param testStepName name of a test step for which to build a filename 
    */
   private def static getResponseFilename(testStepName)
   {
      String result
      Date date = new Date()
      java.text.DateFormat dateFormat = new java.text.SimpleDateFormat('yyyyMMdd-kkmmss')
      result = "${dateFormat.format(date)}-${testStepName}-response.xml"
   }
   
   /**
    * Save response of any test step response as a separate external file.
    * Output file name contains a timestamp (allowing for responses to be sorted chronologically)
	* and name of the test step and the default "-response.xml" suffix.
	* 
	* @param testRunner a test case runner used to access response
	* @param testStepName name of the test step which response is accessed
	* @param log Logger used to log progress
    */
   def static saveResponseAsFile(WsdlTestCaseRunner testRunner, String testStepName, Logger log)
   {
      String testStepResponse
      def testStep = testRunner.testCase.testSteps[testStepName]
      if (testStep == null) {
	     if (log != null)
            log.warn("Test step '${testStepName}' does not exist. No response will be saved.")
         return
      }
	  if (testStep.testRequest == null) {
	     log.warn("Test step '${testStepName}' does not have a test request. No response will be saved.")
		 return
	  }
      testStepResponse = testStep.testRequest.response.contentAsString      
      String respFilename = getResponseFilename(testStepName)
      def file = new PrintWriter (respFilename)
      file.println(testStepResponse)
      file.flush()
      file.close()
      if (log != null && log.isInfoEnabled())
         log.info("Saved response in file: ${respFilename}")
   }
   
   /**
    * Save response of any test step response as a separate external file.
    * Same as LogUtils#saveResponseAsFile(Logger log, WsdlTestCaseRunner testRunner, String testStepName)
    * only silent, i.e. without logging. 
    */
   def static saveResponseAsFile(WsdlTestCaseRunner testRunner, String testStepName)
   {
      saveResponseAsFile(testRunner, testStepName, null)
   }
}
