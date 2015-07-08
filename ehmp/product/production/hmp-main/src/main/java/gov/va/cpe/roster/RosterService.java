package gov.va.cpe.roster;

import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.UserInterfaceRpcConstants;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.vistasvc.CacheMgr;
import gov.va.cpe.vpr.vistasvc.CacheMgr.CacheType;
import gov.va.cpe.vpr.vistasvc.ICacheMgr;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_DELETE_ROSTER_URI;
import static gov.va.cpe.vpr.UserInterfaceRpcConstants.VPR_UPDATE_ROSTER_URI;

@Service
public class RosterService implements IRosterService {

    public static final String ROSTERS_BY_PATIENT_INDEX = "rosterpats";

    private static final Set<String> SOURCES = new HashSet<String>(Arrays.asList("Clinic", "Ward", "OE/RR", "PCMM Team", "Provider", "PXRM", "Specialty", "Patient", "VPR Roster"));

    protected RpcOperations rpcTemplate;
    protected IPatientDAO patDao;
    protected ApplicationContext ctx;
    protected ICacheMgr cache = new CacheMgr("RosterCache", CacheType.MEMORY);
    protected UserContext userContext;
    private IGenericPOMObjectDAO genericDao;

    @Autowired
    public void setGenericDao(IGenericPOMObjectDAO genericDao) {
        this.genericDao = genericDao;
    }

    @Autowired
    public void setCtx(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Autowired
    public void setPatDao(IPatientDAO patDao) {
        this.patDao = patDao;
    }

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    public List<Map<String, Object>> searchRosterSource(String src) {
      return searchRosterSource(src, "");
    }

    public List<Map<String, Object>> searchRosterSource(String src, String search) {
        if (StringUtils.hasText(src) && !src.equals("All") && !SOURCES.contains(src))
            throw new IllegalArgumentException("Unexpected roster src '" + src + "', should be one of " + SOURCES.toString());

        // TODO: Put some pagination controls in here?
        List<String> sources = new ArrayList<String>();
        if(src==null || src.equals("") || src.equals("All")) {
            sources.addAll(SOURCES);
        } else {
            sources.add(src);
        }

        List<Map<String, Object>> rslt = new ArrayList<>();

        for(String source: sources) {
            if(source.equals("Patient") && search.length()<4) {
                continue;
            }
            rslt.addAll(getForSource(source, search));
        }

        return rslt;
    }

    private List<Map<String, Object>> getForSource(String src, String search) {
        // run the RPC and convert to XML document
        List params = new ArrayList();
        params.add(src);
        params.add(StringUtils.hasText(search) ? search : "");
        String str = rpcTemplate.executeForString(UserInterfaceRpcConstants.VPR_GET_SOURCE_URI, params);

        // an empty roster sometimes returns "1^EMPTY ROSTER"
        if (str.startsWith("1^")) {
            return null;
        }

        List<Map<String, Object>> ret = new ArrayList<>();
        Map<String, Object> row = null;
        try {
            Document xml = DocumentHelper.parseText(str);

            Element source = xml.getRootElement().element("source");
            if (source == null) return null;
            Element entries = source.element("entries");
            List<Element> children = entries.elements();
            for (Element it : children) {
                if ("entry".equals(it.getName())) {
                    if (row != null) ret.add(row);
                    row = new HashMap<>();
                    row.put("localId", it.attributeValue("id"));
                    row.put("name", it.attributeValue("NAME"));
                    row.put("src", src);

                    // SEMI Hack: some users of this function expect patient search to return DFN, some
                    // expect ID.
                    if ("Patient".equals(src)) {
                        row.put("dfn", row.get("localId"));
                    }
                } else if ("identifiers".equals(it.getName())) {
                    List<Element> identifiers = it.elements();
                    for (Element identifier : identifiers) {
                        String key = identifier.attributeValue("name").toLowerCase();
                        String val = identifier.attributeValue("value");
                        if ("icn".equals(key)) {
                            val = parseICN(val);
                        }
                        if (row != null) row.put(key, val);
                    }
                    ret.add(row);
                    row = null;
                }
            }
        } catch (DocumentException e) {
            throw new RuntimeException("Unable to parse 'VPR GET SOURCE' XML: " + str, e);
        }

        return ret;
    }

    /**
     * TODO: Document the definition format: ['DR ROBERT ALLEN^^Dr. Allens Patients^^20012','Clinic^UNION^195','Ward^UNION^38']
     *
     * @param definition
     * @return
     */
    public Roster updateRoster(String[] definition) {
        cache.removeAll();
        RpcResponse response = rpcTemplate.execute(VPR_UPDATE_ROSTER_URI, Collections.singletonList(definition));
        Map<String, Object> rsp = POMUtils.parseJSONtoMap(response.toString());
        Map<String, Object> data = (Map<String, Object>) rsp.get("data");
        List<Map<String, Object>> items = (List<Map<String, Object>>) data.get("items");
        if(rsp != null && data != null && items != null && !items.isEmpty() && items.get(0) != null)
        {
            Roster roster = POMUtils.newInstance(Roster.class, items.get(0));
//            postProc.postProcess(roster);
            genericDao.save(roster);
            return roster;
        }
        return null;
    }

    public String deleteRoster(String uid) {
        if(StringUtils.hasText(uid)) {
            Roster r = genericDao.findByUID(Roster.class, uid);
            if(r != null) {
                genericDao.delete(r);
                return rpcTemplate.executeForString(VPR_DELETE_ROSTER_URI, Collections.singletonList(r.getLocalId()));
            }
        }
        return null;
    }

    public Page<Roster> getRosters(Pageable pageable) {
        // TODO: potentially merge in user pref stuff below that came from RosterController
        // get the user preferences to merge in (if any)
        // will over-ride any static map data (if specified)
//        Map vals = paramService.getUserParamMap("VPR ROSTER PREF", it.id);
//        if (vals != null) {
//            it.putAll(vals);
//        }
        return genericDao.findAll(Roster.class, pageable);
    }

    @Override
    public List<RosterPatient> getRosterPatients(String rosterUid) {
        Roster roster = genericDao.findByUID(Roster.class, rosterUid);
        if (roster == null) throw new NotFoundException("roster with uid '" + rosterUid + "' was not found.");
        return new ArrayList<>(roster.getPatients());
    }

    @Override
    public List<Roster> getRostersForPatient(String pid) {
        List<Roster> rosters = genericDao.findAllByIndexAndRange(Roster.class, ROSTERS_BY_PATIENT_INDEX, pid);
        return rosters;
    }

    protected String[] buildRPCDefenition(Map rosterMap, String dfn){
        List<String> defenition = new ArrayList<>();
        defenition.add(String.format("%1s^^%2s^^%3s", rosterMap.get("name"),rosterMap.get("display"),rosterMap.get("ownerid")));

        List<Map<String, Object>> patients = (List<Map<String, Object>>) rosterMap.get("patients");
        for (Map<String, Object> pat : patients) {
            defenition.add(buildPatientRPCDefenition((String) pat.get("dfn")));
        }
        //add new patient
        defenition.add(buildPatientRPCDefenition(dfn))        ;
        return defenition.toArray(new String[defenition.size()]);
    }

    protected String buildPatientRPCDefenition(String dfn){
        return "Patient^UNION^" + dfn;
    }

    // ICN Parsing: strip the VXXXX off the end and convert -1^NO MPI NODE to null.
    private static String parseICN(String icn) {
        int idx = icn.indexOf("V");
        if (idx > 0) {
            return icn.substring(0,idx);
        } else if (icn.startsWith("-1^")) {
            return null;
        }
        return icn;
    }
}
