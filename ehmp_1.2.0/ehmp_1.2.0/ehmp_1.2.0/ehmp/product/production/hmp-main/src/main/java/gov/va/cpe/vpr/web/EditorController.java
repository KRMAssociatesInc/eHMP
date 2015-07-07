package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/editor/**")
public class EditorController {

    private IGenericPatientObjectDAO genericJdsDAO;
    private IVistaVprPatientObjectDao vistaDAO;

    @Autowired
    public void setGenericJdsDAO(IGenericPatientObjectDAO genericJdsDAO) {
        this.genericJdsDAO = genericJdsDAO;
    }

    @Autowired
    public void setVistaDAO(IVistaVprPatientObjectDao vistaDAO) {
        this.vistaDAO = vistaDAO;
    }

    @RequestMapping(value = "submitFieldValue", method = RequestMethod.POST)
    public ModelAndView submitJdsFieldValue(@RequestParam(required = true) String uid, @RequestParam(required = true) String fieldName, @RequestParam(required = true) String value, @RequestParam(required = true) String pid, HttpServletRequest request) {

        IPatientObject obj = genericJdsDAO.findByUID(uid);

        if (POMUtils.isValidJSON(value)) {
            obj.setData(fieldName, POMUtils.parseJSONtoMap(value));
        } else {
            obj.setData(fieldName, value);
        }

        vistaDAO.save(obj);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }
    
    @RequestMapping(value = "submitFormValues", method = RequestMethod.POST)
    public ModelAndView submitFormValues(@RequestParam(required = true) String uid, HttpServletRequest request) {
        IPatientObject obj = genericJdsDAO.findByUID(uid);

        // gather up all the key/value pairs
        Map<String, Object> form = new HashMap<>();
        Enumeration<String> e = request.getParameterNames();
        while (e.hasMoreElements()) {
        	String key = e.nextElement();
        	form.put(key, request.getParameter(key));
        }

        // update vista
        obj.setData(form);
        vistaDAO.save(obj);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }

    @RequestMapping(value = "submitTaskFormValues", method = RequestMethod.POST)
    public ModelAndView submitTaskFormValues(@RequestParam(required = true) String uid, HttpServletRequest request) {
        IPatientObject obj = genericJdsDAO.findByUID(uid);

        // gather up all the key/value pairs
        Map<String, Object> form = new HashMap<>();
        Enumeration<String> e = request.getParameterNames();
        while (e.hasMoreElements()) {
            String key = e.nextElement();
            if (key.equals("taskName") || key.equals("description") || key.equals("type")) {
                form.put(key, StringEscapeUtils.escapeHtml(request.getParameter(key)));
            } else {
                form.put(key, request.getParameter(key));
            }
        }

        // update vista
        obj.setData(form);
        vistaDAO.save(obj);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }

    @RequestMapping(value = "submitVistaData", method = RequestMethod.GET)
    @Deprecated
    public ModelAndView submitVistaData(@RequestParam(required = true) String uid, @RequestParam(required = true) String fieldName, @RequestParam(required = true) Object value, HttpServletRequest request) {

        IPatientObject obj = genericJdsDAO.findByUID(uid);
        obj.setData(fieldName, value);
        vistaDAO.save(obj);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }
}
