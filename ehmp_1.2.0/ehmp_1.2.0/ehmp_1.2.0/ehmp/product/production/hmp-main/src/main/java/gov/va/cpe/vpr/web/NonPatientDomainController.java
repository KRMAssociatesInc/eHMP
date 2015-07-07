package gov.va.cpe.vpr.web;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.pom.POMUtils;
import gov.va.cpe.vpr.service.IDomainService;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RequestMapping(value = {"/nonPatientDomain/**", "/vpr/nonPatientDomain/**"})
@Controller
public class NonPatientDomainController {

    private IGenericPOMObjectDAO genericDao;
    private UserContext userContext;
    private IDomainService domainService;
    private IVistaVprObjectDao vistaVprObjectDao;

    @Autowired
    public void setGenericDao(IGenericPOMObjectDAO genericDao) {
        this.genericDao = genericDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setDomainService(IDomainService domainService) {
        this.domainService = domainService;
    }

    @Autowired
    public void setVistaVprObjectDao(IVistaVprObjectDao vistaVprObjectDao) {
        this.vistaVprObjectDao = vistaVprObjectDao;
    }

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ModelAndView list(@RequestParam(required = true) String domain) {
        Class clazz = domainService.getDomainClass(domain);
        List all = genericDao.findAll(clazz);
        return ModelAndViewFactory.contentNegotiatingModelAndView(Collections.singletonMap("data", all));
    }

    @RequestMapping(value = "/set", method = RequestMethod.POST)
    public ModelAndView set(@RequestParam(required = true) String value, @RequestParam(required = true) String domain) {
        Class clazz = domainService.getDomainClass(domain);
        Map mp = POMUtils.parseJSONtoMap(value);
        mp.put("ownerUid", userContext.getCurrentUser().getUid());
        mp.put("ownerName", userContext.getCurrentUser().getDisplayName());
        IPOMObject obj = vistaVprObjectDao.save(clazz, mp);
        return ModelAndViewFactory.contentNegotiatingModelAndView(obj);
    }
}
