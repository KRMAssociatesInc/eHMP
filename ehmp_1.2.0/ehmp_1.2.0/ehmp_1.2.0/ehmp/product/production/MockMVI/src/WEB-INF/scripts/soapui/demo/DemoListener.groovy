/*
 *  SoapUI Pro, copyright (C) 2007-2011 eviware software ab
 */

package soapui.demo

import com.eviware.soapui.SoapUI
import com.eviware.soapui.model.support.TestRunListenerAdapter
import com.eviware.soapui.model.testsuite.TestRunContext
import com.eviware.soapui.model.testsuite.TestRunner

public class DemoListener extends TestRunListenerAdapter
{
	private long startTime

	public void beforeRun( TestRunner testRunner, TestRunContext runContext )
	{
		startTime = System.nanoTime()
	}
	
	public void afterRun( TestRunner testRunner, TestRunContext runContext )
	{
		long endTime = System.nanoTime()
		SoapUI.log.info( "TestCase [" + testRunner.testCase.name + "] took " + (endTime-startTime) + " groovy nanoseconds!" );
	}
}
