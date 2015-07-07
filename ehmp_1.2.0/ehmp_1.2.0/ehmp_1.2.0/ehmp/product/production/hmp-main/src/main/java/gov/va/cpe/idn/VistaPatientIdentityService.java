package gov.va.cpe.idn;

import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcRequest;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static gov.va.hmp.vista.util.RpcUriUtils.VISTA_RPC_BROKER_SCHEME;

/**
 * Patient Identity service implementation that retrieves correlated patient identifiers from a single VistA.
 */
@Service("vistaPatientIdentityService")
public class VistaPatientIdentityService implements IPatientIdentityService
{
    private static final Logger LOG = LoggerFactory.getLogger(VistaPatientIdentityService.class);

    private static final String VACF_LOCAL_GETCORRESPONDINGIDS_RPC_URI =
            "/VAFCTF RPC CALLS/VAFC LOCAL GETCORRESPONDINGIDS";

    private static final int TIMEOUT_SECONDS = 30;

    private static final int PIECE_IDX_ID = 0;
    private static final int PIECE_IDX_IDTYPE = 1;
    private static final int PIECE_IDX_ASSIGNING_AUTHORITY = 2;
    private static final int PIECE_IDX_ASSIGNING_FACILITY = 3;
    private static final int PIECE_IDX_IDSTATUS = 4;

    private RpcOperations synchronizationRpcTemplate;
    private IVistaAccountDao vistaAccountDao;

    @Autowired
    public void setSynchronizationRpcTemplate(RpcOperations synchronizationRpcTemplate) {
        this.synchronizationRpcTemplate = synchronizationRpcTemplate;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    /**
     * Retrieves all known patient identifiers.
     *
     * @param vistaId The vista site hash code.
     * @param pid    Patient Identifier (ICN, SITE:DFN)
     * @return PatientIds instance which contains all known patient identifiers.
     * @throws IllegalArgumentException
     * @throws gov.va.cpe.idn.PatientIdentityException
     */
    @Override
    public PatientIds getPatientIdentifiers(String vistaId, String pid) {

        if (StringUtils.isBlank(vistaId))
            throw new IllegalArgumentException("vistaId is blank");

        if (StringUtils.isBlank(pid))
            throw new IllegalArgumentException("pid is blank");

        LOG.debug("VistaPatientIdentifiers::getPatientIdentifiers({}, {}) -- Entering method", vistaId, pid);

        List<VistaAccount> vistaAccounts = vistaAccountDao.findAllByVistaId(vistaId);

        if (vistaAccounts == null || vistaAccounts.isEmpty())
            throw new PatientIdentityException("Cannot find a Vista Accounts associated with vistaId: " + vistaId);

        String siteCode = vistaAccounts.get(0).getDivision();

        LOG.debug("VistaPatientIdentifiers::getPatientIdentifiers - siteCode: {}", siteCode);

        String rpcParams, uid = null, dfn = null, icn = null, edipi = null;

        //request using DFN
        if (pid.contains(";")) {
            dfn = pid.substring(pid.indexOf(";")+1, pid.length());
            rpcParams = dfn + "^PI^USVHA^" + siteCode;
        }
        //request using ICN
        else {
            icn = pid;
            rpcParams = icn + "^NI^USVHA^200M";
        }

        String uri = VISTA_RPC_BROKER_SCHEME + "://" + vistaId + VACF_LOCAL_GETCORRESPONDINGIDS_RPC_URI;

        LOG.debug("VistaPatientIdentifiers::getPatientIdentifiers - VistA RPC Broker URI: {} ; RPC params: {}", uri, rpcParams);

        RpcRequest request = new RpcRequest(uri, rpcParams);
        request.setTimeout(TIMEOUT_SECONDS);

        List<String> lines = synchronizationRpcTemplate.execute(request).toLinesList();

        LOG.debug("VistaPatientIdentifiers::getPatientIdentifiers - RPC Response: {}", lines);

        for(String line : lines) {
            String[] pieces = line.split("\\^");

            String id = pieces.length > PIECE_IDX_ID ? pieces[PIECE_IDX_ID] : null;
            String idType = pieces.length > PIECE_IDX_IDTYPE ? pieces[PIECE_IDX_IDTYPE] : null;
            String idStatus = pieces.length > PIECE_IDX_IDSTATUS ? pieces[PIECE_IDX_IDSTATUS] : null;
            String assigningAuthority = pieces.length > PIECE_IDX_ASSIGNING_AUTHORITY ? pieces[PIECE_IDX_ASSIGNING_AUTHORITY] : null;

            if (StringUtils.isNotBlank(id)) {
                //local facility DFN
                if ("PI".equals(idType) && "USVHA".equals(assigningAuthority)) {
                    //begin with first available dfn
                    if(StringUtils.isBlank(dfn)) dfn = id;
                    //but always end up taking the dfn marked as active
                    else if ("A".equals(idStatus)) dfn = id;
                }
                //ICN
                else if ("NI".equals(idType) && "USVHA".equals(assigningAuthority)) {
                    //begin with first available icn
                    if (StringUtils.isBlank(icn)) icn = id;
                    //but always end up taking the icn marked as active
                    else if ("A".equals(idStatus)) icn = id;
                }
                //EDIPI
                else if ("NI".equals(idType) && "USDOD".equals(assigningAuthority)) {
                    //begin with first available edipi
                    if (StringUtils.isBlank(edipi)) edipi = id;
                    //but always end up taking the edipi marked as active
                    else if ("A".equals(idStatus)) edipi = id;
                }
            }
        }

        if (StringUtils.isNotBlank(dfn)) {
            uid =  "urn:va:patient:"+vistaId+":"+ dfn +":"+ (icn != null ? icn : dfn);
        }

        PatientIds patientIds = new PatientIds.Builder()
                .pid(pid)
                .dfn(dfn)
                .edipi(edipi)
                .icn(icn)
                .uid(uid)
                .build();

        LOG.debug("VistaPatientIdentifiers::getPatientIdentifiers -- Leaving method. PatientIds: {}", patientIds);

        return patientIds;
    }
}
