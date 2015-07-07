package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.queryeng.Table;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class TermController {
	@Autowired
	private TermEng termEng;
	
	@RequestMapping(value="/term/sources")
	public ModelAndView sources() {
		return ModelAndViewFactory.contentNegotiatingModelAndView(termEng.getCodeSystemMap());
	}
	
	@RequestMapping(value="/term/search")
	public ModelAndView search(@RequestParam(value="query",required=true) String search, HttpServletRequest request) {
		List<Map<String, Object>> ret = new ArrayList<>();
		for (String str : termEng.search(search)) {
			if (ret.size() >= 100) break;
			ret.add(Table.buildRow("urn", str, "sab", TermEng.parseCodeSystem(str), "code", TermEng.parseCode(str), 
					"description", termEng.getDescription(str)));
		}
		
		JsonCCollection<Map<String,Object>> jsonc = JsonCCollection.create(request, ret);
        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
	}
	
	@RequestMapping(value="/term/{urn}")
	@ResponseBody
	public ModelAndView fetch(@PathVariable("urn") String urn) {
		return ModelAndViewFactory.contentNegotiatingModelAndView(termEng.getConceptData(urn));
	}
	
	@RequestMapping(value="/term/tree/{urn}")
	@ResponseBody
	public ModelAndView tree(@PathVariable("urn") String urn) {
		Concept c = termEng.getConcept(urn);
		if (c == null) return null;
		
//		List<Map> ret = new ArrayList<Map>();
//		ret.add(Table.buildRow("text", c.getDescription(), "leaf", false, "expanded", true, "children"));
		
		String ret = "{text: " + c.getDescription() + ", expanded: true, children: [	"
				+ "{ text: 'Relationships', leaf: true }, {text: 'Attrs', leaf: true}, {text:'Parents', leaf:true]} ";
		
		return ModelAndViewFactory.contentNegotiatingModelAndView(ret);
	}
	
	@RequestMapping(value = "/term/display")
	ModelAndView display(@RequestParam(value="urn") String urn) {
		Concept c = termEng.getConcept(urn);
		if (c == null) {
			throw new BadRequestException("unknown concept URN: " + urn);
		}

		return new ModelAndView("/frame/concept", Table.buildRow("c", c, "eng", termEng));
	}
	
	@RequestMapping(value = "/term/display/{urn}")
	ModelAndView display2(@PathVariable(value="urn") String urn) {
		return display(urn);
	}
}