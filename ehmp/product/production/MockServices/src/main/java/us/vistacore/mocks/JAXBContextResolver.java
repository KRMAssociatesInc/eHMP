package us.vistacore.mocks;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;

import us.vistacore.mocks.resources.MockCDSResource;
import us.vistacore.mocks.resources.MockVlerDasResource;

import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.api.json.JSONJAXBContext;

@Provider
@SuppressWarnings("rawtypes")
public class JAXBContextResolver implements ContextResolver<JAXBContext> {

	private JAXBContext context;
	// defining these explicitly is only required to state to use the configuration for natural json handling
	// https://jersey.java.net/nonav/apidocs/1.5/jersey/com/sun/jersey/api/json/JSONConfiguration.Notation.html#NATURAL
	private Class[] types = { MockCDSResource.class, MockVlerDasResource.class };

	public JAXBContextResolver() throws Exception {
		this.context = new JSONJAXBContext(JSONConfiguration.natural().build(), types);
	}

	@Override
	public JAXBContext getContext(Class<?> objectType) {
		for (Class type : types) {
			if (type == objectType) {
				return context;
			}
		}
		return null;
	}
}