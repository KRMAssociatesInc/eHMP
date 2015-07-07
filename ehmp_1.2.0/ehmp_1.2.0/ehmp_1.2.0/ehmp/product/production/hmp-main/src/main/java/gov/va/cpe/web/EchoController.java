package gov.va.cpe.web;

import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class EchoController {
    @RequestMapping("/echo")
    public ModelAndView echo(HttpServletRequest request) {
        return ModelAndViewFactory.contentNegotiatingModelAndView(request.getParameterMap());
    }

}
