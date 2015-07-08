package gov.va.cpe.vpr.ws.link;

import gov.va.cpe.vpr.*;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.feed.atom.Link;

import org.apache.commons.io.IOUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

public class OpenInfoButtonLinkGenerator implements ILinkGenerator, EnvironmentAware {

    public static final String DEPARTMENT_OF_VETERANS_AFFAIRS_OID = "1.3.6.1.4.1.3768";
    public static final String ICD9_CM_CODE_SYSTEM_OID = "2.16.840.1.113883.6.103";
    public static final String LOINC_CODE_SYSTEM_OID = "2.16.840.1.113883.6.1";
	public static final String RXNORM_CODE_SYSTEM_OID = "2.16.840.1.113883.6.88";
	public static final String SNOMED_CODE_SYSTEM_OID = "2.16.840.1.113883.6.96";
	public static final String CPT_CODE_SYSTEM_OID = "2.16.840.1.113883.6.12";
	
	public static final String TASK_CONTEXT_LABRREV = "LABRREV";
	public static final String TASK_CONTEXT_MLREV = "MLREV";
	public static final String TASK_CONTEXT_PROBLISTREV = "PROBLISTREV";
	public static final String TASK_CONTEXT_IMMLREV = "IMMLREV";

	public static final String PERFORMER_PROVIDER = "PROV"; 
	public static final String PERFORMER_PATIENT = "PAT";
	
	private static SAXReader reader = new SAXReader();
    private static final Map<Class, String> SUPPORTED_TYPES = new LinkedHashMap<>(3);

    static {
        SUPPORTED_TYPES.put(Medication.class, TASK_CONTEXT_MLREV);
        SUPPORTED_TYPES.put(Result.class, TASK_CONTEXT_LABRREV);
        SUPPORTED_TYPES.put(Problem.class, TASK_CONTEXT_PROBLISTREV);
        SUPPORTED_TYPES.put(Immunization.class, TASK_CONTEXT_IMMLREV);
    }

    private IPatientDAO patientDao;
    private Environment environment;

