package gov.va.cpe.vpr.sync.vista;

public class SynchronizationRpcConstants {
    public static final String NHIN_RPC_CONTEXT = "NHIN APPLICATION PROXY";

    public static final String NHIN_GET_VISTA_DATA = "NHIN GET VISTA DATA";

    public static final String VPR_RPC_CONTEXT = "HMP APPLICATION PROXY"; // VPR 1.0 contained VPR GET PATIENT DATA and VPR VERSION RPCs under this context
    public static final String VPR_SYNCHRONIZATION_CONTEXT = "HMP SYNCHRONIZATION CONTEXT";

    public static final String VPR_DATA_VERSION = "HMP DATA VERSION";
    public static final String VPR_DATA_VERSION_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_DATA_VERSION;

    public static final String VPR_GET_VISTA_DATA = "HMP GET PATIENT DATA";

    public static final String VPR_GET_VISTA_DATA_JSON = "HMP GET PATIENT DATA JSON";
    public static final String VPR_GET_VISTA_DATA_JSON_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_GET_VISTA_DATA_JSON;

    public static final String VPR_INPATIENTS = "HMP INPATIENTS";
    public static final String VPR_PANEL_UPDATES = "HMP PANEL UPDATES";

    public static final String VPR_SUBSCRIBE = "HMP SUBSCRIBE";
    public static final String VPR_SUBSCRIBE_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" +VPR_SUBSCRIBE;

    public static final String VPR_GET_OBJECT_RPC = "HMP GET OBJECT";
    public static final String VPR_GET_OBJECT_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_GET_OBJECT_RPC;

    public static final String VPR_GET_OPERATIONAL_DATA_RPC = "HMP GET OPERATIONAL DATA";
    public static final String VPR_GET_OPERATIONAL_DATA_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_GET_OPERATIONAL_DATA_RPC;

    public static final String VPR_PUT_OBJECT_RPC = "HMP PUT OBJECT";
    public static final String VPR_PUT_OBJECT_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_PUT_OBJECT_RPC;
    
    public static final String VPR_PATIENT_ACTIVITY = "HMP PATIENT ACTIVITY";  // "HMP Patient Activity";
    public static final String VPR_PATIENT_ACTIVITY_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_PATIENT_ACTIVITY;

    public static final String VPR_STREAM_API_RPC = "HMPDJFS API";
    public static final String VPR_STREAM_API_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_STREAM_API_RPC;
    public static final String VPR_STREAM_DELSUB_RPC = "HMPDJFS DELSUB";
    public static final String VPR_STREAM_DELSUB_RPC_URI = "/" + VPR_SYNCHRONIZATION_CONTEXT + "/" + VPR_STREAM_DELSUB_RPC;
}
