package gov.va.cpe.rpc;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import gov.va.hmp.auth.HmpUserDetails;
import gov.va.hmp.auth.UserContext;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.jsonc.JsonCCollection;
import gov.va.hmp.jsonc.JsonCResponse;
import gov.va.hmp.vista.rpc.JacksonRpcResponseExtractor;
import gov.va.hmp.vista.rpc.RpcEvent;
import gov.va.hmp.vista.rpc.RpcOperations;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.support.InMemoryRpcLog;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import groovy.util.Node;
import groovy.util.XmlNodePrinter;
import groovy.util.XmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;

@Controller
public class RpcController {
    private RpcOperations rpcTemplate;
    private IVistaAccountDao vistaAccountDao;
    private UserContext userContext;
    private InMemoryRpcLog rpcLog;
    private RpcCommandValidator rpcCommandValidator = new RpcCommandValidator();
    private JacksonRpcResponseExtractor jsonRpcResponseExtractor = new JacksonRpcResponseExtractor();

    @Autowired
    public void setRpcTemplate(RpcOperations rpcTemplate) {
        this.rpcTemplate = rpcTemplate;
    }

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    @Autowired
    public void setRpcLog(InMemoryRpcLog rpcLog) {
        this.rpcLog = rpcLog;
    }

    @RequestMapping(value = "/rpc/", method = RequestMethod.GET)
    public ModelAndView index() {
        RpcCommand rpcCommand = new RpcCommand();
        rpcCommand.setDivision(userContext.getCurrentUser().getDivision());

        Map<String, Object> model = new HashMap<String, Object>();
        ((HashMap<String, Object>) model).put("rpc", rpcCommand);
        ((HashMap<String, Object>) model).put("user", userContext.getCurrentUser());
        ((HashMap<String, Object>) model).put("accounts", vistaAccountDao.findAllByVistaIdIsNotNull());
        return new ModelAndView("/rpc/index", model);
    }

