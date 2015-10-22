package us.vistacore.vxsync.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import java.io.IOException;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class Utils
{

	//private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");
	private static final Logger LOG = LoggerFactory.getLogger(Utils.class);


	public static boolean isEmpty(String str)
	{
		if(str==null)
			return true;
		
		if(str.length()==0)
			return true;
		
		return false;
	}

	/**
	 * Calendar to String format.
	 *
	 * Method is synchronized because instances of SimpleDateFormat are not thread safe.
	 *
	 * @param calendar Calendar instance
	 * @return Formatted date string as yyyyMMddHHmmss, null if Calendar is null.
	 */
	public static synchronized String formatCalendar(Calendar calendar) {
		if (calendar == null) return null;

		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");
		
		DATE_FORMAT.setCalendar(calendar);
		return DATE_FORMAT.format(calendar.getTime());
	}

	/*
	This method converts
	 */
	public static XMLGregorianCalendar stringToXMLGregorianCalendar(String s)
	{
		try
		{
			LOG.debug("Utils.stringToXMLGregorianCalendar - Input string: " + s);
			
			SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");
			
			Date dateWithoutTimeZone = DATE_FORMAT.parse(s);
			LOG.debug("Utils.stringToXMLGregorianCalendar - Java Date (without setting time zone) : " + dateWithoutTimeZone.toString());
			
			TimeZone serverTimeZone = TimeZone.getDefault();
			DATE_FORMAT.setTimeZone(serverTimeZone);
			Date date = DATE_FORMAT.parse(s);
			LOG.debug("Utils.stringToXMLGregorianCalendar - Java Date (with setting time zone) : " + date.toString() + " Time Zone : " + serverTimeZone.getDisplayName());
			GregorianCalendar gregorianCalendar =
					(GregorianCalendar) GregorianCalendar.getInstance();
			gregorianCalendar.setTime(date);
			LOG.debug("Utils.stringToXMLGregorianCalendar - GregorianCalendar: " + gregorianCalendar.toString());
			XMLGregorianCalendar result = DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
			LOG.debug("Utils.stringToXMLGregorianCalendar - XMLGregorianCalendar: " + result.toString());
			return result;
		}
		catch(Exception e)
		{
			LOG.error("Exception while converting string to XMLGregorianCalendar"+e);
			return null;
		}
	}


	/**
	 * Parses XML String
	 * @param xmlResponse XML String representation
	 * @return Parsed XML Document
	 * @throws javax.xml.parsers.ParserConfigurationException
	 * @throws java.io.IOException
	 * @throws org.xml.sax.SAXException
	 */
	public static org.w3c.dom.Document parseXMLDocument(String xmlResponse) throws ParserConfigurationException, IOException, SAXException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setFeature("http://javax.xml.XMLConstants/feature/secure-processing", true);
		factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
		factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

		DocumentBuilder builder = factory.newDocumentBuilder();

		InputSource is = new InputSource(new StringReader(xmlResponse));

		return builder.parse(is);
	}



}
