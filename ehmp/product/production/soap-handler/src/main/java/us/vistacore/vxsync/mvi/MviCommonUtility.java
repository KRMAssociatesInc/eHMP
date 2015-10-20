package us.vistacore.vxsync.mvi;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.hl7.v3.CD;
import org.hl7.v3.CS;
import org.hl7.v3.CommunicationFunctionType;
import org.hl7.v3.EntityClassDevice;
import org.hl7.v3.II;
import org.hl7.v3.MCCIMT000100UV01Device;
import org.hl7.v3.MCCIMT000100UV01Receiver;
import org.hl7.v3.MCCIMT000100UV01Sender;
import org.hl7.v3.PRPAMT201307UV02PatientIdentifier;
import org.hl7.v3.TS;

import us.vistacore.vxsync.id.MviId;

public final class MviCommonUtility {

	public static final String ROOT_CODE_1 = "2.16.840.1.113883.4.349";
	public static final String ROOT_CODE_2 = "2.16.840.1.113883.1.6";
	public static final String ROOT_CODE_3 = "2.16.840.1.113883.4.349";
	public static final String ROOT_CODE_4 = "1.2.840.114350.1.13.99997.2.7788";
	public static final String ROOT_CODE_5 = "1.2.840.114350.1.13.99999.4567.34";
	
	private static String senderCode = "200EHMP"; 
	
	private static final DateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
	
	public static void setSenderCode(String code) {
		senderCode = code;
	}
	
	public static PRPAMT201307UV02PatientIdentifier getPatientIdentifierElement(MviId pid) {
		PRPAMT201307UV02PatientIdentifier patientID = new PRPAMT201307UV02PatientIdentifier();
		patientID.setSemanticsText("Patient.Id");
		patientID.getValue().add(createId(ROOT_CODE_1, pid.toString()));
		return patientID;
	}
	
	public static II createId(String root, String extension) {
		II id = new II();
		id.setExtension(extension);
		id.setRoot(root);
		return id;
	}
	
	public static CS createCode(String codeValue) {
		CS code = new CS();
		code.setCode(codeValue);
		return code;
	}
	
	public static CD createCodeElement(String code, String system) {
		CD cd = new CD();
		cd.setCode(code);
		cd.setCodeSystem(system);
		
		return cd;
	}
	
	public static MCCIMT000100UV01Sender getSender(){
		MCCIMT000100UV01Device device = new MCCIMT000100UV01Device();
		device.getId().add(createId(ROOT_CODE_4, senderCode));
		device.setClassCode(EntityClassDevice.DEV);
		device.setDeterminerCode("INSTANCE");
		MCCIMT000100UV01Sender sender = new MCCIMT000100UV01Sender();
		sender.setDevice(device);
		sender.setTypeCode(CommunicationFunctionType.SND);
		
		return sender;
	}
	
	public static MCCIMT000100UV01Receiver getReceiver(){
		MCCIMT000100UV01Receiver receiver = new MCCIMT000100UV01Receiver();
		MCCIMT000100UV01Device device = new MCCIMT000100UV01Device();
		device.setTypeId(createId(ROOT_CODE_3, null));
		device.setClassCode(EntityClassDevice.DEV);
		device.setDeterminerCode("INSTANCE");
		receiver.setDevice(device);
		receiver.setTypeCode(CommunicationFunctionType.RCV);
		
		return receiver;
	}
	
	public static TS getTimestamp(Date date){
		if(date == null) {
			date = new Date();
		}
		TS timestamp = new TS();
		timestamp.setValue(df.format(date));
		return timestamp;
	}
	
}