    @RequestMapping(value = "/rpc/execute")
    public ModelAndView execute(RpcCommand rpc, BindingResult errors) {
        rpcCommandValidator.validate(rpc, errors);
        if (errors.hasErrors()) {
            throw new IllegalArgumentException("RPC request is invalid", new BindException(errors));
        }

        try {
            RpcResponse response = null;
            if (rpc.getParams().isEmpty()) {
                response = rpcTemplate.execute(getRpcUrl(rpc));
            } else {
                response = rpcTemplate.execute(getRpcUrl(rpc), getParams(rpc));
            }

            if (rpc.getFormat().equals("xml")) {
                StringWriter stringWriter = new StringWriter();
                Node node = new XmlParser().parseText(response.toString());
                new XmlNodePrinter(new PrintWriter(stringWriter)).print(node);
                return ModelAndViewFactory.stringModelAndView("<?xml version=\"1.0\" encoding=\"utf-8\"?>" + stringWriter.toString(), "application/xml");
            } else if (rpc.getFormat().equals("json")) {
                JsonNode jsonNode = jsonRpcResponseExtractor.extractData(response);
                String result = jsonRpcResponseExtractor.getJsonMapper().writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode);
                return ModelAndViewFactory.stringModelAndView(result, "application/json");
            } else {
                return ModelAndViewFactory.stringModelAndView(response.toString(), "text/plain");
            }
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return ModelAndViewFactory.stringModelAndView(sw.toString(), "text/plain");
        }
    }

    // transform RPC params that have JSON strings as their value into Maps so they are passed to VistA as "multiples"
    private List getParams(RpcCommand rpc) {
        List params = new ArrayList(rpc.getParams().size());
        for (String param : rpc.getParams()) {
           if (param.contains("{")) {
               try {
                   JsonNode json = jsonRpcResponseExtractor.getJsonMapper().readTree(param);
                   Map m = jsonRpcResponseExtractor.getJsonMapper().convertValue(json, Map.class);
                   params.add(m);
               } catch (JsonProcessingException e) {
               } catch (IOException e) {
                   e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
               }
           } else {
               params.add(param);
           }
        }
        return params;
    }

    private String getRpcUrl(final RpcCommand rpc) {
        if (StringUtils.hasText(rpc.getDivision()) && StringUtils.hasText(rpc.getAccessCode()) && StringUtils.hasText(rpc.getVerifyCode())) {
            return "vrpcb://" + rpc.getDivision() + ":" + rpc.getAccessCode() + ";" + rpc.getVerifyCode() + "@" + userContext.getCurrentUser().getVistaId() + "/" + rpc.getContext() + "/" + rpc.getName();
        } else {
            return rpc.getContext() + "/" + rpc.getName();
        }
    }

    @RequestMapping(value = "/rpc/log")
    public ModelAndView log(Pageable pageable, HttpServletRequest request) {
        Page<RpcEvent> rpcPage = createPage(pageable);
        JsonCCollection<RpcEvent> jsonc = JsonCCollection.create(request, rpcPage);
        jsonc.put("enabledForAllUsers", rpcLog.isAllEnabled());
        jsonc.put("enabledForCurrentUser", isRpcLoggingEnabledForCurrentUser());
        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
    }

    private Page<RpcEvent> createPage(final Pageable pageable) {
        final List<RpcEvent> rpcs = rpcLog.isAllEnabled() ? rpcLog.getRpcEvents() : getRpcEventsForCurrentUser();
        if (rpcs.isEmpty()) return new PageImpl<RpcEvent>(rpcs);
        if (rpcs.size() == 1) {
            return new PageImpl(rpcs, pageable, rpcs.size());
        }

        if (pageable.getOffset() > rpcs.size() - 1)
            throw new IllegalArgumentException("Requested start index '" + String.valueOf(pageable.getOffset()) + "' for page is greater than the '" + String.valueOf(rpcs.size()) + "' total items");
        int fromIndex = pageable.getOffset();
        int toIndex = Math.min(pageable.getOffset() + pageable.getPageSize(), rpcs.size() - 1);
        Page<RpcEvent> rpcPage = new PageImpl(rpcs.subList(fromIndex, toIndex), pageable, rpcs.size());
        return rpcPage;
    }

    @RequestMapping(value = "/rpc/log/toggle", method = RequestMethod.POST)
    public ModelAndView toggle(@RequestParam Boolean enable, @RequestParam(required = false) Boolean all, HttpServletRequest request) {
        if (enable) enableRpcEventsForCurrentUser();
        else disableRpcEventsForCurrentUser();

        if (all) rpcLog.enableForAll();
        else rpcLog.disableForAll();

        JsonCResponse<Map> jsonc = JsonCResponse.create(request, Collections.singletonMap("foo", "bar"));
        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/rpc/log/clear", method = RequestMethod.POST)
    public ModelAndView clear(HttpServletRequest request) {
        rpcLog.clear();
        JsonCResponse<Map> jsonc = JsonCResponse.create(request, Collections.singletonMap("foo", "bar"));
        return ModelAndViewFactory.contentNegotiatingModelAndView(jsonc);
    }

    private void enableRpcEventsForCurrentUser() {
        rpcLog.enableFor(userContext.getCurrentUser().getHost(), getCredentialsForCurrentUser());
    }

    private void disableRpcEventsForCurrentUser() {
        rpcLog.disableFor(userContext.getCurrentUser().getHost(), getCredentialsForCurrentUser());
    }

    private List<RpcEvent> getRpcEventsForCurrentUser() {
        return rpcLog.getRpcEvents(userContext.getCurrentUser().getHost(), getCredentialsForCurrentUser());
    }

    private boolean isRpcLoggingEnabledForCurrentUser() {
        return rpcLog.isEnabledFor(userContext.getCurrentUser().getHost(), getCredentialsForCurrentUser());
    }

    private String getCredentialsForCurrentUser() {
        HmpUserDetails user = userContext.getCurrentUser();
        if (user == null) return null;
        return user.getCredentials();
    }
}
