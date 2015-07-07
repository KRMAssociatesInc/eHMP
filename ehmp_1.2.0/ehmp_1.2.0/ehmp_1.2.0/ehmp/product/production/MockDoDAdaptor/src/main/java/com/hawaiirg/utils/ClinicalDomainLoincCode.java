package com.hawaiirg.utils;

/**
 * Janus 4.0 (c)
 * Copyright (c) 2011 Hawaii Resource Group LLC. All Rights Reserved.
 * Developed for the Pacific Telehealth & Technology Hui and the Pacific Joint Information Technology Center
 * Contributors:
 *     Honorable Senator Daniel K. Inouye
 *     VA Pacific Islands Health Care System
 *     Tripler Army Medical Center
 */


public enum ClinicalDomainLoincCode
{
    ADMISSIONS("21869-3"),
    ALL_ORDERS("46209-3"),
    ALLERGIES("48765-2"),
    APPOINTMENTS("56446-8"),
    CONSULTS("29299-5"),
    CONSULT_ORDERS("11487-6"),
    DEPLOYMENT_FORMS("51847-2"),
    DISCHARGE_SUMMARIES("11490-0"),
    ENCOUNTERS("46240-8"),
    ENCOUNTER_NOTES("34109-9"),
    FAMILY_HISTORIES("10157-6"),
    INPATIENT_NOTES("28563-5"),
    LAB_ANATOMIC_PATHOLOGIES("26439-0"),
    LAB_CHEMISTRIES("11502-2"),
    LAB_MICROBIOLOGIES("18725-2"),
    LAB_ORDERS("26436-6"),
    MEDICATIONS("10160-0"),
    MEDICATION_ORDERS("29305-0"),
    NOTES("11536-0"),
    //NOTES("60733-3"),
    OTHER_PAST_MEDICAL_HISTORIES("11348-0"),
    PATIENT_DEMOGRAPHICS("52536-0"),
    PROBLEMS("11450-4"),
    PROCEDURES("47519-4"),
    QUESTIONNAIRES("10187-3"),
    RADIOLOGY_REPORTS("30954-2"),
    RADIOLOGY_ORDERS("18726-0"),
    SOCIAL_HISTORIES("29762-2"),
    VITALS("8716-3"),
    IMMUNIZATIONS("39235-7");


    private String loincCode;

    private ClinicalDomainLoincCode(String loincCode)
    {
        this.loincCode = loincCode;
    }

    public String getLoincCode() {
        return loincCode;
    }

    public void setLoincCode(String loincCode) {
        this.loincCode = loincCode;
    }

    public static ClinicalDomainLoincCode fetchLoinc(String loincCode)
    {
        for(ClinicalDomainLoincCode loinc : ClinicalDomainLoincCode.values())
        {
            if(loinc.getLoincCode().equals(loincCode)) return loinc;
        }

        return null;
    }
}
