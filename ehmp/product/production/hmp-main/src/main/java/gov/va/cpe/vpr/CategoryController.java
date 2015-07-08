package gov.va.cpe.vpr;

import gov.va.cpe.team.Category;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.cpe.vpr.web.BadRequestException;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.Collections;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
@RequestMapping("/category/**")
public class CategoryController {

	@Autowired
	IGenericPOMObjectDAO jdsDao;

	@Autowired
	IVistaVprObjectDao vprObjectDao;

    @RequestMapping(value = "/category/list", method = RequestMethod.GET)
    public ModelAndView categories(
    		@RequestParam(required=false) String domain,
    		@RequestParam(required=false) String query,
    		HttpServletRequest request) throws IOException {
    	QueryDef qry;
    	if(query!=null && !query.equals("")) {
    		qry = new QueryDef("categories", query+"*");
    	} else {
    		qry = new QueryDef("categories");
    	}
    	qry.setForPatientObject(false);
    	if(domain!=null && !domain.equals("")) {
        	qry.where("domain").is(domain);
    	}
        return contentNegotiatingModelAndView(JsonCCollection.create(request, jdsDao.findAllByQuery(Category.class, qry, null)));
    }

    @RequestMapping(value = "/category/new", method = RequestMethod.POST)
    public ModelAndView createCategory(@RequestBody String requestJson, HttpServletRequest request) throws IOException {
        Category category = POMUtils.newInstance(Category.class, requestJson);
        category.setData("name", StringEscapeUtils.escapeHtml(category.getName())); // sanitize name
        if (!StringUtils.hasText(category.getDomain())) throw new BadRequestException("The category object must have a 'domain' property; it must not be null, empty, or blank");
        try {
        	category = vprObjectDao.save(category);
            return contentNegotiatingModelAndView(JsonCResponse.create(request, category));
        } catch(DataRetrievalFailureException exc) {
        	return contentNegotiatingModelAndView(JsonCResponse.createError(request, "500", exc));
        }
    }

    @RequestMapping(value = "/category/{uid}", method = RequestMethod.GET)
    public ModelAndView readCategory(@PathVariable String uid, HttpServletRequest request) throws IOException {
        Category category = jdsDao.findByUID(Category.class, uid);
        if (category == null) throw new NotFoundException("Category '" + uid + "' not found.");
        return contentNegotiatingModelAndView(JsonCResponse.create(request, category));
    }

    @RequestMapping(value = "/category/{uid}", method = RequestMethod.POST)
    public ModelAndView updateCategory(@PathVariable String uid, @RequestBody String requestJson, HttpServletRequest request) throws IOException {
        Category category = POMUtils.newInstance(Category.class, requestJson);
        category.setData("name", StringEscapeUtils.escapeHtml(category.getName())); // sanitize name
        if (!uid.equalsIgnoreCase(category.getUid())) throw new BadRequestException("Category UID mismatch");
        category = vprObjectDao.save(category);
        return contentNegotiatingModelAndView(JsonCResponse.create(request, category));
    }

    @RequestMapping(value = "/category/{uid}", method = RequestMethod.DELETE)
    public ModelAndView deleteCategory(@PathVariable String uid, HttpServletRequest request) throws IOException {
    	try {
    		vprObjectDao.deleteByUID(Category.class, uid);
    	} catch(Exception exc) {
    		return contentNegotiatingModelAndView(JsonCResponse.createError(request, "500", exc));
        }
        return contentNegotiatingModelAndView(JsonCResponse.create(request, Collections.emptyMap()));
    }
}
