package gov.va.hmp.ptselect;

import gov.va.cpe.vpr.PatientDemographics;
import gov.va.cpe.vpr.UidUtils;

public class PtSelectToPtDemographicsUtil {

	// Method to convert Pt-select to Pt-Demographics data
	public static PatientDemographics convertPtSelectToDemographics(
			PatientSelect ptSelect, String vistaId) {

		// Initialize the PatientDemographics object
		PatientDemographics ptDemographics = new PatientDemographics();

		// Set the data for the patientDemographics object
		ptDemographics.setData("pid", ptSelect.getPid());
		ptDemographics.setData("birthTime", ptSelect.getBirthDate());
		ptDemographics.setData("sensitive", ptSelect.isSensitive());
		ptDemographics.setData("uid",UidUtils.getPatientUid(vistaId,ptSelect.getLocalPatientIdForSystem(vistaId)));
		ptDemographics.setData("ssn", ptSelect.getSsn());
		ptDemographics.setData("last4", ptSelect.getLast4());
		ptDemographics.setData("last5", ptSelect.getLast5());
		ptDemographics.setData("icn", ptSelect.getIcn());
		ptDemographics.setData("familyName", ptSelect.getFamilyName());
		ptDemographics.setData("givenNames", ptSelect.getGivenNames());
		ptDemographics.setData("genderCode", ptSelect.getGenderCode());
		ptDemographics.setData("fullName", ptSelect.getFullName());
		ptDemographics.setData("displayName", ptSelect.getDisplayName());
		ptDemographics.setData("genderName", ptSelect.getGenderName());
		ptDemographics.setData("briefId", ptSelect.getBriefId());
		ptDemographics.setData("deceased", ptSelect.getDeceased());

		return ptDemographics;
	}

}
