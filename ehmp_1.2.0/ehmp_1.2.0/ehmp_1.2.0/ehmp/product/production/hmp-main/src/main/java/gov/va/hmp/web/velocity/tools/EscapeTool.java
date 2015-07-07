package gov.va.hmp.web.velocity.tools;

import org.springframework.web.util.HtmlUtils;

public class EscapeTool {
    public String html(String s) {
        return HtmlUtils.htmlEscape(s);
    }

    /**
     * Escapes a String to be used as an DOM node 'id' attribute so that it is easily selectable by JQuery.
     * <p/>
     * jQuery has trouble selecting node identifiers that contain characters from css selectors, such as ':', even though
     * they are valid HTML5 'id' values.
     *
     * This attempts to work around the problem by replacing colons with dashes.
     *
     * @param s
     * @return
     *
     * @see "http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/"
     */
    public String jqId(String s) {
        return s.replaceAll("\\:", "-");
    }
}