    public boolean supports(Object object) {
        return SUPPORTED_TYPES.keySet().contains(object.getClass());
    }

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }

    @Override
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public OpenInfoButtonLinkGenerator() {
    }

    
	public String buildInfobuttonURL(PatientDemographics pat, String searchCode, String searchText,
			String searchContext, String searchCodeSet, String performer) {
		// build the parameters for the link generator
		HashMap<String, Object> map = new HashMap<String, Object>();
		if (pat != null) {
			map.put("age", pat.getAge());
			map.put("gender", pat.getGenderCode());
		}
		map.put("context", searchContext);
		map.put("searchCodeSet", searchCodeSet);
		map.put("searchText", searchText);
		map.put("searchCode", searchCode);
		
		if (performer != null) map.put("performer", performer);
		
		// TODO: hacky fix the search code+gender code to remove the URN:XXX: values so infobuttons work
		Object code = map.get("searchCode");
		if (code != null && code.toString().startsWith("urn:")) {
			map.put("searchCode", TermEng.parseCode(code.toString()));
		}
		code = map.get("gender");
		if (code != null && code.toString().startsWith("urn:") && code.toString().split(":").length == 4) {
			map.put("gender", code.toString().split(":")[3]);
		}
		
		// run the link generator, if it returns a value, add it to the results.
		Link link = generateLinkFromMap(map);
		
		return (link != null) ? link.getHref() : null;
	}
	
	/**
	 * Generates an infobutton link based on the parameters passed in the map
	 * 
	 *  Map MUST include keys for: gender, age, context, searchText
	 *  Map CAN include keys for: searchCode, searchCodeSet, performer
	 *  
	 * If you have a domain object and want to generate a url, try using {@link #generateLink(Object)}
	 */
    public Link generateLinkFromMap(final Map<String, Object> map) {
        String endpointHref = environment.getProperty(HmpProperties.INFO_BUTTON_URL);
        if (!StringUtils.hasText(endpointHref)) return null;

        // required values
        if (!StringUtils.hasText((String) map.get("gender")) || !map.containsKey("age") || !StringUtils.hasText((String) map.get("context")) || !StringUtils.hasText((String) map.get("searchText"))) {
            return null;
        }

        // generate the link
        // TODO: Currently redundant with generateLink()
        UriComponentsBuilder url = UriComponentsBuilder.fromUriString(endpointHref);
        url.queryParam("representedOrganization.id.root", DEPARTMENT_OF_VETERANS_AFFAIRS_OID);
        url.queryParam("patientPerson.genderCode", map.get("gender"));
        url.queryParam("age.v.v", map.get("age"));
        url.queryParam("age.v.u", "a");
        url.queryParam("taskContext.c.c", map.get("context"));
        url.queryParam("mainSearchCriteria.v.dn", map.get("searchText").toString().replace("%", ""));
        if (StringUtils.hasText((String) map.get("searchCode")) && StringUtils.hasText((String) map.get("searchCodeSet"))) {
            // optional values
            url.queryParam("mainSearchCriteria.v.c", map.get("searchCode").toString().replace("%", ""));
            url.queryParam("mainSearchCriteria.v.cs", map.get("searchCodeSet"));
        }

        // performer (defaults to provider)
        if (map.containsKey("performer")) {
        	url.queryParam("performer", map.get("performer"));
        } else {
        	url.queryParam("performer", PERFORMER_PROVIDER);
        }
        
        url.queryParam("transform");

        Link link = new Link(url.build().encode().toUriString(), LinkRelation.OPEN_INFO_BUTTON.toString());
        return link;
    }

    /**
     * Generates a link from a recognized POMObject, returns null if it cant recognize it
     * Currently only recognizes {@link Medication} {@link MedicationProduct}, {@link Result} and {@link Problem}
     */
    @Override
    public Link generateLink(Object object) {
        if (!(object instanceof IPatientObject)) return null;
        String pid = ((IPatientObject) object).getPid();
        final PatientDemographics pt = patientDao.findByPid(pid);
        if (pt == null) return null;

        Map<String,Object> params = new HashMap<>();
        params.put("gender", pt.getGenderCode());
        params.put("age", pt.getAge());
        params.put("context", SUPPORTED_TYPES.get(object.getClass()));
        params.put("performer", PERFORMER_PROVIDER);

        // build object specific criteria
        if (object instanceof Medication) {
            Medication med = (Medication) object;

            // prefer the product.ingredientCodeName over qualifiedName.
            // some sites have tall man lettering which makes qualified name messy
            // Example qualifed name: SUMATRIPTAN (SUMAtriptan) TAB
            params.put("searchText", med.getQualifiedName());
            if (!med.getProducts().isEmpty()) {
            	MedicationProduct product = med.getProducts().get(0);
            	if (StringUtils.hasText(product.getIngredientCodeName())) {
            		params.put("searchText", product.getIngredientCodeName());
            	}
                if (StringUtils.hasText(product.getIngredientRXNCode())) {
                    params.put("searchCode", TermEng.parseCode(product.getIngredientRXNCode()));
                    params.put("searchCodeSet", RXNORM_CODE_SYSTEM_OID);
                }
            }
        } else if (object instanceof Problem) {
            Problem problem = (Problem) object;
            params.put("searchText", problem.getProblemText());
            if (StringUtils.hasText(problem.getIcdCode()) && problem.getIcdCode().startsWith("urn:icd:")) {
                params.put("searchCode", TermEng.parseCode(problem.getIcdCode()));
                params.put("searchCodeSet", ICD9_CM_CODE_SYSTEM_OID);
            }
        } else if (object instanceof Result) {
            Result result = (Result) object;
            params.put("searchText", result.getTypeName());
            if (StringUtils.hasText(result.getTypeCode()) && result.getTypeCode().startsWith("urn:lnc:")) {
                params.put("searchCode", TermEng.parseCode(result.getTypeCode()));
                params.put("searchCodeSet", LOINC_CODE_SYSTEM_OID);
            }
        } else if (object instanceof Immunization) {
        	Immunization imm = (Immunization) object;
        	params.put("searchText", imm.getCptName());
        	if (StringUtils.hasText(imm.getCptCode()) && imm.getCptCode().startsWith("urn:cpt:")) {
        		params.put("searchCode", TermEng.parseCode(imm.getCptCode()));
        		params.put("searchCodeSet", CPT_CODE_SYSTEM_OID);
        	}
        }

        // now delegate to the generate link from key/value map
        return generateLinkFromMap(params);
    }   
    
    /** 
     * Fetches/Parses an infobutton URL (with timeout), returns a list of infobutton links as maps 
     * @return Maps with these keys: title, subtitle, etitle, href, ehint
     */
    public static Collection<Map<String,Object>> fetchInfobuttonURL(String url, int connectTimeoutMS, int readTimeoutMS, String titleOverride) throws IOException {
		String xml = null;
		try {
			// fetch the URL with a timeout
			// TODO: SHould we use an HTTPClient?
			URLConnection conn = new URL(url).openConnection();
			conn.setConnectTimeout(connectTimeoutMS);
			conn.setReadTimeout(readTimeoutMS);
			conn.connect();
			InputStream is = conn.getInputStream();
			xml = IOUtils.toString(is);
			is.close();
		} catch (SocketTimeoutException ex) {
			throw new IOException("Timeout waiting for Infobutton Server", ex);
		} catch (FileNotFoundException ex) {
            throw new IOException("Infobutton Server is unavailable", ex);
        } catch (IOException ex) {
            throw new IOException("Unable to fetch/parse Infobutton results", ex);
		}
		
		// reader seems to not be thread safe, lets fetch the URL first then parse it syncronized
		Document doc = null;
		synchronized(reader) {
			try {
				doc = reader.read(new StringReader(xml));
			} catch (DocumentException e) {
				throw new IOException("Unable to fetch/parse Infobutton results", e);
			}
		}
		
		// parse the XML into a list of maps
		Element root = doc.getRootElement();
		List<Map<String,Object>> rows = new ArrayList<>();
		for (Iterator<Element> i = root.elementIterator("feed"); i.hasNext();) {
			Element feed = i.next();
			String title = feed.elementText("title");
			String subtitle =  feed.elementText("subtitle");
			for (Iterator<Element> j = feed.elementIterator("entry"); j.hasNext();) {
				Map<String, Object> row = new HashMap<>();
				Element entry = j.next();
				String etitle = (titleOverride != null) ? titleOverride : entry.elementText("title");
				row.put("title", title);
				row.put("subtitle", subtitle);
				row.put("etitle", etitle);
				row.put("href", entry.element("link").attributeValue("href"));
				row.put("ehint", String.format("Open in new window: %s: %s (%s)", title, subtitle, etitle));
				rows.add(row);
			}
		}
		
		return rows;
	}    
}
