package us.vistacore.vxsync.mvi;

import static us.vistacore.vxsync.mvi.MviCommonUtility.ROOT_CODE_1;
import static us.vistacore.vxsync.mvi.MviCommonUtility.ROOT_CODE_2;
import static us.vistacore.vxsync.mvi.MviCommonUtility.ROOT_CODE_5;
import static us.vistacore.vxsync.mvi.MviCommonUtility.createCode;
import static us.vistacore.vxsync.mvi.MviCommonUtility.createCodeElement;
import static us.vistacore.vxsync.mvi.MviCommonUtility.createId;
import static us.vistacore.vxsync.mvi.MviCommonUtility.getPatientIdentifierElement;
import static us.vistacore.vxsync.mvi.MviCommonUtility.getSender;
import static us.vistacore.vxsync.mvi.MviCommonUtility.getTimestamp;

import java.util.List;
import java.util.UUID;

import javax.xml.bind.JAXBElement;

import org.hl7.v3.ActClassControlAct;
import org.hl7.v3.ObjectFactory;
import org.hl7.v3.PRPAIN201309UV02;
import org.hl7.v3.PRPAIN201309UV02QUQIMT021001UV01ControlActProcess;
import org.hl7.v3.PRPAMT201307UV02ParameterList;
import org.hl7.v3.PRPAMT201307UV02PatientIdentifier;
import org.hl7.v3.PRPAMT201307UV02QueryByParameter;
import org.hl7.v3.XActMoodIntentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.id.MviId;

class MessageBuilder {
	
	private ObjectFactory factory = new ObjectFactory();
	private static final Logger LOG = LoggerFactory.getLogger(MessageBuilder.class);
	
	public PRPAIN201309UV02 getCorrespondingIds(MviId pid) {
		LOG.debug("Start building 1309 request - get corresponding ids");
		LOG.info("Building 1309 SOAP message for " + pid.toString());
		UUID messageId = UUID.randomUUID();
		LOG.debug("Assigning message id " + messageId.toString());
		
		PRPAIN201309UV02 message = factory.createPRPAIN201309UV02();

		//Set root level parameters
		message.setId(createId(ROOT_CODE_1, "MCID-"+messageId.toString()));
		message.setCreationTime(getTimestamp(null));
		message.setVersionCode(createCode("3.0"));
		message.setInteractionId(createId(ROOT_CODE_2, null));
		message.setProcessingCode(createCode("T"));
		message.setProcessingModeCode(createCode("T"));
		message.setAcceptAckCode(createCode("AL"));
		
		//Set Receiver not available via API
		//Set Sender
		message.setSender(getSender());
		
		//Build controlActProcess
		PRPAIN201309UV02QUQIMT021001UV01ControlActProcess controlActProcess = factory.createPRPAIN201309UV02QUQIMT021001UV01ControlActProcess();
		message.setControlActProcess(controlActProcess);
		
		controlActProcess.setMoodCode(XActMoodIntentEvent.EVN);
		controlActProcess.setClassCode(ActClassControlAct.CACT);
		controlActProcess.setCode(createCodeElement("PRPA_TE201309UV02",ROOT_CODE_2));
		//data enterer not available via API
		controlActProcess.setQueryByParameter(getQueryByParam(pid, messageId));
		
		LOG.debug("Finished building 1309 message " + messageId.toString());
		return message;
	}

	private JAXBElement<PRPAMT201307UV02QueryByParameter> getQueryByParam(MviId pid, UUID messageId) {
		PRPAMT201307UV02QueryByParameter params = new PRPAMT201307UV02QueryByParameter();
		PRPAMT201307UV02ParameterList paramList = new PRPAMT201307UV02ParameterList();
		List<PRPAMT201307UV02PatientIdentifier> patientIDs = paramList.getPatientIdentifier();
		patientIDs.add(getPatientIdentifierElement(pid));
		
		params.setParameterList(paramList);
		JAXBElement<PRPAMT201307UV02QueryByParameter> jax_queryByParams = factory.createPRPAIN201309UV02QUQIMT021001UV01ControlActProcessQueryByParameter(params);
		PRPAMT201307UV02QueryByParameter queryByParams = jax_queryByParams.getValue();
		queryByParams.setQueryId(createId(ROOT_CODE_5, messageId.toString()));
		queryByParams.setStatusCode(createCode("new"));
		queryByParams.setResponsePriorityCode(createCode("I"));
		
		return jax_queryByParams;
	}
}
