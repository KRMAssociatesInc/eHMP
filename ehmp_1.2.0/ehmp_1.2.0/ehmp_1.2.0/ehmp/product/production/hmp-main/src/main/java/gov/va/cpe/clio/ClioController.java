package gov.va.cpe.clio;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.hmp.jsonc.JsonCCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;

@Controller
@RequestMapping("/clio/**")
public class ClioController {
    @Autowired
    IGenericPOMObjectDAO jdsDao;

    @Autowired
    IVistaVprObjectDao vprObjectDao;

    @RequestMapping(value = "list", method = RequestMethod.GET)
    public ModelAndView categories(
            @RequestParam(required = false) String termType,
            HttpServletRequest request) throws IOException {
        QueryDef qry = new QueryDef("clioterminology");
        qry.setForPatientObject(false);
        if (termType != null && !termType.equals("")) {
            qry.where("termType").is(termType);
        }
        return contentNegotiatingModelAndView(JsonCCollection.create(request, jdsDao.findAllByQuery(ClioTerminology.class, qry, null)));
    }
}
