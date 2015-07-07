package gov.va.cpe.vpr;

public class UserInterfaceRpcConstants {
    // HMP RPCs
    public static final String VPR_UI_CONTEXT = "HMP UI CONTEXT";

    public static final String FRONT_CONTROLLER_RPC = "HMPCRPC RPC";
    public static final String FRONT_CONTROLLER_CHAIN_RPC = "HMPCRPC RPCCHAIN";
    public static final String CONTROLLER_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + FRONT_CONTROLLER_RPC;
    public static final String CONTROLLER_CHAIN_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + FRONT_CONTROLLER_CHAIN_RPC;

    public static final String ORDERING_CONTROLLER_RPC = "HMPCORD RPC";
    public static final String ORDERING_CONTROLLER_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORDERING_CONTROLLER_RPC;

    public static final String VPR_PUT_OBJECT_RPC = "HMP PUT OBJECT";
    public static final String VPR_PUT_OBJECT_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_PUT_OBJECT_RPC;

    public static final String VPR_PUT_DEMOGRAPHICS_RPC = "HMP PUT DEMOGRAPHICS";
    public static final String VPR_PUT_DEMOGRAPHICS_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_PUT_DEMOGRAPHICS_RPC;

    public static final String VPR_DELETE_OBJECT_RPC = "HMP DELETE OBJECT";
    public static final String VPR_DELETE_OBJECT_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_DELETE_OBJECT_RPC;

    public static final String VPR_PUT_PATIENT_DATA_RPC = "HMP PUT PATIENT DATA";
    public static final String VPR_PUT_PATIENT_DATA_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_PUT_PATIENT_DATA_RPC;

    // Roster RPCs
    public static final String VPR_GET_SOURCE_RPC = "HMP GET SOURCE";
    public static final String VPR_GET_SOURCE_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_GET_SOURCE_RPC;

    public static final String VPR_UPDATE_ROSTER_RPC = "HMP UPDATE ROSTER";
    public static final String VPR_UPDATE_ROSTER_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_UPDATE_ROSTER_RPC;

    public static final String VPR_DELETE_ROSTER_RPC = "HMP DELETE ROSTER";
    public static final String VPR_DELETE_ROSTER_URI = "/" + VPR_UI_CONTEXT + "/" + VPR_DELETE_ROSTER_RPC;

    // CPRS RPCs
   // public static final String OR_CPRS_GUI_CHART_CONTEXT = "OR CPRS GUI CHART";

    public static final String ORQPT_WARDS_RPC = "ORQPT WARDS";
    public static final String ORQPT_WARDS_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_WARDS_RPC;

    public static final String ORQPT_WARD_PATIENTS_RPC = "ORQPT WARD PATIENTS";
    public static final String ORQPT_WARD_PATIENTS_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_WARD_PATIENTS_RPC;

    public static final String ORQPT_SPECIALTIES_RPC = "ORQPT SPECIALTIES";
    public static final String ORQPT_SPECIALTIES_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_SPECIALTIES_RPC;

    public static final String ORQPT_SPECIALTY_PATIENTS_RPC = "ORQPT SPECIALTY PATIENTS";
    public static final String ORQPT_SPECIALTY_PATIENTS_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_SPECIALTY_PATIENTS_RPC;

    public static final String ORWU_CLINLOC_RPC = "ORWU CLINLOC";
    public static final String ORWU_CLINLOC_URI = "/" + VPR_UI_CONTEXT + "/" + ORWU_CLINLOC_RPC;

    public static final String ORQPT_CLINIC_PATIENTS_RPC = "ORQPT CLINIC PATIENTS";
    public static final String ORQPT_CLINIC_PATIENTS_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_CLINIC_PATIENTS_RPC;

    public static final String ORWU_NEWPERS_RPC = "ORWU NEWPERS";
    public static final String ORWU_NEWPERS_URI = "/" + VPR_UI_CONTEXT + "/" + ORWU_NEWPERS_RPC;

    public static final String ORQPT_PROVIDER_PATIENTS_RPC = "ORQPT PROVIDER PATIENTS";
    public static final String ORQPT_PROVIDER_PATIENTS_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_PROVIDER_PATIENTS_RPC;

    public static final String ORQPT_DEFAULT_PATIENT_LIST_RPC = "ORQPT DEFAULT PATIENT LIST";
    public static final String ORQPT_DEFAULT_PATIENT_LIST_RPC_URI = "/" + VPR_UI_CONTEXT + "/" + ORQPT_DEFAULT_PATIENT_LIST_RPC;
}
