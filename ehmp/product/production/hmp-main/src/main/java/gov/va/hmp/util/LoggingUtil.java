package gov.va.hmp.util;

import gov.va.cpe.idn.PatientIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class LoggingUtil {

	static final Logger LOG = LoggerFactory.getLogger(LoggingUtil.class);
	
    static final String sCRLF = System.getProperty("line.separator");


	public static void dumpMap(@SuppressWarnings("rawtypes") Map params) {
    	if (params == null) {
    		LOG.debug("LoggingUtil.:  params was null.");
    		return;
    	}
    	
    	@SuppressWarnings("unchecked")
        Set<String> saKey = params.keySet();
    	for (String sKey : saKey) {
    		Object oValue = params.get(sKey);
    		if (oValue instanceof String) {
    			LOG.debug("LoggingUtil.dumpMap:  param " + sKey + " = " + (String) oValue);
    		}
    		else if (oValue instanceof Integer) {
    			LOG.debug("LoggingUtil.dumpMap:  param " + sKey + " = " + ((Integer) oValue).toString());
    		}
    		else if (oValue instanceof Boolean) {
    			LOG.debug("LoggingUtil.dumpMap:  param " + sKey + " = " + ((Boolean) oValue).toString());
    		}
    		else {
    			LOG.debug("LoggingUtil.dumpMap:  param " + sKey + " = (ClassType = " +  oValue.getClass().getName() + ")");
    		}
    	}
		
	}

	public static String mapContentsOutput(String sPrepend, String sVariableTagName, @SuppressWarnings("rawtypes") Map oMap) {
		StringBuffer sbOutput = new StringBuffer("");
    	if (sPrepend == null) {
    		sPrepend = "";
    	}

    	if (oMap == null) {
    		sbOutput.append(sPrepend + sVariableTagName + " was null." + sCRLF);
    		return sbOutput.toString();
    	}
    	else if (oMap.size() == 0) {
    		sbOutput.append(sPrepend + sVariableTagName + " was empty." + sCRLF);
    		return sbOutput.toString();
    	}

    	@SuppressWarnings("unchecked")
        Set<String> saKey = oMap.keySet();
    	for (String sKey : saKey) {
    		Object oValue = oMap.get(sKey);
    		if (oValue != null) {
        		if (oValue instanceof String) {
        			sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + (String) oValue + sCRLF);
        		}
        		else if (oValue instanceof Integer) {
        			sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + ((Integer) oValue).toString() + sCRLF);
        		}
        		else if (oValue instanceof Boolean) {
        			sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + ((Boolean) oValue).toString() + sCRLF);
        		}
        		else if (oValue instanceof Object) {
        			sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + "(ClassType = " +  oValue.getClass().getName() + ")" + sCRLF);
        		}
        		else {
                    sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + "unknown" + sCRLF);
        		}
    		}
    		else {
                sbOutput.append(sPrepend + sVariableTagName + "[" + sKey + "]: " + "null" + sCRLF);
    		}
    	}

    	return sbOutput.toString();

	}
	
    /**
     * This method will output the sync status information.
     * 
     * @param sTitle The title to use on the message.
     * @param syncStatus The sync status to output.
     */
    public static String outputSyncStatus(String sTitle, SyncStatus syncStatus) {
        StringBuffer sbOutput = new StringBuffer();
        
        sbOutput.append(sTitle + sCRLF);
        if (syncStatus != null) {
            sbOutput.append("SyncStatus:" + sCRLF);
            sbOutput.append("    pid: " + syncStatus.getPid() + sCRLF);
            sbOutput.append("    uid: " + syncStatus.getUid() + sCRLF);
            if (NullChecker.isNotNullish(syncStatus.getSyncStatusByVistaSystemId())) {
                Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = syncStatus.getSyncStatusByVistaSystemId();
                Set<String> saKey = mapSiteSyncStatus.keySet();
                for (String sKey : saKey) {
                    VistaAccountSyncStatus oSiteSyncStatus = mapSiteSyncStatus.get(sKey);
                    if (oSiteSyncStatus != null) {
                        sbOutput.append("    SiteSyncStatus[" + sKey + "]: " + sCRLF);
                        sbOutput.append("        patientUid: " + oSiteSyncStatus.getPatientUid() + sCRLF);
                        sbOutput.append("        dfn: " + oSiteSyncStatus.getDfn() + sCRLF);
                        sbOutput.append("        syncComplete: " + oSiteSyncStatus.isSyncComplete() + sCRLF);
                        sbOutput.append("        syncReceivedAllChunks: " + oSiteSyncStatus.isSyncReceivedAllChunks() + sCRLF);
                        sbOutput.append("        errorMessage: " + oSiteSyncStatus.getErrorMessage() + sCRLF);
                        if (NullChecker.isNotNullish(oSiteSyncStatus.getDomainExpectedTotals())) {
                            sbOutput.append(outputDomainExpectedTotals("        ", oSiteSyncStatus.getDomainExpectedTotals()));
                        }
                    }
                }
            }
            
        }
        else {
            sbOutput.append("syncsStatus: null." + sCRLF);
        }
        
        return (sbOutput.toString());
    }

    public static Object outputDomainExpectedTotals(String prefix, Map<String, Map<String, Integer>> domainExpectedTotals) {
        StringBuffer sbOutput = new StringBuffer();
        
        if (NullChecker.isNotNullish(domainExpectedTotals)) {
            sbOutput.append(prefix + "domainExpectedTotals: " + sCRLF);
            Set<String> saKey = domainExpectedTotals.keySet();
            for (String sKey : saKey) {
                sbOutput.append(prefix + "    domain: " + sKey + sCRLF);
                sbOutput.append(LoggingUtil.mapContentsOutput(prefix + "        ", "", domainExpectedTotals.get(sKey)));
            }
        }
        
        return (sbOutput.toString());
    }

    
    public static String outputStringArray(String prefix, String variableName, List<String> saText) {
        StringBuffer sbOutput = new StringBuffer();
        
        if (NullChecker.isNotNullish(saText)) {
            int i = 0;
            for (String sText : saText) {
                sbOutput.append(prefix + variableName + "[" + i + "]: " + sText + sCRLF);
                i++;
            }
        }

        return sbOutput.toString();
    }
	
    public static String outputPatientIds(PatientIds patientIds) {
        String sOutput = "";

        if (patientIds == null) {
            sOutput = "patientIds is null";
        }
        else {
            sOutput = "patientIds.pid: " + patientIds.getPid() + " patientIds.icn: " + patientIds.getIcn() + " patientIds.edipi: " + patientIds.getEdipi();
        }
        return sOutput;
    }

}
