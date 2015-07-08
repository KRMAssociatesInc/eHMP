package us.vistacore.vxsync.mvi;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;

public class SimpleServer {

	private static String ksPass = "welcome";
	private static String ctPass = "helloworld";
	private static String trustPass = "changeit";
	private static String keystore = "~/Projects/vistacore/ehmp/product/production/soap-handler/src/test/resources/serverKeystore.jks";
	private static String truststore = "~/Projects/vistacore/ehmp/product/production/soap-handler/src/test/resources/serverTruststore.jks";
	private static int portNum = 9999;
	
	public static void main(String[] args) {
		ServerSocket ss;
		System.setProperty("javax.net.ssl.keyStore", keystore);
		System.setProperty("javax.net.ssl.keyStorePassword", new String(ksPass));
		System.setProperty("javax.net.ssl.trustStore", truststore);
		System.setProperty("javax.net.ssl.trustStorePassword", new String(trustPass));
		try {
			ss = setupConnection();
			while (true) {
				try {
					System.out.println("Listening for connections on port " + portNum);
					Socket sock = ss.accept();
					System.out.println("Received connection");
//					printStream(sock.getInputStream());
					OutputStream os = sock.getOutputStream();
					System.out.println("Responding to client");
					os.write(response.getBytes());
					sock.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}
	
	private static void printStream(InputStream stream) throws IOException {
		int i = 0;
		int bytesRead = stream.read();
		while(bytesRead >= 0 && i < 1265) {
			System.out.print((char)bytesRead);
			bytesRead = stream.read();
			i++;
		}
		System.out.println("");
	}

	private static SSLServerSocket setupConnection() throws Exception {
		System.out.println("Setting up SSL certs");
		KeyStore ks = KeyStore.getInstance("JKS");
		ks.load(new FileInputStream(keystore), ksPass.toCharArray());
		KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
		kmf.init(ks, ctPass.toCharArray());

		SSLContext secureSocket = SSLContext.getInstance("TLS");
		secureSocket.init(kmf.getKeyManagers(), null, null);
		SSLServerSocketFactory ssf = secureSocket.getServerSocketFactory();
		SSLServerSocket ss = (SSLServerSocket) ssf.createServerSocket(portNum);
		ss.setNeedClientAuth(false);
		
		return ss;
	}
	
	private static String response = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:vaww=\"http://vaww.oed.oit.domain\">"+
	   "<soapenv:Header/>"+
	   "<soapenv:Body>" +
	      "<vaww:PRPA_IN201310UV02>" +
	      "<id root=\"2.16.840.1.113883.4.349\" extension=\"WS1407171236331391776995038\"/>" +
	    "<creationTime value=\"20140717123633\"/>" +
	    "<versionCode code=\"3.0\"/>"+
	    "<interactionId root=\"2.16.840.1.113883.1.6\" extension=\"PRPA_IN201310UV02\"/>"+
	    "<processingCode code=\"T\"/>" +
	    "<processingModeCode code=\"T\"/>"+
	    "<acceptAckCode code=\"NE\"/>"+
	    "<receiver typeCode=\"RCV\">"+
	        "<device classCode=\"DEV\" determinerCode=\"INSTANCE\">"+
	            "<id root=\"PSIM_TOOLS\" extension=\"200EHMP\"/>"+
	        "</device>"+
	    "</receiver>"+
	    "<sender typeCode=\"SND\">"+
	        "<device classCode=\"DEV\" determinerCode=\"INSTANCE\">"+
	            "<id root=\"2.16.840.1.113883.4.349\" extension=\"200M\"/>"+
	        "</device>"+
	    "</sender>"+
	    "<acknowledgement>"+
	        "<typeCode code=\"AA\"/>"+
	        "<targetMessage>"+
	            "<id root=\"2.16.840.1.113883.4.349\" extension=\"MCID-YOUR_IDENTIFIER_001\"/>"+
	        "</targetMessage>"+
	    "</acknowledgement>"+
	    "<controlActProcess classCode=\"CACT\" moodCode=\"EVN\">"+
	        "<code code=\"PRPA_TE201310UV02\"/>"+
	        "<subject typeCode=\"SUBJ\">"+
	            "<registrationEvent classCode=\"REG\" moodCode=\"EVN\">"+
	                "<id nullFlavor=\"NA\"/>"+
	                "<statusCode code=\"active\"/>"+
	                "<subject1 typeCode=\"SBJ\">"+
	                    "<patient classCode=\"PAT\">"+
	                        "<id root=\"2.16.840.1.113883.4.1\" extension=\"666000615^PI^200SSA^USSSA^A\"/>"+
	                        "<id root=\"2.16.840.1.113883.4.349\" extension=\"100622^PI^C877^USVHA\"/>"+
	                        "<id root=\"2.16.840.1.113883.4.349\" extension=\"000100031^PI^200ESR^USVHA^H\"/>"+
	                        "<id root=\"2.16.840.1.113883.4.349\" extension=\"000100031^PI^200ESR^USVHA^PCE\"/>"+
	                        "<id root=\"2.16.840.1.113883.4.349\" extension=\"5000000123V015819^NI^200M^USVHA^P\"/>"+
	                        "<statusCode code=\"active\"/>"+
	                        "<patientPerson classCode=\"PSN\" determinerCode=\"INSTANCE\">"+
	                            "<name nullFlavor=\"NA\"/>"+
	                        "</patientPerson>"+
	                    "</patient>"+
	                "</subject1>"+
	                "<custodian typeCode=\"CST\">"+
	                    "<assignedEntity classCode=\"ASSIGNED\">"+
	                        "<id root=\"2.16.840.1.113883.4.349\"/>"+
	                    "</assignedEntity>"+
	                "</custodian>"+
	                "<replacementOf typeCode=\"RPLC\">"+
	                    "<priorRegistration classCode=\"REG\" moodCode=\"EVN\">"+
	                        "<id root=\"2.16.840.1.113883.4.349\" extension=\"5000000123V015819^NI^200M^USVHA^D\"/>"+
	                    "</priorRegistration>"+
	                "</replacementOf>"+
	            "</registrationEvent>"+
	        "</subject>"+
	        "<queryAck>"+
	            "<queryId root=\"1.2.840.114350.1.13.99999.4567.34\" extension=\"MCID-YOUR_IDENTIFIER_001\"/>"+
	            "<queryResponseCode code=\"OK\"/>"+
	        "</queryAck>"+
	        "<queryByParameter>"+
	            "<queryId root=\"1.2.840.114350.1.13.99999.4567.34\" extension=\"MCID-YOUR_IDENTIFIER_001\"/>"+
	            "<statusCode code=\"new\"/>"+
	            "<responsePriorityCode code=\"I\"/>"+
	            "<parameterList>"+
	                "<patientIdentifier>"+
	                    "<value root=\"2.16.840.1.113883.4.349\" extension=\"5000000123V015819^NI^200M^USVHA\"/>"+
	                    "<semanticsText>Patient.Id</semanticsText>"+
	                "</patientIdentifier>"+
	            "</parameterList>"+
	        "</queryByParameter>"+
	    "</controlActProcess>"+

	      "</vaww:PRPA_IN201310UV02>"+
	   "</soapenv:Body>"+
	"</soapenv:Envelope>";
}
