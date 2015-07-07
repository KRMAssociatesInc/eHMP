package us.vistacore.vxsync.utility;

import org.codehaus.jettison.mapped.Configuration;
import org.codehaus.jettison.mapped.MappedXMLOutputFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLEventWriter;
import javax.xml.stream.XMLInputFactory;

import java.io.*;

public class DataConverter {


	public static String convertXMLtoJSON(String xml) throws Exception {
		XMLEventReader reader = XMLInputFactory.newInstance()
				.createXMLEventReader(new StringReader(xml));
		ByteArrayOutputStream arrayStream = new ByteArrayOutputStream();
		Configuration config = new Configuration();
		config.setIgnoreNamespaces(true);
		XMLEventWriter writer = new MappedXMLOutputFactory(config)
				.createXMLEventWriter(arrayStream);
		writer.add(reader);
		writer.close();
		reader.close();
		String json = new String(arrayStream.toByteArray());
		return json;
	}

	/*
	@param Object o - Accepts the object to be converted to JSON format
	@return String json - returns the json format of the object.
	 */
	public static String convertObjectToJSON(Object o) throws JsonProcessingException {
		ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		String json = ow.writeValueAsString(o);
		return json;
	}



	public static String convertFileToJSON(String args) throws Exception {
		String xml;
		if (args != null && args.length() > 0)
		{
			File file = new File(args);
			try (FileInputStream fis = new FileInputStream(file)) {
				byte[] data = new byte[(int) file.length()];
				fis.read(data);
				fis.close();
				xml = new String(data, "UTF-8");
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		} else {
			System.out.println("No file parameter found, using sample XML file instead.");
			xml = "<root><foo stuff=\"hi2u\">foo string</foo><bar><x>1</x><y>5</y></bar></root>";
		}
		return (convertXMLtoJSON(xml));
	}
}