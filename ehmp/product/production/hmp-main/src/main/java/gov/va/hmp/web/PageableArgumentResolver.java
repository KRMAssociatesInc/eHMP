package gov.va.hmp.web;

import org.springframework.core.MethodParameter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class PageableArgumentResolver extends org.springframework.data.web.PageableArgumentResolver implements HandlerMethodArgumentResolver {

    public static final int DEFAULT_PAGE_SIZE = 100;

    private static final Pageable DEFAULT_PAGE_REQUEST = new PageRequest(0, DEFAULT_PAGE_SIZE);

    private Set<String> offsetParameters = Collections.unmodifiableSet(new HashSet(Arrays.asList("offset", "startIndex", "start")));
    private Set<String> pageSizeParameters = Collections.unmodifiableSet(new HashSet(Arrays.asList("max", "count", "limit")));

    public PageableArgumentResolver() {
        setPrefix("");
        setFallbackPagable(DEFAULT_PAGE_REQUEST);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        return resolveArgument(parameter, webRequest);
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Pageable.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, NativeWebRequest webRequest) {
        Object o = super.resolveArgument(methodParameter, webRequest);
        if (o != UNRESOLVED && o instanceof Pageable) {
            Pageable pageRequest = (Pageable) o;

            Integer offset = getOffset(webRequest);
            Integer pageSize = getPageSize(webRequest);
            if (pageSize == null) pageSize = pageRequest.getPageSize();
            Integer pageNumber = offset != null ? offset / pageSize : pageRequest.getPageNumber();

            return new PageRequest(pageNumber, pageSize, pageRequest.getSort());
        }
        return o;
    }

    private boolean hasOffsetParameter(NativeWebRequest webRequest) {
        return CollectionUtils.containsAny(webRequest.getParameterMap().keySet(), offsetParameters);
    }

    private boolean hasPageSizeParameter(NativeWebRequest webRequest) {
        return CollectionUtils.containsAny(webRequest.getParameterMap().keySet(), pageSizeParameters);
    }

    private Integer getOffset(NativeWebRequest webRequest) {
        Integer offset = null;
        for (String offsetParamName : offsetParameters) {
            String param = webRequest.getParameter(offsetParamName);
            if (param != null) {
                offset = Integer.parseInt(param);
            }
        }
        return offset;
    }

    private Integer getPageSize(NativeWebRequest webRequest) {
        Integer pageSize = null;
        for (String offsetParamName : pageSizeParameters) {
            String param = webRequest.getParameter(offsetParamName);
            if (param != null) {
                pageSize = Integer.parseInt(param);
            }
        }
        return pageSize;
    }
}
