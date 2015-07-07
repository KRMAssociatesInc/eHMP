/*
 *  SoapUI Pro, copyright (C) 2007-2011 eviware software ab
 */

package soapui.demo

import com.eviware.soapui.model.ModelItem;
import com.eviware.soapui.support.UISupport
import com.eviware.soapui.support.action.support.AbstractSoapUIAction

public class DemoAction extends AbstractSoapUIAction
{
	public DemoAction()
	{
		super( "Demo Action", "Demonstrates an extension to SoapUI Pro!" )
	}
	
	public void perform( ModelItem target, Object param )
	{
		UISupport.showInfoMessage( "Welcome to my groovy action in project [" + target.name + "]!" )
	}
}
