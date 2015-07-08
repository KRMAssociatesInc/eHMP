package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.NotFoundException;
import gov.va.cpe.vpr.Result;
import gov.va.cpe.vpr.UidUtils;
import gov.va.cpe.vpr.VitalSign;
import gov.va.cpe.vpr.mapping.ILinkService;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.ws.link.LinkRelation;
import gov.va.hmp.feed.atom.Link;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.healthtime.Precision;
import gov.va.hmp.healthtime.format.HL7DateTimeFormat;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.net.URLDecoder;
import java.util.*;

@Controller
public class TrendController {

    public static final String LAB_INDEX = "lab-qualified-name";
    public static final String VITAL_INDEX = "vs-qualified-name";

    private ILinkService linkService;
    private IGenericPatientObjectDAO genericPatientObjectDao;

    @Autowired
    public void setLinkService(ILinkService linkService) {
        this.linkService = linkService;
    }

    @Autowired
    public void setGenericPatientObjectDao(IGenericPatientObjectDAO genericPatientObjectDao) {
        this.genericPatientObjectDao = genericPatientObjectDao;
    }

    @RequestMapping(value = "/vpr/trend/**", method = RequestMethod.GET, params = "format=xml")
    public String renderXml(HttpServletRequest request) {
        Link link = createLink(request);
        return "redirect:" + link.getHref();
    }

    @RequestMapping(value = "/vpr/trend/**", method = RequestMethod.GET, params = "format=json")
    public ModelAndView renderJson(HttpServletRequest request) throws Exception {
        String uid = getUidFromUrl(request.getRequestURI());
        String range = request.getParameter("range");
        Class clazz = UidUtils.getDomainClassByUid(uid);
        IPatientObject item = (IPatientObject) genericPatientObjectDao.findByUID(clazz, uid);
        String pid = item.getPid();
        Map<String, Object> itemData = item.getData();
        
		String qnm = (String) item.getData().get("qualifiedName");
		if (StringUtils.hasText(qnm) && !qnm.startsWith("\"")) {
			qnm = "\"" + qnm + "\"";
		}
		// build/exec the JDS query
        QueryDef qryDef = new QueryDef().usingIndex(getIndex(item), qnm);
        if (StringUtils.hasText(range)) {
        	qryDef.where("observed").between(new PointInTime(range), PointInTime.now());
        }
        if (StringUtils.hasText((String) itemData.get("units"))) {
        	qryDef.where("units").is(itemData.get("units"));
        }
        List< IPatientObject > items = (List<IPatientObject>) genericPatientObjectDao.findAllByQuery(clazz, qryDef, Collections.singletonMap("pid", (Object) pid));
        String units = "";
        for(IPatientObject obj: items) {
        	String unt = (obj.getData().get("units")!=null?obj.getData().get("units").toString():"");
        	if(units.equals("")) {
        		units = unt;
        	} else {
        		if(!units.equals(unt)) {
        			throw new Exception("Units of measure not compatible in query");
        		}
        	}
        }
        
        List data = createTrendData(items);
        JsonCCollection cr = JsonCCollection.create(data);
        cr.put("name", itemData.get("qualifiedName"));
        cr.put("type", "line");
        cr.put("units", units);
        final Link link = createLink(request);
        cr.setSelfLink((link == null ? null : link.getHref()));
        return ModelAndViewFactory.contentNegotiatingModelAndView(cr);
    }
    
    protected String getIndex(IPatientObject item) {
        // which index/range field?
        String index;
        if (item instanceof Result) {
            index = LAB_INDEX;
        } else if (item instanceof VitalSign) {
            index = VITAL_INDEX;
        } else {
            throw new IllegalArgumentException("Trend  type is invalid. Valid types: result, vitalSign");
        }
        return index;
    }
    
    protected List<Map<String, Object>> createTrendData(List<? extends IPatientObject> items) {
        List chartData = new ArrayList();
        for (IPatientObject item : items) {
            Map<String, Object> itemData = item.getData();
            PointInTime observed = HL7DateTimeFormat.parse((String) itemData.get("observed"));
            Long jsDate = observed != null ? pitToJsDate(observed) : null;
            String resultStr = (String) itemData.get("result");
            try {
                Float result = StringUtils.hasText(resultStr) ? Float.valueOf(resultStr) : null;
                if (jsDate != null && result != null) {
                    LinkedHashMap<String, Object> map = new LinkedHashMap<>(2);
                    map.put("x", jsDate);
                    map.put("y", result);
                    
                    // copy these values through if they exist
                    for (String key : Arrays.asList("interpretationCode", "comment", "high", "low", "units")) {
                    	String val = (String) itemData.get(key);
                        if (StringUtils.hasText(val)) {
                            map.put(key, val);
                        }
                    }
                    if (itemData.containsKey("interpretationCode")) {
                        String displayInterpretationCode = Result.getDisplayInterpretationCode((String) itemData.get("interpretationCode"));
                        map.put("displayInterpretationCode", displayInterpretationCode);
                    }
                    chartData.add(map);
                }
            } catch (NumberFormatException e) {
                // TODO: result not graphable on a trend - though it should be included as a note on the chart
            }
        }

        return chartData;
    }

    protected Long pitToJsDate(PointInTime pit) {
    	if (pit == null || pit.getPrecision().compareTo(Precision.DATE) < 0) return null;
        return pit.promote().getCenter().toLocalDateTime().toDateTime().getMillis();
    }

    protected String getUidFromUrl(String uri) {
        String url = URLDecoder.decode(uri);
        String uid = url.substring(url.indexOf("urn:"));
        if (!StringUtils.hasText(uid)) {
            throw new BadRequestException("'uid' parameter is required");
        }

        return uid;
    }

    @RequestMapping(value = "/vpr/trend/**", method = RequestMethod.GET, params = "format=extjs")
    @ResponseBody
    public String renderExtJs(@RequestParam("format") String format, HttpServletRequest request) {
        Link link = createLink(request);
        if (link.getHref().lastIndexOf('?') > 0) {
            link.setHref(link.getHref() + "&format=" + StringEscapeUtils.escapeHtml(format));
        } else {
            link.setHref(link.getHref() + "?format=" + StringEscapeUtils.escapeHtml(format));
        }

        return "{ \"xtype\": \"trendpanel\", \"url\": \"" + link.getHref() + "\" }";
    }

    Link createLink(HttpServletRequest request) {
        String uid = getUidFromUrl(request.getRequestURI());
        IPOMObject item = genericPatientObjectDao.findByUID(UidUtils.getDomainClassByUid(uid), uid);

        if (item == null)
            throw new UidNotFoundException(UidUtils.getDomainClassByUid(uid), uid);

        List<Link> links = linkService.getLinks(item);
        Link link = findTrendLink(links);
        if (link == null)
            throw new NotFoundException("No trend found for item with uid=" + uid);
        return link;
    }

    private Link findTrendLink(List<Link> links) {
        for (Link it : links) {
            if (LinkRelation.TREND.toString().equalsIgnoreCase(it.getRel())) {
                return it;
            }
        }
        return null;
    }
}
