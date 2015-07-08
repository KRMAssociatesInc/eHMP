package gov.va.hmp.hub;

import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.vista.rpc.ConnectionCallback;
import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.conn.Connection;
import gov.va.hmp.web.servlet.mvc.ParameterMap;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/vistaAccount/**")
@Controller
public class VistaAccountController {

    private RpcTemplate rpcTemplate;
    private IVistaAccountDao vistaAccountDao;
    private MessageSource messageSource;

    @Autowired
    public void setRpcTemplate(RpcTemplate rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @RequestMapping(value = {"list", "index"})
    public ModelAndView list(Pageable pageable, @RequestParam(required = false) String format) {
        Page<VistaAccount> vistaAccounts = vistaAccountDao.findAll(pageable);
        if (!StringUtils.hasText(format) || "html".equals(format)) {
            Map model = new HashMap();
            model.put("vistaAccountInstanceList", vistaAccounts.getContent());
            model.put("vistaAccountInstanceTotal", vistaAccounts.getTotalElements());
            return new ModelAndView("/vistaAccount/list", model);
        } else {
            return ModelAndViewFactory.contentNegotiatingModelAndView(JsonCCollection.create(vistaAccounts));
        }
    }

    @RequestMapping(value = "create", method = RequestMethod.POST)
    public ModelAndView create(VistaAccount vistaAccountInstance, Errors vistaAccountInstanceErrors) {
        return new ModelAndView("/vistaAccount/create", Collections.singletonMap("vistaAccountInstance", vistaAccountInstance));
    }

    @RequestMapping(value = "save", method = RequestMethod.POST)
    public ModelAndView save(ParameterMap params, RedirectAttributes redirectAttrs, final HttpServletRequest request) {
        VistaAccount vistaAccountInstance = new VistaAccount();
        vistaAccountInstance = vistaAccountDao.save(vistaAccountInstance);
        if (vistaAccountInstance != null) {
            Object[] args = new Object[]{messageSource.getMessage("vistaAccount.label", null, "VistaAccount", request.getLocale()), vistaAccountInstance.getId()};
            redirectAttrs.addFlashAttribute("message", messageSource.getMessage("default.created.message", args, "{0} {1} created", request.getLocale()));
            return new ModelAndView("redirect:/vistaAccount/show/" + vistaAccountInstance.getId());
        } else {
            return new ModelAndView("/vistaAccount/create", Collections.singletonMap("vistaAccountInstance", vistaAccountInstance));
        }
    }

    @RequestMapping(value = "show/{id}", method = RequestMethod.GET)
    public ModelAndView show(@PathVariable Integer id, RedirectAttributes redirectAttrs, final HttpServletRequest request) {
        VistaAccount vistaAccountInstance = vistaAccountDao.findOne(id);
        if (vistaAccountInstance == null) {
            Object[] args = new Object[]{messageSource.getMessage("vistaAccount.label", null, "VistaAccount", request.getLocale()), vistaAccountInstance.getId()};
            redirectAttrs.addFlashAttribute("message", messageSource.getMessage("default.not.found.message", args, "{0} not found with id {1}", request.getLocale()));
            return new ModelAndView("redirect:/vistaAccount/list");
        } else {
            return new ModelAndView("/vistaAccount/show", Collections.singletonMap("vistaAccountInstance", vistaAccountInstance));
        }

    }

    @RequestMapping(value = "test/{id}", method = RequestMethod.POST)
    public ModelAndView test(@PathVariable Integer id, RedirectAttributes redirectAttrs, final HttpServletRequest request) {
        VistaAccount vistaAccountInstance = vistaAccountDao.findOne(id);
        if (vistaAccountInstance == null) {
            Object[] args = new Object[]{messageSource.getMessage("vistaAccount.label", null, "VistaAccount", request.getLocale()), vistaAccountInstance.getId()};
            redirectAttrs.addFlashAttribute("message", messageSource.getMessage("default.not.found.message", args, "{0} not found with id {1}", request.getLocale()));
            return new ModelAndView("redirect:/vistaAccount/list");
        } else {
            try {
                String vistaId = rpcTemplate.execute(new ConnectionCallback<String>() {
                    @Override
                    public String doInConnection(Connection con) throws RpcException, DataAccessException {
                        return con.getSystemInfo().getVistaId();
                    }
                }, "vrpcb://" + vistaAccountInstance.getHost() + ":" + vistaAccountInstance.getPort());
                if (StringUtils.hasText(vistaId)) {
                    vistaAccountInstance.setVistaId(vistaId);
                    vistaAccountDao.save(vistaAccountInstance);
                }

                redirectAttrs.addFlashAttribute("message", "Connection successful.");
            } catch (DataAccessException e) {
                redirectAttrs.addFlashAttribute("message", "Unable to connect.");
            }

            return new ModelAndView("/vistaAccount/show", Collections.singletonMap("vistaAccountInstance", vistaAccountInstance));
        }

    }
}
